export const DURATION = 12;
export function stageAt(time) {
  return time <= 0 ? -1 : Math.min(3, Math.floor(time / 3));
}
export function togglePlayback(state, reduced = false) {
  if (reduced) {
    if (state.mode === "complete") {
      state.time = 0;
      state.follow = true;
    }
    state.time =
      [2.4, 5.4, 8.4, DURATION].find((t) => t > state.time + 0.01) ?? DURATION;
    state.mode = state.time === DURATION ? "complete" : "paused";
  } else if (state.mode === "running") state.mode = "paused";
  else {
    if (state.mode === "idle" || state.mode === "complete") {
      state.time = 0;
      state.follow = true;
    }
    state.mode = "running";
  }
}
export function advancePlayback(state, seconds) {
  if (state.mode !== "running") return;
  state.time = Math.min(
    DURATION,
    state.time + Math.max(0, seconds) * state.speed,
  );
  if (state.time === DURATION) state.mode = "complete";
}
export function scrubPlayback(state, fraction) {
  state.time = Math.max(0, Math.min(1, fraction)) * DURATION;
  state.mode = state.time === DURATION ? "complete" : "paused";
}
export function resetPlayback(state) {
  Object.assign(state, { time: 0, mode: "idle", stage: -1, follow: true });
}
