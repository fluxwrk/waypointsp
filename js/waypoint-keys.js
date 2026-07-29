// Waypoint waypoint-keys ownership. Loaded as an ordered classic script.

let keyboardNavigationSection = null;

let keyboardNavigationTimer = null;

const KEYBOARD_NAVIGATION_TIMEOUT_MS = 10000;

let focusedSectionIndex = null;

function assignNavigationKeys(items, labelForItem) {
  const used = new Set();
  return items.map((item, index) => {
    const label = String(labelForItem(item, index) || "").toLowerCase().replace(/[^a-z]/g, "");
    const key = [...label].find(char => !used.has(char))
      || [..."abcdefghijklmnopqrstuvwxyz"].find(char => !used.has(char))
      || "";
    if (key) used.add(key);
    return key;
  });
}

function navigationKeyMap() {
  const sectionKeys = assignNavigationKeys(data.sections, section => section.name);
  return data.sections.map((section, sectionIndex) => ({
    key: sectionKeys[sectionIndex],
    linkKeys: assignNavigationKeys(section.links, link => link.name)
  }));
}

function syncSectionFocusDom() {
  const active = Number.isInteger(focusedSectionIndex);
  document.body.classList.toggle("section-focus-active", active);
  document.querySelectorAll(".section").forEach(section => {
    const focused = active && Number(section.dataset.sectionIndex) === focusedSectionIndex;
    section.classList.toggle("section-focused", focused);
    if (focused) {
      section.setAttribute("role", "dialog");
      section.setAttribute("aria-modal", "true");
    } else {
      section.removeAttribute("role");
      section.removeAttribute("aria-modal");
    }
  });
  const backdrop = $("sectionFocusBackdrop");
  if (backdrop) backdrop.hidden = !active;
}

function focusBookmarkSection(sectionIndex) {
  if (!data.sections[sectionIndex]) return false;
  focusedSectionIndex = sectionIndex;
  syncSectionFocusDom();
  return true;
}

function clearSectionFocus() {
  focusedSectionIndex = null;
  syncSectionFocusDom();
}

function clearKeyboardNavigation() {
  keyboardNavigationSection = null;
  clearTimeout(keyboardNavigationTimer);
  keyboardNavigationTimer = null;
  document.body.classList.remove("keyboard-navigation-active");
  document.querySelectorAll(".keyboard-section-active").forEach(element => element.classList.remove("keyboard-section-active"));
}

function scheduleKeyboardNavigationReset() {
  clearTimeout(keyboardNavigationTimer);
  keyboardNavigationTimer = setTimeout(() => {
    clearKeyboardNavigation();
    clearSectionFocus();
  }, KEYBOARD_NAVIGATION_TIMEOUT_MS);
}

function launchBookmark(link) {
  if (handleWaypointLink(link.url)) return;
  window.location.href = link.url;
}

function handleKeyboardNavigation(event) {
  if (!data.settings.keyboardNavigation || editLayoutActive) return false;
  if (event.defaultPrevented || event.ctrlKey || event.altKey || event.metaKey) return false;
  if (event.target.matches("input, textarea, select") || event.target.isContentEditable) return false;
  if (document.querySelector(".modal:not(.hidden)")) return false;

  if (event.key === "?") {
    event.preventDefault();
    clearKeyboardNavigation();
    openModal("keyboardHelpModal");
    return true;
  }
  if (event.code === "Space") {
    event.preventDefault();
    clearKeyboardNavigation();
    focusSearch();
    return true;
  }
  if (!/^[a-z]$/i.test(event.key)) return false;

  const key = event.key.toLowerCase();
  const keyMap = navigationKeyMap();
  if (keyboardNavigationSection === null) {
    const sectionIndex = keyMap.findIndex(section => section.key === key);
    if (sectionIndex < 0) return false;
    event.preventDefault();
    keyboardNavigationSection = sectionIndex;
    document.body.classList.add("keyboard-navigation-active");
    document.querySelector(`.section[data-section-index="${sectionIndex}"]`)?.classList.add("keyboard-section-active");
    focusBookmarkSection(sectionIndex);
    scheduleKeyboardNavigationReset();
    return true;
  }

  event.preventDefault();
  const sectionIndex = keyboardNavigationSection;
  const linkIndex = keyMap[sectionIndex]?.linkKeys.indexOf(key) ?? -1;
  if (linkIndex < 0) {
    clearKeyboardNavigation();
    clearSectionFocus();
    return true;
  }
  const link = data.sections[sectionIndex]?.links[linkIndex];
  clearKeyboardNavigation();
  clearSectionFocus();
  if (link) launchBookmark(link);
  return true;
}
