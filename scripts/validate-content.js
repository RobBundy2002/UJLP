const fs = require('fs');
const path = require('path');
const vm = require('vm');

const rootDir = path.resolve(__dirname, '..');
const sourcePath = path.join(rootDir, 'src', 'Data', 'journalData.js');
const appPath = path.join(rootDir, 'src', 'App.js');
const articlePagesDir = path.join(rootDir, 'src', 'ArticlePages');

function read(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function loadJournalData() {
  const source = read(sourcePath)
    .replace(/export const\s+(\w+)\s*=/g, 'const $1 =')
    .concat('\nresult = { issues, articles, researchAreas };');
  const sandbox = { result: null };

  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: sourcePath });

  return sandbox.result;
}

function extractAppRoutes() {
  const appSource = read(appPath);
  const routes = new Set();
  const routePattern = /<Route\s+path="([^"]+)"/g;
  let match;

  while ((match = routePattern.exec(appSource)) !== null) {
    routes.add(match[1]);
  }

  return routes;
}

function extractPdfPaths() {
  const pdfPaths = new Set();
  const files = fs.readdirSync(articlePagesDir).filter(file => file.endsWith('.js'));

  files.forEach(file => {
    const source = read(path.join(articlePagesDir, file));
    const pdfPattern = /(?:pdfPath|href)=["{']+([^"'}]+\.pdf)/g;
    let match;

    while ((match = pdfPattern.exec(source)) !== null) {
      pdfPaths.add(decodeURIComponent(match[1]));
    }
  });

  return [...pdfPaths];
}

function fail(message) {
  errors.push(message);
}

const errors = [];
const { issues, articles, researchAreas } = loadJournalData();
const appRoutes = extractAppRoutes();
const pdfPaths = extractPdfPaths();

const issueIds = new Set(issues.map(issue => issue.id));
const articleRoutes = new Set();
const articleNumbersByIssue = new Map();

if (!issueIds.has('all')) {
  fail('issues must include the all filter option.');
}

issues
  .filter(issue => issue.id !== 'all')
  .forEach(issue => {
    ['id', 'label', 'publicationDate', 'accent', 'tone'].forEach(field => {
      if (!issue[field]) fail(`Issue ${issue.id || '(missing id)'} is missing ${field}.`);
    });
  });

articles.forEach(article => {
  ['title', 'author', 'authorLink', 'category', 'researchSlug', 'date', 'issue', 'articleNumber', 'pageRange', 'excerpt', 'pageLink'].forEach(field => {
    if (!article[field]) fail(`Article ${article.title || '(missing title)'} is missing ${field}.`);
  });

  if (!issueIds.has(article.issue)) {
    fail(`Article "${article.title}" references unknown issue "${article.issue}".`);
  }

  if (!researchAreas[article.researchSlug]) {
    fail(`Article "${article.title}" references unknown research area "${article.researchSlug}".`);
  }

  if (!appRoutes.has(article.pageLink)) {
    fail(`Article "${article.title}" pageLink "${article.pageLink}" is not registered in App.js routes.`);
  }

  if (!appRoutes.has(article.authorLink)) {
    fail(`Article "${article.title}" authorLink "${article.authorLink}" is not registered in App.js routes.`);
  }

  if (articleRoutes.has(article.pageLink)) {
    fail(`Duplicate article pageLink "${article.pageLink}".`);
  }
  articleRoutes.add(article.pageLink);

  const issueKey = `${article.issue}:${article.articleNumber}`;
  if (articleNumbersByIssue.has(issueKey)) {
    fail(`Duplicate articleNumber ${article.articleNumber} in issue ${article.issue}.`);
  }
  articleNumbersByIssue.set(issueKey, article.title);
});

Object.entries(researchAreas).forEach(([slug, area]) => {
  ['name', 'kicker', 'statement'].forEach(field => {
    if (!area[field]) fail(`Research area "${slug}" is missing ${field}.`);
  });

  if (!Array.isArray(area.relatedTopics) || area.relatedTopics.length === 0) {
    fail(`Research area "${slug}" must include relatedTopics.`);
  }
});

pdfPaths.forEach(pdfPath => {
  const publicPath = path.join(rootDir, 'public', pdfPath.replace(/^\//, ''));
  if (!fs.existsSync(publicPath)) {
    fail(`Missing PDF asset: public/${pdfPath.replace(/^\//, '')}`);
  }
});

if (errors.length > 0) {
  console.error('Content validation failed:');
  errors.forEach(error => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Content validation passed: ${articles.length} articles, ${issues.length - 1} issue, ${pdfPaths.length} PDF references.`);
