import { factoryCopy } from "./translations.js";
import { buildAIMachinery } from "./factory-ai.js";
import { missions, missionUI, missionFrame, outputAt } from "./missions.js";
import {
  stageAt,
  togglePlayback,
  advancePlayback,
  scrubPlayback,
  resetPlayback,
} from "./factory-state.js";

(async () => {
  const root = document.getElementById("compact-ai-factory");
  if (!root) return;
  const $ = (s) => root.querySelector(s),
    $$ = (s) => [...root.querySelectorAll(s)];
  const viewport = $(".f-canvas"),
    play = $(".f-primary"),
    timeline = $(".f-timeline input");
  document.getElementById("pipeline-sample").disabled = true;
  const motionQuery = matchMedia("(prefers-reduced-motion: reduce)");
  let words = factoryCopy[document.documentElement.lang] || factoryCopy.en;
  let title = words.titles,
    copy = words.descriptions,
    verbs = words.verbs;
  const state = {
    sample: document.getElementById("pipeline-sample").value,
    mode: "idle",
    time: 0,
    speed: 1,
    selected: 0,
    stage: -1,
    hover: -1,
    follow: true,
    open: false,
    inspectedTool: -1,
  };
  let aiMachinery,
    missionSignature = "";
  const design = { accent: "#e99b50", grid: true, finish: "ceramic" };
  let ready = false,
    disposed = false,
    inView = true,
    raf = 0,
    previous = null,
    tweenPending = true;
  let renderer,
    scene,
    camera,
    resizeObserver,
    visibilityObserver,
    removalObserver,
    themeObserver;
  let THREE,
    allResources = new Set();
  const listeners = [];
  function listen(target, event, handler, options) {
    target.addEventListener(event, handler, options);
    listeners.push(() => target.removeEventListener(event, handler, options));
  }
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const smooth = (v) => {
    v = clamp(v, 0, 1);
    return v * v * (3 - 2 * v);
  };
  const pulse = (v, a, b) => Math.sin(Math.PI * clamp((v - a) / (b - a), 0, 1));
  function announce(message) {
    $(".f-live").textContent = message;
  }
  function selectStation(i, manual = true) {
    state.selected = i;
    if (manual) {
      state.follow = false;
      state.inspectedTool = -1;
      if (ready) {
        camTarget.focus = xs[i] * 0.18;
        camTarget.zoom = state.open ? 0.9 : 1.03;
        setHover(-1);
        requestDraw();
      }
    }
    $$(".f-station").forEach((b, n) =>
      b.setAttribute("aria-pressed", String(n === i)),
    );
    $(".f-inspector h3").textContent = `0${i + 1} / ${title[i]}`;
    $(".f-inspector p").textContent = copy[state.sample][i];
    if (state.inspectedTool >= 0 && i === 2) showToolDetail();
    root.dataset.selected = String(i);
    root.dispatchEvent(
      new CustomEvent("factory:selection", {
        bubbles: true,
        detail: { station: i },
      }),
    );
    if (manual)
      announce(`${title[i]} ${words.selected}. ${copy[state.sample][i]}`);
    updateMissionUI();
  }
  function showToolDetail() {
    const language = document.documentElement.lang === "fr" ? "fr" : "en";
    const tool = missions[state.sample].tools[state.inspectedTool];
    $(".f-inspector h3").textContent =
      `03 / ${title[2]} · ${tool.name[language]}`;
    $(".f-inspector p").textContent = tool.detail[language];
  }
  function selectTool(index) {
    selectStation(2, true);
    state.inspectedTool = index;
    showToolDetail();
    updateMissionUI();
    announce($(".f-inspector p").textContent);
    if (ready) requestDraw();
  }
  function updateMissionUI(force = false) {
    const language = document.documentElement.lang === "fr" ? "fr" : "en";
    const ui = missionUI[language],
      frame = missionFrame(state.sample, state.time),
      mission = frame.mission;
    const output = outputAt(state.sample, state.time, language);
    const signature = [
      language,
      state.sample,
      state.mode,
      frame.stage,
      frame.toolIndex,
      state.inspectedTool,
      frame.evidenceReady,
      frame.reviewDone,
      output,
    ].join("|");
    if (signature === missionSignature && !force) return;
    missionSignature = signature;
    $(".f-mission-label").textContent = ui.mission;
    $(".f-mission-prompt").textContent = mission.prompt[language];
    $(".f-demo-label").textContent = ui.example;
    $(".f-source-label").textContent = ui.sourceInput;
    $(".f-source-name").textContent = mission.document[language];
    $(".f-source-excerpt").textContent = mission.excerpt[language];
    $(".f-prepare-lane").textContent = ui.prepareLane;
    $(".f-answer-lane").textContent = ui.answerLane;
    $(".f-flow-lanes").dataset.phase = state.time < 6 ? "prepare" : "answer";
    $(".f-evidence").hidden = !frame.evidenceReady;
    $(".f-evidence-label").textContent = ui.evidence;
    $(".f-evidence-text").textContent = mission.excerpt[language];
    $(".f-evidence-source").textContent = mission.source[language];
    $(".f-review-status").hidden = !frame.reviewDone;
    $(".f-review-status").textContent = mission.review[language];
    $(".f-trace").setAttribute("aria-label", ui.trace);
    $$(".f-trace li").forEach((item, i) => {
      item.dataset.active = String(frame.stage === i && !frame.complete);
      item.dataset.done = String(frame.stage > i || frame.complete);
      item.querySelector(".f-step-text").textContent =
        mission.steps[i][language];
      item.querySelector(".f-step-status").textContent =
        frame.stage > i || frame.complete
          ? "✓"
          : String(i + 1).padStart(2, "0");
      if (frame.stage === i) item.setAttribute("aria-current", "step");
      else item.removeAttribute("aria-current");
    });
    $(".f-tools-label").textContent = ui.tools;
    $(".f-output-label").textContent = ui.output;
    $(".f-tools").setAttribute("aria-label", ui.tools);
    $$(".f-tools button").forEach((button, i) => {
      button.textContent = mission.tools[i].name[language];
      button.setAttribute(
        "aria-label",
        `${ui.inspect}: ${mission.tools[i].name[language]}`,
      );
      button.setAttribute("aria-pressed", String(state.inspectedTool === i));
      button.dataset.active = String(frame.toolIndex === i);
    });
    $(".f-tool-action").textContent =
      frame.toolIndex >= 0
        ? mission.tools[frame.toolIndex].action[language]
        : frame.stage === 3
          ? frame.reviewDone
            ? mission.review[language]
            : ui.checking
          : ui.preparing;
    $(".f-stream").textContent =
      output ||
      (frame.stage === 3
        ? frame.reviewDone
          ? mission.review[language]
          : ui.checking
        : state.time > 0
          ? mission.steps[Math.max(0, frame.stage)][language] + "…"
          : ui.waiting);
    $(".f-stream").dataset.streaming = String(
      frame.stage === 3 && !frame.complete,
    );
    $(".f-scene-legend").replaceChildren(
      ...ui.legend.map((label, i) => {
        const span = document.createElement("span");
        span.dataset.signal = String(i);
        span.textContent = label;
        return span;
      }),
    );
  }
  function syncUI(force = false) {
    const stage = stageAt(state.time);
    if (stage !== state.stage || force) {
      state.stage = stage;
      $$(".f-station").forEach(
        (b, i) => (b.dataset.processing = String(i === stage)),
      );
      if (stage >= 0 && state.follow) selectStation(stage, false);
      if (stage >= 0 && state.mode !== "complete")
        announce(
          `${title[stage]}. ${verbs[state.sample][stage].toLowerCase()}.`,
        );
    }
    const text = motionQuery.matches
      ? state.mode === "complete"
        ? words.again
        : state.time === 0
          ? words.start
          : words.next
      : {
          idle: words.run,
          running: words.pause,
          paused: words.resume,
          complete: words.again,
        }[state.mode];
    $(".f-play-text").textContent = text;
    $(".f-play-icon").textContent =
      state.mode === "running" ? "Ⅱ" : state.mode === "complete" ? "↶" : "↗";
    timeline.value = String(Math.round((state.time / 12) * 1000));
    timeline.setAttribute(
      "aria-valuetext",
      `${state.time.toFixed(1)} / 12 ${words.seconds}${stage >= 0 ? ", " + title[stage] : ""}`,
    );
    $(".f-time-label").textContent =
      `00:${String(Math.floor(state.time)).padStart(2, "0")} / 00:12`;
    $(".f-process-label").textContent =
      state.time === 0
        ? words.ready
        : state.mode === "complete"
          ? words.complete
          : state.mode === "paused"
            ? `${words.paused} / ${stage + 1} ${words.of} 4`
            : verbs[state.sample][Math.max(0, stage)];
    $(".f-result").hidden = state.mode !== "complete";
    if (state.mode === "complete")
      $(".f-result").textContent =
        `${words.delivered} · ${missions[state.sample].source[document.documentElement.lang === "fr" ? "fr" : "en"]} · ${words.illustrative}`;
    updateMissionUI();
  }
  function localize() {
    words = factoryCopy[document.documentElement.lang] || factoryCopy.en;
    title = words.titles;
    copy = words.descriptions;
    verbs = words.verbs;
    $$(".f-station").forEach((b, i) => {
      b.replaceChildren();
      const number = document.createElement("span");
      number.textContent = `0${i + 1}`;
      b.append(number, document.createTextNode(title[i]));
    });
    $(".f-hint-title").textContent = words.inside;
    $(".f-hover-hint").textContent = words.hint;
    $('.f-view-controls [data-view="overview"]').textContent = words.overview;
    $('.f-view-controls [data-view="zoom-in"]').setAttribute(
      "aria-label",
      words.zoomIn,
    );
    $('.f-view-controls [data-view="zoom-out"]').setAttribute(
      "aria-label",
      words.zoomOut,
    );
    const cameraHelp =
      document.documentElement.lang === "fr"
        ? "Utilisez les touches fléchées pour faire tourner la caméra."
        : "Use arrow keys here to rotate the camera.";
    $(".f-view-controls").setAttribute("aria-label", cameraHelp);
    $$(".f-view-controls button").forEach((b) =>
      b.setAttribute("title", cameraHelp),
    );
    $(".f-explode").textContent = state.open
      ? words.close + " −"
      : words.open + " +";
    $(".f-inspector a").textContent = words.explore;
    timeline.setAttribute("aria-label", words.scrub);
    $(".f-speed").setAttribute(
      "aria-label",
      `${words.speed}: ${state.speed} ${words.times}`,
    );
    $(".f-fallback").textContent = root.dataset.failed
      ? words.unavailable
      : words.loading;
    renderer?.domElement.setAttribute("aria-label", words.canvas);
    selectStation(state.selected, false);
    syncUI();
    updateMissionUI(true);
    if (ready) requestDraw();
  }
  listen(window, "portfolio:language", localize);
  localize();
  listen(window, "portfolio:inspect", () => {
    if (state.mode === "running") {
      state.mode = "paused";
      syncUI();
    }
  });
  $$(".f-station").forEach((b) =>
    listen(b, "click", () => selectStation(Number(b.dataset.station))),
  );
  $$(".f-tools button").forEach((button) =>
    listen(button, "click", () => selectTool(Number(button.dataset.tool))),
  );
  try {
    THREE = await import("three");
    if (!root.isConnected) return;
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "low-power",
    });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.8));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.domElement.setAttribute("role", "img");
    renderer.domElement.setAttribute("aria-label", words.canvas);
    viewport.append(renderer.domElement);
    $(".f-fallback").hidden = true;
    scene = new THREE.Scene();
    camera = new THREE.OrthographicCamera(-6, 6, 3, -3, 0.1, 70);
    scene.add(new THREE.HemisphereLight(0xe5f3ff, 0x3b4c4c, 2.3));
    const key = new THREE.DirectionalLight(0xfff3df, 4.2);
    key.position.set(-4, 8, 5);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.left = -7;
    key.shadow.camera.right = 7;
    key.shadow.camera.top = 6;
    key.shadow.camera.bottom = -6;
    key.shadow.normalBias = 0.025;
    key.shadow.bias = -0.0003;
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xb3e2ef, 2.7);
    rim.position.set(5, 4, -5);
    scene.add(rim);
    const envScene = new THREE.Scene();
    envScene.background = new THREE.Color("#788b8e");
    const lightPanel = new THREE.Mesh(
      new THREE.PlaneGeometry(14, 10),
      new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide }),
    );
    lightPanel.position.set(-3, 7, 3);
    lightPanel.lookAt(0, 0, 0);
    envScene.add(lightPanel);
    const panel2 = lightPanel.clone();
    panel2.position.set(6, 2, -5);
    panel2.lookAt(0, 0, 0);
    envScene.add(panel2);
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envMap = pmrem.fromScene(envScene);
    scene.environment = envMap.texture;
    allResources.add(envMap);
    pmrem.dispose();
    lightPanel.geometry.dispose();
    lightPanel.material.dispose();
  } catch (error) {
    if (!root.isConnected) return;
    root.dataset.failed = "true";
    $(".f-fallback").textContent = words.unavailable;
    $(".f-fallback").hidden = false;
    renderer?.domElement.remove();
    document.getElementById("pipeline-sample").disabled = false;
    listen(document.getElementById("pipeline-sample"), "change", (e) => {
      state.sample = e.target.value;
      selectStation(state.selected, false);
    });
    announce(words.unavailable);
    if (renderer) renderer.dispose();
    return;
  }
  const resource = (r) => {
    allResources.add(r);
    return r;
  };
  const material = (color, extra = {}) =>
    resource(
      new THREE.MeshStandardMaterial({
        color,
        roughness: 0.45,
        metalness: 0.1,
        ...extra,
      }),
    );
  const ceramic = material("#dce7e2", { roughness: 0.3, metalness: 0.32 });
  const pale = material("#f2ede2", { roughness: 0.42, metalness: 0.15 });
  const dark = material("#20363c", { roughness: 0.48, metalness: 0.55 });
  const black = material("#13282d", { roughness: 0.6, metalness: 0.2 });
  const metal = material("#8caaad", { roughness: 0.27, metalness: 0.85 });
  const copper = material(design.accent, { roughness: 0.28, metalness: 0.45 });
  const signal = material(design.accent, {
    emissive: design.accent,
    emissiveIntensity: 1.1,
    roughness: 0.25,
    metalness: 0.25,
  });
  const green = material("#b3e9cc", {
    emissive: "#7dcc9c",
    emissiveIntensity: 0.65,
  });
  const glass = material("#9ad4d7", {
    transparent: true,
    opacity: 0.2,
    roughness: 0.12,
    metalness: 0.4,
    depthWrite: false,
  });
  const gridMat = resource(
    new THREE.LineBasicMaterial({
      color: "#73928c",
      transparent: true,
      opacity: 0.16,
    }),
  );
  const geometryCache = new Map();
  function box(parent, w, h, d, x, y, z, mat = ceramic, bevel = 0.025) {
    const r = Math.min(bevel, w * 0.18, h * 0.18, d * 0.18),
      k = [w, h, d, r].join("/");
    let geo = geometryCache.get(k);
    if (!geo) {
      if (r < 0.009) geo = new THREE.BoxGeometry(w, h, d);
      else {
        const shape = new THREE.Shape();
        const a = w / 2 - r,
          b = h / 2 - r;
        shape.moveTo(-a, -b);
        shape.lineTo(a, -b);
        shape.lineTo(a, b);
        shape.lineTo(-a, b);
        shape.closePath();
        geo = new THREE.ExtrudeGeometry(shape, {
          depth: d - 2 * r,
          bevelEnabled: true,
          bevelSegments: 2,
          steps: 1,
          bevelSize: r,
          bevelThickness: r,
          curveSegments: 1,
        });
        geo.translate(0, 0, -(d - 2 * r) / 2);
        geo.computeVertexNormals();
      }
      resource(geo);
      geometryCache.set(k, geo);
    }
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }
  function cylinder(
    parent,
    radius,
    length,
    x,
    y,
    z,
    mat = metal,
    segments = 20,
  ) {
    const geo = resource(
      new THREE.CylinderGeometry(radius, radius, length, segments),
    );
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }
  function group(parent, x = 0, y = 0, z = 0) {
    const g = new THREE.Group();
    g.position.set(x, y, z);
    parent.add(g);
    return g;
  }
  function line(parent, points, mat = gridMat) {
    const geo = resource(
      new THREE.BufferGeometry().setFromPoints(
        points.map((p) => new THREE.Vector3(...p)),
      ),
    );
    const l = new THREE.Line(geo, mat);
    parent.add(l);
    return l;
  }
  function texture(draw, w = 512, h = 256) {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    draw(c.getContext("2d"), w, h);
    const t = resource(new THREE.CanvasTexture(c));
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }
  function plate(parent, text, x, y, z, w = 0.95, h = 0.15) {
    const tex = texture(
      (c, W, H) => {
        c.fillStyle = "#dce7df";
        c.fillRect(0, 0, W, H);
        c.fillStyle = "#203b40";
        c.font = "500 60px monospace";
        c.textAlign = "center";
        c.textBaseline = "middle";
        c.fillText(text, W / 2, H / 2);
      },
      512,
      100,
    );
    const mat = resource(new THREE.MeshBasicMaterial({ map: tex }));
    const p = new THREE.Mesh(resource(new THREE.PlaneGeometry(w, h)), mat);
    p.position.set(x, y, z);
    parent.add(p);
    return p;
  }
  function cable(parent, points, r = 0.018, mat = black) {
    const curve = new THREE.CatmullRomCurve3(
      points.map((p) => new THREE.Vector3(...p)),
    );
    const mesh = new THREE.Mesh(
      resource(new THREE.TubeGeometry(curve, 28, r, 6, false)),
      mat,
    );
    parent.add(mesh);
    return mesh;
  }
  const factory = group(scene, 0, 0, 0);
  box(factory, 8.8, 0.26, 3.05, 0, 0, 0, dark, 0.08);
  box(factory, 8.62, 0.045, 2.91, 0, 0.15, 0, black, 0.03);
  box(factory, 8.48, 0.025, 0.024, 0, 0.08, 1.534, copper, 0.004);
  box(factory, 0.024, 0.025, 2.78, 4.405, 0.08, 0, copper, 0.004);
  const grid = group(factory);
  for (let x = -4; x <= 4; x += 0.4)
    line(grid, [
      [x, 0.179, -1.4],
      [x, 0.179, 1.4],
    ]);
  for (let z = -1.2; z <= 1.3; z += 0.4)
    line(grid, [
      [-4.2, 0.179, z],
      [4.2, 0.179, z],
    ]);
  for (const x of [-3.8, 3.8])
    for (const z of [-1.12, 1.12])
      cylinder(factory, 0.13, 0.16, x, -0.18, z, black);
  const groundMat = resource(new THREE.ShadowMaterial({ opacity: 0.17 }));
  const ground = new THREE.Mesh(
    resource(new THREE.PlaneGeometry(70, 70)),
    groundMat,
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.29;
  ground.receiveShadow = true;
  scene.add(ground);
  const xs = [-2.85, -0.95, 0.95, 2.85],
    machines = [],
    indicators = [],
    liftParts = [];
  function lift(object, offset) {
    liftParts.push({
      object,
      base: object.position.clone(),
      offset: new THREE.Vector3(...offset),
    });
    return object;
  }
  xs.forEach((x, i) => {
    const g = group(factory, x, 0.2, -0.25);
    g.userData.station = i;
    machines.push(g);
    box(g, 1.5, 0.13, 1.25, 0, 0.02, 0, metal, 0.04);
    box(g, 1.4, 0.09, 1.14, 0, 0.115, 0, dark);
    const ledMat = material(design.accent, {
      emissive: design.accent,
      emissiveIntensity: 0.5,
    });
    indicators.push(ledMat);
    box(g, 1.12, 0.025, 0.025, 0, 0.12, 0.637, ledMat, 0.004);
    plate(
      g,
      `0${i + 1}  ${["READ", "INDEX", "DRAFT", "REVIEW"][i]}`,
      0,
      0.06,
      0.639,
      1.12,
      0.12,
    );
    for (const sx of [-0.59, 0.59])
      for (const sz of [-0.43, 0.43])
        cylinder(g, 0.035, 0.03, sx, 0.172, sz, black, 12);
    cable(
      factory,
      [
        [x, 0.3, -0.85],
        [x, 0.28, -1.18],
        [x + 0.3, 0.22, -1.3],
      ],
      0.026,
      black,
    );
  });
  const conveyor = group(factory, 0, 0.42, 0.93),
    rollers = [];
  for (const z of [-0.3, 0.3]) {
    box(conveyor, 8.32, 0.1, 0.075, 0, 0, z, metal, 0.012);
    box(conveyor, 8.32, 0.022, 0.018, 0, 0.065, z, signal, 0.003);
  }
  for (let x = -4; x <= 4.01; x += 0.18) {
    const axis = group(conveyor, x, 0.01, 0);
    axis.rotation.x = Math.PI / 2;
    const roll = cylinder(axis, 0.046, 0.49, 0, 0, 0, metal, 12);
    rollers.push(roll);
    box(roll, 0.012, 0.48, 0.012, 0, 0, 0.046, dark, 0.002);
  }
  for (const x of [-3.8, -1.9, 0, 1.9, 3.8])
    for (const z of [-0.23, 0.23])
      box(conveyor, 0.06, 0.24, 0.06, x, -0.16, z, dark, 0.009);
  for (const x of [-3.6, -1.7, 0.2, 2.1, 3.8]) {
    box(factory, 0.16, 0.015, 0.018, x, 0.19, 1.35, copper, 0.002);
    box(factory, 0.018, 0.015, 0.07, x + 0.06, 0.19, 1.32, copper, 0.002);
  }
  // Intake: exposed pivot, card tray, moving arm and readable source tile.
  const intake = machines[0];
  box(intake, 1.02, 0.28, 0.8, 0, 0.34, -0.08, pale);
  box(intake, 0.76, 0.1, 0.56, 0, 0.55, -0.16, dark);
  for (let i = 0; i < 4; i++)
    box(
      intake,
      0.55,
      0.032,
      0.39,
      -0.1 + i * 0.018,
      0.635 + i * 0.045,
      -0.2 + i * 0.04,
      ceramic,
      0.006,
    );
  const intakeCover = group(intake, 0, 0.83, -0.32);
  box(intakeCover, 1.04, 0.12, 0.75, 0, 0, 0, ceramic);
  lift(intakeCover, [0, 0.7, -0.18]);
  intakeCover.visible = false;
  box(intake, 0.12, 0.43, 0.14, -0.47, 0.64, -0.52, metal);
  box(intake, 0.12, 0.43, 0.14, 0.47, 0.64, -0.52, metal);
  const armPivot = group(intake, -0.49, 0.53, 0.32);
  const pivot = cylinder(armPivot, 0.13, 0.19, 0, 0, 0, copper);
  pivot.rotation.z = Math.PI / 2;
  const arm = group(armPivot);
  box(arm, 0.11, 0.62, 0.11, 0, 0.28, 0, metal, 0.015);
  const elbow = cylinder(arm, 0.1, 0.18, 0, 0.57, 0, dark);
  elbow.rotation.z = Math.PI / 2;
  const forearm = group(arm, 0, 0.57, 0);
  box(forearm, 0.48, 0.075, 0.09, 0.2, 0, 0, pale, 0.016);
  for (const z of [-0.08, 0.08])
    box(forearm, 0.07, 0.18, 0.035, 0.43, -0.075, z, dark, 0.006);
  const sourceTexture = texture((c, W, H) => {
    c.fillStyle = "#e9eee7";
    c.fillRect(0, 0, W, H);
    c.fillStyle = "#314e55";
    c.font = "24px monospace";
    c.fillText("INPUT / 01", 30, 38);
    c.strokeStyle = "#b2c5bc";
    c.lineWidth = 2;
    for (let y = 80; y < 230; y += 45) {
      c.beginPath();
      c.moveTo(32, y);
      c.lineTo(475, y);
      c.stroke();
    }
    c.strokeStyle = "#c37c38";
    c.lineWidth = 8;
    c.lineJoin = "round";
    c.beginPath();
    [
      [35, 218],
      [120, 166],
      [205, 193],
      [290, 120],
      [380, 132],
      [475, 68],
    ].forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y)));
    c.stroke();
  });
  const docsTexture = texture((c, W, H) => {
    c.fillStyle = "#e9eee7";
    c.fillRect(0, 0, W, H);
    c.fillStyle = "#314e55";
    c.font = "24px monospace";
    c.fillText("SOURCES / 01", 30, 38);
    c.fillStyle = "#9bb4ab";
    for (let i = 0; i < 5; i++)
      c.fillRect(32, 70 + i * 30, 425 - (i % 2) * 95, 10);
    c.fillStyle = "#c37c38";
    c.fillRect(32, 130, 275, 10);
  });
  const sourceMat = resource(
    new THREE.MeshStandardMaterial({
      map: sourceTexture,
      roughness: 0.65,
      side: THREE.DoubleSide,
    }),
  );
  const sourceCard = new THREE.Mesh(
    resource(new THREE.PlaneGeometry(0.61, 0.32)),
    sourceMat,
  );
  sourceCard.position.set(0.04, 0.65, 0.12);
  sourceCard.rotation.x = -0.67;
  intake.add(sourceCard);
  // Knowledge library base and removable top. Searchable shelves are added below.
  const model = machines[1];
  box(model, 1.12, 0.12, 0.79, 0, 0.26, -0.12, dark, 0.035);
  lift(
    box(model, 0.16, 0.58, 0.95, -0.6, 0.47, -0.12, ceramic),
    [-0.38, 0.03, 0],
  );
  lift(
    box(model, 0.16, 0.58, 0.95, 0.6, 0.47, -0.12, ceramic),
    [0.38, 0.03, 0],
  );
  const rackFrame = group(model);
  lift(rackFrame, [0, -0.09, 0.5]);
  for (let i = 0; i < 2; i++) {
    box(rackFrame, 0.95, 0.19, 0.11, 0, 0.37 + i * 0.225, 0.345, metal, 0.012);
    for (let j = 0; j < 6; j++)
      box(
        rackFrame,
        0.065,
        0.095,
        0.02,
        -0.36 + j * 0.12,
        0.38 + i * 0.225,
        0.412,
        black,
        0.004,
      );
    box(
      rackFrame,
      0.035,
      0.035,
      0.016,
      0.44,
      0.37 + i * 0.225,
      0.418,
      i % 2 ? green : signal,
      0.004,
    );
  }
  box(model, 0.89, 0.035, 0.62, 0, 0.36, -0.12, black, 0.008);
  for (let i = 0; i < 4; i++) {
    box(model, 0.6, 0.014, 0.018, 0, 0.385, -0.34 + i * 0.13, metal, 0.002);
    box(
      model,
      0.12,
      0.06,
      0.09,
      -0.29 + i * 0.18,
      0.412,
      -0.3 + (i % 2) * 0.34,
      i % 2 ? metal : copper,
      0.009,
    );
  }
  const modelTop = group(model, 0, 1.87, -0.12);
  box(modelTop, 1.18, 0.08, 0.78, 0, 0, 0, ceramic, 0.035);
  lift(modelTop, [0, 0.6, 0]);
  // Assistant workbench with a removable canopy.
  const inspection = machines[2];
  for (const x of [-0.48, 0.48]) {
    box(inspection, 0.18, 1.04, 0.7, x, 0.71, 0.03, pale);
    box(
      inspection,
      0.045,
      0.77,
      0.035,
      x > 0 ? x - 0.103 : x + 0.103,
      0.74,
      0.42,
      signal,
      0.003,
    );
  }
  const scanTop = group(inspection, 0, 1.26, 0.03);
  box(scanTop, 1.18, 0.23, 0.83, 0, 0, 0, ceramic, 0.045);
  lift(scanTop, [0, 0.78, 0.08]);
  box(inspection, 0.7, 0.48, 0.12, 0, 0.48, -0.33, dark);
  // Delivery: motorized hatch and a rising application window.
  const delivery = machines[3];
  box(delivery, 1.17, 0.95, 0.9, 0, 0.69, -0.08, pale, 0.04);
  box(delivery, 0.83, 0.59, 0.026, 0, 0.65, 0.384, black, 0.01);
  const hatchPivot = group(delivery, 0, 0.965, 0.407);
  const hatch = box(hatchPivot, 0.91, 0.54, 0.06, 0, -0.27, 0, ceramic, 0.02);
  for (let i = 0; i < 4; i++)
    box(hatchPivot, 0.7, 0.024, 0.011, 0, -0.1 - i * 0.1, 0.037, metal, 0.003);
  const deliveryTop = group(delivery, 0, 1.21, -0.1);
  box(deliveryTop, 1.33, 0.15, 1.03, 0, 0, 0, ceramic, 0.04);
  lift(deliveryTop, [0, 0.8, -0.1]);
  box(delivery, 0.12, 0.52, 0.55, 0.66, 0.59, -0.14, dark);
  for (let i = 0; i < 5; i++)
    box(
      delivery,
      0.02,
      0.034,
      0.36,
      0.73,
      0.43 + i * 0.08,
      -0.14,
      metal,
      0.002,
    );
  const appTexture = texture((c, W, H) => {
    c.fillStyle = "#edf2eb";
    c.fillRect(0, 0, W, H);
    c.fillStyle = "#263f46";
    c.fillRect(0, 0, W, 49);
    c.fillStyle = "#dbe8dd";
    c.font = "22px monospace";
    c.fillText("DRAFT / REVIEW", 25, 33);
    c.fillStyle = "#ce8947";
    c.fillRect(25, 76, 8, 132);
    c.fillStyle = "#37545b";
    c.font = "30px sans-serif";
    c.fillText("Answer + source [1]", 55, 108);
    c.fillStyle = "#9fb5ad";
    c.fillRect(55, 137, 368, 9);
    c.fillRect(55, 160, 310, 9);
    c.fillRect(55, 183, 345, 9);
  });
  const app = group(delivery, 0, 0.82, 0.57);
  box(app, 0.96, 0.57, 0.055, 0, 0, 0, dark, 0.02);
  const appScreen = new THREE.Mesh(
    resource(new THREE.PlaneGeometry(0.89, 0.49)),
    resource(new THREE.MeshBasicMaterial({ map: appTexture })),
  );
  appScreen.position.z = 0.032;
  app.add(appScreen);
  app.visible = false;
  aiMachinery = buildAIMachinery({
    THREE,
    factory,
    machines,
    box,
    cylinder,
    group,
    plate,
    resource,
    material,
    texture,
    materials: { ceramic, dark, metal, signal, green, glass },
  });
  sourceMat.map = docsTexture;
  // Documents travel only to the index. Questions use a separate search-and-answer route.
  const packet = group(factory, -3.95, 0.59, 0.93);
  const rawPacket = group(packet);
  box(rawPacket, 0.43, 0.075, 0.34, 0, 0, 0, pale, 0.02);
  const tinyCard = new THREE.Mesh(
    resource(new THREE.PlaneGeometry(0.39, 0.3)),
    sourceMat,
  );
  tinyCard.rotation.x = -Math.PI / 2;
  tinyCard.position.y = 0.045;
  rawPacket.add(tinyCard);
  const tokenPacket = group(packet);
  for (let i = 0; i < 3; i++)
    box(
      tokenPacket,
      0.25,
      0.09,
      0.25,
      (i - 1) * 0.075,
      i * 0.11,
      0,
      i === 1 ? signal : ceramic,
      0.012,
    );
  const sparks = [];
  for (let i = 0; i < 16; i++) {
    const p = box(factory, 0.032, 0.032, 0.032, 0, 0, 0, signal, 0.005);
    p.visible = false;
    sparks.push(p);
  }
  const floorLight = new THREE.PointLight(design.accent, 0, 2.2, 2);
  floorLight.position.set(-2.85, 0.7, 0.65);
  factory.add(floorLight);
  const cam = { yaw: 0.44, pitch: 0.62, zoom: 1, focus: 0 },
    camTarget = { ...cam };
  let openAmount = 0,
    hoverAmount = [0, 0, 0, 0],
    baseSpan = 5.6;
  function updateCamera() {
    const r = 14;
    camera.position.set(
      cam.focus + r * Math.cos(cam.pitch) * Math.sin(cam.yaw),
      r * Math.sin(cam.pitch),
      r * Math.cos(cam.pitch) * Math.cos(cam.yaw),
    );
    camera.lookAt(cam.focus, 0.53, 0);
    camera.zoom = cam.zoom;
    camera.updateProjectionMatrix();
  }
  function applyTheme() {
    const paper = getComputedStyle(root).getPropertyValue("--f-paper").trim();
    const probe = document.createElement("span");
    probe.style.color = paper;
    root.append(probe);
    const color = getComputedStyle(probe).color;
    probe.remove();
    const c = new THREE.Color(color);
    groundMat.opacity = c.r + c.g + c.b < 1.5 ? 0.29 : 0.17;
    requestDraw();
  }
  function resize() {
    if (disposed) return;
    const r = viewport.getBoundingClientRect(),
      w = Math.max(1, r.width),
      h = Math.max(1, r.height);
    renderer.setSize(w, h, false);
    const aspect = w / h;
    baseSpan = Math.max(5.6, 10.7 / aspect);
    camera.left = (-baseSpan * aspect) / 2;
    camera.right = (baseSpan * aspect) / 2;
    camera.top = baseSpan / 2;
    camera.bottom = -baseSpan / 2;
    updateCamera();
    requestDraw();
  }
  function requestDraw() {
    if (disposed || raf || !inView || document.hidden) return;
    raf = requestAnimationFrame(frame);
  }
  function frame(now) {
    raf = 0;
    if (disposed || !root.isConnected) {
      cleanup();
      return;
    }
    if (!inView || document.hidden) {
      previous = null;
      return;
    }
    const dt = previous === null ? 0 : clamp((now - previous) / 1000, 0, 0.06);
    previous = now;
    if (state.mode === "running" && !motionQuery.matches) {
      advancePlayback(state, dt);
      if (state.mode === "complete") announce(words.delivered);
      syncUI();
    }
    const lerp = motionQuery.matches ? 1 : 1 - Math.exp(-dt * 8);
    tweenPending = false;
    for (const name of ["yaw", "pitch", "zoom", "focus"]) {
      const delta = camTarget[name] - cam[name];
      if (Math.abs(delta) > 0.0004) {
        cam[name] += delta * lerp;
        tweenPending = true;
      } else cam[name] = camTarget[name];
    }
    const openDelta = Number(state.open) - openAmount;
    if (Math.abs(openDelta) > 0.0005) {
      openAmount += openDelta * lerp;
      tweenPending = true;
    } else openAmount = Number(state.open);
    for (let i = 0; i < 4; i++) {
      const goal = state.hover === i ? 1 : 0,
        delta = goal - hoverAmount[i];
      if (Math.abs(delta) > 0.004) {
        hoverAmount[i] += delta * lerp;
        tweenPending = true;
      } else hoverAmount[i] = goal;
    }
    renderMechanics();
    updateCamera();
    renderer.render(scene, camera);
    if ((state.mode === "running" && !motionQuery.matches) || tweenPending)
      requestDraw();
    else previous = null;
  }
  function renderMechanics() {
    const t = state.time,
      stage = Math.min(3, Math.floor(t / 3)),
      phase = clamp((t - stage * 3) / 3, 0, 1),
      active = t > 0 && t < 12;
    aiMachinery.update(missionFrame(state.sample, t), {
      open: openAmount,
      selectedTool: state.inspectedTool,
      yaw: cam.yaw,
      width: viewport.clientWidth,
      language: document.documentElement.lang,
    });
    liftParts.forEach((p) =>
      p.object.position.copy(p.base).addScaledVector(p.offset, openAmount),
    );
    const movement = smooth(phase * 1.7),
      previousX = stage === 0 ? -3.95 : xs[stage - 1];
    packet.position.x = previousX + (xs[stage] - previousX) * movement;
    packet.position.y = 0.585 + 0.03 * pulse(phase, 0, 0.65);
    if (t === 12) packet.position.x = 3.95;
    const form = t < 3 ? 0 : 1;
    [rawPacket, tokenPacket].forEach((g, i) => (g.visible = i === form));
    packet.visible = t < 6;
    tokenPacket.rotation.y = 0;
    rollers.forEach((r, i) => (r.rotation.y = -Math.min(t, 6) * 5 + i * 0.08));
    const intakeAction = pulse(t, 0, 3);
    arm.rotation.z = -0.2 + intakeAction * 0.65;
    forearm.rotation.z = -intakeAction * 0.5;
    sourceCard.position.y = 0.65 + intakeAction * 0.18;
    sourceCard.rotation.z = -intakeAction * 0.11;
    const hatchOpen = smooth((t - 9) / 0.7) * Math.PI * 0.72;
    hatchPivot.rotation.x = -hatchOpen - openAmount * 0.28;
    app.visible = t >= 10;
    const appProgress = smooth((t - 10) / 1.6);
    app.position.y = 0.62 + appProgress * 0.65;
    app.position.z = 0.57 + appProgress * 0.27;
    app.scale.setScalar(0.25 + 0.75 * appProgress);
    app.rotation.x = -0.12 * appProgress;
    indicators.forEach((mat, i) => {
      mat.emissiveIntensity =
        0.2 +
        (state.selected === i ? 0.55 : 0) +
        hoverAmount[i] * 1.1 +
        (state.stage === i && active ? 0.65 + 0.25 * Math.sin(t * 5) : 0);
    });
    floorLight.position.x = packet.position.x;
    floorLight.intensity = active && t < 6 ? 1.2 : 0;
    sparks.forEach((p, i) => {
      const phase2 = (t * 0.7 + i / 16) % 1;
      p.visible = active && t < 6 && phase > 0.45 && i < 10;
      p.position.set(
        xs[stage] + Math.cos(i * 2.4 + phase2 * 4) * (0.18 + phase2 * 0.27),
        0.64 + phase2 * 0.65,
        0.4 + Math.sin(i * 2.4 + phase2 * 4) * 0.24,
      );
      p.scale.setScalar(1 - phase2 * 0.6);
    });
  }
  function resetPipeline() {
    resetPlayback(state);
    state.inspectedTool = -1;
    selectStation(0, false);
    syncUI(true);
    requestDraw();
  }
  listen(play, "click", () => {
    if (!ready) return;
    if (state.mode === "idle" || state.mode === "complete") {
      camTarget.focus = 0;
      camTarget.zoom = state.open ? 0.9 : 1;
      state.inspectedTool = -1;
      selectStation(0, false);
    }
    togglePlayback(state, motionQuery.matches);
    syncUI();
    requestDraw();
  });
  listen(timeline, "input", () => {
    scrubPlayback(state, Number(timeline.value) / 1000);
    syncUI();
    requestDraw();
  });
  listen($(".f-speed"), "click", () => {
    state.speed = state.speed === 1 ? 2 : 1;
    $(".f-speed").textContent = state.speed + "×";
    $(".f-speed").setAttribute(
      "aria-label",
      `${words.speed}: ${state.speed} ${words.times}`,
    );
    announce(`${words.speed}: ${state.speed} ${words.times}.`);
  });
  listen($(".f-explode"), "click", () => {
    state.open = !state.open;
    $(".f-explode").setAttribute("aria-pressed", String(state.open));
    $(".f-explode").textContent = state.open
      ? words.close + " −"
      : words.open + " +";
    camTarget.zoom = state.open ? 0.9 : 1;
    requestDraw();
    announce(state.open ? words.opened : words.closed);
  });
  listen(document.getElementById("pipeline-sample"), "change", (e) => {
    state.sample = e.target.value;
    sourceMat.map = docsTexture;
    sourceMat.needsUpdate = true;
    resetPipeline();
    announce(`${e.target.selectedOptions[0].textContent} ${words.selected}.`);
  });
  $$(".f-view-controls button").forEach((b) =>
    listen(b, "click", () => {
      if (b.dataset.view === "overview") {
        Object.assign(camTarget, {
          yaw: 0.44,
          pitch: 0.62,
          zoom: state.open ? 0.9 : 1,
          focus: 0,
        });
      } else
        camTarget.zoom = clamp(
          camTarget.zoom + (b.dataset.view === "zoom-in" ? 0.12 : -0.12),
          0.75,
          1.42,
        );
      requestDraw();
    }),
  );
  listen($(".f-view-controls"), "keydown", (event) => {
    if (
      !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)
    )
      return;
    event.preventDefault();
    if (event.key === "ArrowLeft" || event.key === "ArrowRight")
      camTarget.yaw = clamp(
        camTarget.yaw + (event.key === "ArrowLeft" ? -0.12 : 0.12),
        -1.15,
        1.15,
      );
    else
      camTarget.pitch = clamp(
        camTarget.pitch + (event.key === "ArrowUp" ? 0.09 : -0.09),
        0.36,
        1.03,
      );
    requestDraw();
  });
  const raycaster = new THREE.Raycaster(),
    pointer = new THREE.Vector2();
  let drag = null;
  function hitTarget(event) {
    const r = renderer.domElement.getBoundingClientRect();
    pointer.set(
      ((event.clientX - r.left) / r.width) * 2 - 1,
      (-(event.clientY - r.top) / r.height) * 2 + 1,
    );
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(machines, true);
    if (hits.length) {
      let obj = hits[0].object;
      let tool = -1;
      while (obj && obj !== factory) {
        if (Number.isInteger(obj.userData.tool)) tool = obj.userData.tool;
        if (Number.isInteger(obj.userData.station))
          return { station: obj.userData.station, tool };
        obj = obj.parent;
      }
    }
    return { station: -1, tool: -1 };
  }
  function hit(event) {
    return hitTarget(event).station;
  }
  function setHover(i) {
    if (state.hover === i) return;
    state.hover = i;
    $(".f-hover-hint").textContent =
      i < 0 ? words.hint : `0${i + 1} / ${title[i]} ↗`;
    renderer.domElement.style.cursor = i < 0 ? "grab" : "pointer";
    requestDraw();
  }
  listen(renderer.domElement, "pointerdown", (e) => {
    if (e.button !== 0 || !e.isPrimary || drag) return;
    drag = {
      id: e.pointerId,
      x: e.clientX,
      y: e.clientY,
      yaw: camTarget.yaw,
      pitch: camTarget.pitch,
      moved: false,
    };
    renderer.domElement.setPointerCapture(e.pointerId);
  });
  listen(renderer.domElement, "pointermove", (e) => {
    if (drag && drag.id === e.pointerId) {
      const dx = e.clientX - drag.x,
        dy = e.clientY - drag.y;
      if (Math.hypot(dx, dy) > 6) drag.moved = true;
      if (drag.moved) {
        camTarget.yaw = clamp(drag.yaw + dx * 0.005, -1.15, 1.15);
        camTarget.pitch = clamp(drag.pitch + dy * 0.0035, 0.36, 1.03);
        renderer.domElement.style.cursor = "grabbing";
        setHover(-1);
        requestDraw();
      }
    } else if (e.pointerType !== "touch") setHover(hit(e));
  });
  listen(renderer.domElement, "pointerup", (e) => {
    if (!drag || drag.id !== e.pointerId) return;
    const moved = drag.moved;
    drag = null;
    if (renderer.domElement.hasPointerCapture(e.pointerId))
      renderer.domElement.releasePointerCapture(e.pointerId);
    if (!moved) {
      const { station, tool } = hitTarget(e);
      if (tool >= 0) selectTool(tool);
      else if (station >= 0) selectStation(station);
    }
    setHover(e.pointerType === "touch" ? -1 : hit(e));
  });
  listen(renderer.domElement, "pointercancel", (e) => {
    if (drag?.id !== e.pointerId) return;
    drag = null;
    setHover(-1);
  });
  listen(renderer.domElement, "pointerleave", () => {
    if (!drag) setHover(-1);
  });
  listen(document, "visibilitychange", () => {
    if (document.hidden) {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      previous = null;
    } else requestDraw();
  });
  listen(motionQuery, "change", () => {
    if (motionQuery.matches && state.mode === "running") state.mode = "paused";
    syncUI();
    requestDraw();
  });
  function cleanup() {
    if (disposed) return;
    disposed = true;
    if (raf) cancelAnimationFrame(raf);
    listeners.forEach((fn) => fn());
    resizeObserver?.disconnect();
    visibilityObserver?.disconnect();
    removalObserver?.disconnect();
    themeObserver?.disconnect();
    allResources.forEach((r) => r.dispose?.());
    renderer?.dispose();
  }
  listen(window, "pagehide", (e) => {
    if (!e.persisted) cleanup();
    else {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      previous = null;
    }
  });
  listen(window, "pageshow", (e) => {
    if (e.persisted) requestDraw();
  });
  resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(viewport);
  visibilityObserver = new IntersectionObserver(
    (entries) => {
      inView = entries[0].isIntersecting;
      if (inView) requestDraw();
      else {
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
        previous = null;
      }
    },
    { rootMargin: "120px" },
  );
  visibilityObserver.observe(root);
  removalObserver = new MutationObserver(() => {
    if (!root.isConnected) cleanup();
  });
  removalObserver.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
  themeObserver = new MutationObserver(applyTheme);
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class", "style", "data-theme"],
  });
  ready = true;
  $$(".f-toolbar button, .f-view-controls button, .f-speed").forEach(
    (b) => (b.disabled = false),
  );
  timeline.disabled = false;
  document.getElementById("pipeline-sample").disabled = false;
  syncUI();
  resize();
  applyTheme();
})();
