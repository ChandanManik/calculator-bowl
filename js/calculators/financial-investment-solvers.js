/**
 * ============================================================================
 * Financial Calculators: Investment & Wealth Solvers
 * Calculators:
 * 1. Retirement & 401(k) Calculator
 * 2. ROI (Return on Investment) Calculator
 * 3. Present Value (PV) Calculator
 * 4. Inflation & Purchasing Power Calculator
 * ============================================================================
 */

/* ==========================================================================
   1. Retirement & 401(k) Calculator
   ========================================================================== */
function renderRetirementCalculator(container, calcDef) {
  container.innerHTML = `
    <div class="form-grid">
      <div class="form-group">
        <label class="form-label" for="retCurrentAge">
          Current Age
          <span class="form-label-hint">Years</span>
        </label>
        <div class="input-with-addon">
          <input type="number" id="retCurrentAge" class="form-control" value="30" min="16" max="90" step="1">
          <span class="input-addon suffix">Yrs</span>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="retRetireAge">
          Target Retirement Age
          <span class="form-label-hint">Planned age</span>
        </label>
        <div class="input-with-addon">
          <input type="number" id="retRetireAge" class="form-control" value="65" min="20" max="100" step="1">
          <span class="input-addon suffix">Yrs</span>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="retCurrentSavings">
          Current Retirement Savings
          <span class="form-label-hint">401k, IRA, Cash</span>
        </label>
        <div class="input-with-addon">
          <span class="input-addon">$</span>
          <input type="number" id="retCurrentSavings" class="form-control" value="25000" min="0" step="1000">
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="retMonthlyContribution">
          Monthly Contribution
          <span class="form-label-hint">Your + Employer Match</span>
        </label>
        <div class="input-with-addon">
          <span class="input-addon">$</span>
          <input type="number" id="retMonthlyContribution" class="form-control" value="500" min="0" step="50">
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="retAnnualReturn">
          Expected Annual Return (Pre-Retirement)
          <span class="form-label-hint">Historical S&P500 ~8-10%</span>
        </label>
        <div class="input-with-addon">
          <input type="number" id="retAnnualReturn" class="form-control" value="8.0" min="0.1" max="25" step="0.1">
          <span class="input-addon suffix">%</span>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="retPostReturn">
          Expected Return (Post-Retirement)
          <span class="form-label-hint">Conservative portfolio</span>
        </label>
        <div class="input-with-addon">
          <input type="number" id="retPostReturn" class="form-control" value="5.0" min="0.1" max="20" step="0.1">
          <span class="input-addon suffix">%</span>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="retLifeExpectancy">
          Life Expectancy
          <span class="form-label-hint">Years in retirement</span>
        </label>
        <div class="input-with-addon">
          <input type="number" id="retLifeExpectancy" class="form-control" value="90" min="60" max="115" step="1">
          <span class="input-addon suffix">Yrs</span>
        </div>
      </div>
    </div>

    <div class="calc-actions">
      <button type="button" id="btnCalcRetirement" class="btn btn-primary">
        <span>⚡ Calculate Nest Egg</span>
      </button>
      <button type="button" id="btnResetRetirement" class="btn btn-secondary">
        <span>↺ Reset</span>
      </button>
    </div>

    <!-- Results Container -->
    <div id="retResultContainer" class="results-section animate-fade-in" style="display: none;"></div>
  `;

  const btnCalc = container.querySelector("#btnCalcRetirement");
  const btnReset = container.querySelector("#btnResetRetirement");
  const resultDiv = container.querySelector("#retResultContainer");

  function calculate() {
    const currentAge = parseInt(container.querySelector("#retCurrentAge").value) || 0;
    const retireAge = parseInt(container.querySelector("#retRetireAge").value) || 0;
    const currentSavings = parseFloat(container.querySelector("#retCurrentSavings").value) || 0;
    const monthlyDeposit = parseFloat(container.querySelector("#retMonthlyContribution").value) || 0;
    const rPre = (parseFloat(container.querySelector("#retAnnualReturn").value) || 0) / 100;
    const rPost = (parseFloat(container.querySelector("#retPostReturn").value) || 0) / 100;
    const lifeExpectancy = parseInt(container.querySelector("#retLifeExpectancy").value) || 90;

    if (currentAge >= retireAge) {
      alert("Target retirement age must be greater than current age.");
      return;
    }
    if (retireAge >= lifeExpectancy) {
      alert("Life expectancy must be greater than target retirement age.");
      return;
    }

    const yearsToAccumulate = retireAge - currentAge;
    const retirementYears = lifeExpectancy - retireAge;

    // Monthly compounding accumulation
    const monthlyRatePre = rPre / 12;
    let balance = currentSavings;
    let totalContributed = currentSavings;
    const schedule = [];

    for (let yr = 1; yr <= yearsToAccumulate; yr++) {
      const yearStart = balance;
      for (let m = 1; m <= 12; m++) {
        balance = (balance + monthlyDeposit) * (1 + monthlyRatePre);
        totalContributed += monthlyDeposit;
      }
      const interestThisYear = balance - yearStart - (monthlyDeposit * 12);
      schedule.push({
        age: currentAge + yr,
        contributions: totalContributed,
        interest: interestThisYear,
        balance: balance
      });
    }

    const nestEgg = balance;
    const totalGrowth = nestEgg - totalContributed;

    // Post-retirement monthly withdrawal calculation using 4% rule & annuity formula
    const safeWithdrawalMonthly = (nestEgg * 0.04) / 12;
    
    // Amortized monthly payout based on retirementYears and rPost
    const monthlyRatePost = rPost / 12;
    const nMonthsPost = retirementYears * 12;
    let monthlyAnnuityPayout = 0;
    if (monthlyRatePost > 0) {
      monthlyAnnuityPayout = nestEgg * (monthlyRatePost * Math.pow(1 + monthlyRatePost, nMonthsPost)) / (Math.pow(1 + monthlyRatePost, nMonthsPost) - 1);
    } else {
      monthlyAnnuityPayout = nestEgg / nMonthsPost;
    }

    let scheduleRows = "";
    // Display intervals for clean UI: every 5 years or full if under 15 years
    const step = yearsToAccumulate > 15 ? 5 : 1;
    for (let i = 0; i < schedule.length; i++) {
      const row = schedule[i];
      if ((i + 1) % step === 0 || i === schedule.length - 1) {
        scheduleRows += `
          <tr style="border-bottom: 1px solid var(--border-color); font-size: 0.85rem;">
            <td style="padding: 0.6rem 0.75rem; text-align: center; font-weight: 600;">Age ${row.age}</td>
            <td style="padding: 0.6rem 0.75rem; text-align: right;">$${Math.round(row.contributions).toLocaleString()}</td>
            <td style="padding: 0.6rem 0.75rem; text-align: right; color: var(--accent-emerald);">$${Math.round(row.interest).toLocaleString()}</td>
            <td style="padding: 0.6rem 0.75rem; text-align: right; font-weight: 700; color: var(--accent-primary);">$${Math.round(row.balance).toLocaleString()}</td>
          </tr>
        `;
      }
    }

    resultDiv.style.display = "block";
    resultDiv.innerHTML = `
      <div class="result-hero-box">
        <span class="result-hero-label">Estimated Nest Egg at Age ${retireAge}</span>
        <div class="result-hero-value" style="color: var(--accent-emerald);">
          $${Math.round(nestEgg).toLocaleString()}
        </div>
      </div>

      <div class="result-stat-grid">
        <div class="result-stat-card">
          <div class="result-stat-label">Total Out-of-Pocket Saved</div>
          <div class="result-stat-val">$${Math.round(totalContributed).toLocaleString()}</div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-label">Compound Investment Gains</div>
          <div class="result-stat-val" style="color: var(--accent-emerald);">$${Math.round(totalGrowth).toLocaleString()}</div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-label">Monthly Income (4% Rule)</div>
          <div class="result-stat-val" style="color: var(--accent-primary);">$${Math.round(safeWithdrawalMonthly).toLocaleString()}/mo</div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-label">Annuity Payout (${retirementYears} Yrs)</div>
          <div class="result-stat-val" style="color: var(--accent-primary);">$${Math.round(monthlyAnnuityPayout).toLocaleString()}/mo</div>
        </div>
      </div>

      <!-- Step-by-Step Breakdown -->
      <div class="steps-wrapper">
        <h3 class="steps-title">📊 Retirement Compounding Formula & Methodology</h3>

        <div class="step-card">
          <span class="step-num-badge">1. Future Value of Savings & Contributions</span>
          <div class="math-formula-box">
            FV = P(1 + r/12)^{12t} + PMT \\times \\left[\\frac{(1 + r/12)^{12t} - 1}{r/12}\\right]
          </div>
          <p class="step-content">
            Accumulating for <b>${yearsToAccumulate} years</b> from Age ${currentAge} to ${retireAge} at an average annual return of <b>${(rPre * 100).toFixed(1)}%</b> with <b>$${monthlyDeposit.toLocaleString()}/month</b> in continuous contributions.
          </p>
        </div>

        <div class="step-card">
          <span class="step-num-badge">2. Sustainable Retirement Income</span>
          <p class="step-content">
            • <b>4% Safe Withdrawal Rule:</b> Generates approximately <b>$${Math.round(safeWithdrawalMonthly).toLocaleString()} per month</b> ($${Math.round(safeWithdrawalMonthly * 12).toLocaleString()}/year) designed to preserve your capital indefinitely.<br>
            • <b>Depleting Annuity:</b> Liquidating over <b>${retirementYears} years</b> at ${(rPost * 100).toFixed(1)}% yields up to <b>$${Math.round(monthlyAnnuityPayout).toLocaleString()} per month</b>.
          </p>
        </div>
      </div>

      <!-- Schedule Table -->
      <div style="margin-top: 1.5rem;">
        <h4 style="font-size: 1rem; font-weight: 700; margin-bottom: 0.75rem; color: var(--text-primary);">
          📈 Projected Wealth Milestones (Every 5 Years)
        </h4>
        <div style="overflow-x: auto; border: 1px solid var(--border-color); border-radius: 8px;">
          <table style="width: 100%; border-collapse: collapse; text-align: left;">
            <thead>
              <tr style="background: var(--bg-tertiary); font-size: 0.78rem; text-transform: uppercase; color: var(--text-muted); border-bottom: 2px solid var(--border-color);">
                <th style="padding: 0.6rem 0.75rem; text-align: center;">Age</th>
                <th style="padding: 0.6rem 0.75rem; text-align: right;">Total Contributed</th>
                <th style="padding: 0.6rem 0.75rem; text-align: right;">Annual Interest Earned</th>
                <th style="padding: 0.6rem 0.75rem; text-align: right;">Ending Portfolio</th>
              </tr>
            </thead>
            <tbody>
              ${scheduleRows}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  btnCalc.addEventListener("click", calculate);
  btnReset.addEventListener("click", () => {
    container.querySelector("#retCurrentAge").value = "30";
    container.querySelector("#retRetireAge").value = "65";
    container.querySelector("#retCurrentSavings").value = "25000";
    container.querySelector("#retMonthlyContribution").value = "500";
    container.querySelector("#retAnnualReturn").value = "8.0";
    container.querySelector("#retPostReturn").value = "5.0";
    container.querySelector("#retLifeExpectancy").value = "90";
    resultDiv.style.display = "none";
  });

  // Auto-calculate on load
  calculate();
}


/* ==========================================================================
   2. ROI (Return on Investment) Calculator
   ========================================================================== */
function renderRoiCalculator(container, calcDef) {
  container.innerHTML = `
    <div class="form-grid">
      <div class="form-group">
        <label class="form-label" for="roiInitial">
          Initial Investment (Cost)
          <span class="form-label-hint">Amount invested</span>
        </label>
        <div class="input-with-addon">
          <span class="input-addon">$</span>
          <input type="number" id="roiInitial" class="form-control" value="10000" min="1" step="500">
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="roiFinal">
          Final Value (Revenue / Return)
          <span class="form-label-hint">Total proceeds</span>
        </label>
        <div class="input-with-addon">
          <span class="input-addon">$</span>
          <input type="number" id="roiFinal" class="form-control" value="16500" min="0" step="500">
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="roiYears">
          Investment Duration
          <span class="form-label-hint">Time held</span>
        </label>
        <div class="input-with-addon">
          <input type="number" id="roiYears" class="form-control" value="3.0" min="0.1" max="100" step="0.5">
          <span class="input-addon suffix">Yrs</span>
        </div>
      </div>
    </div>

    <div class="calc-actions">
      <button type="button" id="btnCalcRoi" class="btn btn-primary">
        <span>⚡ Calculate ROI &amp; CAGR</span>
      </button>
      <button type="button" id="btnResetRoi" class="btn btn-secondary">
        <span>↺ Reset</span>
      </button>
    </div>

    <!-- Results Container -->
    <div id="roiResultContainer" class="results-section animate-fade-in" style="display: none;"></div>
  `;

  const btnCalc = container.querySelector("#btnCalcRoi");
  const btnReset = container.querySelector("#btnResetRoi");
  const resultDiv = container.querySelector("#roiResultContainer");

  function calculate() {
    const initial = parseFloat(container.querySelector("#roiInitial").value) || 0;
    const finalVal = parseFloat(container.querySelector("#roiFinal").value) || 0;
    const years = parseFloat(container.querySelector("#roiYears").value) || 0;

    if (initial <= 0) {
      alert("Initial investment must be greater than 0.");
      return;
    }

    const netProfit = finalVal - initial;
    const totalRoiPct = (netProfit / initial) * 100;
    
    // Annualized ROI (CAGR)
    let annualizedRoiPct = 0;
    if (years > 0 && finalVal > 0) {
      annualizedRoiPct = (Math.pow(finalVal / initial, 1 / years) - 1) * 100;
    }

    const isProfit = netProfit >= 0;
    const heroColor = isProfit ? "var(--accent-emerald)" : "var(--accent-rose)";

    resultDiv.style.display = "block";
    resultDiv.innerHTML = `
      <div class="result-hero-box">
        <span class="result-hero-label">Total Return on Investment (ROI)</span>
        <div class="result-hero-value" style="color: ${heroColor};">
          ${totalRoiPct >= 0 ? "+" : ""}${totalRoiPct.toFixed(2)}%
        </div>
      </div>

      <div class="result-stat-grid">
        <div class="result-stat-card">
          <div class="result-stat-label">Net Profit / Gain</div>
          <div class="result-stat-val" style="color: ${heroColor};">
            ${netProfit >= 0 ? "+" : ""}$${netProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-label">Annualized Return (CAGR)</div>
          <div class="result-stat-val" style="color: ${heroColor};">
            ${annualizedRoiPct.toFixed(2)}% / yr
          </div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-label">Total Investment Cost</div>
          <div class="result-stat-val">$${initial.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-label">Final Gross Return</div>
          <div class="result-stat-val">$${finalVal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
        </div>
      </div>

      <!-- Step-by-Step Breakdown -->
      <div class="steps-wrapper">
        <h3 class="steps-title">📐 ROI &amp; CAGR Formula Breakdown</h3>

        <div class="step-card">
          <span class="step-num-badge">1. Net Return Calculation</span>
          <div class="math-formula-box">
            \\text{Net Profit} = \\text{Final Value} - \\text{Initial Cost} = $${finalVal.toLocaleString()} - $${initial.toLocaleString()} = $${netProfit.toLocaleString()}
          </div>
        </div>

        <div class="step-card">
          <span class="step-num-badge">2. Simple ROI Formula</span>
          <div class="math-formula-box">
            \\text{ROI} = \\left( \\frac{\\text{Net Profit}}{\\text{Initial Cost}} \\right) \\times 100\\% = \\left( \\frac{${netProfit}}{${initial}} \\right) \\times 100 = ${totalRoiPct.toFixed(2)}\\%
          </div>
        </div>

        <div class="step-card">
          <span class="step-num-badge">3. Annualized Return (Compound Annual Growth Rate)</span>
          <div class="math-formula-box">
            \\text{CAGR} = \\left[ \\left( \\frac{\\text{Final Value}}{\\text{Initial Cost}} \\right)^{\\frac{1}{t}} - 1 \\right] \\times 100\\%
          </div>
          <p class="step-content">
            CAGR accounts for the time value of compounding over <b>${years} years</b>: [(${finalVal} / ${initial})^(1 / ${years}) - 1] &times; 100 = <b>${annualizedRoiPct.toFixed(2)}% per year</b>.
          </p>
        </div>
      </div>
    `;
  }

  btnCalc.addEventListener("click", calculate);
  btnReset.addEventListener("click", () => {
    container.querySelector("#roiInitial").value = "10000";
    container.querySelector("#roiFinal").value = "16500";
    container.querySelector("#roiYears").value = "3.0";
    resultDiv.style.display = "none";
  });

  // Auto-calculate on load
  calculate();
}


/* ==========================================================================
   3. Present Value (PV) Calculator
   ========================================================================== */
function renderPresentValueCalculator(container, calcDef) {
  container.innerHTML = `
    <div class="form-grid">
      <div class="form-group">
        <label class="form-label" for="pvFutureAmount">
          Target Future Value (FV)
          <span class="form-label-hint">Desired future sum</span>
        </label>
        <div class="input-with-addon">
          <span class="input-addon">$</span>
          <input type="number" id="pvFutureAmount" class="form-control" value="50000" min="1" step="1000">
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="pvDiscountRate">
          Discount Rate / Expected Return (r)
          <span class="form-label-hint">% per year</span>
        </label>
        <div class="input-with-addon">
          <input type="number" id="pvDiscountRate" class="form-control" value="7.0" min="0.1" max="50" step="0.1">
          <span class="input-addon suffix">%</span>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="pvYears">
          Number of Years (t)
          <span class="form-label-hint">Time until received</span>
        </label>
        <div class="input-with-addon">
          <input type="number" id="pvYears" class="form-control" value="10" min="0.5" max="50" step="1">
          <span class="input-addon suffix">Yrs</span>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="pvCompounding">
          Compounding Frequency (n)
          <span class="form-label-hint">Periods per year</span>
        </label>
        <select id="pvCompounding" class="form-control">
          <option value="1">Annually (1/yr)</option>
          <option value="2">Semi-Annually (2/yr)</option>
          <option value="4">Quarterly (4/yr)</option>
          <option value="12" selected>Monthly (12/yr)</option>
          <option value="365">Daily (365/yr)</option>
        </select>
      </div>
    </div>

    <div class="calc-actions">
      <button type="button" id="btnCalcPv" class="btn btn-primary">
        <span>⚡ Calculate Present Value</span>
      </button>
      <button type="button" id="btnResetPv" class="btn btn-secondary">
        <span>↺ Reset</span>
      </button>
    </div>

    <!-- Results Container -->
    <div id="pvResultContainer" class="results-section animate-fade-in" style="display: none;"></div>
  `;

  const btnCalc = container.querySelector("#btnCalcPv");
  const btnReset = container.querySelector("#btnResetPv");
  const resultDiv = container.querySelector("#pvResultContainer");

  function calculate() {
    const fv = parseFloat(container.querySelector("#pvFutureAmount").value) || 0;
    const r = (parseFloat(container.querySelector("#pvDiscountRate").value) || 0) / 100;
    const t = parseFloat(container.querySelector("#pvYears").value) || 0;
    const n = parseInt(container.querySelector("#pvCompounding").value) || 12;

    if (fv <= 0 || r <= 0 || t <= 0) {
      alert("Please enter valid positive values for Future Value, Rate, and Years.");
      return;
    }

    // PV formula: PV = FV / (1 + r/n)^(n*t)
    const factor = Math.pow(1 + r / n, n * t);
    const pv = fv / factor;
    const totalDiscount = fv - pv;

    // Generate year-by-year discounting trajectory
    let scheduleRows = "";
    for (let yr = 0; yr <= t; yr++) {
      const yearFactor = Math.pow(1 + r / n, n * yr);
      const valueAtYear = pv * yearFactor;
      scheduleRows += `
        <tr style="border-bottom: 1px solid var(--border-color); font-size: 0.85rem;">
          <td style="padding: 0.6rem 0.75rem; text-align: center; font-weight: 600;">Year ${yr}</td>
          <td style="padding: 0.6rem 0.75rem; text-align: right;">$${Math.round(valueAtYear).toLocaleString()}</td>
          <td style="padding: 0.6rem 0.75rem; text-align: right; color: var(--accent-emerald);">$${Math.round(valueAtYear - pv).toLocaleString()}</td>
          <td style="padding: 0.6rem 0.75rem; text-align: right; color: var(--text-muted);">${((valueAtYear / fv) * 100).toFixed(1)}%</td>
        </tr>
      `;
    }

    resultDiv.style.display = "block";
    resultDiv.innerHTML = `
      <div class="result-hero-box">
        <span class="result-hero-label">Required Present Value Today</span>
        <div class="result-hero-value" style="color: var(--accent-primary);">
          $${pv.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      </div>

      <div class="result-stat-grid">
        <div class="result-stat-card">
          <div class="result-stat-label">Target Future Value</div>
          <div class="result-stat-val">$${fv.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-label">Total Compound Interest Needed</div>
          <div class="result-stat-val" style="color: var(--accent-emerald);">$${totalDiscount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-label">Discount Factor</div>
          <div class="result-stat-val">${(1 / factor).toFixed(4)}</div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-label">Principal as % of Future Goal</div>
          <div class="result-stat-val">${((pv / fv) * 100).toFixed(1)}%</div>
        </div>
      </div>

      <!-- Step-by-Step Breakdown -->
      <div class="steps-wrapper">
        <h3 class="steps-title">🔮 Present Value (Time Value of Money) Formula</h3>

        <div class="step-card">
          <span class="step-num-badge">Formula: Discounting Future Cash Flows</span>
          <div class="math-formula-box">
            PV = \\frac{FV}{\\left(1 + \\frac{r}{n}\\right)^{nt}}
          </div>
          <p class="step-content">
            Where <b>FV</b> = $${fv.toLocaleString()}, <b>r</b> = ${(r * 100).toFixed(1)}%, <b>n</b> = ${n} compounding periods/year, and <b>t</b> = ${t} years.<br>
            <b>Calculation:</b> $${fv.toLocaleString()} &divide; (1 + ${r}/${n})^(${n} &times; ${t}) = <b>$${pv.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</b>.
          </p>
        </div>
      </div>

      <!-- Schedule Table -->
      <div style="margin-top: 1.5rem;">
        <h4 style="font-size: 1rem; font-weight: 700; margin-bottom: 0.75rem; color: var(--text-primary);">
          📅 Growth Trajectory from Present Value to Future Value ($${fv.toLocaleString()})
        </h4>
        <div style="overflow-x: auto; border: 1px solid var(--border-color); border-radius: 8px;">
          <table style="width: 100%; border-collapse: collapse; text-align: left;">
            <thead>
              <tr style="background: var(--bg-tertiary); font-size: 0.78rem; text-transform: uppercase; color: var(--text-muted); border-bottom: 2px solid var(--border-color);">
                <th style="padding: 0.6rem 0.75rem; text-align: center;">Timeline</th>
                <th style="padding: 0.6rem 0.75rem; text-align: right;">Compounded Balance</th>
                <th style="padding: 0.6rem 0.75rem; text-align: right;">Cumulative Growth</th>
                <th style="padding: 0.6rem 0.75rem; text-align: right;">% of Target</th>
              </tr>
            </thead>
            <tbody>
              ${scheduleRows}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  btnCalc.addEventListener("click", calculate);
  btnReset.addEventListener("click", () => {
    container.querySelector("#pvFutureAmount").value = "50000";
    container.querySelector("#pvDiscountRate").value = "7.0";
    container.querySelector("#pvYears").value = "10";
    container.querySelector("#pvCompounding").value = "12";
    resultDiv.style.display = "none";
  });

  // Auto-calculate on load
  calculate();
}


/* ==========================================================================
   4. Inflation & Purchasing Power Calculator
   ========================================================================== */
function renderInflationCalculator(container, calcDef) {
  container.innerHTML = `
    <div class="form-grid">
      <div class="form-group">
        <label class="form-label" for="infStartingAmount">
          Starting Amount (Base Value)
          <span class="form-label-hint">Initial purchasing power</span>
        </label>
        <div class="input-with-addon">
          <span class="input-addon">$</span>
          <input type="number" id="infStartingAmount" class="form-control" value="1000" min="1" step="100">
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="infRate">
          Average Annual Inflation Rate
          <span class="form-label-hint">Historical US CPI ~3.2%</span>
        </label>
        <div class="input-with-addon">
          <input type="number" id="infRate" class="form-control" value="3.5" min="0.1" max="50" step="0.1">
          <span class="input-addon suffix">%</span>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="infYears">
          Number of Years
          <span class="form-label-hint">Projection period</span>
        </label>
        <div class="input-with-addon">
          <input type="number" id="infYears" class="form-control" value="10" min="1" max="60" step="1">
          <span class="input-addon suffix">Yrs</span>
        </div>
      </div>
    </div>

    <div class="calc-actions">
      <button type="button" id="btnCalcInflation" class="btn btn-primary">
        <span>⚡ Calculate Purchasing Power</span>
      </button>
      <button type="button" id="btnResetInflation" class="btn btn-secondary">
        <span>↺ Reset</span>
      </button>
    </div>

    <!-- Results Container -->
    <div id="infResultContainer" class="results-section animate-fade-in" style="display: none;"></div>
  `;

  const btnCalc = container.querySelector("#btnCalcInflation");
  const btnReset = container.querySelector("#btnResetInflation");
  const resultDiv = container.querySelector("#infResultContainer");

  function calculate() {
    const startAmount = parseFloat(container.querySelector("#infStartingAmount").value) || 0;
    const rate = (parseFloat(container.querySelector("#infRate").value) || 0) / 100;
    const years = parseInt(container.querySelector("#infYears").value) || 0;

    if (startAmount <= 0 || rate <= 0 || years <= 0) {
      alert("Please enter valid positive values for starting amount, inflation rate, and years.");
      return;
    }

    // Future cost of equivalent basket of goods: C_future = C_start * (1 + i)^t
    const futureCost = startAmount * Math.pow(1 + rate, years);
    
    // Future purchasing power of the original nominal dollar: PP_future = C_start / (1 + i)^t
    const futurePurchasingPower = startAmount / Math.pow(1 + rate, years);
    const purchasingPowerLoss = startAmount - futurePurchasingPower;
    const cumulativeInflationPct = ((futureCost - startAmount) / startAmount) * 100;
    const purchasingPowerLossPct = (purchasingPowerLoss / startAmount) * 100;

    let scheduleRows = "";
    for (let yr = 1; yr <= years; yr++) {
      const yrCost = startAmount * Math.pow(1 + rate, yr);
      const yrPower = startAmount / Math.pow(1 + rate, yr);
      scheduleRows += `
        <tr style="border-bottom: 1px solid var(--border-color); font-size: 0.85rem;">
          <td style="padding: 0.6rem 0.75rem; text-align: center; font-weight: 600;">Year ${yr}</td>
          <td style="padding: 0.6rem 0.75rem; text-align: right; font-weight: 700; color: var(--accent-rose);">$${yrCost.toFixed(2)}</td>
          <td style="padding: 0.6rem 0.75rem; text-align: right;">$${yrPower.toFixed(2)}</td>
          <td style="padding: 0.6rem 0.75rem; text-align: right; color: var(--text-muted);">${(((yrCost - startAmount) / startAmount) * 100).toFixed(1)}%</td>
        </tr>
      `;
    }

    resultDiv.style.display = "block";
    resultDiv.innerHTML = `
      <div class="result-hero-box">
        <span class="result-hero-label">Future Cost of Same Goods in ${years} Years</span>
        <div class="result-hero-value" style="color: var(--accent-rose);">
          $${futureCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      </div>

      <div class="result-stat-grid">
        <div class="result-stat-card">
          <div class="result-stat-label">Real Purchasing Power Remaining</div>
          <div class="result-stat-val" style="color: var(--accent-primary);">$${futurePurchasingPower.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-label">Loss of Purchasing Power</div>
          <div class="result-stat-val" style="color: var(--accent-rose);">${purchasingPowerLossPct.toFixed(1)}% (-$${purchasingPowerLoss.toFixed(2)})</div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-label">Cumulative Price Inflation</div>
          <div class="result-stat-val" style="color: var(--accent-rose);">+${cumulativeInflationPct.toFixed(1)}%</div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-label">Starting Purchasing Power</div>
          <div class="result-stat-val">$${startAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
        </div>
      </div>

      <!-- Step-by-Step Breakdown -->
      <div class="steps-wrapper">
        <h3 class="steps-title">📉 Inflation &amp; Purchasing Power Formulas</h3>

        <div class="step-card">
          <span class="step-num-badge">1. Future Equivalent Cost Formula</span>
          <div class="math-formula-box">
            \\text{Future Cost} = \\text{Base Amount} \\times (1 + i)^t
          </div>
          <p class="step-content">
            At an annual inflation rate of <b>${(rate * 100).toFixed(1)}%</b> over <b>${years} years</b>: $${startAmount.toLocaleString()} &times; (1 + ${rate})^${years} = <b>$${futureCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</b>.
          </p>
        </div>

        <div class="step-card">
          <span class="step-num-badge">2. Purchasing Power Erosion Formula</span>
          <div class="math-formula-box">
            \\text{Real Value} = \\frac{\\text{Base Amount}}{(1 + i)^t}
          </div>
          <p class="step-content">
            A fixed nominal sum of $${startAmount.toLocaleString()} kept in cash will only buy what <b>$${futurePurchasingPower.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</b> buys today, representing a <b>${purchasingPowerLossPct.toFixed(1)}% erosion</b> of purchasing power.
          </p>
        </div>
      </div>

      <!-- Schedule Table -->
      <div style="margin-top: 1.5rem;">
        <h4 style="font-size: 1rem; font-weight: 700; margin-bottom: 0.75rem; color: var(--text-primary);">
          📊 Year-by-Year Inflation Impact ($${startAmount.toLocaleString()} Base)
        </h4>
        <div style="overflow-x: auto; border: 1px solid var(--border-color); border-radius: 8px;">
          <table style="width: 100%; border-collapse: collapse; text-align: left;">
            <thead>
              <tr style="background: var(--bg-tertiary); font-size: 0.78rem; text-transform: uppercase; color: var(--text-muted); border-bottom: 2px solid var(--border-color);">
                <th style="padding: 0.6rem 0.75rem; text-align: center;">Year</th>
                <th style="padding: 0.6rem 0.75rem; text-align: right;">Cost of Goods</th>
                <th style="padding: 0.6rem 0.75rem; text-align: right;">Cash Purchasing Power</th>
                <th style="padding: 0.6rem 0.75rem; text-align: right;">Cumulative Price &Delta;</th>
              </tr>
            </thead>
            <tbody>
              ${scheduleRows}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  btnCalc.addEventListener("click", calculate);
  btnReset.addEventListener("click", () => {
    container.querySelector("#infStartingAmount").value = "1000";
    container.querySelector("#infRate").value = "3.5";
    container.querySelector("#infYears").value = "10";
    resultDiv.style.display = "none";
  });

  // Auto-calculate on load
  calculate();
}
