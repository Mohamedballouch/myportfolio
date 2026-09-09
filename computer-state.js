export const APPS = ["home", "work", "about", "research", "contact"];
export const DIRECTORY_SIZE = 4;

export function createDesktopState() {
  return {
    view: "home",
    tab: "overview",
    page: 0,
    focused: false,
    closed: false,
    activity: null,
    revision: 0,
  };
}
export function cancelActivity(state) {
  state.activity = null;
  return ++state.revision;
}
export function beginActivity(state, kind, target) {
  const revision = cancelActivity(state);
  state.activity = { kind, target };
  return revision;
}
export function completeActivity(state, revision) {
  if (revision !== state.revision || !state.activity) return null;
  const activity = state.activity;
  state.activity = null;
  return activity;
}
export function navigateDesktop(state, view, projectIds) {
  if (!APPS.includes(view) && !projectIds.includes(view)) return false;
  cancelActivity(state);
  state.view = view;
  state.closed = false;
  state.tab = "overview";
  return true;
}
export function directoryPage(state, page, total) {
  cancelActivity(state);
  const last = Math.max(0, Math.ceil(total / DIRECTORY_SIZE) - 1);
  state.page = Math.max(
    0,
    Math.min(last, Number.isFinite(page) ? Math.trunc(page) : 0),
  );
}
export function selectDesktopTab(state, tab) {
  if (!["overview", "toolkit"].includes(tab)) return false;
  cancelActivity(state);
  state.tab = tab;
  return true;
}
