// Waypoint search ownership. Loaded as an ordered classic script.

const SEARCH_ENGINES = {
  google: { label: "Google", badge: "G", action: "https://www.google.com/search", param: "q", placeholder: "Search Google" },
  duckduckgo: { label: "DuckDuckGo", badge: "D", action: "https://duckduckgo.com/", param: "q", placeholder: "Search DuckDuckGo" },
  brave: { label: "Brave Search", badge: "B", action: "https://search.brave.com/search", param: "q", placeholder: "Search Brave" },
  bing: { label: "Bing", badge: "B", action: "https://www.bing.com/search", param: "q", placeholder: "Search Bing" },
  custom: { label: "Custom", badge: "~", action: "", param: "q", placeholder: "Search" }
};

function labelSearch(value) { return (SEARCH_ENGINES[value] || SEARCH_ENGINES.google).label; }

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

function focusSearch() { document.querySelector(".search input")?.focus(); }
