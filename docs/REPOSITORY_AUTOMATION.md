# Repository automation

All workflows are prepared locally. They start running after these files reach GitHub; no repository settings are changed by these files.

| Automation | Trigger | Output |
| --- | --- | --- |
| Generated repository reference | PR and main checks | Fails if commands, environment names, routes, or content counts changed without regenerating docs |
| Visual review | PR | Before, after, and pixel-diff PNGs plus a workflow summary |
| Database permissions | PR, main, and before deployment | Temporary Postgres-compatible database; migration reruns, RLS, reviews, drafts, and attachment access tests |
| Deployed site health | Successful deployment, daily, or manual | Real-domain navigation, rendered content, recap availability, and PDF signature checks |
| Broken links | Weekly or manual maintenance | Markdown report of failing links |
| Release notes | Main changes | Reviewable changelog/version PR; release created only after merging that PR |
| Visual history | Main changes | Dated screenshots and provenance manifest in a 90-day workflow artifact |
| Secrets | PR and main | Redacted Gitleaks findings; no production credentials required |
| Accessibility | PR and main | Axe WCAG findings on desktop/mobile public pages and a keyboard-focus check |
| Maintenance | Weekly or manual | One bot-owned issue updated with dependency, audit, docs, SQL, links, and workflow results |

## Local commands

Run `npm run docs:generate` after updating scripts, routes, browser configuration, or content. Commit the generated `docs/REPOSITORY_REFERENCE.md` with the source change. `npm run docs:check` verifies it without modifying files.

Run `npm run build` before browser checks, then `npm run test:accessibility`. `npm run test:database` needs no database service or Supabase credentials. `npm run test:live` visits the real public site without writing data; `SITE_URL` can target a staging site.

For visual comparison, run `node scripts/automation/visual.cjs capture automation-results/before`, rebuild after your edits, capture to `automation-results/after`, then run `node scripts/automation/visual.cjs compare automation-results/after automation-results/before`. In PRs, the base commit is the comparison baseline; merging an approved PR establishes the next baseline. Pixel differences are review evidence, not an automatic pass/fail judgment.

## GitHub setup and limits

- Enable Issues and allow GitHub Actions to create pull requests for maintenance and release notes. Review branch protections and make the database/browser/secrets checks required if desired; workflows cannot enforce those settings themselves.
- Release Please uses Conventional Commits (`feat:`, `fix:`, `docs:`). Its default `GITHUB_TOKEN` cannot trigger CI on its own generated PRs. A maintainer can push an amendment to trigger checks, or configure a dedicated GitHub App token if automatic triggering is wanted. This setup adds no new credential.
- Release notes do not publish npm packages. Screenshots are archived on main changes independently, because releases created with `GITHUB_TOKEN` do not trigger other workflows. Download artifacts before their 90-day expiry for permanent history; dated repository snapshots remain available separately.
- Database tests exercise the two community migrations against modeled existing auth/profile/storage prerequisites. They do not apply production migrations or prove the legacy Supabase schema matches the model. New migrations must be added explicitly to the runner, with permission assertions.
- Accessibility scans cover public states, including the signed-out profile entry point. The community browser tests also scan synthetic member/admin profile and recap forms with Axe. Automated scans and a basic focus check do not replace a manual screen-reader/keyboard review.
- Link checks can fail because sites block automated requests. Review failures before excluding a URL; private backend URLs are excluded. Dynamic links require browser tests.
- Site smoke checks report failure but never automatically roll back or change production. GitHub Pages deep links may initially return its 404 redirect shell; checks require successful recovery to the intended route and rendered content.
- The deprecated React Scripts dependency tree has been replaced by Vite and Vitest. Maintenance reports new dependency advisories; it does not automatically upgrade or merge changes. Run `npm audit` to check current findings.
- Workflow artifacts and summaries provide screenshot review without granting PR jobs write permissions. Fork PRs never receive production secrets.
