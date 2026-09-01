/**
 * ============================================================================
 * Financial & Business Calculators:
 * 1. Salary & Paycheck Conversion Calculator
 * 2. Credit Card Payoff & Interest Calculator
 * 3. Future Value & Investment Annuity Calculator
 * 4. Margin & Markup Profit Calculator
 * 5. Asset Depreciation Calculator (Straight-Line, DDB, SYD)
 * ============================================================================
 */

/* ==========================================================================
   1. Salary Calculator (salary-calculator)
   ========================================================================== */
function renderSalaryCalculator(container, calcDef) {
  container.innerHTML = `
    <div class="calc-tool-card">
      <div class="form-grid">
        <div class="form-group">
          <label class="form-label" for="salaryAmount">
            Salary Amount
            <span class="form-label-hint">Base earnings</span>
          </label>
          <div class="input-with-addon">
            <span class="input-addon">$</span>
            <input type="number" id="salaryAmount" class="form-control" value="35" min="0" step="0.5">
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" for="salaryUnit">
            Pay Frequency
            <span class="form-label-hint">Time basis</span>
          </label>
          <select id="salaryUnit" class="form-control">
            <option value="hour" selected>Per Hour ($/hr)</option>
            <option value="day">Per Day ($/day)</option>
            <option value="week">Per Week ($/wk)</option>
            <option value="biweek">Bi-Weekly (Every 2 Weeks)</option>
            <option value="semimonth">Semi-Monthly (2x / Month)</option>
            <option value="month">Per Month ($/mo)</option>
            <option value="year">Per Year (Annual Salary)</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label" for="salaryHoursWeek">
            Hours per Week
            <span class="form-label-hint">Standard full-time = 40</span>
          </label>
          <div class="input-with-addon">
            <input type="number" id="salaryHoursWeek" class="form-control" value="40" min="1" max="168" step="1">
            <span class="input-addon suffix">hrs</span>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" for="salaryDaysWeek">
            Days per Week
            <span class="form-label-hint">Standard = 5</span>
          </label>
          <div class="input-with-addon">
            <input type="number" id="salaryDaysWeek" class="form-control" value="5" min="1" max="7" step="1">
            <span class="input-addon suffix">days</span>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" for="salaryPaidVacationWeeks">
            Paid Holidays / Vacation
            <span class="form-label-hint">Weeks per year</span>
          </label>
          <div class="input-with-addon">
            <input type="number" id="salaryPaidVacationWeeks" class="form-control" value="2" min="0" max="52" step="1">
            <span class="input-addon suffix">wks</span>
          </div>
        </div>
      </div>

      <div class="calc-actions">
        <button type="button" id="btnCalcSalary" class="btn btn-primary">
          <span>⚡ Calculate Paycheck Breakdown</span>
        </button>
        <button type="button" id="btnResetSalary" class="btn btn-secondary">
          <span>↺ Reset</span>
        </button>
      </div>

      <div id="salaryResultContainer" class="results-section animate-fade-in" style="display: none; margin-top: 2rem;"></div>
    </div>
  `;

  const btnCalc = container.querySelector("#btnCalcSalary");
  const btnReset = container.querySelector("#btnResetSalary");
  const resultDiv = container.querySelector("#salaryResultContainer");

  function calculate() {
    const amt = parseFloat(container.querySelector("#salaryAmount").value) || 0;
    const unit = container.querySelector("#salaryUnit").value;
    const hrsPerWeek = parseFloat(container.querySelector("#salaryHoursWeek").value) || 40;
    const daysPerWeek = parseFloat(container.querySelector("#salaryDaysWeek").value) || 5;
    const vacationWeeks = parseFloat(container.querySelector("#salaryPaidVacationWeeks").value) || 0;

    const hrsPerDay = hrsPerWeek / daysPerWeek;
    const weeksPerYear = 52;
    const totalAnnualHours = hrsPerWeek * weeksPerYear;

    // Convert everything to annual base
    let annualGross = 0;
    if (unit === "hour") annualGross = amt * totalAnnualHours;
    else if (unit === "day") annualGross = amt * daysPerWeek * weeksPerYear;
    else if (unit === "week") annualGross = amt * weeksPerYear;
    else if (unit === "biweek") annualGross = amt * 26;
    else if (unit === "semimonth") annualGross = amt * 24;
    else if (unit === "month") annualGross = amt * 12;
    else if (unit === "year") annualGross = amt;

    const hourlyRate = annualGross / totalAnnualHours;
    const dailyRate = annualGross / (daysPerWeek * weeksPerYear);
    const weeklyRate = annualGross / 52;
    const biweeklyRate = annualGross / 26;
    const semimonthlyRate = annualGross / 24;
    const monthlyRate = annualGross / 12;

    const fmt = (n) => "$" + n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    resultDiv.style.display = "block";
    resultDiv.innerHTML = `
      <div class="results-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); margin-bottom: 1.5rem;">
        <div class="result-card featured">
          <span class="result-label">Annual Salary (Gross)</span>
          <div class="result-value" style="font-size: 2rem; color: var(--accent-primary);">${fmt(annualGross)}</div>
          <span class="result-subtext">52 weeks / ${totalAnnualHours.toLocaleString()} work hours</span>
        </div>

        <div class="result-card">
          <span class="result-label">Monthly Paycheck</span>
          <div class="result-value" style="font-size: 1.6rem; color: var(--color-success);">${fmt(monthlyRate)}</div>
          <span class="result-subtext">12 paychecks per year</span>
        </div>

        <div class="result-card">
          <span class="result-label">Bi-Weekly Paycheck</span>
          <div class="result-value" style="font-size: 1.6rem; color: var(--accent-secondary);">${fmt(biweeklyRate)}</div>
          <span class="result-subtext">26 paychecks per year</span>
        </div>

        <div class="result-card">
          <span class="result-label">Hourly Equivalent</span>
          <div class="result-value" style="font-size: 1.6rem; color: var(--accent-primary);">${fmt(hourlyRate)} / hr</div>
          <span class="result-subtext">Based on ${hrsPerWeek} hrs/week</span>
        </div>
      </div>

      <div class="amortization-card">
        <h4 style="margin-bottom: 1rem; color: var(--text-primary); display: flex; align-items: center; gap: 0.5rem;">
          <span>📊</span> Complete Pay Frequency Comparison Table
        </h4>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Pay Frequency</th>
                <th>Periods / Year</th>
                <th>Gross Earnings</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Hourly Wage</strong></td>
                <td>${totalAnnualHours.toLocaleString()} hrs</td>
                <td><strong style="color: var(--accent-primary);">${fmt(hourlyRate)}</strong></td>
              </tr>
              <tr>
                <td><strong>Daily Pay</strong></td>
                <td>${(daysPerWeek * 52).toLocaleString()} days</td>
                <td>${fmt(dailyRate)}</td>
              </tr>
              <tr>
                <td><strong>Weekly Pay</strong></td>
                <td>52 weeks</td>
                <td>${fmt(weeklyRate)}</td>
              </tr>
              <tr style="background: var(--bg-subtle);">
                <td><strong>Bi-Weekly (Every 2 Weeks)</strong></td>
                <td>26 pay periods</td>
                <td><strong style="color: var(--color-success);">${fmt(biweeklyRate)}</strong></td>
              </tr>
              <tr>
                <td><strong>Semi-Monthly (2x / Month)</strong></td>
                <td>24 pay periods</td>
                <td>${fmt(semimonthlyRate)}</td>
              </tr>
              <tr style="background: var(--bg-subtle);">
                <td><strong>Monthly Paycheck</strong></td>
                <td>12 months</td>
                <td><strong style="color: var(--accent-secondary);">${fmt(monthlyRate)}</strong></td>
              </tr>
              <tr>
                <td><strong>Quarterly Pay</strong></td>
                <td>4 quarters</td>
                <td>${fmt(annualGross / 4)}</td>
              </tr>
              <tr style="font-weight: 700; background: var(--bg-card);">
                <td><strong>Annual Total</strong></td>
                <td>1 year</td>
                <td><strong style="color: var(--accent-primary); font-size: 1.1rem;">${fmt(annualGross)}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  btnCalc.addEventListener("click", calculate);
  btnReset.addEventListener("click", () => {
    container.querySelector("#salaryAmount").value = "35";
    container.querySelector("#salaryUnit").value = "hour";
    container.querySelector("#salaryHoursWeek").value = "40";
    resultDiv.style.display = "none";
  });

  calculate();
}

/* ==========================================================================
   2. Credit Card Payoff Calculator (credit-card-payoff)
   ========================================================================== */
function renderCreditCardPayoffCalculator(container, calcDef) {
  container.innerHTML = `
    <div class="calc-tool-card">
      <div class="form-grid">
        <div class="form-group">
          <label class="form-label" for="ccBalance">
            Current Credit Card Balance
            <span class="form-label-hint">Total owed</span>
          </label>
          <div class="input-with-addon">
            <span class="input-addon">$</span>
            <input type="number" id="ccBalance" class="form-control" value="6500" min="50" step="50">
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" for="ccApr">
            Card Interest Rate (APR)
            <span class="form-label-hint">Annual % rate</span>
          </label>
          <div class="input-with-addon">
            <input type="number" id="ccApr" class="form-control" value="22.9" min="0.1" max="99" step="0.1">
            <span class="input-addon suffix">%</span>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" for="ccMonthlyPay">
            Planned Monthly Payment
            <span class="form-label-hint">Fixed amount per month</span>
          </label>
          <div class="input-with-addon">
            <span class="input-addon">$</span>
            <input type="number" id="ccMonthlyPay" class="form-control" value="250" min="10" step="10">
          </div>
        </div>
      </div>

      <div class="calc-actions">
        <button type="button" id="btnCalcCC" class="btn btn-primary">
          <span>⚡ Calculate Debt Payoff</span>
        </button>
        <button type="button" id="btnResetCC" class="btn btn-secondary">
          <span>↺ Reset</span>
        </button>
      </div>

      <div id="ccResultContainer" class="results-section animate-fade-in" style="display: none; margin-top: 2rem;"></div>
    </div>
  `;

  const btnCalc = container.querySelector("#btnCalcCC");
  const btnReset = container.querySelector("#btnResetCC");
  const resultDiv = container.querySelector("#ccResultContainer");

  function calculate() {
    const balance = parseFloat(container.querySelector("#ccBalance").value) || 0;
    const apr = parseFloat(container.querySelector("#ccApr").value) || 0;
    const monthlyPay = parseFloat(container.querySelector("#ccMonthlyPay").value) || 0;

    const monthlyRate = (apr / 100) / 12;
    const minInterestFirstMonth = balance * monthlyRate;

    if (monthlyPay <= minInterestFirstMonth) {
      alert(`Warning: Monthly payment of $${monthlyPay} is less than or equal to the first month's interest ($${minInterestFirstMonth.toFixed(2)}). You will never pay off the debt at this rate.`);
      return;
    }

    // Simulate payoff with fixed monthly payment
    let curBal = balance;
    let totalInterest = 0;
    let months = 0;
    const schedule = [];

    while (curBal > 0.001 && months < 600) {
      months++;
      const interest = curBal * monthlyRate;
      totalInterest += interest;
      const principal = Math.min(curBal, monthlyPay - interest);
      curBal = Math.max(0, curBal - principal);

      if (months <= 24 || curBal === 0 || months % 6 === 0) {
        schedule.push({
          month: months,
          payment: principal + interest,
          principal: principal,
          interest: interest,
          balance: curBal
        });
      }
    }

    const years = Math.floor(months / 12);
    const remMonths = months % 12;
    const timeStr = years > 0 ? `${years} yr${years > 1 ? 's' : ''} ${remMonths} mo${remMonths !== 1 ? 's' : ''}` : `${months} months`;
    const totalPaid = balance + totalInterest;

    const fmt = (n) => "$" + n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    resultDiv.style.display = "block";
    resultDiv.innerHTML = `
      <div class="results-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); margin-bottom: 1.5rem;">
        <div class="result-card featured">
          <span class="result-label">Time to Debt Freedom</span>
          <div class="result-value" style="font-size: 1.85rem; color: var(--accent-primary);">${timeStr}</div>
          <span class="result-subtext">${months} total monthly installments</span>
        </div>

        <div class="result-card">
          <span class="result-label">Total Interest Paid</span>
          <div class="result-value" style="font-size: 1.6rem; color: var(--color-danger);">${fmt(totalInterest)}</div>
          <span class="result-subtext">${((totalInterest / balance) * 100).toFixed(1)}% of original balance</span>
        </div>

        <div class="result-card">
          <span class="result-label">Total Amount Paid</span>
          <div class="result-value" style="font-size: 1.6rem; color: var(--text-primary);">${fmt(totalPaid)}</div>
          <span class="result-subtext">Principal + Cumulative Interest</span>
        </div>
      </div>

      <div class="amortization-card">
        <h4 style="margin-bottom: 1rem; color: var(--text-primary);">📅 Payoff Amortization Snapshot</h4>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Payment</th>
                <th>Principal Paid</th>
                <th>Interest Fee</th>
                <th>Remaining Balance</th>
              </tr>
            </thead>
            <tbody>
              ${schedule.map(s => `
                <tr>
                  <td>Month ${s.month}</td>
                  <td>${fmt(s.payment)}</td>
                  <td style="color: var(--color-success); font-weight: 600;">${fmt(s.principal)}</td>
                  <td style="color: var(--color-danger);">${fmt(s.interest)}</td>
                  <td style="font-weight: 700;">${fmt(s.balance)}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  btnCalc.addEventListener("click", calculate);
  btnReset.addEventListener("click", () => {
    container.querySelector("#ccBalance").value = "6500";
    container.querySelector("#ccApr").value = "22.9";
    container.querySelector("#ccMonthlyPay").value = "250";
    resultDiv.style.display = "none";
  });

  calculate();
}

/* ==========================================================================
   3. Future Value Calculator (future-value)
   ========================================================================== */
function renderFutureValueCalculator(container, calcDef) {
  container.innerHTML = `
    <div class="calc-tool-card">
      <div class="form-grid">
        <div class="form-group">
          <label class="form-label" for="fvPrincipal">
            Initial Starting Principal (PV)
            <span class="form-label-hint">Current sum</span>
          </label>
          <div class="input-with-addon">
            <span class="input-addon">$</span>
            <input type="number" id="fvPrincipal" class="form-control" value="10000" min="0" step="500">
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" for="fvDeposit">
            Periodic Contribution (PMT)
            <span class="form-label-hint">Regular savings</span>
          </label>
          <div class="input-with-addon">
            <span class="input-addon">$</span>
            <input type="number" id="fvDeposit" class="form-control" value="400" min="0" step="50">
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" for="fvRate">
            Expected Annual Return (r)
            <span class="form-label-hint">Annual % return</span>
          </label>
          <div class="input-with-addon">
            <input type="number" id="fvRate" class="form-control" value="8.0" min="0" max="50" step="0.1">
            <span class="input-addon suffix">%</span>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" for="fvYears">
            Investment Duration (t)
            <span class="form-label-hint">Years</span>
          </label>
          <div class="input-with-addon">
            <input type="number" id="fvYears" class="form-control" value="15" min="1" max="60" step="1">
            <span class="input-addon suffix">yrs</span>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" for="fvFreq">
            Deposit Frequency & Compounding
            <span class="form-label-hint">Periods per year</span>
          </label>
          <select id="fvFreq" class="form-control">
            <option value="12" selected>Monthly (12x / yr)</option>
            <option value="4">Quarterly (4x / yr)</option>
            <option value="1">Annually (1x / yr)</option>
          </select>
        </div>
      </div>

      <div class="calc-actions">
        <button type="button" id="btnCalcFv" class="btn btn-primary">
          <span>⚡ Calculate Future Value</span>
        </button>
        <button type="button" id="btnResetFv" class="btn btn-secondary">
          <span>↺ Reset</span>
        </button>
      </div>

      <div id="fvResultContainer" class="results-section animate-fade-in" style="display: none; margin-top: 2rem;"></div>
    </div>
  `;

  const btnCalc = container.querySelector("#btnCalcFv");
  const btnReset = container.querySelector("#btnResetFv");
  const resultDiv = container.querySelector("#fvResultContainer");

  function calculate() {
    const pv = parseFloat(container.querySelector("#fvPrincipal").value) || 0;
    const pmt = parseFloat(container.querySelector("#fvDeposit").value) || 0;
    const rate = (parseFloat(container.querySelector("#fvRate").value) || 0) / 100;
    const years = parseFloat(container.querySelector("#fvYears").value) || 1;
    const freq = parseInt(container.querySelector("#fvFreq").value) || 12;

    const periodicRate = rate / freq;
    const totalPeriods = years * freq;

    // FV = PV * (1+i)^n + PMT * [((1+i)^n - 1) / i]
    let fv = 0;
    if (periodicRate === 0) {
      fv = pv + (pmt * totalPeriods);
    } else {
      const compoundFactor = Math.pow(1 + periodicRate, totalPeriods);
      const lumpSumFV = pv * compoundFactor;
      const annuityFV = pmt * ((compoundFactor - 1) / periodicRate);
      fv = lumpSumFV + annuityFV;
    }

    const totalDeposits = pv + (pmt * totalPeriods);
    const totalInterest = fv - totalDeposits;
    const roiPercent = totalDeposits > 0 ? (totalInterest / totalDeposits) * 100 : 0;

    const fmt = (n) => "$" + n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    // Build yearly schedule
    const yearlySchedule = [];
    let currentBalance = pv;
    let cumulativeDeposits = pv;

    for (let y = 1; y <= years; y++) {
      for (let p = 1; p <= freq; p++) {
        currentBalance = currentBalance * (1 + periodicRate) + pmt;
        cumulativeDeposits += pmt;
      }
      yearlySchedule.push({
        year: y,
        deposited: cumulativeDeposits,
        interest: currentBalance - cumulativeDeposits,
        balance: currentBalance
      });
    }

    resultDiv.style.display = "block";
    resultDiv.innerHTML = `
      <div class="results-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); margin-bottom: 1.5rem;">
        <div class="result-card featured">
          <span class="result-label">Total Future Value (FV)</span>
          <div class="result-value" style="font-size: 2rem; color: var(--accent-primary);">${fmt(fv)}</div>
          <span class="result-subtext">Estimated portfolio value after ${years} years</span>
        </div>

        <div class="result-card">
          <span class="result-label">Total Principal Invested</span>
          <div class="result-value" style="font-size: 1.6rem; color: var(--text-primary);">${fmt(totalDeposits)}</div>
          <span class="result-subtext">PV ($${pv.toLocaleString()}) + Deposits</span>
        </div>

        <div class="result-card">
          <span class="result-label">Compound Growth Earned</span>
          <div class="result-value" style="font-size: 1.6rem; color: var(--color-success);">${fmt(totalInterest)}</div>
          <span class="result-subtext">+${roiPercent.toFixed(1)}% Return on Investment</span>
        </div>
      </div>

      <div class="amortization-card">
        <h4 style="margin-bottom: 1rem; color: var(--text-primary);">📈 Year-by-Year Growth Trajectory</h4>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Year</th>
                <th>Total Contributed</th>
                <th>Accumulated Interest</th>
                <th>Ending Balance</th>
              </tr>
            </thead>
            <tbody>
              ${yearlySchedule.map(s => `
                <tr>
                  <td><strong>Year ${s.year}</strong></td>
                  <td>${fmt(s.deposited)}</td>
                  <td style="color: var(--color-success); font-weight: 600;">+${fmt(s.interest)}</td>
                  <td style="font-weight: 700; color: var(--accent-primary);">${fmt(s.balance)}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  btnCalc.addEventListener("click", calculate);
  btnReset.addEventListener("click", () => {
    container.querySelector("#fvPrincipal").value = "10000";
    container.querySelector("#fvDeposit").value = "400";
    container.querySelector("#fvRate").value = "8.0";
    container.querySelector("#fvYears").value = "15";
    resultDiv.style.display = "none";
  });

  calculate();
}

/* ==========================================================================
   4. Margin & Markup Calculator (margin-markup)
   ========================================================================== */
function renderMarginMarkupCalculator(container, calcDef) {
  container.innerHTML = `
    <div class="calc-tool-card">
      <div class="form-grid">
        <div class="form-group">
          <label class="form-label" for="mmCost">
            Cost of Goods Sold (COGS)
            <span class="form-label-hint">Item purchase / build cost</span>
          </label>
          <div class="input-with-addon">
            <span class="input-addon">$</span>
            <input type="number" id="mmCost" class="form-control" value="60" min="0.01" step="1">
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" for="mmRevenue">
            Selling Price / Revenue
            <span class="form-label-hint">Retail price to customer</span>
          </label>
          <div class="input-with-addon">
            <span class="input-addon">$</span>
            <input type="number" id="mmRevenue" class="form-control" value="100" min="0.01" step="1">
          </div>
        </div>
      </div>

      <div class="calc-actions">
        <button type="button" id="btnCalcMM" class="btn btn-primary">
          <span>⚡ Calculate Margin & Markup</span>
        </button>
        <button type="button" id="btnResetMM" class="btn btn-secondary">
          <span>↺ Reset</span>
        </button>
      </div>

      <div id="mmResultContainer" class="results-section animate-fade-in" style="display: none; margin-top: 2rem;"></div>
    </div>
  `;

  const btnCalc = container.querySelector("#btnCalcMM");
  const btnReset = container.querySelector("#btnResetMM");
  const resultDiv = container.querySelector("#mmResultContainer");

  function calculate() {
    const cost = parseFloat(container.querySelector("#mmCost").value) || 0;
    const revenue = parseFloat(container.querySelector("#mmRevenue").value) || 0;

    if (cost <= 0 || revenue <= 0) {
      alert("Please enter positive cost and revenue values.");
      return;
    }

    const profit = revenue - cost;
    const marginPercent = (profit / revenue) * 100;
    const markupPercent = (profit / cost) * 100;

    const fmt = (n) => "$" + n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    resultDiv.style.display = "block";
    resultDiv.innerHTML = `
      <div class="results-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); margin-bottom: 1.5rem;">
        <div class="result-card featured">
          <span class="result-label">Gross Profit Margin</span>
          <div class="result-value" style="font-size: 2rem; color: var(--accent-primary);">${marginPercent.toFixed(2)}%</div>
          <span class="result-subtext">Profit ÷ Revenue</span>
        </div>

        <div class="result-card">
          <span class="result-label">Markup Percentage</span>
          <div class="result-value" style="font-size: 2rem; color: var(--accent-secondary);">${markupPercent.toFixed(2)}%</div>
          <span class="result-subtext">Profit ÷ Cost</span>
        </div>

        <div class="result-card">
          <span class="result-label">Gross Profit Dollar</span>
          <div class="result-value" style="font-size: 2rem; color: var(--color-success);">${fmt(profit)}</div>
          <span class="result-subtext">Net gain per unit</span>
        </div>
      </div>

      <div class="step-solution-box">
        <h4 style="color: var(--text-primary); margin-bottom: 1rem;">📝 Formula & Margin vs Markup Comparison</h4>

        <div class="step-item">
          <span class="step-badge">Margin</span>
          <div>
            <strong>Profit Margin Formula:</strong><br>
            $$\\text{Margin} = \\frac{\\text{Revenue} - \\text{Cost}}{\\text{Revenue}} \\times 100 = \\frac{${fmt(revenue)} - ${fmt(cost)}}{${fmt(revenue)}} \\times 100 = \\mathbf{${marginPercent.toFixed(2)}\\%}$$
          </div>
        </div>

        <div class="step-item">
          <span class="step-badge">Markup</span>
          <div>
            <strong>Markup Formula:</strong><br>
            $$\\text{Markup} = \\frac{\\text{Revenue} - \\text{Cost}}{\\text{Cost}} \\times 100 = \\frac{${fmt(revenue)} - ${fmt(cost)}}{${fmt(cost)}} \\times 100 = \\mathbf{${markupPercent.toFixed(2)}\\%}$$
          </div>
        </div>
      </div>
    `;
  }

  btnCalc.addEventListener("click", calculate);
  btnReset.addEventListener("click", () => {
    container.querySelector("#mmCost").value = "60";
    container.querySelector("#mmRevenue").value = "100";
    resultDiv.style.display = "none";
  });

  calculate();
}

/* ==========================================================================
   5. Depreciation Calculator (depreciation-calculator)
   ========================================================================== */
function renderDepreciationCalculator(container, calcDef) {
  container.innerHTML = `
    <div class="calc-tool-card">
      <div class="form-grid">
        <div class="form-group">
          <label class="form-label" for="depCost">
            Asset Initial Cost
            <span class="form-label-hint">Original purchase price</span>
          </label>
          <div class="input-with-addon">
            <span class="input-addon">$</span>
            <input type="number" id="depCost" class="form-control" value="25000" min="100" step="500">
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" for="depSalvage">
            Salvage / Residual Value
            <span class="form-label-hint">Estimated end-of-life value</span>
          </label>
          <div class="input-with-addon">
            <span class="input-addon">$</span>
            <input type="number" id="depSalvage" class="form-control" value="3000" min="0" step="500">
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" for="depLife">
            Useful Life (Years)
            <span class="form-label-hint">Expected service span</span>
          </label>
          <div class="input-with-addon">
            <input type="number" id="depLife" class="form-control" value="5" min="1" max="50" step="1">
            <span class="input-addon suffix">yrs</span>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" for="depMethod">
            Depreciation Method
            <span class="form-label-hint">Accounting standard</span>
          </label>
          <select id="depMethod" class="form-control">
            <option value="straight" selected>Straight-Line Method</option>
            <option value="ddb">Double Declining Balance (200% DB)</option>
            <option value="syd">Sum-of-the-Years' Digits (SYD)</option>
          </select>
        </div>
      </div>

      <div class="calc-actions">
        <button type="button" id="btnCalcDep" class="btn btn-primary">
          <span>⚡ Calculate Depreciation Schedule</span>
        </button>
        <button type="button" id="btnResetDep" class="btn btn-secondary">
          <span>↺ Reset</span>
        </button>
      </div>

      <div id="depResultContainer" class="results-section animate-fade-in" style="display: none; margin-top: 2rem;"></div>
    </div>
  `;

  const btnCalc = container.querySelector("#btnCalcDep");
  const btnReset = container.querySelector("#btnResetDep");
  const resultDiv = container.querySelector("#depResultContainer");

  function calculate() {
    const cost = parseFloat(container.querySelector("#depCost").value) || 0;
    const salvage = parseFloat(container.querySelector("#depSalvage").value) || 0;
    const life = parseInt(container.querySelector("#depLife").value) || 1;
    const method = container.querySelector("#depMethod").value;

    if (cost <= salvage) {
      alert("Asset cost must be strictly greater than salvage value.");
      return;
    }

    const depreciableBase = cost - salvage;
    const schedule = [];
    let accumDep = 0;
    let currentBookVal = cost;

    if (method === "straight") {
      const annualExpense = depreciableBase / life;
      for (let y = 1; y <= life; y++) {
        accumDep += annualExpense;
        currentBookVal -= annualExpense;
        schedule.push({
          year: y,
          expense: annualExpense,
          accumulated: accumDep,
          bookValue: currentBookVal
        });
      }
    } else if (method === "ddb") {
      const rate = 2 / life;
      for (let y = 1; y <= life; y++) {
        let expense = currentBookVal * rate;
        if (currentBookVal - expense < salvage) {
          expense = Math.max(0, currentBookVal - salvage);
        }
        accumDep += expense;
        currentBookVal -= expense;
        schedule.push({
          year: y,
          expense: expense,
          accumulated: accumDep,
          bookValue: currentBookVal
        });
      }
    } else if (method === "syd") {
      const sumOfDigits = (life * (life + 1)) / 2;
      for (let y = 1; y <= life; y++) {
        const remainingLife = life - y + 1;
        const fraction = remainingLife / sumOfDigits;
        const expense = depreciableBase * fraction;
        accumDep += expense;
        currentBookVal -= expense;
        schedule.push({
          year: y,
          expense: expense,
          accumulated: accumDep,
          bookValue: currentBookVal
        });
      }
    }

    const fmt = (n) => "$" + n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const firstYearExpense = schedule[0] ? schedule[0].expense : 0;

    resultDiv.style.display = "block";
    resultDiv.innerHTML = `
      <div class="results-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); margin-bottom: 1.5rem;">
        <div class="result-card featured">
          <span class="result-label">Year 1 Depreciation Expense</span>
          <div class="result-value" style="font-size: 2rem; color: var(--accent-primary);">${fmt(firstYearExpense)}</div>
          <span class="result-subtext">Annual write-off for year 1</span>
        </div>

        <div class="result-card">
          <span class="result-label">Total Depreciable Base</span>
          <div class="result-value" style="font-size: 1.6rem; color: var(--text-primary);">${fmt(depreciableBase)}</div>
          <span class="result-subtext">Cost ($${cost.toLocaleString()}) - Salvage ($${salvage.toLocaleString()})</span>
        </div>

        <div class="result-card">
          <span class="result-label">Ending Salvage Value</span>
          <div class="result-value" style="font-size: 1.6rem; color: var(--color-success);">${fmt(salvage)}</div>
          <span class="result-subtext">Residual book value after ${life} yrs</span>
        </div>
      </div>

      <div class="amortization-card">
        <h4 style="margin-bottom: 1rem; color: var(--text-primary);">📅 Full Asset Depreciation Schedule</h4>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Year</th>
                <th>Annual Expense</th>
                <th>Accumulated Depreciation</th>
                <th>Ending Book Value</th>
              </tr>
            </thead>
            <tbody>
              ${schedule.map(s => `
                <tr>
                  <td><strong>Year ${s.year}</strong></td>
                  <td style="color: var(--color-danger); font-weight: 600;">${fmt(s.expense)}</td>
                  <td>${fmt(s.accumulated)}</td>
                  <td style="font-weight: 700; color: var(--accent-primary);">${fmt(s.bookValue)}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  btnCalc.addEventListener("click", calculate);
  btnReset.addEventListener("click", () => {
    container.querySelector("#depCost").value = "25000";
    container.querySelector("#depSalvage").value = "3000";
    container.querySelector("#depLife").value = "5";
    container.querySelector("#depMethod").value = "straight";
    resultDiv.style.display = "none";
  });

  calculate();
}
