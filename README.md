# Mohamed Ballouch — Ballouch OS

A portfolio inside a vintage personal computer. The CRT desktop, project disks, keyboard and boot sequence connect to Mohamed’s real enterprise work, projects and research.

## The experience

- Three featured floppy disks animate into the drive and open a project window.
- The Work directory contains all eight projects, with four entries per page. Overview and Toolkit views lead to complete case studies.
- Desktop apps and physical keyboard keys open Work, About, Research and Contact.
- Reboot replays a short, skippable sequence. The desktop is immediately usable on first visit.
- Expand screen provides a larger reading surface; narrow screens reflow the desktop and disk collection.
- English/French and light/dark preferences persist locally. Language changes preserve the selected project, tab and directory page.
- Reduced motion bypasses disk and boot animations. Navigation cancels pending animation callbacks; boot controls and case-study dialogs preserve keyboard focus.
- The page below the computer retains all projects, employers, skills, publications, education and certifications. Contact uses real email, LinkedIn and GitHub links.

The computer is an interface metaphor. There are no AI inference calls, document uploads, or fabricated form submissions. Its interface uses HTML/CSS and finite browser animations; no 3D runtime is shipped.

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

Vite generates the production site in `dist/`. Relative asset URLs support both the custom domain and a GitHub Pages repository subpath. `public/CNAME` preserves the existing custom domain in the build.

## Maintain the portfolio

| File                         | Purpose                                                                          |
| ---------------------------- | -------------------------------------------------------------------------------- |
| `content.js`                 | Canonical bilingual projects, experience, skills, education and publication URLs |
| `translations.js`            | General portfolio interface copy                                                 |
| `computer-copy.js`           | Bilingual desktop labels and featured disk text                                  |
| `computer-views.js`          | Desktop windows and the directory, using the canonical content                   |
| `computer-state.js`          | Navigation, pagination and cancellation of outdated animation completions        |
| `computer.js`                | Disk insertion, boot, focus, localization and lifecycle cleanup                  |
| `script.js`                  | Page content, filters, dialogs and preferences                                   |
| `views.js`                   | Escaped project-card and case-study rendering                                    |
| `index.html`                 | Page structure and computer controls                                             |
| `styles.css`, `computer.css` | Responsive portfolio and computer styling                                        |
| `tests/portfolio.test.mjs`   | Content, localization, navigation, cancellation and link checks                  |

Professional content comes from the supplied CV (updated April 2026) and the original portfolio. Maintain translated records in `content.js`; the desktop directory and page cards use those same records. The three featured disk IDs are listed in `computer-views.js`.

The supplied sources link projects to the GitHub profile. Actions are explicitly labeled **GitHub profile** rather than inventing project-specific repositories or live demos. Enterprise work does not expose client code. The original CV, personal phone number and neighborhood are not committed. Paper and certification titles retain their official wording. Keep the PhD qualification as **Candidate** until completion is confirmed.

## GitHub workflow

`Validate portfolio` runs tests and builds every pushed branch and pull request, then uploads `dist/` as `portfolio-static-site`. Pushing a branch does not publish the live portfolio.

To publish after review:

1. Merge the redesign into `main`.
2. Set **Settings → Pages → Source** to **GitHub Actions**.
3. Run **Publish portfolio to GitHub Pages** from Actions on `main`.

The publishing workflow is manual and restricted to `main`. Custom-domain DNS settings remain separate.

## Validation

Checks cover all eight project IDs in the directory, bilingual interface completeness, full case-study rendering, content escaping, DOI links, local anchors, pagination bounds, stale animation cancellation, and preservation of desktop state across localization. Browser visual testing is separate from these automated checks.
