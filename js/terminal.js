// Waypoint terminal ownership. Loaded as an ordered classic script.

let terminalBuffer = [];

function updateLogoPrompt() {
  const text = `${displayUserName()}@waypoint:~$`;
  setText("logoPrompt", text);
  const commandPrompt = $("commandPromptLabel");
  if (commandPrompt) commandPrompt.innerHTML = terminalPromptMarkup();
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

function buildFastfetchHtml() {
  try {
    const theme = getTheme();
    const modified = data.settings.lastModified ? formatRelativeDate(new Date(data.settings.lastModified)) : "Never";
    const workspace = canonicalizeWorkspace();
    const pageHeader = WORKSPACE_HERO_STYLES[workspaceHeroStyle(workspace)]?.label || "Standard Header";
    const workspaceLabel = workspace.modified ? "Custom" : (WORKSPACE_TEMPLATES[workspace.template || "classic"]?.label || "Default");
    const weather = data.settings.showWeather === false ? "Hidden" : (data.settings.weatherLocation ? `${data.settings.weatherLocation} (${labelWeatherUnit(data.settings.weatherUnit)})` : "Not set");
    const rows = [
      ["Version", appMeta.version || "unknown"],
      ["Branch", appMeta.branch || "unknown"],
      ["Runtime", runtimeLabel()],
      ["Theme", theme.label],
      ["Workspace", workspaceLabel],
      ["Page Header", pageHeader],
      ["Search", labelSearch(data.settings.searchEngine)],
      ["Bookmarks", countBookmarks()],
      ["Sections", data.sections.length],
      ["Layout", (data.settings.bookmarkLayout || "list") === "list" ? "Compact Cards" : "Grid Cards"],
      ["Weather", weather],
      ["Modified", modified]
    ];
    const title = `<div class="fetch-heading"><span class="fetch-user">${escapeHtml(displayUserName())}</span><span class="fetch-at">@</span><span class="fetch-host">waypoint</span></div>`;
    const rowHtml = rows.map(([key, value]) => `<div class="fetch-row-line"><span class="fetch-key">${escapeHtml(key)}</span><span class="fetch-value">${escapeHtml(value)}</span></div>`).join("");
    return `<div class="fetch-output"><div class="fetch-logo"><img src="img/waypoint-logo.svg" alt="" aria-hidden="true"></div><div class="fetch-info">${title}<div class="fetch-rule"></div><div class="fetch-rows">${rowHtml}</div></div></div>`;
  } catch (error) {
    console.error("fetch command failed", error);
    return commandResult("fetch: unable to build system summary", "terminal-error");
  }
}

function renderTerminal() {
  updateLogoPrompt();
  renderTerminalBuffer();
}

function terminalPrompt() {
  return `${displayUserName()}@waypoint:~$`;
}

function terminalPromptMarkup() {
  return `<span class="prompt-user">${escapeHtml(displayUserName())}</span><span class="prompt-at">@</span><span class="prompt-host">waypoint</span><span class="prompt-path">:~</span><span class="prompt-symbol">$</span>`;
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
  return `<div class="terminal-echo"><span class="terminal-echo-prompt">${terminalPromptMarkup()}</span> <span class="terminal-echo-command">${escapeHtml(command)}</span></div>`;
}

function labelShortcut(value) { return ({ altT: "Alt+T", ctrlShiftSpace: "Ctrl+Shift+Space", none: "Disabled" })[value] || value; }

function executeButtonCommand(command) {
  if (command === "fetch") runCommand("fetch");
  if (command === "addSection") { openSectionModal(); }
  if (command === "toggleBanner") { data.settings.heroStyle = data.settings.heroStyle === "hidden" ? "auto" : "hidden"; save(); renderAppearance(); }
  if (command === "export") exportJson();
  if (command === "import") $("importFile")?.click();
  if (command === "help") runCommand("help");
}

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
    `Workspace template: ${s.workspace?.template || "classic"}${s.workspace?.modified ? " (modified)" : ""}`,
    `Bookmark layout: ${s.bookmarkLayout === "grid" ? "Grid Cards" : "Compact Cards"}`,
    `Interface font: ${s.fontFamily === "system" ? "System" : "Waypoint"}`,
    `Search engine: ${labelSearch(s.searchEngine)}`,
    `Weather: ${s.showWeather === false ? "Hidden" : "Shown"}`,
    `Clock: ${s.showClock === false ? "Hidden" : "Shown"}`,
    `Grid section titles: ${s.showSectionTitles === false ? "Hidden" : "Shown"}`,
    `Sections: ${data.sections.length}`,
    `Bookmarks: ${countBookmarks()}`
  ].join("\n");
}

function buildHelpText(topic = "") {
  const requestedTopic = String(topic || "").trim().toLowerCase();
  const t = requestedTopic === "preset" ? "template" : requestedTopic;
  const pages = {
    theme: `theme\n\nChange or view the current color theme.\n\nSyntax:\n  theme\n  theme <name>\n\nExamples:\n  theme nord\n  theme tokyo-night\n\nSee also:\n  ls themes`,
    layout: `layout\n\nChange or view the bookmark layout.\n\nLayouts:\n  compact — Compact Cards\n  grid — Grid Cards\n\nSyntax:\n  layout\n  layout compact\n  layout grid\n\nWorkspace templates use the template command.\n\nSee also:\n  help template\n  ls layouts`,
    template: `template\n\nChange or view the workspace template.\n\nSyntax:\n  template\n  template <name>\n\nExamples:\n  template classic\n  template minimal\n\nThe preset command remains as a compatibility alias.\n\nSee also:\n  ls layouts`,
    visibility: `show / hide\n\nShow or hide interface elements.\n\nSyntax:\n  show <element>\n  hide <element>\n\nElements:\n  logo\n  title\n  clock\n  weather\n  search\n  titles (Grid Card section titles)\n  banner\n\nThe sections name remains as an alias for titles.`,
    search: `engine\n\nChange or view the search engine.\n\nSyntax:\n  engine\n  engine <name>\n\nExamples:\n  engine google\n  engine duckduckgo\n\nSee also:\n  ls search`,
    weather: `weather\n\nSet, view, or refresh weather.\n\nSyntax:\n  weather\n  weather <location>\n  weather refresh\n\nExamples:\n  weather "New York, NY"\n  weather refresh`,
    font: `font\n\nChange or view the interface font.\n\nSyntax:\n  font\n  font <name>\n\nExamples:\n  font waypoint\n  font system\n\nThe terminal always uses JetBrains Mono.\n\nSee also:\n  ls fonts`,
    settings: `settings\n\nOpen Settings or a specific settings page.\n\nSyntax:\n  settings\n  settings <page>\n\nPages:\n  appearance\n  layout\n  bookmarks\n  weather\n  search\n  backup\n\nCompatibility aliases:\n  banner, text → appearance\n  advanced → search`,
    add: `add\n\nAdd a section or bookmark.\n\nSyntax:\n  add section <name>\n  add link <section> <name> <url>\n\nExamples:\n  add section Media\n  add link "Media" "Jellyfin" https://jellyfin.org`,
    remove: `remove / delete\n\nDelete a section or bookmark after confirming in a Waypoint dialog.\n\nSyntax:\n  remove section <name>\n  delete section <name>\n  remove link "<section>" "<bookmark>"\n  delete link "<section>" "<bookmark>"`,
    rename: `rename\n\nRename a section.\n\nSyntax:\n  rename section <old> <new>\n\nExample:\n  rename section "Media" "Streaming"`,
    colors: `colors\n\nChange interface colors.\n\nSyntax:\n  accent <hex>\n  surface <hex>\n  text <hex>\n  titlecolor <hex>\n\nExamples:\n  accent #00d084\n  surface #09111a`,
    transparency: `transparency\n\nSection cards and the terminal use 60% opacity by default. Override their backgrounds through Custom CSS in Settings > Appearance.`,
    banner: `banner\n\nView or change the page banner.\n\nSyntax:\n  banner\n  banner auto|desktop|atmosphere|custom\n  banner size hidden|small|medium|large`,
    wallpaper: `wallpaper\n\nChange the page background.\n\nSyntax:\n  wallpaper theme|gradient|custom\n\nCustom images are managed in Settings > Appearance.`,
    css: buildCssManualText(),
    widgets: `widgets\n\nList registered workspace widgets and their current placement.\n\nSyntax:\n  widgets\n  ls widgets\n  workspace`,
    ls: `ls\n\nList available options or current configuration.\n\nSyntax:\n  ls\n  ls <category>\n\nCategories:\n  commands\n  themes\n  layouts\n  fonts\n  visibility\n  search\n  widgets\n  config`,
    reset: `reset\n\nReset a category of settings.\n\nSyntax:\n  reset appearance\n  reset layout\n  reset bookmarks\n  reset weather\n  reset search\n  reset all\n\nCompatibility aliases remain available for older configurations.`
  };
  if (t) return pages[t] || `No help topic for '${t}'.\n\nType help to see commands.`;
  return cleanList("Available Commands", [
    "fetch            Show Waypoint system information",
    "help             Show help or command help",
    "ls               List options and configuration",
    "settings         Open Settings",
    "welcome          Open the Welcome Guide",
    "theme            Manage themes",
    "template         Apply workspace templates",
    "layout           Manage bookmark layout",
    "font             Manage fonts",
    "banner           Manage the page banner",
    "wallpaper        Manage the page background",
    "engine           Manage search engine",
    "weather          Configure weather",
    "show / hide      Show or hide UI elements",
    "accent           Set accent color",
    "surface          Set surface color",
    "text             Set global text color",
    "widgets          List registered UI widgets",
    "workspace        Show workspace slot assignments",
    "add              Add sections or bookmarks",
    "rename           Rename sections",
    "remove / delete  Delete sections or bookmarks",
    "export           Export configuration",
    "import           Import configuration",
    "reset            Reset settings",
    "css              Show Custom CSS examples",
    "clear            Clear terminal",
    "exit             Close terminal"
  ]);
}

function buildCssManualText() {
  return `css\n\nCustom CSS is applied last, so it can override Waypoint styling.\n\nExamples:\n  Hide the Waypoint name:\n  .brand-wordmark { display: none !important; }\n\n  Make bookmark cards rounder:\n  .link { border-radius: 18px !important; }\n\n  Change section card transparency:\n  .section { background: rgba(5, 9, 18, .8) !important; }\n  :root { --section-card-opacity-percent: 80%; }\n\n  Change terminal transparency:\n  :root { --terminal-opacity: .8; }\n\n  Hide section headers:\n  .section-header { display: none !important; }\n\n  Make the search bar wider:\n  .search { width: min(920px, calc(100% - 80px)) !important; }\n\nNotes:\n  Section cards and the terminal use 60% opacity by default.\n  .brand-wordmark controls the Waypoint title.\n  .link controls bookmark tiles.\n  .section controls section cards.\n  !important makes your rule win over built-in styling.`;
}

function listCommand(category = "") {
  const c = String(category || "").trim().toLowerCase();
  const maps = {
    "": cleanList("Available Lists", ["commands", "themes", "layouts", "fonts", "visibility", "search", "widgets", "workspace", "config"]),
    commands: buildHelpText(),
    themes: cleanList("Available Themes", ["catppuccin", "daylight", "nord", "gruvbox", "graphite", "tokyo-night"]),
    layouts: `Bookmark Layouts\n\n  compact — Compact Cards\n  grid — Grid Cards\n\nWorkspace Templates\n\n  classic\n  dashboard\n  minimal`,
    fonts: cleanList("Available Interface Fonts", ["system", "waypoint"]),
    visibility: cleanList("Visibility Elements", ["logo", "title", "clock", "weather", "search", "titles", "banner"]),
    search: cleanList("Available Search Engines", ["google", "duckduckgo", "brave", "bing", "custom"]),
    widgets: widgetSummaryText(),
    workspace: workspaceSummaryText(),
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
  const map = { system: "system", waypoint: "inter", inter: "inter" };
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
  if (head === "man") {
    if (arg) return done(terminalPre(buildHelpText(arg), "terminal-help"));
    return done(terminalPre(buildHelpText(), "terminal-help"));
  }
  if (head === "ls") return done(terminalPre(listCommand(arg), "terminal-help"));
  if (head === "fetch") {
    done(buildFastfetchHtml());
    return;
  }
  if (head === "widgets") return done(terminalPre(widgetSummaryText(), "terminal-help"));
  if (head === "workspace") return done(terminalPre(workspaceSummaryText(), "terminal-help"));
  if (head === "settings") {
    const requestedPage = arg ? arg.replace(/\s+/g, "") : "appearance";
    const validPages = new Set(Object.keys(SETTINGS_PAGE_ALIASES));
    if (arg && !validPages.has(requestedPage)) return textOut(buildHelpText("settings"), "terminal-warning");
    const page = normalizeSettingsPage(requestedPage);
    openSettingsPage(page);
    return textOut(`Opened Settings > ${page[0].toUpperCase()}${page.slice(1)}.`, "terminal-success-text");
  }
  if (["show", "hide"].includes(head)) {
    const widgetMap = {
      logo: "logo", terminal: "logo", button: "logo",
      title: "wordmark", wordmark: "wordmark",
      clock: "clock", weather: "weather", search: "search",
      banner: "hero"
    };
    const visible = head === "show";
    if (["sections", "titles"].includes(arg)) {
      data.settings.workspace.display.showSectionTitles = visible;
      data.settings.workspace.modified = true;
      syncLegacyVisibilityFromWorkspace();
      save(); renderWorkspace();
      return done(buildStatusLines(`${visible ? "Showing" : "Hiding"}: Grid Card section titles`));
    }
    const widgetId = widgetMap[arg];
    if (!widgetId) return textOut(buildHelpText("visibility"), "terminal-warning");
    if (!setWidgetVisible(widgetId, visible)) return textOut(`Cannot ${head} ${arg}.`, "terminal-warning");
    save(); renderWorkspace();
    return done(buildStatusLines(`${visible ? "Showing" : "Hiding"}: ${arg}`));
  }
  if (["template", "preset", "workspace"].includes(head)) {
    if (head === "workspace" && !arg) return done(terminalPre(workspaceSummaryText(), "terminal-help"));
    if (!arg) return textOut(`Current template: ${data.settings.workspace?.template || "classic"}${data.settings.workspace?.modified ? " (modified)" : ""}`);
    if (!["classic", "minimal", "dashboard"].includes(arg)) return textOut(buildHelpText("template"), "terminal-warning");
    applyWorkspaceTemplate(arg); save(); renderWorkspace();
    return done(buildStatusLines(`Applying workspace template: ${arg}`));
  }
  if (head === "font") {
    if (!arg) return textOut(`Current interface font: ${data.settings.fontFamily === "system" ? "System" : "Waypoint"}`);
    const font = normalizeFontName(commandRaw.trim().replace(/^font\s*/i, "").trim());
    if (!font) return textOut(buildHelpText("font"), "terminal-warning");
    data.settings.fontFamily = font; save(); renderAppearance();
    return done(buildStatusLines(`Setting interface font: ${font === "system" ? "System" : "Waypoint"}`));
  }
  if (head === "theme") {
    if (!arg) return textOut(`Current theme: ${getTheme().label}`);
    const map = { catppuccin: "catppuccin", daylight: "daylight", light: "daylight", nord: "nord", gruvbox: "gruvbox", graphite: "graphite", tokyo: "tokyoNight", "tokyo-night": "tokyoNight", tokyonight: "tokyoNight" };
    if (!map[arg]) return textOut(buildHelpText("theme"), "terminal-warning");
    data.settings.theme = map[arg]; save(); renderAppearance();
    return done(buildStatusLines(`Applying theme: ${getTheme().label}`));
  }
  if (head === "layout") {
    const map = { list: "list", compact: "list", row: "list", rows: "list", grid: "grid", cards: "grid" };
    if (!arg) return textOut(`Bookmark layout: ${(data.settings.bookmarkLayout || "list") === "list" ? "Compact Cards" : "Grid Cards"}`);
    if (!map[arg]) return textOut(buildHelpText("layout"), "terminal-warning");
    data.settings.bookmarkLayout = map[arg]; save(); renderBookmarkSettings();
    return done(buildStatusLines(`Setting bookmark layout: ${data.settings.bookmarkLayout === "list" ? "Compact Cards" : "Grid Cards"}`));
  }
  if (head === "accent" || head === "surface" || head === "text" || head === "titlecolor") {
    const color = rest[0] || "";
    if (!/^#[0-9a-f]{6}$/i.test(color)) return textOut(buildHelpText("colors"), "terminal-warning");
    if (head === "accent") { data.settings.customAccent = color; data.settings.useCustomAppearance = true; data.settings.useCustomColors = true; data.settings.useCustomTextColors = true; }
    if (head === "surface") { data.settings.customPanel = color; data.settings.useCustomAppearance = true; data.settings.useCustomColors = true; data.settings.useCustomTextColors = true; }
    if (head === "text") data.settings.customText = color;
    if (["text", "titlecolor"].includes(head)) { data.settings.useCustomAppearance = true; data.settings.useCustomColors = true; data.settings.useCustomTextColors = true; }
    if (head === "titlecolor") data.settings.sectionTitleColor = color;
    save(); renderAppearance();
    return done(buildStatusLines(`Setting ${head} color: ${color}`));
  }
  if (head === "transparency" || ((head === "section" || head === "window" || head === "terminal") && rest[0] === "transparency")) {
    return textOut(buildHelpText("transparency"), "terminal-warning");
  }
  if (head === "name") {
    const nextName = commandRaw.trim().replace(/^name\s*/i, "").trim();
    if (!nextName) return textOut("Usage: name <username>", "terminal-warning");
    data.settings.userName = sanitizeUserName(nextName); save(); renderAppearance();
    return textOut(`Name set to ${displayUserName()}.`, "terminal-success-text");
  }
  if (head === "searchengine" || head === "engine") {
    const map = { google: "google", ddg: "duckduckgo", duckduckgo: "duckduckgo", brave: "brave", bing: "bing", custom: "custom" };
    if (!arg) return textOut(`Current search engine: ${labelSearch(data.settings.searchEngine)}`);
    if (!map[arg]) return textOut(buildHelpText("search"), "terminal-warning");
    data.settings.searchEngine = map[arg]; save(); applySearchEngine(); syncControls(); renderTerminal(); emitRendered();
    return done(buildStatusLines(`Setting search engine: ${labelSearch(data.settings.searchEngine)}`));
  }
  if (head === "customsearch") {
    const url = commandRaw.trim().replace(/^customsearch\s*/i, "").trim();
    if (!url) return textOut("Usage: customsearch https://example.com/search?q=%s", "terminal-warning");
    data.settings.customSearchUrl = url.slice(0, 240); data.settings.searchEngine = "custom"; save(); applySearchEngine(); syncControls(); renderTerminal(); emitRendered();
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
    if (!arg) return textOut(`Banner: ${labelBannerStyle(data.settings.heroStyle)}\nSize: ${labelHeroSize(data.settings.heroSize)}`);
    if (rest[0] === "size") {
      const size = rest[1];
      if (!sizeMap[size]) return textOut("Usage: banner size hidden|small|medium|large", "terminal-warning");
      setBannerSize(sizeMap[size]);
      return done(buildStatusLines(`Setting banner size: ${labelHeroSize(data.settings.heroSize)}`));
    }
    if (sizeMap[arg]) {
      setBannerSize(sizeMap[arg]);
      return done(buildStatusLines(`Setting banner size: ${labelHeroSize(data.settings.heroSize)}`));
    }
    if (!map[arg]) return textOut(buildHelpText("banner"), "terminal-warning");
    data.settings.heroStyle = map[arg]; save(); renderAppearance();
    return done(buildStatusLines(`Setting banner: ${labelBannerStyle(data.settings.heroStyle)}`));
  }
  if (head === "wallpaper") {
    const map = { theme: "wallpaper", wallpaper: "wallpaper", default: "wallpaper", gradient: "gradient", custom: "custom" };
    if (!arg) return textOut(`Wallpaper: ${labelBackground(data.settings.backgroundMode)}`);
    if (!map[arg]) return textOut(buildHelpText("wallpaper"), "terminal-warning");
    data.settings.backgroundMode = map[arg]; save(); renderAppearance();
    return done(buildStatusLines(`Setting wallpaper: ${labelBackground(data.settings.backgroundMode)}`));
  }
  if (head === "add") {
    if (arg.startsWith("section")) {
      const sectionName = commandRaw.trim().replace(/^add\s+section\s*/i, "").trim();
      if (!sectionName) return textOut(buildHelpText("add"), "terminal-warning");
      data.sections.push({ name: sectionName, links: [] }); save(); renderAddedSection();
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
  if (["delete", "remove"].includes(head) && (arg.startsWith("section") || arg.startsWith("link"))) {
    const reportDeletion = (message, deleted) => pushTerminal(terminalBlock(commandResult(
      message.replace(/<[^>]+>/g, ""),
      deleted ? "terminal-success-text" : "terminal-warning"
    )));
    if (arg.startsWith("section")) {
      const sectionName = commandRaw.trim().replace(/^(delete|remove)\s+section\s*/i, "").trim();
      if (!sectionName) return textOut(buildHelpText("remove"), "terminal-warning");
      return textOut(deleteSectionByCommand(sectionName, reportDeletion).replace(/<[^>]+>/g, ""), "terminal-warning");
    }
    const parsed = parseDeleteLinkCommand(commandRaw);
    if (!parsed) return textOut(buildHelpText("remove"), "terminal-warning");
    return textOut(deleteLinkByCommand(parsed.sectionName, parsed.linkName, reportDeletion).replace(/<[^>]+>/g, ""), "terminal-warning");
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
  if (head === "export") {
    if (arg && !["workspace", "bookmarks", "settings", "complete"].includes(arg)) {
      return textOut("Usage: export [complete|workspace|bookmarks|settings]", "terminal-warning");
    }
    const type = arg || "complete";
    exportJson(type);
    return textOut(`Export started: ${type}.`, "terminal-success-text");
  }
  if (head === "reset") {
    const target = arg || "";
    if (!target) return textOut(buildHelpText("reset"), "terminal-warning");
    if (!resetCategory(target)) return textOut(buildHelpText("reset"), "terminal-warning");
    return done(buildStatusLines(`Resetting ${target}`));
  }
  if (head === "css") return done(terminalPre(buildHelpText("css"), "terminal-help"));
  if (head === "search") { closeAllModals(); focusSearch(); return; }
  return textOut(`${head}: command not found\n\nTry: help`, "terminal-error");
}
