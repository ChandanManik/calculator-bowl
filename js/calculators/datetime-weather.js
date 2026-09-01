/**
 * ============================================================================
 * Live Weather Forecast, Radar Map & Atmospheric Calculator
 * Clean, 100% Client-Side Engine with Open-Meteo Integration & Lazy Radar
 * ============================================================================
 */

function renderWeatherCalculator(container, calcDef) {
  let isCelsius = true;
  let activeLocation = {
    name: "New York",
    country: "United States",
    countryCode: "US",
    lat: 40.7128,
    lon: -74.0060,
    timezone: "America/New_York"
  };
  let cachedWeatherData = null;

  container.innerHTML = `
    <!-- Top Search & Quick City Bar -->
    <div style="background: var(--bg-surface); border: 1.5px solid var(--border-color); border-radius: var(--radius-xl); padding: 1.5rem; margin-bottom: 1.5rem; box-shadow: var(--shadow-sm);">
      <div style="display: flex; flex-wrap: wrap; gap: 1rem; align-items: center; justify-content: space-between;">
        
        <!-- Search Input -->
        <div style="position: relative; flex: 1; min-width: 260px;">
          <label style="display: block; font-size: 0.85rem; font-weight: 700; margin-bottom: 0.35rem; color: var(--text-secondary);">
            🔍 Search Any Global City or Coordinates:
          </label>
          <div style="display: flex; gap: 0.5rem;">
            <input type="text" id="weatherSearchInput" class="form-control" placeholder="e.g. London, Tokyo, Dhaka, Paris, Sydney..." style="border: 1.5px solid var(--border-color); border-radius: var(--radius-md); font-size: 0.95rem;">
            <button type="button" id="btnWeatherSearch" class="btn btn-primary" style="padding: 0 1.25rem; white-space: nowrap;">
              Search
            </button>
          </div>
          <!-- Autocomplete Dropdown -->
          <div id="weatherSearchDropdown" style="display: none; position: absolute; top: 100%; left: 0; right: 0; background: var(--bg-surface); border: 1.5px solid var(--border-color); border-radius: var(--radius-md); box-shadow: var(--shadow-lg); z-index: 100; max-height: 220px; overflow-y: auto; margin-top: 4px;"></div>
        </div>

        <!-- Action Buttons: GPS & Temp Unit Switch -->
        <div style="display: flex; gap: 0.75rem; align-items: flex-end; padding-top: 1.2rem;">
          <button type="button" id="btnWeatherGps" class="btn btn-secondary" title="Use your device GPS location" style="font-size: 0.9rem; padding: 0.65rem 1rem;">
            📍 My Location
          </button>
          <div style="display: flex; background: var(--bg-subtle); border: 1.5px solid var(--border-color); border-radius: var(--radius-md); padding: 2px;">
            <button type="button" id="btnUnitCelsius" class="btn" style="padding: 0.45rem 0.85rem; font-size: 0.9rem; font-weight: 700; border-radius: var(--radius-sm); background: var(--accent-primary); color: white;">°C</button>
            <button type="button" id="btnUnitFahrenheit" class="btn" style="padding: 0.45rem 0.85rem; font-size: 0.9rem; font-weight: 700; border-radius: var(--radius-sm); background: transparent; color: var(--text-secondary);">°F</button>
          </div>
        </div>
      </div>

      <!-- Quick City Badges -->
      <div style="margin-top: 1rem; display: flex; flex-wrap: wrap; gap: 0.4rem; align-items: center;">
        <span style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-right: 0.25rem;">Popular Cities:</span>
        <button type="button" class="quick-city-badge" data-name="London" data-country="United Kingdom" data-lat="51.5074" data-lon="-0.1278" data-tz="Europe/London">🇬🇧 London</button>
        <button type="button" class="quick-city-badge" data-name="New York" data-country="United States" data-lat="40.7128" data-lon="-74.0060" data-tz="America/New_York">🇺🇸 New York</button>
        <button type="button" class="quick-city-badge" data-name="Tokyo" data-country="Japan" data-lat="35.6762" data-lon="139.6503" data-tz="Asia/Tokyo">🇯🇵 Tokyo</button>
        <button type="button" class="quick-city-badge" data-name="Dhaka" data-country="Bangladesh" data-lat="23.8103" data-lon="90.4125" data-tz="Asia/Dhaka">🇧🇩 Dhaka</button>
        <button type="button" class="quick-city-badge" data-name="Paris" data-country="France" data-lat="48.8566" data-lon="2.3522" data-tz="Europe/Paris">🇫🇷 Paris</button>
        <button type="button" class="quick-city-badge" data-name="Dubai" data-country="UAE" data-lat="25.2048" data-lon="55.2708" data-tz="Asia/Dubai">🇦🇪 Dubai</button>
        <button type="button" class="quick-city-badge" data-name="Sydney" data-country="Australia" data-lat="-33.8688" data-lon="151.2093" data-tz="Australia/Sydney">🇦🇺 Sydney</button>
      </div>
    </div>

    <!-- Weather Dashboard Content Container -->
    <div id="weatherDashboardArea">
      <div id="weatherLoadingState" style="text-align: center; padding: 3rem 1.5rem; background: var(--bg-surface); border: 1.5px solid var(--border-color); border-radius: var(--radius-xl);">
        <div style="font-size: 2.5rem; animation: spin 2s linear infinite; display: inline-block;">🛰️</div>
        <h3 style="margin-top: 1rem; color: var(--text-primary);">Fetching Real-Time Meteorological Satellite Data...</h3>
        <p style="color: var(--text-muted); font-size: 0.9rem;">Connecting to Open-Meteo Global Forecasting Network</p>
      </div>
    </div>
  `;

  // Apply styles for quick city badges
  const styleEl = document.createElement("style");
  styleEl.textContent = `
    .quick-city-badge {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-full);
      padding: 0.25rem 0.65rem;
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .quick-city-badge:hover {
      background: var(--accent-primary);
      color: white;
      border-color: var(--accent-primary);
    }
    .weather-metric-card {
      background: var(--bg-surface);
      border: 1.5px solid var(--border-color);
      border-radius: var(--radius-lg);
      padding: 1.25rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      transition: transform 0.2s ease;
    }
    .weather-metric-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-sm);
    }
    .weather-metric-icon {
      width: 44px;
      height: 44px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      background: var(--bg-subtle);
    }
    .hourly-forecast-pill {
      min-width: 80px;
      padding: 0.75rem 0.5rem;
      background: var(--bg-surface);
      border: 1.5px solid var(--border-color);
      border-radius: var(--radius-md);
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.35rem;
    }
    .daily-forecast-card {
      background: var(--bg-surface);
      border: 1.5px solid var(--border-color);
      border-radius: var(--radius-md);
      padding: 1rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
    }
  `;
  container.appendChild(styleEl);

  // Setup Event Listeners
  const searchInput = container.querySelector("#weatherSearchInput");
  const btnSearch = container.querySelector("#btnWeatherSearch");
  const dropdown = container.querySelector("#weatherSearchDropdown");
  const btnGps = container.querySelector("#btnWeatherGps");
  const btnC = container.querySelector("#btnUnitCelsius");
  const btnF = container.querySelector("#btnUnitFahrenheit");

  // Unit Switchers
  btnC.addEventListener("click", () => {
    if (isCelsius) return;
    isCelsius = true;
    btnC.style.background = "var(--accent-primary)";
    btnC.style.color = "white";
    btnF.style.background = "transparent";
    btnF.style.color = "var(--text-secondary)";
    if (cachedWeatherData) renderDashboard(cachedWeatherData);
  });

  btnF.addEventListener("click", () => {
    if (!isCelsius) return;
    isCelsius = false;
    btnF.style.background = "var(--accent-primary)";
    btnF.style.color = "white";
    btnC.style.background = "transparent";
    btnC.style.color = "var(--text-secondary)";
    if (cachedWeatherData) renderDashboard(cachedWeatherData);
  });

  // Quick City Badges
  container.querySelectorAll(".quick-city-badge").forEach(badge => {
    badge.addEventListener("click", () => {
      activeLocation = {
        name: badge.getAttribute("data-name"),
        country: badge.getAttribute("data-country"),
        lat: parseFloat(badge.getAttribute("data-lat")),
        lon: parseFloat(badge.getAttribute("data-lon")),
        timezone: badge.getAttribute("data-tz") || "auto"
      };
      searchInput.value = activeLocation.name;
      fetchWeatherData();
    });
  });

  // GPS My Location
  btnGps.addEventListener("click", () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    btnGps.innerHTML = "⏳ Locating...";
    navigator.geolocation.getCurrentPosition(
      pos => {
        btnGps.innerHTML = "📍 My Location";
        activeLocation = {
          name: "My GPS Location",
          country: "Detected",
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          timezone: "auto"
        };
        searchInput.value = `${pos.coords.latitude.toFixed(3)}, ${pos.coords.longitude.toFixed(3)}`;
        fetchWeatherData();
      },
      err => {
        btnGps.innerHTML = "📍 My Location";
        alert("Unable to retrieve location: " + err.message);
      },
      { timeout: 8000 }
    );
  });

  // City Search
  let searchTimeout = null;
  searchInput.addEventListener("input", (e) => {
    clearTimeout(searchTimeout);
    const query = e.target.value.trim();
    if (query.length < 2) {
      dropdown.style.display = "none";
      return;
    }
    searchTimeout = setTimeout(() => searchCities(query), 350);
  });

  btnSearch.addEventListener("click", () => {
    const query = searchInput.value.trim();
    if (query) searchCities(query, true);
  });

  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const query = searchInput.value.trim();
      if (query) searchCities(query, true);
    }
  });

  document.addEventListener("click", (e) => {
    if (!searchInput.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.style.display = "none";
    }
  });

  async function searchCities(query, autoSelectFirst = false) {
    try {
      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=6&language=en&format=json`;
      const res = await fetch(url);
      const data = await res.json();

      if (!data.results || data.results.length === 0) {
        dropdown.innerHTML = `<div style="padding: 0.75rem; color: var(--text-muted); font-size: 0.85rem; text-align: center;">No cities found for "${query}".</div>`;
        dropdown.style.display = "block";
        return;
      }

      if (autoSelectFirst) {
        const first = data.results[0];
        selectCity(first);
        return;
      }

      dropdown.innerHTML = data.results.map(r => `
        <div class="search-city-option" style="padding: 0.65rem 1rem; cursor: pointer; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;" 
             data-name="${r.name}" data-admin="${r.admin1 || ''}" data-country="${r.country || ''}" data-lat="${r.latitude}" data-lon="${r.longitude}" data-tz="${r.timezone || 'auto'}">
          <div>
            <div style="font-weight: 700; color: var(--text-primary); font-size: 0.9rem;">${r.name}</div>
            <div style="font-size: 0.78rem; color: var(--text-muted);">${[r.admin1, r.country].filter(Boolean).join(", ")}</div>
          </div>
          <span style="font-size: 0.75rem; color: var(--accent-primary); font-weight: 600;">Select →</span>
        </div>
      `).join("");

      dropdown.querySelectorAll(".search-city-option").forEach(opt => {
        opt.addEventListener("click", () => {
          selectCity({
            name: opt.getAttribute("data-name"),
            country: opt.getAttribute("data-country"),
            latitude: parseFloat(opt.getAttribute("data-lat")),
            longitude: parseFloat(opt.getAttribute("data-lon")),
            timezone: opt.getAttribute("data-tz")
          });
        });
      });

      dropdown.style.display = "block";
    } catch (err) {
      console.warn("Geocoding failed:", err);
    }
  }

  function selectCity(city) {
    dropdown.style.display = "none";
    activeLocation = {
      name: city.name,
      country: city.country || "",
      lat: city.latitude,
      lon: city.longitude,
      timezone: city.timezone || "auto"
    };
    searchInput.value = `${city.name}, ${city.country || ''}`;
    fetchWeatherData();
  }

  // Fetch Open-Meteo Weather API
  async function fetchWeatherData() {
    const area = container.querySelector("#weatherDashboardArea");
    area.innerHTML = `
      <div style="text-align: center; padding: 3rem 1.5rem; background: var(--bg-surface); border: 1.5px solid var(--border-color); border-radius: var(--radius-xl);">
        <div style="font-size: 2.5rem; animation: spin 2s linear infinite; display: inline-block;">🛰️</div>
        <h3 style="margin-top: 1rem; color: var(--text-primary);">Fetching Weather for ${activeLocation.name}...</h3>
      </div>
    `;

    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${activeLocation.lat}&longitude=${activeLocation.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m,cloud_cover,uv_index&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max&timezone=auto`;
      
      const res = await fetch(url);
      if (!res.ok) throw new Error("Weather API returned " + res.status);
      const data = await res.json();
      cachedWeatherData = data;
      renderDashboard(data);
    } catch (err) {
      console.error("Weather fetch failed:", err);
      renderOfflineFallback();
    }
  }

  function getWeatherDesc(code) {
    // WMO Weather interpretation codes
    const map = {
      0: { text: "Clear Sky", icon: "☀️" },
      1: { text: "Mainly Clear", icon: "🌤️" },
      2: { text: "Partly Cloudy", icon: "⛅" },
      3: { text: "Overcast", icon: "☁️" },
      45: { text: "Fog", icon: "🌫️" },
      48: { text: "Depositing Rime Fog", icon: "🌫️" },
      51: { text: "Light Drizzle", icon: "🌦️" },
      53: { text: "Moderate Drizzle", icon: "🌦️" },
      55: { text: "Dense Drizzle", icon: "🌧️" },
      61: { text: "Slight Rain", icon: "🌧️" },
      63: { text: "Moderate Rain", icon: "🌧️" },
      65: { text: "Heavy Rain", icon: "🌧️" },
      71: { text: "Slight Snow Fall", icon: "🌨️" },
      73: { text: "Moderate Snow Fall", icon: "❄️" },
      75: { text: "Heavy Snow Fall", icon: "❄️" },
      80: { text: "Slight Rain Showers", icon: "🌦️" },
      81: { text: "Moderate Rain Showers", icon: "🌧️" },
      82: { text: "Violent Rain Showers", icon: "⛈️" },
      95: { text: "Thunderstorm", icon: "🌩️" },
      96: { text: "Thunderstorm with Slight Hail", icon: "⛈️" },
      99: { text: "Thunderstorm with Heavy Hail", icon: "⛈️" }
    };
    return map[code] || { text: "Partly Cloudy", icon: "⛅" };
  }

  function formatTemp(cVal) {
    if (isCelsius) {
      return `${Math.round(cVal)}°C`;
    } else {
      const fVal = (cVal * 9/5) + 32;
      return `${Math.round(fVal)}°F`;
    }
  }

  function calculateDewPoint(tempC, humidity) {
    const a = 17.27;
    const b = 237.7;
    const alpha = ((a * tempC) / (b + tempC)) + Math.log(humidity / 100.0);
    return (b * alpha) / (a - alpha);
  }

  function renderDashboard(data) {
    const cur = data.current;
    const daily = data.daily;
    const hourly = data.hourly;

    const weatherInfo = getWeatherDesc(cur.weather_code);
    const dewPointC = calculateDewPoint(cur.temperature_2m, cur.relative_humidity_2m);
    
    // Day length calculation
    let sunriseTime = "--:--";
    let sunsetTime = "--:--";
    let dayLengthStr = "-- hrs";
    if (daily.sunrise && daily.sunset && daily.sunrise[0] && daily.sunset[0]) {
      const sr = new Date(daily.sunrise[0]);
      const ss = new Date(daily.sunset[0]);
      sunriseTime = sr.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      sunsetTime = ss.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const diffHrs = (ss - sr) / (1000 * 60 * 60);
      dayLengthStr = `${Math.floor(diffHrs)}h ${Math.round((diffHrs % 1) * 60)}m`;
    }

    // Heat Index Danger Level
    const feelsLikeC = cur.apparent_temperature;
    let heatIndexBadge = "Normal Comfort";
    let heatIndexColor = "#10b981";
    if (feelsLikeC > 40) {
      heatIndexBadge = "Extreme Danger 🔥";
      heatIndexColor = "#ef4444";
    } else if (feelsLikeC > 33) {
      heatIndexBadge = "Caution / Heat Stress ⚠️";
      heatIndexColor = "#f59e0b";
    } else if (feelsLikeC < 0) {
      heatIndexBadge = "Freezing / Wind Chill ❄️";
      heatIndexColor = "#3b82f6";
    }

    // Wind speed conversion
    const windSpeedStr = isCelsius ? `${cur.wind_speed_10m} km/h` : `${(cur.wind_speed_10m * 0.621371).toFixed(1)} mph`;

    // Hourly Forecast HTML (next 12 hours)
    const nowHour = new Date().getHours();
    const hourlyItemsHtml = hourly.time.slice(0, 12).map((t, idx) => {
      const d = new Date(t);
      const hourStr = d.toLocaleTimeString([], { hour: 'numeric' });
      const temp = hourly.temperature_2m[idx];
      const code = hourly.weather_code[idx];
      const icon = getWeatherDesc(code).icon;
      const pop = hourly.precipitation_probability[idx] || 0;

      return `
        <div class="hourly-forecast-pill">
          <span style="font-size: 0.8rem; color: var(--text-muted);">${hourStr}</span>
          <span style="font-size: 1.5rem;">${icon}</span>
          <span style="font-size: 0.95rem; font-weight: 800; color: var(--text-primary);">${formatTemp(temp)}</span>
          <span style="font-size: 0.72rem; color: #06b6d4; font-weight: 700;">💧${pop}%</span>
        </div>
      `;
    }).join("");

    // Daily 7-Day Forecast HTML
    const dailyCardsHtml = daily.time.slice(0, 7).map((dayStr, idx) => {
      const d = new Date(dayStr + 'T00:00:00');
      const dayName = idx === 0 ? "Today" : d.toLocaleDateString([], { weekday: 'short' });
      const dateFormatted = d.toLocaleDateString([], { month: 'short', day: 'numeric' });
      const code = daily.weather_code[idx];
      const desc = getWeatherDesc(code);
      const minTemp = daily.temperature_2m_min[idx];
      const maxTemp = daily.temperature_2m_max[idx];
      const rainProb = daily.precipitation_probability_max ? daily.precipitation_probability_max[idx] : 0;

      return `
        <div class="daily-forecast-card">
          <div style="min-width: 100px;">
            <div style="font-weight: 800; font-size: 0.95rem; color: var(--text-primary);">${dayName}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">${dateFormatted}</div>
          </div>
          <div style="display: flex; align-items: center; gap: 0.5rem; flex: 1;">
            <span style="font-size: 1.5rem;">${desc.icon}</span>
            <span style="font-size: 0.88rem; color: var(--text-secondary); font-weight: 600;">${desc.text}</span>
          </div>
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <span style="font-size: 0.8rem; color: #06b6d4; font-weight: 700;">💧 ${rainProb}%</span>
            <div style="text-align: right; min-width: 90px;">
              <span style="font-weight: 800; color: var(--text-primary);">${formatTemp(maxTemp)}</span>
              <span style="color: var(--text-muted); font-size: 0.85rem; margin-left: 0.35rem;">${formatTemp(minTemp)}</span>
            </div>
          </div>
        </div>
      `;
    }).join("");

    const area = container.querySelector("#weatherDashboardArea");
    area.innerHTML = `
      <!-- Main Overview Hero Card -->
      <div style="background: linear-gradient(135deg, rgba(79, 70, 229, 0.08) 0%, rgba(6, 182, 212, 0.08) 100%); border: 1.5px solid var(--border-color); border-radius: var(--radius-2xl); padding: 2rem; margin-bottom: 1.5rem; position: relative; overflow: hidden;">
        <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 1.5rem;">
          
          <div>
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.35rem;">
              <span style="font-size: 1.5rem;">📍</span>
              <h2 style="margin: 0; font-size: 1.85rem; font-family: var(--font-heading); color: var(--text-primary);">
                ${activeLocation.name}
              </h2>
              <span class="brand-badge" style="font-size: 0.75rem;">${activeLocation.country}</span>
            </div>
            <div style="font-size: 0.9rem; color: var(--text-muted);">
              Coordinates: ${activeLocation.lat.toFixed(2)}°N, ${activeLocation.lon.toFixed(2)}°E | Local Timezone: ${data.timezone}
            </div>
            <div style="font-size: 1.1rem; color: var(--text-secondary); margin-top: 0.75rem; font-weight: 600;">
              ${weatherInfo.text}
            </div>
          </div>

          <!-- Temperature & Feels Like -->
          <div style="text-align: right;">
            <div style="display: flex; align-items: center; gap: 0.5rem; justify-content: flex-end;">
              <span style="font-size: 3.5rem; line-height: 1;">${weatherInfo.icon}</span>
              <span style="font-size: 3.5rem; font-weight: 900; font-family: var(--font-heading); color: var(--text-primary); line-height: 1;">
                ${formatTemp(cur.temperature_2m)}
              </span>
            </div>
            <div style="margin-top: 0.4rem; font-size: 0.95rem; color: var(--text-secondary);">
              Feels Like: <b>${formatTemp(cur.apparent_temperature)}</b> 
              <span style="display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 0.75rem; font-weight: 700; color: white; background: ${heatIndexColor}; margin-left: 0.35rem;">
                ${heatIndexBadge}
              </span>
            </div>
          </div>

        </div>
      </div>

      <!-- Atmospheric Metrics Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
        
        <div class="weather-metric-card">
          <div class="weather-metric-icon">💧</div>
          <div>
            <div style="font-size: 0.8rem; color: var(--text-muted); font-weight: 700;">Relative Humidity</div>
            <div style="font-size: 1.25rem; font-weight: 800; color: var(--text-primary);">${cur.relative_humidity_2m}%</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">Dew Point: ${formatTemp(dewPointC)}</div>
          </div>
        </div>

        <div class="weather-metric-card">
          <div class="weather-metric-icon">💨</div>
          <div>
            <div style="font-size: 0.8rem; color: var(--text-muted); font-weight: 700;">Wind Velocity</div>
            <div style="font-size: 1.25rem; font-weight: 800; color: var(--text-primary);">${windSpeedStr}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">Direction: ${cur.wind_direction_10m}°</div>
          </div>
        </div>

        <div class="weather-metric-card">
          <div class="weather-metric-icon">🧭</div>
          <div>
            <div style="font-size: 0.8rem; color: var(--text-muted); font-weight: 700;">Atmospheric Pressure</div>
            <div style="font-size: 1.25rem; font-weight: 800; color: var(--text-primary);">${cur.surface_pressure} hPa</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">${(cur.surface_pressure * 0.02953).toFixed(2)} inHg</div>
          </div>
        </div>

        <div class="weather-metric-card">
          <div class="weather-metric-icon">☀️</div>
          <div>
            <div style="font-size: 0.8rem; color: var(--text-muted); font-weight: 700;">UV Solar Index</div>
            <div style="font-size: 1.25rem; font-weight: 800; color: var(--text-primary);">${cur.uv_index !== undefined ? cur.uv_index : 0}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">${getUvRisk(cur.uv_index)}</div>
          </div>
        </div>

        <div class="weather-metric-card">
          <div class="weather-metric-icon">🌅</div>
          <div>
            <div style="font-size: 0.8rem; color: var(--text-muted); font-weight: 700;">Sunrise & Sunset</div>
            <div style="font-size: 1.05rem; font-weight: 800; color: var(--text-primary);">${sunriseTime} • ${sunsetTime}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">Day Length: ${dayLengthStr}</div>
          </div>
        </div>

        <div class="weather-metric-card">
          <div class="weather-metric-icon">☁️</div>
          <div>
            <div style="font-size: 0.8rem; color: var(--text-muted); font-weight: 700;">Cloud Cover</div>
            <div style="font-size: 1.25rem; font-weight: 800; color: var(--text-primary);">${cur.cloud_cover}%</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">Precip: ${cur.precipitation} mm</div>
          </div>
        </div>

      </div>

      <!-- 24-Hour Hourly Timeline Strip -->
      <div style="background: var(--bg-surface); border: 1.5px solid var(--border-color); border-radius: var(--radius-xl); padding: 1.5rem; margin-bottom: 1.5rem;">
        <h3 style="font-size: 1.15rem; font-family: var(--font-heading); margin: 0 0 1rem; color: var(--text-primary); display: flex; align-items: center; gap: 0.5rem;">
          <span>⏱️ Next 12-Hour Hourly Forecast</span>
        </h3>
        <div style="display: flex; gap: 0.65rem; overflow-x: auto; padding-bottom: 0.5rem;">
          ${hourlyItemsHtml}
        </div>
      </div>

      <!-- 7-Day Forecast Grid -->
      <div style="background: var(--bg-surface); border: 1.5px solid var(--border-color); border-radius: var(--radius-xl); padding: 1.5rem; margin-bottom: 1.5rem;">
        <h3 style="font-size: 1.15rem; font-family: var(--font-heading); margin: 0 0 1rem; color: var(--text-primary); display: flex; align-items: center; gap: 0.5rem;">
          <span>📅 7-Day Extended Weather Outlook</span>
        </h3>
        <div style="display: flex; flex-direction: column; gap: 0.6rem;">
          ${dailyCardsHtml}
        </div>
      </div>

      <!-- Live Interactive Radar Map (Lazy Loaded) -->
      <div style="background: var(--bg-surface); border: 1.5px solid var(--border-color); border-radius: var(--radius-xl); padding: 1.5rem; margin-bottom: 1.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
          <div>
            <h3 style="font-size: 1.25rem; font-family: var(--font-heading); margin: 0; color: var(--text-primary); display: flex; align-items: center; gap: 0.5rem;">
              <span>🛰️ Live Precipitation Radar & Satellite Map</span>
              <span class="brand-badge" style="background: #10b981; color: white;">Real-Time</span>
            </h3>
            <p style="margin: 0.25rem 0 0; font-size: 0.85rem; color: var(--text-muted);">
              Interactive rain radar, storm tracking, and cloud coverage around ${activeLocation.name}
            </p>
          </div>
          <button type="button" id="btnReloadRadar" class="btn btn-secondary" style="font-size: 0.85rem; padding: 0.4rem 0.85rem;">
            🔄 Refresh Radar
          </button>
        </div>

        <div id="radarContainer" style="position: relative; width: 100%; height: 420px; border-radius: var(--radius-lg); overflow: hidden; border: 1.5px solid var(--border-color); background: #0f172a;">
          <iframe id="liveRadarIframe" 
                  src="https://embed.windy.com/embed.html?type=map&location=coordinates&metricRain=default&metricTemp=default&metricWind=default&zoom=7&overlay=radar&product=radar&level=surface&lat=${activeLocation.lat}&lon=${activeLocation.lon}&message=true" 
                  style="width: 100%; height: 100%; border: none;" 
                  loading="lazy" 
                  title="Live Satellite Radar Map">
          </iframe>
        </div>
      </div>

      <!-- Mathematical Breakdown & Formulas Section -->
      <div class="calc-seo-content" style="background: var(--bg-surface); border: 1.5px solid var(--border-color); border-radius: var(--radius-xl); padding: 1.5rem;">
        <h3 class="content-subheading" style="margin-top: 0;">Step-by-Step Meteorological Computations for ${activeLocation.name}</h3>
        
        <div class="formula-callout" style="margin-bottom: 1rem;">
          <div class="formula-label">1. Calculated Dew Point Temperature (Magnus-Tetens Formula)</div>
          <div class="formula-expl">
            Given ambient temperature $T = ${cur.temperature_2m}^\\circ\\text{C}$ and relative humidity $RH = ${cur.relative_humidity_2m}\\%$:<br>
            $\\alpha = \\frac{17.27 \\times ${cur.temperature_2m}}{237.7 + ${cur.temperature_2m}} + \\ln(${cur.relative_humidity_2m}/100) \\implies T_d = \\mathbf{${dewPointC.toFixed(2)}^\\circ\\text{C}}$ (${formatTemp(dewPointC)})
          </div>
        </div>

        <div class="formula-callout">
          <div class="formula-label">2. Apparent Heat Index & Thermal Comfort Assessment</div>
          <div class="formula-expl">
            Observed feels-like temperature: <b>${formatTemp(cur.apparent_temperature)}</b>.<br>
            Current status: <b style="color: ${heatIndexColor};">${heatIndexBadge}</b>. Evaporative cooling rate is operating at approximately ${100 - cur.relative_humidity_2m}% efficiency.
          </div>
        </div>
      </div>
    `;

    // Refresh Radar handler
    const btnReloadRadar = area.querySelector("#btnReloadRadar");
    if (btnReloadRadar) {
      btnReloadRadar.addEventListener("click", () => {
        const iframe = area.querySelector("#liveRadarIframe");
        if (iframe) {
          iframe.src = iframe.src;
        }
      });
    }
  }

  function getUvRisk(uv) {
    if (!uv || uv < 3) return "Low Risk (No protection needed)";
    if (uv < 6) return "Moderate (Wear sunscreen & hat)";
    if (uv < 8) return "Very High (Seek shade midday)";
    return "Extreme (Take full precautions)";
  }

  function renderOfflineFallback() {
    const area = container.querySelector("#weatherDashboardArea");
    area.innerHTML = `
      <div style="background: var(--bg-surface); border: 1.5px solid var(--border-color); border-radius: var(--radius-xl); padding: 2rem; text-align: center;">
        <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">⛅</div>
        <h3 style="color: var(--text-primary); margin: 0 0 0.5rem;">Weather Forecasting Offline Mode</h3>
        <p style="color: var(--text-secondary); max-width: 500px; margin: 0 auto 1.5rem; font-size: 0.95rem;">
          Could not connect to live satellite network. Please check your internet connection or try searching for a different city above.
        </p>
        <button type="button" onclick="window.location.reload()" class="btn btn-primary">
          🔄 Retry Connection
        </button>
      </div>
    `;
  }

  // Initial load
  fetchWeatherData();
}
