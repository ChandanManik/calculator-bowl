/**
 * ============================================================================
 * Health & Fitness Calculators: Body Metrics Solvers
 * Calculators:
 * 1. BMI & BMR Calorie Calculator (Mifflin-St Jeor + TDEE)
 * ============================================================================
 */

/* ==========================================================================
   1. BMI & BMR Calorie Calculator
   ========================================================================== */
function renderBmiBmrCalculator(container, calcDef) {
  container.innerHTML = `
    <div class="calc-tool-card">
      <div class="form-grid">
        <div class="form-group">
          <label class="form-label" for="bmiUnit">
            Unit System
            <span class="form-label-hint">Metric / Imperial</span>
          </label>
          <select id="bmiUnit" class="form-control">
            <option value="metric" selected>Metric (kg, cm)</option>
            <option value="imperial">Imperial (lb, ft/in)</option>
          </select>
        </div>

        <div class="form-group" id="bmiWeightMetricGroup">
          <label class="form-label" for="bmiWeightKg">
            Weight
            <span class="form-label-hint">Kilograms</span>
          </label>
          <div class="input-with-addon">
            <input type="number" id="bmiWeightKg" class="form-control" value="70" min="20" max="350" step="0.1">
            <span class="input-addon suffix">kg</span>
          </div>
        </div>

        <div class="form-group" id="bmiWeightImperialGroup" style="display: none;">
          <label class="form-label" for="bmiWeightLb">
            Weight
            <span class="form-label-hint">Pounds</span>
          </label>
          <div class="input-with-addon">
            <input type="number" id="bmiWeightLb" class="form-control" value="154" min="44" max="770" step="0.1">
            <span class="input-addon suffix">lb</span>
          </div>
        </div>

        <div class="form-group" id="bmiHeightMetricGroup">
          <label class="form-label" for="bmiHeightCm">
            Height
            <span class="form-label-hint">Centimeters</span>
          </label>
          <div class="input-with-addon">
            <input type="number" id="bmiHeightCm" class="form-control" value="175" min="80" max="250" step="0.1">
            <span class="input-addon suffix">cm</span>
          </div>
        </div>

        <div class="form-group" id="bmiHeightImperialGroup" style="display: none;">
          <label class="form-label">
            Height
            <span class="form-label-hint">Feet + Inches</span>
          </label>
          <div style="display: flex; gap: 0.5rem;">
            <div class="input-with-addon" style="flex: 1;">
              <input type="number" id="bmiHeightFt" class="form-control" value="5" min="2" max="8" step="1">
              <span class="input-addon suffix">ft</span>
            </div>
            <div class="input-with-addon" style="flex: 1;">
              <input type="number" id="bmiHeightIn" class="form-control" value="9" min="0" max="11" step="1">
              <span class="input-addon suffix">in</span>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" for="bmiAge">
            Age
            <span class="form-label-hint">Years</span>
          </label>
          <div class="input-with-addon">
            <input type="number" id="bmiAge" class="form-control" value="30" min="10" max="100" step="1">
            <span class="input-addon suffix">Yrs</span>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" for="bmiGender">
            Biological Sex
            <span class="form-label-hint">BMR formula</span>
          </label>
          <select id="bmiGender" class="form-control">
            <option value="male" selected>Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label" for="bmiActivity">
            Activity Level
            <span class="form-label-hint">Daily lifestyle</span>
          </label>
          <select id="bmiActivity" class="form-control">
            <option value="1.2">Sedentary (little exercise)</option>
            <option value="1.375">Light (1-3 days/week)</option>
            <option value="1.55" selected>Moderate (3-5 days/week)</option>
            <option value="1.725">Active (6-7 days/week)</option>
            <option value="1.9">Very active (physical job)</option>
          </select>
        </div>
      </div>

      <div class="calc-actions">
        <button type="button" id="btnCalcBmi" class="btn btn-primary">
          <span>⚡ Calculate BMI & Calories</span>
        </button>
        <button type="button" id="btnResetBmi" class="btn btn-secondary">
          <span>↺ Reset</span>
        </button>
      </div>

      <div id="bmiResultContainer" class="results-section animate-fade-in" style="display: none; margin-top: 2rem;"></div>
    </div>
  `;

  const unitSel = container.querySelector("#bmiUnit");
  const btnCalc = container.querySelector("#btnCalcBmi");
  const btnReset = container.querySelector("#btnResetBmi");
  const resultDiv = container.querySelector("#bmiResultContainer");

  function syncUnitVisibility() {
    const imperial = unitSel.value === "imperial";
    container.querySelector("#bmiWeightMetricGroup").style.display = imperial ? "none" : "";
    container.querySelector("#bmiWeightImperialGroup").style.display = imperial ? "" : "none";
    container.querySelector("#bmiHeightMetricGroup").style.display = imperial ? "none" : "";
    container.querySelector("#bmiHeightImperialGroup").style.display = imperial ? "" : "none";
  }

  function bmiCategory(bmi) {
    if (bmi < 18.5) return { label: "Underweight", color: "#38bdf8" };
    if (bmi < 25) return { label: "Healthy Weight", color: "#10b981" };
    if (bmi < 30) return { label: "Overweight", color: "#f59e0b" };
    return { label: "Obese", color: "#f43f5e" };
  }

  function calculate() {
    const imperial = unitSel.value === "imperial";
    const age = parseInt(container.querySelector("#bmiAge").value) || 0;
    const gender = container.querySelector("#bmiGender").value;
    const activity = parseFloat(container.querySelector("#bmiActivity").value) || 1.2;

    let weightKg, heightCm;
    if (imperial) {
      const lb = parseFloat(container.querySelector("#bmiWeightLb").value) || 0;
      const ft = parseFloat(container.querySelector("#bmiHeightFt").value) || 0;
      const inch = parseFloat(container.querySelector("#bmiHeightIn").value) || 0;
      weightKg = lb * 0.45359237;
      heightCm = (ft * 12 + inch) * 2.54;
    } else {
      weightKg = parseFloat(container.querySelector("#bmiWeightKg").value) || 0;
      heightCm = parseFloat(container.querySelector("#bmiHeightCm").value) || 0;
    }

    if (weightKg <= 0 || heightCm <= 0 || age <= 0) {
      alert("Please enter a valid weight, height, and age greater than 0.");
      return;
    }

    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);
    const cat = bmiCategory(bmi);

    // Mifflin-St Jeor equation
    const bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + (gender === "male" ? 5 : -161);
    const tdee = bmr * activity;
    const lose = tdee - 500;
    const gain = tdee + 300;

    // Healthy weight range for height (BMI 18.5 - 24.9)
    const minHealthy = 18.5 * heightM * heightM;
    const maxHealthy = 24.9 * heightM * heightM;

    // BMI gauge position (clamped 14 - 34 scale)
    const gaugePos = Math.min(100, Math.max(0, ((bmi - 14) / (34 - 14)) * 100));

    resultDiv.innerHTML = `
      <div class="result-hero-box">
        <span class="result-hero-label">Body Mass Index (BMI)</span>
        <div class="result-hero-value">
          ${bmi.toFixed(1)}
          <span style="font-size: 1rem; font-weight: 600; color: ${cat.color};">${cat.label}</span>
        </div>
        <div style="margin-top: 1rem; height: 12px; border-radius: 999px; background: linear-gradient(to right, #38bdf8 0%, #38bdf8 22.5%, #10b981 22.5%, #10b981 55%, #f59e0b 55%, #f59e0b 80%, #f43f5e 80%, #f43f5e 100%); position: relative;">
          <div style="position: absolute; top: -4px; left: calc(${gaugePos.toFixed(1)}% - 2px); width: 4px; height: 20px; background: #fff; border: 1px solid var(--text-primary); border-radius: 2px;"></div>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-muted); margin-top: 0.35rem;">
          <span>14</span><span>18.5</span><span>25</span><span>30</span><span>34</span>
        </div>
      </div>

      <div class="result-stat-grid">
        <div class="result-stat-card">
          <div class="result-stat-label">BMR (At Rest)</div>
          <div class="result-stat-val">${Math.round(bmr).toLocaleString()} kcal/day</div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-label">TDEE (Daily Need)</div>
          <div class="result-stat-val" style="color: var(--accent-emerald);">${Math.round(tdee).toLocaleString()} kcal/day</div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-label">Lose ~0.5kg/week</div>
          <div class="result-stat-val">${Math.round(lose).toLocaleString()} kcal/day</div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-label">Gain Muscle</div>
          <div class="result-stat-val">${Math.round(gain).toLocaleString()} kcal/day</div>
        </div>
      </div>

      <div class="steps-wrapper" style="margin-top: 2rem;">
        <div class="steps-header">
          <h3 class="steps-title">📐 Mathematical Formulas</h3>
        </div>
        <div class="step-card">
          <span class="step-num-badge">BMI Formula (WHO)</span>
          <div class="math-formula-box">BMI = weight (kg) / height (m)²</div>
          <p class="step-content">BMI = ${weightKg.toFixed(1)} / ${heightM.toFixed(2)}² = <b>${bmi.toFixed(1)} (${cat.label})</b>. Healthy range for your height: <b>${minHealthy.toFixed(1)} – ${maxHealthy.toFixed(1)} kg</b>.</p>
        </div>
        <div class="step-card">
          <span class="step-num-badge">BMR — Mifflin-St Jeor (${gender})</span>
          <div class="math-formula-box">BMR = 10W + 6.25H − 5A ${gender === "male" ? "+ 5" : "− 161"}</div>
          <p class="step-content">
            BMR = 10 × ${weightKg.toFixed(1)} + 6.25 × ${heightCm.toFixed(1)} − 5 × ${age} ${gender === "male" ? "+ 5" : "− 161"} = <b>${Math.round(bmr).toLocaleString()} kcal/day</b><br>
            TDEE = ${Math.round(bmr).toLocaleString()} × ${activity} = <b>${Math.round(tdee).toLocaleString()} kcal/day</b>
          </p>
        </div>
      </div>
    `;

    resultDiv.style.display = "block";
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  unitSel.addEventListener("change", () => { syncUnitVisibility(); calculate(); });
  btnCalc.addEventListener("click", calculate);
  btnReset.addEventListener("click", () => {
    unitSel.value = "metric";
    container.querySelector("#bmiWeightKg").value = "70";
    container.querySelector("#bmiHeightCm").value = "175";
    container.querySelector("#bmiAge").value = "30";
    container.querySelector("#bmiGender").value = "male";
    container.querySelector("#bmiActivity").value = "1.55";
    syncUnitVisibility();
    resultDiv.style.display = "none";
  });

  syncUnitVisibility();
  calculate();
}
