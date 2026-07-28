// Waypoint appearance ownership. Loaded as an ordered classic script.

const CUSTOM_BG_KEY = "startpage-custom-background";

const CUSTOM_HERO_KEY = "startpage-custom-hero";

const THEMES = {
  catppuccin: {
    label: "Catppuccin",
    wallpaper: "img/catppuccin-wallpaper.webp",
    desktop: "img/catppuccin-desktop-banner.webp",
    atmo: "img/catppuccin-atmo-banner.webp",
    defaultHero: "atmo",
    gradient: "linear-gradient(135deg, #181825 0%, #1e1e2e 48%, #313244 100%)",
    page: "#181825", surface: "#1e1e2e", elevated: "#313244", hover: "#45475a",
    textMuted: "#989baa", textSecondary: "#b1b6c8", text: "#cdd6f4", textStrong: "#f3f5fb",
    accentStrong: "#5f7fbd", accent: "#74a0e8", accentHover: "#89b4fa", accentBright: "#a6c8ff",
    cardTop: "#343448", cardBottom: "#202033", cardBorder: "#4d4e66", iconSurface: "#3b3c51"
  },
  daylight: {
    label: "Daylight",
    scheme: "light",
    wallpaper: "img/daylight-wallpaper.webp",
    desktop: "img/daylight-desktop-banner.webp",
    atmo: "img/daylight-atmo-banner.webp",
    defaultHero: "atmo",
    gradient: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 48%, #e2e8f0 100%)",
    page: "#f1f5f9", surface: "#ffffff", elevated: "#e8edf5", hover: "#dbe4f0",
    textMuted: "#64748b", textSecondary: "#475569", text: "#1e293b", textStrong: "#0f172a",
    accentStrong: "#3730a3", accent: "#4f46e5", accentHover: "#6366f1", accentBright: "#4338ca",
    cardTop: "#ffffff", cardBottom: "#eef2ff", cardBorder: "#b8c3d4", iconSurface: "#e0e7ff"
  },
  nord: {
    label: "Nord",
    wallpaper: "img/nord-wallpaper.webp",
    desktop: "img/nord-desktop-banner.webp",
    atmo: "img/nord-atmo-banner.webp",
    defaultHero: "atmo",
    gradient: "linear-gradient(135deg, #242933 0%, #2e3440 48%, #3b4252 100%)",
    page: "#242933", surface: "#2e3440", elevated: "#3b4252", hover: "#4c566a",
    textMuted: "#8f9aab", textSecondary: "#b4bfce", text: "#d8dee9", textStrong: "#eceff4",
    accentStrong: "#5e81ac", accent: "#74a7b8", accentHover: "#88c0d0", accentBright: "#8fbcbb",
    cardTop: "#39414f", cardBottom: "#29303b", cardBorder: "#526174", iconSurface: "#414b5b"
  },
  gruvbox: {
    label: "Gruvbox",
    wallpaper: "img/gruvbox-wallpaper.webp",
    desktop: "img/gruvbox-desktop-banner.webp",
    atmo: "img/gruvbox-atmo-banner.webp",
    defaultHero: "desktop",
    gradient: "linear-gradient(135deg, #1d2021 0%, #282828 50%, #3c3836 100%)",
    page: "#1d2021", surface: "#282828", elevated: "#3c3836", hover: "#504945",
    textMuted: "#a9a099", textSecondary: "#c2b8a9", text: "#ebdbb2", textStrong: "#fbf1c7",
    accentStrong: "#b57614", accent: "#d79921", accentHover: "#fabd2f", accentBright: "#f6c94d",
    cardTop: "#3a3733", cardBottom: "#262320", cardBorder: "#57514b", iconSurface: "#45403a"
  },
  graphite: {
    label: "Graphite",
    wallpaper: "img/graphite-wallpaper.webp",
    desktop: "img/graphite-desktop-banner.webp",
    atmo: "img/graphite-atmo-banner.webp",
    defaultHero: "desktop",
    gradient: "linear-gradient(135deg, #111113 0%, #18181b 48%, #27272a 100%)",
    page: "#111113", surface: "#1c1c20", elevated: "#29292e", hover: "#38383f",
    textMuted: "#8e8e98", textSecondary: "#b4b4bd", text: "#e4e4e7", textStrong: "#fafafa",
    accentStrong: "#6d28d9", accent: "#7c3aed", accentHover: "#8b5cf6", accentBright: "#a78bfa",
    cardTop: "#29292e", cardBottom: "#18181b", cardBorder: "#414147", iconSurface: "#303036"
  },
  tokyoNight: {
    label: "Tokyo Night",
    wallpaper: "img/tokyo-night-wallpaper.webp",
    desktop: "img/tokyo-night-desktop-banner.webp",
    atmo: "img/tokyo-night-atmo-banner.webp",
    defaultHero: "desktop",
    gradient: "linear-gradient(135deg, #13141c 0%, #1a1b26 48%, #24283b 100%)",
    page: "#13141c", surface: "#1a1b26", elevated: "#24283b", hover: "#343b58",
    textMuted: "#898fac", textSecondary: "#a2a5b9", text: "#c0caf5", textStrong: "#f1f3ff",
    accentStrong: "#3d59a1", accent: "#5d7bd9", accentHover: "#7aa2f7", accentBright: "#89b4fa",
    cardTop: "#252a40", cardBottom: "#181a28", cardBorder: "#3d4665", iconSurface: "#2c324b"
  }
};

const pendingLiveSettings = new Set();

let liveSettingCommitTimer = null;

function getTheme() { return THEMES[data.settings.theme] || THEMES.nord; }

const HERO_SIZES = {
  hidden: { label: "Hidden", height: 0 },
  small: { label: "Small", height: 210 },
  medium: { label: "Medium", height: 240 },
  large: { label: "Large", height: 330 }
};

function normalizeHeroSize(value, heroHeight, heroStyle) {
  const raw = String(value || "").toLowerCase();
  if (HERO_SIZES[raw]) return raw;
  if (heroStyle === "hidden") return "hidden";
  const height = Number(heroHeight);
  if (Number.isFinite(height)) {
    if (height <= 220) return "small";
    if (height <= 280) return "medium";
    return "large";
  }
  return "large";
}

function heroHeightForSize(size, fallbackHeight) {
  if (size === "hidden") return 0;
  if (HERO_SIZES[size]) return HERO_SIZES[size].height;
  return clamp(Number(fallbackHeight), 210, 360, 330);
}

function labelHeroSize(size) { return HERO_SIZES[size]?.label || "Large"; }

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
  const templateId = s.workspace?.template || s.layoutPreset || "classic";
  ["classic", "minimal", "dashboard"].forEach(p => {
    // Layout presets have been replaced by workspace templates.
    // Do not toggle legacy layout-* classes here; those old CSS rules
    // permanently override search/banner placement and caused Dashboard regressions.
    body.classList.remove(`layout-${p}`);
    body.classList.toggle(`workspace-template-${p}`, templateId === p);
  });
  body.classList.toggle("workspace-modified", s.workspace?.modified === true);
  const workspace = canonicalizeWorkspace();
  const currentHeroSlot = workspace.slots.hero;
  const currentSearchSlot = workspace.slots.search;
  const bannerVisuallyHidden = currentHeroSlot === "hidden" || s.heroSize === "hidden";
  const currentHeroStyle = workspaceHeroStyle(workspace);
  body.classList.toggle("workspace-hero-standard", currentHeroStyle === "standard");
  body.classList.toggle("workspace-hero-top-bar", currentHeroStyle === "topBar");
  body.classList.toggle("workspace-hero-bottom-bar", currentHeroStyle === "bottomBar");
  body.classList.toggle("workspace-hero-bar", workspaceUsesHeroBar(workspace));
  body.classList.toggle("workspace-search-standalone", currentSearchSlot === "standalone-search");
  body.classList.toggle("workspace-search-hero", currentSearchSlot === "hero-search");
  body.classList.toggle("workspace-search-header", currentSearchSlot === "header-search");
  body.classList.toggle("workspace-header-center-exclusive", currentSearchSlot === "header-search");
  body.classList.toggle("workspace-banner-hidden", bannerVisuallyHidden);
  body.dataset.workspaceTemplate = templateId;
  body.classList.toggle("ui-hide-logo", workspace.slots.logo === "hidden");
  body.classList.toggle("ui-hide-wordmark", workspace.slots.wordmark === "hidden");
  body.classList.toggle("ui-hide-clock", workspace.slots.clock === "hidden");
  body.classList.toggle("ui-hide-weather", workspace.slots.weather === "hidden");
  body.classList.toggle("ui-hide-search", currentSearchSlot === "hidden");
  body.classList.toggle("ui-hide-section-titles", workspace.display?.showSectionTitles === false && s.bookmarkLayout === "grid");
  document.documentElement.style.setProperty("--ui-scale", String(s.uiScale / 100));
  document.documentElement.style.setProperty("--bookmark-font-size", `${s.bookmarkFontSize}px`);
  document.documentElement.style.setProperty("--bookmark-icon-size", `${s.bookmarkIconSize}px`);
  const fonts = {
    system: 'var(--font-system)',
    inter: 'var(--font-waypoint)'
  };
  document.documentElement.style.setProperty("--sans", fonts[s.fontFamily] || fonts.inter);
  let style = $("waypointCustomCss");
  if (!style) { style = document.createElement("style"); style.id = "waypointCustomCss"; document.head.appendChild(style); }
  style.textContent = s.useCustomAppearance ? s.customCss || "" : "";
}

function applyTheme() {
  const theme = getTheme();
  const root = document.documentElement;
  root.dataset.themeScheme = theme.scheme || "dark";
  const sectionCardOpacity = .6;
  const sectionCardOpacityPercent = 60;
  if (data.settings.useCustomAppearance) {
    const customSurface = data.settings.customPanel;
    const customText = data.settings.customText;
    const customAccent = data.settings.customAccent;
    const customElevated = colorMix(customSurface, customText, .12);
    const customHover = colorMix(customSurface, customText, .20);
    root.style.setProperty("--bg", colorMix(customSurface, "#000000", .28));
    root.style.setProperty("--panel", hexToRgba(customSurface, .80));
    root.style.setProperty("--panel-strong", hexToRgba(customSurface, .96));
    root.style.setProperty("--surface", hexToRgba(customSurface, .82));
    root.style.setProperty("--surface-strong", hexToRgba(customSurface, .96));
    root.style.setProperty("--surface-soft", hexToRgba(customSurface, .42));
    root.style.setProperty("--surface-elevated", customElevated);
    root.style.setProperty("--surface-hover", customHover);
    root.style.setProperty("--text", customText);
    root.style.setProperty("--text-secondary", colorMix(customText, customSurface, .24));
    root.style.setProperty("--text-strong", colorMix(customText, "#ffffff", .18));
    root.style.setProperty("--muted", colorMix(customText, customSurface, .42));
    root.style.setProperty("--accent", customAccent);
    root.style.setProperty("--accent-strong", colorMix(customAccent, "#000000", .18));
    root.style.setProperty("--accent-bright", colorMix(customAccent, "#ffffff", .18));
    root.style.setProperty("--accent-hover-color", colorMix(customAccent, "#ffffff", .10));
    root.style.setProperty("--waypoint-green", customAccent);
    root.style.setProperty("--border", hexToRgba(customText, .20));
    root.style.setProperty("--card-border", hexToRgba(customText, .24));
    root.style.setProperty("--card-background", `linear-gradient(145deg, color-mix(in srgb, ${customElevated} ${sectionCardOpacityPercent}%, transparent), color-mix(in srgb, ${customSurface} ${sectionCardOpacityPercent}%, transparent))`);
    root.style.setProperty("--card-icon-surface", customElevated);
  } else {
    root.style.setProperty("--bg", theme.page);
    root.style.setProperty("--panel", hexToRgba(theme.surface, .80));
    root.style.setProperty("--panel-strong", hexToRgba(theme.surface, .96));
    root.style.setProperty("--surface", hexToRgba(theme.surface, .82));
    root.style.setProperty("--surface-strong", hexToRgba(theme.surface, .96));
    root.style.setProperty("--surface-soft", hexToRgba(theme.surface, .42));
    root.style.setProperty("--surface-elevated", theme.elevated);
    root.style.setProperty("--surface-hover", theme.hover);
    root.style.setProperty("--text", theme.text);
    root.style.setProperty("--text-secondary", theme.textSecondary);
    root.style.setProperty("--text-strong", theme.textStrong);
    root.style.setProperty("--muted", theme.textMuted);
    root.style.setProperty("--accent", theme.accent);
    root.style.setProperty("--accent-strong", theme.accentStrong);
    root.style.setProperty("--accent-bright", theme.accentBright);
    root.style.setProperty("--accent-hover-color", theme.accentHover);
    root.style.setProperty("--waypoint-green", theme.accentHover);
    root.style.setProperty("--border", hexToRgba(theme.textSecondary, .18));
    root.style.setProperty("--card-border", theme.cardBorder);
    root.style.setProperty("--card-background", `linear-gradient(145deg, ${hexToRgba(theme.cardTop, sectionCardOpacity)}, ${hexToRgba(theme.cardBottom, sectionCardOpacity)})`);
    root.style.setProperty("--card-icon-surface", theme.iconSurface);
  }
  root.style.setProperty("--accent-soft", "color-mix(in srgb, var(--accent-hover-color) 18%, transparent)");
  root.style.setProperty("--accent-hover", "color-mix(in srgb, var(--accent-hover-color) 16%, transparent)");

  if (data.settings.useCustomAppearance) {
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
      const custom = WaypointStorage.loadRaw(CUSTOM_BG_KEY);
      bg.style.backgroundImage = custom ? `url("${custom}"), ${theme.gradient}` : `url("${theme.wallpaper}"), ${theme.gradient}`;
    } else bg.style.backgroundImage = `url("${theme.wallpaper}"), ${theme.gradient}`;
  }
  if (overlay) {
    const overlayColor = theme.scheme === "light" ? "255,255,255" : "0,0,0";
    overlay.style.background = `rgba(${overlayColor},${data.settings.overlay / 100})`;
  }
}

function getHeroSrc() {
  const theme = getTheme();
  if (data.settings.heroStyle === "custom") return WaypointStorage.loadRaw(CUSTOM_HERO_KEY) || theme[theme.defaultHero];
  if (data.settings.heroStyle === "desktop") return theme.desktop;
  if (data.settings.heroStyle === "atmo") return theme.atmo;
  return theme[theme.defaultHero];
}

function applyHero() {
  const card = $("heroImageCard");
  const img = $("heroImage");
  if (!card || !img) return;
  const workspace = canonicalizeWorkspace();
  const isBannerHidden = workspace.slots.hero === "hidden" || data.settings.heroSize === "hidden";
  const heroSize = isBannerHidden ? "hidden" : normalizeHeroSize(data.settings.heroSize, data.settings.heroHeight, data.settings.heroStyle);
  data.settings.heroSize = heroSize;
  data.settings.heroHeight = heroHeightForSize(heroSize, data.settings.heroHeight);
  card.classList.toggle("hidden-banner", isBannerHidden);
  const hero = document.querySelector(".hero");
  hero?.classList.toggle("banner-hidden", isBannerHidden);
  ["hidden", "small", "medium", "large"].forEach(size => hero?.classList.toggle(`hero-size-${size}`, heroSize === size));
  card.style.setProperty("--hero-height", `${data.settings.heroHeight}px`);
  card.style.setProperty("--hero-min-height", `${data.settings.heroHeight}px`);
  card.style.setProperty("--hero-fit", "contain");
  card.classList.add("fit-contain");
  const theme = getTheme();
  const heroSrc = isBannerHidden ? "" : getHeroSrc();
  card.style.backgroundImage = heroSrc ? `url("${heroSrc}"), ${theme.gradient}` : theme.gradient;
  card.style.backgroundPosition = "center center";
  card.style.backgroundSize = "contain, cover";
  card.style.backgroundRepeat = "no-repeat";
  img.hidden = true;
  img.removeAttribute("src");
  card.classList.remove("hero-image-missing");
}

function applyLiveSettingPreview(key) {
  const root = document.documentElement;
  if (key === "uiScale") {
    root.style.setProperty("--ui-scale", String(data.settings.uiScale / 100));
    setText("uiScaleValue", `${data.settings.uiScale}%`);
    return;
  }
  if (key === "bookmarkFontSize") {
    root.style.setProperty("--bookmark-font-size", `${data.settings.bookmarkFontSize}px`);
    setText("bookmarkFontValue", `${data.settings.bookmarkFontSize}px`);
    return;
  }
  if (key === "bookmarkIconSize") {
    root.style.setProperty("--bookmark-icon-size", `${data.settings.bookmarkIconSize}px`);
    setText("bookmarkIconValue", `${data.settings.bookmarkIconSize}px`);
    return;
  }
  if (key === "overlay") {
    const overlay = $("backgroundOverlay");
    const overlayColor = getTheme().scheme === "light" ? "255,255,255" : "0,0,0";
    if (overlay) overlay.style.background = `rgba(${overlayColor},${data.settings.overlay / 100})`;
    setText("overlayValue", `${data.settings.overlay}%`);
    return;
  }
  if (key === "blur") {
    const background = $("backgroundLayer");
    if (background) background.style.filter = `blur(${data.settings.blur}px)`;
    setText("blurValue", `${data.settings.blur}px`);
    return;
  }
  if (key === "customCss") {
    let style = $("waypointCustomCss");
    if (!style) {
      style = document.createElement("style");
      style.id = "waypointCustomCss";
      document.head.appendChild(style);
    }
    style.textContent = data.settings.useCustomAppearance ? data.settings.customCss || "" : "";
    return;
  }
  if (key === "userName") {
    updateLogoPrompt();
    return;
  }
  if (key === "sectionTitleColor") {
    root.style.setProperty("--section-title-color", data.settings.sectionTitleColor);
    return;
  }
  if (key === "bookmarkTextColor") {
    root.style.setProperty("--bookmark-text-color", data.settings.bookmarkTextColor);
    return;
  }
  if (key === "mutedTextColor") {
    root.style.setProperty("--custom-muted-text", data.settings.mutedTextColor);
    return;
  }
  if (key === "terminalTextColor") {
    root.style.setProperty("--terminal-text-color", data.settings.terminalTextColor);
    return;
  }
  if (key === "statusTextColor") {
    root.style.setProperty("--status-text-color", data.settings.statusTextColor);
    return;
  }
  if (["customAccent", "customPanel", "customText"].includes(key)) applyTheme();
}

function previewLiveSetting(key, value) {
  if (data.settings[key] === value) return false;
  return measureWaypointRender("waypoint:appearance:preview", () => {
    data.settings[key] = value;
    pendingLiveSettings.add(key);
    applyLiveSettingPreview(key);
    return true;
  });
}

function scheduleLiveSettingsCommit(delay = 200) {
  clearTimeout(liveSettingCommitTimer);
  liveSettingCommitTimer = setTimeout(() => {
    liveSettingCommitTimer = null;
    commitLiveSettings();
  }, delay);
}

function commitLiveSettings() {
  clearTimeout(liveSettingCommitTimer);
  liveSettingCommitTimer = null;
  if (!pendingLiveSettings.size) return false;
  return measureWaypointRender("waypoint:appearance:commit", () => save());
}

function setBannerSize(size) {
  if (!HERO_SIZES[size]) return false;
  data.settings.bannerHiddenByWorkspace = false;
  data.settings.heroSize = size;
  data.settings.heroHeight = heroHeightForSize(size, data.settings.heroHeight);
  const workspace = canonicalizeWorkspace();
  if (size !== "hidden" && workspace.slots.hero === "hidden") {
    workspace.slots.hero = "hero-banner";
    workspace.modified = true;
    syncLegacyVisibilityFromWorkspace();
  }
  save();
  renderAppearance();
  return true;
}

function labelBannerStyle(value) { return ({ desktop: "Desktop", atmo: "Atmosphere", custom: "Custom", hidden: "Hidden" })[value] || "Theme Default"; }

function labelBackground(value) { return ({ wallpaper: "Theme Wallpaper", gradient: "Theme Gradient", custom: "Custom" })[value] || value; }
