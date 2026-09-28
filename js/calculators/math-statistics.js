/**
 * ============================================================================
 * Statistics & Advanced Math Suite: Mean/Median/Mode, Standard Deviation,
 * Scientific Notation, Exponent / Powers Calculator, and
 * Combination & Permutation Calculator (nCr / nPr / factorial)
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

/* ==========================================================================
   Combination & Permutation Calculator — nCr, nPr, factorial
   ========================================================================== */
function renderCombinationCalculator(container, calcDef) {
  container.innerHTML = `
    <div class="form-grid">
      <div class="form-group">
        <label class="form-label" for="cmbMode">Calculation</label>
        <select id="cmbMode" class="form-control">
          <option value="ncr" selected>Combination — nCr (order does NOT matter)</option>
          <option value="npr">Permutation — nPr (order matters)</option>
          <option value="fact">Factorial — n!</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label" for="cmbN">Total items (n)</label>
        <input type="number" id="cmbN" class="form-control" value="52" min="0" step="1">
      </div>
      <div class="form-group" id="cmbRGroup">
        <label class="form-label" for="cmbR">Choose / arrange (r)</label>
        <input type="number" id="cmbR" class="form-control" value="5" min="0" step="1">
      </div>
    </div>

    <div class="calc-actions">
      <button type="button" id="btnCalcCmb" class="btn btn-primary"><span>🎲 Calculate</span></button>
      <button type="button" id="btnResetCmb" class="btn btn-secondary"><span>↺ Reset</span></button>
    </div>

    <div id="cmbResultContainer" class="results-section animate-fade-in" style="display: none; margin-top: 2rem;"></div>
  `;

  const modeSel = container.querySelector("#cmbMode");
  const nInput = container.querySelector("#cmbN");
  const rInput = container.querySelector("#cmbR");
  const rGroup = container.querySelector("#cmbRGroup");
  const resultDiv = container.querySelector("#cmbResultContainer");

  function factorial(n) {
    let r = 1;
    for (let i = 2; i <= n; i++) r *= i;
    return r;
  }
  function nCr(n, r) {
    const k = Math.min(r, n - r);
    let res = 1;
    for (let i = 1; i <= k; i++) res = res * (n - k + i) / i;
    return res;
  }
  function nPr(n, r) {
    let res = 1;
    for (let i = 0; i < r; i++) res *= (n - i);
    return res;
  }
  function fmtBig(x) {
    if (!isFinite(x)) return "Overflow";
    if (Number.isInteger(x) && Math.abs(x) < 9.007e15) return x.toLocaleString("en-US");
    if (Math.abs(x) >= 1e15) return x.toExponential(6);
    return String(Number(x.toPrecision(10)));
  }
  function expansion(n, r) {
    const terms = [];
    for (let i = 0; i < r; i++) terms.push(n - i);
    return terms.join(" × ");
  }

  function calculate(ev) {
    const mode = modeSel.value;
    const n = parseInt(nInput.value, 10);
    if (isNaN(n) || n < 0) { alert("Please enter a non-negative whole number for n."); return; }
    if (mode !== "fact") {
      if (n > 1000) { alert("n is capped at 1,000 to keep results meaningful."); return; }
    } else if (n > 170) {
      alert("Factorial is capped at 170 — 171! exceeds double-precision (≈ 1.04 × 10³⁰⁸).");
      return;
    }

    let heroLabel = "", heroValue = "", sub = "", stats = "", steps = "";

    if (mode === "ncr") {
      const r = parseInt(rInput.value, 10);
      if (isNaN(r) || r < 0) { alert("Please enter a non-negative whole number for r."); return; }
      if (r > n) {
        resultDiv.innerHTML = `
          <div class="result-hero-box">
            <span class="result-hero-label">${n} Choose ${r} (nCr)</span>
            <div class="result-hero-value" style="font-size: 1.5rem;">0</div>
            <span style="font-size: 0.95rem; color: var(--text-secondary);">
              Choosing more items than exist is impossible — nCr = 0 when r &gt; n.
            </span>
          </div>`;
        resultDiv.style.display = "block";
        return;
      }
      const k = Math.min(r, n - r);
      const val = nCr(n, r);
      const perm = nPr(n, r);
      const rf = factorial(r);

      heroLabel = `${n} Choose ${r} (nCr)`;
      heroValue = fmtBig(val);
      sub = `${n}! ÷ (${r}! × ${n - r}!)`;

      stats = `
        <div class="result-stat-card"><div class="result-stat-label">n (total)</div>
          <div class="result-stat-val">${n.toLocaleString()}</div></div>
        <div class="result-stat-card"><div class="result-stat-label">r (choose)</div>
          <div class="result-stat-val">${r.toLocaleString()}</div></div>
        <div class="result-stat-card"><div class="result-stat-label">k = min(r, n−r)</div>
          <div class="result-stat-val" style="color: var(--accent-emerald);">${k}</div></div>
        <div class="result-stat-card"><div class="result-stat-label">Permutation nPr</div>
          <div class="result-stat-val">${fmtBig(perm)}</div></div>
        <div class="result-stat-card"><div class="result-stat-label">r! factorial</div>
          <div class="result-stat-val">${fmtBig(rf)}</div></div>
        <div class="result-stat-card"><div class="result-stat-label">(n−r)! factorial</div>
          <div class="result-stat-val">${fmtBig(factorial(n - r))}</div></div>
        <div class="result-stat-card"><div class="result-stat-label">Read as</div>
          <div class="result-stat-val" style="font-size: 1rem;">"${n} pick ${r}"</div></div>
        <div class="result-stat-card"><div class="result-stat-label">nPr ÷ nCr = r!</div>
          <div class="result-stat-val" style="font-size: 1rem;">${fmtBig(perm)} ÷ ${fmtBig(val)} = ${fmtBig(rf)}</div></div>`;

      steps = `
        <div class="step-card">
          <span class="step-num-badge">Step 1 — Complement Reduction</span>
          <div class="math-formula-box">C(n, r) = C(n, n−r) → use k = min(r, n−r) = ${k}</div>
          <p class="step-content">Choosing ${r} of ${n} is identical to discarding ${n - r} — the smaller k keeps the arithmetic short.</p>
        </div>
        <div class="step-card">
          <span class="step-num-badge">Step 2 — Multiplicative Formula</span>
          <div class="math-formula-box">${k <= 9 ? `${expansion(n, k)} ÷ ${k}!` : `C = Π (n−k+i)/i for i = 1…${k}`}</div>
          <p class="step-content">${k <= 9 ? `${expansion(n, k)} = ${fmtBig(nPr(n, k))} numerator · ${k}! = ${fmtBig(factorial(k))} denominator → ${fmtBig(nPr(n, k))} ÷ ${fmtBig(factorial(k))} = <b>${fmtBig(val)}</b>` : `Evaluated iteratively (res = res × (n−k+i) ÷ i) keeping every intermediate value an integer → <b>${fmtBig(val)}</b>`}</p>
        </div>
        <div class="step-card">
          <span class="step-num-badge">Step 3 — Order Check</span>
          <div class="math-formula-box">nPr = nCr × r! = ${fmtBig(val)} × ${fmtBig(rf)} = ${fmtBig(perm)}</div>
          <p class="step-content">Use <b>nCr</b> when the selection is a team/committee (order irrelevant); use <b>nPr</b> when it is a ranking/password/pin (order relevant).</p>
        </div>`;
    } else if (mode === "npr") {
      const r = parseInt(rInput.value, 10);
      if (isNaN(r) || r < 0) { alert("Please enter a non-negative whole number for r."); return; }
      if (r > n) {
        resultDiv.innerHTML = `
          <div class="result-hero-box">
            <span class="result-hero-label">${n} Permute ${r} (nPr)</span>
            <div class="result-hero-value" style="font-size: 1.5rem;">0</div>
            <span style="font-size: 0.95rem; color: var(--text-secondary);">
              Arranging more slots than items is impossible — nPr = 0 when r &gt; n.
            </span>
          </div>`;
        resultDiv.style.display = "block";
        return;
      }
      const val = nPr(n, r);
      const comb = nCr(n, r);
      const rf = factorial(r);

      heroLabel = `${n} Permute ${r} (nPr)`;
      heroValue = fmtBig(val);
      sub = `${n}! ÷ (${n - r}!)`;

      stats = `
        <div class="result-stat-card"><div class="result-stat-label">n (total)</div>
          <div class="result-stat-val">${n.toLocaleString()}</div></div>
        <div class="result-stat-card"><div class="result-stat-label">r (arrange)</div>
          <div class="result-stat-val">${r.toLocaleString()}</div></div>
        <div class="result-stat-card"><div class="result-stat-label">Combination nCr</div>
          <div class="result-stat-val" style="color: var(--accent-emerald);">${fmtBig(comb)}</div></div>
        <div class="result-stat-card"><div class="result-stat-label">r! ways to reorder</div>
          <div class="result-stat-val">${fmtBig(rf)}</div></div>
        <div class="result-stat-card"><div class="result-stat-label">(n−r)!</div>
          <div class="result-stat-val">${fmtBig(factorial(n - r))}</div></div>
        <div class="result-stat-card"><div class="result-stat-label">Read as</div>
          <div class="result-stat-val" style="font-size: 1rem;">"${n} arrangements of ${r}"</div></div>
        <div class="result-stat-card"><div class="result-stat-label">nCr × r! = nPr</div>
          <div class="result-stat-val" style="font-size: 1rem;">${fmtBig(comb)} × ${fmtBig(rf)}</div></div>
        <div class="result-stat-card"><div class="result-stat-label">Last factor</div>
          <div class="result-stat-val">${n - r + 1}${r === 0 ? "" : " … " + n}</div></div>`;

      steps = `
        <div class="step-card">
          <span class="step-num-badge">Step 1 — Falling Factorial</span>
          <div class="math-formula-box">nPr = n × (n−1) × … × (n−r+1)${r <= 9 ? ` = ${expansion(n, r)}` : ` (${r} factors)`}</div>
          <p class="step-content">${r === 0 ? "Arranging zero positions gives exactly 1 (empty arrangement)." : r <= 9 ? `Each position has one fewer choice than the last: ${expansion(n, r)} = <b>${fmtBig(val)}</b>` : `Computed iteratively as res ×= (n−i) for i = 0…${r - 1} → <b>${fmtBig(val)}</b>`}</p>
        </div>
        <div class="step-card">
          <span class="step-num-badge">Step 2 — Factorial Form</span>
          <div class="math-formula-box">nPr = n! ÷ (n−r)! = ${fmtBig(factorial(n))} ÷ ${fmtBig(factorial(n - r))}</div>
          <p class="step-content">The tail factorials cancel — that is why the running product avoids huge intermediate numbers.</p>
        </div>
        <div class="step-card">
          <span class="step-num-badge">Step 3 — Combinations Link</span>
          <div class="math-formula-box">nPr = nCr × r! = ${fmtBig(comb)} × ${fmtBig(rf)} = ${fmtBig(val)}</div>
          <p class="step-content">Permutations count every ordering separately; dividing by r! collapses them into unordered groups (combinations).</p>
        </div>`;
    } else {
      const val = factorial(n);
      let digits = 0;
      if (n > 0) {
        let logSum = 0;
        for (let i = 2; i <= n; i++) logSum += Math.log10(i);
        digits = Math.floor(logSum) + 1;
      } else {
        digits = 1;
      }
      let zeros = 0;
      for (let p = 5; p <= n; p *= 5) zeros += Math.floor(n / p);

      heroLabel = `${n} Factorial (n!)`;
      heroValue = fmtBig(val);
      sub = n === 0 ? "0! = 1 by definition (empty product)" : `${n} × ${n - 1} × … × 1`;

      stats = `
        <div class="result-stat-card"><div class="result-stat-label">Digits</div>
          <div class="result-stat-val" style="color: var(--accent-emerald);">${digits.toLocaleString()}</div></div>
        <div class="result-stat-card"><div class="result-stat-label">Trailing zeros</div>
          <div class="result-stat-val">${zeros.toLocaleString()}</div></div>
        <div class="result-stat-card"><div class="result-stat-label">(n−1)!</div>
          <div class="result-stat-val">${n >= 1 ? fmtBig(factorial(n - 1)) : "—"}</div></div>
        <div class="result-stat-card"><div class="result-stat-label">Scientific form</div>
          <div class="result-stat-val" style="font-size: 1rem;">${val >= 1e6 || val === 0 ? val.toExponential(4) : fmtBig(val)}</div></div>
        <div class="result-stat-card"><div class="result-stat-label">n! ÷ n = (n−1)!</div>
          <div class="result-stat-val" style="font-size: 1rem;">${n >= 1 ? fmtBig(val / n) : "—"}</div></div>
        <div class="result-stat-card"><div class="result-stat-label">Double-precision cap</div>
          <div class="result-stat-val">170! max</div></div>`;

      steps = `
        <div class="step-card">
          <span class="step-num-badge">Step 1 — Definition</span>
          <div class="math-formula-box">n! = n × (n−1) × … × 2 × 1, with 0! = 1</div>
          <p class="step-content">${n === 0 ? "By convention 0! = 1 — the empty product, and it makes nCr formulas work for r = 0 and r = n." : n <= 20 ? `${n}! = ${Array.from({ length: n }, (_, i) => n - i).join(" × ")}${n > 1 ? " = " + fmtBig(val) : ""}` : `${n}! evaluated iteratively — the value has ${digits.toLocaleString()} digits and ${zeros.toLocaleString()} trailing zeros (each pair of 2 × 5 contributes one zero).`}</p>
        </div>
        <div class="step-card">
          <span class="step-num-badge">Step 2 — Trailing-Zero Rule</span>
          <div class="math-formula-box">zeros = ⌊n/5⌋ + ⌊n/25⌋ + ⌊n/125⌋ + …</div>
          <p class="step-content">Fives are the scarce factor (twos are plentiful) → for n = ${n}: ${zeros.toLocaleString()} zero${zeros === 1 ? "" : "s"} at the end of ${fmtBig(val)}.</p>
        </div>`;
    }

    resultDiv.innerHTML = `
      <div class="result-hero-box">
        <span class="result-hero-label">${heroLabel}</span>
        <div class="result-hero-value" style="font-size: 1.5rem;">${heroValue}</div>
        <span style="font-size: 0.95rem; color: var(--text-secondary);">${sub}</span>
      </div>
      <div class="result-stat-grid">${stats}</div>
      <div class="steps-wrapper" style="margin-top: 2rem;">
        <div class="steps-header"><h3 class="steps-title">📐 Calculation Breakdown</h3></div>
        ${steps}
      </div>`;

    resultDiv.style.display = "block";
    if (ev && ev.type === "click") resultDiv.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function syncMode() {
    const isFact = modeSel.value === "fact";
    rGroup.style.display = isFact ? "none" : "";
    nInput.previousElementSibling && (nInput.previousElementSibling.textContent = isFact ? "Value (n)" : "Total items (n)");
  }

  modeSel.addEventListener("change", () => { syncMode(); calculate(); });
  nInput.addEventListener("change", calculate);
  rInput.addEventListener("change", calculate);
  container.querySelector("#btnCalcCmb").addEventListener("click", calculate);
  container.querySelector("#btnResetCmb").addEventListener("click", () => {
    modeSel.value = "ncr";
    nInput.value = "52";
    rInput.value = "5";
    syncMode();
    resultDiv.style.display = "none";
  });

  syncMode();
  calculate();
}

/* ============================================================================
 * Probability Calculator — single-event probability & dice-sum probability
 * ========================================================================== */
function renderProbabilityCalculator(container, calcDef) {
  container.innerHTML = `
    <div class="form-grid">
      <div class="form-group">
        <label class="form-label" for="probMode">Mode</label>
        <select id="probMode" class="form-control">
          <option value="single" selected>Single event — favorable ÷ total</option>
          <option value="dice">Dice sum — chance of rolling a total</option>
        </select>
      </div>
      <div class="form-group" id="probFavGroup">
        <label class="form-label" for="probFav">Favorable Outcomes</label>
        <input type="number" id="probFav" class="form-control" value="25" min="0" step="1">
      </div>
      <div class="form-group" id="probTotalGroup">
        <label class="form-label" for="probTotal">Total Possible Outcomes</label>
        <input type="number" id="probTotal" class="form-control" value="100" min="1" step="1">
      </div>
      <div class="form-group" id="probDiceGroup" style="display: none;">
        <label class="form-label" for="probDice">Number of Dice</label>
        <select id="probDice" class="form-control">
          <option value="1">1 die</option>
          <option value="2" selected>2 dice</option>
          <option value="3">3 dice</option>
          <option value="4">4 dice</option>
        </select>
      </div>
      <div class="form-group" id="probTargetGroup" style="display: none;">
        <label class="form-label" for="probTarget">Target Sum</label>
        <input type="number" id="probTarget" class="form-control" value="7" step="1">
      </div>
    </div>

    <div class="calc-actions">
      <button type="button" id="btnCalcProb" class="btn btn-primary"><span>🎲 Calculate Probability</span></button>
      <button type="button" id="btnResetProb" class="btn btn-secondary"><span>↺ Reset</span></button>
    </div>

    <div id="probResultContainer" class="results-section animate-fade-in" style="display: none; margin-top: 2rem;"></div>
  `;

  const modeSel = container.querySelector("#probMode");
  const favInput = container.querySelector("#probFav");
  const totalInput = container.querySelector("#probTotal");
  const diceSel = container.querySelector("#probDice");
  const targetInput = container.querySelector("#probTarget");
  const resultDiv = container.querySelector("#probResultContainer");

  function syncMode() {
    const single = modeSel.value === "single";
    container.querySelector("#probFavGroup").style.display = single ? "" : "none";
    container.querySelector("#probTotalGroup").style.display = single ? "" : "none";
    container.querySelector("#probDiceGroup").style.display = single ? "none" : "";
    container.querySelector("#probTargetGroup").style.display = single ? "none" : "";
  }

  const fmtPct = (p) => (p * 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // Dice-sum distribution: counts of each total for n fair dice (iterative convolution)
  function diceDistribution(n) {
    let counts = [1]; // 0 dice → sum 0
    for (let d = 0; d < n; d++) {
      const next = new Array(counts.length + 6).fill(0);
      for (let s = 0; s < counts.length; s++) {
        for (let face = 1; face <= 6; face++) next[s + face] += counts[s];
      }
      counts = next;
    }
    return counts; // counts[sum] = number of ways
  }

  function calculate(ev) {
    const mode = modeSel.value;
    let p, formula, subst, rows = "", favorable, totalWays;

    if (mode === "single") {
      const fav = parseFloat(favInput.value);
      const total = parseFloat(totalInput.value);
      if (isNaN(fav) || fav < 0) { alert("Please enter a valid number of favorable outcomes."); return; }
      if (!(total > 0)) { alert("Please enter a total greater than zero."); return; }
      if (fav > total) { alert("Favorable outcomes cannot exceed the total possible outcomes."); return; }

      favorable = fav;
      totalWays = total;
      p = total === 0 ? 0 : fav / total;
      formula = "P(A) = favorable outcomes ÷ total possible outcomes";
      subst = `${fav} ÷ ${total} = ${fmtPct(p)}%`;
      rows = `<tr>
          <td style="padding: 0.3rem 0.7rem; border-bottom: 1px solid var(--border-color);">P(A) — event happens</td>
          <td style="padding: 0.3rem 0.7rem; border-bottom: 1px solid var(--border-color); text-align: right;"><b>${fmtPct(p)}%</b></td>
        </tr>
        <tr>
          <td style="padding: 0.3rem 0.7rem; border-bottom: 1px solid var(--border-color);">P(not A) — complement</td>
          <td style="padding: 0.3rem 0.7rem; border-bottom: 1px solid var(--border-color); text-align: right;">${fmtPct(1 - p)}%</td>
        </tr>`;
    } else {
      const n = parseInt(diceSel.value, 10);
      const target = parseInt(targetInput.value, 10);
      if (isNaN(target) || target < n || target > n * 6) {
        alert(`With ${n} dice the sum must be between ${n} and ${n * 6}.`);
        return;
      }
      const dist = diceDistribution(n);
      favorable = dist[target];
      totalWays = Math.pow(6, n);
      p = favorable / totalWays;
      formula = "P(sum) = ways to hit the total ÷ 6^n";
      subst = `${favorable} ÷ ${Math.pow(6, n)} = ${fmtPct(p)}%`;
      for (let s = n; s <= n * 6; s++) {
        const hit = s === target;
        rows += `<tr style="${hit ? "background: var(--bg-subtle);" : ""}">
            <td style="padding: 0.3rem 0.7rem; border-bottom: 1px solid var(--border-color);">${hit ? "➜ " : ""}Sum of ${s}</td>
            <td style="padding: 0.3rem 0.7rem; border-bottom: 1px solid var(--border-color); text-align: right;">${dist[s]} way${dist[s] === 1 ? "" : "s"} (${fmtPct(dist[s] / totalWays)}%)</td>
          </tr>`;
      }
    }

    const oneIn = p > 0 ? (1 / p) : Infinity;
    const odds = p > 0 ? `${favorable}:${Math.max(totalWays - favorable, 0)}` : "0";

    resultDiv.innerHTML = `
      <div class="result-stat-grid">
        <div class="result-stat-card">
          <div class="result-stat-label">Probability</div>
          <div class="result-stat-val" style="color: var(--accent-emerald);">${fmtPct(p)}%</div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-label">Odds (favorable : rest)</div>
          <div class="result-stat-val">${odds}</div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-label">Chance</div>
          <div class="result-stat-val">${isFinite(oneIn) ? `1 in ${Math.round(oneIn * 100) / 100}` : "never"}</div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-label">Complement P(not A)</div>
          <div class="result-stat-val">${fmtPct(1 - p)}%</div>
        </div>
      </div>

      <div class="steps-wrapper" style="margin-top: 2rem;">
        <div class="steps-header"><h3 class="steps-title">📊 Probability Breakdown</h3></div>
        <div class="step-card">
          <span class="step-num-badge">Step 1 — Formula</span>
          <div class="math-formula-box">${formula}</div>
          <p class="step-content">${subst} → the event hits about <b>${isFinite(oneIn) ? `1 time in ${Math.round(oneIn * 100) / 100}` : "never"}</b> on average.</p>
        </div>
        <div class="step-card">
          <span class="step-num-badge">Step 2 — Complement rule</span>
          <div class="math-formula-box">P(not A) = 1 − P(A)</div>
          <p class="step-content">1 − ${fmtPct(p)}% = <b>${fmtPct(1 - p)}%</b> — use this when the "fails" case is easier to count than the "hits" case.</p>
        </div>
        <div class="step-card">
          <span class="step-num-badge">Step 3 — ${mode === "dice" ? "Full dice-sum distribution" : "Outcome count"}</span>
          <div style="margin-top: 0.6rem;">
            <table style="width: 100%; border-collapse: collapse;">${rows}</table>
          </div>
        </div>
      </div>
    `;

    resultDiv.style.display = "block";
    if (ev && ev.type === "click") resultDiv.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  modeSel.addEventListener("change", () => { syncMode(); calculate(); });
  [favInput, totalInput, targetInput].forEach(el => el.addEventListener("input", calculate));
  diceSel.addEventListener("change", calculate);
  container.querySelector("#btnCalcProb").addEventListener("click", calculate);
  container.querySelector("#btnResetProb").addEventListener("click", () => {
    modeSel.value = "single";
    favInput.value = "25";
    totalInput.value = "100";
    diceSel.value = "2";
    targetInput.value = "7";
    syncMode();
    resultDiv.style.display = "none";
  });

  syncMode();
  calculate();
}
