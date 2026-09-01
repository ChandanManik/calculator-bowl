/**
 * ============================================================================
 * Advanced Math & Fractions Calculators:
 * 1. Fraction to Decimal Calculator
 * 2. Decimal to Fraction Calculator
 * 3. Mixed Numbers Calculator
 * 4. GCF & LCM Calculator
 * 5. Prime Factorization & Factor Tree Calculator
 * 6. Ratio & Proportion Calculator
 * ============================================================================
 */

/* --------------------------------------------------------------------------
   Common Math Utilities
   -------------------------------------------------------------------------- */
function mathGcd(a, b) {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) {
    let t = b;
    b = a % b;
    a = t;
  }
  return a || 1;
}

function mathLcm(a, b) {
  if (!a || !b) return 0;
  return Math.abs(Math.round(a * b)) / mathGcd(a, b);
}

function mathMultiGcd(arr) {
  if (!arr || arr.length === 0) return 1;
  let res = arr[0];
  for (let i = 1; i < arr.length; i++) {
    res = mathGcd(res, arr[i]);
  }
  return res;
}

function mathMultiLcm(arr) {
  if (!arr || arr.length === 0) return 0;
  let res = arr[0];
  for (let i = 1; i < arr.length; i++) {
    res = mathLcm(res, arr[i]);
  }
  return res;
}

function getPrimeFactors(n) {
  n = Math.abs(Math.round(n));
  const factors = [];
  if (n < 2) return factors;
  
  let d = 2;
  while (d * d <= n) {
    while (n % d === 0) {
      factors.push(d);
      n = Math.floor(n / d);
    }
    d = (d === 2) ? 3 : d + 2;
  }
  if (n > 1) {
    factors.push(n);
  }
  return factors;
}

/* ==========================================================================
   1. Fraction to Decimal Calculator (fraction-to-decimal)
   ========================================================================== */
function renderFractionToDecimalCalculator(container, calcDef) {
  container.innerHTML = `
    <div class="calc-tool-card">
      <div style="display: flex; align-items: center; justify-content: center; gap: 1rem; flex-wrap: wrap; margin-bottom: 2rem; background: var(--bg-subtle); padding: 1.5rem; border-radius: var(--radius-lg); border: 1px solid var(--border-color);">
        
        <!-- Whole Number (Optional) -->
        <div style="display: flex; flex-direction: column; align-items: center;">
          <label class="form-label" for="f2dWhole" style="margin-bottom: 0.35rem; font-size: 0.82rem;">Whole (Opt.)</label>
          <input type="number" id="f2dWhole" class="form-control" placeholder="0" style="width: 85px; text-align: center; font-weight: 700; font-size: 1.1rem; border: 1.5px solid var(--border-color);">
        </div>

        <!-- Fraction Numerator / Denominator -->
        <div style="display: flex; flex-direction: column; align-items: center;">
          <label class="form-label" style="margin-bottom: 0.35rem; font-size: 0.82rem;">Fraction</label>
          <div style="display: flex; flex-direction: column; gap: 0.35rem; width: 95px;">
            <input type="number" id="f2dNum" class="form-control" value="5" style="text-align: center; font-weight: 700; font-size: 1.1rem; border: 1.5px solid var(--border-color);" placeholder="Num">
            <div style="height: 3px; background: var(--text-primary); border-radius: 2px;"></div>
            <input type="number" id="f2dDen" class="form-control" value="8" style="text-align: center; font-weight: 700; font-size: 1.1rem; border: 1.5px solid var(--border-color);" placeholder="Den">
          </div>
        </div>

        <!-- Precision Selector -->
        <div style="display: flex; flex-direction: column; align-items: center;">
          <label class="form-label" for="f2dPrecision" style="margin-bottom: 0.35rem; font-size: 0.82rem;">Decimal Places</label>
          <select id="f2dPrecision" class="form-control" style="width: 100px; text-align: center;">
            <option value="auto">Auto</option>
            <option value="2">2 places</option>
            <option value="4" selected>4 places</option>
            <option value="6">6 places</option>
            <option value="8">8 places</option>
          </select>
        </div>
      </div>

      <div class="calc-actions">
        <button type="button" id="btnCalcF2D" class="btn btn-primary">
          <span>⚡ Convert to Decimal</span>
        </button>
        <button type="button" id="btnResetF2D" class="btn btn-secondary">
          <span>↺ Reset</span>
        </button>
      </div>

      <div id="f2dResultContainer" class="results-section animate-fade-in" style="display: none; margin-top: 2rem;"></div>
    </div>
  `;

  const btnCalc = container.querySelector("#btnCalcF2D");
  const btnReset = container.querySelector("#btnResetF2D");
  const resultDiv = container.querySelector("#f2dResultContainer");

  function calculate() {
    const whole = parseInt(container.querySelector("#f2dWhole").value) || 0;
    const num = parseInt(container.querySelector("#f2dNum").value);
    const den = parseInt(container.querySelector("#f2dDen").value);
    const precisionChoice = container.querySelector("#f2dPrecision").value;

    if (isNaN(num) || isNaN(den)) {
      alert("Please enter valid numerator and denominator integers.");
      return;
    }

    if (den === 0) {
      alert("Error: Division by zero is undefined. The denominator cannot be 0.");
      return;
    }

    // Improper numerator calculation
    const isNegative = (whole < 0) || (num < 0 && den > 0) || (num > 0 && den < 0);
    const absWhole = Math.abs(whole);
    const absNum = Math.abs(num);
    const absDen = Math.abs(den);

    const totalNum = absWhole * absDen + absNum;
    const decimalValue = (isNegative ? -1 : 1) * (totalNum / absDen);

    // Detect repeating decimal
    const repInfo = detectRepeatingDecimal(totalNum, absDen);
    let decimalStr = "";
    if (precisionChoice === "auto") {
      if (repInfo.isRepeating) {
        decimalStr = (isNegative ? "-" : "") + repInfo.formatted;
      } else {
        decimalStr = decimalValue.toString();
      }
    } else {
      const p = parseInt(precisionChoice);
      decimalStr = decimalValue.toFixed(p);
    }

    const percentValue = (decimalValue * 100).toFixed(4).replace(/\.?0+$/, "") + "%";
    const g = mathGcd(totalNum, absDen);
    const simpNum = totalNum / g;
    const simpDen = absDen / g;

    resultDiv.style.display = "block";
    resultDiv.innerHTML = `
      <div class="results-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); margin-bottom: 1.5rem;">
        <div class="result-card featured">
          <span class="result-label">Decimal Value</span>
          <div class="result-value" style="font-size: 1.85rem; color: var(--accent-primary);">${decimalStr}</div>
          <span class="result-subtext">${repInfo.isRepeating ? "Repeating / Recurring Decimal" : "Terminating Decimal"}</span>
        </div>

        <div class="result-card">
          <span class="result-label">Percentage Equivalent</span>
          <div class="result-value" style="color: var(--color-success);">${percentValue}</div>
          <span class="result-subtext">Base 100 ratio</span>
        </div>

        <div class="result-card">
          <span class="result-label">Simplified Fraction</span>
          <div class="result-value" style="color: var(--accent-secondary);">${isNegative ? "-" : ""}${simpNum} / ${simpDen}</div>
          <span class="result-subtext">${absWhole > 0 ? `Mixed: ${isNegative ? "-" : ""}${absWhole} ${absNum / g}/${absDen / g}` : "Lowest terms"}</span>
        </div>
      </div>

      <div class="step-solution-box">
        <h4 style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem; color: var(--text-primary);">
          <span>📝</span> Step-by-Step Long Division Solution
        </h4>

        <div class="step-item">
          <span class="step-badge">Step 1</span>
          <div>
            <strong>Convert to Improper Fraction:</strong><br>
            ${absWhole > 0 ? `Multiply whole number by denominator and add numerator: <br>
            $$(${absWhole} \\times ${absDen}) + ${absNum} = ${totalNum}$$<br>
            Improper fraction: <code>${totalNum} / ${absDen}</code>` : `Fraction is already improper/proper: <code>${totalNum} / ${absDen}</code>`}
          </div>
        </div>

        <div class="step-item">
          <span class="step-badge">Step 2</span>
          <div>
            <strong>Perform Long Division (${totalNum} ÷ ${absDen}):</strong><br>
            Divide the numerator by the denominator:
            <div style="background: var(--bg-surface); padding: 0.75rem 1rem; border-radius: var(--radius-md); font-family: monospace; margin: 0.5rem 0; border: 1px solid var(--border-color);">
              ${totalNum} ÷ ${absDen} = ${decimalValue.toFixed(8)}...
            </div>
            ${repInfo.isRepeating ? `<p style="margin: 0.35rem 0; color: var(--accent-primary);">⚠️ Note: The digits <strong>${repInfo.repeatingPart}</strong> repeat infinitely.</p>` : `<p style="margin: 0.35rem 0; color: var(--color-success);">✓ Remainder reaches 0, producing a terminating decimal.</p>`}
          </div>
        </div>

        <div class="step-item">
          <span class="step-badge">Step 3</span>
          <div>
            <strong>Convert to Percentage:</strong><br>
            Multiply the decimal by 100: <br>
            <code>${decimalValue.toFixed(6)} × 100 = ${percentValue}</code>
          </div>
        </div>
      </div>
    `;
  }

  btnCalc.addEventListener("click", calculate);
  btnReset.addEventListener("click", () => {
    container.querySelector("#f2dWhole").value = "";
    container.querySelector("#f2dNum").value = "5";
    container.querySelector("#f2dDen").value = "8";
    resultDiv.style.display = "none";
  });

  // Calculate automatically on load
  calculate();
}

// Helper to detect repeating decimals using division simulation
function detectRepeatingDecimal(num, den) {
  const integerPart = Math.floor(num / den);
  let rem = num % den;
  if (rem === 0) {
    return { isRepeating: false, formatted: integerPart.toString(), repeatingPart: "" };
  }

  const seenRemainders = new Map();
  let decimalDigits = "";
  let index = 0;

  while (rem !== 0 && !seenRemainders.has(rem) && index < 200) {
    seenRemainders.set(rem, index);
    rem *= 10;
    decimalDigits += Math.floor(rem / den);
    rem %= den;
    index++;
  }

  if (rem === 0) {
    return { isRepeating: false, formatted: `${integerPart}.${decimalDigits}`, repeatingPart: "" };
  }

  const repeatStartIndex = seenRemainders.get(rem);
  const nonRepeating = decimalDigits.substring(0, repeatStartIndex);
  const repeating = decimalDigits.substring(repeatStartIndex);

  return {
    isRepeating: true,
    formatted: `${integerPart}.${nonRepeating}(${repeating})`,
    repeatingPart: repeating
  };
}

/* ==========================================================================
   2. Decimal to Fraction Calculator (decimal-to-fraction)
   ========================================================================== */
function renderDecimalToFractionCalculator(container, calcDef) {
  container.innerHTML = `
    <div class="calc-tool-card">
      <div class="form-grid">
        <div class="form-group" style="grid-column: 1 / -1;">
          <label class="form-label" for="d2fInput">
            Decimal Number
            <span class="form-label-hint">e.g., 0.75, 2.625, 0.3333, -1.4</span>
          </label>
          <div class="input-with-addon">
            <span class="input-addon">🔢</span>
            <input type="text" id="d2fInput" class="form-control" value="0.625" placeholder="Enter decimal number...">
          </div>
        </div>
      </div>

      <div class="calc-actions">
        <button type="button" id="btnCalcD2F" class="btn btn-primary">
          <span>⚡ Convert to Fraction</span>
        </button>
        <button type="button" id="btnResetD2F" class="btn btn-secondary">
          <span>↺ Reset</span>
        </button>
      </div>

      <div id="d2fResultContainer" class="results-section animate-fade-in" style="display: none; margin-top: 2rem;"></div>
    </div>
  `;

  const btnCalc = container.querySelector("#btnCalcD2F");
  const btnReset = container.querySelector("#btnResetD2F");
  const resultDiv = container.querySelector("#d2fResultContainer");

  function calculate() {
    const rawInput = container.querySelector("#d2fInput").value.trim();
    if (!rawInput || isNaN(Number(rawInput))) {
      alert("Please enter a valid decimal number (e.g. 0.75 or 3.125).");
      return;
    }

    const val = parseFloat(rawInput);
    const isNeg = val < 0;
    const absVal = Math.abs(val);

    const parts = absVal.toString().split(".");
    const wholePart = parseInt(parts[0]) || 0;
    const fracPart = parts[1] || "";

    let num, den;
    let isRepeatingApprox = false;

    if (fracPart.length === 0) {
      num = wholePart;
      den = 1;
    } else {
      const places = fracPart.length;
      den = Math.pow(10, places);
      num = wholePart * den + parseInt(fracPart);
    }

    const g = mathGcd(num, den);
    const simpNum = num / g;
    const simpDen = den / g;

    // Mixed representation
    const mixedWhole = Math.floor(simpNum / simpDen);
    const mixedRem = simpNum % simpDen;

    resultDiv.style.display = "block";
    resultDiv.innerHTML = `
      <div class="results-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); margin-bottom: 1.5rem;">
        <div class="result-card featured">
          <span class="result-label">Simplified Fraction</span>
          <div class="result-value" style="font-size: 1.85rem; color: var(--accent-primary);">
            ${isNeg ? "-" : ""}${simpNum} / ${simpDen}
          </div>
          <span class="result-subtext">Reduced to lowest terms</span>
        </div>

        ${mixedWhole > 0 && mixedRem > 0 ? `
          <div class="result-card">
            <span class="result-label">Mixed Number</span>
            <div class="result-value" style="color: var(--accent-secondary);">
              ${isNeg ? "-" : ""}${mixedWhole} <sup>${mixedRem}</sup>/<sub>${simpDen}</sub>
            </div>
            <span class="result-subtext">Whole + Proper Fraction</span>
          </div>
        ` : ''}

        <div class="result-card">
          <span class="result-label">Percentage</span>
          <div class="result-value" style="color: var(--color-success);">${(val * 100).toFixed(2).replace(/\.00$/, "")}%</div>
          <span class="result-subtext">Parts per 100</span>
        </div>
      </div>

      <div class="step-solution-box">
        <h4 style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem; color: var(--text-primary);">
          <span>📝</span> Step-by-Step Algebraic Conversion
        </h4>

        <div class="step-item">
          <span class="step-badge">Step 1</span>
          <div>
            <strong>Write as a base-10 fraction:</strong><br>
            The fractional part <code>.${fracPart || "0"}</code> has <strong>${fracPart.length}</strong> decimal place(s).<br>
            Multiply numerator and denominator by 10<sup>${fracPart.length}</sup> = <strong>${den}</strong>:<br>
            $$\\frac{${absVal}}{1} = \\frac{${absVal} \\times ${den}}{1 \\times ${den}} = \\frac{${num}}{${den}}$$
          </div>
        </div>

        <div class="step-item">
          <span class="step-badge">Step 2</span>
          <div>
            <strong>Find Greatest Common Divisor (GCD):</strong><br>
            The GCD of ${num} and ${den} is <strong>${g}</strong>.
          </div>
        </div>

        <div class="step-item">
          <span class="step-badge">Step 3</span>
          <div>
            <strong>Reduce to lowest irreducible terms:</strong><br>
            Divide both numerator and denominator by ${g}:<br>
            $$\\frac{${num} \\div ${g}}{${den} \\div ${g}} = \\mathbf{\\frac{${simpNum}}{${simpDen}}}$$
            ${isNeg ? `<p style="margin-top: 0.5rem; color: var(--accent-primary);">Re-apply negative sign: <strong>-${simpNum}/${simpDen}</strong></p>` : ""}
          </div>
        </div>
      </div>
    `;
  }

  btnCalc.addEventListener("click", calculate);
  btnReset.addEventListener("click", () => {
    container.querySelector("#d2fInput").value = "0.625";
    resultDiv.style.display = "none";
  });

  calculate();
}

/* ==========================================================================
   3. Mixed Numbers Calculator (mixed-number-calc)
   ========================================================================== */
function renderMixedNumbersCalculator(container, calcDef) {
  container.innerHTML = `
    <div class="calc-tool-card">
      <div style="display: flex; align-items: center; justify-content: center; gap: 1rem; flex-wrap: wrap; margin-bottom: 2rem; background: var(--bg-subtle); padding: 1.5rem; border-radius: var(--radius-lg); border: 1px solid var(--border-color);">
        
        <!-- Mixed Fraction 1 -->
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <div style="text-align: center;">
            <label class="form-label" style="font-size: 0.75rem; margin-bottom: 0.25rem;">Whole 1</label>
            <input type="number" id="m1Whole" class="form-control" value="2" style="width: 70px; text-align: center; font-weight: 700; border: 1.5px solid var(--border-color);">
          </div>
          <div style="display: flex; flex-direction: column; gap: 0.35rem; width: 70px;">
            <input type="number" id="m1Num" class="form-control" value="3" style="text-align: center; font-weight: 700; border: 1.5px solid var(--border-color);" placeholder="Num">
            <div style="height: 2px; background: var(--text-primary);"></div>
            <input type="number" id="m1Den" class="form-control" value="4" style="text-align: center; font-weight: 700; border: 1.5px solid var(--border-color);" placeholder="Den">
          </div>
        </div>

        <!-- Operator -->
        <div style="width: 70px; text-align: center;">
          <label class="form-label" style="font-size: 0.75rem; margin-bottom: 0.25rem;">Op</label>
          <select id="mOp" class="form-control" style="font-size: 1.25rem; font-weight: 700; text-align: center;">
            <option value="+" selected>+</option>
            <option value="-">−</option>
            <option value="*">×</option>
            <option value="/">÷</option>
          </select>
        </div>

        <!-- Mixed Fraction 2 -->
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <div style="text-align: center;">
            <label class="form-label" style="font-size: 0.75rem; margin-bottom: 0.25rem;">Whole 2</label>
            <input type="number" id="m2Whole" class="form-control" value="1" style="width: 70px; text-align: center; font-weight: 700; border: 1.5px solid var(--border-color);">
          </div>
          <div style="display: flex; flex-direction: column; gap: 0.35rem; width: 70px;">
            <input type="number" id="m2Num" class="form-control" value="2" style="text-align: center; font-weight: 700; border: 1.5px solid var(--border-color);" placeholder="Num">
            <div style="height: 2px; background: var(--text-primary);"></div>
            <input type="number" id="m2Den" class="form-control" value="3" style="text-align: center; font-weight: 700; border: 1.5px solid var(--border-color);" placeholder="Den">
          </div>
        </div>
      </div>

      <div class="calc-actions">
        <button type="button" id="btnCalcMixed" class="btn btn-primary">
          <span>⚡ Calculate Mixed Numbers</span>
        </button>
        <button type="button" id="btnResetMixed" class="btn btn-secondary">
          <span>↺ Reset</span>
        </button>
      </div>

      <div id="mixedResultContainer" class="results-section animate-fade-in" style="display: none; margin-top: 2rem;"></div>
    </div>
  `;

  const btnCalc = container.querySelector("#btnCalcMixed");
  const btnReset = container.querySelector("#btnResetMixed");
  const resultDiv = container.querySelector("#mixedResultContainer");

  function calculate() {
    const w1 = parseInt(container.querySelector("#m1Whole").value) || 0;
    const n1 = parseInt(container.querySelector("#m1Num").value) || 0;
    const d1 = parseInt(container.querySelector("#m1Den").value) || 1;

    const w2 = parseInt(container.querySelector("#m2Whole").value) || 0;
    const n2 = parseInt(container.querySelector("#m2Num").value) || 0;
    const d2 = parseInt(container.querySelector("#m2Den").value) || 1;

    const op = container.querySelector("#mOp").value;

    if (d1 === 0 || d2 === 0) {
      alert("Denominator cannot be 0.");
      return;
    }

    // Convert to improper fractions
    const impN1 = (w1 >= 0) ? (w1 * d1 + n1) : (w1 * d1 - n1);
    const impD1 = d1;

    const impN2 = (w2 >= 0) ? (w2 * d2 + n2) : (w2 * d2 - n2);
    const impD2 = d2;

    let resN, resD;
    let stepExplanation = "";

    if (op === "+") {
      const commonD = mathLcm(impD1, impD2);
      const adjN1 = impN1 * (commonD / impD1);
      const adjN2 = impN2 * (commonD / impD2);
      resN = adjN1 + adjN2;
      resD = commonD;
      stepExplanation = `Find LCD of ${impD1} and ${impD2} = ${commonD}. Add numerators: ${adjN1} + ${adjN2} = ${resN}.`;
    } else if (op === "-") {
      const commonD = mathLcm(impD1, impD2);
      const adjN1 = impN1 * (commonD / impD1);
      const adjN2 = impN2 * (commonD / impD2);
      resN = adjN1 - adjN2;
      resD = commonD;
      stepExplanation = `Find LCD of ${impD1} and ${impD2} = ${commonD}. Subtract numerators: ${adjN1} - ${adjN2} = ${resN}.`;
    } else if (op === "*") {
      resN = impN1 * impN2;
      resD = impD1 * impD2;
      stepExplanation = `Multiply numerators: ${impN1} × ${impN2} = ${resN}. Multiply denominators: ${impD1} × ${impD2} = ${resD}.`;
    } else if (op === "/") {
      if (impN2 === 0) {
        alert("Cannot divide by 0.");
        return;
      }
      resN = impN1 * impD2;
      resD = impD1 * impN2;
      stepExplanation = `Invert second fraction and multiply: (${impN1}/${impD1}) × (${impD2}/${impN2}) = ${resN}/${resD}.`;
    }

    if (resD < 0) {
      resN = -resN;
      resD = -resD;
    }

    const g = mathGcd(resN, resD);
    const simpN = resN / g;
    const simpD = resD / g;

    const isNeg = simpN < 0;
    const absSimpN = Math.abs(simpN);
    const finalWhole = Math.floor(absSimpN / simpD);
    const finalRem = absSimpN % simpD;
    const decVal = (simpN / simpD).toFixed(4).replace(/\.?0+$/, "");

    let mixedDisplay = "";
    if (finalWhole === 0 && finalRem === 0) {
      mixedDisplay = "0";
    } else if (finalRem === 0) {
      mixedDisplay = (isNeg ? "-" : "") + finalWhole;
    } else if (finalWhole === 0) {
      mixedDisplay = (isNeg ? "-" : "") + `${finalRem}/${simpD}`;
    } else {
      mixedDisplay = `${isNeg ? "-" : ""}${finalWhole} ${finalRem}/${simpD}`;
    }

    resultDiv.style.display = "block";
    resultDiv.innerHTML = `
      <div class="results-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); margin-bottom: 1.5rem;">
        <div class="result-card featured">
          <span class="result-label">Mixed Number Result</span>
          <div class="result-value" style="font-size: 1.85rem; color: var(--accent-primary);">${mixedDisplay}</div>
          <span class="result-subtext">Whole + Simplified Remainder</span>
        </div>

        <div class="result-card">
          <span class="result-label">Improper Fraction</span>
          <div class="result-value" style="color: var(--accent-secondary);">${simpN} / ${simpD}</div>
          <span class="result-subtext">Lowest irreducible terms</span>
        </div>

        <div class="result-card">
          <span class="result-label">Decimal Value</span>
          <div class="result-value" style="color: var(--color-success);">${decVal}</div>
          <span class="result-subtext">Floating point format</span>
        </div>
      </div>

      <div class="step-solution-box">
        <h4 style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem; color: var(--text-primary);">
          <span>📝</span> Step-by-Step Solution Breakdown
        </h4>

        <div class="step-item">
          <span class="step-badge">Step 1</span>
          <div>
            <strong>Convert Mixed Numbers to Improper Fractions:</strong><br>
            Fraction 1: <code>${w1} ${n1}/${d1} = (${w1} × ${d1} + ${n1}) / ${d1} = ${impN1}/${impD1}</code><br>
            Fraction 2: <code>${w2} ${n2}/${d2} = (${w2} × ${d2} + ${n2}) / ${d2} = ${impN2}/${impD2}</code>
          </div>
        </div>

        <div class="step-item">
          <span class="step-badge">Step 2</span>
          <div>
            <strong>Apply Operation (${op}):</strong><br>
            ${stepExplanation}<br>
            Raw fraction result: <code>${resN} / ${resD}</code>
          </div>
        </div>

        <div class="step-item">
          <span class="step-badge">Step 3</span>
          <div>
            <strong>Simplify and Convert to Mixed Number:</strong><br>
            Divide by GCD(${Math.abs(resN)}, ${resD}) = ${g} &rarr; <code>${simpN} / ${simpD}</code><br>
            ${finalRem > 0 && finalWhole > 0 ? `Divide ${absSimpN} by ${simpD}: Quotient = <strong>${finalWhole}</strong>, Remainder = <strong>${finalRem}</strong> &rarr; <strong>${mixedDisplay}</strong>` : `Final reduced form: <strong>${mixedDisplay}</strong>`}
          </div>
        </div>
      </div>
    `;
  }

  btnCalc.addEventListener("click", calculate);
  btnReset.addEventListener("click", () => {
    container.querySelector("#m1Whole").value = "2";
    container.querySelector("#m1Num").value = "3";
    container.querySelector("#m1Den").value = "4";
    container.querySelector("#m2Whole").value = "1";
    container.querySelector("#m2Num").value = "2";
    container.querySelector("#m2Den").value = "3";
    resultDiv.style.display = "none";
  });

  calculate();
}

/* ==========================================================================
   4. GCF & LCM Calculator (gcf-lcm-calculator)
   ========================================================================== */
function renderGcfLcmCalculator(container, calcDef) {
  container.innerHTML = `
    <div class="calc-tool-card">
      <div class="form-grid">
        <div class="form-group" style="grid-column: 1 / -1;">
          <label class="form-label" for="gcfNumbers">
            Enter Integers
            <span class="form-label-hint">Comma or space separated (e.g. 24, 36, 48)</span>
          </label>
          <div class="input-with-addon">
            <span class="input-addon">🔢</span>
            <input type="text" id="gcfNumbers" class="form-control" value="24, 36, 60" placeholder="e.g. 12, 18 or 24, 36, 48">
          </div>
        </div>
      </div>

      <div class="calc-actions">
        <button type="button" id="btnCalcGcf" class="btn btn-primary">
          <span>⚡ Calculate GCF & LCM</span>
        </button>
        <button type="button" id="btnResetGcf" class="btn btn-secondary">
          <span>↺ Reset</span>
        </button>
      </div>

      <div id="gcfResultContainer" class="results-section animate-fade-in" style="display: none; margin-top: 2rem;"></div>
    </div>
  `;

  const btnCalc = container.querySelector("#btnCalcGcf");
  const btnReset = container.querySelector("#btnResetGcf");
  const resultDiv = container.querySelector("#gcfResultContainer");

  function calculate() {
    const raw = container.querySelector("#gcfNumbers").value;
    const nums = raw.split(/[\s,]+/).map(s => parseInt(s)).filter(n => !isNaN(n) && n > 0);

    if (nums.length < 2) {
      alert("Please enter at least 2 positive integers separated by commas or spaces.");
      return;
    }

    const gcfVal = mathMultiGcd(nums);
    const lcmVal = mathMultiLcm(nums);

    // Prime factors for each
    const factorsMap = nums.map(n => ({
      num: n,
      factors: getPrimeFactors(n)
    }));

    resultDiv.style.display = "block";
    resultDiv.innerHTML = `
      <div class="results-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); margin-bottom: 1.5rem;">
        <div class="result-card featured">
          <span class="result-label">Greatest Common Factor (GCF / GCD)</span>
          <div class="result-value" style="font-size: 2rem; color: var(--accent-primary);">${gcfVal}</div>
          <span class="result-subtext">Highest number dividing all inputs</span>
        </div>

        <div class="result-card">
          <span class="result-label">Least Common Multiple (LCM)</span>
          <div class="result-value" style="font-size: 2rem; color: var(--accent-secondary);">${lcmVal.toLocaleString()}</div>
          <span class="result-subtext">Smallest positive shared multiple</span>
        </div>
      </div>

      <div class="step-solution-box">
        <h4 style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem; color: var(--text-primary);">
          <span>📝</span> Prime Factorization Method
        </h4>

        <div class="step-item">
          <span class="step-badge">Step 1</span>
          <div>
            <strong>Prime Factorization of Each Number:</strong>
            <ul style="margin: 0.5rem 0 0 1rem; line-height: 1.6;">
              ${factorsMap.map(f => `
                <li><code>${f.num}</code> = ${f.factors.length > 0 ? f.factors.join(" × ") : "Prime"}</li>
              `).join("")}
            </ul>
          </div>
        </div>

        <div class="step-item">
          <span class="step-badge">Step 2</span>
          <div>
            <strong>Calculate GCF (Intersection of common prime factors):</strong><br>
            Take the lowest power of all common prime factors across (${nums.join(", ")}):<br>
            <code>GCF = ${gcfVal}</code>
          </div>
        </div>

        <div class="step-item">
          <span class="step-badge">Step 3</span>
          <div>
            <strong>Calculate LCM (Union of highest power prime factors):</strong><br>
            Multiply highest powers of every prime factor present:<br>
            <code>LCM = ${lcmVal.toLocaleString()}</code>
          </div>
        </div>
      </div>
    `;
  }

  btnCalc.addEventListener("click", calculate);
  btnReset.addEventListener("click", () => {
    container.querySelector("#gcfNumbers").value = "24, 36, 60";
    resultDiv.style.display = "none";
  });

  calculate();
}

/* ==========================================================================
   5. Prime Factorization Calculator (prime-factorization)
   ========================================================================== */
function renderPrimeFactorizationCalculator(container, calcDef) {
  container.innerHTML = `
    <div class="calc-tool-card">
      <div class="form-grid">
        <div class="form-group" style="grid-column: 1 / -1;">
          <label class="form-label" for="primeInput">
            Enter Positive Integer
            <span class="form-label-hint">Up to 10,000,000,000</span>
          </label>
          <div class="input-with-addon">
            <span class="input-addon">✨</span>
            <input type="number" id="primeInput" class="form-control" value="360" min="2" max="10000000000" step="1">
          </div>
        </div>
      </div>

      <div class="calc-actions">
        <button type="button" id="btnCalcPrime" class="btn btn-primary">
          <span>⚡ Find Prime Factors</span>
        </button>
        <button type="button" id="btnResetPrime" class="btn btn-secondary">
          <span>↺ Reset</span>
        </button>
      </div>

      <div id="primeResultContainer" class="results-section animate-fade-in" style="display: none; margin-top: 2rem;"></div>
    </div>
  `;

  const btnCalc = container.querySelector("#btnCalcPrime");
  const btnReset = container.querySelector("#btnResetPrime");
  const resultDiv = container.querySelector("#primeResultContainer");

  function calculate() {
    const n = parseInt(container.querySelector("#primeInput").value);
    if (isNaN(n) || n < 2) {
      alert("Please enter an integer greater than or equal to 2.");
      return;
    }

    const factors = getPrimeFactors(n);
    const isPrime = factors.length === 1;

    // Exponential representation
    const counts = {};
    factors.forEach(f => { counts[f] = (counts[f] || 0) + 1; });
    const expForm = Object.entries(counts).map(([p, count]) => count > 1 ? `${p}<sup>${count}</sup>` : `${p}`).join(" × ");

    // Divisors / factors list
    const divisors = [];
    for (let i = 1; i <= Math.sqrt(n); i++) {
      if (n % i === 0) {
        divisors.push(i);
        if (i * i !== n) divisors.push(n / i);
      }
    }
    divisors.sort((a, b) => a - b);
    const sumDivisors = divisors.reduce((a, b) => a + b, 0);

    resultDiv.style.display = "block";
    resultDiv.innerHTML = `
      <div class="results-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); margin-bottom: 1.5rem;">
        <div class="result-card featured">
          <span class="result-label">Prime Factorization (Exponential)</span>
          <div class="result-value" style="font-size: 1.85rem; color: var(--accent-primary);">${expForm}</div>
          <span class="result-subtext">${isPrime ? "Prime Number" : "Composite Number"}</span>
        </div>

        <div class="result-card">
          <span class="result-label">Expanded Form</span>
          <div class="result-value" style="color: var(--accent-secondary); font-size: 1.25rem;">${factors.join(" × ")}</div>
          <span class="result-subtext">${factors.length} total prime factors</span>
        </div>

        <div class="result-card">
          <span class="result-label">Total Divisors / Factors</span>
          <div class="result-value" style="color: var(--color-success);">${divisors.length}</div>
          <span class="result-subtext">Sum = ${sumDivisors.toLocaleString()}</span>
        </div>
      </div>

      <div class="step-solution-box">
        <h4 style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem; color: var(--text-primary);">
          <span>🌳</span> Trial Division / Factor Tree Steps
        </h4>

        <div class="step-item">
          <span class="step-badge">Divisors</span>
          <div>
            <strong>All Positive Divisors of ${n}:</strong><br>
            <div style="background: var(--bg-surface); padding: 0.6rem 0.85rem; border-radius: var(--radius-md); font-family: monospace; margin-top: 0.35rem; border: 1px solid var(--border-color);">
              ${divisors.join(", ")}
            </div>
          </div>
        </div>

        <div class="step-item">
          <span class="step-badge">Summary</span>
          <div>
            <strong>Fundamental Theorem of Arithmetic:</strong><br>
            Every integer greater than 1 either is a prime number itself or can be represented as the unique product of prime numbers:
            <br><code>${n} = ${expForm}</code>
          </div>
        </div>
      </div>
    `;
  }

  btnCalc.addEventListener("click", calculate);
  btnReset.addEventListener("click", () => {
    container.querySelector("#primeInput").value = "360";
    resultDiv.style.display = "none";
  });

  calculate();
}

/* ==========================================================================
   6. Ratio & Proportion Calculator (ratio-calculator)
   ========================================================================== */
function renderRatioCalculator(container, calcDef) {
  container.innerHTML = `
    <div class="calc-tool-card">
      <div style="display: flex; gap: 0.5rem; margin-bottom: 1.5rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.75rem; flex-wrap: wrap;">
        <button type="button" class="btn btn-secondary btn-sm ratio-tab-btn active" data-tab="proportion">Solve Proportion (A : B = C : D)</button>
        <button type="button" class="btn btn-secondary btn-sm ratio-tab-btn" data-tab="simplify">Simplify Ratio (A : B : C)</button>
        <button type="button" class="btn btn-secondary btn-sm ratio-tab-btn" data-tab="share">Divide Total by Ratio</button>
      </div>

      <!-- Tab 1: Proportion Solver -->
      <div id="tabProportion" class="ratio-tab-content">
        <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 1rem;">
          Enter 3 known values and leave 1 field blank (or enter 'x') to solve the proportion:
        </p>
        <div style="display: flex; align-items: center; justify-content: center; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 1.5rem; background: var(--bg-subtle); padding: 1.25rem; border-radius: var(--radius-lg); border: 1px solid var(--border-color);">
          <input type="number" id="propA" class="form-control" value="3" style="width: 80px; text-align: center; font-weight: 700;" placeholder="A">
          <span style="font-weight: 800; font-size: 1.25rem;">:</span>
          <input type="number" id="propB" class="form-control" value="4" style="width: 80px; text-align: center; font-weight: 700;" placeholder="B">
          <span style="font-weight: 800; font-size: 1.25rem;">=</span>
          <input type="number" id="propC" class="form-control" value="9" style="width: 80px; text-align: center; font-weight: 700;" placeholder="C">
          <span style="font-weight: 800; font-size: 1.25rem;">:</span>
          <input type="number" id="propD" class="form-control" placeholder="X" style="width: 80px; text-align: center; font-weight: 700; border-color: var(--accent-primary);">
        </div>
      </div>

      <!-- Tab 2: Simplify Ratio -->
      <div id="tabSimplify" class="ratio-tab-content" style="display: none;">
        <div class="form-group">
          <label class="form-label" for="ratioSimpInput">
            Enter Ratio Terms
            <span class="form-label-hint">Colon, comma, or space separated (e.g. 24 : 36 or 15 : 25 : 40)</span>
          </label>
          <input type="text" id="ratioSimpInput" class="form-control" value="24 : 36 : 60">
        </div>
      </div>

      <!-- Tab 3: Divide Total by Ratio -->
      <div id="tabShare" class="ratio-tab-content" style="display: none;">
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label" for="shareTotal">Total Amount to Divide</label>
            <input type="number" id="shareTotal" class="form-control" value="1200">
          </div>
          <div class="form-group">
            <label class="form-label" for="shareRatio">Ratio (e.g. 2 : 3 : 5)</label>
            <input type="text" id="shareRatio" class="form-control" value="2 : 3 : 5">
          </div>
        </div>
      </div>

      <div class="calc-actions">
        <button type="button" id="btnCalcRatio" class="btn btn-primary">
          <span>⚡ Solve Ratio</span>
        </button>
        <button type="button" id="btnResetRatio" class="btn btn-secondary">
          <span>↺ Reset</span>
        </button>
      </div>

      <div id="ratioResultContainer" class="results-section animate-fade-in" style="display: none; margin-top: 2rem;"></div>
    </div>
  `;

  let currentTab = "proportion";
  const tabs = container.querySelectorAll(".ratio-tab-btn");
  tabs.forEach(btn => {
    btn.addEventListener("click", () => {
      tabs.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentTab = btn.dataset.tab;
      container.querySelector("#tabProportion").style.display = currentTab === "proportion" ? "block" : "none";
      container.querySelector("#tabSimplify").style.display = currentTab === "simplify" ? "block" : "none";
      container.querySelector("#tabShare").style.display = currentTab === "share" ? "block" : "none";
      calculate();
    });
  });

  const btnCalc = container.querySelector("#btnCalcRatio");
  const btnReset = container.querySelector("#btnResetRatio");
  const resultDiv = container.querySelector("#ratioResultContainer");

  function calculate() {
    resultDiv.style.display = "block";

    if (currentTab === "proportion") {
      const aVal = container.querySelector("#propA").value;
      const bVal = container.querySelector("#propB").value;
      const cVal = container.querySelector("#propC").value;
      const dVal = container.querySelector("#propD").value;

      const a = parseFloat(aVal);
      const b = parseFloat(bVal);
      const c = parseFloat(cVal);
      const d = parseFloat(dVal);

      let solvedVar = "";
      let solvedVal = 0;
      let stepHtml = "";

      if (isNaN(d)) {
        solvedVar = "D";
        solvedVal = (b * c) / a;
        stepHtml = `Cross multiply: A × D = B × C &rarr; ${a} × D = ${b} × ${c} = ${b * c} &rarr; D = ${b * c} / ${a} = <strong>${solvedVal}</strong>`;
      } else if (isNaN(c)) {
        solvedVar = "C";
        solvedVal = (a * d) / b;
        stepHtml = `Cross multiply: A × D = B × C &rarr; ${a} × ${d} = ${a * d} = B × C &rarr; C = ${a * d} / ${b} = <strong>${solvedVal}</strong>`;
      } else if (isNaN(b)) {
        solvedVar = "B";
        solvedVal = (a * d) / c;
        stepHtml = `Cross multiply: A × D = B × C &rarr; B = (A × D) / C = (${a} × ${d}) / ${c} = <strong>${solvedVal}</strong>`;
      } else if (isNaN(a)) {
        solvedVar = "A";
        solvedVal = (b * c) / d;
        stepHtml = `Cross multiply: A × D = B × C &rarr; A = (B × C) / D = (${b} × ${c}) / ${d} = <strong>${solvedVal}</strong>`;
      } else {
        // Check if proportion is true
        const isTrue = Math.abs(a * d - b * c) < 0.0001;
        resultDiv.innerHTML = `
          <div class="result-card featured" style="margin-bottom: 1rem;">
            <span class="result-label">Proportion Equality Check</span>
            <div class="result-value" style="color: ${isTrue ? 'var(--color-success)' : 'var(--color-danger)'}; font-size: 1.6rem;">
              ${isTrue ? "✓ True Proportion (A/B = C/D)" : "✗ False Proportion (A/B ≠ C/D)"}
            </div>
            <span class="result-subtext">${a}/${b} = ${(a/b).toFixed(4)}, ${c}/${d} = ${(c/d).toFixed(4)}</span>
          </div>
        `;
        return;
      }

      resultDiv.innerHTML = `
        <div class="results-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); margin-bottom: 1.5rem;">
          <div class="result-card featured">
            <span class="result-label">Solved Value (${solvedVar})</span>
            <div class="result-value" style="font-size: 2rem; color: var(--accent-primary);">${Number(solvedVal.toFixed(6))}</div>
            <span class="result-subtext">Satisfies proportion equation</span>
          </div>
        </div>

        <div class="step-solution-box">
          <h4 style="color: var(--text-primary); margin-bottom: 0.75rem;">📝 Step-by-Step Cross-Multiplication</h4>
          <p>${stepHtml}</p>
        </div>
      `;
    } else if (currentTab === "simplify") {
      const raw = container.querySelector("#ratioSimpInput").value;
      const terms = raw.split(/[:,\s]+/).map(s => parseFloat(s)).filter(n => !isNaN(n) && n > 0);

      if (terms.length < 2) {
        alert("Please enter at least 2 ratio numbers.");
        return;
      }

      const intTerms = terms.map(n => Math.round(n));
      const g = mathMultiGcd(intTerms);
      const reduced = intTerms.map(n => n / g);

      resultDiv.innerHTML = `
        <div class="results-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); margin-bottom: 1.5rem;">
          <div class="result-card featured">
            <span class="result-label">Simplified Ratio</span>
            <div class="result-value" style="font-size: 2rem; color: var(--accent-primary);">${reduced.join(" : ")}</div>
            <span class="result-subtext">Reduced by GCD = ${g}</span>
          </div>
        </div>
      `;
    } else if (currentTab === "share") {
      const total = parseFloat(container.querySelector("#shareTotal").value) || 0;
      const rawRatio = container.querySelector("#shareRatio").value;
      const parts = rawRatio.split(/[:,\s]+/).map(s => parseFloat(s)).filter(n => !isNaN(n) && n > 0);

      if (parts.length < 2) {
        alert("Please enter at least 2 ratio parts.");
        return;
      }

      const sumParts = parts.reduce((a, b) => a + b, 0);
      const singlePartVal = total / sumParts;
      const shares = parts.map(p => ({
        ratioPart: p,
        amount: p * singlePartVal,
        percent: (p / sumParts) * 100
      }));

      resultDiv.innerHTML = `
        <div class="results-grid" style="grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); margin-bottom: 1.5rem;">
          ${shares.map((s, idx) => `
            <div class="result-card">
              <span class="result-label">Part ${idx + 1} (${s.ratioPart} shares)</span>
              <div class="result-value" style="color: var(--accent-primary); font-size: 1.5rem;">$${s.amount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
              <span class="result-subtext">${s.percent.toFixed(1)}% of total</span>
            </div>
          `).join("")}
        </div>

        <div class="step-solution-box">
          <h4 style="color: var(--text-primary); margin-bottom: 0.75rem;">📝 Calculation Breakdown</h4>
          <p>Total ratio units: <code>${parts.join(" + ")} = ${sumParts} parts</code></p>
          <p>Value per 1 unit part: <code>$${total} ÷ ${sumParts} = $${singlePartVal.toFixed(4)}</code></p>
        </div>
      `;
    }
  }

  btnCalc.addEventListener("click", calculate);
  btnReset.addEventListener("click", () => {
    container.querySelector("#propA").value = "3";
    container.querySelector("#propB").value = "4";
    container.querySelector("#propC").value = "9";
    container.querySelector("#propD").value = "";
    resultDiv.style.display = "none";
  });

  calculate();
}
