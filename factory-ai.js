// Concrete document, search, drafting and review mechanisms share the scene lifecycle.
export function buildAIMachinery({
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
  materials,
}) {
  const { ceramic, dark, metal, signal, green } = materials;
  const cyan = material("#78d7dd", {
    emissive: "#3db5c6",
    emissiveIntensity: 0.65,
  });
  const quiet = material("#5c8188", { metalness: 0.45 });
  const toolMaterials = Array.from({ length: 3 }, () =>
    material("#92c8ca", { emissive: "#3db5c6", emissiveIntensity: 0.2 }),
  );
  const connections = [];
  let lastOpen = 0;
  function connection(parent, points, offsets, color = quiet) {
    const path = new THREE.CatmullRomCurve3(
      points.map((p) => new THREE.Vector3(...p)),
    );
    const mesh = new THREE.Mesh(
      resource(new THREE.TubeGeometry(path, 36, 0.012, 5, false)),
      color,
    );
    parent.add(mesh);
    connections.push({ path, mesh, points, offsets });
    return path;
  }
  function moveConnections(open) {
    if (Math.abs(open - lastOpen) < 0.0001) return;
    lastOpen = open;
    connections.forEach(({ path, mesh, points, offsets }) => {
      path.points.forEach((p, i) => (p.y = points[i][1] + offsets[i] * open));
      path.updateArcLengths();
      const next = new THREE.TubeGeometry(path, 36, 0.012, 5, false);
      for (const name of ["position", "normal"]) {
        mesh.geometry.attributes[name].array.set(next.attributes[name].array);
        mesh.geometry.attributes[name].needsUpdate = true;
      }
      mesh.geometry.computeBoundingSphere();
      next.dispose();
    });
  }
  function paper(parent, x, y, z, w = 0.4, h = 0.55) {
    const page = group(parent, x, y, z);
    box(page, w, h, 0.025, 0, 0, 0, ceramic, 0.009);
    for (let i = 0; i < 4; i++)
      box(
        page,
        w * 0.68,
        0.016,
        0.009,
        -w * 0.04,
        h * 0.25 - i * h * 0.15,
        0.019,
        i === 1 ? signal : metal,
        0.003,
      );
    return page;
  }
  // Station 1: pages are scanned and become source-tagged passage strips.
  const documents = group(machines[0], 0.28, 1.13, -0.12);
  const pages = [];
  for (let i = 0; i < 3; i++)
    pages.push(paper(documents, -i * 0.045, i * 0.045, -i * 0.065));
  box(documents, 0.55, 0.07, 0.45, 0, -0.33, -0.04, dark);
  plate(documents, "DOCUMENT", 0, -0.28, 0.21, 0.48, 0.09);
  const scanBar = box(documents, 0.5, 0.022, 0.032, 0, 0.2, 0.07, cyan, 0.003);
  const strips = [];
  for (let i = 0; i < 3; i++) {
    const strip = group(machines[0], 0.35, 1.2 - i * 0.13, 0.2);
    box(strip, 0.32, 0.075, 0.035, 0, 0, 0, ceramic, 0.006);
    box(strip, 0.22, 0.013, 0.01, 0, 0, 0.025, cyan, 0.002);
    strips.push(strip);
  }
  // Station 2: searchable shelves replace the abstract glowing reactor.
  const library = group(machines[1], 0, 0.74, -0.1);
  box(library, 1.06, 1.03, 0.08, 0, 0.5, -0.39, dark, 0.015);
  for (const x of [-0.52, 0.52])
    box(library, 0.06, 1.08, 0.7, x, 0.5, -0.05, ceramic, 0.009);
  for (let i = 0; i < 4; i++)
    box(library, 1.05, 0.05, 0.68, 0, i * 0.32, -0.05, metal, 0.008);
  const folders = [];
  for (let row = 0; row < 3; row++)
    for (let col = 0; col < 3; col++) {
      const folder = group(
        library,
        -0.33 + col * 0.33,
        0.17 + row * 0.32,
        -0.04,
      );
      box(folder, 0.26, 0.22, 0.43, 0, 0, 0, ceramic, 0.012);
      box(folder, 0.2, 0.09, 0.012, 0, 0.015, 0.224, cyan, 0.005);
      plate(
        folder,
        String(row * 3 + col + 1).padStart(2, "0"),
        0,
        0.015,
        0.234,
        0.18,
        0.07,
      );
      folders.push(folder);
    }
  const matchedFolder = folders[4];
  // Station 3: an assistant operates search, form and writing tools.
  const agent = group(machines[2], 0, 1.66, -0.2);
  cylinder(machines[2], 0.24, 0.1, 0, 1.42, -0.2, dark, 6);
  box(agent, 0.46, 0.38, 0.37, 0, 0, 0, ceramic, 0.07);
  box(agent, 0.35, 0.14, 0.025, 0, 0.02, 0.195, dark, 0.02);
  for (const x of [-0.09, 0.09])
    box(agent, 0.045, 0.04, 0.02, x, 0.026, 0.215, signal, 0.008);
  for (const x of [-0.3, 0.3])
    box(agent, 0.12, 0.17, 0.12, x, -0.06, 0, dark, 0.04);
  cylinder(agent, 0.026, 0.18, 0, 0.26, 0, metal, 10);
  const antenna = box(agent, 0.07, 0.055, 0.07, 0, 0.37, 0, cyan, 0.014);
  const question = group(machines[2], 0.5, 2.03, -0.78);
  box(question, 0.56, 0.32, 0.045, 0, 0, 0, ceramic, 0.04);
  plate(question, "?", 0, 0, 0.03, 0.22, 0.22);
  const questionRoute = connection(
    machines[2],
    [
      [0.5, 1.86, -0.78],
      [0.45, 1.75, -0.55],
      [0.1, 1.73, -0.2],
    ],
    [0.75, 0.75, 0.75],
  );
  const questionPacket = box(
    machines[2],
    0.1,
    0.07,
    0.025,
    0,
    0,
    0,
    signal,
    0.006,
  );
  const locations = [
    [-0.71, 1.19, -0.36],
    [0.7, 1.19, -0.36],
    [0.1, 0.83, 0.66],
  ];
  const satellites = [],
    routes = [],
    pulses = [];
  locations.forEach(([x, y, z], i) => {
    const tool = group(machines[2], x, y, z);
    tool.userData.tool = i;
    satellites.push(tool);
    cylinder(tool, 0.22, 0.08, 0, -0.1, 0, dark, 6);
    cylinder(tool, 0.222, 0.02, 0, -0.045, 0, toolMaterials[i], 6);
    if (i === 0) {
      const lens = new THREE.Mesh(
        resource(new THREE.TorusGeometry(0.09, 0.023, 8, 24)),
        metal,
      );
      lens.position.set(-0.03, 0.08, 0.02);
      tool.add(lens);
      const handle = box(
        tool,
        0.045,
        0.13,
        0.05,
        0.065,
        -0.005,
        0.02,
        signal,
        0.007,
      );
      handle.rotation.z = 0.65;
    } else if (i === 1) {
      paper(tool, 0, 0.045, 0, 0.22, 0.27);
      box(tool, 0.11, 0.045, 0.03, 0, 0.185, 0.01, metal, 0.005);
    } else {
      const pen = box(tool, 0.055, 0.3, 0.055, 0, 0.09, 0.01, signal, 0.006);
      pen.rotation.z = -0.4;
      box(tool, 0.2, 0.025, 0.16, 0, -0.035, 0, ceramic, 0.005);
    }
    plate(tool, ["SEARCH", "FORM", "WRITE"][i], 0, -0.074, 0.222, 0.35, 0.09);
    routes.push(
      connection(
        machines[2],
        [
          [0, 1.52, -0.2],
          [x * 0.55, 1.38, z * 0.5],
          [x, y, z],
        ],
        [0.75, 0.5, 0.28],
      ),
    );
    pulses.push(
      box(machines[2], 0.065, 0.065, 0.065, 0, 0, 0, toolMaterials[i], 0.012),
    );
  });
  // The question sends a query BACK to the library; evidence returns on another route.
  const queryPath = connection(
    factory,
    [
      [0.7, 1.65, -0.45],
      [0.15, 1.72, -0.95],
      [-0.6, 1.55, -0.94],
      [-0.95, 1.39, -0.35],
    ],
    [0.75, 0.5, 0.2, 0],
    signal,
  );
  const evidencePath = connection(
    factory,
    [
      [-0.95, 1.45, 0.21],
      [-0.6, 2.05, 0.3],
      [0.18, 2.15, 0.16],
      [0.9, 1.92, -0.12],
    ],
    [0, 0.2, 0.5, 0.75],
    cyan,
  );
  const queryPacket = box(factory, 0.12, 0.05, 0.08, 0, 0, 0, signal, 0.005);
  const evidencePacket = paper(factory, 0, 0, 0, 0.28, 0.16);
  const reviewPath = connection(
    factory,
    [
      [1.2, 1.3, 0.28],
      [1.65, 1.5, 0.46],
      [2.35, 1.7, 0.38],
      [2.85, 1.77, 0.15],
    ],
    [0.28, 0.45, 0.65, 0.8],
  );
  const draftPacket = paper(factory, 0, 0, 0, 0.26, 0.32);
  // Station 4: a physical review clipboard flags incomplete fields and cites evidence.
  const review = group(machines[3], 0, 1.76, -0.06);
  box(review, 1.02, 0.69, 0.065, 0, 0, 0, dark, 0.025);
  box(review, 0.95, 0.61, 0.016, 0, -0.015, 0.044, ceramic, 0.009);
  box(review, 0.26, 0.08, 0.09, 0, 0.335, 0.015, metal, 0.01);
  const reviewRows = [];
  for (let i = 0; i < 3; i++) {
    const row = group(review, 0, 0.17 - i * 0.15, 0.063);
    box(row, 0.57, 0.025, 0.01, 0.035, 0, 0, metal, 0.003);
    const status = box(
      row,
      0.06,
      0.06,
      0.015,
      -0.36,
      0,
      0,
      i === 0 ? green : signal,
      0.007,
    );
    reviewRows.push({ row, status });
  }
  plate(review, "[1] SOURCE", 0.15, -0.24, 0.064, 0.47, 0.08);
  const reviewStamp = plate(review, "NEEDS DETAILS", 0, 0.38, 0.07, 0.9, 0.12);
  const checkedStamp = plate(
    review,
    "SOURCE ATTACHED",
    0,
    0.38,
    0.07,
    0.95,
    0.12,
  );
  const labels = [];
  const captions = {
    en: ["READ & SPLIT", "INDEX PASSAGES", "FIND & DRAFT", "CHECK & DELIVER"],
    fr: [
      "LIRE & DÉCOUPER",
      "INDEXER",
      "CHERCHER & RÉDIGER",
      "VÉRIFIER & LIVRER",
    ],
  };
  for (let i = 0; i < 4; i++) {
    const maps = {};
    for (const lang of ["en", "fr"])
      maps[lang] = texture(
        (c, W, H) => {
          c.fillStyle = "#18313b";
          c.fillRect(0, 0, W, H);
          c.fillStyle = i < 2 ? "#a2e5e8" : "#ffc17d";
          c.fillRect(0, 0, 7, H);
          c.font = "500 30px monospace";
          c.textAlign = "center";
          c.textBaseline = "middle";
          c.fillText(captions[lang][i], W / 2, H / 2);
        },
        420,
        80,
      );
    const mat = resource(
      new THREE.SpriteMaterial({
        map: maps.en,
        depthTest: false,
        transparent: true,
      }),
    );
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(1.55, 0.295, 1);
    sprite.position.set(0, 2.44, -0.17);
    machines[i].add(sprite);
    labels.push({ sprite, maps });
  }
  function update(
    frame,
    {
      open = 0,
      selectedTool = -1,
      yaw = 0.44,
      width = 900,
      language = "en",
    } = {},
  ) {
    const t = frame.time;
    moveConnections(open);
    documents.position.y = 1.13 + open * 0.35;
    scanBar.position.y = 0.22 - frame.ingestion * 0.42;
    strips.forEach((strip, i) => {
      strip.visible = t > 1.3 && t < 4.8;
      strip.position.set(
        0.35 + Math.max(0, frame.ingestion - 0.4) * 0.55,
        1.2 - i * 0.13 + open * 0.35,
        0.2,
      );
    });
    folders.forEach((folder, i) => {
      folder.scale.y =
        t === 0 ? 1 : Math.max(0.08, Math.min(1, frame.indexing * 9 - i));
      folder.position.z =
        -0.04 +
        (i === 4 && t >= 6.45
          ? Math.sin((Math.min(1, frame.retrieval) * Math.PI) / 2) * 0.2
          : 0);
    });
    matchedFolder.children[1].material = t >= 6.45 ? signal : cyan;
    agent.position.y = 1.66 + open * 0.75;
    agent.rotation.y =
      frame.toolIndex === 0 ? -0.35 : frame.toolIndex === 1 ? 0.25 : 0;
    antenna.scale.setScalar(
      frame.toolIndex >= 0 ? 1.1 + 0.1 * Math.sin(t * 8) : 1,
    );
    question.position.y = 2.03 + open * 0.75;
    question.visible = t === 0 || t >= 5.65;
    questionPacket.visible = t >= 5.65 && t < 6;
    questionPacket.position.copy(
      questionRoute.getPoint(frame.questionProgress),
    );
    toolMaterials.forEach(
      (mat, i) =>
        (mat.emissiveIntensity =
          frame.toolIndex === i ? 1.9 : selectedTool === i ? 1.2 : 0.28),
    );
    satellites.forEach(
      (tool, i) => (tool.position.y = locations[i][1] + open * 0.28),
    );
    pulses.forEach((p, i) => {
      p.visible = frame.toolIndex === i;
      p.position.copy(routes[i].getPoint(frame.toolProgress));
    });
    queryPacket.visible = t >= 6 && t < 6.45;
    queryPacket.position.copy(queryPath.getPoint(frame.query));
    evidencePacket.visible = t >= 6.45 && t < 7.05;
    evidencePacket.position.copy(evidencePath.getPoint(frame.retrieval));
    draftPacket.visible = t >= 9 && t < 9.2;
    draftPacket.position.copy(reviewPath.getPoint(frame.draftTransfer));
    review.position.y = 1.76 + open * 0.8;
    reviewRows.forEach(({ row, status }, i) => {
      row.visible = t === 0 || t >= 9.2 + i * 0.15;
      status.material = frame.sample === "rag" && i > 0 ? signal : green;
    });
    reviewStamp.visible = t >= 9.7 && frame.sample === "rag";
    checkedStamp.visible = t >= 9.7 && frame.sample !== "rag";
    labels.forEach(({ sprite, maps }) => {
      sprite.position.y = 2.44 + open * 0.75;
      sprite.visible = width > 580 && Math.abs(yaw) < 0.85;
      const map = maps[language] || maps.en;
      if (sprite.material.map !== map) {
        sprite.material.map = map;
        sprite.material.needsUpdate = true;
      }
    });
  }
  return { update, satellites };
}
