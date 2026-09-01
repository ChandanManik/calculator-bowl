/**
 * ============================================================================
 * Math Calculators: Fractions Operations & Simplifier
 * ============================================================================
 */

// Math Helper: Greatest Common Divisor (Euclidean algorithm)
function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    let t = b;
    b = a % b;
    a = t;
  }
  return a;
}

// Math Helper: Least Common Multiple
function lcm(a, b) {
  return (!a || !b) ? 0 : Math.abs((a * b) / gcd(a, b));
}

function renderFractionCalculator(container, calcDef) {
  container.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; gap: 1.25rem; flex-wrap: wrap; margin-bottom: 2rem; background: var(--bg-subtle); padding: 1.5rem; border-radius: var(--radius-lg); border: 1px solid var(--border-color);">
      
      <!-- Fraction 1 -->
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <input type="number" id="f1Whole" class="form-control" placeholder="Whole" style="width: 70px; text-align: center; border: 1.5px solid var(--border-color); border-radius: var(--radius-md);" title="Optional Whole Number">
        <div style="display: flex; flex-direction: column; gap: 0.35rem; width: 75px;">
          <input type="number" id="f1Num" class="form-control" value="3" style="text-align: center; border: 1.5px solid var(--border-color); border-radius: var(--radius-sm);" placeholder="Num">
          <div style="height: 2px; background: var(--text-primary);"></div>
          <input type="number" id="f1Den" class="form-control" value="4" style="text-align: center; border: 1.5px solid var(--border-color); border-radius: var(--radius-sm);" placeholder="Den">
        </div>
      </div>

      <!-- Operator -->
      <div style="width: 70px;">
        <select id="fractionOp" class="form-control" style="font-size: 1.2rem; font-weight: 700; text-align: center;">
          <option value="+" selected>+</option>
          <option value="-">−</option>
          <option value="*">×</option>
          <option value="/">÷</option>
        </select>
      </div>

      <!-- Fraction 2 -->
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <input type="number" id="f2Whole" class="form-control" placeholder="Whole" style="width: 70px; text-align: center; border: 1.5px solid var(--border-color); border-radius: var(--radius-md);" title="Optional Whole Number">
        <div style="display: flex; flex-direction: column; gap: 0.35rem; width: 75px;">
          <input type="number" id="f2Num" class="form-control" value="2" style="text-align: center; border: 1.5px solid var(--border-color); border-radius: var(--radius-sm);" placeholder="Num">
          <div style="height: 2px; background: var(--text-primary);"></div>
          <input type="number" id="f2Den" class="form-control" value="5" style="text-align: center; border: 1.5px solid var(--border-color); border-radius: var(--radius-sm);" placeholder="Den">
        </div>
      </div>
    </div>

    <div class="calc-actions">
      <button type="button" id="btnCalculateFraction" class="btn btn-primary">
        <span>⚡ Calculate Fractions</span>
      </button>
      <button type="button" id="btnResetFraction" class="btn btn-secondary">
        <span>↺ Reset</span>
      </button>
    </div>

    <!-- Results Area -->
    <div id="fractionResultContainer" class="results-section animate-fade-in" style="display: none;"></div>
  `;

  const btnCalc = container.querySelector("#btnCalculateFraction");
  const btnReset = container.querySelector("#btnResetFraction");
  const resultDiv = container.querySelector("#fractionResultContainer");

  function calculate() {
    let w1 = parseInt(container.querySelector("#f1Whole").value) || 0;
    let n1 = parseInt(container.querySelector("#f1Num").value) || 0;
    let d1 = parseInt(container.querySelector("#f1Den").value) || 1;

    let w2 = parseInt(container.querySelector("#f2Whole").value) || 0;
    let n2 = parseInt(container.querySelector("#f2Num").value) || 0;
    let d2 = parseInt(container.querySelector("#f2Den").value) || 1;

    const op = container.querySelector("#fractionOp").value;

    if (d1 === 0 || d2 === 0) {
      alert("Denominator cannot be zero (0).");
      return;
    }

    // Convert mixed to improper fractions:
    // If w1 > 0: n1 = w1*d1 + n1
    let improperN1 = (w1 >= 0) ? (w1 * d1 + n1) : (w1 * d1 - n1);
    let improperD1 = d1;

    let improperN2 = (w2 >= 0) ? (w2 * d2 + n2) : (w2 * d2 - n2);
    let improperD2 = d2;

    let resultNum, resultDen;
    let stepHtml = "";

    if (op === "+" || op === "-") {
      const commonDen = lcm(improperD1, improperD2);
      const mult1 = commonDen / improperD1;
      const mult2 = commonDen / improperD2;
      const adjN1 = improperN1 * mult1;
      const adjN2 = improperN2 * mult2;

      if (op === "+") {
        resultNum = adjN1 + adjN2;
      } else {
        resultNum = adjN1 - adjN2;
      }
      resultDen = commonDen;

      stepHtml = `
        <div class="step-card">
          <span class="step-num-badge">Step 1: Find Least Common Denominator (LCD)</span>
          <p class="step-content">
            Denominators are <b>${improperD1}</b> and <b>${improperD2}</b>.<br>
            <code>LCD(${improperD1}, ${improperD2}) = ${commonDen}</code>
          </p>
        </div>

        <div class="step-card">
          <span class="step-num-badge">Step 2: Adjust Numerators to Common Denominator</span>
          <p class="step-content">
            First Fraction: <code>(${improperN1} × ${mult1}) / (${improperD1} × ${mult1}) = ${adjN1}/${commonDen}</code><br>
            Second Fraction: <code>(${improperN2} × ${mult2}) / (${improperD2} × ${mult2}) = ${adjN2}/${commonDen}</code>
          </p>
        </div>

        <div class="step-card">
          <span class="step-num-badge">Step 3: Combine Numerators</span>
          <p class="step-content">
            <code>(${adjN1} ${op} ${adjN2}) / ${commonDen} = ${resultNum}/${resultDen}</code>
          </p>
        </div>
      `;
    } else if (op === "*") {
      resultNum = improperN1 * improperN2;
      resultDen = improperD1 * improperD2;

      stepHtml = `
        <div class="step-card">
          <span class="step-num-badge">Step 1: Multiply Numerators and Denominators Directly</span>
          <p class="step-content">
            Numerators: <code>${improperN1} × ${improperN2} = ${resultNum}</code><br>
            Denominators: <code>${improperD1} × ${improperD2} = ${resultDen}</code><br>
            Resulting Fraction: <code>${resultNum} / ${resultDen}</code>
          </p>
        </div>
      `;
    } else if (op === "/") {
      if (improperN2 === 0) {
        alert("Cannot divide by a fraction equal to zero.");
        return;
      }
      resultNum = improperN1 * improperD2;
      resultDen = improperD1 * improperN2;

      stepHtml = `
        <div class="step-card">
          <span class="step-num-badge">Step 1: Invert the Divisor & Multiply (Reciprocal)</span>
          <p class="step-content">
            Reciprocal of second fraction <code>${improperN2}/${improperD2}</code> is <code>${improperD2}/${improperN2}</code>.<br>
            <code>(${improperN1}/${improperD1}) × (${improperD2}/${improperN2}) = ${resultNum}/${resultDen}</code>
          </p>
        </div>
      `;
    }

    // Simplification / GCD Reduction
    const commonDivisor = gcd(resultNum, resultDen);
    let simpNum = resultNum / commonDivisor;
    let simpDen = resultDen / commonDivisor;

    if (simpDen < 0) {
      simpNum = -simpNum;
      simpDen = -simpDen;
    }

    // Mixed number conversion
    let mixedHtml = "";
    if (Math.abs(simpNum) >= simpDen && simpDen !== 1) {
      const wholePart = Math.trunc(simpNum / simpDen);
      const remNum = Math.abs(simpNum % simpDen);
      if (remNum !== 0) {
        mixedHtml = `
          <div class="result-stat-card">
            <div class="result-stat-label">Mixed Number Form</div>
            <div class="result-stat-val" style="color: var(--accent-secondary);">
              ${wholePart} <sup>${remNum}</sup>/<sub>${simpDen}</sub>
            </div>
          </div>
        `;
      }
    }

    const decimalVal = (simpNum / simpDen).toFixed(4);

    resultDiv.innerHTML = `
      <div class="result-hero-box">
        <span class="result-hero-label">Exact Simplified Fraction Result</span>
        <div class="result-hero-value" style="display: flex; align-items: center; gap: 0.75rem;">
          <div class="math-fraction" style="font-size: 2.2rem;">
            <span class="fraction-numerator">${simpNum}</span>
            <span class="fraction-denominator">${simpDen}</span>
          </div>
          ${(simpDen !== 1) ? `<span style="font-size: 1.5rem; color: var(--text-muted);">=</span> <span style="font-size: 1.75rem; color: var(--accent-emerald);">${decimalVal}</span>` : ''}
        </div>
      </div>

      <div class="result-stat-grid">
        <div class="result-stat-card">
          <div class="result-stat-label">Simplified Fraction</div>
          <div class="result-stat-val">${simpNum}/${simpDen}</div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-label">Decimal Equivalent</div>
          <div class="result-stat-val">${decimalVal}</div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-label">Greatest Common Factor (GCF)</div>
          <div class="result-stat-val">${commonDivisor}</div>
        </div>
        ${mixedHtml}
      </div>

      <div class="steps-wrapper">
        <h3 class="steps-title">📐 Complete Step-by-Step Solution</h3>
        ${stepHtml}
        <div class="step-card">
          <span class="step-num-badge">Step 4: Reduce to Lowest Terms</span>
          <p class="step-content">
            Greatest Common Divisor of ${resultNum} and ${resultDen} is <b>${commonDivisor}</b>.<br>
            <code>(${resultNum} ÷ ${commonDivisor}) / (${resultDen} ÷ ${commonDivisor}) = <b>${simpNum}/${simpDen}</b></code>
          </p>
        </div>
      </div>
    `;

    resultDiv.style.display = "block";
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  btnCalc.addEventListener("click", calculate);
  btnReset.addEventListener("click", () => {
    container.querySelector("#f1Whole").value = "";
    container.querySelector("#f1Num").value = 3;
    container.querySelector("#f1Den").value = 4;
    container.querySelector("#f2Whole").value = "";
    container.querySelector("#f2Num").value = 2;
    container.querySelector("#f2Den").value = 5;
    resultDiv.style.display = "none";
  });

  calculate();
}

function renderFractionSimplifier(container, calcDef) {
  container.innerHTML = `
    <div style="max-width: 320px; margin: 0 auto 2rem; background: var(--bg-subtle); padding: 1.5rem; border-radius: var(--radius-lg); border: 1px solid var(--border-color); text-align: center;">
      <label class="form-label" style="justify-content: center; margin-bottom: 0.75rem;">Enter Fraction to Simplify</label>
      <div style="display: flex; flex-direction: column; gap: 0.5rem; width: 120px; margin: 0 auto;">
        <input type="number" id="simpInputNumerator" class="form-control" value="48" style="text-align: center; font-size: 1.2rem; font-weight: 700; border: 1.5px solid var(--border-color); border-radius: var(--radius-md);">
        <div style="height: 3px; background: var(--text-primary); border-radius: 2px;"></div>
        <input type="number" id="simpInputDenominator" class="form-control" value="64" style="text-align: center; font-size: 1.2rem; font-weight: 700; border: 1.5px solid var(--border-color); border-radius: var(--radius-md);">
      </div>
    </div>

    <div class="calc-actions" style="justify-content: center;">
      <button type="button" id="btnSimplify" class="btn btn-primary">
        <span>✨ Simplify Fraction</span>
      </button>
    </div>

    <div id="simplifierResultContainer" class="results-section animate-fade-in" style="display: none;"></div>
  `;

  const btnCalc = container.querySelector("#btnSimplify");
  const resultDiv = container.querySelector("#simplifierResultContainer");

  function simplify() {
    const num = parseInt(container.querySelector("#simpInputNumerator").value) || 0;
    const den = parseInt(container.querySelector("#simpInputDenominator").value) || 1;

    if (den === 0) {
      alert("Denominator cannot be 0.");
      return;
    }

    const divisor = gcd(num, den);
    const reducedNum = num / divisor;
    const reducedDen = den / divisor;

    resultDiv.innerHTML = `
      <div class="result-hero-box" style="text-align: center; align-items: center;">
        <span class="result-hero-label">Reduced Lowest Term</span>
        <div class="math-fraction" style="font-size: 2.5rem; color: var(--accent-emerald);">
          <span class="fraction-numerator">${reducedNum}</span>
          <span class="fraction-denominator">${reducedDen}</span>
        </div>
      </div>

      <div class="steps-wrapper">
        <h3 class="steps-title">🔍 Simplification Steps</h3>
        <div class="step-card">
          <span class="step-num-badge">Step 1: Calculate Greatest Common Divisor (GCD)</span>
          <p class="step-content">
            Factors of ${num} and ${den} have greatest common divisor: <b>${divisor}</b>
          </p>
        </div>
        <div class="step-card">
          <span class="step-num-badge">Step 2: Divide Both by GCD</span>
          <p class="step-content">
            <code>Numerator: ${num} ÷ ${divisor} = ${reducedNum}</code><br>
            <code>Denominator: ${den} ÷ ${divisor} = ${reducedDen}</code>
          </p>
        </div>
      </div>
    `;
    resultDiv.style.display = "block";
  }

  btnCalc.addEventListener("click", simplify);
  simplify();
}
