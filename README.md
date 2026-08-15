# Undergraduate Journal of Law & Politics

> **Ideas that move the world.**

[![CI](https://github.com/RobBundy2002/UJLP/actions/workflows/ci.yml/badge.svg)](https://github.com/RobBundy2002/UJLP/actions/workflows/ci.yml)
[![Build and Deploy UJLP](https://github.com/RobBundy2002/UJLP/actions/workflows/deploy.yml/badge.svg)](https://github.com/RobBundy2002/UJLP/actions/workflows/deploy.yml)
[![Website](https://img.shields.io/badge/website-ujlawandpolitics.org-0a1728)](https://ujlawandpolitics.org/)

The Undergraduate Journal of Law & Politics (UJLP) is a University of Virginia publication dedicated to serious inquiry, open horizons, and the next generation of legal and political thinkers.

We create space for undergraduate writers to ask difficult questions, follow evidence wherever it leads, and connect legal doctrine to the larger worlds of history, philosophy, economics, public policy, and human experience. The result is scholarship that is rigorous without being narrow—and a community that believes thoughtful disagreement is part of the work.

**[Explore the journal](https://ujlawandpolitics.org/#/journal)** · **[Join the team](https://ujlawandpolitics.org/#/jointheteam)** · **[Follow us on Instagram](https://www.instagram.com/ujlawandpoliticsatuva/)**

---

## Our purpose

UJLP expands opportunities for undergraduate legal research and writing at the University of Virginia. We publish long-form articles, cultivate editorial craft, and bring students together around the questions that shape institutions and public life.

Our work is grounded in a few simple convictions:

- Curiosity should be taken seriously.
- Strong arguments begin with careful research.
- Law is inseparable from politics, history, culture, and lived experience.
- Undergraduate scholarship deserves a real audience.
- Good editing is collaboration, not gatekeeping.

## What we publish

Our journal explores the intersection of law and politics across a growing range of subjects, including:

**Civil rights and constitutional law** · **Education law** · **Public policy** · **Legal history** · **Political theory** · **Criminal law** · **Economics and institutions**

Recent work includes Derek Tsai’s *Unequal Opportunity: Desegregation at the University of Virginia School of Law, 1950–1960* and Shelby Eliasek’s *Schoolhouse Secrets: Parental Rights and Gender Identity Disclosure in the American Classroom*.

Read the latest work in the [journal](https://ujlawandpolitics.org/#/journal), browse the [archives](https://ujlawandpolitics.org/#/archives), or visit an author’s profile to learn more about the research behind each piece.

## A student-led editorial community

UJLP is built by students who care about both ideas and the craft required to communicate them well. Writers develop original research and arguments. Editors test claims, sharpen structure, verify authorities, and help each piece reach its fullest form. Our leadership team supports the editorial process, organizes the Journal’s operations, and creates opportunities for members to learn from one another.

The Journal is a place to publish, but it is also a place to practice: close reading, source evaluation, citation, persuasive writing, constructive criticism, project management, and intellectual generosity.

## Find your place in the conversation

Whether you are developing your first research question, polishing a draft, looking for an editorial community, or simply interested in the ideas our members are pursuing, there is a place for you here.

**[Meet the team](https://ujlawandpolitics.org/#/about)** · **[Submit your work or apply](https://ujlawandpolitics.org/#/jointheteam)** · **[Contact UJLP](mailto:ujlawandpolitics@gmail.com)**

## Visit the publication

The live journal is available at **[ujlawandpolitics.org](https://ujlawandpolitics.org/)**.

You can also find UJLP on [Instagram](https://www.instagram.com/ujlawandpoliticsatuva/) and [LinkedIn](https://www.linkedin.com/company/undergraduate-journal-of-law-politics/).

---

## For contributors

This repository contains the React application that powers the UJLP website. The site includes the journal, article pages, author profiles, announcements, team information, and contact pages.

### Technology

| Area | Stack |
| --- | --- |
| Frontend | React 18 |
| Routing | React Router |
| Build tooling | Create React App / react-scripts |
| Deployment | GitHub Pages |
| CI/CD | GitHub Actions |
| Content | Structured JavaScript metadata and static PDFs |
| Domain | ujlawandpolitics.org |

### Architecture

```text
src/Data/journalData.js
        |
        |-- issues
        |-- authors
        |-- articles
        |-- research areas
        |
        v
     React UI
   /    |     \
Journal Search Article pages
                 |
                 v
            PDF assets
```

### Run locally

```bash
npm install
npm start
```

The development server runs at `http://localhost:3000`.

### Validate and build

```bash
npm run validate
npm test -- --watchAll=false
npm run build
```

`npm run validate` checks the journal metadata, article routes, author routes, research-area references, and PDF asset references before production builds run.

### Deployment

Production deploys are handled by GitHub Actions, not by a local `gh-pages` publish command.

Every push to `main` runs:

```text
npm ci
npm run validate
npm test -- --watchAll=false
npm run build
GitHub Pages artifact upload
GitHub Pages deployment
```

Direct pushes to `main` run the standalone CI checks and the production deployment workflow. Pull requests to `main` run validation, test, and build checks without deploying.

GitHub Pages should be configured in the repository settings to use **GitHub Actions** as the Pages source. The custom domain is stored in `public/CNAME`, so Create React App copies it into `build/CNAME` during production builds and the Pages artifact includes it automatically.

### Project notes

- `src/Data/journalData.js` contains shared issue, article, and research-area metadata.
- `src/ArticlePages/` contains full article views and PDF readers.
- `src/GeneralPages/` contains the primary public-facing pages.
- `src/Components/` contains reusable navigation, search, journal, and editorial components.
- `src/Styling/` contains the site’s visual system and responsive layouts.
- `scripts/validate-content.js` guards against broken journal metadata and missing PDF assets.

### Repository maintenance

- Dependency update PRs are managed monthly by Dependabot.
- The `main` branch is intended to be the source of truth for production.
- Generated dependencies, local IDE files, and production build output are ignored by Git.

## Contact

For submissions, partnerships, questions, or general correspondence:

**ujlawandpolitics@gmail.com**

---

© 2026 Undergraduate Journal of Law & Politics at the University of Virginia. All rights reserved.

Website designed by [Rob Bundy](https://www.linkedin.com/in/rob-bundy-192035223/).
