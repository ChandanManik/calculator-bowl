/**
 * ============================================================================
 * Health & Fitness Calculators: Body Metrics Solvers
 * Calculators:
 * 1. BMI & BMR Calorie Calculator (Mifflin-St Jeor + TDEE)
 * 2. Body Fat Percentage & Ideal Weight (US Navy + Devine)
 * 3. Daily Water Intake Calculator (Weight + Activity + Climate)
 * 4. Macro Calculator (Protein, Carbs & Fat split)
 * 5. Running Pace & Race Time Calculator (Riegel predictions)
 * 6. Pregnancy Due Date Calculator (Naegele's rule)
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

  function calculate(ev) {
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
    if (ev && ev.type === "click") resultDiv.scrollIntoView({ behavior: "smooth", block: "nearest" });
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

/* ==========================================================================
   Body Fat Percentage & Ideal Weight Calculator (US Navy Method)
   ========================================================================== */
function renderBodyFatCalculator(container, calcDef) {
  container.innerHTML = `
    <div class="form-grid">
      <div class="form-group">
        <label class="form-label" for="bfGender">
          Biological Sex
          <span class="form-label-hint">Navy formula</span>
        </label>
        <select id="bfGender" class="form-control">
          <option value="male" selected>Male</option>
          <option value="female">Female</option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label" for="bfHeight">
          Height
          <span class="form-label-hint">Centimeters</span>
        </label>
        <div class="input-with-addon">
          <input type="number" id="bfHeight" class="form-control" value="175" min="100" max="230" step="0.5">
          <span class="input-addon suffix">cm</span>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="bfNeck">
          Neck Circumference
          <span class="form-label-hint">Below larynx</span>
        </label>
        <div class="input-with-addon">
          <input type="number" id="bfNeck" class="form-control" value="38" min="15" max="80" step="0.5">
          <span class="input-addon suffix">cm</span>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="bfWaist">
          Waist Circumference
          <span class="form-label-hint">At navel</span>
        </label>
        <div class="input-with-addon">
          <input type="number" id="bfWaist" class="form-control" value="85" min="30" max="200" step="0.5">
          <span class="input-addon suffix">cm</span>
        </div>
      </div>

      <div class="form-group" id="bfHipGroup" style="display: none;">
        <label class="form-label" for="bfHip">
          Hip Circumference
          <span class="form-label-hint">Females only</span>
        </label>
        <div class="input-with-addon">
          <input type="number" id="bfHip" class="form-control" value="98" min="40" max="200" step="0.5">
          <span class="input-addon suffix">cm</span>
        </div>
      </div>
    </div>

    <div class="calc-actions">
      <button type="button" id="btnCalcBf" class="btn btn-primary">
        <span>⚡ Calculate Body Fat %</span>
      </button>
      <button type="button" id="btnResetBf" class="btn btn-secondary">
        <span>↺ Reset</span>
      </button>
    </div>

    <div id="bfResultContainer" class="results-section animate-fade-in" style="display: none; margin-top: 2rem;"></div>
  `;

  const genderSel = container.querySelector("#bfGender");
  const hipGroup = container.querySelector("#bfHipGroup");
  const btnCalc = container.querySelector("#btnCalcBf");
  const btnReset = container.querySelector("#btnResetBf");
  const resultDiv = container.querySelector("#bfResultContainer");

  function classify(gender, pct) {
    if (gender === "male") {
      if (pct < 6) return { label: "Essential Fat", color: "#38bdf8" };
      if (pct < 14) return { label: "Athletic", color: "#10b981" };
      if (pct < 18) return { label: "Fitness", color: "#22c55e" };
      if (pct < 25) return { label: "Acceptable", color: "#f59e0b" };
      return { label: "Obese Range", color: "#f43f5e" };
    }
    if (pct < 14) return { label: "Essential Fat", color: "#38bdf8" };
    if (pct < 21) return { label: "Athletic", color: "#10b981" };
    if (pct < 25) return { label: "Fitness", color: "#22c55e" };
    if (pct < 32) return { label: "Acceptable", color: "#f59e0b" };
    return { label: "Obese Range", color: "#f43f5e" };
  }

  function calculate(ev) {
    const gender = genderSel.value;
    const height = parseFloat(container.querySelector("#bfHeight").value) || 0;
    const neck = parseFloat(container.querySelector("#bfNeck").value) || 0;
    const waist = parseFloat(container.querySelector("#bfWaist").value) || 0;
    const hip = parseFloat(container.querySelector("#bfHip").value) || 0;

    if (height <= 0 || neck <= 0 || waist <= 0) {
      alert("Please enter valid height, neck, and waist measurements.");
      return;
    }

    let bodyFat;
    let formulaText;
    if (gender === "male") {
      if (waist <= neck) {
        alert("Waist must be greater than neck circumference.");
        return;
      }
    // US Navy male: 495 / (1.0324 − 0.19077·log10(waist − neck) + 0.15456·log10(height)) − 450
      bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450;
      formulaText = `495 ÷ (1.0324 − 0.19077·log₁₀(${waist} − ${neck}) + 0.15456·log₁₀(${height})) − 450`;
    } else {
      if (hip <= 0) {
        alert("Please enter a valid hip circumference.");
        return;
      }
      if (waist + hip <= neck) {
        alert("Waist + hip must be greater than neck circumference.");
        return;
      }
    // US Navy female: 495 / (1.29579 − 0.35004·log10(waist + hip − neck) + 0.22100·log10(height)) − 450
      bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.22100 * Math.log10(height)) - 450;
      formulaText = `495 ÷ (1.29579 − 0.35004·log₁₀(${waist} + ${hip} − ${neck}) + 0.22100·log₁₀(${height})) − 450`;
    }

    if (!isFinite(bodyFat) || bodyFat < 1 || bodyFat > 65) {
      alert("Measurements look inconsistent — please double-check them.");
      return;
    }

    const cat = classify(gender, bodyFat);

    // Devine ideal body weight (kg) from height in cm
    const heightIn = height / 2.54;
    const extraIn = Math.max(0, heightIn - 60);
    const idealKg = (gender === "male" ? 50 : 45.5) + 2.3 * extraIn;

    // Lean mass & fat mass require body weight — derive from ideal as reference only if unknown.
    // Instead, show % gauge position on 5–45% scale.
    const gaugePos = Math.min(100, Math.max(0, ((bodyFat - 5) / (45 - 5)) * 100));

    resultDiv.innerHTML = `
      <div class="result-hero-box">
        <span class="result-hero-label">Estimated Body Fat</span>
        <div class="result-hero-value">
          ${bodyFat.toFixed(1)}%
          <span style="font-size: 1rem; font-weight: 600; color: ${cat.color};">${cat.label}</span>
        </div>
        <div style="margin-top: 1rem; height: 12px; border-radius: 999px; background: linear-gradient(to right, #38bdf8 0%, #38bdf8 20%, #10b981 20%, #10b981 47.5%, #22c55e 47.5%, #22c55e 57.5%, #f59e0b 57.5%, #f59e0b 77.5%, #f43f5e 77.5%, #f43f5e 100%); position: relative;">
          <div style="position: absolute; top: -4px; left: calc(${gaugePos.toFixed(1)}% - 2px); width: 4px; height: 20px; background: #fff; border: 1px solid var(--text-primary); border-radius: 2px;"></div>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-muted); margin-top: 0.35rem;">
          <span>5%</span><span>${gender === "male" ? "6" : "14"}</span><span>${gender === "male" ? "14" : "21"}</span><span>${gender === "male" ? "18" : "25"}</span><span>45%</span>
        </div>
      </div>

      <div class="result-stat-grid">
        <div class="result-stat-card">
          <div class="result-stat-label">Classification</div>
          <div class="result-stat-val" style="color: ${cat.color};">${cat.label}</div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-label">Ideal Weight (Devine)</div>
          <div class="result-stat-val">${idealKg.toFixed(1)} kg</div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-label">Ideal in Pounds</div>
          <div class="result-stat-val">${(idealKg * 2.20462).toFixed(1)} lbs</div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-label">Method</div>
          <div class="result-stat-val">US Navy</div>
        </div>
      </div>

      <div class="steps-wrapper" style="margin-top: 2rem;">
        <div class="steps-header">
          <h3 class="steps-title">📐 Mathematical Formulas</h3>
        </div>
        <div class="step-card">
          <span class="step-num-badge">US Navy Circumference Method</span>
          <div class="math-formula-box">${formulaText}</div>
          <p class="step-content">
            Log base 10 of the circumference differences converts your tape measurements into an estimated body-fat percentage:
            <b>${bodyFat.toFixed(1)}% (${cat.label})</b>.
          </p>
        </div>
        <div class="step-card">
          <span class="step-num-badge">Ideal Body Weight (Devine Formula)</span>
          <div class="math-formula-box">${gender === "male" ? "50" : "45.5"} kg + 2.3 kg × (inches over 5′0″)</div>
          <p class="step-content">
            Height ${height} cm = ${heightIn.toFixed(1)} in → ${extraIn.toFixed(1)} in over 60 in →
            ${gender === "male" ? "50" : "45.5"} + 2.3 × ${extraIn.toFixed(1)} = <b>${idealKg.toFixed(1)} kg (${(idealKg * 2.20462).toFixed(1)} lbs)</b>
          </p>
        </div>
      </div>
    `;

    resultDiv.style.display = "block";
    if (ev && ev.type === "click") resultDiv.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  genderSel.addEventListener("change", () => {
    hipGroup.style.display = genderSel.value === "female" ? "" : "none";
    calculate();
  });
  btnCalc.addEventListener("click", calculate);
  btnReset.addEventListener("click", () => {
    genderSel.value = "male";
    container.querySelector("#bfHeight").value = "175";
    container.querySelector("#bfNeck").value = "38";
    container.querySelector("#bfWaist").value = "85";
    container.querySelector("#bfHip").value = "98";
    hipGroup.style.display = "none";
    resultDiv.style.display = "none";
  });

  hipGroup.style.display = genderSel.value === "female" ? "" : "none";
  calculate();
}

/* ==========================================================================
   Daily Water Intake Calculator
   ========================================================================== */
function renderWaterIntakeCalculator(container, calcDef) {
  container.innerHTML = `
    <div class="form-grid">
      <div class="form-group">
        <label class="form-label" for="wiWeight">
          Body Weight
          <span class="form-label-hint">Kilograms</span>
        </label>
        <div class="input-with-addon">
          <input type="number" id="wiWeight" class="form-control" value="70" min="20" max="350" step="0.5">
          <span class="input-addon suffix">kg</span>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="wiActivity">
          Daily Activity Level
          <span class="form-label-hint">Exercise / labor</span>
        </label>
        <select id="wiActivity" class="form-control">
          <option value="0">Mostly sedentary (desk work)</option>
          <option value="350" selected>Moderate (30-60 min exercise)</option>
          <option value="700">High (60-120 min hard training)</option>
          <option value="1000">Extreme (2+ hrs / manual labor)</option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label" for="wiClimate">
          Climate
          <span class="form-label-hint">Temperature &amp; humidity</span>
        </label>
        <select id="wiClimate" class="form-control">
          <option value="0" selected>Temperate / indoor AC</option>
          <option value="350">Warm or dry air</option>
          <option value="700">Hot, humid, or high altitude</option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label" for="wiSpecial">
          Special Condition
          <span class="form-label-hint">Pregnancy / illness</span>
        </label>
        <select id="wiSpecial" class="form-control">
          <option value="0" selected>None</option>
          <option value="300">Pregnant</option>
          <option value="700">Breastfeeding</option>
          <option value="500">Fever, vomiting, or diarrhea</option>
        </select>
      </div>
    </div>

    <div class="calc-actions">
      <button type="button" id="btnCalcWi" class="btn btn-primary">
        <span>💧 Calculate Daily Water Needs</span>
      </button>
      <button type="button" id="btnResetWi" class="btn btn-secondary">
        <span>↺ Reset</span>
      </button>
    </div>

    <div id="wiResultContainer" class="results-section animate-fade-in" style="display: none; margin-top: 2rem;"></div>
  `;

  const btnCalc = container.querySelector("#btnCalcWi");
  const btnReset = container.querySelector("#btnResetWi");
  const resultDiv = container.querySelector("#wiResultContainer");

  function calculate(ev) {
    const weight = parseFloat(container.querySelector("#wiWeight").value) || 0;
    const activity = parseFloat(container.querySelector("#wiActivity").value) || 0;
    const climate = parseFloat(container.querySelector("#wiClimate").value) || 0;
    const special = parseFloat(container.querySelector("#wiSpecial").value) || 0;

    if (weight <= 0) {
      alert("Please enter a valid body weight.");
      return;
    }

    // Base: 33 mL per kg of body weight (Institute of Medicine reference)
    const base = weight * 33;
    const total = base + activity + climate + special;
    const liters = total / 1000;
    const ounces = total / 29.5735;
    const cups = total / 240;
    const glasses = total / 250;
    const bottles = total / 500;

    // Half-body-weight check: is the target below 30 mL/kg?
    const minSafe = weight * 30;

    // Hourly schedule across a 16 waking window
    const perHour = total / 16;

    // Pre/post workout bonus (500 mL per hour of intense training)
    const hours = activity > 0 ? activity / 350 : 0;

    resultDiv.innerHTML = `
      <div class="result-hero-box">
        <span class="result-hero-label">Daily Water Intake Target</span>
        <div class="result-hero-value">${liters.toFixed(2)} <span style="font-size: 1.1rem; color: var(--text-secondary); font-weight: 600;">liters/day</span></div>
        <span style="font-size: 0.95rem; color: var(--text-secondary);">
          ≈ ${ounces.toFixed(0)} oz · ${cups.toFixed(1)} cups · ${glasses.toFixed(1)} × 250 mL glasses
        </span>
      </div>

      <div class="result-stat-grid">
        <div class="result-stat-card">
          <div class="result-stat-label">Base (33 mL × ${weight} kg)</div>
          <div class="result-stat-val">${(base / 1000).toFixed(2)} L</div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-label">Activity Bonus</div>
          <div class="result-stat-val" style="color: var(--accent-emerald);">+${(activity / 1000).toFixed(2)} L</div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-label">Climate Bonus</div>
          <div class="result-stat-val" style="color: var(--accent-emerald);">+${(climate / 1000).toFixed(2)} L</div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-label">Special Condition</div>
          <div class="result-stat-val" style="color: var(--accent-emerald);">+${(special / 1000).toFixed(2)} L</div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-label">500 mL Bottles</div>
          <div class="result-stat-val">${bottles.toFixed(1)}</div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-label">Per Waking Hour (16h)</div>
          <div class="result-stat-val">${perHour.toFixed(0)} mL</div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-label">Safe Minimum (30 mL/kg)</div>
          <div class="result-stat-val">${minSafe.toFixed(0)} mL</div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-label">Status</div>
          <div class="result-stat-val" style="color: ${total >= minSafe ? 'var(--accent-emerald)' : '#f59e0b'};">${total >= minSafe ? 'Above Minimum' : 'Below Minimum'}</div>
        </div>
      </div>

      <div class="steps-wrapper" style="margin-top: 2rem;">
        <div class="steps-header">
          <h3 class="steps-title">📐 Calculation Breakdown</h3>
        </div>
        <div class="step-card">
          <span class="step-num-badge">Step 1 — Base Need</span>
          <div class="math-formula-box">base = 33 mL × body weight (kg)</div>
          <p class="step-content">33 × ${weight} = <b>${base.toFixed(0)} mL</b> (Institute of Medicine reference for adults)</p>
        </div>
        <div class="step-card">
          <span class="step-num-badge">Step 2 — Add Lifestyle Adjustments</span>
          <div class="math-formula-box">total = base + activity + climate + special</div>
          <p class="step-content">${base.toFixed(0)} + ${activity} + ${climate} + ${special} = <b>${total.toFixed(0)} mL/day</b>${hours > 0 ? ` — includes ${hours.toFixed(0)} hour(s) of training at ~500 mL/hr sweat loss` : ""}</p>
        </div>
        <div class="step-card">
          <span class="step-num-badge">Step 3 — Drink Schedule</span>
          <div class="math-formula-box">per hour = total ÷ 16 waking hours</div>
          <p class="step-content">Aim for <b>${perHour.toFixed(0)} mL every hour</b> while awake, plus ${hours > 0 ? `${(500).toFixed(0)} mL for each training hour ` : ""}— drinking steadily beats catching up at night.</p>
        </div>
      </div>
    `;

    resultDiv.style.display = "block";
    if (ev && ev.type === "click") resultDiv.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  btnCalc.addEventListener("click", calculate);
  btnReset.addEventListener("click", () => {
    container.querySelector("#wiWeight").value = "70";
    container.querySelector("#wiActivity").value = "350";
    container.querySelector("#wiClimate").value = "0";
    container.querySelector("#wiSpecial").value = "0";
    resultDiv.style.display = "none";
  });

  calculate();
}

/* ==========================================================================
   Macro Calculator — Protein, Carbs & Fat split
   ========================================================================== */
function renderMacroCalculator(container, calcDef) {
  container.innerHTML = `
    <div class="form-grid">
      <div class="form-group">
        <label class="form-label" for="mcCalories">Daily Calorie Target <span class="form-label-hint">From TDEE or goal</span></label>
        <div class="input-with-addon">
          <input type="number" id="mcCalories" class="form-control" value="2200" min="500" max="10000" step="10">
          <span class="input-addon suffix">kcal</span>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="mcWeight">Body Weight <span class="form-label-hint">For ratio-based protein</span></label>
        <div class="input-with-addon">
          <input type="number" id="mcWeight" class="form-control" value="70" min="20" max="350" step="0.5">
          <span class="input-addon suffix">kg</span>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="mcMethod">Split Method</label>
        <select id="mcMethod" class="form-control">
          <option value="goal" selected>Goal-based (cut / maintain / bulk)</option>
          <option value="ratio">Body-weight ratio (per kg)</option>
          <option value="percent">Custom percentage split</option>
        </select>
      </div>

      <div class="form-group" id="mcGoalGroup">
        <label class="form-label" for="mcGoal">Goal</label>
        <select id="mcGoal" class="form-control">
          <option value="cut">Cut / Fat loss (high protein)</option>
          <option value="maintain" selected>Maintain / Recomp</option>
          <option value="bulk">Bulk / Muscle gain</option>
        </select>
      </div>

      <div class="form-group" id="mcRatioGroup" style="display: none;">
        <label class="form-label" for="mcProtKg">Protein per kg</label>
        <div class="input-with-addon">
          <input type="number" id="mcProtKg" class="form-control" value="1.8" min="0.5" max="4" step="0.1">
          <span class="input-addon suffix">g/kg</span>
        </div>
      </div>

      <div class="form-group" id="mcPercentGroup" style="display: none;">
        <label class="form-label" for="mcProtPct">Protein % <span class="form-label-hint">Carbs & fat fill the rest</span></label>
        <div class="input-with-addon">
          <input type="number" id="mcProtPct" class="form-control" value="30" min="5" max="80" step="1">
          <span class="input-addon suffix">%</span>
        </div>
      </div>
    </div>

    <div class="calc-actions">
      <button type="button" id="btnCalcMc" class="btn btn-primary"><span>🥗 Calculate Macros</span></button>
      <button type="button" id="btnResetMc" class="btn btn-secondary"><span>↺ Reset</span></button>
    </div>

    <div id="mcResultContainer" class="results-section animate-fade-in" style="display: none; margin-top: 2rem;"></div>
  `;

  const caloriesInput = container.querySelector("#mcCalories");
  const weightInput = container.querySelector("#mcWeight");
  const methodSel = container.querySelector("#mcMethod");
  const goalSel = container.querySelector("#mcGoal");
  const protKgInput = container.querySelector("#mcProtKg");
  const protPctInput = container.querySelector("#mcProtPct");
  const goalGroup = container.querySelector("#mcGoalGroup");
  const ratioGroup = container.querySelector("#mcRatioGroup");
  const percentGroup = container.querySelector("#mcPercentGroup");
  const resultDiv = container.querySelector("#mcResultContainer");

  const METHOD_LABELS = { goal: "Goal-based", ratio: "Body-weight ratio", percent: "Custom percentage" };

  // Goal presets: [protein kcal %, fat kcal %, carbs kcal %]
  const GOAL_SPLITS = {
    cut:      { label: "Cut / Fat loss",    p: 40, f: 30, note: "Higher protein preserves muscle in an energy deficit." },
    maintain: { label: "Maintain / Recomp", p: 30, f: 30, note: "Balanced split for maintenance and recomposition." },
    bulk:     { label: "Bulk / Gain",       p: 30, f: 25, note: "Extra carbs fuel hard training volume while bulking." }
  };

  function syncMethod() {
    const m = methodSel.value;
    goalGroup.style.display = m === "goal" ? "" : "none";
    ratioGroup.style.display = m === "ratio" ? "" : "none";
    percentGroup.style.display = m === "percent" ? "" : "none";
  }

  function calculate(ev) {
    const kcal = parseFloat(caloriesInput.value);
    const weight = parseFloat(weightInput.value);
    const method = methodSel.value;

    if (isNaN(kcal) || kcal < 500) { alert("Please enter a valid calorie target (≥500 kcal)."); return; }

    let pPct, fPct, note, pGrams = null;
    if (method === "goal") {
      const g = GOAL_SPLITS[goalSel.value];
      pPct = g.p; fPct = g.f; note = g.note;
    } else if (method === "ratio") {
      if (isNaN(weight) || weight <= 0) { alert("Please enter a valid body weight."); return; }
      const perKg = parseFloat(protKgInput.value) || 1.8;
      pGrams = weight * perKg;
      pPct = (pGrams * 4) / kcal * 100;
      fPct = 30;
      note = `Protein fixed at ${perKg} g/kg × ${weight} kg = ${pGrams.toFixed(0)} g, fat set to 30% of calories.`;
      if (pPct + fPct > 95) fPct = Math.max(15, 95 - pPct);
    } else {
      pPct = parseFloat(protPctInput.value);
      if (isNaN(pPct) || pPct < 5 || pPct > 80) { alert("Protein must be 5–80%."); return; }
      fPct = pPct >= 40 ? 25 : 30;
      note = `Custom split — carbs and fat share the remaining ${(100 - pPct).toFixed(0)}%.`;
    }

    const pKcal = kcal * pPct / 100;
    const fKcal = kcal * fPct / 100;
    const cKcal = Math.max(0, kcal - pKcal - fKcal);

    const proteinG = pGrams !== null ? pGrams : pKcal / 4;
    const carbsG = cKcal / 4;
    const fatG = fKcal / 9;
    const cPct = cKcal / kcal * 100;
    const fPctFinal = fKcal / kcal * 100;
    const pPctFinal = pKcal / kcal * 100;

    const meals = 4;
    const inCm = weight > 0 ? (proteinG / weight) : 0;

    const macroCard = (label, grams, pct, kcalPerG, color) => `
      <div class="result-stat-card">
        <div class="result-stat-label">${label}</div>
        <div class="result-stat-val" style="color: ${color};">${Math.round(grams)} g</div>
        <div style="font-size:0.82rem;color:var(--text-muted);">${pct.toFixed(0)}% · ${Math.round(kcalPerG)} kcal</div>
      </div>`;

    resultDiv.innerHTML = `
      <div class="result-hero-box">
        <span class="result-hero-label">Daily Macro Targets (${Math.round(kcal)} kcal)</span>
        <div class="result-hero-value" style="font-size: 1.5rem;">
          ${Math.round(proteinG)}P · ${Math.round(carbsG)}C · ${Math.round(fatG)}F
        </div>
        <span style="font-size: 0.95rem; color: var(--text-secondary);">
          ${pPctFinal.toFixed(0)}% protein / ${cPct.toFixed(0)}% carbs / ${fPctFinal.toFixed(0)}% fat
        </span>
      </div>

      <div class="result-stat-grid">
        ${macroCard("Protein", proteinG, pPctFinal, pKcal, "var(--accent-emerald)")}
        ${macroCard("Carbohydrates", carbsG, cPct, cKcal, "#38bdf8")}
        ${macroCard("Fat", fatG, fPctFinal, fKcal, "#f59e0b")}
        <div class="result-stat-card">
          <div class="result-stat-label">Per Meal (${meals} meals)</div>
          <div class="result-stat-val">${Math.round(proteinG / meals)}P ${Math.round(carbsG / meals)}C ${Math.round(fatG / meals)}F</div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-label">Protein per kg</div>
          <div class="result-stat-val">${inCm.toFixed(2)} g/kg</div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-label">Calories Check</div>
          <div class="result-stat-val" style="color: var(--accent-emerald);">${Math.round(proteinG * 4 + carbsG * 4 + fatG * 9)} kcal</div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-label">Water Co-Target</div>
          <div class="result-stat-val">${(weight * 0.033).toFixed(2)} L+</div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-label">Split Method</div>
          <div class="result-stat-val" style="font-size:0.9rem;">${METHOD_LABELS[methodSel.value] || methodSel.value}</div>
        </div>
      </div>

      <div class="steps-wrapper" style="margin-top: 2rem;">
        <div class="steps-header"><h3 class="steps-title">📐 Calculation Breakdown</h3></div>
        <div class="step-card">
          <span class="step-num-badge">Step 1 — Split Calories</span>
          <div class="math-formula-box">grams = (kcal × pct) ÷ calories per gram (P/C = 4, F = 9)</div>
          <p class="step-content">${note}</p>
        </div>
        <div class="step-card">
          <span class="step-num-badge">Step 2 — Convert to Grams</span>
          <div class="math-formula-box">P = ${Math.round(pKcal)} ÷ 4 · C = ${Math.round(cKcal)} ÷ 4 · F = ${Math.round(fKcal)} ÷ 9</div>
          <p class="step-content">Protein <b>${Math.round(proteinG)} g</b>, Carbs <b>${Math.round(carbsG)} g</b>, Fat <b>${Math.round(fatG)} g</b> — cross-check: ${(Math.round(proteinG) * 4 + Math.round(carbsG) * 4 + Math.round(fatG) * 9).toLocaleString()} kcal ≈ target.</p>
        </div>
        <div class="step-card">
          <span class="step-num-badge">Step 3 — Plate it</span>
          <div class="math-formula-box">per meal = daily grams ÷ ${meals}</div>
          <p class="step-content">Across ${meals} meals: <b>${Math.round(proteinG / meals)} g protein, ${Math.round(carbsG / meals)} g carbs, ${Math.round(fatG / meals)} g fat</b> per sitting (${Math.round(kcal / meals)} kcal).</p>
        </div>
      </div>
    `;

    resultDiv.style.display = "block";
    if (ev && ev.type === "click") resultDiv.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  methodSel.addEventListener("change", () => { syncMethod(); calculate(); });
  goalSel.addEventListener("change", calculate);
  [caloriesInput, weightInput, protKgInput, protPctInput].forEach(el => el.addEventListener("input", calculate));
  container.querySelector("#btnCalcMc").addEventListener("click", calculate);
  container.querySelector("#btnResetMc").addEventListener("click", () => {
    caloriesInput.value = "2200";
    weightInput.value = "70";
    methodSel.value = "goal";
    goalSel.value = "maintain";
    protKgInput.value = "1.8";
    protPctInput.value = "30";
    syncMethod();
    resultDiv.style.display = "none";
  });

  syncMethod();
  calculate();
}

/* ==========================================================================
   Running Pace & Race Time Calculator (Riegel predictions)
   ========================================================================== */
function renderPaceCalculator(container, calcDef) {
  container.innerHTML = `
    <div class="form-grid">
      <div class="form-group">
        <label class="form-label" for="pcPreset">Race / Distance Preset</label>
        <select id="pcPreset" class="form-control">
          <option value="custom" selected>Custom distance</option>
          <option value="5">5K race (5 km)</option>
          <option value="10">10K race (10 km)</option>
          <option value="21.0975">Half marathon (21.0975 km)</option>
          <option value="42.195">Marathon (42.195 km)</option>
          <option value="1.609344">1 mile</option>
          <option value="1">1 km</option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label" for="pcDist">Distance <span class="form-label-hint">Kilometers</span></label>
        <div class="input-with-addon">
          <input type="number" id="pcDist" class="form-control" value="10" min="0.1" max="500" step="any">
          <span class="input-addon suffix">km</span>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="pcH">Time — Hours</label>
        <input type="number" id="pcH" class="form-control" value="0" min="0" max="48" step="1">
      </div>

      <div class="form-group">
        <label class="form-label" for="pcM">Minutes</label>
        <input type="number" id="pcM" class="form-control" value="50" min="0" max="59" step="1">
      </div>

      <div class="form-group">
        <label class="form-label" for="pcS">Seconds</label>
        <input type="number" id="pcS" class="form-control" value="0" min="0" max="59" step="1">
      </div>
    </div>

    <div class="calc-actions">
      <button type="button" id="btnCalcPc" class="btn btn-primary"><span>🏃 Calculate Pace</span></button>
      <button type="button" id="btnResetPc" class="btn btn-secondary"><span>↺ Reset</span></button>
    </div>

    <div id="pcResultContainer" class="results-section animate-fade-in" style="display: none; margin-top: 2rem;"></div>
  `;

  const presetSel = container.querySelector("#pcPreset");
  const distInput = container.querySelector("#pcDist");
  const hInput = container.querySelector("#pcH");
  const mInput = container.querySelector("#pcM");
  const sInput = container.querySelector("#pcS");
  const resultDiv = container.querySelector("#pcResultContainer");

  const fmtTime = (sec) => {
    sec = Math.round(sec);
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
                 : `${m}:${String(s).padStart(2, "0")}`;
  };
  const fmtPace = (sec) => {
    const m = Math.floor(sec / 60);
    const s = Math.round(sec % 60);
    return s === 60 ? `${m + 1}:00` : `${m}:${String(s).padStart(2, "0")}`;
  };

  function calculate(ev) {
    const dist = parseFloat(distInput.value);
    const totalSec = (parseFloat(hInput.value) || 0) * 3600
      + (parseFloat(mInput.value) || 0) * 60
      + (parseFloat(sInput.value) || 0);

    if (isNaN(dist) || dist <= 0) { alert("Please enter a valid distance."); return; }
    if (totalSec <= 0) { alert("Please enter a valid finish time."); return; }

    const paceKm = totalSec / dist;
    const paceMi = paceKm * 1.609344;
    const speedKmh = dist / (totalSec / 3600);
    const speedMph = speedKmh / 1.609344;
    const speedMs = (dist * 1000) / totalSec;

    // Even splits for whole units covered
    const wholeUnits = Math.floor(dist);
    let splitRows = "";
    if (wholeUnits >= 1) {
      for (let i = 1; i <= Math.min(wholeUnits, 42); i++) {
        splitRows += `<tr>
          <td style="padding: 0.35rem 0.6rem; border-bottom: 1px solid var(--border-color);">${i} km</td>
          <td style="padding: 0.35rem 0.6rem; border-bottom: 1px solid var(--border-color); text-align: right;">${fmtPace(paceKm)}</td>
          <td style="padding: 0.35rem 0.6rem; border-bottom: 1px solid var(--border-color); text-align: right;">${fmtTime(paceKm * i)}</td>
        </tr>`;
      }
    }

    // Riegel race predictions: T2 = T1 × (D2/D1)^1.06
    const RACES = [
      { name: "5K", km: 5 },
      { name: "10K", km: 10 },
      { name: "Half Marathon", km: 21.0975 },
      { name: "Marathon", km: 42.195 }
    ];
    const preds = RACES.filter(r => Math.abs(r.km - dist) > 0.001).map(r => {
      const t = totalSec * Math.pow(r.km / dist, 1.06);
      return `<div class="result-stat-card">
        <div class="result-stat-label">${r.name}</div>
        <div class="result-stat-val" style="color: var(--accent-emerald);">${fmtTime(t)}</div>
        <div style="font-size:0.82rem;color:var(--text-muted);">${fmtPace(t / r.km)} /km</div>
      </div>`;
    }).join("");

    const isRace = RACES.find(r => Math.abs(r.km - dist) < 0.001);

    resultDiv.innerHTML = `
      <div class="result-hero-box">
        <span class="result-hero-label">Average Pace</span>
        <div class="result-hero-value" style="font-size: 1.5rem;">${fmtPace(paceKm)} /km</div>
        <span style="font-size: 0.95rem; color: var(--text-secondary);">
          ${fmtPace(paceMi)} /mi · ${fmtTime(totalSec)} for ${dist} km${isRace ? ` (${isRace.name})` : ""}
        </span>
      </div>

      <div class="result-stat-grid">
        <div class="result-stat-card">
          <div class="result-stat-label">Pace per km</div>
          <div class="result-stat-val">${fmtPace(paceKm)}</div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-label">Pace per mile</div>
          <div class="result-stat-val">${fmtPace(paceMi)}</div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-label">Speed (km/h)</div>
          <div class="result-stat-val" style="color: var(--accent-emerald);">${speedKmh.toFixed(2)}</div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-label">Speed (mph)</div>
          <div class="result-stat-val">${speedMph.toFixed(2)}</div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-label">Speed (m/s)</div>
          <div class="result-stat-val">${speedMs.toFixed(2)}</div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-label">Even km Splits</div>
          <div class="result-stat-val">${fmtPace(paceKm)}</div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-label">10 km at this pace</div>
          <div class="result-stat-val">${fmtTime(paceKm * 10)}</div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-label">Half Marathon</div>
          <div class="result-stat-val">${fmtTime(paceKm * 21.0975)}</div>
        </div>
      </div>

      <div class="steps-wrapper" style="margin-top: 2rem;">
        <div class="steps-header"><h3 class="steps-title">📐 Calculation Breakdown</h3></div>
        <div class="step-card">
          <span class="step-num-badge">Step 1 — Pace</span>
          <div class="math-formula-box">pace = total time ÷ distance</div>
          <p class="step-content">${fmtTime(totalSec)} ÷ ${dist} km = <b>${fmtPace(paceKm)} min/km</b> (${fmtTime(totalSec)} ÷ ${(dist * 1.609344).toFixed(4)} mi = ${fmtPace(paceMi)} min/mi)</p>
        </div>
        <div class="step-card">
          <span class="step-num-badge">Step 2 — Speed</span>
          <div class="math-formula-box">speed = distance ÷ time (hours)</div>
          <p class="step-content">${dist} ÷ ${(totalSec / 3600).toFixed(4)} h = <b>${speedKmh.toFixed(2)} km/h</b> = ${speedMph.toFixed(2)} mph = ${speedMs.toFixed(2)} m/s</p>
        </div>
        ${preds ? `
        <div class="steps-header" style="margin-top: 1.5rem;"><h3 class="steps-title">🎯 Predicted Race Times (Riegel formula)</h3></div>
        <div class="result-stat-grid">${preds}</div>
        <div class="step-card" style="margin-top: 1.5rem;">
          <span class="step-num-badge">Riegel exponent 1.06</span>
          <div class="math-formula-box">T₂ = T₁ × (D₂ ÷ D₁)^1.06</div>
          <p class="step-content">Slightly slower than linear because fatigue grows with distance — e.g. ${fmtTime(totalSec)} over ${dist} km scales to ${fmtTime(totalSec * Math.pow(21.0975 / dist, 1.06))} for a half marathon.</p>
        </div>` : ""}
        ${splitRows ? `
        <div class="steps-header" style="margin-top: 1.5rem;"><h3 class="steps-title">🗺️ Kilometer Splits</h3></div>
        <div class="step-card">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.95rem;">
            <thead><tr>
              <th style="text-align:left; padding: 0.35rem 0.6rem; border-bottom: 2px solid var(--border-color);">Km</th>
              <th style="text-align:right; padding: 0.35rem 0.6rem; border-bottom: 2px solid var(--border-color);">Split</th>
              <th style="text-align:right; padding: 0.35rem 0.6rem; border-bottom: 2px solid var(--border-color);">Cumulative</th>
            </tr></thead>
            <tbody>${splitRows}</tbody>
          </table>
        </div>` : ""}
      </div>`;

    resultDiv.style.display = "block";
    if (ev && ev.type === "click") resultDiv.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  presetSel.addEventListener("change", () => {
    if (presetSel.value !== "custom") distInput.value = presetSel.value;
    calculate();
  });
  [distInput, hInput, mInput, sInput].forEach(el => el.addEventListener("input", calculate));
  container.querySelector("#btnCalcPc").addEventListener("click", calculate);
  container.querySelector("#btnResetPc").addEventListener("click", () => {
    presetSel.value = "custom";
    distInput.value = "10";
    hInput.value = "0";
    mInput.value = "50";
    sInput.value = "0";
    resultDiv.style.display = "none";
  });

  calculate();
}

/* ==========================================================================
   Pregnancy Due Date Calculator — Naegele's rule (LMP + 280 days)
   ========================================================================== */
function renderDueDateCalculator(container, calcDef) {
  container.innerHTML = `
    <div class="form-grid">
      <div class="form-group">
        <label class="form-label" for="ddMethod">Date Known</label>
        <select id="ddMethod" class="form-control">
          <option value="lmp" selected>Last menstrual period (LMP)</option>
          <option value="conception">Conception date</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label" for="ddDate" id="ddDateLabel">Last Menstrual Period (LMP) Date</label>
        <input type="date" id="ddDate" class="form-control">
      </div>
      <div class="form-group" id="ddCycleGroup">
        <label class="form-label" for="ddCycle">Average Cycle Length <span class="form-label-hint">21–45 days</span></label>
        <div class="input-with-addon">
          <input type="number" id="ddCycle" class="form-control" value="28" min="21" max="45" step="1">
          <span class="input-addon suffix">days</span>
        </div>
      </div>
    </div>

    <div class="calc-actions">
      <button type="button" id="btnCalcDd" class="btn btn-primary"><span>👶 Calculate Due Date</span></button>
      <button type="button" id="btnResetDd" class="btn btn-secondary"><span>↺ Reset</span></button>
    </div>

    <div id="ddResultContainer" class="results-section animate-fade-in" style="display: none; margin-top: 2rem;"></div>
  `;

  const methodSel = container.querySelector("#ddMethod");
  const dateInput = container.querySelector("#ddDate");
  const dateLabel = container.querySelector("#ddDateLabel");
  const cycleGroup = container.querySelector("#ddCycleGroup");
  const cycleInput = container.querySelector("#ddCycle");
  const resultDiv = container.querySelector("#ddResultContainer");

  const WD = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const MO = ["January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"];
  const DAY_MS = 86400000;

  function parseDate(str) {
    const [y, m, d] = (str || "").split("-").map(Number);
    if (!y || !m || !d) return null;
    if (m < 1 || m > 12 || d < 1 || d > 31) return null;
    return { y, m, d };
  }
  const dayNum = dt => Math.round(Date.UTC(dt.y, dt.m - 1, dt.d) / DAY_MS);
  function fromDayNum(n) {
    const d = new Date(n * DAY_MS);
    return { y: d.getUTCFullYear(), m: d.getUTCMonth() + 1, d: d.getUTCDate() };
  }
  function fmtDate(dt) {
    return `${WD[new Date(dt.y, dt.m - 1, dt.d, 12).getDay()]}, ${MO[dt.m - 1]} ${dt.d}, ${dt.y}`;
  }
  const pad = n => String(n).padStart(2, "0");

  function syncMethod() {
    const isLmp = methodSel.value === "lmp";
    cycleGroup.style.display = isLmp ? "" : "none";
    dateLabel.textContent = isLmp ? "Last Menstrual Period (LMP) Date" : "Conception Date";
  }

  function calculate(ev) {
    const method = methodSel.value;
    const base = parseDate(dateInput.value);
    if (!base) { alert("Please enter a valid date."); return; }

    const now = new Date();
    const today = { y: now.getFullYear(), m: now.getMonth() + 1, d: now.getDate() };
    const todayN = dayNum(today);

    if (dayNum(base) > todayN) {
      alert(method === "lmp"
        ? "The last menstrual period date cannot be in the future."
        : "The conception date cannot be in the future.");
      return;
    }

    let lmp, dueN, cycleAdj = 0;
    if (method === "lmp") {
      let cycle = parseInt(cycleInput.value, 10);
      if (isNaN(cycle) || cycle < 21 || cycle > 45) cycle = 28;
      cycleAdj = cycle - 28;
      lmp = base;
      dueN = dayNum(lmp) + 280 + cycleAdj;
    } else {
      lmp = fromDayNum(dayNum(base) - 14);
      dueN = dayNum(base) + 266;
    }

    const due = fromDayNum(dueN);
    const gestDays = todayN - dayNum(lmp);
    const weeks = Math.floor(gestDays / 7);
    const remDays = gestDays % 7;
    const daysLeft = dueN - todayN;
    const progress = Math.max(0, Math.min(100, Math.round((gestDays / 280) * 1000) / 10));

    let trimester, triColor;
    if (weeks < 14) { trimester = "First trimester (weeks 0–13)"; triColor = "#38bdf8"; }
    else if (weeks < 28) { trimester = "Second trimester (weeks 14–27)"; triColor = "#10b981"; }
    else if (weeks < 42) { trimester = "Third trimester (weeks 28–40)"; triColor = "#f59e0b"; }
    else { trimester = "Post-term (42+ weeks) — contact your provider"; triColor = "#ef4444"; }

    const conception = fromDayNum(dayNum(lmp) + 14);
    const tri2 = fromDayNum(dayNum(lmp) + 98);
    const tri3 = fromDayNum(dayNum(lmp) + 196);
    const fullTerm = fromDayNum(dayNum(lmp) + 259);

    const countLabel = gestDays < 0 ? "Before LMP" : `Week ${weeks + 1} of 40`;
    const dueSub = daysLeft > 0
      ? `${daysLeft.toLocaleString()} day${daysLeft === 1 ? "" : "s"} to go · 40 weeks (${(280 + cycleAdj).toLocaleString()} days) from LMP`
      : daysLeft === 0
        ? "Today is the estimated due date — 40 weeks reached"
        : `${Math.abs(daysLeft).toLocaleString()} day${Math.abs(daysLeft) === 1 ? "" : "s"} past the estimated due date (only ~5% of births happen on the exact date)`;

    const stats = `
      <div class="result-stat-card"><div class="result-stat-label">Gestational Age</div>
        <div class="result-stat-val" style="color: var(--accent-emerald);">${weeks}w ${remDays}d</div>
        <div style="font-size:0.82rem;color:var(--text-muted);">${gestDays.toLocaleString()} days · ${countLabel}</div></div>
      <div class="result-stat-card"><div class="result-stat-label">Days Until Due</div>
        <div class="result-stat-val" style="color: ${daysLeft >= 0 ? "var(--accent-emerald)" : "#f59e0b"};">${daysLeft >= 0 ? daysLeft.toLocaleString() + " days" : Math.abs(daysLeft).toLocaleString() + " overdue"}</div></div>
      <div class="result-stat-card"><div class="result-stat-label">Trimester</div>
        <div class="result-stat-val" style="font-size: 0.95rem; color: ${triColor};">${trimester}</div></div>
      <div class="result-stat-card"><div class="result-stat-label">Pregnancy Progress</div>
        <div class="result-stat-val">${progress}% of 40 weeks</div></div>
      <div class="result-stat-card"><div class="result-stat-label">Estimated Conception</div>
        <div class="result-stat-val" style="font-size: 0.95rem;">${fmtDate(conception)}</div>
        <div style="font-size:0.82rem;color:var(--text-muted);">LMP + 14 days (ovulation)</div></div>
      <div class="result-stat-card"><div class="result-stat-label">Cycle Adjustment</div>
        <div class="result-stat-val" style="font-size: 0.95rem;">${method === "conception"
          ? "N/A (conception method)"
          : cycleAdj === 0 ? "None (28-day cycle)" : `${cycleAdj > 0 ? "+" : ""}${cycleAdj} days (${cycleInput.value}-day cycle)`}</div></div>
      <div class="result-stat-card"><div class="result-stat-label">2nd Trimester Begins</div>
        <div class="result-stat-val" style="font-size: 0.95rem;">${fmtDate(tri2)}</div></div>
      <div class="result-stat-card"><div class="result-stat-label">3rd Trimester Begins</div>
        <div class="result-stat-val" style="font-size: 0.95rem;">${fmtDate(tri3)}</div></div>
      <div class="result-stat-card"><div class="result-stat-label">Full Term (37 weeks)</div>
        <div class="result-stat-val" style="font-size: 0.95rem;">${fmtDate(fullTerm)}</div></div>
      <div class="result-stat-card"><div class="result-stat-label">Post-Term Check (42 weeks)</div>
        <div class="result-stat-val" style="font-size: 0.95rem;">${fmtDate(fromDayNum(dayNum(lmp) + 294))}</div></div>`;

    const steps = `
      <div class="step-card">
        <span class="step-num-badge">Step 1 — Naegele's Rule</span>
        <div class="math-formula-box">${method === "lmp"
          ? `due = LMP + 280 days${cycleAdj !== 0 ? ` (${cycleAdj > 0 ? "+" : ""}${cycleAdj} cycle adjustment)` : ""}`
          : `due = conception + 266 days (280 − 14)`}</div>
        <p class="step-content">${method === "lmp"
          ? `LMP <b>${fmtDate(base)}</b> + ${(280 + cycleAdj).toLocaleString()} days → <b>${fmtDate(due)}</b>`
          : `Conception <b>${fmtDate(base)}</b> + 266 days → <b>${fmtDate(due)}</b> (equivalent LMP: ${fmtDate(lmp)})`}</p>
      </div>
      <div class="step-card">
        <span class="step-num-badge">Step 2 — Countdown From Today</span>
        <div class="math-formula-box">days left = due date − today (${today.y}-${pad(today.m)}-${pad(today.d)})</div>
        <p class="step-content"><b>${daysLeft >= 0 ? daysLeft.toLocaleString() + " day(s) remaining" : Math.abs(daysLeft).toLocaleString() + " day(s) past due"}</b> — gestational age <b>${weeks} weeks ${remDays} day(s)</b> counted from the LMP date.</p>
      </div>
      <div class="step-card">
        <span class="step-num-badge">Step 3 — Method Notes</span>
        <div class="math-formula-box">LMP method: +280 d · conception method: +266 d · cycle ±(cycle − 28) d</div>
        <p class="step-content">Ultrasound dating in the first trimester is the most accurate — this estimate assumes a regular 28-day cycle${method === "lmp" && cycleAdj !== 0 ? `, adjusted for a ${cycleInput.value}-day cycle` : ""}. Longer cycles shift ovulation (and the due date) later by the same number of days.</p>
      </div>`;

    resultDiv.innerHTML = `
      <div class="result-hero-box">
        <span class="result-hero-label">Estimated Due Date</span>
        <div class="result-hero-value" style="font-size: 1.5rem;">${fmtDate(due)}</div>
        <span style="font-size: 0.95rem; color: var(--text-secondary);">${dueSub}</span>
      </div>
      <div class="result-stat-grid">${stats}</div>
      <div class="steps-wrapper" style="margin-top: 2rem;">
        <div class="steps-header"><h3 class="steps-title">📐 Calculation Breakdown</h3></div>
        ${steps}
      </div>`;

    resultDiv.style.display = "block";
    if (ev && ev.type === "click") resultDiv.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  methodSel.addEventListener("change", () => { syncMethod(); calculate(); });
  dateInput.addEventListener("change", calculate);
  cycleInput.addEventListener("change", calculate);
  container.querySelector("#btnCalcDd").addEventListener("click", calculate);
  container.querySelector("#btnResetDd").addEventListener("click", () => {
    methodSel.value = "lmp";
    cycleInput.value = "28";
    syncMethod();
    setDefaults();
    resultDiv.style.display = "none";
  });

  function setDefaults() {
    const now = new Date();
    now.setDate(now.getDate() - 104);
    dateInput.value = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  }

  syncMethod();
  setDefaults();
  calculate();
}

/* ============================================================================
 * Ideal Weight Calculator — Devine, Robinson, Miller & Hamwi formulas
 * ========================================================================== */
function renderIdealWeightCalculator(container, calcDef) {
  container.innerHTML = `
    <div class="form-grid">
      <div class="form-group">
        <label class="form-label" for="iwGender">Sex <span class="form-label-hint">formulas are sex-specific</span></label>
        <select id="iwGender" class="form-control">
          <option value="male" selected>Male</option>
          <option value="female">Female</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label" for="iwHeight">Height</label>
        <div class="input-with-addon">
          <input type="number" id="iwHeight" class="form-control" value="180" min="100" max="230" step="any">
          <span class="input-addon suffix">cm</span>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label" for="iwWeight">Current Weight <span class="form-label-hint">optional, kg</span></label>
        <div class="input-with-addon">
          <input type="number" id="iwWeight" class="form-control" value="" min="20" max="400" step="any">
          <span class="input-addon suffix">kg</span>
        </div>
      </div>
    </div>

    <div class="calc-actions">
      <button type="button" id="btnCalcIw" class="btn btn-primary"><span>⚖️ Calculate Ideal Weight</span></button>
      <button type="button" id="btnResetIw" class="btn btn-secondary"><span>↺ Reset</span></button>
    </div>

    <div id="iwResultContainer" class="results-section animate-fade-in" style="display: none; margin-top: 2rem;"></div>
  `;

  const genderSel = container.querySelector("#iwGender");
  const heightInput = container.querySelector("#iwHeight");
  const weightInput = container.querySelector("#iwWeight");
  const resultDiv = container.querySelector("#iwResultContainer");

  const kg = (n) => (Math.round(n * 10) / 10).toFixed(1);

  function calculate(ev) {
    const cm = parseFloat(heightInput.value);
    const current = parseFloat(weightInput.value);
    if (isNaN(cm) || cm < 100 || cm > 230) { alert("Please enter a height between 100 and 230 cm."); return; }

    const male = genderSel.value === "male";
    const inches = cm / 2.54;
    const d = Math.max(inches - 60, 0);   // inches over 5 ft (formulas' base assumption)
    const m2 = (cm / 100) * (cm / 100);

    const devine = male ? 50 + 2.3 * d : 45.5 + 2.3 * d;
    const robinson = male ? 52 + 1.9 * d : 49 + 1.7 * d;
    const miller = male ? 56.2 + 1.41 * d : 53.1 + 1.36 * d;
    const hamwi = male ? 48 + 2.7 * d : 45.4 + 2.2 * d;
    const bmiLow = 18.5 * m2, bmiHigh = 24.9 * m2;

    const avg = (devine + robinson + miller + hamwi) / 4;
    const diff = !isNaN(current) && current > 0 ? current - avg : NaN;
    const diffTxt = isNaN(diff) ? "" : diff > 0
      ? `<b>+${kg(diff)} kg</b> above the four-formula average`
      : `<b>${kg(diff)} kg</b> below the four-formula average`;

    resultDiv.innerHTML = `
      <div class="result-stat-grid">
        <div class="result-stat-card">
          <div class="result-stat-label">Devine Formula</div>
          <div class="result-stat-val" style="color: var(--accent-emerald);">${kg(devine)} kg</div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-label">Robinson Formula</div>
          <div class="result-stat-val">${kg(robinson)} kg</div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-label">Miller Formula</div>
          <div class="result-stat-val">${kg(miller)} kg</div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-label">Hamwi Formula</div>
          <div class="result-stat-val">${kg(hamwi)} kg</div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-label">Healthy BMI Range (18.5–24.9)</div>
          <div class="result-stat-val">${kg(bmiLow)} – ${kg(bmiHigh)} kg</div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-label">Four-Formula Average</div>
          <div class="result-stat-val">${kg(avg)} kg</div>
        </div>
      </div>

      ${isNaN(diff) ? "" : `<p style="margin-top: 1rem; color: var(--text-muted);">At ${kg(current)} kg you sit ${diffTxt}.</p>`}

      <div class="steps-wrapper" style="margin-top: 2rem;">
        <div class="steps-header"><h3 class="steps-title">📊 Formula Breakdown (${male ? "male" : "female"}, ${cm} cm)</h3></div>
        <div class="step-card">
          <span class="step-num-badge">Step 1 — Height to inches</span>
          <div class="math-formula-box">inches = cm ÷ 2.54</div>
          <p class="step-content">${cm} ÷ 2.54 = <b>${(Math.round(inches * 100) / 100).toFixed(2)} in</b> → ${d.toFixed(2)} in above (or at) the 60-inch base the formulas assume${inches < 60 ? " — under 5 ft the base value is used without deduction" : ""}.</p>
        </div>
        <div class="step-card">
          <span class="step-num-badge">Step 2 — Devine substitution</span>
          <div class="math-formula-box">${male ? "Ideal = 50 + 2.3 × (inches − 60)" : "Ideal = 45.5 + 2.3 × (inches − 60)"}</div>
          <p class="step-content">${male ? "50" : "45.5"} + 2.3 × ${d.toFixed(2)} = <b>${kg(devine)} kg</b> — the clinical standard used for drug dosing since 1974.</p>
        </div>
        <div class="step-card">
          <span class="step-num-badge">Step 3 — Healthy weight band from BMI</span>
          <div class="math-formula-box">weight = BMI × height² (m²)</div>
          <p class="step-content">18.5 × ${m2.toFixed(2)} = <b>${kg(bmiLow)} kg</b> and 24.9 × ${m2.toFixed(2)} = <b>${kg(bmiHigh)} kg</b> — the BMI-based healthy band around the formula estimates.</p>
        </div>
      </div>
    `;

    resultDiv.style.display = "block";
    if (ev && ev.type === "click") resultDiv.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  genderSel.addEventListener("change", calculate);
  [heightInput, weightInput].forEach(el => el.addEventListener("input", calculate));
  container.querySelector("#btnCalcIw").addEventListener("click", calculate);
  container.querySelector("#btnResetIw").addEventListener("click", () => {
    genderSel.value = "male";
    heightInput.value = "180";
    weightInput.value = "";
    resultDiv.style.display = "none";
  });

  calculate();
}
