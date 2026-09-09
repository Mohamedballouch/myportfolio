import { projects, experience, publications } from "./content.js";
import { escapeHTML as esc, localized } from "./views.js";
import { desktopCopy } from "./computer-copy.js";
import { DIRECTORY_SIZE } from "./computer-state.js";

export const featuredDisks = ["agents", "insurance-rag", "chart"];
export function desktopWindow(state, language = "en") {
  const lang = language === "fr" ? "fr" : "en",
    ui = desktopCopy[lang];
  const t = (value) => esc(localized(value, lang));
  const heading = (value) =>
    `<h2 id="os-window-heading" tabindex="-1">${esc(value).replaceAll("\n", "<br>")}</h2>`;
  const project = projects.find((p) => p.id === state.view);
  const label = (value) => `<span class="bos-small">${esc(value)}</span>`;
  if (project)
    return {
      title: `${project.id}.app`,
      html: `${label(localized(project.context, lang))}${heading(localized(project.title, lang))}
      <div class="bos-case-tabs" role="group" aria-label="${esc(ui.fullCase)}">
        ${["overview", "toolkit"].map((tab) => `<button type="button" data-os-tab="${tab}" aria-pressed="${state.tab === tab}">${esc(ui[tab])}</button>`).join("")}
      </div>
      ${state.tab === "toolkit" ? `<p>${project.tech.map(esc).join(" · ")}</p>` : `<p>${t(project.summary)}</p>`}
      <div class="bos-case-actions"><button type="button" class="bos-screen-button" data-project="${esc(project.id)}">${esc(ui.fullCase)}</button>
      <button type="button" class="bos-screen-link bos-back" data-open="work">${esc(ui.allDisks)}</button></div>`,
    };
  if (state.view === "work") {
    const pages = Math.ceil(projects.length / DIRECTORY_SIZE);
    const page = Math.max(0, Math.min(pages - 1, state.page));
    return {
      title: "work / directory",
      html: `${label(ui.selected + " · " + projects.length + " " + ui.projects)}${heading(ui.workTitle)}
      <div class="bos-list">${projects
        .slice(page * DIRECTORY_SIZE, (page + 1) * DIRECTORY_SIZE)
        .map(
          (p) =>
            `<button type="button" data-os-project="${esc(p.id)}"><span>${t(p.title)}<small>${t(p.context)}</small></span><span aria-hidden="true">↗</span></button>`,
        )
        .join("")}</div>
      <div class="bos-pagination"><button type="button" data-os-page="${page - 1}" ${page === 0 ? "disabled" : ""}>${esc(ui.previous)}</button><span>${esc(ui.page)} ${page + 1} ${esc(ui.of)} ${pages}</span><button type="button" data-os-page="${page + 1}" ${page === pages - 1 ? "disabled" : ""}>${esc(ui.next)}</button></div>`,
    };
  }
  if (state.view === "about")
    return {
      title: "about.txt",
      html: `${label(ui.aboutLabel)}${heading(ui.aboutTitle)}<p>${esc(ui.aboutIntro)}</p><p class="bos-small">${experience.map((job) => esc(job.company)).join(" · ")}</p><a class="bos-screen-button" href="#experience">${esc(ui.fullExperience)}</a>`,
    };
  if (state.view === "research")
    return {
      title: "research / notes",
      html: `${label(ui.researchLabel)}${heading(ui.researchTitle)}<p>${esc(ui.researchIntro)}</p><div class="bos-papers">${publications.map((paper, i) => `<a class="bos-screen-link" href="${esc(paper.url)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(paper.title)}">[${i + 1}] ${esc(paper.year)} ↗</a>`).join(" ")}</div><a class="bos-screen-button" href="#research">${esc(ui.fullResearch)}</a>`,
    };
  if (state.view === "contact")
    return {
      title: "contact.txt",
      html: `${label(ui.contactLabel)}${heading(ui.contactTitle)}<p><a class="bos-screen-link" href="mailto:ballouch.mo@gmail.com">ballouch.mo@gmail.com</a></p><p><a class="bos-screen-link" href="https://linkedin.com/in/mohamed-ballouch" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a> · <a class="bos-screen-link" href="https://github.com/Mohamedballouch" target="_blank" rel="noopener noreferrer">GitHub ↗</a></p>`,
    };
  return {
    title: "hello.txt",
    html: `${label(ui.hello)}${heading(ui.welcome)}<p>${esc(ui.intro)}</p><button type="button" class="bos-screen-button" data-open="work">${esc(ui.openWork)}</button>`,
  };
}
