// Waypoint bookmarks ownership. Loaded as an ordered classic script.

let activeSection = 0;

let editingLink = null;

let draggedSectionIndex = null;

let draggedLink = null;

let activeLinkDropTarget = null;

let pendingLinkIcon = null;

let renamingSectionIndex = null;

function countBookmarks() { return data.sections.reduce((sum, section) => sum + section.links.length, 0); }

const SECTION_ICONS = {
  code: '<path d="m8 9-3 3 3 3M16 9l3 3-3 3M14 5l-4 14"/>',
  media: '<path d="M8 5v14l11-7z"/>',
  music: '<path d="M9 18V5l10-2v13M9 9l10-2"/><circle cx="6" cy="18" r="3"/><circle cx="16" cy="16" r="3"/>',
  social: '<path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/>',
  work: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V4h8v3M3 12h18"/>',
  reading: '<path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H11v18H7.5A3.5 3.5 0 0 0 4 23zM20 5.5A3.5 3.5 0 0 0 16.5 2H13v18h3.5A3.5 3.5 0 0 1 20 23z"/>',
  shopping: '<path d="M6 8h12l1 13H5zM9 8a3 3 0 0 1 6 0"/>',
  games: '<path d="M8 8h8a6 6 0 0 1 5.5 8.4L20 20l-4-3H8l-4 3-1.5-3.6A6 6 0 0 1 8 8zM7 12v4M5 14h4M16 13h.01M19 15h.01"/>',
  home: '<path d="m3 11 9-8 9 8v10h-6v-6H9v6H3z"/>',
  tools: '<path d="M14.7 6.3a4 4 0 0 0-5-5L12 3.6 8.4 7.2 6.1 4.9a4 4 0 0 0 5 5L4 17l3 3 7.2-7.1a4 4 0 0 0 5-5L17 10.2l-3.6-3.6z"/>',
  web: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/>',
  server: '<rect x="3" y="3" width="18" height="7" rx="2"/><rect x="3" y="14" width="18" height="7" rx="2"/><path d="M7 6.5h.01M7 17.5h.01M11 6.5h7M11 17.5h7"/>',
  imageboard: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m4 17 5-4 3 3 3-2 5 4"/>',
  cloud: '<path d="M7 18h11a4 4 0 0 0 .7-7.9A7 7 0 0 0 5.4 8.7 4.5 4.5 0 0 0 7 18z"/>',
  finance: '<path d="M12 2v20M17 6.5C16 5.5 14.5 5 12.5 5 9.8 5 8 6.3 8 8.2c0 4.3 9 2.2 9 6.4 0 2-1.9 3.4-4.7 3.4-2.2 0-4-.7-5.3-2"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/>',
  documents: '<path d="M6 2h8l4 4v16H6zM14 2v5h5M9 12h6M9 16h6"/>',
  downloads: '<path d="M12 3v12M7 10l5 5 5-5M4 21h16"/>',
  photos: '<path d="M4 7h4l2-3h4l2 3h4v13H4z"/><circle cx="12" cy="13" r="4"/>',
  folder: '<path d="M3 6h7l2 2h9v11H3z"/>'
};

const SECTION_ICON_RULES = [
    [/(^|\b)(4chan|imageboard|chan|forum|boards?)(\b|$)/, "imageboard"],
    [/(^|\b)(web|internet|browser|online|sites?)(\b|$)/, "web"],
    [/(^|\b)(server|servers|hosting|hosted|homelab|nas|infra|infrastructure)(\b|$)/, "server"],
    [/(^|\b)(cloud|aws|azure|gcp|digitalocean)(\b|$)/, "cloud"],
    [/(dev|code|program|git|tech)/, "code"],
    [/(media|video|movie|tv|stream)/, "media"],
    [/(music|audio|radio|podcast)/, "music"],
    [/(social|community|chat|message|discord|reddit)/, "social"],
    [/(work|office|business|project)/, "work"],
    [/(read|news|book|learn|research)/, "reading"],
    [/(shop|store|buy)/, "shopping"],
    [/(game|play)/, "games"],
    [/(home|local|self.host)/, "home"],
    [/(tool|util|system|admin|settings)/, "tools"],
    [/(money|bank|finance|crypto|stock|invest|budget)/, "finance"],
    [/(mail|email|inbox)/, "mail"],
    [/(docs?|document|files?|drive|notes?)/, "documents"],
    [/(download|torrent|transfer)/, "downloads"],
    [/(photo|image|gallery|camera)/, "photos"]
];

function inferSectionIcon(text) {
  const value = String(text || "").toLowerCase();
  return SECTION_ICON_RULES.find(([pattern]) => pattern.test(value))?.[1] || "";
}

function sectionGeneratedIcon(title, links = []) {
  const contentSignals = links.map(link => `${link.name || ""} ${link.url || ""}`).join(" ");
  const icon = inferSectionIcon(title) || inferSectionIcon(contentSignals) || "folder";
  return `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${SECTION_ICONS[icon]}</svg>`;
}

function createLinkElement(sectionIndex, linkIndex, keyMap = navigationKeyMap()) {
  const link = data.sections[sectionIndex]?.links[linkIndex];
  if (!link) return null;
  const row = document.createElement("div");
  row.className = "link";
  row.draggable = true;
  row.dataset.sectionIndex = sectionIndex;
  row.dataset.linkIndex = linkIndex;
  const iconSource = isWaypointUrl(link.url) ? waypointIcon(link.url) : link.icon || favicon(link.url);
  const internalClass = isWaypointUrl(link.url) ? " internal-link" : "";
  const displayName = isWaypointUrl(link.url) ? cleanInternalLinkName(link.name, link.url) : link.name;
  const hasImageSource = /^data:|^https?:/i.test(iconSource);
  row.className += internalClass;
  const fallbackIcon = iconSource && !/^data:|^https?:/i.test(iconSource) ? iconSource : "";
  row.innerHTML = `
    <span class="link-icon-fallback" aria-hidden="true">${escapeHtml(fallbackIcon)}</span>
    <img${hasImageSource ? ` src="${escapeHtml(iconSource)}"` : ""} alt="" aria-hidden="true"${hasImageSource ? "" : " hidden"}>
    <kbd class="keyboard-hint link-key-hint" aria-hidden="true">${escapeHtml((keyMap[sectionIndex]?.linkKeys[linkIndex] || "").toUpperCase())}</kbd>
    <a href="${escapeHtml(link.url)}" tabindex="-1">${escapeHtml(displayName)}</a>
    <span class="edit-link" title="Edit link" aria-label="Edit link">✎</span>
    <span class="delete-link" title="Delete link" aria-label="Delete link">×</span>
  `;
  const iconImg = row.querySelector("img");
  const fallbackEl = row.querySelector(".link-icon-fallback");
  if (iconImg && !iconImg.hidden) {
    iconImg.addEventListener("error", () => {
      iconImg.hidden = true;
      if (fallbackEl && !fallbackEl.textContent.trim()) fallbackEl.textContent = "◆";
    }, { once: true });
  }
  row.addEventListener("click", event => {
    if (event.target.closest(".delete-link") || event.target.closest(".edit-link") || event.defaultPrevented) return;
    clearSectionFocus();
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
    deleteLink(sectionIndex, linkIndex);
  });
  row.addEventListener("dblclick", event => {
    event.preventDefault();
    openLinkModal(sectionIndex, linkIndex);
  });
  setupLinkDrag(row, sectionIndex, linkIndex);
  return row;
}

function createSectionElement(sectionIndex, keyMap = navigationKeyMap()) {
  const section = data.sections[sectionIndex];
  if (!section) return null;
  const sectionEl = document.createElement("article");
  sectionEl.className = `section waypoint-widget-section${section.links.length ? "" : " empty-section"}`;
  sectionEl.dataset.widgetId = `section-${sectionIndex}`;
  sectionEl.dataset.widgetLabel = `Bookmark Section: ${section.name || `Section ${sectionIndex + 1}`}`;
  sectionEl.dataset.widgetArea = "content";
  sectionEl.draggable = true;
  sectionEl.dataset.sectionIndex = sectionIndex;
  sectionEl.innerHTML = `
    <div class="section-header">
      <span class="section-generated-icon" aria-hidden="true">${sectionGeneratedIcon(section.name, section.links)}</span>
      <span class="section-name">${escapeHtml(section.name)}</span>
    </div>
    <div class="section-actions">
      <kbd class="keyboard-hint section-key-hint" aria-hidden="true">${escapeHtml((keyMap[sectionIndex]?.key || "").toUpperCase())}</kbd>
      <button class="section-action add-link-btn" title="Add link" type="button">+</button>
      <button class="section-action section-rename" title="Rename section" type="button" aria-label="Rename section">✎</button>
      <button class="section-action section-delete" title="Delete section" type="button">×</button>
      <button class="section-action section-focus-close" title="Close section" type="button" aria-label="Close focused section">×</button>
    </div>
    <div class="category-summary">${section.links.length} ${section.links.length === 1 ? "bookmark" : "bookmarks"}</div>
    <div class="links" data-section-index="${sectionIndex}"></div>
  `;
  sectionEl.querySelector(".add-link-btn").addEventListener("click", () => openLinkModal(sectionIndex));
  sectionEl.querySelector(".section-rename").addEventListener("click", () => openRenameSectionModal(sectionIndex));
  sectionEl.querySelector(".section-delete").addEventListener("click", () => deleteSection(sectionIndex));
  sectionEl.querySelector(".section-focus-close").addEventListener("click", event => {
    event.stopPropagation();
    clearKeyboardNavigation();
    clearSectionFocus();
  });
  sectionEl.addEventListener("click", event => {
    if (event.target.closest(".link, .section-actions")) return;
    event.stopPropagation();
    focusBookmarkSection(sectionIndex);
  });
  setupSectionDrag(sectionEl, sectionIndex);
  const linksContainer = sectionEl.querySelector(".links");
  setupLinkDropZone(linksContainer, sectionIndex);
  section.links.forEach((link, linkIndex) => {
    const row = createLinkElement(sectionIndex, linkIndex, keyMap);
    if (row) linksContainer.appendChild(row);
  });
  return sectionEl;
}

function createAddSectionTile() {
  const addTile = document.createElement("button");
  addTile.className = "section-add-tile";
  addTile.type = "button";
  addTile.title = "Add Section";
  addTile.setAttribute("aria-label", "Add Section");
  addTile.innerHTML = `<span aria-hidden="true">+</span>`;
  addTile.addEventListener("click", () => openSectionModal());
  return addTile;
}

function renderSections() {
  return measureWaypointRender("waypoint:bookmarks:all", () => {
    const container = $("sections");
    if (!container) return;
    container.innerHTML = "";
    const keyMap = navigationKeyMap();
    data.sections.forEach((section, sectionIndex) => {
      const sectionEl = createSectionElement(sectionIndex, keyMap);
      if (sectionEl) container.appendChild(sectionEl);
    });
    container.appendChild(createAddSectionTile());
  });
}

function refreshSectionNavigationHints(sectionIndex = null) {
  const keyMap = navigationKeyMap();
  const sections = Number.isInteger(sectionIndex)
    ? [document.querySelector(`.section[data-section-index="${sectionIndex}"]`)].filter(Boolean)
    : [...document.querySelectorAll(".section[data-section-index]")];
  sections.forEach(sectionEl => {
    const index = Number(sectionEl.dataset.sectionIndex);
    const sectionHint = sectionEl.querySelector(".section-key-hint");
    if (sectionHint) sectionHint.textContent = (keyMap[index]?.key || "").toUpperCase();
    sectionEl.querySelectorAll(".link").forEach(row => {
      const linkIndex = Number(row.dataset.linkIndex);
      const linkHint = row.querySelector(".link-key-hint");
      if (linkHint) linkHint.textContent = (keyMap[index]?.linkKeys[linkIndex] || "").toUpperCase();
    });
  });
}

function refreshSectionMetadata(sectionIndex) {
  const section = data.sections[sectionIndex];
  const sectionEl = document.querySelector(`.section[data-section-index="${sectionIndex}"]`);
  if (!section || !sectionEl) return false;
  sectionEl.classList.toggle("empty-section", section.links.length === 0);
  sectionEl.dataset.widgetLabel = `Bookmark Section: ${section.name || `Section ${sectionIndex + 1}`}`;
  const title = sectionEl.querySelector(".section-name");
  if (title) title.textContent = section.name;
  const icon = sectionEl.querySelector(".section-generated-icon");
  if (icon) icon.innerHTML = sectionGeneratedIcon(section.name, section.links);
  const summary = sectionEl.querySelector(".category-summary");
  if (summary) summary.textContent = `${section.links.length} ${section.links.length === 1 ? "bookmark" : "bookmarks"}`;
  return true;
}

function renderSectionMetadata(sectionIndex, { refreshAllHints = false } = {}) {
  return measureWaypointRender("waypoint:bookmarks:section", () => {
    if (!refreshSectionMetadata(sectionIndex)) {
      renderSection(sectionIndex);
      return;
    }
    refreshSectionNavigationHints(refreshAllHints ? null : sectionIndex);
    syncSectionFocusDom();
    emitRendered();
  });
}

function renderSection(sectionIndex) {
  return measureWaypointRender("waypoint:bookmarks:section", () => {
    const current = document.querySelector(`.section[data-section-index="${sectionIndex}"]`);
    const replacement = createSectionElement(sectionIndex);
    if (!current || !replacement) {
      renderSections();
      syncSectionFocusDom();
      emitRendered();
      return;
    }
    current.replaceWith(replacement);
    syncSectionFocusDom();
    emitRendered();
  });
}

function renderBookmark(sectionIndex, linkIndex) {
  return measureWaypointRender("waypoint:bookmarks:bookmark", () => {
    const sectionEl = document.querySelector(`.section[data-section-index="${sectionIndex}"]`);
    const links = sectionEl?.querySelector(".links");
    const replacement = createLinkElement(sectionIndex, linkIndex);
    if (!sectionEl || !links || !replacement) {
      renderSection(sectionIndex);
      return;
    }
    const current = links.querySelector(`.link[data-link-index="${linkIndex}"]`);
    if (current) current.replaceWith(replacement);
    else if (linkIndex === data.sections[sectionIndex].links.length - 1) links.appendChild(replacement);
    else {
      renderSection(sectionIndex);
      return;
    }
    refreshSectionMetadata(sectionIndex);
    refreshSectionNavigationHints(sectionIndex);
    syncSectionFocusDom();
    emitRendered();
  });
}

function renderAddedSection(sectionIndex) {
  return measureWaypointRender("waypoint:bookmarks:section", () => {
    const container = $("sections");
    const addTile = container?.querySelector(".section-add-tile");
    const sectionEl = createSectionElement(sectionIndex);
    if (!container || !addTile || !sectionEl) {
      renderSections();
      emitRendered();
      return;
    }
    container.insertBefore(sectionEl, addTile);
    refreshSectionNavigationHints();
    syncSectionFocusDom();
    emitRendered();
  });
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
      if (event.target.closest(".link")) return;
      clearLinkDropMarkers();
      sectionEl.querySelector(".links")?.classList.add("drag-over");
      return;
    }
    if (draggedSectionIndex === null && hasDroppedUrl(event)) {
      event.preventDefault();
      event.stopPropagation();
      clearLinkDropMarkers();
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
      if (event.target.closest(".link")) return;
      sectionEl.querySelector(".links")?.classList.remove("drag-over");
      moveLink(draggedLink.sectionIndex, draggedLink.linkIndex, sectionIndex, data.sections[sectionIndex].links.length);
      return;
    }
    if (draggedSectionIndex === null && handleExternalBookmarkDrop(sectionIndex, event.dataTransfer)) {
      event.preventDefault();
      event.stopPropagation();
      sectionEl.querySelector(".links")?.classList.remove("drag-over");
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
    renderSections();
    syncSectionFocusDom();
    emitRendered();
  });
}

function setupLinkDrag(row, sectionIndex, linkIndex) {
  row.addEventListener("dragstart", event => {
    event.stopPropagation();
    draggedLink = { sectionIndex, linkIndex };
    draggedSectionIndex = null;
    row.classList.add("dragging-link");
    document.body.classList.add("dragging-bookmark");
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("application/x-startpage-link", JSON.stringify(draggedLink));
  });
  row.addEventListener("dragend", () => {
    draggedLink = null;
    activeLinkDropTarget = null;
    clearLinkDragClasses();
  });
  row.addEventListener("dragover", event => {
    if (!draggedLink) return;
    event.preventDefault();
    event.stopPropagation();
    const before = isBeforeLinkDropPoint(row, event);
    clearLinkDropMarkers();
    row.classList.toggle("link-drop-before", before);
    row.classList.toggle("link-drop-after", !before);
    activeLinkDropTarget = { sectionIndex: Number(row.dataset.sectionIndex), linkIndex: Number(row.dataset.linkIndex), before };
    row.closest(".links")?.classList.add("drag-over");
  });
  row.addEventListener("dragleave", event => {
    if (!row.contains(event.relatedTarget)) clearLinkDropMarkers();
  });
  row.addEventListener("drop", event => {
    if (!draggedLink) return;
    event.preventDefault();
    event.stopPropagation();
    const targetSection = Number(row.dataset.sectionIndex);
    let targetIndex = Number(row.dataset.linkIndex);
    const before = activeLinkDropTarget?.sectionIndex === targetSection && activeLinkDropTarget?.linkIndex === targetIndex
      ? activeLinkDropTarget.before
      : isBeforeLinkDropPoint(row, event);
    if (!before) targetIndex += 1;
    moveLink(draggedLink.sectionIndex, draggedLink.linkIndex, targetSection, targetIndex);
  });
}

function setupLinkDropZone(zone, sectionIndex) {
  zone.addEventListener("dragover", event => {
    if (!draggedLink && !hasDroppedUrl(event)) return;
    if (event.target.closest(".link")) return;
    event.preventDefault();
    event.stopPropagation();
    clearLinkDropMarkers();
    zone.classList.add("drag-over");
  });
  zone.addEventListener("dragleave", event => {
    if (!zone.contains(event.relatedTarget)) zone.classList.remove("drag-over");
  });
  zone.addEventListener("drop", event => {
    if (event.target.closest(".link")) return;
    event.preventDefault();
    event.stopPropagation();
    zone.classList.remove("drag-over");
    if (draggedLink) {
      moveLink(draggedLink.sectionIndex, draggedLink.linkIndex, sectionIndex, data.sections[sectionIndex].links.length);
      return;
    }
    handleExternalBookmarkDrop(sectionIndex, event.dataTransfer);
  });
}

function isBeforeLinkDropPoint(row, event) {
  const rect = row.getBoundingClientRect();
  const links = row.closest(".links");
  const isGrid = links && getComputedStyle(links).display === "grid";
  if (!isGrid) return event.clientY < rect.top + rect.height / 2;
  const y = (event.clientY - rect.top) / rect.height;
  if (y < .3) return true;
  if (y > .7) return false;
  return event.clientX < rect.left + rect.width / 2;
}

function hasDroppedUrl(event) {
  const types = Array.from(event.dataTransfer?.types || []);
  return types.includes("text/uri-list") || types.includes("text/x-moz-url") || types.includes("text/html") || types.includes("text/plain");
}

function handleExternalBookmarkDrop(sectionIndex, dataTransfer) {
  const droppedBookmark = getDroppedBookmarkData(dataTransfer);
  if (!droppedBookmark) return false;
  openLinkModal(sectionIndex, null, droppedBookmark);
  return true;
}

function getDroppedBookmarkData(dataTransfer) {
  if (!dataTransfer) return null;
  const mozData = parseMozUrlData(dataTransfer.getData("text/x-moz-url"));
  const htmlData = parseHtmlLinkData(dataTransfer.getData("text/html"));
  const uriUrl = firstUriListUrl(dataTransfer.getData("text/uri-list"));
  const plainText = dataTransfer.getData("text/plain");
  const plainUrl = firstUrlFromText(plainText);
  const url = normalizeUrl(uriUrl || mozData.url || htmlData.url || plainUrl);
  if (!url) return null;
  const name = cleanDroppedBookmarkName(
    mozData.name || htmlData.name || titleFromDroppedText(plainText, url) || titleFromUrl(url)
  );
  return { name, url };
}

function parseMozUrlData(value) {
  const lines = String(value || "").split(/\r?\n/).map(line => line.trim()).filter(Boolean);
  if (!lines.length) return { url: "", name: "" };
  return { url: firstUrlFromText(lines[0]), name: lines[1] || "" };
}

function parseHtmlLinkData(value) {
  const html = String(value || "").trim();
  if (!html) return { url: "", name: "" };
  try {
    const link = new DOMParser().parseFromString(html, "text/html").querySelector("a[href]");
    if (!link) return { url: "", name: "" };
    return { url: link.getAttribute("href") || "", name: link.textContent || link.getAttribute("title") || "" };
  } catch {
    return { url: "", name: "" };
  }
}

function firstUriListUrl(value) {
  return String(value || "").split(/\r?\n/).map(line => line.trim()).find(line => line && !line.startsWith("#")) || "";
}

function firstUrlFromText(value) {
  const text = String(value || "").trim();
  if (!text) return "";
  if (isLikelyDroppedUrl(text) && normalizeUrl(text)) return text;
  const lineUrl = text.split(/\r?\n/).map(line => line.trim()).find(line => isLikelyDroppedUrl(line) && normalizeUrl(line));
  if (lineUrl) return lineUrl;
  return text.match(/(?:https?:\/\/|mailto:|tel:|www\.)[^\s<>"']+/i)?.[0] || "";
}

function titleFromDroppedText(value, url) {
  const normalizedUrl = normalizeUrl(url);
  return String(value || "").split(/\r?\n/)
    .map(line => cleanDroppedBookmarkName(line))
    .find(line => line && (!isLikelyDroppedUrl(line) || normalizeUrl(line) !== normalizedUrl)) || "";
}

function titleFromUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.hostname ? parsed.hostname.replace(/^www\./i, "") : url;
  } catch {
    return url;
  }
}

function cleanDroppedBookmarkName(value) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, 120);
}

function isLikelyDroppedUrl(value) {
  const text = String(value || "").trim();
  return /^(https?:\/\/|mailto:|tel:|www\.)/i.test(text) || /^[^\s:/?#]+\.[^\s]+/i.test(text);
}

function moveLink(fromSection, fromIndex, toSection, toIndex) {
  if (!data.sections[fromSection] || !data.sections[toSection]) return;
  fromIndex = Number(fromIndex);
  toIndex = Number(toIndex);
  if (!Number.isInteger(fromIndex) || !Number.isInteger(toIndex)) return;
  const [moved] = data.sections[fromSection].links.splice(fromIndex, 1);
  if (!moved) return;
  if (fromSection === toSection && fromIndex < toIndex) toIndex -= 1;
  toIndex = clamp(toIndex, 0, data.sections[toSection].links.length, data.sections[toSection].links.length);
  data.sections[toSection].links.splice(toIndex, 0, moved);
  draggedLink = null;
  activeLinkDropTarget = null;
  clearLinkDragClasses();
  save();
  if (fromSection === toSection) {
    renderSection(fromSection);
  } else {
    renderSection(fromSection);
    renderSection(toSection);
  }
}

function clearLinkDropMarkers() { document.querySelectorAll(".link-drop-before,.link-drop-after").forEach(el => el.classList.remove("link-drop-before", "link-drop-after")); }

function clearLinkDragClasses() {
  document.body.classList.remove("dragging-bookmark");
  document.querySelectorAll(".dragging-link,.drag-over,.link-drop-before,.link-drop-after").forEach(el => el.classList.remove("dragging-link", "drag-over", "link-drop-before", "link-drop-after"));
}

function openLinkModal(sectionIndex, linkIndex = null, initialValues = {}) {
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
    if (nameInput) nameInput.value = initialValues.name || "";
    if (urlInput) urlInput.value = initialValues.url || "";
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
  if (!normalizedUrl) {
    alert("Unsupported URL type. Use http, https, mailto, tel, or waypoint links.");
    return;
  }
  const nextName = isWaypointUrl(normalizedUrl) ? cleanInternalLinkName(name, normalizedUrl) : name;
  const nextLink = { name: nextName, url: normalizedUrl, icon: isWaypointUrl(normalizedUrl) ? waypointIcon(normalizedUrl) : pendingLinkIcon || "" };
  const changedSectionIndex = editingLink?.sectionIndex ?? activeSection;
  const changedLinkIndex = editingLink?.linkIndex ?? data.sections[activeSection].links.length;
  if (editingLink) data.sections[changedSectionIndex].links[changedLinkIndex] = nextLink;
  else data.sections[changedSectionIndex].links.push(nextLink);
  editingLink = null;
  pendingLinkIcon = null;
  save();
  renderBookmark(changedSectionIndex, changedLinkIndex);
  closeModal("linkModal");
}

async function deleteLink(sectionIndex, linkIndex) {
  const section = data.sections[sectionIndex];
  const link = section?.links[linkIndex];
  if (!section || !link) return false;
  const confirmed = await requestWaypointConfirmation({
    title: "Delete bookmark?",
    message: `Delete “${link.name}” from “${section.name}”? This cannot be undone.`,
    confirmLabel: "Delete bookmark"
  });
  if (!confirmed) return false;
  section.links.splice(linkIndex, 1);
  save();
  renderSection(sectionIndex);
  return true;
}

async function deleteSection(index) {
  const section = data.sections[index];
  if (!section) return false;
  const bookmarkCount = section.links.length;
  const confirmed = await requestWaypointConfirmation({
    title: "Delete section?",
    message: `Delete “${section.name}” and ${bookmarkCount} ${bookmarkCount === 1 ? "bookmark" : "bookmarks"}? This cannot be undone.`,
    confirmLabel: "Delete section"
  });
  if (!confirmed) return false;
  data.sections.splice(index, 1);
  if (!data.sections.length) data.sections.push({ name: "New Section", links: [] });
  if (focusedSectionIndex === index) focusedSectionIndex = null;
  else if (Number.isInteger(focusedSectionIndex) && focusedSectionIndex > index) focusedSectionIndex -= 1;
  save();
  renderSections();
  syncSectionFocusDom();
  emitRendered();
  return true;
}

function openSectionModal() {
  ensureSectionModal();
  const input = $("sectionNameInput");
  if (input) input.value = "";
  openModal("sectionModal");
  setTimeout(() => input?.focus(), 50);
}

function ensureSectionModal() {
  if ($("sectionModal")) return;
  const modal = document.createElement("div");
  modal.className = "modal hidden";
  modal.id = "sectionModal";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-labelledby", "sectionModalTitle");
  modal.innerHTML = `
    <div class="modal-content compact-modal section-create-modal">
      <button class="modal-close" data-close-modal="sectionModal" aria-label="Close">×</button>
      <h3 id="sectionModalTitle">Create Section</h3>
      <label>Section Name<input id="sectionNameInput" placeholder="Movies"></label>
      <div class="modal-actions">
        <button id="createSectionBtn" class="primary-btn" type="button">Add</button>
        <button class="ghost-btn" data-close-modal="sectionModal" type="button">Cancel</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  modal.addEventListener("click", e => { if (e.target === modal) closeModal("sectionModal"); });
  modal.querySelectorAll("[data-close-modal]").forEach(btn => btn.addEventListener("click", () => closeModal(btn.dataset.closeModal)));
  modal.querySelector("#createSectionBtn")?.addEventListener("click", createSectionFromModal);
  modal.querySelector("#sectionNameInput")?.addEventListener("keydown", event => {
    if (event.key === "Enter") createSectionFromModal();
    if (event.key === "Escape") closeModal("sectionModal");
  });
}

function createSectionFromModal() {
  const name = $("sectionNameInput")?.value.trim();
  if (!name) return;
  addSection(name);
  closeModal("sectionModal");
}

function openRenameSectionModal(sectionIndex) {
  const section = data.sections[sectionIndex];
  if (!section) return;
  ensureRenameSectionModal();
  renamingSectionIndex = sectionIndex;
  const input = $("renameSectionNameInput");
  if (input) input.value = section.name;
  openModal("renameSectionModal");
  setTimeout(() => {
    input?.focus();
    input?.select();
  }, 50);
}

function ensureRenameSectionModal() {
  if ($("renameSectionModal")) return;
  const modal = document.createElement("div");
  modal.className = "modal hidden";
  modal.id = "renameSectionModal";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-labelledby", "renameSectionModalTitle");
  modal.innerHTML = `
    <div class="modal-content compact-modal section-rename-modal">
      <button class="modal-close" data-close-modal="renameSectionModal" aria-label="Close">×</button>
      <h3 id="renameSectionModalTitle">Rename Section</h3>
      <label>Section Name<input id="renameSectionNameInput" maxlength="80"></label>
      <div class="modal-actions">
        <button id="renameSectionBtn" class="primary-btn" type="button">Rename</button>
        <button class="ghost-btn" data-close-modal="renameSectionModal" type="button">Cancel</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  modal.addEventListener("click", event => {
    if (event.target === modal) closeModal("renameSectionModal");
  });
  modal.querySelectorAll("[data-close-modal]").forEach(button => {
    button.addEventListener("click", () => closeModal(button.dataset.closeModal));
  });
  modal.querySelector("#renameSectionBtn")?.addEventListener("click", renameSectionFromModal);
  modal.querySelector("#renameSectionNameInput")?.addEventListener("keydown", event => {
    if (event.key === "Enter") renameSectionFromModal();
    if (event.key === "Escape") closeModal("renameSectionModal");
  });
}

function renameSectionFromModal() {
  const sectionIndex = renamingSectionIndex;
  const nextName = $("renameSectionNameInput")?.value.trim();
  if (!Number.isInteger(sectionIndex) || !data.sections[sectionIndex] || !nextName) return;
  data.sections[sectionIndex].name = nextName;
  renamingSectionIndex = null;
  save();
  renderSectionMetadata(sectionIndex, { refreshAllHints: true });
  closeModal("renameSectionModal");
  focusBookmarkSection(sectionIndex);
}

function addSection(name = "") {
  const sectionName = String(name || "").trim();
  if (!sectionName) return openSectionModal();
  data.sections.push({ name: sectionName, links: [] });
  save();
  renderAddedSection(data.sections.length - 1);
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
  if (!safeUrl) return "Unsupported URL type. Use http, https, mailto, tel, or waypoint links.";
  const safeName = isWaypointUrl(safeUrl) ? cleanInternalLinkName(linkName, safeUrl) : String(linkName).trim() || safeUrl;
  data.sections[sectionIndex].links.push({ name: safeName, url: safeUrl, icon: isWaypointUrl(safeUrl) ? waypointIcon(safeUrl) : "" });
  save();
  renderBookmark(sectionIndex, data.sections[sectionIndex].links.length - 1);
  return `Added <strong>${escapeHtml(linkName)}</strong> to <strong>${escapeHtml(data.sections[sectionIndex].name)}</strong>.`;
}

function renameSectionByCommand(oldName, newName) {
  const sectionIndex = findSectionIndexByName(oldName);
  if (sectionIndex < 0) return `No section named <strong>${escapeHtml(oldName)}</strong>.`;
  data.sections[sectionIndex].name = String(newName || "").trim() || data.sections[sectionIndex].name;
  save();
  renderSectionMetadata(sectionIndex, { refreshAllHints: true });
  return `Section renamed to <strong>${escapeHtml(data.sections[sectionIndex].name)}</strong>.`;
}

function parseDeleteLinkCommand(commandRaw) {
  const body = commandRaw.trim().replace(/^(delete|remove)\s+link\s*/i, "").trim();
  const quoted = [...body.matchAll(/"([^"]+)"|'([^']+)'/g)].map(match => match[1] || match[2]);
  if (quoted.length >= 2) return { sectionName: quoted[0], linkName: quoted[1] };
  const sectionMatch = data.sections
    .map(section => section.name)
    .filter(name => body.toLowerCase().startsWith(`${name.toLowerCase()} `))
    .sort((a, b) => b.length - a.length)[0];
  if (!sectionMatch) return null;
  const linkName = body.slice(sectionMatch.length).trim();
  return linkName ? { sectionName: sectionMatch, linkName } : null;
}

function deleteSectionByCommand(sectionName, onComplete) {
  const sectionIndex = findSectionIndexByName(sectionName);
  if (sectionIndex < 0) return `No section named <strong>${escapeHtml(sectionName)}</strong>.`;
  deleteSection(sectionIndex).then(deleted => {
    onComplete?.(deleted
      ? `Deleted section <strong>${escapeHtml(sectionName)}</strong>.`
      : `Deletion cancelled for section <strong>${escapeHtml(sectionName)}</strong>.`, deleted);
  });
  return `Confirm deletion of section <strong>${escapeHtml(sectionName)}</strong> in the Waypoint dialog.`;
}

function deleteLinkByCommand(sectionName, linkName, onComplete) {
  const sectionIndex = findSectionIndexByName(sectionName);
  if (sectionIndex < 0) return `No section named <strong>${escapeHtml(sectionName)}</strong>.`;
  const linkIndex = data.sections[sectionIndex].links.findIndex(link =>
    String(link.name || "").trim().toLowerCase() === String(linkName || "").trim().toLowerCase()
  );
  if (linkIndex < 0) return `No bookmark named <strong>${escapeHtml(linkName)}</strong> in <strong>${escapeHtml(sectionName)}</strong>.`;
  deleteLink(sectionIndex, linkIndex).then(deleted => {
    onComplete?.(deleted
      ? `Deleted bookmark <strong>${escapeHtml(linkName)}</strong> from <strong>${escapeHtml(sectionName)}</strong>.`
      : `Deletion cancelled for bookmark <strong>${escapeHtml(linkName)}</strong>.`, deleted);
  });
  return `Confirm deletion of bookmark <strong>${escapeHtml(linkName)}</strong> in the Waypoint dialog.`;
}
