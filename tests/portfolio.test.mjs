import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  stageAt,
  togglePlayback,
  advancePlayback,
  scrubPlayback,
  resetPlayback,
} from "../factory-state.js";
import {
  projects,
  experience,
  publications,
  education,
  certifications,
} from "../content.js";
import { copy, factoryCopy } from "../translations.js";
import { projectCard, projectDetails, relatedProjects } from "../views.js";

const state = () => ({
  time: 0,
  mode: "idle",
  follow: true,
  selected: 0,
  speed: 1,
  stage: -1,
});
test("play, pause, resume and replay preserve progress correctly", () => {
  const s = state();
  togglePlayback(s);
  advancePlayback(s, 4);
  assert.equal(s.time, 4);
  togglePlayback(s);
  advancePlayback(s, 5);
  assert.equal(s.time, 4);
  togglePlayback(s);
  s.speed = 2;
  advancePlayback(s, 4);
  assert.equal(s.mode, "complete");
  assert.equal(s.time, 12);
  togglePlayback(s);
  assert.equal(s.time, 0);
  assert.equal(s.mode, "running");
});
test("reduced motion visits every stage and finishes without animation", () => {
  const s = state();
  const stages = [];
  for (let i = 0; i < 4; i++) {
    togglePlayback(s, true);
    stages.push(stageAt(s.time));
    assert.notEqual(s.mode, "running");
  }
  assert.deepEqual(stages, [0, 1, 2, 3]);
  assert.equal(s.mode, "complete");
});
test("manual inspection survives running and scrubbing; sample reset restores follow", () => {
  const s = state();
  togglePlayback(s);
  s.selected = 0;
  s.follow = false;
  advancePlayback(s, 8);
  assert.equal(stageAt(s.time), 2);
  assert.equal(s.selected, 0);
  assert.equal(s.follow, false);
  scrubPlayback(s, 0.8);
  assert.equal(s.selected, 0);
  assert.equal(s.mode, "paused");
  scrubPlayback(s, -1);
  assert.equal(stageAt(s.time), -1);
  scrubPlayback(s, 2);
  assert.equal(s.time, 12);
  resetPlayback(s);
  assert.equal(s.time, 0);
  assert.equal(s.follow, true);
});
test("real work, career, education and publication links are retained", () => {
  assert.equal(projects.length, 8);
  assert.equal(new Set(projects.map((p) => p.id)).size, 8);
  assert.equal(projects.filter((p) => p.kind === "project").length, 5);
  assert.equal(experience.length, 4);
  assert.equal(publications.length, 3);
  assert.equal(certifications.length, 9);
  assert.match(education[0].title.en, /Candidate/);
  publications.forEach((p) => assert.equal(new URL(p.url).hostname, "doi.org"));
  for (let station = 0; station < 4; station++) {
    const links = relatedProjects(projects, station);
    assert.equal(links.length, 3);
    assert.ok(links.every((p) => p.stations.includes(station)));
  }
  assert.ok(relatedProjects(projects, 0).some((p) => p.id === "social-data"));
  assert.ok(relatedProjects(projects, 1).some((p) => p.id === "chart"));
});
test("every visible copy key and factory stage is available in both languages", () => {
  assert.deepEqual(Object.keys(copy.en).sort(), Object.keys(copy.fr).sort());
  assert.deepEqual(
    Object.keys(factoryCopy.en).sort(),
    Object.keys(factoryCopy.fr).sort(),
  );
  const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  for (const [, key] of html.matchAll(/data-copy="([^"]+)"/g)) {
    assert.ok(copy.en[key], key);
    assert.ok(copy.fr[key], key);
  }
  for (const lang of ["en", "fr"])
    for (const p of projects) {
      const card = projectCard(p, 0, lang, copy[lang]);
      const details = projectDetails(p, lang, copy[lang]);
      assert.ok(card.includes(p.title[lang].replaceAll("&", "&amp;")));
      assert.ok(!card.includes("undefined"));
      assert.ok(!details.includes("undefined"));
    }
});
test("case studies escape source text and do not invent project or demo URLs", () => {
  const p = {
    ...projects[3],
    title: { en: '<img onerror="bad">', fr: "Test" },
    summary: { en: "A & B", fr: "Test" },
  };
  const rendered = projectCard(p, 0, "en", copy.en);
  assert.ok(!rendered.includes("<img onerror"));
  assert.ok(rendered.includes("&lt;img"));
  assert.ok(rendered.includes("A &amp; B"));
  const details = projectDetails(p, "en", copy.en);
  assert.ok(details.includes('https://github.com/Mohamedballouch"'));
  assert.ok(!details.includes("Live demo"));
});
test("document IDs are unique and local navigation targets exist", () => {
  const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
  assert.equal(new Set(ids).size, ids.length);
  for (const [, id] of html.matchAll(/href="#([^"]+)"/g))
    assert.ok(ids.includes(id), id);
  assert.ok(!html.includes("allow-same-origin"));
  assert.ok(!html.includes("CV_MOHAMED_BALLOUCH.pdf"));
});
