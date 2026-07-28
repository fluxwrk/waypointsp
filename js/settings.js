// Waypoint settings ownership. Loaded as an ordered classic script.

const SETTINGS_PAGE_ALIASES = {
  appearance: "appearance",
  banner: "appearance",
  text: "appearance",
  textcolor: "appearance",
  textcolors: "appearance",
  colors: "appearance",
  advanced: "search",
  search: "search",
  layout: "layout",
  workspace: "layout",
  bookmarks: "bookmarks",
  bookmark: "bookmarks",
  weather: "weather",
  backup: "backup"
};

function normalizeSettingsPage(page = "appearance") {
  const key = String(page || "appearance").toLowerCase().replace(/^settings(?:[/:_-]+)?/, "").replace(/-?tab$/, "").replace(/[\s_-]+/g, "");
  return SETTINGS_PAGE_ALIASES[key] || "appearance";
}

function syncControls() {
  const s = data.settings;
  setValue("userNameInput", s.userName);
  setValue("weatherLocationInput", s.weatherLocation);
  setValue("weatherUnitSelect", s.weatherUnit);
  setValue("searchEngineSelect", s.searchEngine);
  setValue("customSearchInput", s.customSearchUrl);
  setValue("themeSelect", s.theme);
  setValue("fontSelect", s.fontFamily);
  setValue("uiScaleSlider", s.uiScale);
  setValue("customAppearanceSelect", String(!!s.useCustomAppearance));
  setValue("accentColorInput", s.customAccent);
  setValue("panelColorInput", s.customPanel);
  setValue("globalTextColorInput", s.customText);
  setValue("sectionTitleColorInput", s.sectionTitleColor);
  setValue("bookmarkTextColorInput", s.bookmarkTextColor);
  setValue("mutedTextColorInput", s.mutedTextColor);
  setValue("terminalTextColorInput", s.terminalTextColor);
  setValue("statusTextColorInput", s.statusTextColor);
  setValue("workspaceTemplateSelect", s.workspace?.template || s.layoutPreset || "classic");
  setValue("workspaceHeroStyleSelect", workspaceHeroStyle());
  const workspace = canonicalizeWorkspace();
  const templateLabel = WORKSPACE_TEMPLATES[workspace.template || "classic"]?.label || "Classic";
  const placedCount = Object.values(workspace.slots || {}).filter(slot => slot && slot !== "hidden").length;
  setText("workspaceTemplateStatus", `Workspace · ${workspace.modified ? "Customized" : templateLabel}`);
  setText("workspaceTemplateDescription", `${workspace.modified ? `Based on ${templateLabel}` : WORKSPACE_TEMPLATES[workspace.template || "classic"]?.description || "Workspace template"} · ${placedCount} items placed · ${WORKSPACE_HERO_STYLES[workspaceHeroStyle(workspace)]?.label || "Standard Header"}`);
  setValue("showLogoSelect", String(s.showLogo !== false));
  setValue("showWordmarkSelect", String(s.showWordmark !== false));
  setValue("showClockSelect", String(s.showClock !== false));
  setValue("showWeatherSelect", String(s.showWeather !== false));
  setValue("showSearchSelect", String(s.showSearch !== false));
  setValue("showSectionTitlesSelect", String(s.showSectionTitles !== false));
  setValue("backgroundModeSelect", s.backgroundMode);
  setValue("heroStyleSelect", s.heroStyle);
  setValue("shortcutSelect", s.shortcut);
  setValue("bookmarkLayoutSelect", s.bookmarkLayout || "list");
  setValue("keyboardNavigationSelect", String(!!s.keyboardNavigation));
  setValue("bookmarkFontSlider", s.bookmarkFontSize);
  setValue("bookmarkIconSlider", s.bookmarkIconSize);
  setValue("customCssInput", s.customCss || "");
  setValue("overlaySlider", s.overlay);
  setValue("blurSlider", s.blur);
  setValue("heroHeightPresetSelect", s.heroSize || normalizeHeroSize(null, s.heroHeight, s.heroStyle));
  setText("overlayValue", `${s.overlay}%`);
  setText("blurValue", `${s.blur}px`);
  setText("uiScaleValue", `${s.uiScale}%`);
  setText("bookmarkFontValue", `${s.bookmarkFontSize}px`);
  setText("bookmarkIconValue", `${s.bookmarkIconSize}px`);
  updateCustomAppearanceControls();
  updateWorkspaceAwareSettings();
}

function updateCustomAppearanceControls() {
  const enabled = data.settings.useCustomAppearance === true;
  const container = document.querySelector("[data-custom-appearance]");
  container?.classList.toggle("custom-appearance-disabled", !enabled);
  container?.querySelectorAll("input, select, textarea, button").forEach(control => {
    control.disabled = !enabled;
  });
}

function updateWorkspaceAwareSettings() {
  const workspace = canonicalizeWorkspace();
  const bannerUnavailable = workspace.slots.hero === "hidden" && data.settings.bannerHiddenByWorkspace === true;
  const bannerControlIds = ["heroStyleSelect", "heroHeightPresetSelect", "imageUpload", "resetHeroBtn"];
  bannerControlIds.forEach(id => {
    const el = $(id);
    if (!el) return;
    el.disabled = bannerUnavailable;
    const label = el.closest("label") || el;
    label.classList?.toggle("workspace-setting-unavailable", bannerUnavailable);
    if (bannerUnavailable) el.title = "Unavailable while the Banner widget is hidden in Workspace.";
    else el.removeAttribute("title");
  });
  const note = $("bannerWorkspaceNotice");
  if (note) {
    note.hidden = !bannerUnavailable;
    note.textContent = "Banner controls are unavailable because the Banner widget is hidden in Workspace.";
  }
}

function setValue(id, value) { const el = $(id); if (!el) return; if (document.activeElement === el) return; if (el.value !== String(value)) el.value = value; }

function setText(id, value) { const el = $(id); if (el) el.textContent = value; }

function positionSettings() {
  const win = document.querySelector("#settingsModal .settings-modal");
  if (!win) return;
  if (Number.isFinite(data.settings.settingsLeft) && Number.isFinite(data.settings.settingsTop)) {
    win.style.setProperty("--settings-left", `${data.settings.settingsLeft}px`);
    win.style.setProperty("--settings-top", `${data.settings.settingsTop}px`);
    win.style.transform = "none";
  } else {
    win.style.removeProperty("--settings-left");
    win.style.removeProperty("--settings-top");
    win.style.transform = "translateX(-50%)";
  }
}

function openSettingsPage(page = "appearance", context = {}) {
  commitLiveSettings();
  const targetPage = normalizeSettingsPage(page);
  document.querySelectorAll(".settings-tab").forEach(tab => tab.classList.toggle("active", tab.dataset.settingsPage === targetPage));
  document.querySelectorAll(".settings-page").forEach(panel => panel.classList.toggle("active", panel.dataset.page === targetPage));
  openModal("settingsModal", context);
  emitWaypointEvent("settings-page-changed", { page: targetPage, source: context.source || "interface" });
}

function resetEverything() {
  if (!confirm("Reset Waypoint to factory defaults? This clears bookmarks, settings, custom wallpaper, custom banner, and weather cache. It will not reload demo.json.")) return;
  WaypointStorage.remove(KEY);
  WaypointStorage.remove(CUSTOM_BG_KEY);
  WaypointStorage.remove(CUSTOM_HERO_KEY);
  WaypointStorage.remove(WEATHER_CACHE_KEY);
  data = structuredClone(defaultData);
  save();
  render();
  pushTerminal(terminalBlock(commandResult("Reboot complete. Defaults restored.")));
}

function setupSettingsDrag() {
  const win = document.querySelector("#settingsModal .settings-modal");
  const bar = $("settingsModalTitle");
  if (!win || !bar || bar.dataset.dragBound) return;
  bar.dataset.dragBound = "1";
  let dragging = false;
  let offsetX = 0;
  let offsetY = 0;
  bar.addEventListener("mousedown", event => {
    if (event.target.closest("button,input,select,textarea")) return;
    dragging = true;
    const rect = win.getBoundingClientRect();
    win.style.transform = "none";
    win.style.setProperty("--settings-left", `${rect.left}px`);
    win.style.setProperty("--settings-top", `${rect.top}px`);
    offsetX = event.clientX - rect.left;
    offsetY = event.clientY - rect.top;
    document.body.classList.add("dragging-settings");
    event.preventDefault();
  });
  window.addEventListener("mousemove", event => {
    if (!dragging) return;
    const maxLeft = Math.max(12, window.innerWidth - win.offsetWidth - 12);
    const maxTop = Math.max(12, window.innerHeight - win.offsetHeight - 12);
    const left = Math.min(maxLeft, Math.max(12, event.clientX - offsetX));
    const top = Math.min(maxTop, Math.max(12, event.clientY - offsetY));
    win.style.setProperty("--settings-left", `${left}px`);
    win.style.setProperty("--settings-top", `${top}px`);
    data.settings.settingsLeft = Math.round(left);
    data.settings.settingsTop = Math.round(top);
  });
  window.addEventListener("mouseup", () => {
    if (!dragging) return;
    dragging = false;
    document.body.classList.remove("dragging-settings");
    save();
  });
}

function bindSetting(id, eventName, setter) { $(id)?.addEventListener(eventName, e => setter(e.target.value)); }

function bindLiveSetting(id, key, normalize = value => value) {
  const control = $(id);
  if (!control) return;
  let keyboardInputActive = false;
  const preview = () => {
    if (previewLiveSetting(key, normalize(control.value))) scheduleLiveSettingsCommit();
  };
  control.addEventListener("input", preview);
  control.addEventListener("change", () => {
    preview();
    if (!keyboardInputActive) commitLiveSettings();
  });
  control.addEventListener("keydown", () => {
    keyboardInputActive = true;
  });
  control.addEventListener("keyup", () => {
    keyboardInputActive = false;
    scheduleLiveSettingsCommit();
  });
  control.addEventListener("blur", () => {
    keyboardInputActive = false;
    commitLiveSettings();
  });
}

function resetCategory(target) {
  const d = structuredClone(defaultData.settings);
  if (target === "appearance") {
    [
      "theme", "fontFamily", "uiScale",
      "backgroundMode", "overlay", "blur", "heroSize", "heroHeight", "heroStyle",
      "useCustomAppearance", "useCustomColors", "useCustomTextColors",
      "customAccent", "customPanel", "customText", "sectionTitleColor",
      "bookmarkTextColor", "mutedTextColor", "terminalTextColor", "statusTextColor",
      "customCss"
    ].forEach(k => data.settings[k] = d[k]);
    WaypointStorage.remove(CUSTOM_BG_KEY);
    WaypointStorage.remove(CUSTOM_HERO_KEY);
  }
  else if (target === "layout" || target === "workspace") { data.settings.workspace = defaultWorkspace(d.workspace?.template || "classic"); data.settings.shortcut = d.shortcut; syncLegacyVisibilityFromWorkspace(); }
  else if (target === "bookmarks") ["bookmarkLayout", "bookmarkFontSize", "bookmarkIconSize", "keyboardNavigation"].forEach(k => data.settings[k] = d[k]);
  else if (target === "weather") ["weatherLocation", "weatherUnit"].forEach(k => data.settings[k] = d[k]);
  else if (target === "banner") ["backgroundMode", "overlay", "blur", "heroSize", "heroHeight", "heroStyle"].forEach(k => data.settings[k] = d[k]);
  else if (target === "text" || target === "textcolors") ["useCustomTextColors", "sectionTitleColor", "bookmarkTextColor", "mutedTextColor", "terminalTextColor", "statusTextColor", "customText"].forEach(k => data.settings[k] = d[k]);
  else if (target === "advanced" || target === "search") ["searchEngine", "customSearchUrl"].forEach(k => data.settings[k] = d[k]);
  else if (target === "all" || target === "everything") { data = structuredClone(defaultData); WaypointStorage.remove(CUSTOM_BG_KEY); WaypointStorage.remove(CUSTOM_HERO_KEY); WaypointStorage.remove(WEATHER_CACHE_KEY); }
  else return false;
  save();
  if (target === "all" || target === "everything") render();
  else if (target === "layout" || target === "workspace") renderWorkspace();
  else if (target === "bookmarks") renderBookmarkSettings();
  else if (["appearance", "banner", "text", "textcolors"].includes(target)) renderAppearance();
  else {
    syncControls();
    applySearchEngine();
    renderTerminal();
    emitRendered();
  }
  refreshWeather(false);
  return true;
}

function addResetButtonEvents() {
  const map = { resetAppearanceBtn: "appearance", resetLayoutBtn: "workspace", resetBookmarksBtn: "bookmarks", resetWeatherBtn: "weather", resetSearchBtn: "search" };
  Object.entries(map).forEach(([id, target]) => $(id)?.addEventListener("click", () => resetCategory(target)));
}
