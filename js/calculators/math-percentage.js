/**
 * ============================================================================
 * Math Calculators: Percentage (3-in-1) & Quadratic Formula Solver
 * ============================================================================
 */

function renderPercentageCalculator(container, calcDef) {
  container.innerHTML = `
    <!-- Mode 1: What is X% of Y? -->
    <div style="background: var(--bg-subtle); border-radius: var(--radius-lg); padding: 1.5rem; margin-bottom: 1.5rem; border: 1px solid var(--border-color);">
      <h4 style="font-family: var(--font-heading); font-size: 1.1rem; margin-bottom: 1rem; color: var(--accent-primary);">1. What is X% of Y?</h4>
      <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
        <span style="font-weight: 600;">What is</span>
        <input type="number" id="p1Percent" class="form-control" value="15" style="width: 100px; text-align: center; border: 1.5px solid var(--border-color); border-radius: var(--radius-md);">
        <span style="font-weight: 600;">% of</span>
        <input type="number" id="p1Total" class="form-control" value="250" style="width: 120px; text-align: center; border: 1.5px solid var(--border-color); border-radius: var(--radius-md);">
        <button type="button" id="btnCalcP1" class="btn btn-primary btn-sm">Calculate</button>
      </div>
      <div id="p1Result" style="margin-top: 1rem; font-size: 1.1rem; font-weight: 700; color: var(--accent-emerald);"></div>
    </div>

    <!-- Mode 2: X is what % of Y? -->
    <div style="background: var(--bg-subtle); border-radius: var(--radius-lg); padding: 1.5rem; margin-bottom: 1.5rem; border: 1px solid var(--border-color);">
      <h4 style="font-family: var(--font-heading); font-size: 1.1rem; margin-bottom: 1rem; color: var(--accent-secondary);">2. X is what percent of Y?</h4>
      <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
        <input type="number" id="p2Part" class="form-control" value="45" style="width: 100px; text-align: center; border: 1.5px solid var(--border-color); border-radius: var(--radius-md);">
        <span style="font-weight: 600;">is what % of</span>
        <input type="number" id="p2Whole" class="form-control" value="180" style="width: 120px; text-align: center; border: 1.5px solid var(--border-color); border-radius: var(--radius-md);">
        <button type="button" id="btnCalcP2" class="btn btn-primary btn-sm">Calculate</button>
      </div>
      <div id="p2Result" style="margin-top: 1rem; font-size: 1.1rem; font-weight: 700; color: var(--accent-emerald);"></div>
    </div>

    <!-- Mode 3: Percentage Increase / Decrease -->
    <div style="background: var(--bg-subtle); border-radius: var(--radius-lg); padding: 1.5rem; border: 1px solid var(--border-color);">
      <h4 style="font-family: var(--font-heading); font-size: 1.1rem; margin-bottom: 1rem; color: var(--accent-amber);">3. Percentage Increase / Decrease</h4>
      <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
        <span style="font-weight: 600;">From</span>
        <input type="number" id="p3Initial" class="form-control" value="80" style="width: 110px; text-align: center; border: 1.5px solid var(--border-color); border-radius: var(--radius-md);">
        <span style="font-weight: 600;">to</span>
        <input type="number" id="p3Final" class="form-control" value="120" style="width: 110px; text-align: center; border: 1.5px solid var(--border-color); border-radius: var(--radius-md);">
        <button type="button" id="btnCalcP3" class="btn btn-primary btn-sm">Calculate</button>
      </div>
      <div id="p3Result" style="margin-top: 1rem; font-size: 1.1rem; font-weight: 700; color: var(--accent-emerald);"></div>
    </div>
  `;

  // Mode 1 Handler
  const calcP1 = () => {
    const x = parseFloat(container.querySelector("#p1Percent").value) || 0;
    const y = parseFloat(container.querySelector("#p1Total").value) || 0;
    const res = (x / 100) * y;
    container.querySelector("#p1Result").innerHTML = `
      Result: <b>${res.toFixed(4).replace(/\\.?0+$/, '')}</b><br>
      <span style="font-size: 0.85rem; color: var(--text-secondary); font-weight: 400;">Formula: (${x} / 100) × ${y} = ${res}</span>
    `;
  };

  // Mode 2 Handler
  const calcP2 = () => {
    const part = parseFloat(container.querySelector("#p2Part").value) || 0;
    const whole = parseFloat(container.querySelector("#p2Whole").value) || 1;
    const res = (part / whole) * 100;
    container.querySelector("#p2Result").innerHTML = `
      Result: <b>${res.toFixed(2)}%</b><br>
      <span style="font-size: 0.85rem; color: var(--text-secondary); font-weight: 400;">Formula: (${part} / ${whole}) × 100 = ${res.toFixed(2)}%</span>
    `;
  };

  // Mode 3 Handler
  const calcP3 = () => {
    const init = parseFloat(container.querySelector("#p3Initial").value) || 0;
    const fin = parseFloat(container.querySelector("#p3Final").value) || 0;
    const change = fin - init;
    const percentChange = (change / Math.abs(init)) * 100;
    const type = percentChange >= 0 ? "Increase" : "Decrease";
    container.querySelector("#p3Result").innerHTML = `
      Result: <b>${Math.abs(percentChange).toFixed(2)}% ${type}</b> (Difference: ${change > 0 ? '+' : ''}${change})<br>
      <span style="font-size: 0.85rem; color: var(--text-secondary); font-weight: 400;">Formula: ((${fin} - ${init}) / |${init}|) × 100 = ${percentChange.toFixed(2)}%</span>
    `;
  };

  container.querySelector("#btnCalcP1").addEventListener("click", calcP1);
  container.querySelector("#btnCalcP2").addEventListener("click", calcP2);
  container.querySelector("#btnCalcP3").addEventListener("click", calcP3);

  calcP1();
  calcP2();
  calcP3();
}

function renderQuadraticCalculator(container, calcDef) {
  container.innerHTML = `
    <div style="background: var(--bg-subtle); padding: 1.75rem; border-radius: var(--radius-lg); border: 1px solid var(--border-color); text-align: center; margin-bottom: 2rem;">
      <div style="font-family: var(--font-heading); font-size: 1.5rem; font-weight: 700; margin-bottom: 1.25rem;">
        <span style="color: var(--accent-primary);">a</span>x² + <span style="color: var(--accent-secondary);">b</span>x + <span style="color: var(--accent-amber);">c</span> = 0
      </div>

      <div style="display: flex; align-items: center; justify-content: center; gap: 1rem; flex-wrap: wrap;">
        <div style="display: flex; align-items: center; gap: 0.4rem;">
          <label style="font-weight: 700; color: var(--accent-primary);">a =</label>
          <input type="number" id="quadA" class="form-control" value="1" style="width: 80px; text-align: center; border: 1.5px solid var(--border-color); border-radius: var(--radius-md);">
        </div>

        <div style="display: flex; align-items: center; gap: 0.4rem;">
          <label style="font-weight: 700; color: var(--accent-secondary);">b =</label>
          <input type="number" id="quadB" class="form-control" value="-5" style="width: 80px; text-align: center; border: 1.5px solid var(--border-color); border-radius: var(--radius-md);">
        </div>

        <div style="display: flex; align-items: center; gap: 0.4rem;">
          <label style="font-weight: 700; color: var(--accent-amber);">c =</label>
          <input type="number" id="quadC" class="form-control" value="6" style="width: 80px; text-align: center; border: 1.5px solid var(--border-color); border-radius: var(--radius-md);">
        </div>
      </div>
    </div>

    <div class="calc-actions" style="justify-content: center;">
      <button type="button" id="btnSolveQuad" class="btn btn-primary">
        <span>⚡ Solve Quadratic Equation</span>
      </button>
    </div>

    <div id="quadResultContainer" class="results-section animate-fade-in" style="display: none;"></div>
  `;

  const btnCalc = container.querySelector("#btnSolveQuad");
  const resultDiv = container.querySelector("#quadResultContainer");

  function solve() {
    const a = parseFloat(container.querySelector("#quadA").value) || 0;
    const b = parseFloat(container.querySelector("#quadB").value) || 0;
    const c = parseFloat(container.querySelector("#quadC").value) || 0;

    if (a === 0) {
      alert("In a quadratic equation, 'a' cannot equal 0.");
      return;
    }

    // Discriminant: D = b^2 - 4ac
    const D = (b * b) - (4 * a * c);
    let rootHtml = "";
    let stepHtml = "";

    if (D > 0) {
      const x1 = (-b + Math.sqrt(D)) / (2 * a);
      const x2 = (-b - Math.sqrt(D)) / (2 * a);
      rootHtml = `
        <div class="result-hero-box">
          <span class="result-hero-label">Two Distinct Real Roots Found (Δ > 0)</span>
          <div class="result-hero-value" style="gap: 1.5rem; font-size: 2rem;">
            <span>x₁ = <b style="color: var(--accent-emerald);">${x1.toFixed(4).replace(/\\.?0+$/, '')}</b></span>
            <span>x₂ = <b style="color: var(--accent-secondary);">${x2.toFixed(4).replace(/\\.?0+$/, '')}</b></span>
          </div>
        </div>
      `;
    } else if (D === 0) {
      const x = -b / (2 * a);
      rootHtml = `
        <div class="result-hero-box">
          <span class="result-hero-label">One Repeated Real Root (Δ = 0)</span>
          <div class="result-hero-value" style="font-size: 2rem;">
            <span>x = <b style="color: var(--accent-emerald);">${x.toFixed(4).replace(/\\.?0+$/, '')}</b></span>
          </div>
        </div>
      `;
    } else {
      const realPart = (-b / (2 * a)).toFixed(4).replace(/\\.?0+$/, '');
      const imagPart = (Math.sqrt(-D) / (2 * a)).toFixed(4).replace(/\\.?0+$/, '');
      rootHtml = `
        <div class="result-hero-box">
          <span class="result-hero-label">Two Complex / Imaginary Roots (Δ < 0)</span>
          <div class="result-hero-value" style="font-size: 1.8rem;">
            <span>x = <b>${realPart} ± ${imagPart}i</b></span>
          </div>
        </div>
      `;
    }

    resultDiv.innerHTML = `
      ${rootHtml}

      <div class="steps-wrapper">
        <h3 class="steps-title">📐 Quadratic Formula Steps</h3>
        
        <div class="step-card">
          <span class="step-num-badge">Step 1: Calculate the Discriminant (Δ)</span>
          <div class="math-formula-box">Δ = b² - 4ac</div>
          <p class="step-content">
            <code>Δ = (${b})² - 4(${a})(${c}) = ${b * b} - ${4 * a * c} = <b>${D}</b></code>
          </p>
        </div>

        <div class="step-card">
          <span class="step-num-badge">Step 2: Apply the Quadratic Formula</span>
          <div class="math-formula-box">x = [ -b ± √(b² - 4ac) ] / (2a)</div>
          <p class="step-content">
            <code>x = [ -(${b}) ± √(${D}) ] / (2 × ${a})</code>
          </p>
        </div>
      </div>
    `;

    resultDiv.style.display = "block";
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  btnCalc.addEventListener("click", solve);
  solve();
}
