// Waypoint welcome-tour ownership. Loaded as an ordered classic script.

const WelcomeTourController = {
  active: false,
  step: "welcome",
  phase: "",
  originalTheme: "",
  themeDecision: null,
  target: null,
  commandCenterActivated: false,
  abortController: null,
  resizeFrame: null,
  steps: ["search", "command", "fetch", "appearance", "workspace", "keys", "complete"],

  start() {
    this.cancel(false);
    this.active = true;
    this.step = "welcome";
    this.phase = "";
    this.originalTheme = data.settings.theme;
    this.themeDecision = null;
    this.commandCenterActivated = false;
    this.abortController = new AbortController();
    document.body.classList.add("welcome-tour-active");
    this.bind();
    closeAllModals();
    if (editLayoutActive) setEditLayoutMode(false);
    this.render();
  },

  bind() {
    const options = { signal: this.abortController.signal };
    document.addEventListener("keydown", event => this.handleKeydown(event), { ...options, capture: true });
    window.addEventListener("resize", () => this.schedulePosition(), options);
    window.addEventListener("scroll", () => this.schedulePosition(), { ...options, capture: true });
    $("searchInput")?.addEventListener("focus", () => {
      if (this.step === "search") this.go("command");
    }, options);
    $("logoBtn")?.addEventListener("click", () => {
      if (this.step === "command") this.commandCenterActivated = true;
    }, { ...options, capture: true });
    document.addEventListener("waypoint:terminal-opened", event => {
      if (this.step === "command" && this.commandCenterActivated && event.detail.source === "logo") this.go("fetch");
      else if (this.step === "fetch") this.render();
    }, options);
    document.addEventListener("waypoint:terminal-command-completed", event => {
      if (this.step === "fetch" && event.detail.command === "fetch" && event.detail.success) {
        this.phase = "done";
        this.render();
      }
    }, options);
    document.addEventListener("waypoint:settings-page-changed", event => {
      if (this.step === "appearance" && event.detail.page === "appearance") {
        this.phase = "theme";
        this.render();
      } else if (this.step === "workspace" && event.detail.page === "layout") {
        this.phase = "studio";
        this.render();
      }
    }, options);
    document.addEventListener("waypoint:theme-changed", () => {
      if (this.step === "appearance" && this.phase === "theme") this.go("workspace", "entry");
    }, options);
    document.addEventListener("waypoint:workspace-studio-opened", () => {
      if (this.step !== "workspace") return;
      setEditLayoutMode(false);
      this.go("keys", data.settings.keyboardNavigation ? "try" : "choice");
    }, options);
    document.addEventListener("waypoint:waypointkeys-section-selected", () => {
      if (this.step === "keys" && this.phase === "try") this.go("complete");
    }, options);
    document.addEventListener("waypoint:rendered", () => {
      if (this.active) requestAnimationFrame(() => this.render());
    }, options);
    document.addEventListener("waypoint:modal-closed", () => {
      if (this.active) requestAnimationFrame(() => this.render());
    }, options);
  },

  go(step, phase = "") {
    if (!this.active) return;
    this.clearTarget();
    this.step = step;
    this.phase = phase;
    this.render();
  },

  cancel(restoreFocus = true) {
    if (!this.active) return;
    this.active = false;
    this.abortController?.abort();
    this.abortController = null;
    cancelAnimationFrame(this.resizeFrame);
    this.clearTarget();
    document.body.classList.remove("welcome-tour-active");
    const root = $("welcomeTour");
    if (root) root.hidden = true;
    if (restoreFocus) $("logoBtn")?.focus({ preventScroll: true });
  },

  finish() {
    if (data.settings.theme !== this.originalTheme && !this.themeDecision) return;
    this.cancel();
  },

  restart() {
    this.start();
  },

  restoreTheme() {
    data.settings.theme = this.originalTheme;
    this.themeDecision = "restored";
    save();
    renderAppearance();
    this.render();
  },

  keepTheme() {
    this.themeDecision = "kept";
    this.render();
  },

  enableKeys() {
    data.settings.keyboardNavigation = true;
    clearKeyboardNavigation();
    save();
    renderBookmarkSettings();
    this.phase = "try";
    this.render();
  },

  handleKeydown(event) {
    if (!this.active) return;
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopImmediatePropagation();
      this.cancel();
      return;
    }
    if (!["welcome", "complete"].includes(this.step) || event.key !== "Tab") return;
    const focusable = [...$("welcomeTourCallout").querySelectorAll("button:not(:disabled)")];
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  },

  progress() {
    if (this.step === "welcome") return "1 of 7";
    const index = this.steps.indexOf(this.step);
    return index >= 0 && this.step !== "complete" ? `${index + 2} of 7` : "Tour complete";
  },

  content() {
    const settingsLink = document.querySelector('.link.internal-link a[href^="waypoint:settings"]')?.closest(".link");
    const root = $("welcomeTour");
    const isTerminalOpen = !$("terminalModal")?.classList.contains("hidden");
    const isSettingsOpen = !$("settingsModal")?.classList.contains("hidden");
    if (this.step === "welcome") return {
      title: "Welcome to Waypoint",
      body: "<p>This short tour demonstrates the main interface by letting you use the real controls.</p><p>It will not create bookmarks, change your layout, or take you away from Waypoint.</p>",
      blocking: true,
      actions: [["Start Tour", () => this.go("search")]]
    };
    if (this.step === "search") return {
      title: "Search",
      body: "<p>Search is Waypoint’s normal browser search entry point.</p><p>Focus or click the search field to continue. You do not need to submit anything.</p>",
      target: () => $("searchInput"),
      fallback: [["Skip This Step", () => this.go("command")]]
    };
    if (this.step === "command") return {
      title: "Command center",
      body: "<p>The Waypoint logo opens the command center. Use the highlighted control to open the real terminal.</p>",
      target: () => $("logoBtn"),
      fallback: [["Skip This Step", () => this.go("fetch")]]
    };
    if (this.step === "fetch") return {
      title: "Try a terminal command",
      body: this.phase === "done"
        ? "<p>Waypoint ran the real <code>fetch</code> command successfully. Continue when you’re ready.</p>"
        : "<p>Type <code>fetch</code> in the real terminal and press Enter. The tour advances only after Waypoint runs it successfully.</p>",
      target: () => isTerminalOpen ? document.querySelector("#terminalModal .terminal-window") : null,
      actions: this.phase === "done" ? [["Continue", () => {
        closeModal("terminalModal");
        this.go("appearance", "entry");
      }]] : [],
      fallback: [["Reopen Terminal", () => openModal("terminalModal", { source: "tour-recovery" })]]
    };
    if (this.step === "appearance" && this.phase === "theme") return {
      title: "Choose a theme",
      body: "<p>Themes coordinate Waypoint’s interface while preserving your own uploaded images.</p><p>Choose a theme from the highlighted selector to continue.</p>",
      target: () => isSettingsOpen ? $("themeSelect") : null,
      fallback: [["Reopen Appearance", () => openSettingsPage("appearance", { source: "tour-recovery" })]]
    };
    if (this.step === "appearance") return {
      title: "Settings and appearance",
      body: settingsLink
        ? "<p>Open Settings through the highlighted bookmark. We’ll continue on Appearance.</p>"
        : "<p>Your profile does not currently expose a Settings bookmark. Use the recovery action to open the existing Appearance page safely.</p>",
      target: () => document.querySelector('.link.internal-link a[href^="waypoint:settings"]')?.closest(".link"),
      fallback: [["Open Appearance Settings", () => openSettingsPage("appearance", { source: "tour-recovery" })]]
    };
    if (this.step === "workspace" && this.phase === "studio") return {
      title: "Customize Workspace",
      body: "<p>Workspace owns layout and widget placement. Open Workspace Studio; you do not need to move or hide anything.</p>",
      target: () => isSettingsOpen ? $("editLayoutBtn") : null,
      fallback: [["Reopen Workspace Settings", () => openSettingsPage("layout", { source: "tour-recovery" })]]
    };
    if (this.step === "workspace") return {
      title: "Workspace",
      body: "<p>Open the Workspace page to find layout and widget controls.</p>",
      target: () => isSettingsOpen ? document.querySelector('[data-settings-page="layout"]') : null,
      fallback: [["Open Workspace Settings", () => openSettingsPage("layout", { source: "tour-recovery" })]]
    };
    if (this.step === "keys" && this.phase === "choice") return {
      title: "WaypointKeys",
      body: "<p>WaypointKeys lets you focus a section with its displayed letter, then choose a bookmark. It is currently disabled.</p><p>Enabling it is a real setting change and will remain enabled.</p>",
      blocking: true,
      actions: [
        ["Enable and Try It", () => this.enableKeys()],
        ["Skip This Step", () => this.go("complete")]
      ]
    };
    if (this.step === "keys") {
      const firstHint = document.querySelector(".section .section-key-hint");
      const key = firstHint?.textContent?.trim() || "the shown";
      return {
        title: "Try WaypointKeys",
        body: `<p>Press <code>${escapeHtml(key)}</code> to focus the highlighted section. The tour stops there, so no bookmark will launch.</p>`,
        target: () => document.querySelector(".section .section-key-hint")?.closest(".section"),
        fallback: [["Skip This Step", () => this.go("complete")]]
      };
    }
    const themeChanged = data.settings.theme !== this.originalTheme;
    const decisionNeeded = themeChanged && !this.themeDecision;
    return {
      title: "You’re ready",
      body: "<p>You used Search, the Command Center, Themes, Workspace, and WaypointKeys.</p><p>You can restart this tour any time from the Welcome bookmark or with <code>welcome</code> in the terminal.</p>",
      blocking: true,
      actions: [
        ...(themeChanged ? [
          ["Keep Current Theme", () => this.keepTheme(), this.themeDecision === "kept"],
          ["Restore Original Theme", () => this.restoreTheme(), this.themeDecision === "restored"]
        ] : []),
        ["Finish", () => this.finish(), false, decisionNeeded],
        ["Restart Tour", () => this.restart()]
      ]
    };
  },

  render() {
    if (!this.active) return;
    const root = $("welcomeTour");
    const callout = $("welcomeTourCallout");
    const details = this.content();
    root.hidden = false;
    $("welcomeTourProgress").textContent = this.progress();
    $("welcomeTourTitle").textContent = details.title;
    $("welcomeTourDescription").innerHTML = details.body;
    $("welcomeTourStatus").textContent = `${this.progress()} ${details.title}. ${$("welcomeTourDescription").textContent}`;
    callout.classList.toggle("is-blocking", !!details.blocking);
    callout.setAttribute("aria-modal", details.blocking ? "true" : "false");
    if (details.blocking) {
      callout.style.removeProperty("left");
      callout.style.removeProperty("top");
      callout.style.removeProperty("transform");
    }
    const actions = $("welcomeTourActions");
    actions.innerHTML = "";
    (details.actions || []).forEach(([label, handler, selected, disabled]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = selected ? `✓ ${label}` : label;
      button.disabled = !!disabled;
      button.addEventListener("click", handler);
      actions.appendChild(button);
    });
    const resolvedTarget = details.target?.();
    const targetAvailable = resolvedTarget && resolvedTarget.getClientRects().length;
    if (!details.blocking && !targetAvailable) {
      (details.fallback || []).forEach(([label, handler]) => {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = label;
        button.addEventListener("click", handler);
        actions.appendChild(button);
      });
    }
    this.clearTarget();
    this.targetResolver = details.target || null;
    this.renderTarget();
    if (details.blocking) requestAnimationFrame(() => actions.querySelector("button")?.focus());
  },

  clearTarget() {
    this.target?.classList.remove("welcome-tour-target");
    this.target = null;
  },

  renderTarget() {
    if (!this.active) return;
    this.clearTarget();
    const target = this.targetResolver?.();
    const focus = $("welcomeTourFocus");
    if (!target || !target.getClientRects().length) {
      focus.hidden = true;
      this.positionShades(null);
      return;
    }
    this.target = target;
    target.classList.add("welcome-tour-target");
    const rect = target.getBoundingClientRect();
    if (rect.top < 8 || rect.bottom > innerHeight - 8 || rect.left < 8 || rect.right > innerWidth - 8) {
      target.scrollIntoView({ block: "center", inline: "center", behavior: "auto" });
      requestAnimationFrame(() => this.renderTarget());
      return;
    }
    const pad = 7;
    const box = {
      left: Math.max(8, rect.left - pad),
      top: Math.max(8, rect.top - pad),
      right: Math.min(innerWidth - 8, rect.right + pad),
      bottom: Math.min(innerHeight - 8, rect.bottom + pad)
    };
    focus.hidden = false;
    Object.assign(focus.style, {
      left: `${box.left}px`, top: `${box.top}px`,
      width: `${Math.max(0, box.right - box.left)}px`,
      height: `${Math.max(0, box.bottom - box.top)}px`
    });
    this.positionShades(box);
    this.positionCallout(box);
  },

  positionShades(box) {
    const shades = Object.fromEntries([...document.querySelectorAll("[data-tour-shade]")].map(el => [el.dataset.tourShade, el]));
    Object.values(shades).forEach(shade => {
      shade.style.display = "none";
      shade.style.removeProperty("left");
      shade.style.removeProperty("top");
      shade.style.removeProperty("width");
      shade.style.removeProperty("height");
      shade.style.removeProperty("inset");
    });
    if (!box) {
      Object.assign(shades.top.style, { display: "block", inset: "0" });
    }
  },

  positionCallout(box) {
    const callout = $("welcomeTourCallout");
    if (callout.classList.contains("is-blocking") || innerWidth <= 680) return;
    callout.style.transform = "none";
    const gap = 16;
    const width = callout.offsetWidth;
    const height = callout.offsetHeight;
    let left = box.right + gap;
    if (left + width > innerWidth - 12) left = box.left - width - gap;
    left = Math.max(12, Math.min(left, innerWidth - width - 12));
    let top = Math.max(12, Math.min(box.top, innerHeight - height - 12));
    Object.assign(callout.style, { left: `${left}px`, top: `${top}px` });
  },

  schedulePosition() {
    cancelAnimationFrame(this.resizeFrame);
    this.resizeFrame = requestAnimationFrame(() => this.renderTarget());
  }
};

function startWelcomeGuide() {
  WelcomeTourController.start();
}
