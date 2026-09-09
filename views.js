export const escapeHTML = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ],
  );
export function localized(value, language = "en") {
  return typeof value === "string" ? value : (value[language] ?? value.en);
}
function diagram(type, language) {
  const labels = {
    en: {
      agents: ["Knowledge", "Agent", "Tools"],
      chart: ["Chart", "Vision + LLM", "Insight"],
      forecast: ["History", "ML model", "Forecast"],
      documents: ["Sources", "Index", "Search"],
      topics: ["Text", "Embeddings", "Topics"],
    },
    fr: {
      agents: ["Savoirs", "Agent", "Outils"],
      chart: ["Graphique", "Vision + LLM", "Analyse"],
      forecast: ["Historique", "Modèle ML", "Prévision"],
      documents: ["Sources", "Index", "Recherche"],
      topics: ["Textes", "Embeddings", "Thèmes"],
    },
  }[language][type];
  return `<svg viewBox="0 0 340 125" fill="none" aria-hidden="true"><path d="M73 61H132M209 61H267" stroke="currentColor" stroke-width="1.5"/><path d="m123 57 8 4-8 4m135-8 8 4-8 4" stroke="currentColor"/><rect class="surface" x="20" y="36" width="54" height="50" rx="3" stroke="currentColor"/><rect class="surface" x="133" y="21" width="76" height="80" rx="3" stroke="currentColor"/><rect class="surface" x="267" y="36" width="54" height="50" rx="3" stroke="currentColor"/><path class="signal" d="M32 50h30m-30 11h24m-24 11h30M148 40h46v42h-46zM279 61l9 9 22-24" stroke-width="2"/><path d="M159 32v-8m12 8v-8m12 8v-8M159 91v7m12-7v7m12-7v7" stroke="currentColor"/><circle class="signal" cx="171" cy="61" r="9" stroke-width="2"/><g fill="currentColor" font-family="monospace" font-size="12" text-anchor="middle"><text x="47" y="119">${labels[0]}</text><text x="171" y="119">${labels[1]}</text><text x="294" y="119">${labels[2]}</text></g></svg>`;
}
export function projectCard(project, index, language, copy) {
  const t = (v) => escapeHTML(localized(v, language));
  return `<article class="work-card" data-kind="${project.kind}" id="work-${project.id}"><div class="work-visual"><span class="work-code">${String(index + 1).padStart(2, "0")}${project.year ? " / " + escapeHTML(project.year) : ""}</span><span class="work-category">${escapeHTML(project.kind === "enterprise" ? copy.enterprise : copy.project)}</span>${diagram(project.diagram, language)}</div><div class="work-content"><h3>${t(project.title)}</h3><p>${t(project.summary)}</p><div class="tech-tags">${project.tech
    .slice(0, 4)
    .map((tag) => `<span>${escapeHTML(tag)}</span>`)
    .join(
      "",
    )}</div><button type="button" data-project="${project.id}" aria-label="${escapeHTML(copy.caseStudy)}: ${t(project.title)}"><span>${escapeHTML(copy.caseStudy)}</span><span aria-hidden="true">↗</span></button></div></article>`;
}
export function projectDetails(project, language, copy) {
  const t = (v) => escapeHTML(localized(v, language));
  return `<h2 id="dialog-title">${t(project.title)}</h2><p>${t(project.context)}</p><h3>${escapeHTML(copy.contribution)}</h3><ul>${project.details.map((item) => `<li>${t(item)}</li>`).join("")}</ul><h3>${escapeHTML(copy.stack)}</h3><div class="tech-tags">${project.tech.map((tag) => `<span>${escapeHTML(tag)}</span>`).join("")}</div><p class="dialog-note">${escapeHTML(project.kind === "enterprise" ? copy.privateNote : copy.codeNote)}</p><div class="dialog-links">${project.kind === "project" ? `<a href="https://github.com/Mohamedballouch" target="_blank" rel="noopener noreferrer">${escapeHTML(copy.profileLink)}</a>` : ""}<a href="mailto:ballouch.mo@gmail.com?subject=${encodeURIComponent("Portfolio — " + localized(project.title, "en"))}">${escapeHTML(copy.contactLink)}</a></div>`;
}
