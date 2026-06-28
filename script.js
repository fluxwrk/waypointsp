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
  "sections": [
    {
      "name": "Getting Started",
      "links": [
        {
          "name": "Welcome",
          "url": "waypoint:welcome",
          "icon": "📖"
        },
        {
          "name": "Settings",
          "url": "waypoint:settings",
          "icon": "⚙️"
        }
      ]
    }
  ],
  "settings": {
    "theme": "nord",
    "backgroundMode": "wallpaper",
    "overlay": 35,
    "blur": 0,
    "heroHeight": 240,
    "heroSize": "medium",
    "heroZoom": 100,
    "heroY": 50,
    "heroStyle": "auto",
    "heroFit": "cover",
    "bookmarkLayout": "list",
    "userName": "user",
    "weatherLocation": "",
    "weatherUnit": "auto",
    "searchEngine": "google",
    "customSearchUrl": "",
    "shortcut": "ctrlShiftSpace",
    "fontFamily": "source",
    "uiScale": 100,
    "useCustomColors": false,
    "customAccent": "#00d084",
    "customPanel": "#09111a",
    "customText": "#d8dee9",
    "windowTransparency": 100,
    "terminalTransparency": 92,
    "useCustomTextColors": false,
    "sectionTitleColor": "#d8dee9",
    "bookmarkTextColor": "#d8dee9",
    "mutedTextColor": "#9aa4b8",
    "terminalTextColor": "#d9e5f6",
    "statusTextColor": "#d8dee9",
    "layoutPreset": "classic",
    "showLogo": true,
    "showWordmark": true,
    "showClock": true,
    "showWeather": true,
    "showSearch": true,
    "showSectionTitles": true,
    "widgets": {},
    "bookmarkColumns": "auto",
    "bookmarkFontSize": 13,
    "bookmarkIconSize": 22,
    "customCss": "",
    "terminalLeft": null,
    "terminalTop": null,
    "settingsLeft": null,
    "settingsTop": null,
    "lastModified": null
  }
};

const bundledDemoData = {
  "sections": [
    {
      "name": "Getting Started",
      "links": [
        {
          "name": "Welcome",
          "url": "waypoint:welcome",
          "icon": "\ud83d\udcd6"
        },
        {
          "name": "Settings",
          "url": "waypoint:settings",
          "icon": "\u2699\ufe0f"
        }
      ]
    }
  ],
  "settings": {
    "theme": "catppuccin",
    "backgroundMode": "wallpaper",
    "overlay": 0,
    "blur": 5,
    "heroHeight": 240,
    "heroSize": "medium",
    "heroZoom": 100,
    "heroY": 50,
    "heroStyle": "auto",
    "heroFit": "cover",
    "bookmarkLayout": "grid",
    "userName": "demouser",
    "weatherLocation": "10012",
    "weatherUnit": "auto",
    "searchEngine": "google",
    "customSearchUrl": "",
    "shortcut": "ctrlShiftSpace",
    "fontFamily": "source",
    "uiScale": 100,
    "useCustomColors": false,
    "customAccent": "#00d084",
    "customPanel": "#09111a",
    "customText": "#d8dee9",
    "windowTransparency": 100,
    "terminalTransparency": 60,
    "useCustomTextColors": false,
    "sectionTitleColor": "#d8dee9",
    "bookmarkTextColor": "#d8dee9",
    "mutedTextColor": "#9aa4b8",
    "terminalTextColor": "#d9e5f6",
    "statusTextColor": "#d8dee9",
    "layoutPreset": "classic",
    "showLogo": true,
    "showWordmark": true,
    "showClock": true,
    "showWeather": true,
    "showSearch": true,
    "showSectionTitles": true,
    "widgets": {},
    "bookmarkColumns": "auto",
    "bookmarkFontSize": 13,
    "bookmarkIconSize": 36,
    "customCss": "",
    "terminalLeft": null,
    "terminalTop": null,
    "settingsLeft": null,
    "settingsTop": null,
    "lastModified": "2026-06-25T07:27:50.176Z"
  }
};

let data;
let activeSection = 0;
let editingLink = null;
let draggedSectionIndex = null;
let draggedLink = null;
let pendingLinkIcon = null;
let terminalBuffer = [];

function $(id) { return document.getElementById(id); }
function clamp(value, min, max, fallback) { return Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback; }
function safeParse(value) { try { return JSON.parse(value); } catch { return null; } }
function escapeHtml(value) { return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;"); }
function sanitizeUserName(value) { return String(value || "").trim().toLowerCase().replace(/[^a-z0-9._-]/g, "").slice(0, 32); }
function displayUserName() { return data.settings.userName || "user"; }
const INTERNAL_ACTIONS = {
  welcome: { icon: "📖", label: "Welcome", aliases: ["guide", "tutorial"], run: () => startWelcomeGuide() },
  settings: { icon: "⚙️", label: "Settings", aliases: [], run: () => openSettingsPage("appearance") },
  terminal: { icon: "▣", label: "Terminal", aliases: [], run: () => openModal("terminalModal") }
};
function isWaypointUrl(url) { return /^waypoint:/i.test(String(url || "").trim()); }
function waypointActionKey(url) { return String(url || "").replace(/^waypoint:/i, "").trim().toLowerCase(); }
function internalActionForUrl(url) {
  const key = waypointActionKey(url);
  if (INTERNAL_ACTIONS[key]) return INTERNAL_ACTIONS[key];
  return Object.values(INTERNAL_ACTIONS).find(action => action.aliases.includes(key)) || null;
}
function waypointIcon(url) { return internalActionForUrl(url)?.icon || "◆"; }
function cleanInternalLinkName(name, url) {
  const action = internalActionForUrl(url);
  if (!action) return String(name || url || "").trim();
  const raw = String(name || action.label).trim();
  const cleaned = raw.startsWith(action.icon) ? raw.slice(action.icon.length).trim() : raw;
  return cleaned || action.label;
}
function normalizeUrl(url) { const t = String(url || "").trim(); if (!t) return ""; if (isWaypointUrl(t)) return t; return /^https?:\/\//i.test(t) ? t : `https://${t}`; }
function favicon(url) { try { if (isWaypointUrl(url)) return ""; const host = new URL(url).hostname; return host ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=32` : ""; } catch { return ""; } }
function getTheme() { return THEMES[data.settings.theme] || THEMES.nord; }
function countBookmarks() { return data.sections.reduce((sum, section) => sum + section.links.length, 0); }

const HERO_SIZES = {
  hidden: { label: "Hidden", height: 0 },
  small: { label: "Small", height: 160 },
  medium: { label: "Medium", height: 240 },
  large: { label: "Large", height: 330 }
};
function normalizeHeroSize(value, heroHeight, heroStyle) {
  const raw = String(value || "").toLowerCase();
  if (HERO_SIZES[raw]) return raw;
  if (heroStyle === "hidden") return "hidden";
  const height = Number(heroHeight);
  if (Number.isFinite(height)) {
    if (height <= 200) return "small";
    if (height <= 270) return "medium";
    return "large";
  }
  return "large";
}
function heroHeightForSize(size, fallbackHeight) {
  if (size === "hidden") return 0;
  if (HERO_SIZES[size]) return HERO_SIZES[size].height;
  return clamp(Number(fallbackHeight), 160, 360, 330);
}
function labelHeroSize(size) { return HERO_SIZES[size]?.label || "Large"; }

const WIDGET_REGISTRY = [
  { id: "logo", label: "Logo / Terminal Button", selector: "#logoBtn", area: "toolbar", visibleKey: "showLogo", movable: true, resizable: false },
  { id: "wordmark", label: "Waypoint Wordmark", selector: ".brand-wordmark", area: "toolbar", visibleKey: "showWordmark", movable: true, resizable: false },
  { id: "clock", label: "Clock", selector: "#clock", area: "toolbar", visibleKey: "showClock", movable: true, resizable: false },
  { id: "weather", label: "Weather", selector: "#weatherWidget", area: "toolbar", visibleKey: "showWeather", movable: true, resizable: false },
  { id: "search", label: "Search", selector: "#searchForm", area: "hero", visibleKey: "showSearch", movable: true, resizable: true },
  { id: "hero", label: "Hero Banner", selector: "#heroImageCard", area: "hero", visibleKey: "heroSize", movable: true, resizable: true },
  { id: "sections", label: "Bookmark Sections", selector: "#sections", area: "content", visibleKey: "showSectionTitles", movable: true, resizable: false }
];

function defaultWidgetState() {
  return Object.fromEntries(WIDGET_REGISTRY.map(widget => [widget.id, {
    area: widget.area,
    order: WIDGET_REGISTRY.findIndex(item => item.id === widget.id),
    x: null,
    y: null,
    width: null,
    height: null,
    customPlacement: false,
    customSize: false
  }]));
}

function normalizeWidgetState(input) {
  const normalized = defaultWidgetState();
  if (!input || typeof input !== "object") return normalized;
  for (const widget of WIDGET_REGISTRY) {
    const incoming = input[widget.id];
    if (!incoming || typeof incoming !== "object") continue;
    normalized[widget.id] = {
      ...normalized[widget.id],
      area: ["toolbar", "hero", "content", "floating"].includes(incoming.area) ? incoming.area : normalized[widget.id].area,
      order: Number.isFinite(Number(incoming.order)) ? Number(incoming.order) : normalized[widget.id].order,
      x: Number.isFinite(Number(incoming.x)) ? Number(incoming.x) : null,
      y: Number.isFinite(Number(incoming.y)) ? Number(incoming.y) : null,
      width: Number.isFinite(Number(incoming.width)) ? Number(incoming.width) : null,
      height: Number.isFinite(Number(incoming.height)) ? Number(incoming.height) : null,
      customPlacement: incoming.customPlacement === true,
      customSize: incoming.customSize === true
    };
  }
  return normalized;
}

function widgetVisible(widget) {
  if (widget.visibleKey === "heroSize") return data.settings.heroSize !== "hidden";
  return data.settings[widget.visibleKey] !== false;
}

let editLayoutActive = false;

function ensureEditLayoutBar() {
  let bar = document.getElementById("editLayoutBar");
  if (bar) return bar;
  bar = document.createElement("div");
  bar.id = "editLayoutBar";
  bar.className = "edit-layout-bar hidden";
  bar.innerHTML = `
    <strong>Edit Layout</strong>
    <span>Inspecting widgets</span>
    <button id="doneEditLayoutBtn" type="button">Done</button>
    <button id="resetWidgetLayoutBtn" type="button">Reset Layout</button>
  `;
  document.body.appendChild(bar);
  bar.querySelector("#doneEditLayoutBtn")?.addEventListener("click", () => setEditLayoutMode(false));
  bar.querySelector("#resetWidgetLayoutBtn")?.addEventListener("click", () => resetWidgetLayout());
  return bar;
}

function updateEditLayoutBar() {
  const bar = ensureEditLayoutBar();
  bar.classList.toggle("hidden", !editLayoutActive);
}

function setEditLayoutMode(active) {
  editLayoutActive = !!active;
  if (editLayoutActive) closeAllModals();
  document.body.classList.toggle("edit-layout-active", editLayoutActive);
  updateEditLayoutBar();
  applyWidgetFoundation();
}

function toggleEditLayoutMode() {
  setEditLayoutMode(!editLayoutActive);
}

function resetWidgetLayout() {
  data.settings.widgets = normalizeWidgetState({});
  save();
  render();
  setEditLayoutMode(true);
}

function widgetSummaryText() {
  return cleanList("Waypoint Widgets", WIDGET_REGISTRY.map(widget => {
    const state = data.settings.widgets?.[widget.id] || {};
    const flags = [widget.area, widgetVisible(widget) ? "visible" : "hidden"];
    if (state.customPlacement) flags.push("custom placement");
    if (state.customSize) flags.push("custom size");
    return `${widget.id.padEnd(10)} ${widget.label} (${flags.join(", ")})`;
  }));
}

function applyWidgetFoundation() {
  document.body.classList.add("widget-foundation-ready");
  for (const widget of WIDGET_REGISTRY) {
    const el = document.querySelector(widget.selector);
    if (!el) continue;
    const state = data.settings.widgets?.[widget.id] || {};
    el.classList.add("waypoint-widget");
    el.dataset.widgetId = widget.id;
    el.dataset.widgetLabel = widget.label;
    el.dataset.widgetArea = state.area || widget.area;
    el.dataset.widgetVisible = String(widgetVisible(widget));
    el.dataset.widgetMovable = String(widget.movable);
    el.dataset.widgetResizable = String(widget.resizable);
  }
  document.querySelectorAll(".waypoint-widget-section").forEach(sectionEl => {
    sectionEl.classList.add("waypoint-widget");
    sectionEl.dataset.widgetVisible = "true";
    sectionEl.dataset.widgetMovable = "true";
    sectionEl.dataset.widgetResizable = "false";
  });
}

const LAYOUT_PRESET_DEFAULTS = {
  classic: {
    showLogo: true,
    showWordmark: true,
    showClock: true,
    showWeather: true,
    showSearch: true,
    showSectionTitles: true,
    heroSize: "medium"
  },
  dashboard: {
    showLogo: true,
    showWordmark: true,
    showClock: true,
    showWeather: true,
    showSearch: true,
    showSectionTitles: true,
    heroSize: "hidden"
  },
  minimal: {
    showLogo: false,
    showWordmark: false,
    showClock: false,
    showWeather: false,
    showSearch: true,
    showSectionTitles: true,
    heroSize: "hidden"
  },
  centered: {
    showLogo: true,
    showWordmark: true,
    showClock: true,
    showWeather: true,
    showSearch: true,
    showSectionTitles: true,
    heroSize: "medium"
  }
};

function applyLayoutPresetDefaults(preset) {
  if (!LAYOUT_PRESET_DEFAULTS[preset]) return false;
  data.settings.layoutPreset = preset;
  const defaults = LAYOUT_PRESET_DEFAULTS[preset];
  ["showLogo", "showWordmark", "showClock", "showWeather", "showSearch", "showSectionTitles"].forEach(key => {
    data.settings[key] = defaults[key];
  });
  data.settings.heroSize = defaults.heroSize;
  data.settings.heroHeight = heroHeightForSize(defaults.heroSize, data.settings.heroHeight);
  return true;
}

function loadStoredProfile() {
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
  return null;
}

async function loadDemoProfile() {
  try {
    const response = await fetch("demo.json", { cache: "no-store" });
    if (!response.ok) throw new Error("demo profile unavailable");
    return normalizeData(await response.json());
  } catch {
    return normalizeData(bundledDemoData);
  }
}

async function loadInitialProfile() {
  const stored = loadStoredProfile();
  if (stored) return stored;
  const demoProfile = await loadDemoProfile();
  localStorage.setItem(KEY, JSON.stringify(demoProfile));
  return demoProfile;
}

function normalizeData(input) {
  const normalized = structuredClone(defaultData);

  const normalizeLinks = links => Array.isArray(links)
    ? links.filter(link => link && link.url).map(link => {
      const url = normalizeUrl(link.url);
      const icon = isWaypointUrl(url) ? waypointIcon(url) : typeof link.icon === "string" && link.icon ? link.icon : "";
      const name = isWaypointUrl(url) ? cleanInternalLinkName(link.name || link.url, url) : String(link.name || link.url);
      return { name, url, icon };
    })
    : [];

  if (Array.isArray(input.sections)) {
    normalized.sections = input.sections.map((section, index) => ({
      name: String(section.name || `Section ${index + 1}`),
      links: normalizeLinks(section.links)
    }));
  } else if (input && typeof input === "object") {
    const ignoredKeys = new Set(["settings", "version", "name", "profile", "theme", "layout", "bookmarks"]);
    const objectSections = Object.entries(input)
      .filter(([name, links]) => !ignoredKeys.has(name) && Array.isArray(links))
      .map(([name, links]) => ({ name: String(name), links: normalizeLinks(links) }))
      .filter(section => section.links.length || section.name.trim());
    if (objectSections.length) normalized.sections = objectSections;
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
  normalized.settings.heroSize = normalizeHeroSize(normalized.settings.heroSize, normalized.settings.heroHeight, normalized.settings.heroStyle);
  if (normalized.settings.heroStyle === "hidden") normalized.settings.heroStyle = "auto";
  normalized.settings.heroHeight = heroHeightForSize(normalized.settings.heroSize, normalized.settings.heroHeight);
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
  normalized.settings.fontFamily = ["system", "inter", "jetbrains", "firacode", "fira", "plex", "source", "roboto", "noto", "ubuntu", "opensans", "mono"].includes(normalized.settings.fontFamily) ? normalized.settings.fontFamily : "system";
  normalized.settings.uiScale = clamp(Number(normalized.settings.uiScale), 85, 120, 100);
  normalized.settings.useCustomColors = normalized.settings.useCustomColors === true || normalized.settings.useCustomColors === "true";
  normalized.settings.windowTransparency = clamp(Number(normalized.settings.windowTransparency ?? 92), 60, 100, 92);
  normalized.settings.terminalTransparency = clamp(Number(normalized.settings.terminalTransparency ?? 94), 60, 100, 94);
  normalized.settings.customAccent = /^#[0-9a-f]{6}$/i.test(normalized.settings.customAccent || "") ? normalized.settings.customAccent : "#00d084";
  normalized.settings.customPanel = /^#[0-9a-f]{6}$/i.test(normalized.settings.customPanel || "") ? normalized.settings.customPanel : "#09111a";
  normalized.settings.customText = /^#[0-9a-f]{6}$/i.test(normalized.settings.customText || "") ? normalized.settings.customText : "#d8dee9";
  normalized.settings.useCustomTextColors = normalized.settings.useCustomTextColors === true || normalized.settings.useCustomTextColors === "true";
  normalized.settings.sectionTitleColor = /^#[0-9a-f]{6}$/i.test(normalized.settings.sectionTitleColor || "") ? normalized.settings.sectionTitleColor : "#d8dee9";
  normalized.settings.bookmarkTextColor = /^#[0-9a-f]{6}$/i.test(normalized.settings.bookmarkTextColor || "") ? normalized.settings.bookmarkTextColor : "#d8dee9";
  normalized.settings.mutedTextColor = /^#[0-9a-f]{6}$/i.test(normalized.settings.mutedTextColor || "") ? normalized.settings.mutedTextColor : "#9aa4b8";
  normalized.settings.terminalTextColor = /^#[0-9a-f]{6}$/i.test(normalized.settings.terminalTextColor || "") ? normalized.settings.terminalTextColor : "#d9e5f6";
  normalized.settings.statusTextColor = /^#[0-9a-f]{6}$/i.test(normalized.settings.statusTextColor || "") ? normalized.settings.statusTextColor : "#d8dee9";
  normalized.settings.layoutPreset = ["classic", "minimal", "dashboard", "centered"].includes(normalized.settings.layoutPreset) ? normalized.settings.layoutPreset : "classic";
  ["showLogo", "showWordmark", "showClock", "showWeather", "showSearch", "showSectionTitles"].forEach(key => { normalized.settings[key] = normalized.settings[key] !== false && normalized.settings[key] !== "false"; });
  normalized.settings.widgets = normalizeWidgetState(normalized.settings.widgets);
  normalized.settings.bookmarkColumns = ["auto", "2", "3", "4"].includes(String(normalized.settings.bookmarkColumns)) ? String(normalized.settings.bookmarkColumns) : "auto";
  normalized.settings.bookmarkFontSize = clamp(Number(normalized.settings.bookmarkFontSize), 10, 15, 12);
  normalized.settings.bookmarkIconSize = clamp(Number(normalized.settings.bookmarkIconSize), 14, 36, 22);
  normalized.settings.customCss = String(normalized.settings.customCss || "").slice(0, 8000);
  normalized.settings.settingsLeft = Number.isFinite(Number(normalized.settings.settingsLeft)) ? Number(normalized.settings.settingsLeft) : null;
  normalized.settings.settingsTop = Number.isFinite(Number(normalized.settings.settingsTop)) ? Number(normalized.settings.settingsTop) : null;
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
    firacode: '"Fira Code", "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    plex: '"IBM Plex Sans", Inter, ui-sans-serif, system-ui, sans-serif',
    source: '"Source Sans 3", Inter, ui-sans-serif, system-ui, sans-serif',
    noto: '"Noto Sans", Inter, ui-sans-serif, system-ui, sans-serif',
    ubuntu: 'Ubuntu, Inter, ui-sans-serif, system-ui, sans-serif',
    opensans: '"Open Sans", Inter, ui-sans-serif, system-ui, sans-serif',
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
    root.style.setProperty("--surface", hexToRgba(data.settings.customPanel, .70));
    root.style.setProperty("--surface-strong", hexToRgba(data.settings.customPanel, .92));
    root.style.setProperty("--surface-soft", hexToRgba(data.settings.customPanel, .34));
    root.style.setProperty("--accent-hover", hexToRgba(data.settings.customAccent, .16));
  } else {
    root.style.setProperty("--waypoint-green", "#00d084");
    root.style.setProperty("--surface", theme.panel);
    root.style.setProperty("--surface-strong", theme.panelStrong);
    root.style.setProperty("--surface-soft", "rgba(5, 9, 18, .16)");
    root.style.setProperty("--accent-hover", "var(--accent-soft)");
  }
  root.style.setProperty("--text", data.settings.customText);
  root.style.setProperty("--muted", colorMix(data.settings.customText, "#808080", .45));
  root.style.setProperty("--window-opacity-percent", `${data.settings.windowTransparency}%`);
  root.style.setProperty("--terminal-opacity", String(data.settings.terminalTransparency / 100));

  if (data.settings.useCustomTextColors) {
    root.style.setProperty("--section-title-color", data.settings.sectionTitleColor);
    root.style.setProperty("--bookmark-text-color", data.settings.bookmarkTextColor);
    root.style.setProperty("--custom-muted-text", data.settings.mutedTextColor);
    root.style.setProperty("--terminal-text-color", data.settings.terminalTextColor);
    root.style.setProperty("--status-text-color", data.settings.statusTextColor);
  } else {
    root.style.setProperty("--section-title-color", "var(--text)");
    root.style.setProperty("--bookmark-text-color", "var(--text)");
    root.style.setProperty("--custom-muted-text", "var(--muted)");
    root.style.setProperty("--terminal-text-color", "#d9e5f6");
    root.style.setProperty("--status-text-color", "var(--text)");
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
  const heroSize = normalizeHeroSize(data.settings.heroSize, data.settings.heroHeight, data.settings.heroStyle);
  const isBannerHidden = heroSize === "hidden";
  data.settings.heroSize = heroSize;
  data.settings.heroHeight = heroHeightForSize(heroSize, data.settings.heroHeight);
  card.classList.toggle("hidden-banner", isBannerHidden);
  const hero = document.querySelector(".hero");
  hero?.classList.toggle("banner-hidden", isBannerHidden);
  ["hidden", "small", "medium", "large"].forEach(size => hero?.classList.toggle(`hero-size-${size}`, heroSize === size));
  card.style.setProperty("--hero-height", `${data.settings.heroHeight}px`);
  card.style.setProperty("--hero-min-height", `${data.settings.heroHeight}px`);
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
  setValue("globalTextColorInput", s.customText);
  setValue("windowTransparencySlider", s.windowTransparency);
  setText("windowTransparencyValue", `${s.windowTransparency}%`);
  setValue("terminalTransparencySlider", s.terminalTransparency);
  setText("terminalTransparencyValue", `${s.terminalTransparency}%`);
  document.querySelectorAll(".custom-text-only input").forEach(input => input.disabled = !s.useCustomTextColors);
  setValue("customTextColorsSelect", String(!!s.useCustomTextColors));
  setValue("sectionTitleColorInput", s.sectionTitleColor);
  setValue("bookmarkTextColorInput", s.bookmarkTextColor);
  setValue("mutedTextColorInput", s.mutedTextColor);
  setValue("terminalTextColorInput", s.terminalTextColor);
  setValue("statusTextColorInput", s.statusTextColor);
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
  setValue("heroHeightPresetSelect", s.heroSize || normalizeHeroSize(null, s.heroHeight, s.heroStyle));
  setValue("heroZoomSlider", s.heroZoom);
  setValue("heroYSlider", s.heroY);
  setText("overlayValue", `${s.overlay}%`);
  setText("blurValue", `${s.blur}px`);
    setText("heroZoomValue", `${s.heroZoom}%`);
  setText("heroYValue", `${s.heroY}%`);
  setText("uiScaleValue", `${s.uiScale}%`);
  setText("bookmarkFontValue", `${s.bookmarkFontSize}px`);
  setText("bookmarkIconValue", `${s.bookmarkIconSize}px`);
}
function setValue(id, value) { const el = $(id); if (!el) return; if (document.activeElement === el) return; if (el.value !== String(value)) el.value = value; }
function setText(id, value) { const el = $(id); if (el) el.textContent = value; }

function setBannerSize(size) {
  if (!HERO_SIZES[size]) return false;
  data.settings.heroSize = size;
  data.settings.heroHeight = heroHeightForSize(size, data.settings.heroHeight);
  save();
  render();
  return true;
}

function updateLogoPrompt() {
  const text = `${displayUserName()}@waypoint:~$`;
  setText("logoPrompt", text);
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
  if (id === "settingsModal") positionSettings();
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
  applyWidgetFoundation();
  updateEditLayoutBar();
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
    sectionEl.className = `section waypoint-widget-section${section.links.length ? "" : " empty-section"}`;
    sectionEl.dataset.widgetId = `section-${sectionIndex}`;
    sectionEl.dataset.widgetLabel = `Bookmark Section: ${section.name || `Section ${sectionIndex + 1}`}`;
    sectionEl.dataset.widgetArea = "content";
    sectionEl.draggable = true;
    sectionEl.dataset.sectionIndex = sectionIndex;
    sectionEl.innerHTML = `
      <div class="section-header">
        <span class="section-name" contenteditable="true" spellcheck="false">${escapeHtml(section.name)}</span>
      </div>
      <div class="section-actions">
        <button class="section-action add-link-btn" title="Add link" type="button">+</button>
        <button class="section-action section-delete" title="Delete section" type="button">×</button>
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
      const iconSource = isWaypointUrl(link.url) ? waypointIcon(link.url) : link.icon || favicon(link.url);
      const internalClass = isWaypointUrl(link.url) ? " internal-link" : "";
      const displayName = isWaypointUrl(link.url) ? cleanInternalLinkName(link.name, link.url) : link.name;
      row.className += internalClass;
      row.innerHTML = `
        <span class="link-icon-fallback" aria-hidden="true">${escapeHtml(iconSource && !/^data:|^https?:/i.test(iconSource) ? iconSource : "")}</span>
        <img src="${escapeHtml(/^data:|^https?:/i.test(iconSource) ? iconSource : "")}" alt="" aria-hidden="true"${/^data:|^https?:/i.test(iconSource) ? "" : " hidden"}>
        <a href="${escapeHtml(link.url)}" tabindex="-1">${escapeHtml(displayName)}</a>
        <span class="edit-link" title="Edit link" aria-label="Edit link">✎</span>
        <span class="delete-link" title="Delete link" aria-label="Delete link">×</span>
      `;
      row.addEventListener("click", event => {
        if (event.target.closest(".delete-link") || event.target.closest(".edit-link") || event.defaultPrevented) return;
        if (handleWaypointLink(link.url)) return;
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

  const addTile = document.createElement("button");
  addTile.className = "section-add-tile";
  addTile.type = "button";
  addTile.title = "Add Section";
  addTile.setAttribute("aria-label", "Add Section");
  addTile.innerHTML = `<span aria-hidden="true">+</span>`;
  addTile.addEventListener("click", () => addSection());
  container.appendChild(addTile);
}

function handleWaypointLink(url) {
  if (!isWaypointUrl(url)) return false;
  const action = internalActionForUrl(url);
  if (action) { action.run(); return true; }
  const key = waypointActionKey(url);
  pushTerminal(terminalBlock(commandResult(`Unknown Waypoint action: ${escapeHtml(key)}`, "terminal-warning")));
  openModal("terminalModal");
  return true;
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
    if (draggedLink) {
      event.preventDefault();
      event.stopPropagation();
      sectionEl.querySelector(".links")?.classList.add("drag-over");
      return;
    }
    if (draggedSectionIndex === null || draggedSectionIndex === sectionIndex) return;
    event.preventDefault();
    const before = event.offsetY < sectionEl.offsetHeight / 2;
    sectionEl.classList.toggle("section-drop-before", before);
    sectionEl.classList.toggle("section-drop-after", !before);
  });
  sectionEl.addEventListener("dragleave", event => {
    if (!sectionEl.contains(event.relatedTarget)) sectionEl.querySelector(".links")?.classList.remove("drag-over");
    sectionEl.classList.remove("section-drop-before", "section-drop-after");
  });
  sectionEl.addEventListener("drop", event => {
    if (draggedLink) {
      event.preventDefault();
      event.stopPropagation();
      sectionEl.querySelector(".links")?.classList.remove("drag-over");
      moveLink(draggedLink.sectionIndex, draggedLink.linkIndex, sectionIndex, data.sections[sectionIndex].links.length);
      return;
    }
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
  const normalizedUrl = normalizeUrl(rawUrl);
  const nextName = isWaypointUrl(normalizedUrl) ? cleanInternalLinkName(name, normalizedUrl) : name;
  const nextLink = { name: nextName, url: normalizedUrl, icon: isWaypointUrl(normalizedUrl) ? waypointIcon(normalizedUrl) : pendingLinkIcon || "" };
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
  const safeName = isWaypointUrl(safeUrl) ? cleanInternalLinkName(linkName, safeUrl) : String(linkName).trim() || safeUrl;
  data.sections[sectionIndex].links.push({ name: safeName, url: safeUrl, icon: isWaypointUrl(safeUrl) ? waypointIcon(safeUrl) : "" });
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
    ["Version", "1.2.1"],
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
  renderTerminalBuffer();
}

function terminalPrompt() {
  return `${displayUserName()}@waypoint:~$`;
}

function renderTerminalBuffer() {
  const out = $("commandOutput");
  if (!out) return;
  out.innerHTML = terminalBuffer.join("");
  out.scrollTop = out.scrollHeight;
}

function pushTerminal(html) {
  terminalBuffer.push(html);
  if (terminalBuffer.length > 80) terminalBuffer = terminalBuffer.slice(-80);
  renderTerminalBuffer();
}

function terminalBlock(html) {
  return `<div class="terminal-block">${html}</div>`;
}

function terminalLine(text = "") {
  return `<div>${escapeHtml(text)}</div>`;
}

function terminalPre(text, className = "") {
  return `<pre class="${className}">${escapeHtml(text)}</pre>`;
}

function terminalEcho(command) {
  return `<div class="terminal-echo"><span>${escapeHtml(terminalPrompt())}</span> ${escapeHtml(command)}</div>`;
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
    if ([0, 1].includes(code)) return isDay ? "☀️" : "🌙";
    if (code === 2) return isDay ? "🌤️" : "☁️";
    if (code === 3) return "☁️";
    if ([45, 48].includes(code)) return "🌫️";
    if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return "🌧️";
    if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return "❄️";
    if (code >= 95) return "⛈️";
  }
  const d = String(desc).toLowerCase();
  if (d.includes("thunder")) return "⛈️";
  if (d.includes("rain") || d.includes("drizzle")) return "🌧️";
  if (d.includes("snow") || d.includes("sleet")) return "❄️";
  if (d.includes("cloud") || d.includes("overcast")) return "☁️";
  if (d.includes("fog") || d.includes("mist")) return "🌫️";
  if (d.includes("clear") || d.includes("sun")) return isDay ? "☀️" : "🌙";
  return "🌡️";
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

function buildHelpText(topic = "") {
  const t = String(topic || "").trim().toLowerCase();
  if (t === "theme") return `theme <name>

Change the active theme.

Available themes:
  nord
  catppuccin
  gruvbox
  tokyo

Examples:
  theme nord
  theme gruvbox`;
  if (t === "layout") return `layout <mode>

Change the bookmark layout.

Available modes:
  list
  grid

Examples:
  layout list
  layout grid

Use preset for full page layout presets:
  preset minimal
  preset dashboard`;
  if (t === "visibility" || t === "hide" || t === "show") return `show|hide <element>

Toggle interface elements.

Elements:
  logo
  title
  clock
  weather
  search
  sections

Examples:
  hide title
  hide sections
  show weather`;
  if (t === "search" || t === "engine") return `engine <name>

Change the search engine.

Available engines:
  google
  duckduckgo
  brave
  bing
  custom

Examples:
  engine duckduckgo
  engine brave
  customsearch https://example.com/search?q=%s`;
  if (t === "css") return buildCssManualText();
  return `Waypoint Terminal

Common commands:
  fetch                         Show Waypoint system info
  help                          Show this help
  help <topic>                  Show help for a command group
  man css                       Show Custom CSS examples
  settings                      Open Settings
  settings appearance           Open a Settings page
  theme nord                    Change theme
  preset minimal                Change page layout preset
  layout list                   Change bookmark layout
  show weather                  Show a UI element
  hide title                    Hide a UI element
  font jetbrains                Change font
  accent #00d084               Set accent color
  surface #09111a              Set surface color
  transparency 92              Set window transparency
  titlecolor #d8dee9           Set section title color
  engine duckduckgo             Change search engine
  weather Russellville, AR      Set weather location
  add section Media             Add a section
  add link "Media" "Jellyfin" https://jellyfin.org
  export                        Export JSON
  import                        Import JSON
  clear                         Clear terminal
  exit                          Close terminal

Help topics:
  help theme
  help layout
  help visibility
  help search
  help css`;
}

function buildCssManualText() {
  return `Custom CSS Manual

Custom CSS is applied last, so it can override Waypoint styling.
Use it for small personal tweaks. Bad CSS can make the page ugly or hide controls.
Clear it from Settings > Advanced if you break something.

Change the main accent color:
:root {
  --waypoint-green: #ff79c6;
}

Hide the Waypoint wordmark:
.brand-wordmark {
  display: none !important;
}

Make bookmark cards rounder:
.link {
  border-radius: 18px !important;
}

Make sections more transparent:
.section {
  background: rgba(5, 9, 18, .35) !important;
}

Make the search bar wider:
.search {
  width: min(920px, calc(100% - 80px)) !important;
}

Hide the section header completely:
.section-header {
  opacity: 0 !important;
}

Notes:
  :root means the whole page.
  --waypoint-green controls Waypoint's bright green accent.
  !important makes your rule win over built-in styling.`;
}

function buildStatusLines(action, steps = ["Updating configuration", "Refreshing interface", "Done"]) {
  return terminalPre([action, ...steps.map(step => `  ${step}...`)].join("\n"), "terminal-status");
}

function commandResult(text) {
  return terminalPre(text, "terminal-result");
}

function runCommand(commandRaw) {
  const command = commandRaw.trim();
  if (!command) return;
  const lower = command.toLowerCase();
  const [head, ...rest] = lower.split(/\s+/);
  const arg = rest.join(" ");
  if (head === "clear") { terminalBuffer = []; renderTerminalBuffer(); return; }
  if (["q", "quit", "exit"].includes(lower)) { closeModal("terminalModal"); return; }
  const blocks = [terminalEcho(command)];
  const done = html => pushTerminal(terminalBlock(blocks.join("") + (html || "")));
  const textOut = text => done(commandResult(text));

  if (head === "help") return done(terminalPre(buildHelpText(arg), "terminal-help"));
  if (head === "man") {
    if (arg === "css") return done(terminalPre(buildCssManualText(), "terminal-help"));
    return textOut(`No manual entry for ${arg || "nothing"}. Try: man css`);
  }
  if (head === "fetch") return done(buildFastfetchHtml());
  if (head === "widgets") return done(terminalPre(widgetSummaryText(), "terminal-help"));
  if (head === "settings") {
    openSettingsPage(arg || "appearance");
    return textOut(`Opened Settings${arg ? ` > ${arg}` : " > appearance"}.`);
  }
  if (["show", "hide"].includes(head)) {
    const keyMap = { logo: "showLogo", terminal: "showLogo", button: "showLogo", title: "showWordmark", wordmark: "showWordmark", clock: "showClock", weather: "showWeather", search: "showSearch", sections: "showSectionTitles", titles: "showSectionTitles" };
    const key = keyMap[arg];
    if (!key) return textOut("Usage: show|hide logo|title|clock|weather|search|sections");
    data.settings[key] = head === "show";
    save(); render();
    return done(buildStatusLines(`${head === "show" ? "Showing" : "Hiding"}: ${arg}`));
  }
  if (head === "preset") {
    if (!["classic", "minimal", "dashboard", "centered"].includes(arg)) return textOut("Usage: preset classic|dashboard|minimal|centered");
    applyLayoutPresetDefaults(arg);
    save(); render();
    return done(buildStatusLines(`Applying layout preset defaults: ${arg}`));
  }
  if (head === "font") {
    if (!["system", "inter", "jetbrains", "fira", "roboto", "mono"].includes(arg)) return textOut("Usage: font system|inter|jetbrains|fira|roboto|mono");
    data.settings.fontFamily = arg;
    save(); render();
    return done(buildStatusLines(`Setting font: ${arg}`));
  }
  if (head === "accent") {
    const color = rest[0] || "";
    if (!/^#[0-9a-f]{6}$/i.test(color)) return textOut("Usage: accent #00d084");
    data.settings.customAccent = color;
    data.settings.useCustomColors = true;
    save(); render();
    return done(buildStatusLines(`Setting accent color: ${color}`));
  }
  if (head === "surface") {
    const color = rest[0] || "";
    if (!/^#[0-9a-f]{6}$/i.test(color)) return textOut("Usage: surface #09111a");
    data.settings.customPanel = color;
    data.settings.useCustomColors = true;
    save(); render();
    return done(buildStatusLines(`Setting surface color: ${color}`));
  }
  if (head === "transparency") {
    const amount = clamp(Number(rest[0]), 60, 100, NaN);
    if (!Number.isFinite(amount)) return textOut("Usage: transparency 60-100");
    data.settings.windowTransparency = amount;
    save(); render();
    return done(buildStatusLines(`Setting window transparency: ${amount}%`));
  }
  if (head === "titlecolor") {
    const color = rest[0] || "";
    if (!/^#[0-9a-f]{6}$/i.test(color)) return textOut("Usage: titlecolor #d8dee9");
    data.settings.sectionTitleColor = color;
    data.settings.useCustomTextColors = true;
    save(); render();
    return done(buildStatusLines(`Setting section title color: ${color}`));
  }
  if (head === "name") {
    const nextName = commandRaw.trim().replace(/^name\s*/i, "").trim();
    data.settings.userName = sanitizeUserName(nextName);
    save(); render();
    return textOut(`Name set to ${displayUserName()}.`);
  }
  if (head === "searchengine" || head === "engine") {
    const map = { google: "google", ddg: "duckduckgo", duckduckgo: "duckduckgo", brave: "brave", bing: "bing", custom: "custom" };
    if (!arg) return textOut(`Search engine: ${labelSearch(data.settings.searchEngine)}`);
    if (!map[arg]) return textOut("Usage: engine google|duckduckgo|brave|bing|custom");
    data.settings.searchEngine = map[arg];
    save(); render();
    return done(buildStatusLines(`Setting search engine: ${labelSearch(data.settings.searchEngine)}`));
  }
  if (head === "customsearch") {
    const url = commandRaw.trim().replace(/^customsearch\s*/i, "").trim();
    if (!url) return textOut("Usage: customsearch https://example.com/search?q=%s");
    data.settings.customSearchUrl = url.slice(0, 240);
    data.settings.searchEngine = "custom";
    save(); render();
    return textOut("Custom search URL saved.");
  }
  if (head === "theme" && arg) {
    const map = { catppuccin: "catppuccin", nord: "nord", gruvbox: "gruvbox", tokyo: "tokyoNight", "tokyo-night": "tokyoNight", tokyonight: "tokyoNight" };
    if (!map[arg]) return textOut(`theme: unknown theme '${arg}'\n\nAvailable: nord, catppuccin, gruvbox, tokyo`);
    data.settings.theme = map[arg];
    save(); render();
    return done(buildStatusLines(`Applying theme: ${getTheme().label}`));
  }
  if (head === "banner") {
    const map = { desktop: "desktop", atmosphere: "atmo", atmo: "atmo", custom: "custom", auto: "auto", default: "auto" };
    const sizeMap = { hidden: "hidden", hide: "hidden", small: "small", compact: "small", medium: "medium", balanced: "medium", large: "large", tall: "large", showcase: "large" };
    if (arg === "size") {
      const size = parts[1];
      if (!sizeMap[size]) return textOut("Usage: banner size hidden|small|medium|large");
      setBannerSize(sizeMap[size]);
      return done(buildStatusLines(`Setting banner size: ${labelHeroSize(data.settings.heroSize)}`));
    }
    if (sizeMap[arg]) {
      setBannerSize(sizeMap[arg]);
      return done(buildStatusLines(`Setting banner size: ${labelHeroSize(data.settings.heroSize)}`));
    }
    if (["fit", "contain"].includes(arg)) { data.settings.heroFit = "contain"; save(); render(); return done(buildStatusLines("Setting banner fit: contain")); }
    if (["fill", "cover", "crop"].includes(arg)) { data.settings.heroFit = "cover"; save(); render(); return done(buildStatusLines("Setting banner fit: cover")); }
    if (!map[arg]) return textOut(`Unknown banner option: ${arg}\nUsage: banner auto|desktop|atmosphere|custom|hidden|small|medium|large|fit|fill`);
    data.settings.heroStyle = map[arg];
    save(); render();
    return done(buildStatusLines(`Setting banner: ${labelHero(data.settings.heroStyle)}`));
  }
  if (head === "layout") {
    const map = { list: "list", compact: "list", row: "list", rows: "list", grid: "grid", cards: "grid" };
    if (!arg) return textOut(`Bookmark layout: ${(data.settings.bookmarkLayout || "list") === "list" ? "Compact List" : "Grid"}`);
    if (!map[arg]) return textOut("Usage: layout list|grid");
    data.settings.bookmarkLayout = map[arg];
    save(); render();
    return done(buildStatusLines(`Setting bookmark layout: ${data.settings.bookmarkLayout === "list" ? "Compact List" : "Grid"}`));
  }
  if (head === "weather") {
    const next = commandRaw.trim().replace(/^weather\s+/i, "").trim();
    if (!next) return textOut("Usage: weather <city, region, country or ZIP>");
    data.settings.weatherLocation = next;
    save(); refreshWeather(true);
    return done(buildStatusLines(`Setting weather location: ${data.settings.weatherLocation}`, ["Saving location", "Fetching forecast", "Done"]));
  }
  if (head === "wallpaper") {
    const map = { theme: "wallpaper", wallpaper: "wallpaper", default: "wallpaper", gradient: "gradient", custom: "custom" };
    if (!map[arg]) return textOut("Usage: wallpaper theme|gradient|custom");
    data.settings.backgroundMode = map[arg];
    save(); render();
    return done(buildStatusLines(`Setting wallpaper: ${labelBackground(data.settings.backgroundMode)}`));
  }
  if (head === "add") {
    if (arg.startsWith("section")) {
      const sectionName = commandRaw.trim().replace(/^add\s+section\s*/i, "").trim() || "New Section";
      data.sections.push({ name: sectionName, links: [] });
      save(); render();
      return textOut(`Section added: ${sectionName}`);
    }
    if (arg.startsWith("link")) {
      const parsed = parseAddLinkCommand(commandRaw);
      if (!parsed) return textOut('Usage: add link <section> <name> <url>\nTip: use quotes for multi-word names, like add link "Media" "YouTube Music" https://music.youtube.com');
      const message = addLinkByCommand(parsed.sectionName, parsed.linkName, parsed.url).replace(/<[^>]+>/g, "");
      return textOut(message);
    }
  }
  if (head === "delete" && arg.startsWith("section")) {
    const sectionName = commandRaw.trim().replace(/^delete\s+section\s*/i, "").trim();
    if (!sectionName) return textOut("Usage: delete section <name>");
    const message = deleteSectionByCommand(sectionName).replace(/<[^>]+>/g, "");
    return textOut(message);
  }
  if (head === "rename" && arg.startsWith("section")) {
    const body = commandRaw.trim().replace(/^rename\s+section\s*/i, "").trim();
    const quoted = [...body.matchAll(/"([^"]+)"|'([^']+)'/g)].map(match => match[1] || match[2]);
    if (quoted.length >= 2) return textOut(renameSectionByCommand(quoted[0], quoted[1]).replace(/<[^>]+>/g, ""));
    const parts = body.split(/\s+/);
    if (parts.length < 2) return textOut('Usage: rename section <old> <new>\nTip: use quotes for multi-word names.');
    return textOut(renameSectionByCommand(parts[0], parts.slice(1).join(" ")).replace(/<[^>]+>/g, ""));
  }
  if (head === "import") { $("importFile")?.click(); return textOut("Choose a JSON file to import."); }
  if (head === "export") { exportJson(); return textOut("Export started."); }
  if (head === "reset") { resetEverything(); return; }
  if (head === "search") { closeAllModals(); focusSearch(); return; }
  return textOut(`${head}: command not found\n\nTry: help`);
}


function executeButtonCommand(command) {
  if (command === "fetch") runCommand("fetch");
  if (command === "addSection") { addSection(); }
  if (command === "toggleBanner") { data.settings.heroStyle = data.settings.heroStyle === "hidden" ? "auto" : "hidden"; save(); render(); }
  if (command === "export") exportJson();
  if (command === "import") $("importFile")?.click();
  if (command === "help") runCommand("help");
}

function resetEverything() {
  if (!confirm("Reset Waypoint to factory defaults? This clears bookmarks, settings, custom wallpaper, custom banner, and weather cache. It will not reload demo.json.")) return;
  localStorage.removeItem(KEY);
  localStorage.removeItem(CUSTOM_BG_KEY);
  localStorage.removeItem(CUSTOM_HERO_KEY);
  localStorage.removeItem(WEATHER_CACHE_KEY);
  data = structuredClone(defaultData);
  save();
  render();
  pushTerminal(terminalBlock(commandResult("Reboot complete. Defaults restored.")));
}
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

function bindEvents() {
  $("logoBtn")?.addEventListener("click", () => openModal("terminalModal"));
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
    if (handleWelcomeGuideKey(e)) return;
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
  bindSetting("globalTextColorInput", "input", value => { data.settings.customText = value; save(); render(); });
  bindNumber("windowTransparencySlider", "windowTransparency", () => render());
  bindNumber("terminalTransparencySlider", "terminalTransparency", () => render());
  bindSetting("customTextColorsSelect", "change", value => { data.settings.useCustomTextColors = value === "true"; save(); render(); });
  bindSetting("sectionTitleColorInput", "input", value => { data.settings.sectionTitleColor = value; data.settings.useCustomTextColors = true; save(); render(); });
  bindSetting("bookmarkTextColorInput", "input", value => { data.settings.bookmarkTextColor = value; data.settings.useCustomTextColors = true; save(); render(); });
  bindSetting("mutedTextColorInput", "input", value => { data.settings.mutedTextColor = value; data.settings.useCustomTextColors = true; save(); render(); });
  bindSetting("terminalTextColorInput", "input", value => { data.settings.terminalTextColor = value; data.settings.useCustomTextColors = true; save(); render(); });
  bindSetting("statusTextColorInput", "input", value => { data.settings.statusTextColor = value; data.settings.useCustomTextColors = true; save(); render(); });
  bindSetting("layoutPresetSelect", "change", value => { applyLayoutPresetDefaults(value); save(); render(); });
  bindSetting("showLogoSelect", "change", value => { data.settings.showLogo = value === "true"; save(); render(); });
  bindSetting("showWordmarkSelect", "change", value => { data.settings.showWordmark = value === "true"; save(); render(); });
  bindSetting("showClockSelect", "change", value => { data.settings.showClock = value === "true"; save(); render(); });
  bindSetting("showWeatherSelect", "change", value => { data.settings.showWeather = value === "true"; save(); render(); });
  bindSetting("showSearchSelect", "change", value => { data.settings.showSearch = value === "true"; save(); render(); });
  bindSetting("showSectionTitlesSelect", "change", value => { data.settings.showSectionTitles = value === "true"; save(); render(); });
  $("editLayoutBtn")?.addEventListener("click", toggleEditLayoutMode);
  bindSetting("bookmarkColumnsSelect", "change", value => { data.settings.bookmarkColumns = value; save(); render(); });
  bindNumber("bookmarkFontSlider", "bookmarkFontSize", () => applyPersonalization());
  bindNumber("bookmarkIconSlider", "bookmarkIconSize", () => applyPersonalization());
  bindSetting("customCssInput", "input", value => { data.settings.customCss = value.slice(0, 8000); save(); applyPersonalization(); });
  $("cssManBtn")?.addEventListener("click", () => { openModal("terminalModal"); runCommand("help css"); });
  $("clearCustomCssBtn")?.addEventListener("click", () => { data.settings.customCss = ""; save(); render(); });
  $("resetEverythingBtn")?.addEventListener("click", resetEverything);
  bindSetting("backgroundModeSelect", "change", value => { data.settings.backgroundMode = value; save(); render(); });
  bindSetting("heroStyleSelect", "change", value => { if (value === "hidden") { data.settings.heroSize = "hidden"; data.settings.heroHeight = heroHeightForSize("hidden", data.settings.heroHeight); data.settings.heroStyle = "auto"; } else { data.settings.heroStyle = value; } save(); render(); });
  bindSetting("heroFitSelect", "change", value => { data.settings.heroFit = value; save(); render(); });
  bindSetting("bookmarkLayoutSelect", "change", value => { data.settings.bookmarkLayout = value; save(); render(); });
  bindSetting("shortcutSelect", "change", value => { data.settings.shortcut = value; save(); renderTerminal(); });
  bindNumber("overlaySlider", "overlay", () => applyTheme());
  bindNumber("blurSlider", "blur", () => applyTheme());
  bindSetting("heroHeightPresetSelect", "change", value => { data.settings.heroSize = value; data.settings.heroHeight = heroHeightForSize(value, data.settings.heroHeight); save(); applyHero(); renderTerminal(); });
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
    if (welcomeGuideState.active && event.key === "Escape") return;
    if (event.key === "Escape" && editLayoutActive) return setEditLayoutMode(false);
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

async function initWaypoint() {
  data = await loadInitialProfile();
  bindEvents();
  render();
  updateClock();
  setInterval(updateClock, 1000);
  refreshWeather(false);
  setInterval(() => refreshWeather(false), 30 * 60 * 1000);
}
initWaypoint();


function terminalMarkup(text, className = "") {
  return `<pre class="${className}">${String(text)}</pre>`;
}
function colorLine(text, className) {
  return `<span class="${className}">${escapeHtml(text)}</span>`;
}
function cleanList(title, items) {
  return `${title}\n\n${items.map(item => `  ${item}`).join("\n")}`;
}
function currentConfigText() {
  const s = data.settings;
  return [
    `Theme: ${getTheme().label}`,
    `Page preset: ${s.layoutPreset}`,
    `Bookmark layout: ${s.bookmarkLayout === "grid" ? "Grid Cards" : "Compact List"}`,
    `Font: ${s.fontFamily}`,
    `Search engine: ${labelSearch(s.searchEngine)}`,
    `Weather: ${s.showWeather === false ? "Hidden" : "Shown"}`,
    `Clock: ${s.showClock === false ? "Hidden" : "Shown"}`,
    `Section titles: ${s.showSectionTitles === false ? "Hidden" : "Shown"}`,
    `Window transparency: ${s.windowTransparency}%`,
    `Terminal transparency: ${s.terminalTransparency}%`,
    `Sections: ${data.sections.length}`,
    `Bookmarks: ${countBookmarks()}`
  ].join("\n");
}
const WELCOME_GUIDE = [
  {
    title: "Getting Started",
    body: [
      "Waypoint is a Linux-inspired browser start page.",
      "Use it as a dashboard, launcher, bookmark manager, and command center.",
      "Click links normally, or open the terminal and control Waypoint with commands.",
      "Your configuration is stored locally in this browser."
    ]
  },
  {
    title: "Managing Bookmarks",
    body: [
      "Graphical interface:",
      "  • Click + on a section to add a bookmark.",
      "  • Click ✎ to edit a bookmark.",
      "  • Click × to remove a bookmark or section.",
      "  • Drag bookmarks to reorder or move them between sections.",
      "  • Rename a section by clicking its title.",
      "",
      "Terminal examples:",
      "  add section \"Media\"",
      "  add link \"Media\" \"Jellyfin\" https://jellyfin.org",
      "  remove section \"Media\""
    ]
  },
  {
    title: "Terminal Commands",
    body: [
      "The terminal is a real Waypoint control surface.",
      "Useful commands:",
      "  help",
      "  fetch",
      "  ls themes",
      "  ls config",
      "  help add",
      "  help theme",
      "  help layout",
      "",
      "You can reopen this guide anytime with:",
      "  welcome"
    ]
  },
  {
    title: "Appearance & Settings",
    body: [
      "Open Settings from the ⚙️ bookmark, or type:",
      "  settings",
      "",
      "Common terminal customizations:",
      "  theme nord",
      "  preset minimal",
      "  layout compact",
      "  font jetbrains",
      "  window transparency 92",
      "  terminal transparency 85"
    ]
  },
  {
    title: "Import & Export",
    body: [
      "Waypoint profiles are JSON files.",
      "Export includes bookmarks, themes, colors, layout, weather, fonts, and terminal settings.",
      "",
      "Commands:",
      "  export",
      "  import",
      "",
      "The live demo only loads demo.json on first launch. After that, your own local setup is preserved."
    ]
  },
  {
    title: "About Waypoint",
    body: [
      "Waypoint is built with HTML, CSS, and JavaScript.",
      "No backend. No account. No tracking.",
      "Everything you change is saved locally in your browser.",
      "",
      "Press Esc to leave this guide."
    ]
  }
];

let welcomeGuideState = { active: false, mode: "menu", index: 0 };

function centerText(text, width) {
  const value = String(text);
  const space = Math.max(0, width - value.length);
  const left = Math.floor(space / 2);
  return " ".repeat(left) + value + " ".repeat(space - left);
}

function wrapGuideLine(line, width) {
  const max = width - 2;
  const value = String(line);
  if (!value.trim()) return [""];
  const indent = value.match(/^\s*/)?.[0] || "";
  const words = value.trim().split(/\s+/);
  const lines = [];
  let current = indent + words.shift();
  words.forEach(word => {
    if ((current + " " + word).length <= max) current += " " + word;
    else { lines.push(current); current = indent + word; }
  });
  lines.push(current);
  return lines;
}

function boxLines(title, lines) {
  const width = 84;
  const top = `╔${"═".repeat(width)}╗`;
  const mid = `╠${"═".repeat(width)}╣`;
  const bottom = `╚${"═".repeat(width)}╝`;
  const wrapped = lines.flatMap(line => wrapGuideLine(line, width));
  const body = wrapped.map(line => `║ ${String(line).padEnd(width - 2, " ")} ║`);
  return [top, `║${centerText(title, width)}║`, mid, ...body, bottom].join("\n");
}

function renderWelcomeGuide() {
  const out = $("commandOutput");
  if (!out) return;
  if (welcomeGuideState.mode === "menu") {
    const rows = WELCOME_GUIDE.map((item, i) => i === welcomeGuideState.index ? `► ${item.title}  ←` : `  ${item.title}`);
    const content = boxLines("Waypoint Guide", ["", ...rows, "", "↑↓ Move   Enter Select   Esc Exit"]);
    out.innerHTML = `<pre class="welcome-tui">${escapeHtml(content)}</pre>`;
  } else {
    const page = WELCOME_GUIDE[welcomeGuideState.index];
    const lines = [...page.body, "", "← Back   Esc Exit"];
    const content = boxLines(page.title, lines);
    out.innerHTML = `<pre class="welcome-tui welcome-tui-page">${escapeHtml(content)}</pre>`;
  }
}

function startWelcomeGuide() {
  welcomeGuideState = { active: true, mode: "menu", index: 0 };
  openModal("terminalModal");
  renderWelcomeGuide();
  setTimeout(() => $("commandInput")?.focus(), 50);
}

function stopWelcomeGuide() {
  welcomeGuideState.active = false;
  pushTerminal(terminalBlock(commandResult("Welcome guide closed. Type help to see commands.")));
}

function handleWelcomeGuideKey(event) {
  if (!welcomeGuideState.active) return false;
  const handled = () => { event.preventDefault(); event.stopPropagation(); };
  if (event.key === "Escape") { handled(); stopWelcomeGuide(); return true; }
  if (welcomeGuideState.mode === "menu") {
    if (event.key === "ArrowDown") { handled(); welcomeGuideState.index = (welcomeGuideState.index + 1) % WELCOME_GUIDE.length; renderWelcomeGuide(); return true; }
    if (event.key === "ArrowUp") { handled(); welcomeGuideState.index = (welcomeGuideState.index - 1 + WELCOME_GUIDE.length) % WELCOME_GUIDE.length; renderWelcomeGuide(); return true; }
    if (event.key === "Enter" || event.key === "ArrowRight") { handled(); welcomeGuideState.mode = "page"; renderWelcomeGuide(); return true; }
  } else {
    if (event.key === "ArrowLeft" || event.key === "Backspace" || event.key === "Enter") { handled(); welcomeGuideState.mode = "menu"; renderWelcomeGuide(); return true; }
  }
  return false;
}

function buildHelpText(topic = "") {
  const t = String(topic || "").trim().toLowerCase();
  const pages = {
    theme: `theme\n\nChange or view the current color theme.\n\nSyntax:\n  theme\n  theme <name>\n\nExamples:\n  theme nord\n  theme tokyo-night\n\nSee also:\n  ls themes`,
    layout: `layout\n\nChange or view the bookmark layout.\n\nSyntax:\n  layout\n  layout compact\n  layout grid\n\nPreset layouts use the preset command.\n\nSee also:\n  help preset\n  ls layouts`,
    preset: `preset\n\nChange or view the page layout preset.\n\nSyntax:\n  preset\n  preset <name>\n\nExamples:\n  preset classic\n  preset minimal\n\nSee also:\n  ls layouts`,
    visibility: `show / hide\n\nShow or hide interface elements.\n\nSyntax:\n  show <element>\n  hide <element>\n\nElements:\n  logo\n  title\n  clock\n  weather\n  search\n  sections\n  banner`,
    search: `engine\n\nChange or view the search engine.\n\nSyntax:\n  engine\n  engine <name>\n\nExamples:\n  engine google\n  engine duckduckgo\n\nSee also:\n  ls search`,
    weather: `weather\n\nSet, view, or refresh weather.\n\nSyntax:\n  weather\n  weather <location>\n  weather refresh\n\nExamples:\n  weather "New York, NY"\n  weather refresh`,
    font: `font\n\nChange or view the current font.\n\nSyntax:\n  font\n  font <name>\n\nExamples:\n  font inter\n  font jetbrains\n  font "Source Sans 3"\n\nSee also:\n  ls fonts`,
    settings: `settings\n\nOpen Settings or a specific settings page.\n\nSyntax:\n  settings\n  settings <page>\n\nPages:\n  appearance\n  layout\n  bookmarks\n  weather\n  banner\n  text\n  advanced\n  backup`,
    add: `add\n\nAdd a section or bookmark.\n\nSyntax:\n  add section <name>\n  add link <section> <name> <url>\n\nExamples:\n  add section Media\n  add link "Media" "Jellyfin" https://jellyfin.org`,
    remove: `remove / delete\n\nRemove a section.\n\nSyntax:\n  remove section <name>\n  delete section <name>`,
    rename: `rename\n\nRename a section.\n\nSyntax:\n  rename section <old> <new>\n\nExample:\n  rename section "Media" "Streaming"`,
    colors: `colors\n\nChange interface colors.\n\nSyntax:\n  accent <hex>\n  surface <hex>\n  text <hex>\n  titlecolor <hex>\n\nExamples:\n  accent #00d084\n  surface #09111a`,
    transparency: `transparency\n\nChange window or terminal transparency.\n\nSyntax:\n  window transparency <60-100>\n  terminal transparency <60-100>`,
    css: buildCssManualText(),
    widgets: `widgets\n\nList Waypoint's registered UI widgets.\n\nThis is the foundation for future edit layout, dragging, and resizing features.\n\nSyntax:\n  widgets\n  ls widgets`,
    ls: `ls\n\nList available options or current configuration.\n\nSyntax:\n  ls\n  ls <category>\n\nCategories:\n  commands\n  themes\n  layouts\n  fonts\n  visibility\n  search\n  widgets\n  config`,
    reset: `reset\n\nReset a category of settings.\n\nSyntax:\n  reset appearance\n  reset layout\n  reset bookmarks\n  reset weather\n  reset banner\n  reset text\n  reset advanced\n  reset all`
  };
  if (t) return pages[t] || `No help topic for '${t}'.\n\nType help to see commands.`;
  return cleanList("Available Commands", [
    "fetch            Show Waypoint system information",
    "help             Show help or command help",
    "ls               List options and configuration",
    "settings         Open Settings",
    "welcome          Open the Waypoint guide",
    "theme            Manage themes",
    "preset           Manage page layout presets",
    "layout           Manage bookmark layout",
    "font             Manage fonts",
    "engine           Manage search engine",
    "weather          Configure weather",
    "show / hide      Show or hide UI elements",
    "accent           Set accent color",
    "surface          Set surface color",
    "text             Set global text color",
    "window           Set window transparency",
    "terminal         Set terminal settings",
    "widgets          List registered UI widgets",
    "add              Add sections or bookmarks",
    "rename           Rename sections",
    "remove / delete  Remove sections",
    "export           Export configuration",
    "import           Import configuration",
    "reset            Reset settings",
    "clear            Clear terminal",
    "exit             Close terminal"
  ]);
}
function buildCssManualText() {
  return `css\n\nCustom CSS is applied last, so it can override Waypoint styling.\n\nExamples:\n  Hide the Waypoint name:\n  .brand-wordmark { display: none !important; }\n\n  Make bookmark cards rounder:\n  .link { border-radius: 18px !important; }\n\n  Hide section headers:\n  .section-header { display: none !important; }\n\n  Make the search bar wider:\n  .search { width: min(920px, calc(100% - 80px)) !important; }\n\nNotes:\n  .brand-wordmark controls the Waypoint title.\n  .link controls bookmark tiles.\n  .section controls section cards.\n  !important makes your rule win over built-in styling.`;
}
function listCommand(category = "") {
  const c = String(category || "").trim().toLowerCase();
  const maps = {
    "": cleanList("Available Lists", ["commands", "themes", "layouts", "fonts", "visibility", "search", "widgets", "config"]),
    commands: buildHelpText(),
    themes: cleanList("Available Themes", ["catppuccin", "nord", "gruvbox", "tokyo-night"]),
    layouts: cleanList("Available Layouts", ["classic", "dashboard", "minimal", "centered", "compact bookmark layout", "grid bookmark layout"]),
    fonts: cleanList("Available Fonts", ["system", "inter", "jetbrains", "firacode", "plex", "source", "roboto", "noto", "ubuntu", "opensans", "mono"]),
    visibility: cleanList("Visibility Elements", ["logo", "title", "clock", "weather", "search", "sections", "banner"]),
    search: cleanList("Available Search Engines", ["google", "duckduckgo", "brave", "bing", "custom"]),
    widgets: widgetSummaryText(),
    config: `Current Configuration\n\n${currentConfigText()}`
  };
  return maps[c] || `ls: unknown list '${c}'\n\nTry: ls`;
}
function buildStatusLines(action, steps = ["Updating configuration", "Refreshing interface", "Done"]) {
  return `<pre class="terminal-status"><span class="terminal-info">${escapeHtml(action)}</span>\n${steps.map((step, index) => `<span class="${index === steps.length - 1 ? "terminal-success" : "terminal-muted"}">  ${escapeHtml(step)}...</span>`).join("\n")}</pre>`;
}
function commandResult(text, className = "terminal-result") {
  return terminalPre(text, className);
}
function usage(text) {
  return commandResult(text, "terminal-warning");
}
function fail(text) {
  return commandResult(text, "terminal-error");
}
function normalizeFontName(arg) {
  const a = arg.replaceAll(" ", "").toLowerCase();
  const map = { system: "system", inter: "inter", jetbrains: "jetbrains", jetbrainsmono: "jetbrains", firacode: "firacode", fira: "firacode", plex: "plex", ibmplex: "plex", ibmplexsans: "plex", source: "source", sourcesans: "source", sourcesans3: "source", roboto: "roboto", noto: "noto", notosans: "noto", ubuntu: "ubuntu", opensans: "opensans", mono: "mono", monospace: "mono" };
  return map[a] || "";
}
function runCommand(commandRaw) {
  const command = commandRaw.trim();
  if (!command) return;
  const lower = command.toLowerCase();
  const [head, ...rest] = lower.split(/\s+/);
  const arg = rest.join(" ");
  if (head === "clear") { terminalBuffer = []; renderTerminalBuffer(); return; }
  if (["q", "quit", "exit"].includes(lower)) { closeModal("terminalModal"); return; }
  const blocks = [terminalEcho(command)];
  const done = html => pushTerminal(terminalBlock(blocks.join("") + (html || "")));
  const textOut = (text, cls) => done(commandResult(text, cls));
  if (head === "help") return done(terminalPre(buildHelpText(arg), "terminal-help"));
  if (["welcome", "guide", "tutorial"].includes(head)) { startWelcomeGuide(); return; }
  if (head === "man") return done(fail("The man command was removed. Use help <topic> instead."));
  if (head === "ls") return done(terminalPre(listCommand(arg), "terminal-help"));
  if (head === "fetch") return done(buildFastfetchHtml());
  if (head === "widgets") return done(terminalPre(widgetSummaryText(), "terminal-help"));
  if (head === "settings") {
    const pageMap = { text: "textcolors", textcolor: "textcolors", textcolors: "textcolors", colors: "textcolors", appearance: "appearance", layout: "layout", bookmarks: "bookmarks", weather: "weather", banner: "banner", advanced: "advanced", backup: "backup" };
    const page = arg ? pageMap[arg.replace(/\s+/g, "")] : "appearance";
    if (!page) return textOut(buildHelpText("settings"), "terminal-warning");
    openSettingsPage(page);
    return textOut(`Opened Settings > ${page}.`, "terminal-success-text");
  }
  if (["show", "hide"].includes(head)) {
    const keyMap = { logo: "showLogo", terminal: "showLogo", button: "showLogo", title: "showWordmark", wordmark: "showWordmark", clock: "showClock", weather: "showWeather", search: "showSearch", sections: "showSectionTitles", titles: "showSectionTitles", banner: "heroSize" };
    const key = keyMap[arg];
    if (!key) return textOut(buildHelpText("visibility"), "terminal-warning");
    if (key === "heroSize") {
      data.settings.heroSize = head === "show" ? "medium" : "hidden";
      data.settings.heroHeight = heroHeightForSize(data.settings.heroSize, data.settings.heroHeight);
    } else data.settings[key] = head === "show";
    save(); render();
    return done(buildStatusLines(`${head === "show" ? "Showing" : "Hiding"}: ${arg}`));
  }
  if (head === "preset") {
    if (!arg) return textOut(`Current preset: ${data.settings.layoutPreset}`);
    if (!["classic", "minimal", "dashboard", "centered"].includes(arg)) return textOut(buildHelpText("preset"), "terminal-warning");
    applyLayoutPresetDefaults(arg); save(); render();
    return done(buildStatusLines(`Applying layout preset defaults: ${arg}`));
  }
  if (head === "font") {
    if (!arg) return textOut(`Current font: ${data.settings.fontFamily}`);
    const font = normalizeFontName(commandRaw.trim().replace(/^font\s*/i, "").trim());
    if (!font) return textOut(buildHelpText("font"), "terminal-warning");
    data.settings.fontFamily = font; save(); render();
    return done(buildStatusLines(`Setting font: ${font}`));
  }
  if (head === "theme") {
    if (!arg) return textOut(`Current theme: ${getTheme().label}`);
    const map = { catppuccin: "catppuccin", nord: "nord", gruvbox: "gruvbox", tokyo: "tokyoNight", "tokyo-night": "tokyoNight", tokyonight: "tokyoNight" };
    if (!map[arg]) return textOut(buildHelpText("theme"), "terminal-warning");
    data.settings.theme = map[arg]; save(); render();
    return done(buildStatusLines(`Applying theme: ${getTheme().label}`));
  }
  if (head === "layout") {
    const map = { list: "list", compact: "list", row: "list", rows: "list", grid: "grid", cards: "grid" };
    if (!arg) return textOut(`Bookmark layout: ${(data.settings.bookmarkLayout || "list") === "list" ? "Compact List" : "Grid Cards"}`);
    if (!map[arg]) return textOut(buildHelpText("layout"), "terminal-warning");
    data.settings.bookmarkLayout = map[arg]; save(); render();
    return done(buildStatusLines(`Setting bookmark layout: ${data.settings.bookmarkLayout === "list" ? "Compact List" : "Grid Cards"}`));
  }
  if (head === "accent" || head === "surface" || head === "text" || head === "titlecolor") {
    const color = rest[0] || "";
    if (!/^#[0-9a-f]{6}$/i.test(color)) return textOut(buildHelpText("colors"), "terminal-warning");
    if (head === "accent") { data.settings.customAccent = color; data.settings.useCustomColors = true; }
    if (head === "surface") { data.settings.customPanel = color; data.settings.useCustomColors = true; }
    if (head === "text") data.settings.customText = color;
    if (head === "titlecolor") { data.settings.sectionTitleColor = color; data.settings.useCustomTextColors = true; }
    save(); render();
    return done(buildStatusLines(`Setting ${head} color: ${color}`));
  }
  if (head === "window") {
    if (rest[0] !== "transparency") return textOut(buildHelpText("transparency"), "terminal-warning");
    const amount = clamp(Number(rest[1]), 60, 100, NaN);
    if (!Number.isFinite(amount)) return textOut(buildHelpText("transparency"), "terminal-warning");
    data.settings.windowTransparency = amount; save(); render();
    return done(buildStatusLines(`Setting window transparency: ${amount}%`));
  }
  if (head === "terminal") {
    if (!arg) return textOut(`Terminal transparency: ${data.settings.terminalTransparency}%`);
    if (rest[0] !== "transparency") return textOut(buildHelpText("transparency"), "terminal-warning");
    const amount = clamp(Number(rest[1]), 60, 100, NaN);
    if (!Number.isFinite(amount)) return textOut(buildHelpText("transparency"), "terminal-warning");
    data.settings.terminalTransparency = amount; save(); render();
    return done(buildStatusLines(`Setting terminal transparency: ${amount}%`));
  }
  if (head === "transparency") return textOut("Use window transparency <60-100> or terminal transparency <60-100>.", "terminal-warning");
  if (head === "name") {
    const nextName = commandRaw.trim().replace(/^name\s*/i, "").trim();
    if (!nextName) return textOut("Usage: name <username>", "terminal-warning");
    data.settings.userName = sanitizeUserName(nextName); save(); render();
    return textOut(`Name set to ${displayUserName()}.`, "terminal-success-text");
  }
  if (head === "searchengine" || head === "engine") {
    const map = { google: "google", ddg: "duckduckgo", duckduckgo: "duckduckgo", brave: "brave", bing: "bing", custom: "custom" };
    if (!arg) return textOut(`Current search engine: ${labelSearch(data.settings.searchEngine)}`);
    if (!map[arg]) return textOut(buildHelpText("search"), "terminal-warning");
    data.settings.searchEngine = map[arg]; save(); render();
    return done(buildStatusLines(`Setting search engine: ${labelSearch(data.settings.searchEngine)}`));
  }
  if (head === "customsearch") {
    const url = commandRaw.trim().replace(/^customsearch\s*/i, "").trim();
    if (!url) return textOut("Usage: customsearch https://example.com/search?q=%s", "terminal-warning");
    data.settings.customSearchUrl = url.slice(0, 240); data.settings.searchEngine = "custom"; save(); render();
    return textOut("Custom search URL saved.", "terminal-success-text");
  }
  if (head === "weather") {
    if (!arg) return textOut(data.settings.weatherLocation ? `Current weather location: ${data.settings.weatherLocation}` : buildHelpText("weather"), data.settings.weatherLocation ? "terminal-result" : "terminal-warning");
    if (arg === "refresh") { refreshWeather(true); return done(buildStatusLines("Refreshing weather", ["Fetching forecast", "Done"])); }
    const next = commandRaw.trim().replace(/^weather\s+/i, "").trim();
    data.settings.weatherLocation = next; save(); refreshWeather(true);
    return done(buildStatusLines(`Setting weather location: ${data.settings.weatherLocation}`, ["Saving location", "Fetching forecast", "Done"]));
  }
  if (head === "banner") {
    const map = { desktop: "desktop", atmosphere: "atmo", atmo: "atmo", custom: "custom", auto: "auto", default: "auto" };
    const sizeMap = { hidden: "hidden", hide: "hidden", small: "small", compact: "small", medium: "medium", balanced: "medium", large: "large", tall: "large", showcase: "large" };
    if (arg === "size") {
      const size = parts[1];
      if (!sizeMap[size]) return textOut("Usage: banner size hidden|small|medium|large", "terminal-warning");
      setBannerSize(sizeMap[size]);
      return done(buildStatusLines(`Setting banner size: ${labelHeroSize(data.settings.heroSize)}`));
    }
    if (sizeMap[arg]) {
      setBannerSize(sizeMap[arg]);
      return done(buildStatusLines(`Setting banner size: ${labelHeroSize(data.settings.heroSize)}`));
    }
    if (["fit", "contain"].includes(arg)) { data.settings.heroFit = "contain"; save(); render(); return done(buildStatusLines("Setting banner fit: contain")); }
    if (["fill", "cover", "crop"].includes(arg)) { data.settings.heroFit = "cover"; save(); render(); return done(buildStatusLines("Setting banner fit: cover")); }
    if (!map[arg]) return textOut("Usage: banner auto|desktop|atmosphere|custom|hidden|small|medium|large|fit|fill", "terminal-warning");
    data.settings.heroStyle = map[arg]; save(); render();
    return done(buildStatusLines(`Setting banner: ${labelHero(data.settings.heroStyle)}`));
  }
  if (head === "wallpaper") {
    const map = { theme: "wallpaper", wallpaper: "wallpaper", default: "wallpaper", gradient: "gradient", custom: "custom" };
    if (!map[arg]) return textOut("Usage: wallpaper theme|gradient|custom", "terminal-warning");
    data.settings.backgroundMode = map[arg]; save(); render();
    return done(buildStatusLines(`Setting wallpaper: ${labelBackground(data.settings.backgroundMode)}`));
  }
  if (head === "add") {
    if (arg.startsWith("section")) {
      const sectionName = commandRaw.trim().replace(/^add\s+section\s*/i, "").trim();
      if (!sectionName) return textOut(buildHelpText("add"), "terminal-warning");
      data.sections.push({ name: sectionName, links: [] }); save(); render();
      return textOut(`Section added: ${sectionName}`, "terminal-success-text");
    }
    if (arg.startsWith("link")) {
      const parsed = parseAddLinkCommand(commandRaw);
      if (!parsed) return textOut(buildHelpText("add"), "terminal-warning");
      const message = addLinkByCommand(parsed.sectionName, parsed.linkName, parsed.url).replace(/<[^>]+>/g, "");
      return textOut(message, "terminal-success-text");
    }
    return textOut(buildHelpText("add"), "terminal-warning");
  }
  if (["delete", "remove"].includes(head) && arg.startsWith("section")) {
    const sectionName = commandRaw.trim().replace(/^(delete|remove)\s+section\s*/i, "").trim();
    if (!sectionName) return textOut(buildHelpText("remove"), "terminal-warning");
    return textOut(deleteSectionByCommand(sectionName).replace(/<[^>]+>/g, ""));
  }
  if (head === "rename" && arg.startsWith("section")) {
    const body = commandRaw.trim().replace(/^rename\s+section\s*/i, "").trim();
    const quoted = [...body.matchAll(/"([^"]+)"|'([^']+)'/g)].map(match => match[1] || match[2]);
    if (quoted.length >= 2) return textOut(renameSectionByCommand(quoted[0], quoted[1]).replace(/<[^>]+>/g, ""));
    const parts = body.split(/\s+/);
    if (parts.length < 2) return textOut(buildHelpText("rename"), "terminal-warning");
    return textOut(renameSectionByCommand(parts[0], parts.slice(1).join(" ")).replace(/<[^>]+>/g, ""));
  }
  if (head === "import") { $("importFile")?.click(); return textOut("Choose a JSON file to import."); }
  if (head === "export") { exportJson(); return textOut("Export started.", "terminal-success-text"); }
  if (head === "reset") {
    const target = arg || "";
    if (!target) return textOut(buildHelpText("reset"), "terminal-warning");
    resetCategory(target);
    return done(buildStatusLines(`Resetting ${target}`));
  }
  if (head === "css") return textOut(buildHelpText("css"));
  if (head === "search") { closeAllModals(); focusSearch(); return; }
  return textOut(`${head}: command not found\n\nTry: help`, "terminal-error");
}
function resetCategory(target) {
  const d = structuredClone(defaultData.settings);
  if (target === "appearance") ["theme", "fontFamily", "uiScale", "useCustomColors", "customAccent", "customPanel", "customText", "windowTransparency"].forEach(k => data.settings[k] = d[k]);
  else if (target === "layout") ["layoutPreset", "showLogo", "showWordmark", "showClock", "showWeather", "showSearch", "showSectionTitles", "shortcut"].forEach(k => data.settings[k] = d[k]);
  else if (target === "bookmarks") ["bookmarkLayout", "bookmarkColumns", "bookmarkFontSize", "bookmarkIconSize"].forEach(k => data.settings[k] = d[k]);
  else if (target === "weather") ["weatherLocation", "weatherUnit"].forEach(k => data.settings[k] = d[k]);
  else if (target === "banner") ["backgroundMode", "overlay", "blur", "heroSize", "heroHeight", "heroZoom", "heroY", "heroStyle", "heroFit"].forEach(k => data.settings[k] = d[k]);
  else if (target === "text" || target === "textcolors") ["useCustomTextColors", "sectionTitleColor", "bookmarkTextColor", "mutedTextColor", "terminalTextColor", "statusTextColor", "customText"].forEach(k => data.settings[k] = d[k]);
  else if (target === "advanced") ["searchEngine", "customSearchUrl", "customCss", "terminalTransparency"].forEach(k => data.settings[k] = d[k]);
  else if (target === "all" || target === "everything") { data = structuredClone(defaultData); localStorage.removeItem(CUSTOM_BG_KEY); localStorage.removeItem(CUSTOM_HERO_KEY); localStorage.removeItem(WEATHER_CACHE_KEY); }
  else return;
  save(); render(); refreshWeather(false);
}
function addResetButtonEvents() {
  const map = { resetAppearanceBtn: "appearance", resetLayoutBtn: "layout", resetBookmarksBtn: "bookmarks", resetWeatherBtn: "weather", resetBannerBtn: "banner", resetTextBtn: "text", resetAdvancedBtn: "advanced" };
  Object.entries(map).forEach(([id, target]) => $(id)?.addEventListener("click", () => resetCategory(target)));
}
addResetButtonEvents();

