const fs = require('fs');
module.exports = async ({ github, context }) => {
    const marker = '<!-- ujlp-weekly-maintenance -->';
    function read(file) { try { return JSON.parse(fs.readFileSync(`automation-results/${file}`, 'utf8')); } catch { return null; } }
    const outdated = read('outdated.json'), audit = read('audit.json');
    const runs = await github.rest.actions.listWorkflowRunsForRepo({ ...context.repo, branch: 'main', per_page: 100 });
    const latest = new Map();
    for (const run of runs.data.workflow_runs) if (!latest.has(run.workflow_id)) latest.set(run.workflow_id, run);
    const failures = [...latest.values()].filter(run => ['failure', 'timed_out', 'action_required'].includes(run.conclusion));
    const body = `${marker}\nUpdated ${new Date().toISOString().slice(0, 10)}\n\n` +
        `| Check | Result |\n| --- | --- |\n| Documentation | ${process.env.DOCS_RESULT} |\n| Database permission tests | ${process.env.DATABASE_RESULT} |\n| Broken links | ${process.env.LINKS_RESULT} |\n| Outdated direct dependencies | ${outdated ? Object.keys(outdated).length : 'Report unavailable'} |\n| Dependency vulnerabilities | ${audit?.metadata?.vulnerabilities?.total ?? 'Report unavailable'} |\n\n` +
        (outdated && Object.keys(outdated).length ? `### Dependency updates\n\n${Object.entries(outdated).map(([name, item]) => `- ${name}: ${item.current} → ${item.latest}`).join('\n')}\n\n` : '') +
        `### Latest failing workflows\n\n${failures.map(run => `- [${run.name}](${run.html_url}): ${run.conclusion}`).join('\n') || 'None in the latest 100 main-branch runs.'}\n\n` +
        `[Detailed reports and link failures](${context.serverUrl}/${context.repo.owner}/${context.repo.repo}/actions/runs/${context.runId})\n\nReview findings before changing dependencies or database policies.`;
    const issues = await github.paginate(github.rest.issues.listForRepo, { ...context.repo, state: 'open', creator: 'github-actions[bot]', per_page: 100 });
    const existing = issues.find(issue => issue.body?.includes(marker));
    if (existing) await github.rest.issues.update({ ...context.repo, issue_number: existing.number, body });
    else await github.rest.issues.create({ ...context.repo, title: 'Weekly repository maintenance', body });
};
