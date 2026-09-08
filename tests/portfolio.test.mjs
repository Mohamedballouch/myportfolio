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
import { missions, missionUI, missionFrame, outputAt } from "../missions.js";

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
  assert.ok(relatedProjects(projects, 1).some((p) => p.id === "archive"));
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

test("agent missions retrieve context, generate, call each tool, then stream output", () => {
  for (const sample of Object.keys(missions)) {
    assert.equal(missionFrame(sample, 0).stage, -1);
    assert.equal(missionFrame(sample, 2.5).stage, 0);
    assert.equal(missionFrame(sample, 4.5).indexing, 0.5);
    assert.deepEqual(
      [6.5, 7.5, 8.5].map((t) => missionFrame(sample, t).toolIndex),
      [0, 1, 2],
    );
    assert.equal(missionFrame(sample, 9).toolIndex, -1);
    for (const language of ["en", "fr"]) {
      assert.equal(outputAt(sample, 9, language), "");
      const draft = outputAt(sample, 10.5, language);
      assert.ok(draft.length > 0);
      assert.ok(missions[sample].result[language].startsWith(draft));
      assert.notEqual(draft, missions[sample].result[language]);
      assert.equal(
        outputAt(sample, 12, language),
        missions[sample].result[language],
      );
    }
  }
});

test("mission traces and generated text stay reversible through pause, scrub, and reset", () => {
  const s = state();
  togglePlayback(s);
  advancePlayback(s, 10.5);
  const frame = missionFrame("rag", s.time);
  const draft = outputAt("rag", s.time);
  togglePlayback(s);
  advancePlayback(s, 2);
  assert.deepEqual(missionFrame("rag", s.time), frame);
  assert.equal(outputAt("rag", s.time), draft);
  scrubPlayback(s, 7.5 / 12);
  assert.equal(missionFrame("rag", s.time).toolIndex, 1);
  assert.equal(outputAt("rag", s.time), "");
  scrubPlayback(s, 10.5 / 12);
  assert.equal(outputAt("rag", s.time), draft);
  resetPlayback(s);
  assert.equal(outputAt("insurance", s.time), "");
  assert.equal(missionFrame("insurance", s.time).toolIndex, -1);
  assert.notEqual(outputAt("insurance", 12), outputAt("rag", 12));
});

test("both missions and their tool details are translated with bounded timeline inputs", () => {
  assert.deepEqual(
    Object.keys(missionUI.en).sort(),
    Object.keys(missionUI.fr).sort(),
  );
  for (const mission of Object.values(missions)) {
    assert.equal(mission.tools.length, 3);
    assert.equal(mission.steps.length, 4);
    for (const lang of ["en", "fr"]) {
      assert.ok(
        mission.prompt[lang] && mission.result[lang] && mission.source[lang],
      );
      assert.ok(mission.steps.every((step) => step[lang]));
      assert.ok(
        mission.tools.every(
          (tool) => tool.name[lang] && tool.action[lang] && tool.detail[lang],
        ),
      );
    }
  }
  assert.equal(missionFrame("rag", -5).time, 0);
  assert.equal(missionFrame("rag", NaN).time, 0);
  assert.equal(missionFrame("rag", 13).time, 12);
  assert.equal(missionFrame("unknown", 12).mission, missions.rag);
  assert.equal(outputAt("rag", 12, "unknown"), missions.rag.result.en);
  assert.match(missions.rag.tools[1].detail.en, /simulated/);
  assert.match(missions.rag.result.en, /draft/i);
});

test("questions search prepared knowledge and review precedes delivery", () => {
  const preparing = missionFrame("rag", 5.5);
  assert.equal(preparing.query, 0);
  assert.equal(preparing.retrieval, 0);
  assert.equal(preparing.generation, 0);
  const search = missionFrame("rag", 6.25);
  assert.equal(search.questionProgress, 1);
  assert.equal(search.indexing, 1);
  assert.ok(search.query > 0);
  assert.equal(search.retrieval, 0);
  assert.equal(missionFrame("rag", 7).evidenceReady, true);
  assert.equal(missionFrame("rag", 8.5).generation, 0.5);
  assert.equal(missionFrame("rag", 9.1).reviewProgress, 0);
  assert.equal(missionFrame("rag", 9.6).reviewDone, false);
  assert.equal(missionFrame("rag", 9.7).reviewDone, true);
  assert.equal(outputAt("rag", 9.7), "");
  assert.match(missions.rag.result.en, /2 monitors/);
  assert.match(missions.rag.review.en, /purpose and cost missing/);
  for (const mission of Object.values(missions)) {
    assert.match(mission.document.en, /Example/);
    assert.match(mission.result.en, /\[1\]/);
  }
});
