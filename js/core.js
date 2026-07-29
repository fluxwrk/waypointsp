// Waypoint core ownership. Loaded as an ordered classic script.

const KEY = "waypoint-data-v1";

const OLD_KEYS = ["startpage-data-v9", "startpage-data-v8", "startpage-data-v6", "startpage-data-v5", "startpage-data-v2", "startpage-data-v1"];

let appMeta = { name: "Waypoint", version: "1.6.0-dev1", branch: "main", codename: "Runtime & Architecture Optimization" };

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
    "heroFit": "contain",
    "bookmarkLayout": "list",
    "keyboardNavigation": false,
    "userName": "user",
    "weatherLocation": "",
    "weatherUnit": "auto",
    "searchEngine": "google",
    "customSearchUrl": "",
    "shortcut": "ctrlShiftSpace",
    "fontFamily": "inter",
    "uiScale": 100,
    "useCustomAppearance": false,
    "useCustomColors": false,
    "customAccent": "#00d084",
    "customPanel": "#09111a",
    "customText": "#d8dee9",
    "useCustomTextColors": false,
    "sectionTitleColor": "#d8dee9",
    "bookmarkTextColor": "#d8dee9",
    "mutedTextColor": "#9aa4b8",
    "terminalTextColor": "#d9e5f6",
    "statusTextColor": "#d8dee9",
    "layoutPreset": "classic",
    "workspace": null,
    "showLogo": true,
    "showWordmark": true,
    "showClock": true,
    "showWeather": true,
    "showSearch": true,
    "showSectionTitles": true,
    "widgets": {},
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
  "version": 1,
  "workspace": {
    "version": 1,
    "template": "classic",
    "modified": true,
    "slots": {
      "logo": "header-left-1",
      "wordmark": "header-left-2",
      "clock": "header-right-1",
      "weather": "header-right-2",
      "search": "hero-search",
      "hero": "hero-banner",
      "sections": "content-sections"
    },
    "display": {
      "showSectionTitles": true,
      "heroStyle": "topBar"
    }
  },
  "bookmarks": {
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
      },
      {
        "name": "Favorites",
        "links": [
          {
            "name": "GitHub",
            "url": "https://github.com",
            "icon": ""
          },
          {
            "name": "YouTube",
            "url": "https://youtube.com",
            "icon": ""
          },
          {
            "name": "Wikipedia",
            "url": "https://wikipedia.org",
            "icon": ""
          }
        ]
      }
    ]
  },
  "settings": {
    "theme": "nord",
    "backgroundMode": "wallpaper",
    "overlay": 2,
    "blur": 5,
    "heroHeight": 210,
    "heroSize": "small",
    "heroZoom": 100,
    "heroY": 50,
    "heroStyle": "desktop",
    "heroFit": "contain",
    "bookmarkLayout": "grid",
    "keyboardNavigation": true,
    "userName": "demouser",
    "weatherLocation": "10012",
    "weatherUnit": "auto",
    "searchEngine": "google",
    "customSearchUrl": "",
    "shortcut": "ctrlShiftSpace",
    "fontFamily": "inter",
    "uiScale": 100,
    "useCustomAppearance": false,
    "useCustomColors": false,
    "customAccent": "#00d084",
    "customPanel": "#09111a",
    "customText": "#d8dee9",
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
    "widgets": {
      "logo": {
        "area": "header",
        "order": 0,
        "x": 0,
        "y": 0,
        "width": 0,
        "height": 0,
        "customPlacement": false,
        "customSize": false
      },
      "wordmark": {
        "area": "header",
        "order": 1,
        "x": 0,
        "y": 0,
        "width": 0,
        "height": 0,
        "customPlacement": false,
        "customSize": false
      },
      "clock": {
        "area": "header",
        "order": 2,
        "x": 0,
        "y": 0,
        "width": 0,
        "height": 0,
        "customPlacement": false,
        "customSize": false
      },
      "weather": {
        "area": "header",
        "order": 3,
        "x": 0,
        "y": 0,
        "width": 0,
        "height": 0,
        "customPlacement": false,
        "customSize": false
      },
      "search": {
        "area": "hero",
        "order": 4,
        "x": 0,
        "y": 0,
        "width": 0,
        "height": 0,
        "customPlacement": false,
        "customSize": false
      },
      "hero": {
        "area": "hero",
        "order": 5,
        "x": 0,
        "y": 0,
        "width": 0,
        "height": 0,
        "customPlacement": false,
        "customSize": false
      },
      "sections": {
        "area": "content",
        "order": 6,
        "x": 0,
        "y": 0,
        "width": 0,
        "height": 0,
        "customPlacement": false,
        "customSize": false
      }
    },
    "bookmarkFontSize": 13,
    "bookmarkIconSize": 36,
    "customCss": "",
    "terminalLeft": null,
    "terminalTop": null,
    "settingsLeft": 574,
    "settingsTop": 285,
    "lastModified": "2026-07-29T03:03:41.112Z",
    "workspaceHeroStyle": "topBar",
    "bannerHiddenByWorkspace": false
  }
};

let data;

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

const ALLOWED_BOOKMARK_PROTOCOLS = new Set(["http:", "https:", "mailto:", "tel:"]);

function isAllowedBookmarkUrl(url) {
  const value = String(url || "").trim();
  if (!value) return false;
  if (isWaypointUrl(value)) return true;
  try {
    return ALLOWED_BOOKMARK_PROTOCOLS.has(new URL(value).protocol);
  } catch {
    return false;
  }
}

function runtimeLabel() {
  const protocol = window.location?.protocol || "";
  if (protocol === "moz-extension:") return "Firefox Extension";
  if (protocol === "chrome-extension:") return "Chromium Extension";
  if (protocol === "file:") return "Local File";
  return "Web";
}

function waypointActionKey(url) { return String(url || "").replace(/^waypoint:/i, "").trim().toLowerCase(); }

function internalActionForUrl(url) {
  const key = waypointActionKey(url);
  if (key === "settings" || /^settings[/:_-]/.test(key)) {
    const page = normalizeSettingsPage(key);
    return { icon: "⚙️", label: `Settings: ${capitalize(page)}`, aliases: [], run: () => openSettingsPage(page) };
  }
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

function normalizeUrl(url) {
  const t = String(url || "").trim();
  if (!t) return "";
  if (isWaypointUrl(t)) return t;
  const withProtocol = /^[a-z][a-z0-9+.-]*:/i.test(t) ? t : `https://${t}`;
  return isAllowedBookmarkUrl(withProtocol) ? withProtocol : "";
}

function favicon(url) {
  try {
    const normalized = normalizeUrl(url);
    if (!normalized || isWaypointUrl(normalized)) return "";
    const parsed = new URL(normalized);
    if (!["http:", "https:"].includes(parsed.protocol)) return "";
    const host = parsed.hostname.replace(/^www\./i, "");
    if (!host || host === "localhost" || !host.includes(".")) return "";
    return `https://www.google.com/s2/favicons?domain_url=${encodeURIComponent(parsed.origin)}&sz=64`;
  } catch {
    return "";
  }
}

let pendingWaypointConfirmation = null;

let waypointConfirmationReturnFocus = null;

function openModal(id, context = {}) {
  clearSectionFocus();
  $(id)?.classList.remove("hidden");
  if (id === "terminalModal") {
    renderTerminal();
    positionTerminal();
    setTimeout(() => $("commandInput")?.focus(), 80);
  }
  if (id === "settingsModal") {
    positionSettings();
  }
}

function closeModal(id) {
  if (id === "confirmationModal" && pendingWaypointConfirmation) {
    finishWaypointConfirmation(false);
    return;
  }
  if (id === "settingsModal") commitLiveSettings();
  $(id)?.classList.add("hidden");
  emitWaypointEvent("modal-closed", { id });
}

function closeAllModals() {
  commitLiveSettings();
  if (pendingWaypointConfirmation) finishWaypointConfirmation(false);
  document.querySelectorAll(".modal").forEach(m => m.classList.add("hidden"));
  emitWaypointEvent("modal-closed", { id: "all" });
}

function requestWaypointConfirmation({
  title = "Confirm action",
  message = "Are you sure?",
  confirmLabel = "Confirm"
} = {}) {
  if (pendingWaypointConfirmation) finishWaypointConfirmation(false);
  waypointConfirmationReturnFocus = document.activeElement;
  setText("confirmationModalTitle", title);
  setText("confirmationModalMessage", message);
  setText("confirmationAcceptBtn", confirmLabel);
  $("confirmationModal")?.classList.remove("hidden");
  return new Promise(resolve => {
    pendingWaypointConfirmation = resolve;
    setTimeout(() => $("confirmationAcceptBtn")?.focus(), 50);
  });
}

function finishWaypointConfirmation(confirmed) {
  const resolve = pendingWaypointConfirmation;
  const returnFocus = waypointConfirmationReturnFocus;
  pendingWaypointConfirmation = null;
  waypointConfirmationReturnFocus = null;
  $("confirmationModal")?.classList.add("hidden");
  emitWaypointEvent("modal-closed", { id: "confirmationModal" });
  resolve?.(Boolean(confirmed));
  if (returnFocus?.isConnected) setTimeout(() => returnFocus.focus(), 0);
}

function measureWaypointRender(name, callback) {
  if (!globalThis.performance?.mark || !globalThis.performance?.measure) return callback();
  const token = `${name}:${performance.now()}:${Math.random()}`;
  const start = `${token}:start`;
  const end = `${token}:end`;
  performance.mark(start);
  try {
    return callback();
  } finally {
    performance.mark(end);
    performance.measure(name, start, end);
    performance.clearMarks(start);
    performance.clearMarks(end);
  }
}

function emitRendered() {
  emitWaypointEvent("rendered");
}

function emitWaypointEvent(name, detail = {}) {
  document.dispatchEvent(new CustomEvent(`waypoint:${name}`, { detail }));
}
