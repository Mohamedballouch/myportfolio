import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import {
  projects,
  experience,
  publications,
  education,
  certifications,
} from "../content.js";
import { copy } from "../translations.js";
import { desktopCopy } from "../computer-copy.js";
import { projectCard, projectDetails, escapeHTML } from "../views.js";
import { desktopWindow, featuredDisks } from "../computer-views.js";
import {
  APPS,
  DIRECTORY_SIZE,
  createDesktopState,
  beginActivity,
  cancelActivity,
  completeActivity,
  navigateDesktop,
  directoryPage,
  selectDesktopTab,
} from "../computer-state.js";

const ids = projects.map((p) => p.id);
const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");

test("all sourced work, employers, education, certifications and DOI links are retained", () => {
  assert.equal(projects.length, 8);
  assert.equal(new Set(ids).size, 8);
  assert.equal(projects.filter((p) => p.kind === "project").length, 5);
  assert.equal(experience.length, 4);
  assert.equal(publications.length, 3);
  assert.equal(certifications.length, 9);
  assert.match(education[0].title.en, /Candidate/);
  publications.forEach((p) => assert.equal(new URL(p.url).hostname, "doi.org"));
  assert.ok(featuredDisks.every((id) => ids.includes(id)));
});

test("all static page and desktop labels exist in both languages", () => {
  assert.deepEqual(Object.keys(copy.en).sort(), Object.keys(copy.fr).sort());
  assert.deepEqual(
    Object.keys(desktopCopy.en).sort(),
    Object.keys(desktopCopy.fr).sort(),
  );
  for (const [, key] of html.matchAll(/data-copy="([^"]+)"/g))
    for (const lang of ["en", "fr"]) assert.ok(copy[lang][key], key);
  for (const [, key] of html.matchAll(/data-os-(?:copy|label)="([^"]+)"/g))
    for (const lang of ["en", "fr"])
      assert.equal(typeof desktopCopy[lang][key], "string", key);
  for (const id of featuredDisks)
    for (const lang of ["en", "fr"])
      assert.equal(desktopCopy[lang].disks[id].length, 3);
});

test("every app and project renders real localized content and full case-study actions", () => {
  for (const lang of ["en", "fr"]) {
    const state = createDesktopState();
    for (const view of [...APPS, ...ids]) {
      assert.ok(navigateDesktop(state, view, ids));
      const screen = desktopWindow(state, lang);
      assert.ok(!screen.html.includes("undefined"));
      if (ids.includes(view)) {
        const p = projects.find((p) => p.id === view);
        assert.ok(screen.html.includes(escapeHTML(p.summary[lang])));
        assert.ok(screen.html.includes(`data-project="${view}"`));
        selectDesktopTab(state, "toolkit");
        const toolkit = desktopWindow(state, lang).html;
        p.tech.forEach((item) => assert.ok(toolkit.includes(escapeHTML(item))));
      }
    }
  }
});

test("the desktop directory exposes all eight canonical projects across bounded pages", () => {
  const state = createDesktopState();
  navigateDesktop(state, "work", ids);
  const found = [];
  for (
    let page = 0;
    page < Math.ceil(projects.length / DIRECTORY_SIZE);
    page++
  ) {
    directoryPage(state, page, projects.length);
    found.push(
      ...[
        ...desktopWindow(state).html.matchAll(/data-os-project="([^"]+)"/g),
      ].map((m) => m[1]),
    );
  }
  assert.deepEqual(found, ids);
  directoryPage(state, -5, projects.length);
  assert.equal(state.page, 0);
  directoryPage(state, 99, projects.length);
  assert.equal(state.page, 1);
  directoryPage(state, NaN, projects.length);
  assert.equal(state.page, 0);
});

test("new navigation and cancellation prevent stale boot or disk completions", () => {
  const state = createDesktopState();
  const first = beginActivity(state, "disk", "agents");
  const second = beginActivity(state, "boot", "home");
  assert.equal(completeActivity(state, first), null);
  assert.deepEqual(completeActivity(state, second), {
    kind: "boot",
    target: "home",
  });
  assert.equal(completeActivity(state, second), null);
  const third = beginActivity(state, "disk", "chart");
  navigateDesktop(state, "contact", ids);
  assert.equal(completeActivity(state, third), null);
  assert.equal(state.view, "contact");
  const fourth = beginActivity(state, "disk", "agents");
  cancelActivity(state);
  assert.equal(completeActivity(state, fourth), null);
});

test("directory pages and toolkit changes cancel an in-flight disk selection", () => {
  const state = createDesktopState();
  navigateDesktop(state, "work", ids);
  const loading = beginActivity(state, "disk", "agents");
  directoryPage(state, 1, projects.length);
  assert.equal(completeActivity(state, loading), null);
  assert.equal(state.view, "work");
  assert.equal(state.page, 1);
  navigateDesktop(state, "chart", ids);
  const other = beginActivity(state, "disk", "insurance-rag");
  selectDesktopTab(state, "toolkit");
  assert.equal(completeActivity(state, other), null);
  assert.equal(state.view, "chart");
  assert.equal(state.tab, "toolkit");
});

test("localization retains the open project, selected tab, directory page and closed desktop", () => {
  const state = createDesktopState();
  navigateDesktop(state, "agents", ids);
  selectDesktopTab(state, "toolkit");
  state.page = 1;
  state.closed = true;
  const before = { ...state };
  const translated = desktopWindow(state, "fr");
  assert.ok(translated.html.includes("Agents IA pour l’entreprise"));
  assert.deepEqual(state, before);
  navigateDesktop(state, "home", ids);
  assert.equal(state.closed, false);
  const stable = { ...state };
  assert.equal(navigateDesktop(state, "unknown-project", ids), false);
  assert.deepEqual(state, stable);
});

test("full case studies escape content and preserve honest project links", () => {
  for (const language of ["en", "fr"])
    for (const p of projects) {
      const card = projectCard(p, 0, language, copy[language]);
      const details = projectDetails(p, language, copy[language]);
      assert.ok(card.includes(escapeHTML(p.title[language])));
      assert.ok(!details.includes("undefined"));
    }
  const p = {
    ...projects[3],
    title: { en: '<img onerror="bad">', fr: "Test" },
    summary: { en: "A & B", fr: "Test" },
  };
  const rendered = projectCard(p, 0, "en", copy.en);
  assert.ok(!rendered.includes("<img onerror"));
  assert.ok(rendered.includes("&lt;img"));
  assert.ok(rendered.includes("A &amp; B"));
  assert.ok(
    projectDetails(p, "en", copy.en).includes(
      'https://github.com/Mohamedballouch"',
    ),
  );
  assert.ok(!projectDetails(p, "en", copy.en).includes("Live demo"));
});

test("desktop research links point to all supplied publications", () => {
  const state = createDesktopState();
  navigateDesktop(state, "research", ids);
  const screen = desktopWindow(state).html;
  publications.forEach((p) => assert.ok(screen.includes(p.url)));
});

test("document controls and navigation target the desktop without obsolete factory files", () => {
  const documentIds = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
  assert.equal(new Set(documentIds).size, documentIds.length);
  for (const [, id] of html.matchAll(/href="#([^"]+)"/g))
    assert.ok(documentIds.includes(id), id);
  for (const [, id] of html.matchAll(/data-os-project="([^"]+)"/g))
    assert.ok(ids.includes(id), id);
  assert.ok(!html.includes("compact-ai-factory"));
  assert.ok(!html.includes("CV_MOHAMED_BALLOUCH.pdf"));
  assert.ok(!html.includes("data-lucide"));
  for (const file of [
    "factory.js",
    "factory.css",
    "factory-ai.js",
    "missions.js",
  ])
    assert.ok(!existsSync(new URL("../" + file, import.meta.url)));
});
