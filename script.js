import "./computer.js";
import { copy } from "./translations.js";
import {
  projects,
  experience,
  skills,
  publications,
  education,
  certifications,
} from "./content.js";
import {
  escapeHTML as esc,
  localized,
  projectCard,
  projectDetails,
} from "./views.js";

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const readPreference = (key) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};
const savePreference = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* Preferences are optional. */
  }
};
let language =
  (readPreference("language") || readPreference("portfolio-language")) === "fr"
    ? "fr"
    : "en";
let theme = readPreference("theme");
if (!["dark", "light"].includes(theme))
  theme = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
let filter = "all",
  selectedProject = null,
  projectTrigger = null;
const dialog = $("#project-dialog");
const t = (value) => localized(value, language);
const text = (value) => esc(t(value));

function applyFilter() {
  $$(".work-card").forEach(
    (card) => (card.hidden = filter !== "all" && card.dataset.kind !== filter),
  );
  $$("[data-filter]").forEach((button) =>
    button.setAttribute(
      "aria-pressed",
      String(button.dataset.filter === filter),
    ),
  );
}
function render() {
  document.documentElement.lang = language;
  const ui = copy[language];
  $$("[data-copy]").forEach((el) => {
    if (ui[el.dataset.copy]) el.textContent = ui[el.dataset.copy];
  });
  $("#language-toggle").textContent = language === "en" ? "FR" : "EN";
  $("#language-toggle").setAttribute(
    "aria-label",
    language === "en" ? "Switch to French" : "Passer en anglais",
  );
  $(".work-filter").setAttribute(
    "aria-label",
    language === "fr" ? "Filtrer les réalisations" : "Filter work",
  );
  $(".site-header nav").setAttribute(
    "aria-label",
    language === "fr" ? "Navigation principale" : "Main navigation",
  );
  document.querySelector('meta[name="description"]').content = ui.meta;
  document.querySelector('meta[property="og:description"]').content = ui.meta;
  document.title =
    language === "fr"
      ? "Mohamed Ballouch — Ballouch OS"
      : "Mohamed Ballouch — Ballouch OS";
  document.querySelector('meta[property="og:title"]').content = document.title;
  $("#work-grid").innerHTML = projects
    .map((p, i) => projectCard(p, i, language, ui))
    .join("");
  applyFilter();
  const openJobs = new Set(
    [...$("#career").querySelectorAll("details[open]")].map(
      (el) => el.dataset.company,
    ),
  );
  $("#career").innerHTML = experience
    .map(
      (job, i) =>
        `<details data-company="${esc(job.company)}" ${openJobs.has(job.company) || (!openJobs.size && i === 0) ? "open" : ""}><summary><div><span class="career-date">${text(job.dates)} · ${text(job.location)}</span><h3>${esc(job.company)}</h3><p class="role">${text(job.role)}</p></div></summary><ul>${job.bullets.map((b) => `<li>${text(b)}</li>`).join("")}</ul></details>`,
    )
    .join("");
  $("#skill-groups").innerHTML = skills
    .map(
      (group) =>
        `<div class="skill-group"><h3>${text(group.title)}</h3><p>${group.items.map(esc).join(" · ")}</p></div>`,
    )
    .join("");
  $("#papers").innerHTML = publications
    .map(
      (p) =>
        `<a href="${esc(p.url)}" target="_blank" rel="noopener noreferrer"><span class="paper-year">${esc(p.year)}</span><div><h3>${esc(p.title)}</h3><p>${esc(p.venue)}</p></div><span class="paper-arrow" aria-hidden="true">↗</span></a>`,
    )
    .join("");
  $("#education").innerHTML = education
    .map(
      (item) =>
        `<div class="credential"><h4>${text(item.title)}</h4><p>${esc(item.school)} · ${esc(item.dates)}</p></div>`,
    )
    .join("");
  $("#certifications").innerHTML =
    `<ul class="certification-list">${certifications.map((c) => `<li>${esc(c)}</li>`).join("")}</ul>`;
  if (selectedProject) renderDialog();
  applyTheme();
  window.dispatchEvent(new CustomEvent("portfolio:language"));
}
function applyTheme() {
  document.documentElement.dataset.theme = theme;
  $("#theme-toggle").setAttribute(
    "aria-label",
    language === "fr"
      ? `Passer au thème ${theme === "light" ? "sombre" : "clair"}`
      : `Switch to ${theme === "light" ? "dark" : "light"} theme`,
  );
  document.querySelector('meta[name="theme-color"]').content =
    theme === "light" ? "#efeee8" : "#222824";
}
function renderDialog() {
  const project = projects.find((p) => p.id === selectedProject);
  if (!project) return;
  $("#dialog-category").textContent =
    project.kind === "enterprise"
      ? copy[language].enterprise
      : copy[language].project;
  $("#dialog-body").innerHTML = projectDetails(
    project,
    language,
    copy[language],
  );
}
function openProject(id, trigger) {
  if (!projects.some((p) => p.id === id)) return;
  selectedProject = id;
  projectTrigger = trigger;
  renderDialog();
  window.dispatchEvent(new CustomEvent("portfolio:inspect"));
  if (!dialog.open) {
    dialog.showModal();
    document.body.style.overflow = "hidden";
  }
}
document.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-project]");
  if (button) openProject(button.dataset.project, button);
});
$("#dialog-close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  const rect = dialog.getBoundingClientRect();
  if (
    event.target === dialog &&
    (event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom)
  )
    dialog.close();
});
dialog.addEventListener("close", () => {
  document.body.style.overflow = "";
  selectedProject = null;
  if (projectTrigger?.isConnected)
    projectTrigger.focus({ preventScroll: true });
  projectTrigger = null;
});
$("#language-toggle").addEventListener("click", () => {
  language = language === "en" ? "fr" : "en";
  savePreference("language", language);
  render();
});
$("#theme-toggle").addEventListener("click", () => {
  theme = theme === "light" ? "dark" : "light";
  savePreference("theme", theme);
  applyTheme();
});
$$("[data-filter]").forEach((button) =>
  button.addEventListener("click", () => {
    filter = button.dataset.filter;
    applyFilter();
    const count = $$(".work-card:not([hidden])").length;
    $("#site-status").textContent =
      language === "fr"
        ? `${count} réalisations affichées.`
        : `${count} projects shown.`;
  }),
);
$("#year").textContent = String(new Date().getFullYear());
render();
