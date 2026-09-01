/**
 * ============================================================================
 * Conversion Calculators: Temperature and Length Converters
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

