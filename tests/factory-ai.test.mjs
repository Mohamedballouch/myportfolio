import test from "node:test";
import assert from "node:assert/strict";
import * as THREE from "three";
import { buildAIMachinery } from "../factory-ai.js";
import { missionFrame } from "../missions.js";

// Exercise the real scene graph without a browser or WebGL. Label textures and
// the shared bevel helper are outside the routing/animation behavior under test.
function fixture() {
  const resources = new Set();
  const resource = (r) => (resources.add(r), r);
  const material = (color, extra = {}) =>
    resource(new THREE.MeshStandardMaterial({ color, ...extra }));
  const group = (parent, x = 0, y = 0, z = 0) => {
    const g = new THREE.Group();
    g.position.set(x, y, z);
    parent.add(g);
    return g;
  };
  const mesh = (parent, geometry, mat, x, y, z) => {
    const m = new THREE.Mesh(resource(geometry), mat);
    m.position.set(x, y, z);
    parent.add(m);
    return m;
  };
  const box = (p, w, h, d, x, y, z, m) =>
    mesh(p, new THREE.BoxGeometry(w, h, d), m, x, y, z);
  const cylinder = (p, r, h, x, y, z, m, n = 20) =>
    mesh(p, new THREE.CylinderGeometry(r, r, h, n), m, x, y, z);
  const plate = (p, text, x, y, z, w = 0.95, h = 0.15) =>
    mesh(p, new THREE.PlaneGeometry(w, h), material("#fff"), x, y, z);
  const factory = new THREE.Group();
  const machines = Array.from({ length: 4 }, (_, i) =>
    group(factory, (i - 1.5) * 1.9, 0.2, -0.25),
  );
  const materials = Object.fromEntries(
    ["ceramic", "dark", "metal", "signal", "green"].map((key) => [
      key,
      material("#fff"),
    ]),
  );
  const ai = buildAIMachinery({
    THREE,
    factory,
    machines,
    box,
    cylinder,
    group,
    plate,
    resource,
    material,
    texture: () => resource(new THREE.Texture()),
    materials,
  });
  return {
    factory,
    machines,
    ai,
    dispose: () => resources.forEach((r) => r.dispose()),
  };
}

test("tool conduits follow their physical endpoints when the factory opens and closes", () => {
  const f = fixture();
  try {
    const routes = f.machines[2].children
      .filter((o) => o.geometry?.type === "TubeGeometry")
      .slice(1);
    assert.equal(routes.length, 3);
    const original = routes.map((r) =>
      Array.from(r.geometry.attributes.position.array),
    );
    for (const open of [1, 0.5, 0]) {
      f.ai.update(missionFrame("rag", 6), { open });
      routes.forEach((route, i) => {
        const end = route.geometry.parameters.path.getPoint(1);
        assert.ok(end.distanceTo(f.ai.satellites[i].position) < 1e-8);
        assert.ok(
          Array.from(route.geometry.attributes.position.array).every(
            Number.isFinite,
          ),
        );
      });
    }
    routes.forEach((route, i) =>
      assert.deepEqual(
        Array.from(route.geometry.attributes.position.array),
        original[i],
      ),
    );
  } finally {
    f.dispose();
  }
});

test("scene transforms reverse exactly through replay and remain finite at phase boundaries", () => {
  const f = fixture();
  const snapshot = () => {
    const values = [];
    f.factory.traverse((o) =>
      values.push(
        ...o.position.toArray(),
        ...o.quaternion.toArray(),
        ...o.scale.toArray(),
        Number(o.visible),
      ),
    );
    return values;
  };
  try {
    f.ai.update(missionFrame("rag", 0));
    const initial = snapshot();
    for (const sample of ["rag", "insurance"])
      for (const t of [3, 5.65, 6, 6.45, 7, 8, 9, 9.2, 9.7, 12]) {
        f.ai.update(missionFrame(sample, t), { open: 1, language: "fr" });
        assert.ok(snapshot().every(Number.isFinite));
      }
    f.ai.update(missionFrame("rag", 0));
    assert.deepEqual(snapshot(), initial);
  } finally {
    f.dispose();
  }
});
