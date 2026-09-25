/**
 * ============================================================================
 * Health & Fitness Calculators: Body Metrics Solvers
 * Calculators:
 * 1. BMI & BMR Calorie Calculator (Mifflin-St Jeor + TDEE)
 * 2. Body Fat Percentage & Ideal Weight (US Navy + Devine)
 * 3. Daily Water Intake Calculator (Weight + Activity + Climate)
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

  function calculate() {
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
    resultDiv.scrollIntoView({ behavior: "smooth", block: "nearest" });
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

  function calculate() {
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
    resultDiv.scrollIntoView({ behavior: "smooth", block: "nearest" });
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
