/**
 * ============================================================================
 * Financial Calculators: Loan, Mortgage, and Auto Loan
 * ============================================================================
 */

function renderLoanCalculator(container, calcDef) {
  const isMortgage = calcDef.id === "mortgage-calculator";
  const isAuto = calcDef.id === "auto-loan";

  const defaultAmount = isMortgage ? 250000 : (isAuto ? 25000 : 15000);
  const defaultRate = isMortgage ? 6.5 : (isAuto ? 5.9 : 8.5);
  const defaultYears = isMortgage ? 30 : (isAuto ? 5 : 3);

  container.innerHTML = `
    <div class="form-grid">
      <div class="form-group">
        <label class="form-label" for="loanAmount">
          ${isMortgage ? "Home Loan / Principal Amount" : (isAuto ? "Vehicle Price / Loan Amount" : "Loan Amount")}
          <span class="form-label-hint">Total borrowed</span>
        </label>
        <div class="input-with-addon">
          <span class="input-addon">$</span>
          <input type="number" id="loanAmount" class="form-control" value="${defaultAmount}" min="100" step="100">
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="interestRate">
          Annual Interest Rate (APR)
          <span class="form-label-hint">% per year</span>
        </label>
        <div class="input-with-addon">
          <input type="number" id="interestRate" class="form-control" value="${defaultRate}" min="0.1" max="99" step="0.1">
          <span class="input-addon suffix">%</span>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="loanTermYears">
          Loan Term (Years)
          <span class="form-label-hint">Duration</span>
        </label>
        <div class="input-with-addon">
          <input type="number" id="loanTermYears" class="form-control" value="${defaultYears}" min="1" max="40" step="1">
          <span class="input-addon suffix">Yrs</span>
        </div>
      </div>
    </div>

    <div class="calc-actions">
      <button type="button" id="btnCalculateLoan" class="btn btn-primary">
        <span>⚡ Calculate Loan</span>
      </button>
      <button type="button" id="btnResetLoan" class="btn btn-secondary">
        <span>↺ Reset</span>
      </button>
      <button type="button" id="btnPrintLoan" class="btn btn-secondary btn-sm" style="margin-left: auto;">
        <span>🖨️ Print / Save</span>
      </button>
    </div>

    <!-- Results Area -->
    <div id="loanResultContainer" class="results-section animate-fade-in" style="display: none;">
      <!-- Content populated dynamically -->
    </div>
  `;

  const btnCalc = container.querySelector("#btnCalculateLoan");
  const btnReset = container.querySelector("#btnResetLoan");
  const btnPrint = container.querySelector("#btnPrintLoan");
  const resultDiv = container.querySelector("#loanResultContainer");

  function calculate(ev) {
    const P = parseFloat(container.querySelector("#loanAmount").value) || 0;
    const annualRate = parseFloat(container.querySelector("#interestRate").value) || 0;
    const years = parseFloat(container.querySelector("#loanTermYears").value) || 0;

    if (P <= 0 || annualRate <= 0 || years <= 0) {
      alert("Please enter valid positive numbers for Loan Amount, Rate, and Term.");
      return;
    }

    const r = (annualRate / 100) / 12; // Monthly interest rate
    const n = years * 12; // Total number of months

    // Standard Amortization Formula: M = P * [r(1+r)^n] / [(1+r)^n - 1]
    const rPowN = Math.pow(1 + r, n);
    const monthlyPayment = P * ((r * rPowN) / (rPowN - 1));
    const totalPayment = monthlyPayment * n;
    const totalInterest = totalPayment - P;
    const interestPercent = ((totalInterest / totalPayment) * 100).toFixed(1);
    const principalPercent = ((P / totalPayment) * 100).toFixed(1);

    // Generate Amortization Schedule (First 6 months preview)
    let balance = P;
    let scheduleRows = "";
    for (let month = 1; month <= Math.min(n, 12); month++) {
      const monthInterest = balance * r;
      const monthPrincipal = monthlyPayment - monthInterest;
      balance = Math.max(0, balance - monthPrincipal);

      scheduleRows += `
        <tr style="border-bottom: 1px solid var(--border-color); font-size: 0.85rem;">
          <td style="padding: 0.6rem 0.75rem; text-align: center; font-weight: 600;">Month ${month}</td>
          <td style="padding: 0.6rem 0.75rem; text-align: right;">$${monthlyPayment.toFixed(2)}</td>
          <td style="padding: 0.6rem 0.75rem; text-align: right; color: var(--accent-emerald);">$${monthPrincipal.toFixed(2)}</td>
          <td style="padding: 0.6rem 0.75rem; text-align: right; color: var(--accent-amber);">$${monthInterest.toFixed(2)}</td>
          <td style="padding: 0.6rem 0.75rem; text-align: right; font-weight: 600;">$${balance.toFixed(2)}</td>
        </tr>
      `;
    }

    // SVG Donut Chart Calculation
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const principalDash = (principalPercent / 100) * circumference;
    const interestDash = (interestPercent / 100) * circumference;

    resultDiv.innerHTML = `
      <div class="result-hero-box">
        <span class="result-hero-label">Estimated Monthly Payment</span>
        <div class="result-hero-value">
          $${monthlyPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          <span style="font-size: 1rem; color: var(--text-secondary); font-weight: 500;">/ month</span>
        </div>
      </div>

      <div class="result-stat-grid">
        <div class="result-stat-card">
          <div class="result-stat-label">Total Principal Borrowed</div>
          <div class="result-stat-val" style="color: var(--accent-emerald);">$${P.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-label">Total Interest Paid</div>
          <div class="result-stat-val" style="color: var(--accent-amber);">$${totalInterest.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-label">Total Cost of Loan</div>
          <div class="result-stat-val">$${totalPayment.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-label">Total Number of Payments</div>
          <div class="result-stat-val">${n} payments</div>
        </div>
      </div>

      <!-- Donut Chart & Visual Breakdown -->
      <div class="chart-container" style="display: flex; gap: 2rem; flex-wrap: wrap;">
        <div style="position: relative; width: 140px; height: 140px; display: flex; align-items: center; justify-content: center;">
          <svg width="140" height="140" viewBox="0 0 140 140" style="transform: rotate(-90deg);">
            <circle cx="70" cy="70" r="${radius}" fill="none" stroke="var(--bg-subtle)" stroke-width="18" />
            <!-- Principal Slice -->
            <circle cx="70" cy="70" r="${radius}" fill="none" stroke="#10b981" stroke-width="18"
                    stroke-dasharray="${principalDash} ${circumference}" stroke-dashoffset="0" />
            <!-- Interest Slice -->
            <circle cx="70" cy="70" r="${radius}" fill="none" stroke="#f59e0b" stroke-width="18"
                    stroke-dasharray="${interestDash} ${circumference}" stroke-dashoffset="-${principalDash}" />
          </svg>
          <div style="position: absolute; text-align: center;">
            <span style="font-size: 0.72rem; font-weight: 700; color: var(--text-muted);">PRINCIPAL</span>
            <div style="font-size: 1.1rem; font-weight: 800; color: var(--text-primary);">${principalPercent}%</div>
          </div>
        </div>
        
        <div style="display: flex; flex-direction: column; justify-content: center; gap: 0.75rem; flex: 1;">
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.75rem; background: var(--bg-subtle); border-radius: var(--radius-sm);">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span style="width: 12px; height: 12px; border-radius: 3px; background: #10b981; display: inline-block;"></span>
              <span style="font-size: 0.88rem; font-weight: 600;">Principal Portion</span>
            </div>
            <span style="font-weight: 700;">$${P.toLocaleString()} (${principalPercent}%)</span>
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.75rem; background: var(--bg-subtle); border-radius: var(--radius-sm);">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span style="width: 12px; height: 12px; border-radius: 3px; background: #f59e0b; display: inline-block;"></span>
              <span style="font-size: 0.88rem; font-weight: 600;">Total Interest Portion</span>
            </div>
            <span style="font-weight: 700;">$${totalInterest.toFixed(2)} (${interestPercent}%)</span>
          </div>
        </div>
      </div>

      <!-- In-Content Ad Placement Ready -->
      <div class="ad-slot-container">
        <div class="ad-label">Advertisement</div>
        <div class="ad-placeholder-box in-content">
          <strong>Sponsored Financial & Loan Rates</strong>
          <span class="ad-subtext">Compare top lending partners with lowest APR rates in your state</span>
        </div>
      </div>

      <!-- Step-by-Step Mathematical Explanation -->
      <div class="steps-wrapper">
        <div class="steps-header">
          <h3 class="steps-title">📐 Step-by-Step Calculation Formula</h3>
        </div>

        <div class="step-card">
          <span class="step-num-badge">Step 1: Identify Given Variables</span>
          <p class="step-content">
            Principal loan amount (<b>P</b>) = $${P.toLocaleString()}<br>
            Annual interest rate (<b>I</b>) = ${annualRate}%<br>
            Loan term in years (<b>T</b>) = ${years} years
          </p>
        </div>

        <div class="step-card">
          <span class="step-num-badge">Step 2: Convert to Periodic Monthly Rates</span>
          <p class="step-content">
            Monthly interest rate (<b>r</b>) = <code>(${annualRate} / 100) / 12 = ${(r).toFixed(6)}</code><br>
            Total number of monthly payments (<b>n</b>) = <code>${years} × 12 = ${n} months</code>
          </p>
        </div>

        <div class="step-card">
          <span class="step-num-badge">Step 3: Apply Standard Amortization Formula</span>
          <div class="math-formula-box">
            M = P × [ r(1 + r)^n ] / [ (1 + r)^n - 1 ]
          </div>
          <p class="step-content">
            M = ${P} × [ ${(r).toFixed(6)} × (1 + ${(r).toFixed(6)})^${n} ] / [ (1 + ${(r).toFixed(6)})^${n} - 1 ]<br>
            M = <b>$${monthlyPayment.toFixed(2)} per month</b>
          </p>
        </div>

        <div class="step-card">
          <span class="step-num-badge">Step 4: Total Interest & Total Cost</span>
          <p class="step-content">
            Total Paid = <code>$${monthlyPayment.toFixed(2)} × ${n} = $${totalPayment.toFixed(2)}</code><br>
            Total Interest = <code>$${totalPayment.toFixed(2)} - $${P} = $${totalInterest.toFixed(2)}</code>
          </p>
        </div>
      </div>

      <!-- Amortization Schedule Table Preview -->
      <div style="margin-top: 2rem;">
        <h4 style="font-family: var(--font-heading); font-size: 1.15rem; margin-bottom: 0.75rem;">📅 First Year Amortization Schedule Preview</h4>
        <div style="overflow-x: auto; border: 1px solid var(--border-color); border-radius: var(--radius-md);">
          <table style="width: 100%; border-collapse: collapse; text-align: left;">
            <thead>
              <tr style="background: var(--bg-subtle); border-bottom: 1.5px solid var(--border-color); font-size: 0.82rem; text-transform: uppercase; color: var(--text-muted);">
                <th style="padding: 0.75rem; text-align: center;">Period</th>
                <th style="padding: 0.75rem; text-align: right;">Payment</th>
                <th style="padding: 0.75rem; text-align: right;">Principal</th>
                <th style="padding: 0.75rem; text-align: right;">Interest</th>
                <th style="padding: 0.75rem; text-align: right;">Balance</th>
              </tr>
            </thead>
            <tbody>
              ${scheduleRows}
            </tbody>
          </table>
        </div>
      </div>
    `;

    resultDiv.style.display = "block";
    if (ev && ev.type === "click") resultDiv.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  btnCalc.addEventListener("click", calculate);
  btnReset.addEventListener("click", () => {
    container.querySelector("#loanAmount").value = defaultAmount;
    container.querySelector("#interestRate").value = defaultRate;
    container.querySelector("#loanTermYears").value = defaultYears;
    resultDiv.style.display = "none";
  });

  btnPrint.addEventListener("click", () => {
    window.print();
  });

  // Calculate automatically on first render
  calculate();
}

function renderMortgageCalculator(container, calcDef) {
  renderLoanCalculator(container, calcDef);
}

function renderAutoLoanCalculator(container, calcDef) {
  renderLoanCalculator(container, calcDef);
}

/* ============================================================================
 * Home Affordability —28/36 DTI caps + taxes/insurance → max home price
 * ========================================================================== */
function renderHomeAffordabilityCalculator(container, calcDef) {
  container.innerHTML = `
    <div class="form-grid">
      <div class="form-group">
        <label class="form-label" for="haIncome">Gross Annual Income</label>
        <div class="input-with-addon">
          <span class="input-addon prefix">$</span>
          <input type="number" id="haIncome" class="form-control" value="100000" min="1" step="any">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label" for="haDebts">Other Monthly Debt Payments <span class="form-label-hint">car, cards, student loans</span></label>
        <div class="input-with-addon">
          <span class="input-addon prefix">$</span>
          <input type="number" id="haDebts" class="form-control" value="500" min="0" step="any">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label" for="haDown">Down Payment</label>
        <div class="input-with-addon">
          <span class="input-addon prefix">$</span>
          <input type="number" id="haDown" class="form-control" value="50000" min="0" step="any">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label" for="haRate">Mortgage Interest Rate <span class="form-label-hint">annual %</span></label>
        <input type="number" id="haRate" class="form-control" value="6.5" min="0" max="30" step="0.01">
      </div>
      <div class="form-group">
        <label class="form-label" for="haTerm">Loan Term</label>
        <select id="haTerm" class="form-control">
          <option value="30" selected>30 years</option>
          <option value="20">20 years</option>
          <option value="15">15 years</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label" for="haTax">Property Tax <span class="form-label-hint">% of price / year</span></label>
        <input type="number" id="haTax" class="form-control" value="1.1" min="0" max="10" step="0.01">
      </div>
      <div class="form-group">
        <label class="form-label" for="haIns">Home Insurance <span class="form-label-hint">$/year</span></label>
        <div class="input-with-addon">
          <span class="input-addon prefix">$</span>
          <input type="number" id="haIns" class="form-control" value="1200" min="0" step="any">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label" for="haFront">Front-End DTI Cap <span class="form-label-hint">housing only %</span></label>
        <input type="number" id="haFront" class="form-control" value="28" min="1" max="60" step="1">
      </div>
      <div class="form-group">
        <label class="form-label" for="haBack">Back-End DTI Cap <span class="form-label-hint">all debts %</span></label>
        <input type="number" id="haBack" class="form-control" value="36" min="1" max="80" step="1">
      </div>
    </div>

    <div class="calc-actions">
      <button type="button" id="btnCalcHa" class="btn btn-primary"><span>🏠 Find My Price Range</span></button>
      <button type="button" id="btnResetHa" class="btn btn-secondary"><span>↺ Reset</span></button>
    </div>

    <div id="haResultContainer" class="results-section animate-fade-in" style="display: none; margin-top: 2rem;"></div>
  `;

  const incomeInput = container.querySelector("#haIncome");
  const debtsInput = container.querySelector("#haDebts");
  const downInput = container.querySelector("#haDown");
  const rateInput = container.querySelector("#haRate");
  const termSel = container.querySelector("#haTerm");
  const taxInput = container.querySelector("#haTax");
  const insInput = container.querySelector("#haIns");
  const frontInput = container.querySelector("#haFront");
  const backInput = container.querySelector("#haBack");
  const resultDiv = container.querySelector("#haResultContainer");

  const money = (n) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const money0 = (n) => n.toLocaleString("en-US", { maximumFractionDigits: 0 });

  function calculate(ev) {
    const income = parseFloat(incomeInput.value);
    const debts = parseFloat(debtsInput.value);
    const down = parseFloat(downInput.value);
    const rate = parseFloat(rateInput.value);
    const term = parseInt(termSel.value, 10);
    const taxPct = parseFloat(taxInput.value);
    const insYr = parseFloat(insInput.value);
    const front = parseFloat(frontInput.value);
    const back = parseFloat(backInput.value);

    if (!(income > 0)) { alert("Please enter a gross annual income greater than zero."); return; }
    if (isNaN(debts) || debts < 0 || isNaN(down) || down < 0) { alert("Monthly debts and down payment cannot be negative."); return; }
    if (isNaN(rate) || rate < 0 || isNaN(taxPct) || taxPct < 0 || isNaN(insYr) || insYr < 0) { alert("Please enter valid rate, tax, and insurance values."); return; }
    if (isNaN(front) || front <= 0 || isNaN(back) || back <= 0) { alert("DTI caps must be greater than zero."); return; }

    const grossMonthly = income / 12;
    const capFront = grossMonthly * (front / 100);
    const capBack = grossMonthly * (back / 100) - debts;
    const maxPiti = Math.min(capFront, capBack);
    if (maxPiti <= 0) { alert("Your existing monthly debts already exceed the back-end DTI limit — pay some down first."); return; }

    const r = rate / 100 / 12;
    const n = term * 12;
    const f = r === 0 ? 1 / n : r / (1 - Math.pow(1 + r, -n));   // P&I factor per $1 of loan
    const t = taxPct / 100 / 12;
    const i = insYr / 12;

    let price = (maxPiti + down * f - i) / (f + t);
    if (price < down) { price = down; }                            // cash purchase edge case
    const loan = Math.max(price - down, 0);
    const pi = loan * f;
    const taxM = price * t;
    const piti = pi + taxM + i;
    const binding = capFront <= capBack ? `front-end ${front}%` : `back-end ${back}%`;

    resultDiv.innerHTML = `
      <div class="result-stat-grid">
        <div class="result-stat-card">
          <div class="result-stat-label">Max Home Price</div>
          <div class="result-stat-val" style="color: var(--accent-emerald);">$${money0(price)}</div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-label">Max Loan Amount</div>
          <div class="result-stat-val">$${money0(loan)}</div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-label">Est. Monthly PITI</div>
          <div class="result-stat-val">$${money(piti)}</div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-label">Principal & Interest</div>
          <div class="result-stat-val">$${money(pi)}</div>
        </div>
      </div>

      <div class="steps-wrapper" style="margin-top: 2rem;">
        <div class="steps-header"><h3 class="steps-title">📊 Affordability Breakdown</h3></div>
        <div class="step-card">
          <span class="step-num-badge">Step 1 — Lender spending caps</span>
          <div class="math-formula-box">housing ≤ ${front}% of gross monthly &nbsp;·&nbsp; all debts ≤ ${back}% of gross monthly</div>
          <p class="step-content">Gross monthly = $${money0(income)} ÷ 12 = <b>$${money(grossMonthly)}</b>. Front-end cap: ${front}% → <b>$${money(capFront)}</b>. Back-end cap: ${back}% − $${money(debts)} of existing debts → <b>$${money(capBack)}</b>. The binding limit is <b>${binding} at $${money(maxPiti)}</b> per month.</p>
        </div>
        <div class="step-card">
          <span class="step-num-badge">Step 2 — Solve for the price</span>
          <div class="math-formula-box">price = (PITI cap + down × f − insurance) ÷ (f + tax/12), &nbsp; f = r ÷ (1 − (1 + r)^−n)</div>
          <p class="step-content">f = ${money(r)} ÷ (1 − (1 + ${money(r)})^−${n}) = <b>${f.toFixed(6)}</b>. So price = ($${money(maxPiti)} + $${money0(down)} × ${f.toFixed(6)} − $${money(i)}) ÷ ${((f + t) / 1).toFixed(6)} = <b>$${money0(price)}</b>, with $${money0(down)} down → a <b>$${money0(loan)}</b> ${term}-year loan.</p>
        </div>
        <div class="step-card">
          <span class="step-num-badge">Step 3 — Monthly payment stack</span>
          <div class="math-formula-box">PITI = principal & interest + property tax + insurance</div>
          <p class="step-content">$${money(pi)} (P&amp;I) + $${money(taxM)} (tax: ${taxPct}% ÷ 12 of price) + $${money(i)} (insurance) = <b>$${money(piti)}</b> — inside your $${money(maxPiti)} cap. HOA dues, mortgage insurance (under20% down), and closing costs sit on top; pre-approve with a lender to lock the real number.</p>
        </div>
      </div>
    `;

    resultDiv.style.display = "block";
    if (ev && ev.type === "click") resultDiv.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  [incomeInput, debtsInput, downInput, rateInput, taxInput, insInput, frontInput, backInput]
    .forEach(el => el.addEventListener("input", calculate));
  termSel.addEventListener("change", calculate);
  container.querySelector("#btnCalcHa").addEventListener("click", calculate);
  container.querySelector("#btnResetHa").addEventListener("click", () => {
    incomeInput.value = "100000";
    debtsInput.value = "500";
    downInput.value = "50000";
    rateInput.value = "6.5";
    termSel.value = "30";
    taxInput.value = "1.1";
    insInput.value = "1200";
    frontInput.value = "28";
    backInput.value = "36";
    resultDiv.style.display = "none";
  });

  calculate();
}

/* ============================================================================
 * Amortization Schedule — full term table, extra payments, interest saved
 * ========================================================================== */
function renderAmortizationCalculator(container, calcDef) {
  container.innerHTML = `
    <div class="form-grid">
      <div class="form-group">
        <label class="form-label" for="amAmount">Loan Amount</label>
        <div class="input-with-addon">
          <span class="input-addon prefix">$</span>
          <input type="number" id="amAmount" class="form-control" value="250000" min="1" step="any">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label" for="amRate">Interest Rate <span class="form-label-hint">annual %</span></label>
        <input type="number" id="amRate" class="form-control" value="6.5" min="0" max="40" step="0.01">
      </div>
      <div class="form-group">
        <label class="form-label" for="amTerm">Term</label>
        <select id="amTerm" class="form-control">
          <option value="360" selected>30 years (360 payments)</option>
          <option value="240">20 years (240 payments)</option>
          <option value="180">15 years (180 payments)</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label" for="amExtra">Extra Monthly Payment <span class="form-label-hint">straight to principal</span></label>
        <div class="input-with-addon">
          <span class="input-addon prefix">$</span>
          <input type="number" id="amExtra" class="form-control" value="0" min="0" step="any">
        </div>
      </div>
    </div>

    <div class="calc-actions">
      <button type="button" id="btnCalcAm" class="btn btn-primary"><span>🧾 Build Schedule</span></button>
      <button type="button" id="btnResetAm" class="btn btn-secondary"><span>↺ Reset</span></button>
    </div>

    <div id="amResultContainer" class="results-section animate-fade-in" style="display: none; margin-top: 2rem;"></div>
  `;

  const amountInput = container.querySelector("#amAmount");
  const rateInput = container.querySelector("#amRate");
  const termSel = container.querySelector("#amTerm");
  const extraInput = container.querySelector("#amExtra");
  const resultDiv = container.querySelector("#amResultContainer");

  const money = (n) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const money0 = (n) => n.toLocaleString("en-US", { maximumFractionDigits: 0 });

  // Fixed-rate amortization engine — returns payment, payoff months, interest, every row.
  function amort(P, r, n, extra) {
    const payment = r === 0 ? P / n : (P * r) / (1 - Math.pow(1 + r, -n));
    let bal = P, months = 0, interest = 0;
    const rows = [];
    while (bal > 0.005 && months < n) {
      const mi = bal * r;
      let princ = payment + extra - mi;
      if (princ > bal) princ = bal;
      if (princ <= 0) break;                     // payment cannot cover interest
      bal -= princ;
      months++;
      interest += mi;
      rows.push({ i: months, pay: princ + mi, princ, mi, bal });
    }
    return { payment, months, interest, rows };
  }

  function calculate(ev) {
    const P = parseFloat(amountInput.value);
    const annual = parseFloat(rateInput.value);
    const n = parseInt(termSel.value, 10);
    const extra = parseFloat(extraInput.value);

    if (isNaN(P) || P <= 0) { alert("Please enter a loan amount greater than zero."); return; }
    if (isNaN(annual) || annual < 0 || annual > 40) { alert("Interest rate must be between 0% and 40%."); return; }
    if (isNaN(extra) || extra < 0) { alert("Extra monthly payment cannot be negative."); return; }

    const r = annual / 100 / 12;
    const plan = amort(P, r, n, extra);
    if (!plan.months) { alert("That payment cannot cover the interest — lower the rate or raise the payment."); return; }

    const baselineInterest = plan.payment * n - P;       // no extra → exactly n payments
    const saved = baselineInterest - plan.interest;
    const monthsSaved = n - plan.months;
    const payoffDate = new Date();
    payoffDate.setMonth(payoffDate.getMonth() + plan.months);
    const dateStr = payoffDate.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    const first = plan.rows[0];
    const hundred = amort(P, r, n, extra + 100);          // illustration for the steps

    const rowHtml = plan.rows.map(rw => `
      <tr style="border-bottom: 1px solid var(--border-color); font-size: 0.85rem;">
        <td style="padding: 0.5rem 0.75rem; color: var(--text-muted);">${rw.i}</td>
        <td style="padding: 0.5rem 0.75rem; text-align: right;">$${money(rw.pay)}</td>
        <td style="padding: 0.5rem 0.75rem; text-align: right; color: var(--accent-emerald);">$${money(rw.princ)}</td>
        <td style="padding: 0.5rem 0.75rem; text-align: right; color: var(--accent-orange);">$${money(rw.mi)}</td>
        <td style="padding: 0.5rem 0.75rem; text-align: right; font-weight: 600;">$${money(rw.bal)}</td>
      </tr>`).join("");

    resultDiv.innerHTML = `
      <div class="result-stat-grid">
        <div class="result-stat-card">
          <div class="result-stat-label">Monthly Payment (P&I)</div>
          <div class="result-stat-val" style="color: var(--accent-emerald);">$${money(plan.payment)}</div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-label">Total Interest</div>
          <div class="result-stat-val">$${money(plan.interest)}</div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-label">Total Paid</div>
          <div class="result-stat-val">$${money(plan.interest + P)}</div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-label">Time to Payoff</div>
          <div class="result-stat-val">${plan.months} months</div>
        </div>
      </div>

      <p style="margin-top: 1rem; font-size: 0.95rem;">
        Payoff around <b>${dateStr}</b>${extra > 0
          ? ` with <b>$${money(extra)}</b> extra each month: <b>−${monthsSaved} months</b> and <b>−$${money(saved)}</b> of interest versus minimum schedule.`
          : `. Add an extra payment to see how much principal it deletes — for example $100/month drops the loan by <b>${n - hundred.months} months</b> and saves <b>$${money(baselineInterest - hundred.interest)}</b>.`}
      </p>

      <div class="steps-wrapper" style="margin-top: 2rem;">
        <div class="steps-header"><h3 class="steps-title">📊 Amortization Breakdown</h3></div>
        <div class="step-card">
          <span class="step-num-badge">Step1 — The payment formula</span>
          <div class="math-formula-box">M = P × r ÷ (1 − (1 + r)<sup>−n</sup>)</div>
          <p class="step-content">r = ${annual}% ÷ 12 = <b>${r.toFixed(6)}</b> per month, n = ${n} payments. M = $${money0(P)} × ${r.toFixed(6)} ÷ (1 − (1 + ${r.toFixed(6)})<sup>−${n}</sup>) = <b>$${money(plan.payment)}</b> every month${extra > 0 ? `, plus $${money(extra)} extra = $${money(plan.payment + extra)} out the door` : ""}.</p>
        </div>
        <div class="step-card">
          <span class="step-num-badge">Step2 — Why month one hurts</span>
          <div class="math-formula-box">interest = balance × r &nbsp;·&nbsp; principal = payment − interest</div>
          <p class="step-content">Your first payment splits <b>$${money(first.mi)}</b> to interest and only <b>$${money(first.princ)}</b> to principal — ${(((first.mi) / (first.pay)) * 100).toFixed(1)}% of the check vanishes on day one, leaving a balance of <b>$${money(first.bal)}</b>. Interest is charged on the whole balance, so early years are interest-heavy and late years principal-heavy — that flip is the whole shape of the schedule below.</p>
        </div>
        <div class="step-card">
          <span class="step-num-badge">Step3 — Extra payments & the full table</span>
          <div class="math-formula-box">every extra dollar hits principal once, and kills every future interest it would have spawned</div>
          <p class="step-content">${extra > 0
            ? `You are paying $${money(plan.payment + extra)} monthly across ${plan.months} months instead of ${n} — total interest falls from $${money(baselineInterest)} to $${money(plan.interest)}.`
            : `Try $50–$200 extra monthly: at +$100 the payoff lands at ${hundred.months} months instead of ${n}, saving $${money(baselineInterest - hundred.interest)}.`} The table lists all ${plan.rows.length} payments: each row shows how much of that month's check buys the loan back versus renting the money, until the balance hits $0.00.</p>
        </div>
      </div>

      <div style="margin-top: 2rem;">
        <h4 style="font-family: var(--font-heading); font-size: 1.1rem; margin-bottom: 0.75rem;">Full Payment Schedule (${plan.rows.length} payments)</h4>
        <div style="max-height: 420px; overflow-y: auto; border: 1px solid var(--border-color); border-radius: 0.75rem;">
          <table style="width: 100%; border-collapse: collapse; text-align: left;">
            <thead>
              <tr style="background: var(--bg-subtle); border-bottom: 1.5px solid var(--border-color); position: sticky; top: 0;">
                <th style="padding: 0.7rem 0.75rem; font-size: 0.8rem; color: var(--text-muted);">#</th>
                <th style="padding: 0.7rem 0.75rem; font-size: 0.8rem; color: var(--text-muted); text-align: right;">Payment</th>
                <th style="padding: 0.7rem 0.75rem; font-size: 0.8rem; color: var(--text-muted); text-align: right;">Principal</th>
                <th style="padding: 0.7rem 0.75rem; font-size: 0.8rem; color: var(--text-muted); text-align: right;">Interest</th>
                <th style="padding: 0.7rem 0.75rem; font-size: 0.8rem; color: var(--text-muted); text-align: right;">Balance</th>
              </tr>
            </thead>
            <tbody>${rowHtml}</tbody>
          </table>
        </div>
      </div>
    `;

    resultDiv.style.display = "block";
    if (ev && ev.type === "click") resultDiv.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  [amountInput, rateInput, extraInput].forEach(el => el.addEventListener("input", calculate));
  termSel.addEventListener("change", calculate);
  container.querySelector("#btnCalcAm").addEventListener("click", calculate);
  container.querySelector("#btnResetAm").addEventListener("click", () => {
    amountInput.value = "250000";
    rateInput.value = "6.5";
    termSel.value = "360";
    extraInput.value = "0";
    resultDiv.style.display = "none";
  });

  calculate();
}
