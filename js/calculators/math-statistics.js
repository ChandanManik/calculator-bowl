/**
 * ============================================================================
 * Statistics & Advanced Math Suite: Mean/Median/Mode, Standard Deviation,
 * Scientific Notation & Exponent / Powers Calculator
 * ============================================================================
 */

// 1. Mean, Median, Mode & Range Calculator
function renderMeanMedianModeCalculator(container, calcDef) {
  container.innerHTML = `
    <div class="form-group" style="margin-bottom: 1.5rem;">
      <label class="form-label" for="mmmDataset">
        <span>Enter Numbers / Data Set</span>
        <span class="form-label-hint">Separate with commas, spaces, or new lines</span>
      </label>
      <textarea id="mmmDataset" class="form-control" rows="3" style="border: 1.5px solid var(--border-color); border-radius: var(--radius-md); background: var(--bg-input); font-family: var(--font-mono); font-size: 1rem; resize: vertical;">12, 15, 12, 18, 20, 24, 12, 30, 25</textarea>
    </div>

    <div class="calc-actions">
      <button type="button" id="btnCalcMMM" class="btn btn-primary">
        <span>⚡ Calculate Statistics</span>
      </button>
      <button type="button" id="btnResetMMM" class="btn btn-secondary">
        <span>↺ Reset</span>
      </button>
      <button type="button" id="btnSampleMMM" class="btn btn-secondary btn-sm" style="margin-left: auto;">
        <span>🎲 Load Example Data</span>
      </button>
    </div>

    <div id="mmmResultContainer" class="results-section animate-fade-in" style="display: none;"></div>
  `;

  const btnCalc = container.querySelector("#btnCalcMMM");
  const btnReset = container.querySelector("#btnResetMMM");
  const btnSample = container.querySelector("#btnSampleMMM");
  const resultDiv = container.querySelector("#mmmResultContainer");
  const textarea = container.querySelector("#mmmDataset");

  btnSample.addEventListener("click", () => {
    textarea.value = "4, 8, 6, 5, 3, 8, 9, 8, 2, 7";
    calculate();
  });

  function calculate() {
    const rawText = textarea.value;
    const nums = rawText.match(/-?\d+(\.\d+)?/g);

    if (!nums || nums.length === 0) {
      alert("Please enter at least two numbers separated by commas or spaces.");
      return;
    }

    const data = nums.map(Number);
    const n = data.length;
    const sorted = [...data].sort((a, b) => a - b);
    
    // Sum & Mean
    const sum = data.reduce((acc, val) => acc + val, 0);
    const mean = sum / n;

    // Median
    let median = 0;
    const mid = Math.floor(n / 2);
    if (n % 2 === 0) {
      median = (sorted[mid - 1] + sorted[mid]) / 2;
    } else {
      median = sorted[mid];
    }

    // Mode
    const freq = {};
    let maxFreq = 0;
    data.forEach(val => {
      freq[val] = (freq[val] || 0) + 1;
      if (freq[val] > maxFreq) maxFreq = freq[val];
    });

    const modes = Object.keys(freq).filter(k => freq[k] === maxFreq).map(Number);
    let modeText = "";
    if (maxFreq === 1 || modes.length === n) {
      modeText = "No mode (all values appear once)";
    } else {
      modeText = `${modes.join(", ")} (Appears ${maxFreq} times)`;
    }

    // Min, Max, Range
    const min = sorted[0];
    const max = sorted[n - 1];
    const range = max - min;

    resultDiv.innerHTML = `
      <div class="result-hero-box">
        <span class="result-hero-label">Central Tendency Summary</span>
        <div class="result-hero-value" style="font-size: 2.1rem;">
          Mean (Average): ${mean % 1 === 0 ? mean : mean.toFixed(4)}
        </div>
        <span style="font-size: 0.95rem; color: var(--text-secondary);">
          Median: <b>${median}</b> | Mode: <b>${modeText}</b> | Count (n): <b>${n}</b>
        </span>
      </div>

      <div class="result-stat-grid">
        <div class="result-stat-card">
          <div class="result-stat-label">Arithmetic Mean (x̄)</div>
          <div class="result-stat-val" style="color: var(--accent-primary);">${mean % 1 === 0 ? mean : mean.toFixed(4)}</div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-label">Median (Middle Value)</div>
          <div class="result-stat-val" style="color: var(--accent-emerald);">${median}</div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-label">Range (Max − Min)</div>
          <div class="result-stat-val">${range} (${min} to ${max})</div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-label">Sum (Σx)</div>
          <div class="result-stat-val">${sum}</div>
        </div>
      </div>

      <div class="steps-wrapper">
        <div class="steps-header">
          <h4 class="steps-title"><span>📐</span> Step-by-Step Statistical Analysis</h4>
        </div>

        <div class="step-card">
          <span class="step-num-badge">Step 1: Order Data Set (Ascending)</span>
          <p class="step-content" style="font-family: var(--font-mono); font-size: 0.92rem; color: var(--accent-primary);">
            [ ${sorted.join(", ")} ] (n = ${n} values)
          </p>
        </div>

        <div class="step-card">
          <span class="step-num-badge">Step 2: Calculate Mean (Average)</span>
          <div class="math-formula-box">\\text{Mean } (\\bar{x}) = \\frac{\\sum x}{n} = \\frac{${sum}}{${n}} = ${mean.toFixed(4)}</div>
        </div>

        <div class="step-card">
          <span class="step-num-badge">Step 3: Determine Median</span>
          <p class="step-content">
            ${n % 2 === 0 
              ? `Since n = ${n} is even, the median is the average of the two middle elements at positions ${mid} and ${mid+1}:<br>
                 Median = (${sorted[mid-1]} + ${sorted[mid]}) / 2 = <b>${median}</b>`
              : `Since n = ${n} is odd, the median is the exact middle element at position ${mid+1}:<br>
                 Median = <b>${median}</b>`
            }
          </p>
        </div>

        <div class="step-card">
          <span class="step-num-badge">Step 4: Find Mode & Range</span>
          <p class="step-content">
            <b>Mode:</b> ${modeText}<br>
            <b>Range:</b> Max (${max}) − Min (${min}) = <b>${range}</b>
          </p>
        </div>
      </div>
    `;

    resultDiv.style.display = "block";
  }

  btnCalc.addEventListener("click", calculate);
  btnReset.addEventListener("click", () => {
    textarea.value = "12, 15, 12, 18, 20, 24, 12, 30, 25";
    resultDiv.style.display = "none";
  });

  calculate();
}

// 2. Standard Deviation & Variance Calculator
function renderStandardDeviationCalculator(container, calcDef) {
  container.innerHTML = `
    <div class="form-group" style="margin-bottom: 1.25rem;">
      <label class="form-label" for="sdDataset">
        <span>Enter Numbers / Dataset</span>
        <span class="form-label-hint">Comma or space separated</span>
      </label>
      <textarea id="sdDataset" class="form-control" rows="3" style="border: 1.5px solid var(--border-color); border-radius: var(--radius-md); background: var(--bg-input); font-family: var(--font-mono); font-size: 1rem; resize: vertical;">10, 12, 23, 23, 16, 23, 21, 16</textarea>
    </div>

    <div class="form-group" style="margin-bottom: 1.5rem; max-width: 320px;">
      <label class="form-label" for="sdType">
        <span>Data Type (Sample vs Population)</span>
      </label>
      <select id="sdType" class="form-control">
        <option value="sample" selected>Sample (n − 1 divisor, s)</option>
        <option value="population">Population (n divisor, σ)</option>
      </select>
    </div>

    <div class="calc-actions">
      <button type="button" id="btnCalcSD" class="btn btn-primary">
        <span>⚡ Calculate Standard Deviation</span>
      </button>
      <button type="button" id="btnResetSD" class="btn btn-secondary">
        <span>↺ Reset</span>
      </button>
    </div>

    <div id="sdResultContainer" class="results-section animate-fade-in" style="display: none;"></div>
  `;

  const btnCalc = container.querySelector("#btnCalcSD");
  const btnReset = container.querySelector("#btnResetSD");
  const resultDiv = container.querySelector("#sdResultContainer");
  const textarea = container.querySelector("#sdDataset");
  const selectType = container.querySelector("#sdType");

  function calculate() {
    const rawText = textarea.value;
    const nums = rawText.match(/-?\d+(\.\d+)?/g);

    if (!nums || nums.length < 2) {
      alert("Please enter at least 2 numbers to compute variance and standard deviation.");
      return;
    }

    const data = nums.map(Number);
    const n = data.length;
    const isSample = selectType.value === "sample";
    const sum = data.reduce((acc, val) => acc + val, 0);
    const mean = sum / n;

    // Sum of squared differences
    let sumSqDiff = 0;
    const diffTableRows = data.map((x, idx) => {
      const diff = x - mean;
      const sqDiff = diff * diff;
      sumSqDiff += sqDiff;
      return `
        <tr>
          <td style="padding: 0.5rem 0.75rem; text-align: center;">${idx + 1}</td>
          <td style="padding: 0.5rem 0.75rem; font-weight: 600;">${x}</td>
          <td style="padding: 0.5rem 0.75rem; font-family: var(--font-mono);">${diff >= 0 ? '+' : ''}${diff.toFixed(4)}</td>
          <td style="padding: 0.5rem 0.75rem; font-family: var(--font-mono); color: var(--accent-primary);">${sqDiff.toFixed(4)}</td>
        </tr>
      `;
    }).join("");

    const divisor = isSample ? (n - 1) : n;
    const variance = sumSqDiff / divisor;
    const stdDev = Math.sqrt(variance);
    const symbol = isSample ? "s" : "σ";
    const varSymbol = isSample ? "s²" : "σ²";

    resultDiv.innerHTML = `
      <div class="result-hero-box">
        <span class="result-hero-label">${isSample ? 'Sample' : 'Population'} Standard Deviation (${symbol})</span>
        <div class="result-hero-value">${stdDev.toFixed(4)}</div>
        <span style="font-size: 0.95rem; color: var(--text-secondary);">
          Variance (${varSymbol}): <b>${variance.toFixed(4)}</b> | Mean (x̄): <b>${mean.toFixed(4)}</b> | n = <b>${n}</b>
        </span>
      </div>

      <div class="result-stat-grid">
        <div class="result-stat-card">
          <div class="result-stat-label">Standard Deviation (${symbol})</div>
          <div class="result-stat-val" style="color: var(--accent-primary);">${stdDev.toFixed(4)}</div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-label">Variance (${varSymbol})</div>
          <div class="result-stat-val" style="color: var(--accent-emerald);">${variance.toFixed(4)}</div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-label">Sum of Squares (SS)</div>
          <div class="result-stat-val">${sumSqDiff.toFixed(4)}</div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-label">Degrees of Freedom (${isSample ? 'n - 1' : 'n'})</div>
          <div class="result-stat-val">${divisor}</div>
        </div>
      </div>

      <div class="steps-wrapper">
        <div class="steps-header">
          <h4 class="steps-title"><span>📐</span> Step-by-Step Deviations from Mean</h4>
        </div>

        <div style="overflow-x: auto; margin-bottom: 1.5rem; border: 1px solid var(--border-color); border-radius: var(--radius-md);">
          <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.88rem;">
            <thead>
              <tr style="background: var(--bg-subtle); border-bottom: 1.5px solid var(--border-color); color: var(--text-primary); font-weight: 700;">
                <th style="padding: 0.6rem 0.75rem; text-align: center;">i</th>
                <th style="padding: 0.6rem 0.75rem;">Value (xᵢ)</th>
                <th style="padding: 0.6rem 0.75rem;">Deviation (xᵢ − x̄)</th>
                <th style="padding: 0.6rem 0.75rem;">Squared Deviation (xᵢ − x̄)²</th>
              </tr>
            </thead>
            <tbody>
              ${diffTableRows}
            </tbody>
            <tfoot>
              <tr style="background: var(--bg-subtle); font-weight: 700; border-top: 1.5px solid var(--border-color);">
                <td colspan="3" style="padding: 0.6rem 0.75rem; text-align: right;">Sum of Squares (SS = Σ(xᵢ − x̄)²):</td>
                <td style="padding: 0.6rem 0.75rem; color: var(--accent-primary); font-family: var(--font-mono);">${sumSqDiff.toFixed(4)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div class="step-card">
          <span class="step-num-badge">Step 1: Compute Variance</span>
          <div class="math-formula-box">${varSymbol} = \\frac{\\sum (x_i - \\bar{x})^2}{${divisor}} = \\frac{${sumSqDiff.toFixed(4)}}{${divisor}} = ${variance.toFixed(4)}</div>
        </div>

        <div class="step-card">
          <span class="step-num-badge">Step 2: Take Square Root for Standard Deviation</span>
          <div class="math-formula-box">${symbol} = \\sqrt{${varSymbol}} = \\sqrt{${variance.toFixed(4)}} = \\mathbf{${stdDev.toFixed(4)}}</div>
        </div>
      </div>
    `;

    resultDiv.style.display = "block";
  }

  btnCalc.addEventListener("click", calculate);
  btnReset.addEventListener("click", () => {
    textarea.value = "10, 12, 23, 23, 16, 23, 21, 16";
    selectType.value = "sample";
    resultDiv.style.display = "none";
  });

  calculate();
}

// 3. Scientific Notation Calculator
function renderScientificNotationCalculator(container, calcDef) {
  container.innerHTML = `
    <div class="form-grid">
      <div class="form-group" style="grid-column: span 2;">
        <label class="form-label" for="snInputNumber">
          <span>Enter Decimal Number or Scientific Notation</span>
          <span class="form-label-hint">e.g., 450000, 0.00078, 3.5e6, or 1.2 x 10^-4</span>
        </label>
        <input type="text" id="snInputNumber" class="form-control" value="0.0004589" style="border: 1.5px solid var(--border-color); border-radius: var(--radius-md); background: var(--bg-input); font-family: var(--font-mono); font-size: 1.1rem;">
      </div>
    </div>

    <div class="calc-actions">
      <button type="button" id="btnCalcSN" class="btn btn-primary">
        <span>⚡ Convert to Scientific Notation</span>
      </button>
      <button type="button" id="btnResetSN" class="btn btn-secondary">
        <span>↺ Reset</span>
      </button>
    </div>

    <div id="snResultContainer" class="results-section animate-fade-in" style="display: none;"></div>
  `;

  const btnCalc = container.querySelector("#btnCalcSN");
  const btnReset = container.querySelector("#btnResetSN");
  const resultDiv = container.querySelector("#snResultContainer");

  function calculate() {
    let raw = container.querySelector("#snInputNumber").value.trim().toLowerCase();
    raw = raw.replace(/\s*x\s*10\^/g, "e").replace(/\s*x\s*10\*\*/g, "e").replace(/\*/g, "");

    const val = parseFloat(raw);
    if (isNaN(val)) {
      alert("Please enter a valid number (e.g., 1500000 or 0.0025).");
      return;
    }

    if (val === 0) {
      resultDiv.innerHTML = `
        <div class="result-hero-box">
          <span class="result-hero-label">Scientific Notation</span>
          <div class="result-hero-value">0 × 10⁰</div>
        </div>
      `;
      resultDiv.style.display = "block";
      return;
    }

    const expStr = val.toExponential();
    const [mantissaStr, expNumStr] = expStr.split("e");
    const exponent = parseInt(expNumStr, 10);
    const mantissa = parseFloat(mantissaStr);

    // Engineering notation (exponent multiple of 3)
    const engExp = Math.floor(exponent / 3) * 3;
    const engMantissa = val / Math.pow(10, engExp);

    resultDiv.innerHTML = `
      <div class="result-hero-box">
        <span class="result-hero-label">Standard Scientific Notation</span>
        <div class="result-hero-value">${mantissa} × 10<sup>${exponent}</sup></div>
        <span style="font-size: 0.95rem; color: var(--text-secondary);">
          Normalized Mantissa (1 ≤ |a| < 10): <b>${mantissa}</b> | Power of 10 (b): <b>${exponent}</b>
        </span>
      </div>

      <div class="result-stat-grid">
        <div class="result-stat-card">
          <div class="result-stat-label">Scientific Notation</div>
          <div class="result-stat-val" style="color: var(--accent-primary);">${mantissa} × 10<sup>${exponent}</sup></div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-label">Engineering Notation</div>
          <div class="result-stat-val" style="color: var(--accent-emerald);">${Number(engMantissa.toFixed(4))} × 10<sup>${engExp}</sup></div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-label">E-Notation (Computer)</div>
          <div class="result-stat-val" style="font-family: var(--font-mono);">${val.toExponential()}</div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-label">Standard Decimal Form</div>
          <div class="result-stat-val">${val.toLocaleString('en-US', { maximumFractionDigits: 12 })}</div>
        </div>
      </div>

      <div class="steps-wrapper">
        <div class="steps-header">
          <h4 class="steps-title"><span>📐</span> Step-by-Step Conversion Breakdown</h4>
        </div>

        <div class="step-card">
          <span class="step-num-badge">Step 1: Identify Decimal Point Shift</span>
          <p class="step-content">
            ${exponent >= 0 
              ? `The number is ≥ 1. Shift the decimal point <b>${exponent} places to the left</b> to create a coefficient between 1 and 10:` 
              : `The number is < 1. Shift the decimal point <b>${Math.abs(exponent)} places to the right</b> to create a coefficient between 1 and 10:`}
            <br>
            Coefficient (<b>a</b>) = <b>${mantissa}</b>
          </p>
        </div>

        <div class="step-card">
          <span class="step-num-badge">Step 2: Express as Power of 10</span>
          <div class="math-formula-box">a \\times 10^b = ${mantissa} \\times 10^{${exponent}}</div>
        </div>
      </div>
    `;

    resultDiv.style.display = "block";
  }

  btnCalc.addEventListener("click", calculate);
  btnReset.addEventListener("click", () => {
    container.querySelector("#snInputNumber").value = "0.0004589";
    resultDiv.style.display = "none";
  });

  calculate();
}

// 4. Exponent & Power Calculator
function renderExponentCalculator(container, calcDef) {
  container.innerHTML = `
    <div class="form-grid">
      <div class="form-group">
        <label class="form-label" for="expBase">
          <span>Base (x)</span>
          <span class="form-label-hint">Any real number</span>
        </label>
        <input type="number" id="expBase" class="form-control" value="2" step="any" style="border: 1.5px solid var(--border-color); border-radius: var(--radius-md); background: var(--bg-input);">
      </div>

      <div class="form-group">
        <label class="form-label" for="expPower">
          <span>Exponent / Power (y)</span>
          <span class="form-label-hint">Positive, negative, or fraction</span>
        </label>
        <input type="number" id="expPower" class="form-control" value="8" step="any" style="border: 1.5px solid var(--border-color); border-radius: var(--radius-md); background: var(--bg-input);">
      </div>
    </div>

    <div class="calc-actions">
      <button type="button" id="btnCalcExp" class="btn btn-primary">
        <span>⚡ Calculate Power (xʸ)</span>
      </button>
      <button type="button" id="btnResetExp" class="btn btn-secondary">
        <span>↺ Reset</span>
      </button>
    </div>

    <div id="expResultContainer" class="results-section animate-fade-in" style="display: none;"></div>
  `;

  const btnCalc = container.querySelector("#btnCalcExp");
  const btnReset = container.querySelector("#btnResetExp");
  const resultDiv = container.querySelector("#expResultContainer");

  function calculate() {
    const base = parseFloat(container.querySelector("#expBase").value);
    const exponent = parseFloat(container.querySelector("#expPower").value);

    if (isNaN(base) || isNaN(exponent)) {
      alert("Please enter valid numbers for Base and Exponent.");
      return;
    }

    const result = Math.pow(base, exponent);

    resultDiv.innerHTML = `
      <div class="result-hero-box">
        <span class="result-hero-label">Result (${base}<sup>${exponent}</sup>)</span>
        <div class="result-hero-value">${Number.isFinite(result) ? result.toLocaleString('en-US', { maximumFractionDigits: 8 }) : result}</div>
        <span style="font-size: 0.95rem; color: var(--text-secondary);">
          Scientific Form: <b>${result.toExponential(6)}</b>
        </span>
      </div>

      <div class="steps-wrapper">
        <div class="steps-header">
          <h4 class="steps-title"><span>📐</span> Mathematical Exponent Rules Applied</h4>
        </div>

        <div class="step-card">
          <span class="step-num-badge">Rule Explanation</span>
          <p class="step-content">
            ${exponent === 0 ? `Any non-zero base raised to the power of 0 equals 1: <b>x⁰ = 1</b>` :
              exponent < 0 ? `Negative exponent rule: <b>x⁻ⁿ = 1 / xⁿ</b>. Therefore, ${base}<sup>${exponent}</sup> = 1 / (${base}<sup>${Math.abs(exponent)}</sup>)` :
              Number.isInteger(exponent) ? `Multiplying the base ${base} by itself ${exponent} times.` :
              `Fractional power represents roots: <b>x^(p/q) = ᵠ√(xᵖ)</b>`}
          </p>
        </div>
      </div>
    `;

    resultDiv.style.display = "block";
  }

  btnCalc.addEventListener("click", calculate);
  btnReset.addEventListener("click", () => {
    container.querySelector("#expBase").value = "2";
    container.querySelector("#expPower").value = "8";
    resultDiv.style.display = "none";
  });

  calculate();
}
