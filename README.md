# Mohamed Ballouch — The AI Factory

An interactive portfolio connecting an isometric AI factory to Mohamed’s real enterprise work, independent projects, and research.

## Experience

- Four concrete jobs: read and split documents, index passages, find evidence and draft, check and deliver.
- A document scanner, searchable shelves, an assistant workbench with search/form/writing tools, and a review clipboard replace abstract technology labels.
- Two clearly separated flows: documents prepare the library; a question starts a search back to that library before evidence returns to the assistant.
- Scripted procurement and insurance-document scenarios are inspired by real work. Each displays a fictional source excerpt and a cited answer. The procurement example flags missing purpose and cost instead of inventing values.
- Click a 3D tool or its accessible button to inspect the action. The execution trace, evidence, checks, and word-by-word response stay synchronized with playback and scrubbing.
- Drag to rotate, zoom controls, expanded machinery, pause/resume, speed control, and timeline scrubbing.
- Related case studies at each station, plus a filterable eight-project collection.
- Four employers, three publications, education, certifications, and technical skills.
- English/French and light/dark preferences; keyboard-accessible project dialogs.
- Reduced-motion mode advances through discrete stages. Rendering stops while the factory is off-screen or the page is hidden.
- Contact uses real email and LinkedIn links. No simulated form delivery.

Pipeline playback is illustrative. It does not upload documents, run an AI model, or make inference requests. The factory loads as a separate Three.js bundle; the portfolio remains usable if WebGL is unavailable.

## Develop

Use Node.js 22.12+ and npm:

```sh
npm ci
npm run dev
```

```sh
npm test
npm run build
npm run preview
```

The production site is generated in `dist/`. Relative asset URLs support both the existing custom domain and a GitHub Pages repository subpath. The existing `CNAME` is also included in the build through `public/CNAME`.

## Content and structure

| File                        | Purpose                                                                  |
| --------------------------- | ------------------------------------------------------------------------ |
| `index.html`                | Semantic page structure and accessible factory controls                  |
| `content.js`                | Bilingual projects, experience, skills, education and publication URLs   |
| `translations.js`           | English/French interface and factory copy                                |
| `script.js`                 | Portfolio filters, dialogs, language and theme preferences               |
| `views.js`                  | Escaped content rendering and station-to-project mapping                 |
| `factory.js`                | Three.js scene, machinery, camera, interactions and cleanup              |
| `factory-ai.js`             | Document scanner, searchable shelves, query/evidence routes and review   |
| `missions.js`               | Bilingual scripted missions, tool descriptions, and deterministic output |
| `factory-state.js`          | Playback and reduced-motion transitions                                  |
| `styles.css`, `factory.css` | Responsive styling                                                       |
| `tests/portfolio.test.mjs`  | Playback, content, localization, link and escaping checks                |

Professional content comes from the supplied CV (updated April 2026) and the original portfolio. The supplied sources link projects to the GitHub profile, so project actions are explicitly labeled **GitHub profile**. No project-specific repository or live-demo URLs are invented. Enterprise work is described without exposing client code. The original CV, personal phone number and neighborhood are not included in the repository.

Update the objects in `content.js` to maintain case studies. Use both `en` and `fr` for translated text. Paper titles and certification names retain their official wording. Keep the PhD qualification as **Candidate** until completion is confirmed.

## GitHub workflow

`Validate portfolio` runs tests and builds every pushed branch and pull request. It uploads the production output as `portfolio-static-site` for review. A branch push does not change the live portfolio.

When ready to publish:

1. Review and merge the redesign into `main`.
2. Set **Settings → Pages → Source** to **GitHub Actions**. The old “deploy from a branch” setting does not run Vite.
3. Run **Publish portfolio to GitHub Pages** from Actions on `main`.

The publishing workflow is manual and restricted to `main`. It runs tests/build before uploading `dist/`; custom-domain DNS settings remain separate.

## Validation

Automated checks cover playback, pausing, speed, scrubbing, reduced motion, independent station selection, question/search/review ordering, reversible response streaming, 3D connection endpoints in expanded view, all sourced work, bilingual completeness, output escaping, and local navigation targets. Run them before building. This branch has not been merged or deployed automatically.
