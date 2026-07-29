// Waypoint workspace ownership. Loaded as an ordered classic script.

const WORKSPACE_HERO_STYLES = {
  standard: { label: "Standard Header", description: "Classic page header with an optional banner search." },
  topBar: { label: "Top Bar", description: "OS-style top panel that replaces the standard header." },
  bottomBar: { label: "Bottom Bar", description: "OS-style bottom panel that replaces the standard header." }
};

function normalizeWorkspaceHeroStyle(value) {
  return WORKSPACE_HERO_STYLES[value] ? value : "standard";
}

function workspaceHeroStyle(workspace = data?.settings?.workspace) {
  return normalizeWorkspaceHeroStyle(workspace?.display?.heroStyle);
}

function workspaceUsesHeroBar(workspace = data?.settings?.workspace) {
  return ["topBar", "bottomBar"].includes(workspaceHeroStyle(workspace));
}

const WIDGET_REGISTRY = [
  { id: "logo", label: "Logo / Terminal Button", selector: "#logoBtn", area: "header", visibleKey: "showLogo", movable: true, resizable: false },
  { id: "wordmark", label: "Waypoint Wordmark", selector: ".brand-wordmark", area: "header", visibleKey: "showWordmark", movable: true, resizable: false },
  { id: "clock", label: "Clock", selector: "#clock", area: "header", visibleKey: "showClock", movable: true, resizable: false },
  { id: "weather", label: "Weather", selector: "#weatherWidget", area: "header", visibleKey: "showWeather", movable: true, resizable: false },
  { id: "search", label: "Search", selector: "#searchForm", area: "hero", visibleKey: "showSearch", movable: true, resizable: true },
  { id: "hero", label: "Banner", selector: "#heroImageCard", area: "hero", visibleKey: "heroSize", movable: true, resizable: true },
  { id: "sections", label: "Bookmark Sections", selector: "#sections", area: "content", visibleKey: "showSectionTitles", movable: false, resizable: false }
];

function capitalize(value) { return String(value || "").charAt(0).toUpperCase() + String(value || "").slice(1); }

const HEADER_GROUPS = ["left", "center", "right"];

const HEADER_SLOT_COUNTS = { left: 2, center: 4, right: 2 };

const HEADER_WIDGET_IDS = ["logo", "wordmark", "clock", "weather"];

const HEADER_SLOT_IDS = HEADER_GROUPS.flatMap(group => Array.from({ length: HEADER_SLOT_COUNTS[group] }, (_, index) => `header-${group}-${index + 1}`));

function buildWorkspaceSlots() {
  const slots = {
    "hidden": { label: "Hidden", region: "hidden", accepts: ["logo", "wordmark", "clock", "weather", "search", "hero"] },
    "header-search": { label: "Header Search", region: "header", group: "center", exclusive: true, accepts: ["search"] },
    "hero-banner": { label: "Banner", region: "hero", accepts: ["hero"] },
    "hero-search": { label: "Banner Search", region: "hero", accepts: ["search"] },
    "standalone-search": { label: "Standalone Search", region: "search", accepts: ["search"] },
    "content-sections": { label: "Content Sections", region: "content", accepts: ["sections"] }
  };
  for (const group of HEADER_GROUPS) {
    for (let index = 1; index <= HEADER_SLOT_COUNTS[group]; index += 1) {
      const id = `header-${group}-${index}`;
      slots[id] = {
        label: `${capitalize(group)} ${index}`,
        friendlyLabel: `${capitalize(group)} · Position ${index}`,
        region: "header",
        group,
        order: index,
        accepts: [...HEADER_WIDGET_IDS]
      };
    }
  }
  return slots;
}

const WORKSPACE_SLOTS = buildWorkspaceSlots();

const WORKSPACE_WIDGETS = {
  logo: { label: "Logo / Terminal Button", defaultSlot: "header-left-1", allowedSlots: [...HEADER_SLOT_IDS, "hidden"] },
  wordmark: { label: "Waypoint Wordmark", defaultSlot: "header-left-2", allowedSlots: [...HEADER_SLOT_IDS, "hidden"] },
  clock: { label: "Clock", defaultSlot: "header-right-1", allowedSlots: [...HEADER_SLOT_IDS, "hidden"] },
  weather: { label: "Weather", defaultSlot: "header-right-2", allowedSlots: [...HEADER_SLOT_IDS, "hidden"] },
  search: { label: "Search", defaultSlot: "hero-search", allowedSlots: ["hero-search", "standalone-search", "header-search", "hidden"] },
  hero: { label: "Banner", defaultSlot: "hero-banner", allowedSlots: ["hero-banner", "hidden"] },
  sections: { label: "Bookmark Sections", defaultSlot: "content-sections", allowedSlots: ["content-sections"] }
};

const WORKSPACE_TEMPLATES = {
  classic: {
    label: "Classic",
    description: "Balanced default Waypoint layout.",
    slots: { logo: "header-left-1", wordmark: "header-left-2", clock: "header-right-1", weather: "header-right-2", search: "hero-search", hero: "hero-banner", sections: "content-sections" },
    display: { showSectionTitles: true, heroStyle: "standard" }
  },
  dashboard: {
    label: "Dashboard",
    description: "Dense bookmark-first workspace with standalone search.",
    slots: { logo: "header-left-1", wordmark: "header-left-2", clock: "header-right-1", weather: "header-right-2", search: "standalone-search", hero: "hidden", sections: "content-sections" },
    display: { showSectionTitles: true, heroStyle: "standard" }
  },
  minimal: {
    label: "Minimal",
    description: "Search-focused layout with visual chrome hidden.",
    slots: { logo: "hidden", wordmark: "hidden", clock: "hidden", weather: "hidden", search: "standalone-search", hero: "hidden", sections: "content-sections" },
    display: { showSectionTitles: true, heroStyle: "standard" }
  }
};

function slotGroup(slotId) {
  return WORKSPACE_SLOTS[slotId]?.group || null;
}

function isHeaderWidgetSlot(slotId) {
  return HEADER_SLOT_IDS.includes(slotId);
}

function isLegacyHeaderSlot(slotId) {
  return ["header-left", "header-center", "header-right"].includes(slotId);
}

function legacyHeaderGroup(slotId) {
  return String(slotId || "").replace(/^header-/, "");
}

function firstAvailableHeaderSlot(group, occupied = new Set()) {
  for (let index = 1; index <= HEADER_SLOT_COUNTS[group]; index += 1) {
    const slotId = `header-${group}-${index}`;
    if (!occupied.has(slotId)) return slotId;
  }
  return null;
}

function defaultWorkspace(templateId = "classic") {
  const template = WORKSPACE_TEMPLATES[templateId] || WORKSPACE_TEMPLATES.classic;
  return {
    version: 1,
    template: WORKSPACE_TEMPLATES[templateId] ? templateId : "classic",
    modified: false,
    slots: { ...template.slots },
    display: {
      showSectionTitles: template.display?.showSectionTitles !== false,
      heroStyle: normalizeWorkspaceHeroStyle(template.display?.heroStyle)
    }
  };
}

function legacyTemplateFromSettings(settings = {}) {
  const preset = String(settings.layoutPreset || "classic");
  return WORKSPACE_TEMPLATES[preset] ? preset : "classic";
}

function normalizeWorkspace(input, settings = {}) {
  const base = defaultWorkspace(legacyTemplateFromSettings(settings));
  const incoming = input && typeof input === "object" ? input : {};
  const template = WORKSPACE_TEMPLATES[incoming.template] ? incoming.template : base.template;
  const normalized = defaultWorkspace(template);
  normalized.modified = incoming.modified === true;
  const incomingSlots = incoming.slots && typeof incoming.slots === "object" ? incoming.slots : {};

  const occupiedHeaderSlots = new Set();

  for (const widgetId of Object.keys(WORKSPACE_WIDGETS)) {
    let slot = incomingSlots[widgetId] || normalized.slots[widgetId] || WORKSPACE_WIDGETS[widgetId].defaultSlot;

    if (HEADER_WIDGET_IDS.includes(widgetId) && isLegacyHeaderSlot(slot)) {
      const group = legacyHeaderGroup(slot);
      slot = firstAvailableHeaderSlot(group, occupiedHeaderSlots) || WORKSPACE_WIDGETS[widgetId].defaultSlot;
    }

    if (!WORKSPACE_WIDGETS[widgetId].allowedSlots.includes(slot)) slot = WORKSPACE_WIDGETS[widgetId].defaultSlot;
    if (!WORKSPACE_SLOTS[slot]?.accepts.includes(widgetId)) slot = WORKSPACE_WIDGETS[widgetId].defaultSlot;

    if (HEADER_WIDGET_IDS.includes(widgetId) && isHeaderWidgetSlot(slot)) {
      if (occupiedHeaderSlots.has(slot)) {
        const replacement = firstAvailableHeaderSlot(slotGroup(slot) || "left", occupiedHeaderSlots);
        slot = replacement || "hidden";
      }
      if (slot !== "hidden") occupiedHeaderSlots.add(slot);
    }

    normalized.slots[widgetId] = slot;
  }

  if (!input || typeof input !== "object") {
    if (settings.showLogo === false || settings.showLogo === "false") normalized.slots.logo = "hidden";
    if (settings.showWordmark === false || settings.showWordmark === "false") normalized.slots.wordmark = "hidden";
    if (settings.showClock === false || settings.showClock === "false") normalized.slots.clock = "hidden";
    if (settings.showWeather === false || settings.showWeather === "false") normalized.slots.weather = "hidden";
    if (settings.showSearch === false || settings.showSearch === "false") normalized.slots.search = "hidden";
    if (normalizeHeroSize(settings.heroSize, settings.heroHeight, settings.heroStyle) === "hidden") normalized.slots.hero = "hidden";
    normalized.display.showSectionTitles = settings.showSectionTitles !== false && settings.showSectionTitles !== "false";
    normalized.display.heroStyle = normalizeWorkspaceHeroStyle(settings.workspaceHeroStyle || settings.heroPresentation || normalized.display.heroStyle);
  } else {
    normalized.display.showSectionTitles = incoming.display?.showSectionTitles !== false;
    normalized.display.heroStyle = normalizeWorkspaceHeroStyle(incoming.display?.heroStyle);
  }

  return canonicalizeWorkspace(normalized);
}

function slotForWidget(widgetId) {
  return data.settings.workspace?.slots?.[widgetId] || WORKSPACE_WIDGETS[widgetId]?.defaultSlot || "hidden";
}

function widgetIsHidden(widgetId) { return slotForWidget(widgetId) === "hidden"; }

function slotLabel(slotId) { return WORKSPACE_SLOTS[slotId]?.friendlyLabel || WORKSPACE_SLOTS[slotId]?.label || slotId || "Unknown"; }

function regionLabel(slotId) {
  const region = WORKSPACE_SLOTS[slotId]?.region || "unknown";
  return { header: "Header", hero: "Banner", search: "Search", content: "Content", hidden: "Hidden" }[region] || region;
}

function canonicalizeWorkspace(workspace = data.settings.workspace) {
  if (!workspace || typeof workspace !== "object") workspace = data.settings.workspace = defaultWorkspace();
  if (!workspace.slots || typeof workspace.slots !== "object") workspace.slots = {};

  const occupiedHeaderSlots = new Set();
  const searchInHeader = workspace.slots.search === "header-search";

  for (const widgetId of Object.keys(WORKSPACE_WIDGETS)) {
    let slot = workspace.slots[widgetId] || WORKSPACE_WIDGETS[widgetId].defaultSlot;

    if (HEADER_WIDGET_IDS.includes(widgetId) && isLegacyHeaderSlot(slot)) {
      const group = legacyHeaderGroup(slot);
      slot = firstAvailableHeaderSlot(group, occupiedHeaderSlots) || WORKSPACE_WIDGETS[widgetId].defaultSlot;
    }

    if (!WORKSPACE_WIDGETS[widgetId].allowedSlots.includes(slot)) slot = WORKSPACE_WIDGETS[widgetId].defaultSlot;
    if (!WORKSPACE_SLOTS[slot]?.accepts.includes(widgetId)) slot = WORKSPACE_WIDGETS[widgetId].defaultSlot;

    if (HEADER_WIDGET_IDS.includes(widgetId) && isHeaderWidgetSlot(slot)) {
      // Header Search owns the entire center region. No center widgets are allowed there.
      if (searchInHeader && slotGroup(slot) === "center") {
        const rightFallback = firstAvailableHeaderSlot("right", occupiedHeaderSlots);
        const leftFallback = firstAvailableHeaderSlot("left", occupiedHeaderSlots);
        slot = rightFallback || leftFallback || "hidden";
      }

      if (slot !== "hidden" && occupiedHeaderSlots.has(slot)) {
        const replacement = firstAvailableHeaderSlot(slotGroup(slot) || "left", occupiedHeaderSlots);
        slot = replacement || "hidden";
      }

      if (slot !== "hidden") occupiedHeaderSlots.add(slot);
    }

    workspace.slots[widgetId] = slot;
  }

  workspace.display = workspace.display || {};
  if (typeof workspace.display.showSectionTitles !== "boolean") workspace.display.showSectionTitles = true;
  workspace.display.heroStyle = normalizeWorkspaceHeroStyle(workspace.display.heroStyle);

  if (workspaceUsesHeroBar(workspace) && workspace.slots.search === "header-search") {
    workspace.slots.search = "standalone-search";
  }

  if (workspace.slots.hero === "hidden" && workspace.slots.search === "hero-search") {
    workspace.slots.search = "standalone-search";
  }

  return workspace;
}

function syncLegacyVisibilityFromWorkspace() {
  const workspace = canonicalizeWorkspace();
  const heroHidden = workspace.slots.hero === "hidden";
  const wasHiddenByWorkspace = data.settings.bannerHiddenByWorkspace === true;

  // Legacy fields now mirror Workspace only for old controls/imports.
  // They are not allowed to drive layout.
  data.settings.showLogo = workspace.slots.logo !== "hidden";
  data.settings.showWordmark = workspace.slots.wordmark !== "hidden";
  data.settings.showClock = workspace.slots.clock !== "hidden";
  data.settings.showWeather = workspace.slots.weather !== "hidden";
  data.settings.showSearch = workspace.slots.search !== "hidden";
  data.settings.showSectionTitles = workspace.display?.showSectionTitles !== false;

  data.settings.bannerHiddenByWorkspace = heroHidden;
  if (!heroHidden) {
    // Older v1.5.2 profiles may have persisted the effective Workspace-hidden
    // state into the Appearance-owned banner size. Restore a visible default
    // only when that stale value came from Workspace.
    if (wasHiddenByWorkspace && data.settings.heroSize === "hidden") {
      data.settings.heroSize = "medium";
    }
    data.settings.heroSize = normalizeHeroSize(data.settings.heroSize, data.settings.heroHeight, data.settings.heroStyle);
    data.settings.heroHeight = heroHeightForSize(data.settings.heroSize, data.settings.heroHeight);
  }
  data.settings.layoutPreset = workspace.template || "classic";
  data.settings.workspaceHeroStyle = workspaceHeroStyle(workspace);
}

function setWidgetSlot(widgetId, slotId) {
  if (!WORKSPACE_WIDGETS[widgetId] || !WORKSPACE_WIDGETS[widgetId].allowedSlots.includes(slotId)) return false;
  if (!WORKSPACE_SLOTS[slotId]?.accepts.includes(widgetId)) return false;
  if (workspaceSlotIsUnavailable(widgetId, slotId)) return false;

  const workspace = data.settings.workspace;
  const previousSlot = workspace.slots[widgetId];

  if (HEADER_WIDGET_IDS.includes(widgetId) && isHeaderWidgetSlot(slotId)) {
    if (workspace.slots.search === "header-search" && slotGroup(slotId) === "center") return false;
    const occupyingWidget = HEADER_WIDGET_IDS.find(id => id !== widgetId && workspace.slots[id] === slotId);
    if (occupyingWidget) return false;
  }

  if (widgetId === "search" && slotId === "header-search") {
    const centerOccupied = HEADER_WIDGET_IDS.some(id => isHeaderWidgetSlot(workspace.slots[id]) && slotGroup(workspace.slots[id]) === "center");
    if (centerOccupied) return false;
  }

  workspace.slots[widgetId] = slotId;
  workspace.modified = true;

  if (widgetId === "hero") {
    const wasHiddenByWorkspace = data.settings.bannerHiddenByWorkspace === true;
    data.settings.bannerHiddenByWorkspace = slotId === "hidden";
    if (slotId !== "hidden" && wasHiddenByWorkspace && data.settings.heroSize === "hidden") {
      data.settings.heroSize = "medium";
      data.settings.heroHeight = heroHeightForSize("medium", data.settings.heroHeight);
    }
  }

  if (widgetId === "hero" && slotId === "hidden" && workspace.slots.search === "hero-search") {
    workspace.slots.search = "standalone-search";
  }

  canonicalizeWorkspace(workspace);
  syncLegacyVisibilityFromWorkspace();
  return true;
}

function setWidgetVisible(widgetId, visible) {
  const fallback = WORKSPACE_WIDGETS[widgetId]?.defaultSlot;
  return setWidgetSlot(widgetId, visible ? fallback : "hidden");
}

function setWorkspaceHeroStyle(style) {
  const workspace = canonicalizeWorkspace();
  workspace.display.heroStyle = normalizeWorkspaceHeroStyle(style);
  workspace.modified = true;
  if (workspaceUsesHeroBar(workspace) && workspace.slots.search === "header-search") {
    workspace.slots.search = "standalone-search";
  }
  canonicalizeWorkspace(workspace);
  syncLegacyVisibilityFromWorkspace();
  return true;
}

function applyWorkspaceTemplate(templateId) {
  if (!WORKSPACE_TEMPLATES[templateId]) return false;
  data.settings.workspace = defaultWorkspace(templateId);
  if (data.settings.workspace.slots.hero !== "hidden" && data.settings.heroSize === "hidden") {
    data.settings.heroSize = "medium";
    data.settings.heroHeight = heroHeightForSize("medium", data.settings.heroHeight);
  }
  syncLegacyVisibilityFromWorkspace();
  return true;
}

function workspaceSummaryText() {
  const workspace = data.settings.workspace || defaultWorkspace();
  const rows = Object.keys(WORKSPACE_WIDGETS).map(id => `${id.padEnd(10)} ${WORKSPACE_WIDGETS[id].label} -> ${slotLabel(workspace.slots[id])}`);
  rows.unshift(`Template: ${WORKSPACE_TEMPLATES[workspace.template]?.label || workspace.template}${workspace.modified ? " (modified)" : ""}`);
  rows.push(`Page header style: ${WORKSPACE_HERO_STYLES[workspaceHeroStyle(workspace)]?.label || "Standard Header"}`);
  rows.push(`Grid section titles: ${workspace.display?.showSectionTitles === false ? "hidden" : "visible"}`);
  return cleanList("Waypoint Workspace", rows);
}

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
      area: ["header", "toolbar", "hero", "content", "floating"].includes(incoming.area) ? incoming.area : normalized[widget.id].area,
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
  if (WORKSPACE_WIDGETS[widget.id]) return !widgetIsHidden(widget.id);
  if (widget.visibleKey === "heroSize") return data.settings.heroSize !== "hidden";
  return data.settings[widget.visibleKey] !== false;
}

let editLayoutActive = false;

let selectedWorkspaceWidgetId = null;

function workspaceWidgetLabel(widgetId) {
  return WORKSPACE_WIDGETS[widgetId]?.label || WIDGET_REGISTRY.find(widget => widget.id === widgetId)?.label || widgetId;
}

function workspaceWidgetHint(widgetId) {
  return {
    logo: "The terminal button and Waypoint mark.",
    wordmark: "The Waypoint name in the header.",
    clock: "The date and time widget.",
    weather: "The weather widget.",
    search: "The search box.",
    hero: "The banner image area.",
    sections: "Your bookmark sections."
  }[widgetId] || "Workspace item";
}

function workspaceSlotDescription(slotId) {
  if (isHeaderWidgetSlot(slotId)) {
    const slot = WORKSPACE_SLOTS[slotId];
    const region = workspaceUsesHeroBar() ? "bar" : "header";
    return `Place it in the ${slot.group} ${region} group, position ${slot.order}.`;
  }
  return {
    "hidden": "Hide it for a cleaner page.",
    "header-search": "Place search in the center of the header. Unavailable for Top Bar and Bottom Bar styles.",
    "hero-banner": "Show the banner image.",
    "hero-search": "Place search on the banner. Unavailable when the banner is hidden.",
    "standalone-search": "Place search as its own row.",
    "content-sections": "Keep bookmark sections in the content area."
  }[slotId] || "Available location";
}

function workspaceSlotTone(slotId) {
  if (slotId === "hidden") return "Hidden";
  if (isHeaderWidgetSlot(slotId)) return `${workspaceUsesHeroBar() ? "Bar" : "Header"} · ${slotLabel(slotId)}`;
  if (slotId === "header-search") return "Header · Search";
  return `${regionLabel(slotId)} · ${slotLabel(slotId).replace(/^Header /, "")}`;
}

function availableWorkspaceSlots(widgetId) {
  const widget = WORKSPACE_WIDGETS[widgetId];
  if (!widget) return [];
  if (widgetId === "sections") return ["content-sections"];
  const workspace = canonicalizeWorkspace();
  return widget.allowedSlots.filter(slotId => {
    if (!WORKSPACE_SLOTS[slotId]?.accepts.includes(widgetId)) return false;
    if (workspaceSlotIsUnavailable(widgetId, slotId)) return false;
    return true;
  });
}

function movableWorkspaceWidgetIds() {
  return Object.keys(WORKSPACE_WIDGETS).filter(widgetId => {
    if (widgetId === "sections") return false;
    const registry = WIDGET_REGISTRY.find(widget => widget.id === widgetId);
    return registry?.movable !== false;
  });
}

function clearWorkspaceSelection() {
  selectedWorkspaceWidgetId = null;
  document.body.classList.remove("workspace-widget-selected");
  document.querySelectorAll(".waypoint-widget").forEach(el => {
    el.classList.remove("workspace-selected-widget", "workspace-valid-widget", "workspace-muted-widget");
  });
  document.getElementById("workspaceDestinationTray")?.remove();
  renderWorkspaceDesignerPanel();
  updateEditLayoutBar();
}

function selectWorkspaceWidget(widgetId) {
  if (!editLayoutActive || !WORKSPACE_WIDGETS[widgetId]) return;
  const registry = WIDGET_REGISTRY.find(widget => widget.id === widgetId);
  if (!registry?.movable) return;
  selectedWorkspaceWidgetId = widgetId;
  document.body.classList.add("workspace-widget-selected");
  const validSlots = new Set(availableWorkspaceSlots(widgetId));
  const currentSlot = slotForWidget(widgetId);
  document.querySelectorAll(".waypoint-widget").forEach(el => {
    const elWidgetId = el.dataset.widgetId;
    const slot = el.dataset.widgetSlot;
    const isSelected = elWidgetId === widgetId;
    const isValidPeer = slot && validSlots.has(slot) && slot !== currentSlot;
    const isSearchHost = widgetId === "search" && currentSlot === "hero-search" && elWidgetId === "hero" && slot === "hero-banner";
    el.classList.toggle("workspace-selected-widget", isSelected);
    el.classList.toggle("workspace-valid-widget", !isSelected && isValidPeer);
    el.classList.toggle("workspace-host-widget", isSearchHost);
    el.classList.toggle("workspace-muted-widget", !isSelected && !isValidPeer && !isSearchHost);
  });
  renderWorkspaceDesignerPanel(widgetId);
  updateEditLayoutBar();
}

function renderWorkspaceDestinationTray(widgetId) {
  // Kept as a compatibility wrapper for the previous dev10 implementation.
  renderWorkspaceDesignerPanel(widgetId);
}

function workspaceSlotOccupant(slotId, ignoreWidgetId = null) {
  const workspace = canonicalizeWorkspace();
  return Object.keys(WORKSPACE_WIDGETS).find(id => id !== ignoreWidgetId && workspace.slots[id] === slotId) || null;
}

function workspaceSlotIsUnavailable(widgetId, slotId) {
  if (slotId === slotForWidget(widgetId)) return false;
  if (slotId === "hidden") return false;
  const workspace = canonicalizeWorkspace();
  const barMode = workspaceUsesHeroBar(workspace);
  if (barMode && widgetId === "search" && slotId === "header-search") return true;
  if (widgetId === "search" && slotId === "hero-search" && workspace.slots.hero === "hidden") return true;
  if (HEADER_WIDGET_IDS.includes(widgetId) && isHeaderWidgetSlot(slotId) && workspace.slots.search === "header-search" && slotGroup(slotId) === "center") return true;
  if (HEADER_WIDGET_IDS.includes(widgetId) && isHeaderWidgetSlot(slotId) && workspaceSlotOccupant(slotId, widgetId)) return true;
  if (widgetId === "search" && slotId === "header-search") {
    return HEADER_WIDGET_IDS.some(id => isHeaderWidgetSlot(slotForWidget(id)) && slotGroup(slotForWidget(id)) === "center");
  }
  return false;
}

function workspaceDestinationStatus(widgetId, slotId) {
  const occupant = workspaceSlotOccupant(slotId, widgetId);
  if (slotId === slotForWidget(widgetId)) return "Current";
  if (slotId === "hidden") return "Available";
  const workspace = canonicalizeWorkspace();
  if (workspaceUsesHeroBar(workspace) && widgetId === "search" && slotId === "header-search") return "Search cannot live in the bar";
  if (widgetId === "search" && slotId === "hero-search" && workspace.slots.hero === "hidden") return "Banner is hidden";
  if (HEADER_WIDGET_IDS.includes(widgetId) && isHeaderWidgetSlot(slotId) && workspace.slots.search === "header-search" && slotGroup(slotId) === "center") return "Header Search uses center";
  if (HEADER_WIDGET_IDS.includes(widgetId) && isHeaderWidgetSlot(slotId) && occupant) return `${workspaceWidgetLabel(occupant)} already here`;
  if (widgetId === "search" && slotId === "header-search") {
    const centerOccupants = HEADER_WIDGET_IDS.filter(id => isHeaderWidgetSlot(slotForWidget(id)) && slotGroup(slotForWidget(id)) === "center");
    if (centerOccupants.length) return `Center occupied by ${centerOccupants.map(workspaceWidgetLabel).join(", ")}`;
  }
  return "Available";
}

function enableWorkspacePanelDrag(panel) {
  const handle = panel.querySelector(".workspace-panel-head");
  if (!handle || handle.dataset.dragReady === "true") return;
  handle.dataset.dragReady = "true";
  handle.setAttribute("title", "Drag to move");
  handle.addEventListener("pointerdown", event => {
    if (event.button !== 0) return;
    if (event.target.closest("button, input, select, textarea, a")) return;
    event.preventDefault();
    const rect = panel.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;
    panel.classList.add("dragging-workspace-panel");
    panel.setPointerCapture?.(event.pointerId);

    const movePanel = moveEvent => {
      const margin = 10;
      const maxLeft = Math.max(margin, window.innerWidth - rect.width - margin);
      const maxTop = Math.max(margin, window.innerHeight - rect.height - margin);
      const left = Math.min(Math.max(margin, moveEvent.clientX - offsetX), maxLeft);
      const top = Math.min(Math.max(margin, moveEvent.clientY - offsetY), maxTop);
      panel.classList.add("workspace-panel-moved");
      panel.style.setProperty("--workspace-panel-left", `${left}px`);
      panel.style.setProperty("--workspace-panel-top", `${top}px`);
      panel.style.left = `${left}px`;
      panel.style.top = `${top}px`;
      panel.style.right = "auto";
      panel.style.bottom = "auto";
    };

    const stopDrag = () => {
      panel.classList.remove("dragging-workspace-panel");
      window.removeEventListener("pointermove", movePanel);
      window.removeEventListener("pointerup", stopDrag);
      window.removeEventListener("pointercancel", stopDrag);
    };

    window.addEventListener("pointermove", movePanel);
    window.addEventListener("pointerup", stopDrag);
    window.addEventListener("pointercancel", stopDrag);
  });
}

function workspaceDestinationSlots(widgetId) {
  const widget = WORKSPACE_WIDGETS[widgetId];
  if (!widget) return [];
  return widget.allowedSlots.filter(slotId => WORKSPACE_SLOTS[slotId]?.accepts.includes(widgetId));
}

function renderWorkspaceDesignerPanel(widgetId = selectedWorkspaceWidgetId) {
  document.getElementById("workspaceDestinationTray")?.remove();
  if (!editLayoutActive) {
    document.getElementById("workspaceDesignerPanel")?.remove();
    return;
  }

  let panel = document.getElementById("workspaceDesignerPanel");
  if (!panel) {
    panel = document.createElement("aside");
    panel.id = "workspaceDesignerPanel";
    panel.className = "workspace-designer-panel";
    document.body.appendChild(panel);
  }

  const selected = widgetId && WORKSPACE_WIDGETS[widgetId] ? widgetId : null;
  const currentSlot = selected ? slotForWidget(selected) : null;
  const allItems = movableWorkspaceWidgetIds();
  const itemOptions = allItems.map(id => `<option value="${escapeHtml(id)}" ${id === selected ? "selected" : ""}>${escapeHtml(workspaceWidgetLabel(id))}${widgetIsHidden(id) ? " · Hidden" : ""}</option>`).join("");
  const destinationRows = selected ? workspaceDestinationSlots(selected).map(slotId => {
    const isCurrent = slotId === currentSlot;
    const unavailable = workspaceSlotIsUnavailable(selected, slotId);
    const status = workspaceDestinationStatus(selected, slotId);
    return `<button type="button" class="workspace-location-choice${isCurrent ? " current" : ""}${unavailable ? " unavailable" : ""}" data-workspace-slot="${escapeHtml(slotId)}" ${unavailable ? "disabled" : ""}>
      <strong>${escapeHtml(slotLabel(slotId))}</strong>
      <span>${escapeHtml(status)}</span>
    </button>`;
  }).join("") : `<p class="workspace-empty-note">Select an item to edit placement.</p>`;

  panel.innerHTML = `
    <div class="workspace-panel-head">
      <div>
        <strong>Customize Workspace</strong>
        <span>Choose a layout, item, and placement.</span>
      </div>
      <button type="button" class="workspace-panel-close" aria-label="Close Workspace Studio">×</button>
    </div>
    <div class="workspace-panel-body">
      <div class="workspace-panel-section workspace-hero-style-section">
        <span class="workspace-panel-kicker">Page Layout</span>
        <div class="workspace-hero-style-list">
          ${Object.entries(WORKSPACE_HERO_STYLES).map(([styleId, style]) => `<button type="button" class="workspace-hero-style-choice${workspaceHeroStyle() === styleId ? " current" : ""}" data-workspace-hero-style="${escapeHtml(styleId)}" title="${escapeHtml(style.description)}">${escapeHtml(style.label)}</button>`).join("")}
        </div>
      </div>
      <div class="workspace-panel-section workspace-panel-selected">
        <span class="workspace-panel-kicker">Item</span>
        <select id="workspaceItemSelect" class="workspace-item-select">
          <option value="">Choose an item</option>
          ${itemOptions}
        </select>
        ${selected ? `<p>${escapeHtml(workspaceWidgetHint(selected))}</p>` : ""}
      </div>
      <div class="workspace-panel-section workspace-panel-selected">
        <span class="workspace-panel-kicker">Placement</span>
        <div class="workspace-location-list compact">${destinationRows}</div>
      </div>
    </div>
    <div class="workspace-panel-footer">
      <button type="button" id="workspacePanelReset">Reset</button>
      <button type="button" id="workspacePanelDone" class="primary-btn">Done</button>
    </div>
  `;

  enableWorkspacePanelDrag(panel);

  panel.querySelector(".workspace-panel-close")?.addEventListener("click", () => setEditLayoutMode(false));
  panel.querySelector("#workspacePanelDone")?.addEventListener("click", () => setEditLayoutMode(false));
  panel.querySelector("#workspacePanelReset")?.addEventListener("click", () => resetWidgetLayout());
  panel.querySelectorAll("[data-workspace-hero-style]").forEach(button => {
    button.addEventListener("click", event => {
      event.preventDefault();
      event.stopPropagation();
      setWorkspaceHeroStyle(button.dataset.workspaceHeroStyle);
      save();
      renderWorkspace();
      if (editLayoutActive) renderWorkspaceDesignerPanel(selectedWorkspaceWidgetId);
    });
  });
  panel.querySelector("#workspaceItemSelect")?.addEventListener("change", event => {
    const value = event.target.value;
    if (value) selectWorkspaceWidget(value);
    else clearWorkspaceSelection();
  });
  panel.querySelectorAll("[data-workspace-slot]").forEach(button => {
    button.addEventListener("click", event => {
      event.preventDefault();
      event.stopPropagation();
      if (!selected || button.disabled) return;
      const slotId = button.dataset.workspaceSlot;
      if (slotId !== currentSlot) {
        setWidgetSlot(selected, slotId);
        save();
        renderWorkspace();
      }
      if (editLayoutActive) selectWorkspaceWidget(selected);
    });
  });
}

function ensureEditLayoutBar() {
  document.getElementById("editLayoutBar")?.remove();
  return null;
}

function updateEditLayoutBar() {
  document.getElementById("editLayoutBar")?.remove();
}

function setEditLayoutMode(active) {
  editLayoutActive = !!active;
  if (editLayoutActive) closeAllModals();
  if (!editLayoutActive) {
    selectedWorkspaceWidgetId = null;
    document.body.classList.remove("workspace-widget-selected");
    document.querySelectorAll(".waypoint-widget").forEach(el => {
      el.classList.remove("workspace-selected-widget", "workspace-valid-widget", "workspace-muted-widget");
    });
    document.getElementById("workspaceDestinationTray")?.remove();
    document.getElementById("workspaceDesignerPanel")?.remove();
  }
  document.body.classList.toggle("edit-layout-active", editLayoutActive);
  updateEditLayoutBar();
  applyWidgetFoundation();
  ensureWorkspaceLauncher();
  if (editLayoutActive) {
    renderWorkspaceDesignerPanel();
  }
}

function toggleEditLayoutMode() {
  setEditLayoutMode(!editLayoutActive);
}

function resetWidgetLayout() {
  const templateId = data.settings.workspace?.template || "classic";
  data.settings.workspace = defaultWorkspace(templateId);
  data.settings.widgets = normalizeWidgetState({});
  syncLegacyVisibilityFromWorkspace();
  save();
  renderWorkspace();
  setEditLayoutMode(true);
}

function widgetSummaryText() {
  const rows = WIDGET_REGISTRY.map(widget => {
    const state = data.settings.widgets?.[widget.id] || {};
    const slot = slotForWidget(widget.id);
    const flags = [regionLabel(slot), slotLabel(slot), widgetVisible(widget) ? "visible" : "hidden"];
    if (state.customPlacement) flags.push("custom placement");
    if (state.customSize) flags.push("custom size");
    return `${widget.id.padEnd(10)} ${widget.label} (${flags.join(", ")})`;
  });
  return cleanList("Waypoint Widgets", rows);
}

function ensureHeaderSlotGrid() {
  const toolbar = document.querySelector(".toolbar");
  if (!toolbar) return null;

  let grid = toolbar.querySelector(".workspace-header-grid");
  if (!grid) {
    grid = document.createElement("div");
    grid.className = "workspace-header-grid";
    grid.innerHTML = HEADER_GROUPS.map(group => `
      <div class="workspace-header-group workspace-header-${group}" data-header-group="${group}">
        <div class="workspace-header-search-slot" data-header-search-slot="${group}"></div>
        ${Array.from({ length: HEADER_SLOT_COUNTS[group] }, (_, index) => `
          <div class="workspace-header-slot" data-header-slot="header-${group}-${index + 1}"></div>
        `).join("")}
      </div>
    `).join("");

    const importFile = toolbar.querySelector("#importFile");
    toolbar.insertBefore(grid, importFile || null);
  }

  return grid;
}

function moveElementToSlot(el, slotEl) {
  if (!el || !slotEl) return;
  if (el.parentElement !== slotEl) slotEl.appendChild(el);
}

function applyWorkspaceDomPlacement() {
  const workspace = canonicalizeWorkspace();
  const toolbar = document.querySelector(".toolbar");
  const hero = document.querySelector(".hero");
  const search = document.querySelector("#searchForm");
  const heroImage = document.querySelector("#heroImageCard");
  const grid = ensureHeaderSlotGrid();

  if (!toolbar || !hero || !search || !grid) return;

  const widgetElements = {
    logo: document.querySelector("#logoBtn"),
    wordmark: document.querySelector(".brand-wordmark"),
    clock: document.querySelector("#clock"),
    weather: document.querySelector("#weatherWidget")
  };

  for (const [widgetId, el] of Object.entries(widgetElements)) {
    if (!el) continue;
    const slot = workspace.slots[widgetId];
    el.classList.toggle("workspace-hidden-item", slot === "hidden");
    if (isHeaderWidgetSlot(slot)) {
      moveElementToSlot(el, grid.querySelector(`[data-header-slot="${slot}"]`));
    }
  }

  document.body.classList.toggle("workspace-search-header", workspace.slots.search === "header-search");
  document.body.classList.toggle("workspace-header-center-exclusive", workspace.slots.search === "header-search");

  search.classList.toggle("workspace-hidden-item", workspace.slots.search === "hidden");
  if (heroImage && heroImage.parentElement !== hero) hero.appendChild(heroImage);

  const heroStyle = workspaceHeroStyle(workspace);
  const barMode = workspaceUsesHeroBar(workspace);
  const bannerVisible = workspace.slots.hero !== "hidden" && data.settings.heroSize !== "hidden";

  if (workspace.slots.search === "header-search") {
    moveElementToSlot(search, grid.querySelector('.workspace-header-center .workspace-header-search-slot'));
  } else if (workspace.slots.search === "hero-search") {
    if (barMode && bannerVisible && heroImage) {
      // In bar layouts, Hero Search belongs to the banner surface itself.
      // This keeps the Hero region composed as Bar + Banner/Search instead of
      // letting Search float over the page wallpaper.
      moveElementToSlot(search, heroImage);
    } else if (search.parentElement !== hero) {
      hero.appendChild(search);
    }
    if (heroImage && heroImage.parentElement === hero && hero.firstElementChild !== heroImage) {
      hero.insertBefore(heroImage, hero.firstElementChild || null);
    }
  } else {
    if (search.parentElement !== hero) hero.insertBefore(search, hero.firstElementChild || null);
    else if (hero.firstElementChild !== search) hero.insertBefore(search, hero.firstElementChild || null);
  }
}

function applyWidgetFoundation() {
  applyWorkspaceDomPlacement();
  document.body.classList.add("widget-foundation-ready");
  for (const widget of WIDGET_REGISTRY) {
    const el = document.querySelector(widget.selector);
    if (!el) continue;
    el.classList.add("waypoint-widget");
    el.dataset.widgetId = widget.id;
    const slot = slotForWidget(widget.id);
    const visible = widgetVisible(widget);
    const movable = widget.movable && visible;
    el.dataset.widgetLabel = movable ? workspaceWidgetLabel(widget.id) : `${workspaceWidgetLabel(widget.id)} is fixed`;
    el.dataset.widgetPlace = visible ? workspaceSlotTone(slot) : "Hidden";
    el.dataset.widgetArea = regionLabel(slot).toLowerCase();
    el.dataset.widgetSlot = slot;
    el.dataset.widgetRegion = regionLabel(slot);
    el.dataset.widgetVisible = String(visible);
    el.dataset.widgetMovable = String(movable);
    el.dataset.widgetResizable = String(widget.resizable);
    el.onclick = event => {
      if (!editLayoutActive) return;
      event.preventDefault();
      event.stopPropagation();
      selectWorkspaceWidget(widget.id);
    };
  }
  document.querySelectorAll(".waypoint-widget-section").forEach(sectionEl => {
    sectionEl.classList.add("waypoint-widget");
    sectionEl.dataset.widgetVisible = "true";
    sectionEl.dataset.widgetMovable = "false";
    sectionEl.dataset.widgetResizable = "false";
    sectionEl.dataset.widgetLabel = "Bookmark section";
    sectionEl.dataset.widgetPlace = "Content";
    sectionEl.dataset.widgetRegion = "Content";
    sectionEl.dataset.widgetSlot = "content-sections";
    sectionEl.draggable = !editLayoutActive;
  });
}

// Legacy preset API retained as a compatibility wrapper.
// Presets are now Workspace Templates applied once into the active workspace.

function applyLayoutPresetDefaults(preset) {
  return applyWorkspaceTemplate(preset);
}

function ensureWorkspaceLauncher() {
  let launcher = document.getElementById("workspaceQuickLauncher");
  if (launcher) return launcher;
  launcher = document.createElement("button");
  launcher.id = "workspaceQuickLauncher";
  launcher.className = "workspace-quick-launcher";
  launcher.type = "button";
  launcher.title = "Customize Workspace";
  launcher.setAttribute("aria-label", "Customize Workspace");
  launcher.innerHTML = `<svg aria-hidden="true" viewBox="0 0 24 24" class="workspace-launcher-icon"><path d="M4.75 16.9 4 20l3.1-.75L17.82 8.53l-2.35-2.35L4.75 16.9Zm12.2-11.85 2 2 .9-.9a1.42 1.42 0 0 0 0-2l-.02-.02a1.42 1.42 0 0 0-2 0l-.88.92Z"/></svg>`;
  launcher.addEventListener("click", event => {
    event.preventDefault();
    event.stopPropagation();
    setEditLayoutMode(true);
  });
  document.body.appendChild(launcher);
  return launcher;
}
