// Waypoint storage ownership. Loaded as an ordered classic script.

const WaypointStorage = {
  save(key, value) {
    try {
      const serialized = key === KEY
        ? measureWaypointRender("waypoint:profile:serialize", () => JSON.stringify(value))
        : JSON.stringify(value);
      if (key === KEY) {
        measureWaypointRender("waypoint:profile:persist", () => localStorage.setItem(key, serialized));
      } else {
        localStorage.setItem(key, serialized);
      }
      return true;
    } catch {
      return false;
    }
  },

  load(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return fallback;
      const parsed = safeParse(raw);
      return parsed === null ? fallback : parsed;
    } catch {
      return fallback;
    }
  },

  saveRaw(key, value) {
    try {
      localStorage.setItem(key, String(value));
      return true;
    } catch {
      return false;
    }
  },

  loadRaw(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? fallback : raw;
    } catch {
      return fallback;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  },

  clear() {
    try {
      localStorage.clear();
      return true;
    } catch {
      return false;
    }
  }
};

function loadStoredProfile() {
  const saved = WaypointStorage.load(KEY);
  if (saved) return normalizeData(saved);
  for (const oldKey of OLD_KEYS) {
    const old = WaypointStorage.load(oldKey);
    if (old) {
      const migrated = normalizeData(old);
      WaypointStorage.save(KEY, migrated);
      return migrated;
    }
  }
  return null;
}

async function loadDemoProfile() {
  if (window.location.protocol === "file:") return normalizeData(bundledDemoData);
  try {
    const response = await fetch("demo.json", { cache: "no-store" });
    if (!response.ok) throw new Error("demo profile unavailable");
    return normalizeData(await response.json());
  } catch {
    return normalizeData(bundledDemoData);
  }
}

async function loadMetadata() {
  if (window.location.protocol === "file:") return appMeta;
  try {
    const response = await fetch("metadata.json", { cache: "no-store" });
    if (!response.ok) throw new Error("metadata unavailable");
    const meta = await response.json();
    appMeta = { ...appMeta, ...meta };
  } catch {
    // Keep bundled fallback metadata.
  }
}

async function loadInitialProfile() {
  const stored = loadStoredProfile();
  if (stored) return stored;
  const demoProfile = await loadDemoProfile();
  WaypointStorage.save(KEY, demoProfile);
  return demoProfile;
}

function normalizeData(input) {
  const normalized = structuredClone(defaultData);

  const normalizeLinks = links => Array.isArray(links)
    ? links.filter(link => link && link.url).map(link => {
      const url = normalizeUrl(link.url);
      if (!url) return null;
      const icon = isWaypointUrl(url) ? waypointIcon(url) : typeof link.icon === "string" && link.icon ? link.icon : "";
      const name = isWaypointUrl(url) ? cleanInternalLinkName(link.name || link.url, url) : String(link.name || link.url);
      return { name, url, icon };
    }).filter(Boolean)
    : [];

  const profileBookmarks = input?.bookmarks && typeof input.bookmarks === "object" ? input.bookmarks : null;
  const incomingSections = Array.isArray(profileBookmarks?.sections) ? profileBookmarks.sections : input.sections;

  if (Array.isArray(incomingSections)) {
    normalized.sections = incomingSections.map((section, index) => ({
      name: String(section.name || `Section ${index + 1}`),
      links: normalizeLinks(section.links)
    }));
  } else if (input && typeof input === "object") {
    const ignoredKeys = new Set(["settings", "version", "name", "profile", "theme", "layout", "bookmarks", "workspace"]);
    const objectSections = Object.entries(input)
      .filter(([name, links]) => !ignoredKeys.has(name) && Array.isArray(links))
      .map(([name, links]) => ({ name: String(name), links: normalizeLinks(links) }))
      .filter(section => section.links.length || section.name.trim());
    if (objectSections.length) normalized.sections = objectSections;
  }

  const incomingSettings = input.settings && typeof input.settings === "object" ? input.settings : input;
  normalized.settings = { ...normalized.settings, ...incomingSettings };
  if (input?.workspace && typeof input.workspace === "object") {
    normalized.settings.workspace = input.workspace;
  }

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
  normalized.settings.heroFit = "contain";
  normalized.settings.bookmarkLayout = ["grid", "list"].includes(normalized.settings.bookmarkLayout) ? normalized.settings.bookmarkLayout : "list";
  normalized.settings.keyboardNavigation = normalized.settings.keyboardNavigation === true || normalized.settings.keyboardNavigation === "true";
  normalized.settings.userName = sanitizeUserName(normalized.settings.userName);
  normalized.settings.weatherLocation = String(normalized.settings.weatherLocation || "").trim().slice(0, 80);
  normalized.settings.weatherUnit = ["auto", "fahrenheit", "celsius"].includes(normalized.settings.weatherUnit) ? normalized.settings.weatherUnit : "auto";
  normalized.settings.searchEngine = SEARCH_ENGINES[normalized.settings.searchEngine] ? normalized.settings.searchEngine : "google";
  normalized.settings.customSearchUrl = String(normalized.settings.customSearchUrl || "").trim().slice(0, 240);
  normalized.settings.shortcut = ["altT", "ctrlShiftSpace", "none"].includes(normalized.settings.shortcut) ? normalized.settings.shortcut : "none";
  normalized.settings.fontFamily = ["system", "inter"].includes(normalized.settings.fontFamily) ? normalized.settings.fontFamily : "inter";
  normalized.settings.uiScale = clamp(Number(normalized.settings.uiScale), 85, 120, 100);
  normalized.settings.useCustomColors = normalized.settings.useCustomColors === true || normalized.settings.useCustomColors === "true";
  normalized.settings.customAccent = /^#[0-9a-f]{6}$/i.test(normalized.settings.customAccent || "") ? normalized.settings.customAccent : "#00d084";
  normalized.settings.customPanel = /^#[0-9a-f]{6}$/i.test(normalized.settings.customPanel || "") ? normalized.settings.customPanel : "#09111a";
  normalized.settings.customText = /^#[0-9a-f]{6}$/i.test(normalized.settings.customText || "") ? normalized.settings.customText : "#d8dee9";
  normalized.settings.useCustomTextColors = normalized.settings.useCustomTextColors === true || normalized.settings.useCustomTextColors === "true";
  normalized.settings.sectionTitleColor = /^#[0-9a-f]{6}$/i.test(normalized.settings.sectionTitleColor || "") ? normalized.settings.sectionTitleColor : "#d8dee9";
  normalized.settings.bookmarkTextColor = /^#[0-9a-f]{6}$/i.test(normalized.settings.bookmarkTextColor || "") ? normalized.settings.bookmarkTextColor : "#d8dee9";
  normalized.settings.mutedTextColor = /^#[0-9a-f]{6}$/i.test(normalized.settings.mutedTextColor || "") ? normalized.settings.mutedTextColor : "#9aa4b8";
  normalized.settings.terminalTextColor = /^#[0-9a-f]{6}$/i.test(normalized.settings.terminalTextColor || "") ? normalized.settings.terminalTextColor : "#d9e5f6";
  normalized.settings.statusTextColor = /^#[0-9a-f]{6}$/i.test(normalized.settings.statusTextColor || "") ? normalized.settings.statusTextColor : "#d8dee9";
  normalized.settings.layoutPreset = ["classic", "minimal", "dashboard"].includes(normalized.settings.layoutPreset) ? normalized.settings.layoutPreset : "classic";
  normalized.settings.workspace = normalizeWorkspace(normalized.settings.workspace, normalized.settings);
  // Mirror workspace visibility into legacy fields during normalization.
  normalized.settings.showLogo = normalized.settings.workspace.slots.logo !== "hidden";
  normalized.settings.showWordmark = normalized.settings.workspace.slots.wordmark !== "hidden";
  normalized.settings.showClock = normalized.settings.workspace.slots.clock !== "hidden";
  normalized.settings.showWeather = normalized.settings.workspace.slots.weather !== "hidden";
  normalized.settings.showSearch = normalized.settings.workspace.slots.search !== "hidden";
  normalized.settings.showSectionTitles = normalized.settings.workspace.display?.showSectionTitles !== false;
  normalized.settings.bannerHiddenByWorkspace = normalized.settings.workspace.slots.hero === "hidden";
  normalized.settings.layoutPreset = normalized.settings.workspace.template;
  normalized.settings.widgets = normalizeWidgetState(normalized.settings.widgets);
  normalized.settings.bookmarkFontSize = clamp(Number(normalized.settings.bookmarkFontSize), 10, 15, 12);
  normalized.settings.bookmarkIconSize = clamp(Number(normalized.settings.bookmarkIconSize), 14, 36, 22);
  normalized.settings.customCss = String(normalized.settings.customCss || "").slice(0, 8000);
  const hasCustomAppearanceSetting = Object.prototype.hasOwnProperty.call(incomingSettings || {}, "useCustomAppearance");
  normalized.settings.useCustomAppearance = hasCustomAppearanceSetting
    ? normalized.settings.useCustomAppearance === true || normalized.settings.useCustomAppearance === "true"
    : normalized.settings.useCustomColors
      || normalized.settings.useCustomTextColors
      || !!normalized.settings.customCss;
  normalized.settings.useCustomColors = normalized.settings.useCustomAppearance;
  normalized.settings.useCustomTextColors = normalized.settings.useCustomAppearance;
  normalized.settings.settingsLeft = Number.isFinite(Number(normalized.settings.settingsLeft)) ? Number(normalized.settings.settingsLeft) : null;
  normalized.settings.settingsTop = Number.isFinite(Number(normalized.settings.settingsTop)) ? Number(normalized.settings.settingsTop) : null;
  normalized.settings.terminalLeft = normalized.settings.terminalLeft === null ? null : clamp(Number(normalized.settings.terminalLeft), 20, 4000, null);
  normalized.settings.terminalTop = normalized.settings.terminalTop === null ? null : clamp(Number(normalized.settings.terminalTop), 20, 4000, null);
  normalized.settings.lastModified = normalized.settings.lastModified || null;

  return normalized;
}

function save() {
  data.settings.lastModified = new Date().toISOString();
  const persisted = WaypointStorage.save(KEY, data);
  if (persisted) pendingLiveSettings.clear();
  updateLogoPrompt();
  syncControls();
  return persisted;
}

function exportJson(type = "complete") {
  const payloads = {
    complete: { version: 1, workspace: data.settings.workspace, bookmarks: { sections: data.sections }, settings: { ...data.settings, workspace: undefined } },
    workspace: { version: 1, workspace: data.settings.workspace },
    bookmarks: { version: 1, bookmarks: { sections: data.sections } },
    settings: { version: 1, settings: { ...data.settings, workspace: undefined } }
  };
  const payload = payloads[type] || data;
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = type === "complete" ? "waypoint-backup.json" : `waypoint-${type}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
}

function importJsonFile(file) {
  const reader = new FileReader();
  reader.onload = () => {
    const parsed = safeParse(reader.result);
    if (!parsed) return alert("Invalid JSON file.");
    if (parsed.workspace && !parsed.settings && !parsed.sections && !parsed.bookmarks) {
      data.settings.workspace = normalizeWorkspace(parsed.workspace, data.settings);
      syncLegacyVisibilityFromWorkspace();
    } else if (parsed.bookmarks && !parsed.settings && !parsed.workspace) {
      data.sections = normalizeData({ sections: parsed.bookmarks.sections || [] }).sections;
    } else if (parsed.settings && !parsed.sections && !parsed.bookmarks && !parsed.workspace) {
      data.settings = normalizeData({ settings: parsed.settings }).settings;
    } else if (parsed.workspace || parsed.bookmarks || parsed.settings) {
      const merged = { sections: parsed.bookmarks?.sections || data.sections, settings: { ...data.settings, ...(parsed.settings || {}), workspace: parsed.workspace || data.settings.workspace } };
      data = normalizeData(merged);
    } else {
      data = normalizeData(parsed);
    }
    save();
    render();
  };
  reader.readAsText(file);
}
