// Waypoint Welcome Guide ownership. Loaded as an ordered classic script.

let welcomeGuideReturnFocus = null;

function startWelcomeGuide() {
  welcomeGuideReturnFocus = document.activeElement;
  closeAllModals();
  if (editLayoutActive) setEditLayoutMode(false);
  openModal("welcomeGuideModal", { source: "welcome" });
  requestAnimationFrame(() => {
    document.querySelector("#welcomeGuideModal [data-welcome-destination]")?.focus({ preventScroll: true });
  });
}

function closeWelcomeGuide(restoreFocus = true) {
  closeModal("welcomeGuideModal");
  const returnFocus = welcomeGuideReturnFocus;
  welcomeGuideReturnFocus = null;
  if (restoreFocus && returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
}

function openWelcomeGuideDestination(destination) {
  closeWelcomeGuide(false);
  if (destination === "studio") {
    setEditLayoutMode(true);
    return;
  }
  if (destination === "appearance") {
    openSettingsPage("appearance", { source: "welcome-guide" });
    return;
  }
  if (destination === "bookmarks") {
    openSettingsPage("bookmarks", { source: "welcome-guide" });
    return;
  }
  if (destination === "terminal") {
    openModal("terminalModal", { source: "welcome-guide" });
    return;
  }
  if (destination === "keys") {
    openModal("keyboardHelpModal", { source: "welcome-guide" });
    requestAnimationFrame(() => document.querySelector("#keyboardHelpModal .modal-close")?.focus({ preventScroll: true }));
    return;
  }
  if (destination === "backup") openSettingsPage("backup", { source: "welcome-guide" });
}

function handleWelcomeGuideAction(event) {
  const button = event.target.closest("[data-welcome-destination]");
  if (!button) return;
  openWelcomeGuideDestination(button.dataset.welcomeDestination);
}
