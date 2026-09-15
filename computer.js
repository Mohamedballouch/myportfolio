import { projects } from "./content.js";
import { desktopCopy } from "./computer-copy.js";
import { desktopWindow, featuredDisks } from "./computer-views.js";
import {
  createDesktopState,
  beginActivity,
  cancelActivity,
  completeActivity,
  navigateDesktop,
  directoryPage,
  selectDesktopTab,
} from "./computer-state.js";

const root = document.getElementById("ballouch-computer");
if (root) {
  const $ = (selector) => root.querySelector(selector);
  const state = createDesktopState();
  const ids = projects.map((project) => project.id);
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  const events = new AbortController();
  const listen = (target, type, handler) =>
    target.addEventListener(type, handler, { signal: events.signal });
  const language = () => (document.documentElement.lang === "fr" ? "fr" : "en");
  const words = () => desktopCopy[language()];
  let timers = [],
    flight = null,
    ghost = null,
    bootReturn = null;
  const mainParts = [
    ...root.querySelectorAll(".bos-menu, .bos-desktop, .bos-taskbar"),
  ];
  function status(text) {
    $(".bos-status").textContent = text;
  }
  function readyStatus() {
    const ui = words(),
      project = projects.find((p) => p.id === state.view);
    return state.closed
      ? ui.desktopReady
      : project
        ? `${ui.loaded}: ${project.title[language()]}`
        : state.view === "home"
          ? ui.ready
          : ui.desktopReady;
  }
  function stop({ restoreFocus = true } = {}) {
    cancelActivity(state);
    timers.forEach(clearTimeout);
    timers = [];
    flight?.cancel();
    flight = null;
    ghost?.remove();
    ghost = null;
    const inBoot = $(".bos-boot").contains(document.activeElement);
    $(".bos-boot").hidden = true;
    mainParts.forEach((element) => {
      element.inert = false;
    });
    root.dataset.reading = "false";
    if (restoreFocus && inBoot && bootReturn?.isConnected)
      bootReturn.focus({ preventScroll: true });
    bootReturn = null;
    status(readyStatus());
  }
  function render({ focus = false } = {}) {
    const ui = words(),
      view = desktopWindow(state, language());
    const replacingFocus = $(".bos-window-content").contains(
      document.activeElement,
    );
    $(".bos-window").hidden = state.closed;
    $(".bos-wallpaper").hidden = !state.closed;
    $(".bos-window-title").textContent = view.title;
    $(".bos-window-content").innerHTML = view.html;
    status(readyStatus());
    if (!state.closed && (focus || replacingFocus))
      $("#os-window-heading").focus({ preventScroll: true });
  }
  function open(view, { focus = true } = {}) {
    if (
      !ids.includes(view) &&
      !["home", "work", "about", "research", "contact"].includes(view)
    )
      return;
    stop({ restoreFocus: false });
    navigateDesktop(state, view, ids);
    render({ focus });
  }
  function localize() {
    stop();
    const ui = words();
    root.querySelectorAll("[data-os-copy]").forEach((element) => {
      const value = ui[element.dataset.osCopy];
      if (typeof value === "string") element.textContent = value;
    });
    root
      .querySelectorAll("[data-os-label]")
      .forEach((element) =>
        element.setAttribute("aria-label", ui[element.dataset.osLabel]),
      );
    for (const id of featuredDisks) {
      const disk = root.querySelector(`.bos-disk[data-os-project="${id}"]`);
      const project = projects.find((p) => p.id === id);
      const labels = ui.disks[id];
      disk.setAttribute(
        "aria-label",
        `${ui.insertLabel}: ${project.title[language()]}`,
      );
      disk.querySelector("small").textContent = labels[0];
      disk.querySelector("strong").textContent = labels[1];
      disk.querySelector("em").textContent = labels[2];
    }
    $(".bos-focus").textContent = state.focused ? ui.unfocus : ui.focus;
    render();
  }
  function loadProject(id, trigger) {
    const project = projects.find((p) => p.id === id);
    if (!project) return;
    stop();
    const revision = beginActivity(state, "disk", id);
    root.dataset.reading = "true";
    status(`${words().reading}: ${project.title[language()]}`);
    const finish = () => {
      const activity = completeActivity(state, revision);
      if (!activity || !root.isConnected) return;
      root.dataset.reading = "false";
      navigateDesktop(state, activity.target, ids);
      render({ focus: document.activeElement === trigger });
    };
    const disk = root.querySelector(`.bos-disk[data-os-project="${id}"]`);
    if (
      motion.matches ||
      state.focused ||
      !disk ||
      typeof disk.animate !== "function"
    ) {
      finish();
      return;
    }
    const from = disk.getBoundingClientRect(),
      to = $(".bos-drive").getBoundingClientRect(),
      base = root.getBoundingClientRect();
    const flying = disk.cloneNode(true);
    flying.classList.add("bos-floppy-flight");
    flying.inert = true;
    flying.setAttribute("aria-hidden", "true");
    flying.removeAttribute("data-os-project");
    flying.style.setProperty(
      "--bos-disk-color",
      getComputedStyle(disk).getPropertyValue("--bos-disk-color"),
    );
    Object.assign(flying.style, {
      left: `${from.left - base.left}px`,
      top: `${from.top - base.top}px`,
      width: `${from.width}px`,
      height: `${from.height}px`,
    });
    root.append(flying);
    ghost = flying;
    const dx = to.left + to.width / 2 - from.left - from.width / 2,
      dy = to.top + to.height / 2 - from.top - from.height / 2;
    const animation = flying.animate(
      [
        { transform: "translate(0,0) rotate(0deg)", opacity: 1 },
        {
          offset: 0.8,
          transform: `translate(${dx}px,${dy - 20}px) scale(.7) rotate(-8deg)`,
          opacity: 1,
        },
        { transform: `translate(${dx}px,${dy}px) scale(.6,.06)`, opacity: 0 },
      ],
      { duration: 850, easing: "cubic-bezier(.4,0,.2,1)", fill: "forwards" },
    );
    flight = animation;
    animation.finished.then(
      () => {
        flying.remove();
        if (flight === animation) {
          flight = null;
          ghost = null;
        }
        finish();
      },
      () => flying.remove(),
    );
  }
  function boot() {
    stop();
    if (motion.matches) {
      open("home", { focus: false });
      return;
    }
    const revision = beginActivity(state, "boot", "home");
    bootReturn = document.activeElement;
    mainParts.forEach((element) => {
      element.inert = true;
    });
    $(".bos-boot").hidden = false;
    $(".bos-boot-text").textContent = words().boot[0];
    $(".bos-skip").focus({ preventScroll: true });
    status(words().restarting);
    [400, 850, 1350].forEach((ms, i) =>
      timers.push(
        setTimeout(() => {
          if (state.revision === revision && root.isConnected)
            $(".bos-boot-text").textContent = words()
              .boot.slice(0, i + 2)
              .join("\n\n");
        }, ms),
      ),
    );
    timers.push(
      setTimeout(() => {
        if (!completeActivity(state, revision) || !root.isConnected) return;
        stop();
        navigateDesktop(state, "home", ids);
        render();
      }, 1750),
    );
  }
  listen(root, "click", (event) => {
    const button = event.target.closest("button");
    if (!button || !root.contains(button)) return;
    if (button.dataset.osProject) {
      loadProject(button.dataset.osProject, button);
      return;
    }
    if (button.dataset.open) {
      open(button.dataset.open);
      return;
    }
    if (button.dataset.osTab) {
      if (!["overview", "toolkit"].includes(button.dataset.osTab)) return;
      stop();
      selectDesktopTab(state, button.dataset.osTab);
      render();
      root
        .querySelector(`[data-os-tab="${state.tab}"]`)
        .focus({ preventScroll: true });
      return;
    }
    if (button.dataset.osPage !== undefined) {
      stop();
      directoryPage(state, Number(button.dataset.osPage), projects.length);
      render({ focus: true });
      return;
    }
    if (button.classList.contains("bos-close")) {
      stop();
      state.closed = true;
      $(".bos-window").hidden = true;
      $(".bos-wallpaper").hidden = false;
      status(words().desktopReady);
      root.querySelector(".bos-icons button").focus({ preventScroll: true });
      return;
    }
    if (button.classList.contains("bos-power")) {
      boot();
      return;
    }
    if (button.classList.contains("bos-skip")) {
      stop();
      navigateDesktop(state, "home", ids);
      render();
      return;
    }
    if (button.classList.contains("bos-focus")) {
      stop();
      state.focused = !state.focused;
      root.dataset.focused = String(state.focused);
      button.setAttribute("aria-pressed", String(state.focused));
      button.textContent = state.focused ? words().unfocus : words().focus;
    }
  });
  listen(root, "keydown", (event) => {
    if (event.key === "Escape" && state.activity?.kind === "boot") {
      event.preventDefault();
      stop();
      render();
    }
  });
  listen(window, "portfolio:language", localize);
  listen(window, "portfolio:inspect", () => stop());
  function settle() {
    const pending = state.activity;
    stop();
    if (pending) {
      navigateDesktop(state, pending.target, ids);
      render();
    }
  }
  listen(motion, "change", () => {
    if (motion.matches) settle();
  });
  listen(document, "visibilitychange", () => {
    if (document.hidden) settle();
  });
  function dispose() {
    stop({ restoreFocus: false });
    events.abort();
    observer.disconnect();
  }
  listen(window, "pagehide", (event) => {
    if (event.persisted) settle();
    else dispose();
  });
  const observer = new MutationObserver(() => {
    if (!root.isConnected) dispose();
  });
  observer.observe(document.body, { childList: true, subtree: true });
  $(".bos-key-rows").replaceChildren(
    ...Array.from({ length: 23 }, () => document.createElement("span")),
  );
  localize();
}
