// Waypoint application composition and bootstrap.

function syncBookmarkPresentationClasses() {
  document.body.classList.toggle("bookmark-list-layout", (data.settings.bookmarkLayout || "list") === "list");
  document.body.classList.toggle("bookmark-grid-layout", (data.settings.bookmarkLayout || "list") === "grid");
  document.body.classList.toggle("keyboard-navigation-enabled", data.settings.keyboardNavigation === true);
}

function renderAppearance() {
  return measureWaypointRender("waypoint:appearance:update", () => {
    applyTheme();
    applyPersonalization();
    applyHero();
    updateLogoPrompt();
    syncControls();
    applyWidgetFoundation();
    ensureWorkspaceLauncher();
    updateEditLayoutBar();
    renderTerminal();
    emitRendered();
  });
}

function renderWorkspace() {
  return measureWaypointRender("waypoint:workspace:update", () => {
    syncLegacyVisibilityFromWorkspace();
    syncBookmarkPresentationClasses();
    applyPersonalization();
    applyHero();
    syncControls();
    applyWidgetFoundation();
    ensureWorkspaceLauncher();
    updateEditLayoutBar();
    syncSectionFocusDom();
    emitRendered();
  });
}

function renderBookmarkSettings({ rebuild = false } = {}) {
  syncBookmarkPresentationClasses();
  applyPersonalization();
  syncControls();
  if (rebuild) renderSections();
  syncSectionFocusDom();
  emitRendered();
}

function render() {
  return measureWaypointRender("waypoint:render:full", () => {
    syncLegacyVisibilityFromWorkspace();
    syncBookmarkPresentationClasses();
    applyTheme();
    applyPersonalization();
    applyHero();
    updateLogoPrompt();
    syncControls();
    renderSections();
    syncSectionFocusDom();
    applyWidgetFoundation();
    ensureWorkspaceLauncher();
    updateEditLayoutBar();
    renderTerminal();
    updateWeatherWidget();
    applySearchEngine();
    emitRendered();
  });
}

function bindEvents() {
  document.addEventListener("click", event => {
    if (!editLayoutActive) return;
    if (event.target.closest("#workspaceDesignerPanel")) return;
    const widgetEl = event.target.closest(".waypoint-widget");
    if (!widgetEl) return;
    const widgetId = widgetEl.dataset.widgetId;
    if (!widgetId || !WORKSPACE_WIDGETS[widgetId]) return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    selectWorkspaceWidget(widgetId);
  }, true);
  $("logoBtn")?.addEventListener("click", () => openModal("terminalModal", { source: "logo" }));
  setupTerminalDrag();
  setupSettingsDrag();
  $("settingsBtn")?.addEventListener("click", () => openModal("settingsModal"));
  $("weatherWidget")?.addEventListener("click", () => { openSettingsPage("weather"); setTimeout(() => $("weatherLocationInput")?.focus(), 80); });
  $("clock")?.addEventListener("click", focusSearch);
  $("saveLinkBtn")?.addEventListener("click", saveLink);
  $("searchForm")?.addEventListener("submit", e => {
    const form = e.currentTarget;
    const query = ($("searchInput")?.value || "").trim();
    if (form.dataset.customSearch && query) {
      e.preventDefault();
      location.href = form.dataset.customSearch.replace("%s", encodeURIComponent(query));
    }
  });
  $("searchInput")?.addEventListener("keydown", event => {
    if (event.key !== "Escape") return;
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.blur();
    clearKeyboardNavigation();
  });
  $("sectionFocusBackdrop")?.addEventListener("click", () => {
    clearKeyboardNavigation();
    clearSectionFocus();
  });
  document.addEventListener("click", event => {
    if (focusedSectionIndex === null || event.target.closest(".section-focused, .modal")) return;
    clearKeyboardNavigation();
    clearSectionFocus();
  });
  $("linkUrl")?.addEventListener("keydown", e => { if (e.key === "Enter") saveLink(); });
  $("linkName")?.addEventListener("keydown", e => { if (e.key === "Enter") $("linkUrl")?.focus(); });
  $("linkUrl")?.addEventListener("input", e => {
    if (pendingLinkIcon) return;
    const iconPreview = $("linkIconPreview");
    if (!iconPreview) return;
    const src = favicon(e.target.value);
    iconPreview.src = src || "";
    iconPreview.classList.toggle("empty", !src);
  });
  $("linkIconInput")?.addEventListener("change", e => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      pendingLinkIcon = String(reader.result || "");
      const iconPreview = $("linkIconPreview");
      if (iconPreview) { iconPreview.src = pendingLinkIcon; iconPreview.classList.remove("empty"); }
      const clearIconBtn = $("clearLinkIconBtn");
      if (clearIconBtn) clearIconBtn.disabled = false;
    };
    reader.readAsDataURL(file);
  });
  $("clearLinkIconBtn")?.addEventListener("click", () => {
    pendingLinkIcon = "";
    const iconPreview = $("linkIconPreview");
    const src = favicon($("linkUrl")?.value || "");
    if (iconPreview) { iconPreview.src = src || ""; iconPreview.classList.toggle("empty", !src); }
    const clearIconBtn = $("clearLinkIconBtn");
    if (clearIconBtn) clearIconBtn.disabled = true;
  });

  document.querySelectorAll(".settings-tab").forEach(btn => btn.addEventListener("click", () => openSettingsPage(btn.dataset.settingsPage || "appearance")));
  document.querySelectorAll("[data-close-modal]").forEach(btn => btn.addEventListener("click", () => {
    if (btn.dataset.closeModal === "welcomeGuideModal") closeWelcomeGuide();
    else closeModal(btn.dataset.closeModal);
  }));
  document.querySelectorAll(".modal").forEach(modal => modal.addEventListener("click", e => {
    if (e.target !== modal) return;
    if (modal.id === "welcomeGuideModal") closeWelcomeGuide();
    else closeModal(modal.id);
  }));
  $("confirmationAcceptBtn")?.addEventListener("click", () => finishWaypointConfirmation(true));
  document.querySelectorAll("[data-command]").forEach(btn => btn.addEventListener("click", () => executeButtonCommand(btn.dataset.command)));
  $("welcomeGuideActions")?.addEventListener("click", handleWelcomeGuideAction);

  $("commandInput")?.addEventListener("keydown", e => {
    if (e.key === "Enter" && e.target.value.trim()) {
      e.preventDefault();
      const value = e.target.value;
      e.target.value = "";
      runCommand(value);
      return;
    }
  });

  $("importFile")?.addEventListener("change", e => { const file = e.target.files[0]; if (file) importJsonFile(file); e.target.value = ""; });
  $("exportBtn")?.addEventListener("click", () => exportJson("complete"));
  $("exportWorkspaceBtn")?.addEventListener("click", () => exportJson("workspace"));
  $("exportBookmarksBtn")?.addEventListener("click", () => exportJson("bookmarks"));
  $("exportSettingsBtn")?.addEventListener("click", () => exportJson("settings"));
  $("importBtn")?.addEventListener("click", () => $("importFile")?.click());

  bindLiveSetting("userNameInput", "userName", sanitizeUserName);
  bindSetting("weatherLocationInput", "change", value => { data.settings.weatherLocation = value.trim().slice(0, 80); save(); refreshWeather(true); renderTerminal(); });
  bindSetting("weatherUnitSelect", "change", value => { data.settings.weatherUnit = value; save(); refreshWeather(true); });
  bindSetting("searchEngineSelect", "change", value => { data.settings.searchEngine = value; save(); applySearchEngine(); renderTerminal(); });
  bindSetting("customSearchInput", "change", value => { data.settings.customSearchUrl = value.trim().slice(0, 240); save(); applySearchEngine(); });
  bindSetting("themeSelect", "change", value => {
    data.settings.theme = value;
    save();
    renderAppearance();
  });
  bindSetting("fontSelect", "change", value => { data.settings.fontFamily = value; save(); renderAppearance(); });
  bindLiveSetting("uiScaleSlider", "uiScale", value => Number(value));
  bindSetting("customAppearanceSelect", "change", value => {
    const enabled = value === "true";
    data.settings.useCustomAppearance = enabled;
    data.settings.useCustomColors = enabled;
    data.settings.useCustomTextColors = enabled;
    save();
    renderAppearance();
  });
  bindLiveSetting("accentColorInput", "customAccent");
  bindLiveSetting("panelColorInput", "customPanel");
  bindLiveSetting("globalTextColorInput", "customText");
  bindLiveSetting("sectionTitleColorInput", "sectionTitleColor");
  bindLiveSetting("bookmarkTextColorInput", "bookmarkTextColor");
  bindLiveSetting("mutedTextColorInput", "mutedTextColor");
  bindLiveSetting("terminalTextColorInput", "terminalTextColor");
  bindLiveSetting("statusTextColorInput", "statusTextColor");
  $("applyWorkspaceTemplateBtn")?.addEventListener("click", () => { applyWorkspaceTemplate($("workspaceTemplateSelect")?.value || "classic"); save(); renderWorkspace(); });
  bindSetting("workspaceHeroStyleSelect", "change", value => { setWorkspaceHeroStyle(value); save(); renderWorkspace(); });
  bindSetting("showLogoSelect", "change", value => { setWidgetVisible("logo", value === "true"); save(); renderWorkspace(); });
  bindSetting("showWordmarkSelect", "change", value => { setWidgetVisible("wordmark", value === "true"); save(); renderWorkspace(); });
  bindSetting("showClockSelect", "change", value => { setWidgetVisible("clock", value === "true"); save(); renderWorkspace(); });
  bindSetting("showWeatherSelect", "change", value => { setWidgetVisible("weather", value === "true"); save(); renderWorkspace(); });
  bindSetting("showSearchSelect", "change", value => { setWidgetVisible("search", value === "true"); save(); renderWorkspace(); });
  bindSetting("showSectionTitlesSelect", "change", value => { data.settings.workspace.display.showSectionTitles = value === "true"; data.settings.workspace.modified = true; syncLegacyVisibilityFromWorkspace(); save(); renderWorkspace(); });
  $("editLayoutBtn")?.addEventListener("click", toggleEditLayoutMode);
  document.addEventListener("click", event => {
    if (!editLayoutActive || !selectedWorkspaceWidgetId) return;
    if (event.target.closest(".waypoint-widget") || event.target.closest("#workspaceDesignerPanel")) return;
    clearWorkspaceSelection();
  });
  bindSetting("keyboardNavigationSelect", "change", value => {
    data.settings.keyboardNavigation = value === "true";
    clearKeyboardNavigation();
    save();
    renderBookmarkSettings();
  });
  bindLiveSetting("bookmarkFontSlider", "bookmarkFontSize", value => Number(value));
  bindLiveSetting("bookmarkIconSlider", "bookmarkIconSize", value => Number(value));
  bindLiveSetting("customCssInput", "customCss", value => value.slice(0, 8000));
  $("cssManBtn")?.addEventListener("click", () => { openModal("terminalModal"); runCommand("help css"); });
  $("clearCustomCssBtn")?.addEventListener("click", () => { data.settings.customCss = ""; save(); renderAppearance(); });
  $("resetEverythingBtn")?.addEventListener("click", resetEverything);
  bindSetting("backgroundModeSelect", "change", value => { data.settings.backgroundMode = value; save(); renderAppearance(); });
  bindSetting("heroStyleSelect", "change", value => {
    if (value === "hidden") {
      data.settings.heroStyle = "auto";
      setBannerSize("hidden");
      return;
    }
    data.settings.heroStyle = value;
    if (data.settings.heroSize === "hidden") {
      setBannerSize("medium");
      return;
    }
    save(); renderAppearance();
  });
  bindSetting("bookmarkLayoutSelect", "change", value => { data.settings.bookmarkLayout = value; save(); renderBookmarkSettings(); });
  bindSetting("shortcutSelect", "change", value => { data.settings.shortcut = value; save(); renderTerminal(); });
  bindLiveSetting("overlaySlider", "overlay", value => Number(value));
  bindLiveSetting("blurSlider", "blur", value => Number(value));
  bindSetting("heroHeightPresetSelect", "change", value => {
    setBannerSize(value);
  });

  $("backgroundUpload")?.addEventListener("change", e => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { WaypointStorage.saveRaw(CUSTOM_BG_KEY, reader.result); data.settings.backgroundMode = "custom"; save(); renderAppearance(); };
    reader.readAsDataURL(file);
  });
  $("imageUpload")?.addEventListener("change", e => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { WaypointStorage.saveRaw(CUSTOM_HERO_KEY, reader.result); data.settings.heroStyle = "custom"; save(); renderAppearance(); };
    reader.readAsDataURL(file);
  });
  $("resetBackgroundBtn")?.addEventListener("click", () => { WaypointStorage.remove(CUSTOM_BG_KEY); data.settings.backgroundMode = "wallpaper"; save(); renderAppearance(); });
  $("resetHeroBtn")?.addEventListener("click", () => { WaypointStorage.remove(CUSTOM_HERO_KEY); data.settings.heroStyle = "auto"; save(); renderAppearance(); });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !$("confirmationModal")?.classList.contains("hidden")) {
      event.preventDefault();
      closeModal("confirmationModal");
      return;
    }
    if (event.key === "Escape" && editLayoutActive) return setEditLayoutMode(false);
    if (event.key === "Escape" && keyboardNavigationSection !== null) {
      event.preventDefault();
      clearKeyboardNavigation();
      clearSectionFocus();
      return;
    }
    if (event.key === "Escape" && focusedSectionIndex !== null) {
      event.preventDefault();
      clearSectionFocus();
      return;
    }
    if (event.key === "Escape" && !$("welcomeGuideModal")?.classList.contains("hidden")) {
      event.preventDefault();
      closeWelcomeGuide();
      return;
    }
    if (event.key === "Escape") return closeAllModals();
    if (handleKeyboardNavigation(event)) return;
    if (event.target.matches("input, textarea, select") || event.target.isContentEditable) return;
    if (data.settings.shortcut === "altT" && event.altKey && !event.ctrlKey && !event.shiftKey && event.key.toLowerCase() === "t") {
      event.preventDefault(); openModal("terminalModal");
    }
    if (data.settings.shortcut === "ctrlShiftSpace" && event.ctrlKey && event.shiftKey && event.code === "Space") {
      event.preventDefault(); openModal("terminalModal");
    }
  });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") commitLiveSettings();
  });
  window.addEventListener("pagehide", commitLiveSettings);
}

async function initWaypoint() {
  data = await loadInitialProfile();
  bindEvents();
  render();
  if (data.settings.keyboardNavigation && document.activeElement === $("searchInput")) {
    $("searchInput").blur();
  }
  updateClock();
  setInterval(updateClock, 1000);
  requestAnimationFrame(() => {
    const startNonCriticalWork = () => {
      loadMetadata();
      refreshWeather(false);
      setInterval(() => refreshWeather(false), 30 * 60 * 1000);
    };
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(startNonCriticalWork, { timeout: 1500 });
    } else {
      setTimeout(startNonCriticalWork, 0);
    }
  });
}

initWaypoint();
addResetButtonEvents();
