// Waypoint weather ownership. Loaded as an ordered classic script.

const WEATHER_CACHE_KEY = "startpage-weather-cache-v2";

function labelWeatherUnit(value) {
  if (value === "fahrenheit") return "Fahrenheit";
  if (value === "celsius") return "Celsius";
  return "Auto";
}

function formatRelativeDate(date) {
  const now = new Date();
  if (date.toDateString() === now.toDateString()) return "Today";
  const yesterday = new Date(now); yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

async function refreshWeather(force = false) {
  const loc = data.settings.weatherLocation.trim();
  if (!loc) { updateWeatherWidget(); return; }
  const cached = WaypointStorage.load(WEATHER_CACHE_KEY);
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
    WaypointStorage.save(WEATHER_CACHE_KEY, cache);
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

function updateWeatherWidget(payload = WaypointStorage.load(WEATHER_CACHE_KEY)) {
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

function updateClock() {
  const clock = $("clock");
  if (!clock) return;
  const now = new Date();
  const date = now.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
  const time = now.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit", hour12: true });
  clock.innerHTML = `<span class="mini-clock-date">${escapeHtml(date)}</span><span class="mini-clock-time">${escapeHtml(time)}</span>`;
}
