/**
 * ============================================================================
 * Conversion Calculators: Temperature, Length, Area/Volume & Speed Converters
 * ============================================================================
 */

function renderTemperatureConverter(container, calcDef) {
  container.innerHTML = `
    <div class="form-grid">
      <div class="form-group">
        <label class="form-label" for="tempInputVal">Temperature Value</label>
        <input type="number" id="tempInputVal" class="form-control" value="100" style="border: 1.5px solid var(--border-color); border-radius: var(--radius-md);">
      </div>

      <div class="form-group">
        <label class="form-label" for="tempFromUnit">From Scale</label>
        <select id="tempFromUnit" class="form-control">
          <option value="C" selected>Celsius (°C)</option>
          <option value="F">Fahrenheit (°F)</option>
          <option value="K">Kelvin (K)</option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label" for="tempToUnit">To Scale</label>
        <select id="tempToUnit" class="form-control">
          <option value="C">Celsius (°C)</option>
          <option value="F" selected>Fahrenheit (°F)</option>
          <option value="K">Kelvin (K)</option>
        </select>
      </div>
    </div>

    <div class="calc-actions">
      <button type="button" id="btnConvertTemp" class="btn btn-primary">
        <span>⚡ Convert Temperature</span>
      </button>
    </div>

    <div id="tempResultContainer" class="results-section animate-fade-in" style="display: none;"></div>
  `;

  const btnConvert = container.querySelector("#btnConvertTemp");
  const resultDiv = container.querySelector("#tempResultContainer");

  function convert() {
    const val = parseFloat(container.querySelector("#tempInputVal").value);
    const from = container.querySelector("#tempFromUnit").value;
    const to = container.querySelector("#tempToUnit").value;

    if (isNaN(val)) {
      alert("Please enter a numeric temperature.");
      return;
    }

    // Standardize to Celsius first
    let celsius;
    if (from === "C") celsius = val;
    else if (from === "F") celsius = (val - 32) * (5 / 9);
    else if (from === "K") celsius = val - 273.15;

    // Convert from Celsius to Target
    let resultVal;
    let formulaText = "";
    if (to === "C") {
      resultVal = celsius;
      formulaText = (from === "F") ? `(${val}°F − 32) × 5/9 = ${resultVal.toFixed(2)}°C` : `${val}K − 273.15 = ${resultVal.toFixed(2)}°C`;
    } else if (to === "F") {
      resultVal = (celsius * 9 / 5) + 32;
      formulaText = (from === "C") ? `(${val}°C × 9/5) + 32 = ${resultVal.toFixed(2)}°F` : `(${val}K − 273.15) × 9/5 + 32 = ${resultVal.toFixed(2)}°F`;
    } else if (to === "K") {
      resultVal = celsius + 273.15;
      formulaText = (from === "C") ? `${val}°C + 273.15 = ${resultVal.toFixed(2)}K` : `(${val}°F − 32) × 5/9 + 273.15 = ${resultVal.toFixed(2)}K`;
    }

    if (from === to) {
      resultVal = val;
      formulaText = `Units are identical (${val}).`;
    }

    const unitSymbols = { C: "°C", F: "°F", K: "K" };

    resultDiv.innerHTML = `
      <div class="result-hero-box">
        <span class="result-hero-label">Converted Temperature</span>
        <div class="result-hero-value" style="color: var(--accent-emerald);">
          ${resultVal.toFixed(2)} ${unitSymbols[to]}
        </div>
      </div>

      <div class="steps-wrapper">
        <h3 class="steps-title">🌡️ Conversion Formula</h3>
        <div class="step-card">
          <span class="step-num-badge">Formula Applied</span>
          <div class="math-formula-box">${formulaText}</div>
          <p class="step-content">
            <b>${val}${unitSymbols[from]}</b> is equivalent to <b>${resultVal.toFixed(2)}${unitSymbols[to]}</b>.
          </p>
        </div>
      </div>
    `;

    resultDiv.style.display = "block";
  }

  btnConvert.addEventListener("click", convert);
  convert();
}

function renderLengthConverter(container, calcDef) {
  const units = {
    m: { name: "Meters (m)", factor: 1 },
    km: { name: "Kilometers (km)", factor: 1000 },
    cm: { name: "Centimeters (cm)", factor: 0.01 },
    mm: { name: "Millimeters (mm)", factor: 0.001 },
    in: { name: "Inches (in)", factor: 0.0254 },
    ft: { name: "Feet (ft)", factor: 0.3048 },
    yd: { name: "Yards (yd)", factor: 0.9144 },
    mi: { name: "Miles (mi)", factor: 1609.344 }
  };

  const optionsHtml = Object.keys(units).map(key => `<option value="${key}">${units[key].name}</option>`).join("");

  container.innerHTML = `
    <div class="form-grid">
      <div class="form-group">
        <label class="form-label" for="lenInputVal">Length / Distance</label>
        <input type="number" id="lenInputVal" class="form-control" value="10" style="border: 1.5px solid var(--border-color); border-radius: var(--radius-md);">
      </div>

      <div class="form-group">
        <label class="form-label" for="lenFromUnit">From Unit</label>
        <select id="lenFromUnit" class="form-control">
          ${optionsHtml}
        </select>
      </div>

      <div class="form-group">
        <label class="form-label" for="lenToUnit">To Unit</label>
        <select id="lenToUnit" class="form-control">
          ${optionsHtml}
        </select>
      </div>
    </div>

    <div class="calc-actions">
      <button type="button" id="btnConvertLen" class="btn btn-primary">
        <span>⚡ Convert Length</span>
      </button>
    </div>

    <div id="lenResultContainer" class="results-section animate-fade-in" style="display: none;"></div>
  `;

  container.querySelector("#lenFromUnit").value = "ft";
  container.querySelector("#lenToUnit").value = "m";

  const btnConvert = container.querySelector("#btnConvertLen");
  const resultDiv = container.querySelector("#lenResultContainer");

  function convert() {
    const val = parseFloat(container.querySelector("#lenInputVal").value);
    const from = container.querySelector("#lenFromUnit").value;
    const to = container.querySelector("#lenToUnit").value;

    if (isNaN(val)) return;

    const meters = val * units[from].factor;
    const result = meters / units[to].factor;

    resultDiv.innerHTML = `
      <div class="result-hero-box">
        <span class="result-hero-label">Converted Length</span>
        <div class="result-hero-value" style="color: var(--accent-emerald);">
          ${result.toFixed(4).replace(/\.?0+$/, '')} ${to}
        </div>
      </div>
      <div class="steps-wrapper">
        <div class="step-card">
          <span class="step-num-badge">Formula</span>
          <p class="step-content">
            <code>${val} ${from} × (${units[from].factor} / ${units[to].factor}) = <b>${result.toFixed(4)} ${to}</b></code>
          </p>
        </div>
      </div>
    `;
    resultDiv.style.display = "block";
  }

  btnConvert.addEventListener("click", convert);
  convert();
}

// Aliases to match clusters.js renderFunction names
function renderTemperatureCalculator(container, calcDef) {
  return renderTemperatureConverter(container, calcDef);
}

function renderLengthCalculator(container, calcDef) {
  return renderLengthConverter(container, calcDef);
}

/* ==========================================================================
   Area & Volume Unit Converter
   ========================================================================== */
function renderAreaVolumeCalculator(container, calcDef) {
  container.innerHTML = `
    <div class="form-grid">
      <div class="form-group">
        <label class="form-label" for="avMeasureType">
          <span>Measurement Type</span>
        </label>
        <select id="avMeasureType" class="form-control">
          <option value="area" selected>Area (2D surfaces)</option>
          <option value="volume">Volume (3D space)</option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label" for="avInputVal">
          <span>Enter Value</span>
        </label>
        <input type="number" id="avInputVal" class="form-control" value="1000" step="any" style="border: 1.5px solid var(--border-color); border-radius: var(--radius-md); background: var(--bg-input); font-size: 1.1rem; font-weight: 700;">
      </div>

      <div class="form-group">
        <label class="form-label" for="avFromUnit">
          <span>From Unit</span>
        </label>
        <select id="avFromUnit" class="form-control"></select>
      </div>

      <div class="form-group">
        <label class="form-label" for="avToUnit">
          <span>To Unit</span>
        </label>
        <select id="avToUnit" class="form-control"></select>
      </div>
    </div>

    <div class="calc-actions">
      <button type="button" id="btnCalcAv" class="btn btn-primary">
        <span>⚡ Convert Area &amp; Volume</span>
      </button>
      <button type="button" id="btnSwapAv" class="btn btn-secondary">
        <span>⇄ Swap Units</span>
      </button>
    </div>

    <div id="avResultContainer" class="results-section animate-fade-in" style="display: none;"></div>
  `;

  const typeSel = container.querySelector("#avMeasureType");
  const fromSel = container.querySelector("#avFromUnit");
  const toSel = container.querySelector("#avToUnit");
  const btnCalc = container.querySelector("#btnCalcAv");
  const btnSwap = container.querySelector("#btnSwapAv");
  const resultDiv = container.querySelector("#avResultContainer");

  // Factors relative to base unit: area = square meters, volume = liters
  const UNITS = {
    area: [
      { key: "sqm", label: "Square Meters (m²)", f: 1 },
      { key: "sqkm", label: "Square Kilometers (km²)", f: 1e6 },
      { key: "sqcm", label: "Square Centimeters (cm²)", f: 1e-4 },
      { key: "sqft", label: "Square Feet (ft²)", f: 0.09290304 },
      { key: "sqyd", label: "Square Yards (yd²)", f: 0.83612736 },
      { key: "sqmi", label: "Square Miles (mi²)", f: 2589988.110336 },
      { key: "acre", label: "Acres", f: 4046.8564224 },
      { key: "hectare", label: "Hectares (ha)", f: 10000 }
    ],
    volume: [
      { key: "l", label: "Liters (L)", f: 1 },
      { key: "ml", label: "Milliliters (mL)", f: 0.001 },
      { key: "m3", label: "Cubic Meters (m³)", f: 1000 },
      { key: "cm3", label: "Cubic Centimeters (mL)", f: 0.001 },
      { key: "galus", label: "US Gallons (gal)", f: 3.785411784 },
      { key: "galuk", label: "Imperial Gallons (gal)", f: 4.54609 },
      { key: "qt", label: "US Quarts (qt)", f: 0.946352946 },
      { key: "pt", label: "US Pints (pt)", f: 0.473176473 },
      { key: "cup", label: "US Cups", f: 0.2365882365 },
      { key: "floz", label: "US Fluid Ounces (fl oz)", f: 0.0295735295625 },
      { key: "ft3", label: "Cubic Feet (ft³)", f: 28.316846592 },
      { key: "in3", label: "Cubic Inches (in³)", f: 0.016387064 }
    ]
  };

  function populateUnits() {
    const type = typeSel.value;
    const options = UNITS[type]
      .map(u => `<option value="${u.key}">${u.label}</option>`)
      .join("");
    fromSel.innerHTML = options;
    toSel.innerHTML = options;
    // Sensible defaults per type
    if (type === "area") {
      fromSel.value = "sqm";
      toSel.value = "sqft";
    } else {
      fromSel.value = "l";
      toSel.value = "galus";
    }
  }

  function findUnit(type, key) {
    return UNITS[type].find(u => u.key === key);
  }

  function calculate() {
    const type = typeSel.value;
    const val = parseFloat(container.querySelector("#avInputVal").value);
    const from = findUnit(type, fromSel.value);
    const to = findUnit(type, toSel.value);

    if (isNaN(val)) {
      alert("Please enter a valid number to convert.");
      return;
    }

    const baseVal = val * from.f;
    const converted = baseVal / to.f;

    const related = UNITS[type]
      .filter(u => u.key !== to.key)
      .slice(0, 4)
      .map(u => `
        <div class="result-stat-card">
          <div class="result-stat-label">${u.label}</div>
          <div class="result-stat-val">${Number((baseVal / u.f).toPrecision(6)).toLocaleString()} ${u.key}</div>
        </div>
      `).join("");

    resultDiv.innerHTML = `
      <div class="result-hero-box">
        <span class="result-hero-label">Converted ${type === "area" ? "Area" : "Volume"}</span>
        <div class="result-hero-value">${Number(converted.toFixed(6)).toLocaleString("en-US", { maximumFractionDigits: 4 })} <span style="font-size: 1.1rem; color: var(--text-secondary); font-weight: 600;">${to.key}</span></div>
        <span style="font-size: 0.95rem; color: var(--text-secondary);">
          ${val} ${from.key} = <b>${Number(converted.toFixed(6)).toLocaleString("en-US", { maximumFractionDigits: 4 })} ${to.key}</b>
        </span>
      </div>

      <div class="steps-wrapper">
        <div class="steps-header">
          <h4 class="steps-title"><span>📐</span> ${type === "area" ? "Area" : "Volume"} Conversion Matrix</h4>
        </div>

        <div class="result-stat-grid">
          ${related}
        </div>

        <div class="step-card" style="margin-top: 1.5rem;">
          <span class="step-num-badge">Conversion Formula</span>
          <div class="math-formula-box">value × (from factor ÷ to factor) = result</div>
          <p class="step-content">
            ${val} × (${from.f} ÷ ${to.f}) = <b>${Number(converted.toFixed(6)).toLocaleString("en-US", { maximumFractionDigits: 4 })} ${to.key}</b>
          </p>
        </div>
      </div>
    `;

    resultDiv.style.display = "block";
  }

  typeSel.addEventListener("change", () => {
    populateUnits();
    calculate();
  });

  btnSwap.addEventListener("click", () => {
    const temp = fromSel.value;
    fromSel.value = toSel.value;
    toSel.value = temp;
    calculate();
  });

  btnCalc.addEventListener("click", calculate);
  fromSel.addEventListener("change", calculate);
  toSel.addEventListener("change", calculate);

  populateUnits();
  calculate();
}

/* ==========================================================================
   Speed & Velocity Unit Converter
   ========================================================================== */
function renderSpeedCalculator(container, calcDef) {
  container.innerHTML = `
    <div class="form-grid">
      <div class="form-group">
        <label class="form-label" for="spdInputVal">
          <span>Enter Speed</span>
        </label>
        <input type="number" id="spdInputVal" class="form-control" value="100" step="any" style="border: 1.5px solid var(--border-color); border-radius: var(--radius-md); background: var(--bg-input); font-size: 1.1rem; font-weight: 700;">
      </div>

      <div class="form-group">
        <label class="form-label" for="spdFromUnit">
          <span>From Unit</span>
        </label>
        <select id="spdFromUnit" class="form-control">
          <option value="kmh" selected>Kilometers/hour (km/h)</option>
          <option value="mph">Miles/hour (mph)</option>
          <option value="ms">Meters/second (m/s)</option>
          <option value="fts">Feet/second (ft/s)</option>
          <option value="knot">Knots (kn)</option>
          <option value="mach">Mach (sea level)</option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label" for="spdToUnit">
          <span>To Unit</span>
        </label>
        <select id="spdToUnit" class="form-control">
          <option value="mph" selected>Miles/hour (mph)</option>
          <option value="kmh">Kilometers/hour (km/h)</option>
          <option value="ms">Meters/second (m/s)</option>
          <option value="fts">Feet/second (ft/s)</option>
          <option value="knot">Knots (kn)</option>
          <option value="mach">Mach (sea level)</option>
        </select>
      </div>
    </div>

    <div class="calc-actions">
      <button type="button" id="btnCalcSpd" class="btn btn-primary">
        <span>⚡ Convert Speed</span>
      </button>
      <button type="button" id="btnSwapSpd" class="btn btn-secondary">
        <span>⇄ Swap Units</span>
      </button>
    </div>

    <div id="spdResultContainer" class="results-section animate-fade-in" style="display: none;"></div>
  `;

  const fromSel = container.querySelector("#spdFromUnit");
  const toSel = container.querySelector("#spdToUnit");
  const btnCalc = container.querySelector("#btnCalcSpd");
  const btnSwap = container.querySelector("#btnSwapSpd");
  const resultDiv = container.querySelector("#spdResultContainer");

  // All factors relative to base unit: meters per second
  const UNITS = {
    kmh: { label: "Kilometers/hour (km/h)", short: "km/h", f: 1 / 3.6 },
    mph: { label: "Miles/hour (mph)", short: "mph", f: 0.44704 },
    ms: { label: "Meters/second (m/s)", short: "m/s", f: 1 },
    fts: { label: "Feet/second (ft/s)", short: "ft/s", f: 0.3048 },
    knot: { label: "Knots (kn)", short: "kn", f: 1852 / 3600 },
    mach: { label: "Mach (sea level, 15°C)", short: "Mach", f: 340.29 }
  };

  function calculate() {
    const val = parseFloat(container.querySelector("#spdInputVal").value);
    const from = UNITS[fromSel.value];
    const to = UNITS[toSel.value];

    if (isNaN(val) || val < 0) {
      alert("Please enter a valid non-negative speed.");
      return;
    }

    const msVal = val * from.f;
    const converted = msVal / to.f;

    const related = Object.entries(UNITS)
      .filter(([k]) => k !== toSel.value)
      .slice(0, 5)
      .map(([k, u]) => `
        <div class="result-stat-card">
          <div class="result-stat-label">${u.label}</div>
          <div class="result-stat-val">${Number((msVal / u.f).toPrecision(6)).toLocaleString()}</div>
        </div>
      `).join("");

    resultDiv.innerHTML = `
      <div class="result-hero-box">
        <span class="result-hero-label">Converted Speed</span>
        <div class="result-hero-value">${Number(converted.toFixed(6)).toLocaleString("en-US", { maximumFractionDigits: 4 })} <span style="font-size: 1.1rem; color: var(--text-secondary); font-weight: 600;">${to.short}</span></div>
        <span style="font-size: 0.95rem; color: var(--text-secondary);">
          ${val} ${from.short} = <b>${Number(converted.toFixed(6)).toLocaleString("en-US", { maximumFractionDigits: 4 })} ${to.short}</b>
        </span>
      </div>

      <div class="steps-wrapper">
        <div class="steps-header">
          <h4 class="steps-title"><span>📐</span> Speed Conversion Matrix</h4>
        </div>

        <div class="result-stat-grid">
          ${related}
        </div>

        <div class="step-card" style="margin-top: 1.5rem;">
          <span class="step-num-badge">Conversion Formula</span>
          <div class="math-formula-box">speed × (from factor ÷ to factor) = result</div>
          <p class="step-content">
            ${val} × (${Number(from.f.toPrecision(6))} ÷ ${Number(to.f.toPrecision(6))}) = <b>${Number(converted.toFixed(6)).toLocaleString("en-US", { maximumFractionDigits: 4 })}</b>
            <br><span style="color: var(--text-muted); font-size: 0.9rem;">Base: 1 km/h = 0.27778 m/s · 1 mph = 0.44704 m/s · 1 knot = 0.51444 m/s · Mach (15°C) = 340.29 m/s</span>
          </p>
        </div>
      </div>
    `;

    resultDiv.style.display = "block";
  }

  btnSwap.addEventListener("click", () => {
    const temp = fromSel.value;
    fromSel.value = toSel.value;
    toSel.value = temp;
    calculate();
  });

  btnCalc.addEventListener("click", calculate);
  fromSel.addEventListener("change", calculate);
  toSel.addEventListener("change", calculate);

  calculate();
}

