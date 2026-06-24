const KEY = "waypoint-data-v1";
const OLD_KEYS = ["startpage-data-v9", "startpage-data-v8", "startpage-data-v6", "startpage-data-v5", "startpage-data-v2", "startpage-data-v1"];
const CUSTOM_BG_KEY = "startpage-custom-background";
const CUSTOM_HERO_KEY = "startpage-custom-hero";
const WEATHER_CACHE_KEY = "startpage-weather-cache-v2";
const SEARCH_ENGINES = {
  google: { label: "Google", badge: "G", action: "https://www.google.com/search", param: "q", placeholder: "Search Google" },
  duckduckgo: { label: "DuckDuckGo", badge: "D", action: "https://duckduckgo.com/", param: "q", placeholder: "Search DuckDuckGo" },
  brave: { label: "Brave Search", badge: "B", action: "https://search.brave.com/search", param: "q", placeholder: "Search Brave" },
  bing: { label: "Bing", badge: "B", action: "https://www.bing.com/search", param: "q", placeholder: "Search Bing" },
  custom: { label: "Custom", badge: "~", action: "", param: "q", placeholder: "Search" }
};

const THEMES = {
  catppuccin: {
    label: "Catppuccin",
    wallpaper: "img/catppuccin-wallpaper.png",
    desktop: "img/catppuccin-desktop-banner.png",
    atmo: "img/catppuccin-atmo-banner.png",
    defaultHero: "atmo",
    gradient: "linear-gradient(135deg, #11111b 0%, #1e1e2e 47%, #313244 100%)",
    accent: "#cba6f7",
    bg: "#11111b",
    panel: "rgba(17, 17, 27, .70)",
    panelStrong: "rgba(17, 17, 27, .90)",
    text: "#cdd6f4",
    muted: "#a6adc8",
    border: "rgba(205, 214, 244, .15)"
  },
  nord: {
    label: "Nord",
    wallpaper: "img/nord-wallpaper.png",
    desktop: "img/nord-desktop-banner.png",
    atmo: "img/nord-atmo-banner.png",
    defaultHero: "atmo",
    gradient: "linear-gradient(135deg, #2e3440 0%, #3b4252 48%, #4c566a 100%)",
    accent: "#88c0d0",
    bg: "#2e3440",
    panel: "rgba(46, 52, 64, .70)",
    panelStrong: "rgba(46, 52, 64, .90)",
    text: "#eceff4",
    muted: "#d8dee9",
    border: "rgba(216, 222, 233, .16)"
  },
  gruvbox: {
    label: "Gruvbox",
    wallpaper: "img/gruvbox-wallpaper.png",
    desktop: "img/gruvbox-desktop-banner.png",
    atmo: "img/gruvbox-atmo-banner.png",
    defaultHero: "desktop",
    gradient: "linear-gradient(135deg, #1d2021 0%, #282828 50%, #3c3836 100%)",
    accent: "#d79921",
    bg: "#1d2021",
    panel: "rgba(29, 32, 33, .74)",
    panelStrong: "rgba(29, 32, 33, .92)",
    text: "#ebdbb2",
    muted: "#a89984",
    border: "rgba(235, 219, 178, .15)"
  },
  tokyoNight: {
    label: "Tokyo Night",
    wallpaper: "img/tokyo-night-wallpaper.png",
    desktop: "img/tokyo-night-desktop-banner.png",
    atmo: "img/tokyo-night-atmo-banner.png",
    defaultHero: "desktop",
    gradient: "linear-gradient(135deg, #1a1b26 0%, #24283b 50%, #414868 100%)",
    accent: "#7aa2f7",
    bg: "#1a1b26",
    panel: "rgba(26, 27, 38, .70)",
    panelStrong: "rgba(26, 27, 38, .90)",
    text: "#c0caf5",
    muted: "#9aa5ce",
    border: "rgba(192, 202, 245, .15)"
  }
};

const defaultData = {
  sections: [
    { name: "Social", links: [] },
    { name: "Media", links: [] },
    { name: "Server", links: [] },
    { name: "Web", links: [] },
    { name: "Linux", links: [] },
    { name: "Shopping", links: [] }
  ],
  settings: {
    theme: "nord",
    backgroundMode: "wallpaper",
    overlay: 35,
    blur: 0,
    heroHeight: 330,
    heroZoom: 100,
    heroY: 50,
    heroStyle: "auto",
    heroFit: "cover",
    bookmarkLayout: "list",
    userName: "",
    weatherLocation: "",
    weatherUnit: "auto",
    searchEngine: "google",
    customSearchUrl: "",
    shortcut: "none",
    fontFamily: "system",
    uiScale: 100,
    useCustomColors: false,
    customAccent: "#00d084",
    customPanel: "#09111a",
    customText: "#d8dee9",
    layoutPreset: "classic",
    showLogo: true,
    showWordmark: true,
    showClock: true,
    showWeather: true,
    showSearch: true,
    showSectionTitles: true,
    bookmarkColumns: "auto",
    bookmarkFontSize: 12,
    bookmarkIconSize: 22,
    customCss: "",
    terminalLeft: null,
    terminalTop: null,
    lastModified: null
  }
};

let data = loadData();
let activeSection = 0;
let editingLink = null;
let draggedSectionIndex = null;
let draggedLink = null;
let pendingLinkIcon = null;

function $(id) { return document.getElementById(id); }
function clamp(value, min, max, fallback) { return Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback; }
function safeParse(value) { try { return JSON.parse(value); } catch { return null; } }
function escapeHtml(value) { return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;"); }
function sanitizeUserName(value) { return String(value || "").trim().toLowerCase().replace(/[^a-z0-9._-]/g, "").slice(0, 32); }
function displayUserName() { return data.settings.userName || "user"; }
function normalizeUrl(url) { const t = String(url || "").trim(); if (!t) return ""; return /^https?:\/\//i.test(t) ? t : `https://${t}`; }
function favicon(url) { try { return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(new URL(url).hostname)}&sz=32`; } catch { return ""; } }
function getTheme() { return THEMES[data.settings.theme] || THEMES.nord; }
function countBookmarks() { return data.sections.reduce((sum, section) => sum + section.links.length, 0); }

function loadData() {
  const saved = safeParse(localStorage.getItem(KEY));
  if (saved) return normalizeData(saved);
  for (const oldKey of OLD_KEYS) {
    const old = safeParse(localStorage.getItem(oldKey));
    if (old) {
      const migrated = normalizeData(old);
      localStorage.setItem(KEY, JSON.stringify(migrated));
      return migrated;
    }
  }
  return structuredClone(defaultData);
}

function normalizeData(input) {
  const normalized = structuredClone(defaultData);

  if (Array.isArray(input.sections)) {
    normalized.sections = input.sections.map((section, index) => ({
      name: String(section.name || `Section ${index + 1}`),
      links: Array.isArray(section.links)
        ? section.links.filter(link => link && link.url).map(link => ({ name: String(link.name || link.url), url: String(link.url), icon: typeof link.icon === "string" ? link.icon : "" }))
        : []
    }));
  }

  const incomingSettings = input.settings && typeof input.settings === "object" ? input.settings : input;
  normalized.settings = { ...normalized.settings, ...incomingSettings };

  if (!THEMES[normalized.settings.theme]) normalized.settings.theme = "nord";
  if (!["wallpaper", "gradient", "custom"].includes(normalized.settings.backgroundMode)) normalized.settings.backgroundMode = "wallpaper";
  if (!["auto", "desktop", "atmo", "custom", "hidden"].includes(normalized.settings.heroStyle)) {
    if (normalized.settings.heroHidden) normalized.settings.heroStyle = "hidden";
    else if (normalized.settings.heroMode === "custom") normalized.settings.heroStyle = "custom";
    else normalized.settings.heroStyle = "auto";
  }

  normalized.settings.overlay = clamp(Number(normalized.settings.overlay ?? normalized.settings.backgroundDim), 0, 70, 35);
  normalized.settings.blur = clamp(Number(normalized.settings.blur ?? normalized.settings.backgroundBlur), 0, 20, 0);
  normalized.settings.heroHeight = clamp(Number(normalized.settings.heroHeight), 220, 360, 330);
  normalized.settings.heroZoom = clamp(Number(normalized.settings.heroZoom), 80, 140, 100);
  normalized.settings.heroY = clamp(Number(normalized.settings.heroY), 0, 100, 50);
  normalized.settings.heroFit = ["cover", "contain"].includes(normalized.settings.heroFit) ? normalized.settings.heroFit : "cover";
  normalized.settings.bookmarkLayout = ["grid", "list"].includes(normalized.settings.bookmarkLayout) ? normalized.settings.bookmarkLayout : "list";
  if (normalized.settings.heroFit === "contain") normalized.settings.heroFit = "cover";
  normalized.settings.userName = sanitizeUserName(normalized.settings.userName);
  normalized.settings.weatherLocation = String(normalized.settings.weatherLocation || "").trim().slice(0, 80);
  normalized.settings.weatherUnit = ["auto", "fahrenheit", "celsius"].includes(normalized.settings.weatherUnit) ? normalized.settings.weatherUnit : "auto";
  normalized.settings.searchEngine = SEARCH_ENGINES[normalized.settings.searchEngine] ? normalized.settings.searchEngine : "google";
  normalized.settings.customSearchUrl = String(normalized.settings.customSearchUrl || "").trim().slice(0, 240);
  normalized.settings.shortcut = ["altT", "ctrlShiftSpace", "none"].includes(normalized.settings.shortcut) ? normalized.settings.shortcut : "none";
  normalized.settings.fontFamily = ["system", "inter", "jetbrains", "fira", "roboto", "mono"].includes(normalized.settings.fontFamily) ? normalized.settings.fontFamily : "system";
  normalized.settings.uiScale = clamp(Number(normalized.settings.uiScale), 85, 120, 100);
  normalized.settings.useCustomColors = normalized.settings.useCustomColors === true || normalized.settings.useCustomColors === "true";
  normalized.settings.customAccent = /^#[0-9a-f]{6}$/i.test(normalized.settings.customAccent || "") ? normalized.settings.customAccent : "#00d084";
  normalized.settings.customPanel = /^#[0-9a-f]{6}$/i.test(normalized.settings.customPanel || "") ? normalized.settings.customPanel : "#09111a";
  normalized.settings.customText = /^#[0-9a-f]{6}$/i.test(normalized.settings.customText || "") ? normalized.settings.customText : "#d8dee9";
  normalized.settings.layoutPreset = ["classic", "minimal", "dashboard", "centered"].includes(normalized.settings.layoutPreset) ? normalized.settings.layoutPreset : "classic";
  ["showLogo", "showWordmark", "showClock", "showWeather", "showSearch", "showSectionTitles"].forEach(key => { normalized.settings[key] = normalized.settings[key] !== false && normalized.settings[key] !== "false"; });
  normalized.settings.bookmarkColumns = ["auto", "2", "3", "4"].includes(String(normalized.settings.bookmarkColumns)) ? String(normalized.settings.bookmarkColumns) : "auto";
  normalized.settings.bookmarkFontSize = clamp(Number(normalized.settings.bookmarkFontSize), 10, 15, 12);
  normalized.settings.bookmarkIconSize = clamp(Number(normalized.settings.bookmarkIconSize), 14, 36, 22);
  normalized.settings.customCss = String(normalized.settings.customCss || "").slice(0, 8000);
  normalized.settings.terminalLeft = normalized.settings.terminalLeft === null ? null : clamp(Number(normalized.settings.terminalLeft), 20, 4000, null);
  normalized.settings.terminalTop = normalized.settings.terminalTop === null ? null : clamp(Number(normalized.settings.terminalTop), 20, 4000, null);
  normalized.settings.lastModified = normalized.settings.lastModified || null;

  return normalized;
}

function save() {
  data.settings.lastModified = new Date().toISOString();
  localStorage.setItem(KEY, JSON.stringify(data));
  updateLogoPrompt();
  syncControls();
}

function hexToRgba(hex, alpha = 1) {
  const raw = String(hex || "#000000").replace("#", "");
  const n = parseInt(raw.length === 3 ? raw.split("").map(c => c + c).join("") : raw, 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
function colorMix(hexA, hexB, weightB = .5) {
  const toRgb = hex => {
    const raw = String(hex || "#000000").replace("#", "");
    const n = parseInt(raw.length === 3 ? raw.split("").map(c => c + c).join("") : raw, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  };
  const a = toRgb(hexA), b = toRgb(hexB);
  const rgb = a.map((v, i) => Math.round(v * (1 - weightB) + b[i] * weightB));
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}
function applyPersonalization() {
  const s = data.settings;
  const body = document.body;
  ["classic", "minimal", "dashboard", "centered"].forEach(p => body.classList.toggle(`layout-${p}`, s.layoutPreset === p));
  body.classList.toggle("ui-hide-logo", s.showLogo === false);
  body.classList.toggle("ui-hide-wordmark", s.showWordmark === false);
  body.classList.toggle("ui-hide-clock", s.showClock === false);
  body.classList.toggle("ui-hide-weather", s.showWeather === false);
  body.classList.toggle("ui-hide-search", s.showSearch === false);
  body.classList.toggle("ui-hide-section-titles", s.showSectionTitles === false);
  document.documentElement.style.setProperty("--ui-scale", String(s.uiScale / 100));
  document.documentElement.style.setProperty("--bookmark-font-size", `${s.bookmarkFontSize}px`);
  document.documentElement.style.setProperty("--bookmark-icon-size", `${s.bookmarkIconSize}px`);
  document.documentElement.style.setProperty("--bookmark-columns", s.bookmarkColumns === "auto" ? "" : s.bookmarkColumns);
  document.documentElement.dataset.bookmarkColumns = s.bookmarkColumns || "auto";
  const fonts = {
    system: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    inter: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    jetbrains: '"JetBrains Mono", "Fira Code", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    fira: '"Fira Sans", Inter, ui-sans-serif, system-ui, sans-serif',
    roboto: 'Roboto, Inter, ui-sans-serif, system-ui, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace'
  };
  document.documentElement.style.setProperty("--sans", fonts[s.fontFamily] || fonts.system);
  let style = $("waypointCustomCss");
  if (!style) { style = document.createElement("style"); style.id = "waypointCustomCss"; document.head.appendChild(style); }
  style.textContent = s.customCss || "";
}
function applyTheme() {
  const theme = getTheme();
  const root = document.documentElement;
  root.style.setProperty("--bg", theme.bg);
  root.style.setProperty("--panel", theme.panel);
  root.style.setProperty("--panel-strong", theme.panelStrong);
  root.style.setProperty("--text", theme.text);
  root.style.setProperty("--muted", theme.muted);
  root.style.setProperty("--accent", theme.accent);
  root.style.setProperty("--border", theme.border);
  if (data.settings.useCustomColors) {
    root.style.setProperty("--accent", data.settings.customAccent);
    root.style.setProperty("--waypoint-green", data.settings.customAccent);
    root.style.setProperty("--panel", hexToRgba(data.settings.customPanel, .70));
    root.style.setProperty("--panel-strong", hexToRgba(data.settings.customPanel, .92));
    root.style.setProperty("--text", data.settings.customText);
    root.style.setProperty("--muted", colorMix(data.settings.customText, "#808080", .45));
    root.style.setProperty("--border", hexToRgba(data.settings.customText, .16));
  } else {
    root.style.setProperty("--waypoint-green", "#00d084");
  }

  const bg = $("backgroundLayer");
  const overlay = $("backgroundOverlay");
  if (bg) {
    bg.style.filter = `blur(${data.settings.blur}px)`;
    if (data.settings.backgroundMode === "gradient") bg.style.backgroundImage = theme.gradient;
    else if (data.settings.backgroundMode === "custom") {
      const custom = localStorage.getItem(CUSTOM_BG_KEY);
      bg.style.backgroundImage = custom ? `url("${custom}")` : `url("${theme.wallpaper}")`;
    } else bg.style.backgroundImage = `url("${theme.wallpaper}")`;
  }
  if (overlay) overlay.style.background = `rgba(0,0,0,${data.settings.overlay / 100})`;
}

function getHeroSrc() {
  const theme = getTheme();
  if (data.settings.heroStyle === "custom") return localStorage.getItem(CUSTOM_HERO_KEY) || theme[theme.defaultHero];
  if (data.settings.heroStyle === "desktop") return theme.desktop;
  if (data.settings.heroStyle === "atmo") return theme.atmo;
  return theme[theme.defaultHero];
}

function applyHero() {
  const card = $("heroImageCard");
  const img = $("heroImage");
  if (!card || !img) return;
  const isBannerHidden = data.settings.heroStyle === "hidden";
  card.classList.toggle("hidden-banner", isBannerHidden);
  document.querySelector(".hero")?.classList.toggle("banner-hidden", isBannerHidden);
  card.style.setProperty("--hero-height", `${data.settings.heroHeight}px`);
  card.style.setProperty("--hero-zoom", String(data.settings.heroZoom / 100));
  card.style.setProperty("--hero-y", `${data.settings.heroY}%`);
  card.style.setProperty("--hero-fit", data.settings.heroFit || "cover");
  card.classList.toggle("fit-contain", data.settings.heroFit === "contain");
  img.src = getHeroSrc();
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
  setValue("customColorsSelect", String(!!s.useCustomColors));
  setValue("accentColorInput", s.customAccent);
  setValue("panelColorInput", s.customPanel);
  setValue("textColorInput", s.customText);
  setValue("layoutPresetSelect", s.layoutPreset);
  setValue("showLogoSelect", String(s.showLogo !== false));
  setValue("showWordmarkSelect", String(s.showWordmark !== false));
  setValue("showClockSelect", String(s.showClock !== false));
  setValue("showWeatherSelect", String(s.showWeather !== false));
  setValue("showSearchSelect", String(s.showSearch !== false));
  setValue("showSectionTitlesSelect", String(s.showSectionTitles !== false));
  setValue("backgroundModeSelect", s.backgroundMode);
  setValue("heroStyleSelect", s.heroStyle);
  setValue("shortcutSelect", s.shortcut);
  setValue("heroFitSelect", s.heroFit || "cover");
  setValue("bookmarkLayoutSelect", s.bookmarkLayout || "list");
  setValue("bookmarkColumnsSelect", s.bookmarkColumns || "auto");
  setValue("bookmarkFontSlider", s.bookmarkFontSize);
  setValue("bookmarkIconSlider", s.bookmarkIconSize);
  setValue("customCssInput", s.customCss || "");
  setValue("overlaySlider", s.overlay);
  setValue("blurSlider", s.blur);
  setValue("heroHeightSlider", s.heroHeight);
  setValue("heroZoomSlider", s.heroZoom);
  setValue("heroYSlider", s.heroY);
  setText("overlayValue", `${s.overlay}%`);
  setText("blurValue", `${s.blur}px`);
  setText("heroHeightValue", `${s.heroHeight}px`);
  setText("heroZoomValue", `${s.heroZoom}%`);
  setText("heroYValue", `${s.heroY}%`);
  setText("uiScaleValue", `${s.uiScale}%`);
  setText("bookmarkFontValue", `${s.bookmarkFontSize}px`);
  setText("bookmarkIconValue", `${s.bookmarkIconSize}px`);
}
function setValue(id, value) { const el = $(id); if (!el) return; if (document.activeElement === el) return; if (el.value !== String(value)) el.value = value; }
function setText(id, value) { const el = $(id); if (el) el.textContent = value; }

function updateLogoPrompt() {
  const text = `${displayUserName()}@waypoint:~$`;
  setText("logoPrompt", text);
  setText("terminalPrompt", `${text} stfetch`);
  setText("commandPromptLabel", text);
}

function positionTerminal() {
  const win = document.querySelector(".terminal-window");
  if (!win) return;
  if (Number.isFinite(data.settings.terminalLeft) && Number.isFinite(data.settings.terminalTop)) {
    win.style.setProperty("--terminal-left", `${data.settings.terminalLeft}px`);
    win.style.setProperty("--terminal-top", `${data.settings.terminalTop}px`);
    win.style.transform = "none";
  } else {
    win.style.removeProperty("--terminal-left");
    win.style.removeProperty("--terminal-top");
    win.style.transform = "translate(-50%, -50%)";
  }
}

function openSettingsPage(page = "appearance") {
  document.querySelectorAll(".settings-tab").forEach(tab => tab.classList.toggle("active", tab.dataset.settingsPage === page));
  document.querySelectorAll(".settings-page").forEach(panel => panel.classList.toggle("active", panel.dataset.page === page));
  openModal("settingsModal");
}
function openModal(id) {
  $(id)?.classList.remove("hidden");
  if (id === "terminalModal") {
    renderTerminal();
    positionTerminal();
    setTimeout(() => $("commandInput")?.focus(), 80);
  }
}
function closeModal(id) { $(id)?.classList.add("hidden"); }
function closeAllModals() { document.querySelectorAll(".modal").forEach(m => m.classList.add("hidden")); }

function render() {
  document.body.classList.toggle("bookmark-list-layout", (data.settings.bookmarkLayout || "list") === "list");
  document.body.classList.toggle("bookmark-grid-layout", (data.settings.bookmarkLayout || "list") === "grid");
  applyTheme();
  applyPersonalization();
  applyHero();
  updateLogoPrompt();
  syncControls();
  renderSections();
  renderTerminal();
  updateWeatherWidget();
  applySearchEngine();
}

function renderSections() {
  const container = $("sections");
  if (!container) return;
  container.innerHTML = "";

  data.sections.forEach((section, sectionIndex) => {
    const sectionEl = document.createElement("article");
    sectionEl.className = "section";
    sectionEl.draggable = true;
    sectionEl.dataset.sectionIndex = sectionIndex;
    sectionEl.innerHTML = `
      <div class="section-header">
        <span class="section-name" contenteditable="true" spellcheck="false">${escapeHtml(section.name)}</span>
        <div class="section-actions">
          <button class="section-action add-link-btn" title="Add link" type="button">+</button>
          <button class="section-action section-delete" title="Delete section" type="button">×</button>
        </div>
      </div>
      <div class="links" data-section-index="${sectionIndex}"></div>
    `;

    const nameEl = sectionEl.querySelector(".section-name");
    nameEl.addEventListener("blur", () => {
      data.sections[sectionIndex].name = nameEl.textContent.trim() || "Untitled";
      save();
      renderTerminal();
    });
    nameEl.addEventListener("keydown", event => {
      if (event.key === "Enter") { event.preventDefault(); nameEl.blur(); }
    });

    sectionEl.querySelector(".add-link-btn").addEventListener("click", () => openLinkModal(sectionIndex));
    sectionEl.querySelector(".section-delete").addEventListener("click", () => deleteSection(sectionIndex));

    setupSectionDrag(sectionEl, sectionIndex);
    const linksContainer = sectionEl.querySelector(".links");
    setupLinkDropZone(linksContainer, sectionIndex);

    section.links.forEach((link, linkIndex) => {
      const row = document.createElement("div");
      row.className = "link";
      row.draggable = true;
      row.dataset.sectionIndex = sectionIndex;
      row.dataset.linkIndex = linkIndex;
      row.innerHTML = `
        <img src="${escapeHtml(link.icon || favicon(link.url))}" alt="" aria-hidden="true">
        <a href="${escapeHtml(link.url)}" tabindex="-1">${escapeHtml(link.name)}</a>
        <span class="edit-link" title="Edit link" aria-label="Edit link">✎</span>
        <span class="delete-link" title="Delete link" aria-label="Delete link">×</span>
      `;
      row.addEventListener("click", event => {
        if (event.target.closest(".delete-link") || event.target.closest(".edit-link") || event.defaultPrevented) return;
        window.location.href = link.url;
      });
      row.querySelector(".edit-link").addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        openLinkModal(sectionIndex, linkIndex);
      });
      row.querySelector(".delete-link").addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        data.sections[sectionIndex].links.splice(linkIndex, 1);
        save();
        render();
      });
      row.addEventListener("dblclick", event => {
        event.preventDefault();
        openLinkModal(sectionIndex, linkIndex);
      });
      setupLinkDrag(row, sectionIndex, linkIndex);
      linksContainer.appendChild(row);
    });

    container.appendChild(sectionEl);
  });
}

function setupSectionDrag(sectionEl, sectionIndex) {
  sectionEl.addEventListener("dragstart", event => {
    if (event.target.closest(".link") || event.target.closest("button") || event.target.isContentEditable) return;
    draggedSectionIndex = sectionIndex;
    draggedLink = null;
    sectionEl.classList.add("dragging-section");
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("application/x-startpage-section", String(sectionIndex));
  });
  sectionEl.addEventListener("dragend", () => {
    draggedSectionIndex = null;
    document.querySelectorAll(".dragging-section,.section-drop-before,.section-drop-after").forEach(el => el.classList.remove("dragging-section", "section-drop-before", "section-drop-after"));
  });
  sectionEl.addEventListener("dragover", event => {
    if (draggedSectionIndex === null || draggedSectionIndex === sectionIndex) return;
    event.preventDefault();
    const before = event.offsetY < sectionEl.offsetHeight / 2;
    sectionEl.classList.toggle("section-drop-before", before);
    sectionEl.classList.toggle("section-drop-after", !before);
  });
  sectionEl.addEventListener("dragleave", () => sectionEl.classList.remove("section-drop-before", "section-drop-after"));
  sectionEl.addEventListener("drop", event => {
    if (draggedSectionIndex === null || draggedSectionIndex === sectionIndex) return;
    event.preventDefault();
    const before = event.offsetY < sectionEl.offsetHeight / 2;
    const [moved] = data.sections.splice(draggedSectionIndex, 1);
    let target = sectionIndex;
    if (draggedSectionIndex < target) target -= 1;
    data.sections.splice(before ? target : target + 1, 0, moved);
    draggedSectionIndex = null;
    save();
    render();
  });
}

function setupLinkDrag(row, sectionIndex, linkIndex) {
  row.addEventListener("dragstart", event => {
    draggedLink = { sectionIndex, linkIndex };
    draggedSectionIndex = null;
    row.classList.add("dragging-link");
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("application/x-startpage-link", JSON.stringify(draggedLink));
  });
  row.addEventListener("dragend", () => {
    draggedLink = null;
    clearLinkDragClasses();
  });
  row.addEventListener("dragover", event => {
    if (!draggedLink) return;
    event.preventDefault();
    const rect = row.getBoundingClientRect();
    const before = event.clientY < rect.top + rect.height / 2;
    clearLinkDropMarkers();
    row.classList.toggle("link-drop-before", before);
    row.classList.toggle("link-drop-after", !before);
  });
  row.addEventListener("drop", event => {
    if (!draggedLink) return;
    event.preventDefault();
    const targetSection = Number(row.dataset.sectionIndex);
    let targetIndex = Number(row.dataset.linkIndex);
    const rect = row.getBoundingClientRect();
    const before = event.clientY < rect.top + rect.height / 2;
    if (!before) targetIndex += 1;
    moveLink(draggedLink.sectionIndex, draggedLink.linkIndex, targetSection, targetIndex);
  });
}

function setupLinkDropZone(zone, sectionIndex) {
  zone.addEventListener("dragover", event => {
    event.preventDefault();
    zone.classList.add("drag-over");
  });
  zone.addEventListener("dragleave", event => {
    if (!zone.contains(event.relatedTarget)) zone.classList.remove("drag-over");
  });
  zone.addEventListener("drop", event => {
    event.preventDefault();
    zone.classList.remove("drag-over");
    if (draggedLink) {
      moveLink(draggedLink.sectionIndex, draggedLink.linkIndex, sectionIndex, data.sections[sectionIndex].links.length);
      return;
    }
    const droppedUrl = event.dataTransfer.getData("text/uri-list") || event.dataTransfer.getData("text/plain");
    if (!/^https?:\/\//i.test(droppedUrl)) return;
    try {
      const url = new URL(droppedUrl);
      data.sections[sectionIndex].links.push({ name: url.hostname.replace(/^www\./, ""), url: droppedUrl });
      save();
      render();
    } catch {}
  });
}

function moveLink(fromSection, fromIndex, toSection, toIndex) {
  if (!data.sections[fromSection] || !data.sections[toSection]) return;
  const [moved] = data.sections[fromSection].links.splice(fromIndex, 1);
  if (!moved) return;
  if (fromSection === toSection && fromIndex < toIndex) toIndex -= 1;
  toIndex = clamp(toIndex, 0, data.sections[toSection].links.length, data.sections[toSection].links.length);
  data.sections[toSection].links.splice(toIndex, 0, moved);
  draggedLink = null;
  save();
  render();
}

function clearLinkDropMarkers() { document.querySelectorAll(".link-drop-before,.link-drop-after").forEach(el => el.classList.remove("link-drop-before", "link-drop-after")); }
function clearLinkDragClasses() { document.querySelectorAll(".dragging-link,.drag-over,.link-drop-before,.link-drop-after").forEach(el => el.classList.remove("dragging-link", "drag-over", "link-drop-before", "link-drop-after")); }

function openLinkModal(sectionIndex, linkIndex = null) {
  activeSection = sectionIndex;
  editingLink = linkIndex === null ? null : { sectionIndex, linkIndex };
  const title = $("linkModalTitle");
  const nameInput = $("linkName");
  const urlInput = $("linkUrl");
  const iconPreview = $("linkIconPreview");
  const clearIconBtn = $("clearLinkIconBtn");
  const iconInput = $("linkIconInput");
  if (iconInput) iconInput.value = "";
  if (editingLink) {
    const link = data.sections[sectionIndex].links[linkIndex];
    pendingLinkIcon = link.icon || "";
    if (title) title.textContent = "Edit Link";
    if (nameInput) nameInput.value = link.name;
    if (urlInput) urlInput.value = link.url;
  } else {
    pendingLinkIcon = "";
    if (title) title.textContent = "Add Link";
    if (nameInput) nameInput.value = "";
    if (urlInput) urlInput.value = "";
  }
  if (iconPreview) {
    const previewSrc = pendingLinkIcon || favicon(urlInput?.value || "");
    iconPreview.src = previewSrc || "";
    iconPreview.classList.toggle("empty", !previewSrc);
  }
  if (clearIconBtn) clearIconBtn.disabled = !pendingLinkIcon;
  openModal("linkModal");
  setTimeout(() => nameInput?.focus(), 50);
}

function saveLink() {
  const name = $("linkName")?.value.trim();
  const rawUrl = $("linkUrl")?.value.trim();
  if (!name || !rawUrl) return;
  const nextLink = { name, url: normalizeUrl(rawUrl), icon: pendingLinkIcon || "" };
  if (editingLink) data.sections[editingLink.sectionIndex].links[editingLink.linkIndex] = nextLink;
  else data.sections[activeSection].links.push(nextLink);
  editingLink = null;
  pendingLinkIcon = null;
  save();
  render();
  closeModal("linkModal");
}

function deleteSection(index) {
  const section = data.sections[index];
  if (!section) return;
  if (!confirm(`Delete section "${section.name}" and ${section.links.length} link(s)?`)) return;
  data.sections.splice(index, 1);
  if (!data.sections.length) data.sections.push({ name: "New Section", links: [] });
  save();
  render();
}

function addSection() {
  data.sections.push({ name: "New Section", links: [] });
  save();
  render();
}

function findSectionIndexByName(name) {
  const target = String(name || "").trim().toLowerCase();
  if (!target) return -1;
  return data.sections.findIndex(section => section.name.trim().toLowerCase() === target);
}

function parseAddLinkCommand(commandRaw) {
  const body = commandRaw.trim().replace(/^add\s+link\s+/i, "").trim();
  const urlMatch = body.match(/(https?:\/\/\S+|www\.\S+|[a-z0-9.-]+\.[a-z]{2,}\S*)$/i);
  if (!urlMatch) return null;
  const rawUrl = urlMatch[1];
  const beforeUrl = body.slice(0, urlMatch.index).trim();
  if (!beforeUrl) return null;

  const quoted = [...beforeUrl.matchAll(/"([^"]+)"|'([^']+)'/g)].map(match => match[1] || match[2]);
  if (quoted.length >= 2) {
    return { sectionName: quoted[0], linkName: quoted[1], url: normalizeUrl(rawUrl) };
  }

  const matches = data.sections
    .map((section, index) => ({ section, index }))
    .filter(item => beforeUrl.toLowerCase().startsWith(item.section.name.toLowerCase() + " "))
    .sort((a, b) => b.section.name.length - a.section.name.length);

  if (!matches.length) return null;
  const sectionName = matches[0].section.name;
  const linkName = beforeUrl.slice(sectionName.length).trim();
  if (!linkName) return null;
  return { sectionName, linkName, url: normalizeUrl(rawUrl) };
}

function addLinkByCommand(sectionName, linkName, url) {
  const sectionIndex = findSectionIndexByName(sectionName);
  if (sectionIndex < 0) return `No section named <strong>${escapeHtml(sectionName)}</strong>.`;
  const safeUrl = normalizeUrl(url);
  if (!safeUrl) return "Missing URL.";
  data.sections[sectionIndex].links.push({ name: String(linkName).trim() || safeUrl, url: safeUrl });
  save();
  render();
  return `Added <strong>${escapeHtml(linkName)}</strong> to <strong>${escapeHtml(data.sections[sectionIndex].name)}</strong>.`;
}

function renameSectionByCommand(oldName, newName) {
  const sectionIndex = findSectionIndexByName(oldName);
  if (sectionIndex < 0) return `No section named <strong>${escapeHtml(oldName)}</strong>.`;
  data.sections[sectionIndex].name = String(newName || "").trim() || data.sections[sectionIndex].name;
  save();
  render();
  return `Section renamed to <strong>${escapeHtml(data.sections[sectionIndex].name)}</strong>.`;
}

function deleteSectionByCommand(sectionName) {
  const sectionIndex = findSectionIndexByName(sectionName);
  if (sectionIndex < 0) return `No section named <strong>${escapeHtml(sectionName)}</strong>.`;
  deleteSection(sectionIndex);
  return `Delete request handled for <strong>${escapeHtml(sectionName)}</strong>.`;
}

function buildFastfetchHtml() {
  const theme = getTheme();
  const heroLabel = data.settings.heroStyle === "auto" ? `Theme Default (${theme.defaultHero === "atmo" ? "Atmosphere" : "Desktop"})` : labelHero(data.settings.heroStyle);
  const modified = data.settings.lastModified ? formatRelativeDate(new Date(data.settings.lastModified)) : "Never";
  const logo = `  /\\/|  __
 |/\\/  / /
      / /
     / /
    /_/____
     |_____|`;
  const rows = [
    ["Version", "1.1.0-dev"],
    ["Theme", theme.label],
    ["Preset", data.settings.layoutPreset],
    ["Font", data.settings.fontFamily],
    ["Bookmarks", countBookmarks()],
    ["Sections", data.sections.length],
    ["Layout", (data.settings.bookmarkLayout || "list") === "list" ? "Compact List" : "Grid"],
    ["Banner", heroLabel],
    ["Weather", data.settings.showWeather === false ? "Hidden" : (data.settings.weatherLocation || "Not set")],
    ["Search", labelSearch(data.settings.searchEngine)],
    ["Modified", modified]
  ];
  return `
    <pre class="fetch-output"><span class="fetch-logo">${escapeHtml(logo)}</span><span class="fetch-info"><strong>${escapeHtml(displayUserName())}@waypoint</strong>
-------------
${rows.map(([k,v]) => `${String(k).padEnd(10)} ${escapeHtml(v)}`).join("\n")}</span></pre>
  `;
}

function renderTerminal() {
  updateLogoPrompt();
}

function labelHero(value) { return ({ desktop: "Desktop", atmo: "Atmosphere", custom: "Custom", hidden: "Hidden" })[value] || "Theme Default"; }
function labelBackground(value) { return ({ wallpaper: "Theme Wallpaper", gradient: "Theme Gradient", custom: "Custom" })[value] || value; }
function labelShortcut(value) { return ({ altT: "Alt+T", ctrlShiftSpace: "Ctrl+Shift+Space", none: "Disabled" })[value] || value; }
function labelSearch(value) { return (SEARCH_ENGINES[value] || SEARCH_ENGINES.google).label; }
function formatRelativeDate(date) {
  const now = new Date();
  if (date.toDateString() === now.toDateString()) return "Today";
  const yesterday = new Date(now); yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function exportJson() {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "waypoint.json";
  a.click();
  URL.revokeObjectURL(a.href);
}

function importJsonFile(file) {
  const reader = new FileReader();
  reader.onload = () => {
    const parsed = safeParse(reader.result);
    if (!parsed) return alert("Invalid JSON file.");
    data = normalizeData(parsed);
    save();
    render();
  };
  reader.readAsText(file);
}

async function refreshWeather(force = false) {
  const loc = data.settings.weatherLocation.trim();
  if (!loc) { updateWeatherWidget(); return; }
  const cached = safeParse(localStorage.getItem(WEATHER_CACHE_KEY));
  if (!force && cached && cached.location === loc && Date.now() - cached.time < 30 * 60 * 1000) {
    updateWeatherWidget(cached); return;
  }
  updateWeatherWidget({ loading: true, location: loc });
  try {
    const place = await resolveWeatherLocation(loc);
    const unit = data.settings.weatherUnit === "auto" ? (place.countryCode === "US" ? "fahrenheit" : "celsius") : data.settings.weatherUnit;
    const forecastUrl = new URL("https://api.open-meteo.com/v1/forecast");
    forecastUrl.searchParams.set("latitude", place.latitude);
    forecastUrl.searchParams.set("longitude", place.longitude);
    forecastUrl.searchParams.set("current", "temperature_2m,weather_code,is_day");
    forecastUrl.searchParams.set("temperature_unit", unit === "fahrenheit" ? "fahrenheit" : "celsius");
    forecastUrl.searchParams.set("timezone", "auto");
    const response = await fetch(forecastUrl, { cache: "no-store" });
    if (!response.ok) throw new Error("weather failed");
    const json = await response.json();
    const current = json.current || {};
    const cache = {
      location: loc,
      temp: Math.round(Number(current.temperature_2m)),
      code: Number(current.weather_code),
      isDay: Number(current.is_day),
      desc: weatherCodeText(Number(current.weather_code)),
      place: place.label,
      unit,
      time: Date.now()
    };
    localStorage.setItem(WEATHER_CACHE_KEY, JSON.stringify(cache));
    updateWeatherWidget(cache);
  } catch {
    updateWeatherWidget({ error: true, location: loc });
  }
}

async function resolveWeatherLocation(input) {
  const loc = input.trim();
  if (!loc) throw new Error("location missing");

  if (/^\d{5}$/.test(loc)) {
    try {
      const zipResponse = await fetch(`https://api.zippopotam.us/us/${encodeURIComponent(loc)}`, { cache: "no-store" });
      if (zipResponse.ok) {
        const z = await zipResponse.json();
        const place = z.places?.[0];
        if (place) {
          return {
            latitude: place.latitude,
            longitude: place.longitude,
            countryCode: "US",
            label: `${place["place name"]}, ${place["state abbreviation"]}`
          };
        }
      }
    } catch {}
  }

  const parts = loc.split(",").map(part => part.trim()).filter(Boolean);
  const city = parts[0] || loc;
  const region = parts[1] || "";
  const countryHint = parts.length >= 3 ? parts.slice(2).join(", ") : region;

  const stateNames = {
    alabama:"AL", alaska:"AK", arizona:"AZ", arkansas:"AR", california:"CA", colorado:"CO", connecticut:"CT", delaware:"DE", florida:"FL", georgia:"GA", hawaii:"HI", idaho:"ID", illinois:"IL", indiana:"IN", iowa:"IA", kansas:"KS", kentucky:"KY", louisiana:"LA", maine:"ME", maryland:"MD", massachusetts:"MA", michigan:"MI", minnesota:"MN", mississippi:"MS", missouri:"MO", montana:"MT", nebraska:"NE", nevada:"NV", "new hampshire":"NH", "new jersey":"NJ", "new mexico":"NM", "new york":"NY", "north carolina":"NC", "north dakota":"ND", ohio:"OH", oklahoma:"OK", oregon:"OR", pennsylvania:"PA", "rhode island":"RI", "south carolina":"SC", "south dakota":"SD", tennessee:"TN", texas:"TX", utah:"UT", vermont:"VT", virginia:"VA", washington:"WA", "west virginia":"WV", wisconsin:"WI", wyoming:"WY", "district of columbia":"DC"
  };
  const usState = /^[A-Za-z]{2}$/.test(region) ? region.toUpperCase() : stateNames[region.toLowerCase()];

  const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
  url.searchParams.set("name", city);
  url.searchParams.set("count", "10");
  url.searchParams.set("language", "en");
  url.searchParams.set("format", "json");
  if (usState) url.searchParams.set("countryCode", "US");

  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error("geocode failed");
  const json = await response.json();
  const results = json.results || [];
  if (!results.length) throw new Error("location not found");

  let place = null;
  if (usState) {
    place = results.find(result =>
      String(result.country_code || "").toUpperCase() === "US" &&
      (
        String(result.admin1_code || "").toUpperCase() === `US-${usState}` ||
        String(result.admin1_code || "").toUpperCase() === usState ||
        stateNames[String(result.admin1 || "").toLowerCase()] === usState
      )
    );
  }
  if (!place && countryHint && !usState) {
    const hint = countryHint.toLowerCase();
    place = results.find(result =>
      String(result.country || "").toLowerCase().includes(hint) ||
      String(result.country_code || "").toLowerCase() === hint ||
      String(result.admin1 || "").toLowerCase().includes(hint)
    );
  }
  place = place || results[0];

  const admin = place.admin1 ? `, ${place.admin1}` : "";
  const country = place.country ? `, ${place.country}` : "";
  return {
    latitude: String(place.latitude),
    longitude: String(place.longitude),
    countryCode: place.country_code || "",
    label: `${place.name}${admin}${country}`
  };
}

function updateWeatherWidget(payload = safeParse(localStorage.getItem(WEATHER_CACHE_KEY))) {
  const widget = $("weatherWidget");
  if (!widget) return;
  const icon = widget.querySelector(".weather-icon");
  const main = widget.querySelector(".weather-main");
  const place = widget.querySelector(".weather-place");
  if (!data.settings.weatherLocation) {
    icon.textContent = "--"; main.textContent = "Set weather"; place.textContent = "City, Region, Country or ZIP"; return;
  }
  if (payload?.loading) { icon.textContent = "…"; main.textContent = "Loading"; place.textContent = payload.location; return; }
  if (payload?.error) { icon.textContent = "!"; main.textContent = "Weather"; place.textContent = "failed"; return; }
  if (!payload || payload.location !== data.settings.weatherLocation) { icon.textContent = "…"; main.textContent = "Weather"; place.textContent = data.settings.weatherLocation; return; }
  icon.textContent = weatherIcon(payload.code, payload.isDay, payload.desc);
  main.textContent = `${payload.temp}°${(payload.unit || data.settings.weatherUnit) === "celsius" ? "C" : "F"}`;
  place.textContent = payload.place || payload.location;
}

function weatherIcon(code, isDay = 1, desc = "") {
  if (Number.isFinite(code)) {
    if ([0, 1].includes(code)) return isDay ? "☀" : "☾";
    if ([2, 3].includes(code)) return "☁";
    if ([45, 48].includes(code)) return "≋";
    if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return "☔";
    if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return "❄";
    if (code >= 95) return "⚡";
  }
  const d = String(desc).toLowerCase();
  if (d.includes("rain") || d.includes("drizzle")) return "☔";
  if (d.includes("snow") || d.includes("sleet")) return "❄";
  if (d.includes("thunder")) return "⚡";
  if (d.includes("cloud") || d.includes("overcast")) return "☁";
  if (d.includes("fog") || d.includes("mist")) return "≋";
  if (d.includes("clear") || d.includes("sun")) return "☀";
  return "◌";
}

function weatherCodeText(code) {
  const map = {
    0: "Clear", 1: "Mostly clear", 2: "Partly cloudy", 3: "Cloudy",
    45: "Fog", 48: "Fog", 51: "Drizzle", 53: "Drizzle", 55: "Drizzle",
    56: "Freezing drizzle", 57: "Freezing drizzle", 61: "Rain", 63: "Rain", 65: "Rain",
    66: "Freezing rain", 67: "Freezing rain", 71: "Snow", 73: "Snow", 75: "Snow", 77: "Snow",
    80: "Rain showers", 81: "Rain showers", 82: "Rain showers", 85: "Snow showers", 86: "Snow showers",
    95: "Thunderstorm", 96: "Thunderstorm", 99: "Thunderstorm"
  };
  return map[code] || "Weather";
}

function applySearchEngine() {
  const form = $("searchForm") || document.querySelector(".search");
  const input = $("searchInput") || document.querySelector(".search input");
  const badge = $("searchEngineBadge");
  const engine = SEARCH_ENGINES[data.settings.searchEngine] || SEARCH_ENGINES.google;
  if (!form || !input) return;
  if (data.settings.searchEngine === "custom" && data.settings.customSearchUrl.includes("%s")) {
    form.dataset.customSearch = data.settings.customSearchUrl;
    form.action = "#";
    input.name = "q";
  } else {
    delete form.dataset.customSearch;
    form.action = engine.action || SEARCH_ENGINES.google.action;
    input.name = engine.param || "q";
  }
  input.placeholder = engine.placeholder || "Search";
  if (badge) badge.textContent = engine.badge || "?";
}

function updateClock() {
  const clock = $("clock");
  if (!clock) return;
  const now = new Date();
  const date = now.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
  const time = now.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit", hour12: true });
  clock.innerHTML = `<span class="mini-clock-date">${escapeHtml(date)}</span><span class="mini-clock-time">${escapeHtml(time)}</span>`;
}

function runCommand(commandRaw) {
  const command = commandRaw.trim();
  const out = $("commandOutput");
  if (!command) return;

  const lower = command.toLowerCase();
  const [head, ...rest] = lower.split(/\s+/);
  const arg = rest.join(" ");

  if (["q", "quit", "exit"].includes(lower)) { closeModal("terminalModal"); return; }

  if (head === "help") {
    return output(`
      <strong>Available commands</strong><br><br>
      help<br>
      fetch<br>
      settings<br>
      show|hide logo|title|clock|weather|search|sections<br>
      preset classic|minimal|dashboard|centered<br>
      font system|inter|jetbrains|fira|roboto|mono<br>
      accent #00d084<br>
      engine google|duckduckgo|brave|bing|custom<br>
      customsearch &lt;url with %s&gt;<br>
      name &lt;value&gt;<br>
      theme nord|catppuccin|gruvbox|tokyo<br>
      banner auto|desktop|atmosphere|custom|hidden|fit|fill<br>
      layout list|grid<br>
      wallpaper theme|gradient|custom<br>
      weather &lt;city, region, country or ZIP&gt;<br>
      add section &lt;name&gt;<br>
      delete section &lt;name&gt;<br>
      rename section &lt;old&gt; &lt;new&gt;<br>
      add link "Section Name" "Link Name" &lt;url&gt;<br>
      import<br>
      export<br>
      reset<br>
      q | quit | exit
    `);
  }

  if (head === "fetch") return output(buildFastfetchHtml());
  if (head === "settings") {
    openSettingsPage(arg || "appearance");
    return output("Opened settings.");
  }

  if (["show", "hide"].includes(head)) {
    const keyMap = { logo: "showLogo", terminal: "showLogo", button: "showLogo", title: "showWordmark", wordmark: "showWordmark", clock: "showClock", weather: "showWeather", search: "showSearch", sections: "showSectionTitles", titles: "showSectionTitles" };
    const key = keyMap[arg];
    if (!key) return output("Usage: show|hide logo|title|clock|weather|search|sections");
    data.settings[key] = head === "show";
    save(); render();
    return output(`${head === "show" ? "Shown" : "Hidden"}: <strong>${escapeHtml(arg)}</strong>.`);
  }

  if (head === "preset") {
    if (!["classic", "minimal", "dashboard", "centered"].includes(arg)) return output("Usage: preset classic|minimal|dashboard|centered");
    data.settings.layoutPreset = arg;
    save(); render();
    return output(`Layout preset set to <strong>${escapeHtml(arg)}</strong>.`);
  }

  if (head === "font") {
    if (!["system", "inter", "jetbrains", "fira", "roboto", "mono"].includes(arg)) return output("Usage: font system|inter|jetbrains|fira|roboto|mono");
    data.settings.fontFamily = arg;
    save(); render();
    return output(`Font set to <strong>${escapeHtml(arg)}</strong>.`);
  }

  if (head === "accent") {
    const color = rest[0] || "";
    if (!/^#[0-9a-f]{6}$/i.test(color)) return output("Usage: accent #00d084");
    data.settings.customAccent = color;
    data.settings.useCustomColors = true;
    save(); render();
    return output(`Accent color set to <strong>${escapeHtml(color)}</strong>.`);
  }

  if (head === "name") {
    const nextName = commandRaw.trim().replace(/^name\s*/i, "").trim();
    data.settings.userName = sanitizeUserName(nextName);
    save(); renderTerminal();
    return output(`Name set to <strong>${escapeHtml(displayUserName())}</strong>.`);
  }



  if (head === "searchengine" || head === "engine") {
    const map = { google: "google", ddg: "duckduckgo", duckduckgo: "duckduckgo", brave: "brave", bing: "bing", custom: "custom" };
    if (!arg) return output(`Search engine is <strong>${escapeHtml(labelSearch(data.settings.searchEngine))}</strong>.`);
    if (!map[arg]) return output("Usage: engine google|duckduckgo|brave|bing|custom");
    data.settings.searchEngine = map[arg]; save(); render(); return output(`Search engine set to <strong>${escapeHtml(labelSearch(data.settings.searchEngine))}</strong>.`);
  }

  if (head === "customsearch") {
    const url = commandRaw.trim().replace(/^customsearch\s*/i, "").trim();
    if (!url) return output("Usage: customsearch https://example.com/search?q=%s");
    data.settings.customSearchUrl = url.slice(0, 240);
    data.settings.searchEngine = "custom";
    save(); render();
    return output("Custom search URL saved.");
  }

  if (head === "theme" && arg) {
    const map = { catppuccin: "catppuccin", nord: "nord", gruvbox: "gruvbox", tokyo: "tokyoNight", "tokyo-night": "tokyoNight", tokyonight: "tokyoNight" };
    if (!map[arg]) return output(`Unknown theme: ${escapeHtml(arg)}`);
    data.settings.theme = map[arg]; save(); render(); return output(`Theme set to <strong>${getTheme().label}</strong>.`);
  }

  if (head === "banner") {
    const map = { desktop: "desktop", atmosphere: "atmo", atmo: "atmo", custom: "custom", hidden: "hidden", hide: "hidden", auto: "auto", default: "auto" };
    if (["fit", "contain"].includes(arg)) { data.settings.heroFit = "contain"; save(); render(); return output("Banner fit set to <strong>Fit Entire Image</strong>."); }
    if (["fill", "cover", "crop"].includes(arg)) { data.settings.heroFit = "cover"; save(); render(); return output("Banner fit set to <strong>Fill/Crop</strong>."); }
    if (!map[arg]) return output(`Unknown banner option: ${escapeHtml(arg)}`);
    data.settings.heroStyle = map[arg]; save(); render(); return output(`Banner set to <strong>${labelHero(data.settings.heroStyle)}</strong>.`);
  }

  if (head === "layout") {
    const map = { list: "list", compact: "list", row: "list", rows: "list", grid: "grid", cards: "grid" };
    if (!arg) return output(`Bookmark layout is <strong>${escapeHtml((data.settings.bookmarkLayout || "list") === "list" ? "Compact List" : "Grid")}</strong>.`);
    if (!map[arg]) return output("Usage: layout list|grid");
    data.settings.bookmarkLayout = map[arg];
    save(); render();
    return output(`Bookmark layout set to <strong>${escapeHtml(data.settings.bookmarkLayout === "list" ? "Compact List" : "Grid")}</strong>.`);
  }

  if (head === "weather") {
    const next = commandRaw.trim().replace(/^weather\s+/i, "").trim();
    if (!next) return output("Usage: weather &lt;city, region, country or ZIP&gt;");
    data.settings.weatherLocation = next;
    save(); refreshWeather(true); return output(`Weather location set to <strong>${escapeHtml(data.settings.weatherLocation)}</strong>.`);
  }

  if (head === "wallpaper") {
    const map = { theme: "wallpaper", wallpaper: "wallpaper", default: "wallpaper", gradient: "gradient", custom: "custom" };
    if (!map[arg]) return output("Usage: wallpaper theme|gradient|custom");
    data.settings.backgroundMode = map[arg]; save(); render(); return output(`Wallpaper set to <strong>${labelBackground(data.settings.backgroundMode)}</strong>.`);
  }

  if (head === "add") {
    if (arg.startsWith("section")) {
      const sectionName = commandRaw.trim().replace(/^add\s+section\s*/i, "").trim() || "New Section";
      data.sections.push({ name: sectionName, links: [] });
      save(); render();
      return output(`Section <strong>${escapeHtml(sectionName)}</strong> added.`);
    }
    if (arg.startsWith("link")) {
      const parsed = parseAddLinkCommand(commandRaw);
      if (!parsed) return output('Usage: add link &lt;section&gt; &lt;name&gt; &lt;url&gt;<br>Tip: use quotes for multi-word names, like add link "Media" "YouTube Music" https://music.youtube.com');
      return output(addLinkByCommand(parsed.sectionName, parsed.linkName, parsed.url));
    }
  }

  if (head === "delete" && arg.startsWith("section")) {
    const sectionName = commandRaw.trim().replace(/^delete\s+section\s*/i, "").trim();
    if (!sectionName) return output("Usage: delete section &lt;name&gt;");
    return output(deleteSectionByCommand(sectionName));
  }

  if (head === "rename" && arg.startsWith("section")) {
    const body = commandRaw.trim().replace(/^rename\s+section\s*/i, "").trim();
    const quoted = [...body.matchAll(/"([^"]+)"|'([^']+)'/g)].map(match => match[1] || match[2]);
    if (quoted.length >= 2) return output(renameSectionByCommand(quoted[0], quoted[1]));
    const parts = body.split(/\s+/);
    if (parts.length < 2) return output('Usage: rename section &lt;old&gt; &lt;new&gt;<br>Tip: use quotes for multi-word names.');
    return output(renameSectionByCommand(parts[0], parts.slice(1).join(" ")));
  }

  if (head === "import") { $("importFile")?.click(); return output("Choose a JSON file to import."); }
  if (head === "export") { exportJson(); return output("Export started."); }
  if (head === "reset") { resetEverything(); return; }
  if (head === "clear") return output("");
  if (head === "search") { closeAllModals(); focusSearch(); return; }

  output(`Unknown command: ${escapeHtml(command)}`);

  function output(html) { if (out) out.innerHTML = html; }
}


function executeButtonCommand(command) {
  if (command === "fastfetch") runCommand("fastfetch");
  if (command === "addSection") { addSection(); }
  if (command === "toggleBanner") { data.settings.heroStyle = data.settings.heroStyle === "hidden" ? "auto" : "hidden"; save(); render(); }
  if (command === "export") exportJson();
  if (command === "import") $("importFile")?.click();
  if (command === "help") runCommand("help");
}

function resetEverything() {
  if (!confirm("Reset Waypoint to factory defaults? This clears bookmarks, settings, custom wallpaper, custom banner, and weather cache.")) return;
  localStorage.removeItem(KEY);
  localStorage.removeItem(CUSTOM_BG_KEY);
  localStorage.removeItem(CUSTOM_HERO_KEY);
  localStorage.removeItem(WEATHER_CACHE_KEY);
  data = structuredClone(defaultData);
  save();
  render();
  outputCommand("Reboot complete. Defaults restored.");
}
function outputCommand(html) { const out = $("commandOutput"); if (out) out.innerHTML = html; }
function focusSearch() { document.querySelector(".search input")?.focus(); }

function setupTerminalDrag() {
  const win = document.querySelector(".terminal-window");
  const bar = document.querySelector(".terminal-titlebar");
  if (!win || !bar || bar.dataset.dragBound) return;
  bar.dataset.dragBound = "1";
  let dragging = false;
  let offsetX = 0;
  let offsetY = 0;
  bar.addEventListener("mousedown", event => {
    if (event.target.closest("button")) return;
    dragging = true;
    const rect = win.getBoundingClientRect();
    win.style.transform = "none";
    win.style.setProperty("--terminal-left", `${rect.left}px`);
    win.style.setProperty("--terminal-top", `${rect.top}px`);
    offsetX = event.clientX - rect.left;
    offsetY = event.clientY - rect.top;
    document.body.classList.add("dragging-terminal");
    event.preventDefault();
  });
  window.addEventListener("mousemove", event => {
    if (!dragging) return;
    const maxLeft = Math.max(12, window.innerWidth - win.offsetWidth - 12);
    const maxTop = Math.max(12, window.innerHeight - win.offsetHeight - 12);
    const left = Math.min(maxLeft, Math.max(12, event.clientX - offsetX));
    const top = Math.min(maxTop, Math.max(12, event.clientY - offsetY));
    win.style.setProperty("--terminal-left", `${left}px`);
    win.style.setProperty("--terminal-top", `${top}px`);
    data.settings.terminalLeft = Math.round(left);
    data.settings.terminalTop = Math.round(top);
  });
  window.addEventListener("mouseup", () => {
    if (!dragging) return;
    dragging = false;
    document.body.classList.remove("dragging-terminal");
    save();
  });
}

function bindEvents() {
  $("logoBtn")?.addEventListener("click", () => openModal("terminalModal"));
  setupTerminalDrag();
  $("settingsBtn")?.addEventListener("click", () => openModal("settingsModal"));
  $("weatherWidget")?.addEventListener("click", () => { openSettingsPage("weather"); setTimeout(() => $("weatherLocationInput")?.focus(), 80); });
  $("clock")?.addEventListener("click", focusSearch);
  $("imageSettingsBtn")?.addEventListener("click", () => openSettingsPage("banner"));
  $("saveLinkBtn")?.addEventListener("click", saveLink);
  $("searchForm")?.addEventListener("submit", e => {
    const form = e.currentTarget;
    const query = ($("searchInput")?.value || "").trim();
    if (form.dataset.customSearch && query) {
      e.preventDefault();
      location.href = form.dataset.customSearch.replace("%s", encodeURIComponent(query));
    }
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
  document.querySelectorAll("[data-close-modal]").forEach(btn => btn.addEventListener("click", () => closeModal(btn.dataset.closeModal)));
  document.querySelectorAll(".modal").forEach(modal => modal.addEventListener("click", e => { if (e.target === modal) closeModal(modal.id); }));
  document.querySelectorAll("[data-command]").forEach(btn => btn.addEventListener("click", () => executeButtonCommand(btn.dataset.command)));

  $("commandInput")?.addEventListener("keydown", e => {
    if (e.key === "Enter") { runCommand(e.target.value); e.target.value = ""; }
  });

  $("importFile")?.addEventListener("change", e => { const file = e.target.files[0]; if (file) importJsonFile(file); e.target.value = ""; });
  $("exportBtn")?.addEventListener("click", exportJson);
  $("importBtn")?.addEventListener("click", () => $("importFile")?.click());

  bindSetting("userNameInput", "input", value => { data.settings.userName = sanitizeUserName(value); save(); renderTerminal(); });
  bindSetting("weatherLocationInput", "change", value => { data.settings.weatherLocation = value.trim().slice(0, 80); save(); refreshWeather(true); renderTerminal(); });
  bindSetting("weatherUnitSelect", "change", value => { data.settings.weatherUnit = value; save(); refreshWeather(true); });
  bindSetting("searchEngineSelect", "change", value => { data.settings.searchEngine = value; save(); applySearchEngine(); renderTerminal(); });
  bindSetting("customSearchInput", "change", value => { data.settings.customSearchUrl = value.trim().slice(0, 240); save(); applySearchEngine(); });
  bindSetting("themeSelect", "change", value => { data.settings.theme = value; save(); render(); });
  bindSetting("fontSelect", "change", value => { data.settings.fontFamily = value; save(); render(); });
  bindNumber("uiScaleSlider", "uiScale", () => applyPersonalization());
  bindSetting("customColorsSelect", "change", value => { data.settings.useCustomColors = value === "true"; save(); render(); });
  bindSetting("accentColorInput", "input", value => { data.settings.customAccent = value; data.settings.useCustomColors = true; save(); render(); });
  bindSetting("panelColorInput", "input", value => { data.settings.customPanel = value; data.settings.useCustomColors = true; save(); render(); });
  bindSetting("textColorInput", "input", value => { data.settings.customText = value; data.settings.useCustomColors = true; save(); render(); });
  bindSetting("layoutPresetSelect", "change", value => { data.settings.layoutPreset = value; save(); render(); });
  bindSetting("showLogoSelect", "change", value => { data.settings.showLogo = value === "true"; save(); render(); });
  bindSetting("showWordmarkSelect", "change", value => { data.settings.showWordmark = value === "true"; save(); render(); });
  bindSetting("showClockSelect", "change", value => { data.settings.showClock = value === "true"; save(); render(); });
  bindSetting("showWeatherSelect", "change", value => { data.settings.showWeather = value === "true"; save(); render(); });
  bindSetting("showSearchSelect", "change", value => { data.settings.showSearch = value === "true"; save(); render(); });
  bindSetting("showSectionTitlesSelect", "change", value => { data.settings.showSectionTitles = value === "true"; save(); render(); });
  bindSetting("bookmarkColumnsSelect", "change", value => { data.settings.bookmarkColumns = value; save(); render(); });
  bindNumber("bookmarkFontSlider", "bookmarkFontSize", () => applyPersonalization());
  bindNumber("bookmarkIconSlider", "bookmarkIconSize", () => applyPersonalization());
  bindSetting("customCssInput", "input", value => { data.settings.customCss = value.slice(0, 8000); save(); applyPersonalization(); });
  $("clearCustomCssBtn")?.addEventListener("click", () => { data.settings.customCss = ""; save(); render(); });
  $("resetEverythingBtn")?.addEventListener("click", resetEverything);
  bindSetting("backgroundModeSelect", "change", value => { data.settings.backgroundMode = value; save(); render(); });
  bindSetting("heroStyleSelect", "change", value => { data.settings.heroStyle = value; save(); render(); });
  bindSetting("heroFitSelect", "change", value => { data.settings.heroFit = value; save(); render(); });
  bindSetting("bookmarkLayoutSelect", "change", value => { data.settings.bookmarkLayout = value; save(); render(); });
  bindSetting("shortcutSelect", "change", value => { data.settings.shortcut = value; save(); renderTerminal(); });
  bindNumber("overlaySlider", "overlay", () => applyTheme());
  bindNumber("blurSlider", "blur", () => applyTheme());
  bindNumber("heroHeightSlider", "heroHeight", () => applyHero());
  bindNumber("heroZoomSlider", "heroZoom", () => applyHero());
  bindNumber("heroYSlider", "heroY", () => applyHero());

  $("backgroundUpload")?.addEventListener("change", e => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { localStorage.setItem(CUSTOM_BG_KEY, reader.result); data.settings.backgroundMode = "custom"; save(); render(); };
    reader.readAsDataURL(file);
  });
  $("imageUpload")?.addEventListener("change", e => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { localStorage.setItem(CUSTOM_HERO_KEY, reader.result); data.settings.heroStyle = "custom"; save(); render(); };
    reader.readAsDataURL(file);
  });
  $("resetBackgroundBtn")?.addEventListener("click", () => { localStorage.removeItem(CUSTOM_BG_KEY); data.settings.backgroundMode = "wallpaper"; save(); render(); });
  $("resetHeroBtn")?.addEventListener("click", () => { localStorage.removeItem(CUSTOM_HERO_KEY); data.settings.heroStyle = "auto"; save(); render(); });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") return closeAllModals();
    if (event.target.matches("input, textarea, select") || event.target.isContentEditable) return;
    if (data.settings.shortcut === "altT" && event.altKey && !event.ctrlKey && !event.shiftKey && event.key.toLowerCase() === "t") {
      event.preventDefault(); openModal("terminalModal");
    }
    if (data.settings.shortcut === "ctrlShiftSpace" && event.ctrlKey && event.shiftKey && event.code === "Space") {
      event.preventDefault(); openModal("terminalModal");
    }
  });
}

function bindSetting(id, eventName, setter) { $(id)?.addEventListener(eventName, e => setter(e.target.value)); }
function bindNumber(id, key, after) { $(id)?.addEventListener("input", e => { data.settings[key] = Number(e.target.value); save(); after?.(); renderTerminal(); }); }

bindEvents();
render();
updateClock();
setInterval(updateClock, 1000);
refreshWeather(false);
setInterval(() => refreshWeather(false), 30 * 60 * 1000);
