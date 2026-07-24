# Undergraduate Journal of Law & Politics

> **Ideas that move the world.**

The Undergraduate Journal of Law & Politics (UJLP) is a University of Virginia publication dedicated to serious inquiry, open horizons, and the next generation of legal and political thinkers.

We create space for undergraduate writers to ask difficult questions, follow evidence wherever it leads, and connect legal doctrine to the larger worlds of history, philosophy, economics, public policy, and human experience. The result is scholarship that is rigorous without being narrow—and a community that believes thoughtful disagreement is part of the work.

**[Explore the journal](https://ujlp.org/#/journal)** · **[Join the team](https://ujlp.org/#/jointheteam)** · **[Follow us on Instagram](https://www.instagram.com/ujlawandpoliticsatuva/)**

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

Read the latest work in the [journal](https://ujlp.org/#/journal), browse the [archives](https://ujlp.org/#/archives), or visit an author’s profile to learn more about the research behind each piece.

## A student-led editorial community

UJLP is built by students who care about both ideas and the craft required to communicate them well. Writers develop original research and arguments. Editors test claims, sharpen structure, verify authorities, and help each piece reach its fullest form. Our leadership team supports the editorial process, organizes the Journal’s operations, and creates opportunities for members to learn from one another.

The Journal is a place to publish, but it is also a place to practice: close reading, source evaluation, citation, persuasive writing, constructive criticism, project management, and intellectual generosity.

## Find your place in the conversation

Whether you are developing your first research question, polishing a draft, looking for an editorial community, or simply interested in the ideas our members are pursuing, there is a place for you here.

**[Meet the team](https://ujlp.org/#/about)** · **[Submit your work or apply](https://ujlp.org/#/jointheteam)** · **[Contact UJLP](mailto:ujlawandpolitics@gmail.com)**

## Visit the publication

The live journal is available at **[ujlp.org](https://ujlp.org/)**.

You can also find UJLP on [Instagram](https://www.instagram.com/ujlawandpoliticsatuva/) and [LinkedIn](https://www.linkedin.com/company/undergraduate-journal-of-law-politics/).

---

## For contributors

This repository contains the React application that powers the UJLP website. The site includes the journal, article pages, author profiles, announcements, team information, and contact pages.

### Run locally

```bash
npm install
npm start
```

The development server runs at `http://localhost:3000`.

### Build and deploy

```bash
npm run build
npm run deploy
```

`npm run deploy` builds the production application and publishes the `build/` directory to the `gh-pages` branch. Article PDFs and other static assets live in `public/`.

### Project notes

- `src/Data/journalData.js` contains shared issue, article, and research-area metadata.
- `src/ArticlePages/` contains full article views and PDF readers.
- `src/GeneralPages/` contains the primary public-facing pages.
- `src/Components/` contains reusable navigation, search, journal, and editorial components.
- `src/Styling/` contains the site’s visual system and responsive layouts.

## Contact

For submissions, partnerships, questions, or general correspondence:

**ujlawandpolitics@gmail.com**

---

© 2026 Undergraduate Journal of Law & Politics at the University of Virginia. All rights reserved.

Website designed by [Rob Bundy](https://www.linkedin.com/in/rob-bundy-192035223/).
