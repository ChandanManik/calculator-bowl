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

  function solve(ev) {
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
    if (ev && ev.type === "click") resultDiv.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  btnCalc.addEventListener("click", solve);
  solve();
}

/* ============================================================================
 * Weighted Grade Calculator — course %, letter grade, final-exam requirement
 * ========================================================================== */
function renderGradeCalculator(container, calcDef) {
  const cats = ["Exams", "Homework", "Quizzes", "Participation", "Everything else"];
  const gDefaults = ["85", "92", "78", "95", ""];
  const wDefaults = ["35", "25", "12", "8", ""];
  container.innerHTML = `
    <table class="table">
      <thead><tr><th>Category</th><th>Grade (%)</th><th>Weight (%)</th></tr></thead>
      <tbody>
        ${cats.map((c, i) => {
          const k = i + 1;
          return `<tr>
            <td style="padding-top: 0.55rem;">${c}</td>
            <td><input type="number" id="gcG${k}" class="form-control" value="${gDefaults[i]}" min="0" max="150" step="0.01"></td>
            <td><input type="number" id="gcW${k}" class="form-control" value="${wDefaults[i]}" min="0" max="100" step="0.01"></td>
          </tr>`;
        }).join("")}
      </tbody>
    </table>

    <div class="form-grid" style="margin-top: 1.25rem;">
      <div class="form-group">
        <label class="form-label" for="gcTarget">Target Class Grade <span class="form-label-hint">%</span></label>
        <input type="number" id="gcTarget" class="form-control" value="88" min="0" max="150" step="0.5">
      </div>
    </div>

    <div class="calc-actions">
      <button type="button" id="btnCalcGc" class="btn btn-primary"><span>🎓 Calculate Grade</span></button>
      <button type="button" id="btnResetGc" class="btn btn-secondary"><span>↺ Reset</span></button>
    </div>

    <div id="gcResultContainer" class="results-section animate-fade-in" style="display: none; margin-top: 2rem;"></div>
  `;

  const gEls = [], wEls = [];
  for (let i = 1; i <= 5; i++) {
    gEls.push(container.querySelector(`#gcG${i}`));
    wEls.push(container.querySelector(`#gcW${i}`));
  }
  const targetInput = container.querySelector("#gcTarget");
  const resultDiv = container.querySelector("#gcResultContainer");

  const money = (n) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const money0 = (n) => n.toLocaleString("en-US", { maximumFractionDigits: 0 });

  function letterFor(pct) {
    if (pct >= 93) return "A";
    if (pct >= 90) return "A−";
    if (pct >= 87) return "B+";
    if (pct >= 83) return "B";
    if (pct >= 80) return "B−";
    if (pct >= 77) return "C+";
    if (pct >= 73) return "C";
    if (pct >= 70) return "C−";
    if (pct >= 67) return "D+";
    if (pct >= 63) return "D";
    if (pct >= 60) return "D−";
    return "F";
  }

  function calculate(ev) {
    let sumW = 0, sumGW = 0;
    const parts = [];
    for (let i = 0; i < 5; i++) {
      const gRaw = gEls[i].value, wRaw = wEls[i].value;
      if (gRaw === "" && wRaw === "") continue;
      const g = parseFloat(gRaw), w = parseFloat(wRaw);
      if (isNaN(g) || g < 0 || g > 150 || isNaN(w) || w < 0 || w > 100) {
        alert(`Row ${i + 1}: grades must be0–150% and weights0–100%.`);
        return;
      }
      sumW += w;
      sumGW += g * w;
      parts.push({ g, w });
    }
    if (!parts.length) { alert("Enter at least one category with a grade and weight."); return; }
    if (sumW > 100) { alert("Weights add up to more than 100% — fix the column."); return; }

    const current = sumGW / sumW;
    const letter = letterFor(current);
    const remaining = Math.round((100 - sumW) * 100) / 100;      // weight still up for grabs
    const target = parseFloat(targetInput.value);
    if (isNaN(target) || target < 0 || target > 150) { alert("Target grade must be between0% and150%."); return; }

    let required = null, reqWarn = "";
    if (remaining > 0) {
      required = (target * 100 - sumGW) / remaining;
      if (required > 100) reqWarn = `⚠ Hitting ${target}% needs <b>${money(required)}%</b> on the remaining ${remaining}% — above100%, so it is out of reach unless weights or earlier grades change.`;
      else if (required < 0) required = 0;
    }

    const partsLine = parts.map(p => `${money0(p.g * p.w)}`).join(" + ");

    resultDiv.innerHTML = `
      <div class="result-stat-grid">
        <div class="result-stat-card">
          <div class="result-stat-label">Current Weighted Grade</div>
          <div class="result-stat-val" style="color: var(--accent-emerald);">${money(current)}%</div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-label">Letter Grade</div>
          <div class="result-stat-val">${letter}</div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-label">Weight Entered</div>
          <div class="result-stat-val">${money0(sumW)}%</div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-label">Needed on Remaining ${money0(remaining)}%</div>
          <div class="result-stat-val">${required === null ? "—" : `${money(required)}%`}</div>
        </div>
      </div>

      ${reqWarn ? `<p style="margin-top: 1rem; color: var(--accent-orange);">${reqWarn}</p>` : ""}
      ${remaining === 0 ? `<p style="margin-top: 1rem; color: var(--text-muted);">All100% of the weight is entered — nothing remains, so the final is already baked into ${money(current)}%.</p>` : ""}

      <div class="steps-wrapper" style="margin-top: 2rem;">
        <div class="steps-header"><h3 class="steps-title">📊 Grade Breakdown</h3></div>
        <div class="step-card">
          <span class="step-num-badge">Step1 — Weighted average</span>
          <div class="math-formula-box">grade = Σ(weight × grade) ÷ Σweights</div>
          <p class="step-content">(${parts.map(p => `${money0(p.g)} × ${money0(p.w)}`).join(" + ")}) = <b>${money0(sumGW)}</b> ÷ ${money0(sumW)} = <b>${money(current)}%</b> → letter <b>${letter}</b>. Categories with bigger weights move the needle: one zero in a12%-weight quiz hurts far less than a bombed35% exam.</p>
        </div>
        <div class="step-card">
          <span class="step-num-badge">Step2 — Letter scale</span>
          <div class="math-formula-box">A ≥93 · A− ≥90 · B+ ≥87 · B ≥83 · B− ≥80 · C+ ≥77 · C ≥73 · C− ≥70 · D ≥60 · else F</div>
          <p class="step-content">${money(current)}% sits at <b>${letter}</b>. Most US scales allow a ±0.5% round-up at boundaries (some schools round87− to B) — if your syllabus differs, compare against its scale before celebrating.</p>
        </div>
        <div class="step-card">
          <span class="step-num-badge">Step3 — What the final must score</span>
          <div class="math-formula-box">final = (target × 100 − Σ(weight × grade)) ÷ remaining weight</div>
          <p class="step-content">${required === null
            ? `No weight remains, so the course grade is locked at ${money(current)}%.`
            : `(${money0(target)} ×100 − ${money0(sumGW)}) ÷ ${money0(remaining)} = <b>${money(required)}%</b> on what is left. Enter a single row (current standing + its weight) if you only know those two numbers — the algebra is identical.`}</p>
        </div>
      </div>
    `;

    resultDiv.style.display = "block";
    if (ev && ev.type === "click") resultDiv.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  gEls.concat(wEls).forEach(el => el.addEventListener("input", calculate));
  targetInput.addEventListener("input", calculate);
  container.querySelector("#btnCalcGc").addEventListener("click", calculate);
  container.querySelector("#btnResetGc").addEventListener("click", () => {
    gEls.forEach((el, i) => { el.value = gDefaults[i]; });
    wEls.forEach((el, i) => { el.value = wDefaults[i]; });
    targetInput.value = "88";
    resultDiv.style.display = "none";
  });

  calculate();
}
