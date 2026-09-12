/**
 * ============================================================================
 * Financial Calculators: Debt & Interest Solvers
 * Calculators:
 * 1. Debt-to-Income (DTI) Ratio Calculator
 * 2. CD (Certificate of Deposit) / Fixed Deposit (FDR) Calculator
 * 3. Early Loan Payoff / Extra Payment Calculator
 * 4. APR to APY Converter
 * ============================================================================
 */

/* ==========================================================================
   1. Debt-to-Income (DTI) Ratio Calculator
   ========================================================================== */
function renderDtiCalculator(container, calcDef) {
  container.innerHTML = `
    <div class="form-grid">
      <div class="calc-section-header" style="grid-column: 1 / -1; margin-bottom: 0.5rem;">
        <h4 style="margin: 0; font-size: 1.05rem; color: var(--color-primary);">💵 Gross Monthly Income</h4>
        <p style="margin: 0.25rem 0 0; font-size: 0.85rem; color: var(--color-text-muted);">Pre-tax monthly earnings before payroll taxes and deductions.</p>
      </div>

      <div class="form-group">
        <label class="form-label" for="dtiSalary">
          Primary Salary / Wages (Monthly)
          <span class="form-label-hint">Gross pre-tax</span>
        </label>
        <div class="input-with-addon">
          <span class="input-addon">$</span>
          <input type="number" id="dtiSalary" class="form-control" value="6500" min="0" step="100">
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="dtiOtherIncome">
          Other Monthly Income
          <span class="form-label-hint">Bonuses, rental, dividends</span>
        </label>
        <div class="input-with-addon">
          <span class="input-addon">$</span>
          <input type="number" id="dtiOtherIncome" class="form-control" value="500" min="0" step="50">
        </div>
      </div>

      <div class="calc-section-header" style="grid-column: 1 / -1; margin-top: 1rem; margin-bottom: 0.5rem;">
        <h4 style="margin: 0; font-size: 1.05rem; color: var(--color-primary);">🏠 Monthly Housing Debt (Front-End)</h4>
        <p style="margin: 0.25rem 0 0; font-size: 0.85rem; color: var(--color-text-muted);">Mortgage principal, interest, taxes, insurance, and rent.</p>
      </div>

      <div class="form-group">
        <label class="form-label" for="dtiMortgageRent">
          Mortgage or Rent Payment
          <span class="form-label-hint">Principal & Interest</span>
        </label>
        <div class="input-with-addon">
          <span class="input-addon">$</span>
          <input type="number" id="dtiMortgageRent" class="form-control" value="1600" min="0" step="50">
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="dtiPropertyEscrow">
          Property Tax, Insurance & HOA
          <span class="form-label-hint">Monthly escrow dues</span>
        </label>
        <div class="input-with-addon">
          <span class="input-addon">$</span>
          <input type="number" id="dtiPropertyEscrow" class="form-control" value="350" min="0" step="25">
        </div>
      </div>

      <div class="calc-section-header" style="grid-column: 1 / -1; margin-top: 1rem; margin-bottom: 0.5rem;">
        <h4 style="margin: 0; font-size: 1.05rem; color: var(--color-primary);">💳 Non-Housing Monthly Debt (Back-End)</h4>
        <p style="margin: 0.25rem 0 0; font-size: 0.85rem; color: var(--color-text-muted);">Recurring minimum payments on lines of credit and consumer debt.</p>
      </div>

      <div class="form-group">
        <label class="form-label" for="dtiAutoLoan">
          Auto Loans & Leases
          <span class="form-label-hint">All vehicle payments</span>
        </label>
        <div class="input-with-addon">
          <span class="input-addon">$</span>
          <input type="number" id="dtiAutoLoan" class="form-control" value="420" min="0" step="20">
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="dtiStudentLoan">
          Student Loan Payments
          <span class="form-label-hint">Monthly minimum</span>
        </label>
        <div class="input-with-addon">
          <span class="input-addon">$</span>
          <input type="number" id="dtiStudentLoan" class="form-control" value="250" min="0" step="25">
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="dtiCreditCards">
          Credit Card Minimums
          <span class="form-label-hint">Minimum required due</span>
        </label>
        <div class="input-with-addon">
          <span class="input-addon">$</span>
          <input type="number" id="dtiCreditCards" class="form-control" value="180" min="0" step="10">
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="dtiOtherDebt">
          Personal Loans & Other Debt
          <span class="form-label-hint">Alimony, child support</span>
        </label>
        <div class="input-with-addon">
          <span class="input-addon">$</span>
          <input type="number" id="dtiOtherDebt" class="form-control" value="0" min="0" step="25">
        </div>
      </div>
    </div>

    <div class="calc-actions" style="margin-top: 1.5rem; display: flex; gap: 0.75rem;">
      <button type="button" id="dtiCalculateBtn" class="btn btn-primary" style="flex: 1;">Calculate DTI Ratios</button>
      <button type="button" id="dtiResetBtn" class="btn btn-secondary">Reset</button>
    </div>

    <div id="dtiResults" class="result-card" style="margin-top: 1.75rem; display: none;"></div>
  `;

  const salaryInput = container.querySelector("#dtiSalary");
  const otherIncomeInput = container.querySelector("#dtiOtherIncome");
  const mortgageRentInput = container.querySelector("#dtiMortgageRent");
  const propertyEscrowInput = container.querySelector("#dtiPropertyEscrow");
  const autoLoanInput = container.querySelector("#dtiAutoLoan");
  const studentLoanInput = container.querySelector("#dtiStudentLoan");
  const creditCardsInput = container.querySelector("#dtiCreditCards");
  const otherDebtInput = container.querySelector("#dtiOtherDebt");

  const calcBtn = container.querySelector("#dtiCalculateBtn");
  const resetBtn = container.querySelector("#dtiResetBtn");
  const resultsDiv = container.querySelector("#dtiResults");

  function calculateDTI() {
    const salary = parseFloat(salaryInput.value) || 0;
    const otherIncome = parseFloat(otherIncomeInput.value) || 0;
    const totalIncome = salary + otherIncome;

    const mortgageRent = parseFloat(mortgageRentInput.value) || 0;
    const propertyEscrow = parseFloat(propertyEscrowInput.value) || 0;
    const housingDebt = mortgageRent + propertyEscrow;

    const autoLoan = parseFloat(autoLoanInput.value) || 0;
    const studentLoan = parseFloat(studentLoanInput.value) || 0;
    const creditCards = parseFloat(creditCardsInput.value) || 0;
    const otherDebt = parseFloat(otherDebtInput.value) || 0;
    const nonHousingDebt = autoLoan + studentLoan + creditCards + otherDebt;

    const totalDebt = housingDebt + nonHousingDebt;

    if (totalIncome <= 0) {
      resultsDiv.style.display = "block";
      resultsDiv.innerHTML = `
        <div class="result-alert warning">
          <strong>Please enter a valid monthly income.</strong> Gross monthly income must be greater than $0 to calculate DTI ratios.
        </div>
      `;
      return;
    }

    const frontEndDti = (housingDebt / totalIncome) * 100;
    const backEndDti = (totalDebt / totalIncome) * 100;

    // Remaining capacity under benchmark 36% and 43%
    const maxDebt36 = totalIncome * 0.36;
    const maxDebt43 = totalIncome * 0.43;
    const headroom36 = maxDebt36 - totalDebt;
    const headroom43 = maxDebt43 - totalDebt;

    // Evaluate Risk Status
    let statusClass = "success";
    let statusText = "Excellent (Ideal Range)";
    let statusBadge = "badge-success";
    let statusDescription = "Lenders consider this an optimal risk profile with high borrowing approval confidence.";

    if (backEndDti > 50) {
      statusClass = "danger";
      statusText = "Critical (High Risk)";
      statusBadge = "badge-danger";
      statusDescription = "Most major lenders will decline mortgage financing unless strong compensating assets exist.";
    } else if (backEndDti > 43) {
      statusClass = "warning";
      statusText = "Elevated (Above QM Limit)";
      statusBadge = "badge-warning";
      statusDescription = "Exceeds standard Qualified Mortgage (QM) guidelines. Requires FHA, VA, or non-QM portfolio financing.";
    } else if (backEndDti > 36) {
      statusClass = "info";
      statusText = "Moderate (Acceptable)";
      statusBadge = "badge-info";
      statusDescription = "Meets standard mortgage loan limits, though lenders review reserve cash buffers carefully.";
    }

    // Chart bar proportions
    const housingPct = Math.min(100, Math.max(0, (housingDebt / totalIncome) * 100));
    const nonHousingPct = Math.min(100 - housingPct, Math.max(0, (nonHousingDebt / totalIncome) * 100));
    const disposablePct = Math.max(0, 100 - housingPct - nonHousingPct);

    resultsDiv.style.display = "block";
    resultsDiv.innerHTML = `
      <div class="result-header" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.25rem;">
        <div>
          <h3 class="result-title" style="margin: 0; font-size: 1.35rem;">DTI Analysis Results</h3>
          <span style="font-size: 0.88rem; color: var(--color-text-muted);">Based on $${totalIncome.toLocaleString('en-US', {maximumFractionDigits: 0})}/mo gross income</span>
        </div>
        <span class="badge ${statusBadge}" style="font-size: 0.9rem; padding: 0.4rem 0.8rem; border-radius: 9999px;">${statusText}</span>
      </div>

      <div class="result-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
        <div class="stat-card highlight" style="padding: 1rem; border-radius: 10px; background: var(--color-bg-secondary); border: 1px solid var(--color-border);">
          <div class="stat-label" style="font-size: 0.85rem; color: var(--color-text-muted);">Back-End DTI (Total)</div>
          <div class="stat-value" style="font-size: 1.9rem; font-weight: 700; color: ${backEndDti <= 36 ? 'var(--color-success, #10b981)' : (backEndDti <= 43 ? 'var(--color-warning, #f59e0b)' : 'var(--color-danger, #ef4444)')};">
            ${backEndDti.toFixed(1)}%
          </div>
          <div class="stat-subtext" style="font-size: 0.8rem; margin-top: 0.25rem;">Target: ≤ 36% ideal (max 43%)</div>
        </div>

        <div class="stat-card" style="padding: 1rem; border-radius: 10px; background: var(--color-bg-secondary); border: 1px solid var(--color-border);">
          <div class="stat-label" style="font-size: 0.85rem; color: var(--color-text-muted);">Front-End DTI (Housing)</div>
          <div class="stat-value" style="font-size: 1.9rem; font-weight: 700; color: ${frontEndDti <= 28 ? 'var(--color-success, #10b981)' : 'var(--color-primary);'}">
            ${frontEndDti.toFixed(1)}%
          </div>
          <div class="stat-subtext" style="font-size: 0.8rem; margin-top: 0.25rem;">Target: ≤ 28% for conventional</div>
        </div>

        <div class="stat-card" style="padding: 1rem; border-radius: 10px; background: var(--color-bg-secondary); border: 1px solid var(--color-border);">
          <div class="stat-label" style="font-size: 0.85rem; color: var(--color-text-muted);">Total Monthly Debt</div>
          <div class="stat-value" style="font-size: 1.5rem; font-weight: 700; color: var(--color-text);">
            $${totalDebt.toLocaleString('en-US', {maximumFractionDigits: 0})}
          </div>
          <div class="stat-subtext" style="font-size: 0.8rem; margin-top: 0.25rem;">Housing: $${housingDebt.toLocaleString()} | Other: $${nonHousingDebt.toLocaleString()}</div>
        </div>

        <div class="stat-card" style="padding: 1rem; border-radius: 10px; background: var(--color-bg-secondary); border: 1px solid var(--color-border);">
          <div class="stat-label" style="font-size: 0.85rem; color: var(--color-text-muted);">Remaining Cashflow</div>
          <div class="stat-value" style="font-size: 1.5rem; font-weight: 700; color: var(--color-text);">
            $${Math.max(0, totalIncome - totalDebt).toLocaleString('en-US', {maximumFractionDigits: 0})}
          </div>
          <div class="stat-subtext" style="font-size: 0.8rem; margin-top: 0.25rem;">${disposablePct.toFixed(1)}% of gross monthly income</div>
        </div>
      </div>

      <div style="margin-bottom: 1.5rem;">
        <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.35rem;">
          <span><strong>Income Allocation Breakdown</strong></span>
          <span>100% Gross</span>
        </div>
        <div style="height: 18px; width: 100%; border-radius: 9px; overflow: hidden; display: flex; background: var(--color-border);">
          <div style="width: ${housingPct}%; background: #3b82f6;" title="Housing: ${housingPct.toFixed(1)}%"></div>
          <div style="width: ${nonHousingPct}%; background: #f59e0b;" title="Other Debt: ${nonHousingPct.toFixed(1)}%"></div>
          <div style="width: ${disposablePct}%; background: #10b981;" title="Disposable Income: ${disposablePct.toFixed(1)}%"></div>
        </div>
        <div style="display: flex; flex-wrap: wrap; gap: 1rem; font-size: 0.8rem; margin-top: 0.4rem; color: var(--color-text-muted);">
          <span><span style="display: inline-block; width: 10px; height: 10px; background: #3b82f6; border-radius: 2px;"></span> Housing ($${housingDebt.toLocaleString()})</span>
          <span><span style="display: inline-block; width: 10px; height: 10px; background: #f59e0b; border-radius: 2px;"></span> Non-Housing Debt ($${nonHousingDebt.toLocaleString()})</span>
          <span><span style="display: inline-block; width: 10px; height: 10px; background: #10b981; border-radius: 2px;"></span> Remaining Income ($${Math.max(0, totalIncome - totalDebt).toLocaleString()})</span>
        </div>
      </div>

      <div class="result-details" style="background: var(--color-bg-secondary); padding: 1.25rem; border-radius: 10px; margin-bottom: 1.5rem;">
        <h4 style="margin: 0 0 0.75rem; font-size: 1rem;">🏛️ Lender Mortgage Qualification Matrix</h4>
        <div style="overflow-x: auto;">
          <table class="schedule-table" style="width: 100%; font-size: 0.85rem; border-collapse: collapse;">
            <thead>
              <tr style="border-bottom: 2px solid var(--color-border); text-align: left;">
                <th style="padding: 0.5rem;">Loan Program</th>
                <th style="padding: 0.5rem;">Typical Max Front-End</th>
                <th style="padding: 0.5rem;">Typical Max Back-End</th>
                <th style="padding: 0.5rem;">Qualification Status</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid var(--color-border);">
                <td style="padding: 0.5rem;"><strong>Conventional Loan</strong></td>
                <td style="padding: 0.5rem;">28%</td>
                <td style="padding: 0.5rem;">36% – 43%</td>
                <td style="padding: 0.5rem;">
                  <span style="color: ${backEndDti <= 43 ? '#10b981' : '#ef4444'}; font-weight: 600;">
                    ${backEndDti <= 36 ? '✓ Highly Likely' : (backEndDti <= 43 ? '⚡ Acceptable (DU Approval)' : '✗ Unlikely')}
                  </span>
                </td>
              </tr>
              <tr style="border-bottom: 1px solid var(--color-border);">
                <td style="padding: 0.5rem;"><strong>FHA Loan</strong></td>
                <td style="padding: 0.5rem;">31%</td>
                <td style="padding: 0.5rem;">43% – 50%</td>
                <td style="padding: 0.5rem;">
                  <span style="color: ${backEndDti <= 50 ? '#10b981' : '#ef4444'}; font-weight: 600;">
                    ${backEndDti <= 43 ? '✓ Highly Likely' : (backEndDti <= 50 ? '⚡ Eligible with Compensating Factors' : '✗ Unlikely')}
                  </span>
                </td>
              </tr>
              <tr style="border-bottom: 1px solid var(--color-border);">
                <td style="padding: 0.5rem;"><strong>VA Loan (Military)</strong></td>
                <td style="padding: 0.5rem;">No set limit</td>
                <td style="padding: 0.5rem;">41% benchmark</td>
                <td style="padding: 0.5rem;">
                  <span style="color: ${backEndDti <= 45 ? '#10b981' : '#f59e0b'}; font-weight: 600;">
                    ${backEndDti <= 41 ? '✓ Benchmark Met' : '⚡ Approved with Residual Income'}
                  </span>
                </td>
              </tr>
              <tr>
                <td style="padding: 0.5rem;"><strong>USDA Rural Housing</strong></td>
                <td style="padding: 0.5rem;">29%</td>
                <td style="padding: 0.5rem;">41%</td>
                <td style="padding: 0.5rem;">
                  <span style="color: ${backEndDti <= 41 && frontEndDti <= 29 ? '#10b981' : '#ef4444'}; font-weight: 600;">
                    ${backEndDti <= 41 && frontEndDti <= 29 ? '✓ Standard Approval' : (backEndDti <= 44 ? '⚡ Manual Underwriting' : '✗ Exceeds Guidelines')}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="result-formula" style="font-size: 0.85rem; color: var(--color-text-muted); border-top: 1px solid var(--color-border); padding-top: 1rem;">
        <strong>Mathematical Formulas Used:</strong><br>
        • Front-End Ratio = ($${housingDebt.toLocaleString()} / $${totalIncome.toLocaleString()}) × 100% = <strong>${frontEndDti.toFixed(2)}%</strong><br>
        • Back-End Ratio = ($${totalDebt.toLocaleString()} / $${totalIncome.toLocaleString()}) × 100% = <strong>${backEndDti.toFixed(2)}%</strong><br>
        • Borrowing Buffer to 36% Rule = $${maxDebt36.toFixed(0)} - $${totalDebt.toFixed(0)} = <strong>${headroom36 >= 0 ? '+' : ''}$${headroom36.toLocaleString('en-US', {maximumFractionDigits: 0})}/mo</strong>
      </div>
    `;
  }

  calcBtn.addEventListener("click", calculateDTI);
  [salaryInput, otherIncomeInput, mortgageRentInput, propertyEscrowInput, autoLoanInput, studentLoanInput, creditCardsInput, otherDebtInput].forEach(inp => {
    inp.addEventListener("input", calculateDTI);
  });

  resetBtn.addEventListener("click", () => {
    salaryInput.value = "6500";
    otherIncomeInput.value = "500";
    mortgageRentInput.value = "1600";
    propertyEscrowInput.value = "350";
    autoLoanInput.value = "420";
    studentLoanInput.value = "250";
    creditCardsInput.value = "180";
    otherDebtInput.value = "0";
    calculateDTI();
  });

  // Initial calculation
  calculateDTI();
}

/* ==========================================================================
   2. CD (Certificate of Deposit) / Fixed Deposit (FDR) Calculator
   ========================================================================== */
function renderCdCalculator(container, calcDef) {
  container.innerHTML = `
    <div class="form-grid">
      <div class="form-group">
        <label class="form-label" for="cdPrincipal">
          Initial Deposit Amount
          <span class="form-label-hint">Opening deposit</span>
        </label>
        <div class="input-with-addon">
          <span class="input-addon">$</span>
          <input type="number" id="cdPrincipal" class="form-control" value="10000" min="100" step="500">
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="cdRate">
          Interest Rate (%)
          <span class="form-label-hint">Annual rate</span>
        </label>
        <div class="input-with-addon">
          <input type="number" id="cdRate" class="form-control" value="5.00" min="0.01" max="25" step="0.05">
          <span class="input-addon suffix">%</span>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="cdRateType">
          Rate Quoted As
          <span class="form-label-hint">APR vs APY</span>
        </label>
        <select id="cdRateType" class="form-control">
          <option value="apy" selected>APY (Annual Percentage Yield)</option>
          <option value="apr">Nominal APR (Annual Percentage Rate)</option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label" for="cdCompoundFreq">
          Compounding Frequency
          <span class="form-label-hint">Accrual interval</span>
        </label>
        <select id="cdCompoundFreq" class="form-control">
          <option value="365" selected>Daily (365 days / yr)</option>
          <option value="12">Monthly (12 times / yr)</option>
          <option value="4">Quarterly (4 times / yr)</option>
          <option value="2">Semi-Annually (2 times / yr)</option>
          <option value="1">Annually (1 time / yr)</option>
        </select>
      </div>

      <div class="form-group" style="grid-column: 1 / -1;">
        <label class="form-label" for="cdTermMonths">
          CD Term Length
          <span class="form-label-hint">Duration until maturity</span>
        </label>
        <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.5rem;">
          <input type="number" id="cdTermMonths" class="form-control" value="12" min="1" max="360" step="1" style="max-width: 140px;">
          <select id="cdTermUnit" class="form-control" style="max-width: 130px;">
            <option value="months" selected>Months</option>
            <option value="years">Years</option>
          </select>
        </div>
        <div class="btn-group" style="display: flex; flex-wrap: wrap; gap: 0.35rem;">
          <button type="button" class="btn btn-sm btn-outline cd-preset-btn" data-months="6">6 Months</button>
          <button type="button" class="btn btn-sm btn-outline cd-preset-btn active" data-months="12">1 Year</button>
          <button type="button" class="btn btn-sm btn-outline cd-preset-btn" data-months="18">18 Months</button>
          <button type="button" class="btn btn-sm btn-outline cd-preset-btn" data-months="24">2 Years</button>
          <button type="button" class="btn btn-sm btn-outline cd-preset-btn" data-months="36">3 Years</button>
          <button type="button" class="btn btn-sm btn-outline cd-preset-btn" data-months="60">5 Years</button>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="cdEarlyPenalty">
          Early Withdrawal Penalty
          <span class="form-label-hint">In case of early redemption</span>
        </label>
        <select id="cdEarlyPenalty" class="form-control">
          <option value="0">None (No penalty / No-penalty CD)</option>
          <option value="1">1 Month Interest</option>
          <option value="3" selected>3 Months Interest (Standard < 1 Yr)</option>
          <option value="6">6 Months Interest (Standard 1–3 Yrs)</option>
          <option value="12">12 Months Interest (Standard 4–5 Yrs)</option>
        </select>
      </div>
    </div>

    <div class="calc-actions" style="margin-top: 1.5rem; display: flex; gap: 0.75rem;">
      <button type="button" id="cdCalculateBtn" class="btn btn-primary" style="flex: 1;">Calculate CD Return</button>
      <button type="button" id="cdResetBtn" class="btn btn-secondary">Reset</button>
    </div>

    <div id="cdResults" class="result-card" style="margin-top: 1.75rem; display: none;"></div>
  `;

  const principalInput = container.querySelector("#cdPrincipal");
  const rateInput = container.querySelector("#cdRate");
  const rateTypeSelect = container.querySelector("#cdRateType");
  const compoundFreqSelect = container.querySelector("#cdCompoundFreq");
  const termMonthsInput = container.querySelector("#cdTermMonths");
  const termUnitSelect = container.querySelector("#cdTermUnit");
  const earlyPenaltySelect = container.querySelector("#cdEarlyPenalty");

  const calcBtn = container.querySelector("#cdCalculateBtn");
  const resetBtn = container.querySelector("#cdResetBtn");
  const resultsDiv = container.querySelector("#cdResults");
  const presetBtns = container.querySelectorAll(".cd-preset-btn");

  presetBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      presetBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const months = parseInt(btn.getAttribute("data-months"), 10);
      termMonthsInput.value = months;
      termUnitSelect.value = "months";
      calculateCD();
    });
  });

  function calculateCD() {
    const P = parseFloat(principalInput.value) || 0;
    const ratePercent = parseFloat(rateInput.value) || 0;
    const r = ratePercent / 100;
    const rateType = rateTypeSelect.value;
    const n = parseInt(compoundFreqSelect.value, 10) || 365;
    const termRaw = parseFloat(termMonthsInput.value) || 0;
    const termUnit = termUnitSelect.value;
    const termMonths = termUnit === "years" ? termRaw * 12 : termRaw;
    const t = termMonths / 12; // Time in years
    const penaltyMonths = parseInt(earlyPenaltySelect.value, 10) || 0;

    if (P <= 0 || ratePercent <= 0 || termMonths <= 0) {
      resultsDiv.style.display = "block";
      resultsDiv.innerHTML = `
        <div class="result-alert warning">
          Please enter valid positive values for deposit amount, interest rate, and term length.
        </div>
      `;
      return;
    }

    let maturityValue = 0;
    let effectiveApy = 0;
    let nominalApr = 0;

    if (rateType === "apy") {
      effectiveApy = ratePercent;
      // APY formula: A = P * (1 + APY)^t
      maturityValue = P * Math.pow(1 + r, t);
      // Equivalent nominal APR: APR = n * ((1 + APY)^(1/n) - 1)
      nominalApr = (n * (Math.pow(1 + r, 1 / n) - 1)) * 100;
    } else {
      nominalApr = ratePercent;
      // Compound APR formula: A = P * (1 + r/n)^(n*t)
      maturityValue = P * Math.pow(1 + r / n, n * t);
      // Effective APY: (1 + r/n)^n - 1
      effectiveApy = (Math.pow(1 + r / n, n) - 1) * 100;
    }

    const totalInterest = maturityValue - P;
    const monthlyRateFraction = totalInterest / termMonths;
    const penaltyAmount = monthlyRateFraction * penaltyMonths;
    const netEarlyProceeds = Math.max(P, maturityValue - penaltyAmount);

    // Build timeline schedule
    let scheduleRows = "";
    const intervalMonths = termMonths > 24 ? 12 : (termMonths > 12 ? 6 : 1);
    let cumulativeInterest = 0;

    for (let m = intervalMonths; m <= termMonths; m += intervalMonths) {
      const timeInYrs = m / 12;
      let bal = 0;
      if (rateType === "apy") {
        bal = P * Math.pow(1 + r, timeInYrs);
      } else {
        bal = P * Math.pow(1 + r / n, n * timeInYrs);
      }
      const interestEarned = bal - P;
      const periodInterest = interestEarned - cumulativeInterest;
      cumulativeInterest = interestEarned;

      scheduleRows += `
        <tr style="border-bottom: 1px solid var(--color-border);">
          <td style="padding: 0.5rem;">Month ${m} ${m % 12 === 0 ? `(Year ${m/12})` : ''}</td>
          <td style="padding: 0.5rem;">$${P.toLocaleString('en-US', {maximumFractionDigits: 0})}</td>
          <td style="padding: 0.5rem; color: var(--color-success, #10b981);">+$${periodInterest.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
          <td style="padding: 0.5rem; font-weight: 600;">$${bal.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
        </tr>
      `;
    }

    resultsDiv.style.display = "block";
    resultsDiv.innerHTML = `
      <div class="result-header" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.25rem;">
        <div>
          <h3 class="result-title" style="margin: 0; font-size: 1.35rem;">CD Maturity Summary</h3>
          <span style="font-size: 0.88rem; color: var(--color-text-muted);">${termMonths} Months (${t.toFixed(2)} Years) Term</span>
        </div>
        <span class="badge badge-success" style="font-size: 0.9rem; padding: 0.4rem 0.8rem; border-radius: 9999px;">
          ${effectiveApy.toFixed(2)}% APY Yield
        </span>
      </div>

      <div class="result-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
        <div class="stat-card highlight" style="padding: 1rem; border-radius: 10px; background: var(--color-bg-secondary); border: 1px solid var(--color-border);">
          <div class="stat-label" style="font-size: 0.85rem; color: var(--color-text-muted);">Balance at Maturity</div>
          <div class="stat-value" style="font-size: 1.9rem; font-weight: 700; color: var(--color-primary);">
            $${maturityValue.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
          </div>
          <div class="stat-subtext" style="font-size: 0.8rem; margin-top: 0.25rem;">Total guaranteed payout</div>
        </div>

        <div class="stat-card" style="padding: 1rem; border-radius: 10px; background: var(--color-bg-secondary); border: 1px solid var(--color-border);">
          <div class="stat-label" style="font-size: 0.85rem; color: var(--color-text-muted);">Total Interest Earned</div>
          <div class="stat-value" style="font-size: 1.9rem; font-weight: 700; color: var(--color-success, #10b981);">
            +$${totalInterest.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
          </div>
          <div class="stat-subtext" style="font-size: 0.8rem; margin-top: 0.25rem;">+${((totalInterest / P) * 100).toFixed(2)}% total return on principal</div>
        </div>

        <div class="stat-card" style="padding: 1rem; border-radius: 10px; background: var(--color-bg-secondary); border: 1px solid var(--color-border);">
          <div class="stat-label" style="font-size: 0.85rem; color: var(--color-text-muted);">Equivalent Rates</div>
          <div class="stat-value" style="font-size: 1.35rem; font-weight: 700; color: var(--color-text);">
            ${effectiveApy.toFixed(2)}% APY
          </div>
          <div class="stat-subtext" style="font-size: 0.8rem; margin-top: 0.25rem;">Nominal APR: ${nominalApr.toFixed(2)}%</div>
        </div>

        <div class="stat-card" style="padding: 1rem; border-radius: 10px; background: var(--color-bg-secondary); border: 1px solid var(--color-border);">
          <div class="stat-label" style="font-size: 0.85rem; color: var(--color-text-muted);">Average Monthly Earnings</div>
          <div class="stat-value" style="font-size: 1.35rem; font-weight: 700; color: var(--color-text);">
            $${(totalInterest / termMonths).toFixed(2)}/mo
          </div>
          <div class="stat-subtext" style="font-size: 0.8rem; margin-top: 0.25rem;">≈ $${(totalInterest / (termMonths * 30.417)).toFixed(2)} per day</div>
        </div>
      </div>

      ${penaltyMonths > 0 ? `
        <div style="background: var(--color-bg-secondary); border-left: 4px solid var(--color-warning, #f59e0b); padding: 1rem; border-radius: 6px; margin-bottom: 1.5rem; font-size: 0.88rem;">
          <strong>⚠️ Early Redemption Impact (${penaltyMonths} Months Interest Penalty):</strong><br>
          If withdrawn prior to maturity, early withdrawal penalty is estimated at <strong>$${penaltyAmount.toFixed(2)}</strong>. 
          Estimated net payout: <strong>$${netEarlyProceeds.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</strong>.
        </div>
      ` : ''}

      <div class="result-details" style="background: var(--color-bg-secondary); padding: 1.25rem; border-radius: 10px; margin-bottom: 1.5rem;">
        <h4 style="margin: 0 0 0.75rem; font-size: 1rem;">📅 Compounded CD Growth Schedule</h4>
        <div style="overflow-x: auto; max-height: 280px;">
          <table class="schedule-table" style="width: 100%; font-size: 0.85rem; border-collapse: collapse;">
            <thead>
              <tr style="border-bottom: 2px solid var(--color-border); text-align: left; position: sticky; top: 0; background: var(--color-bg-secondary);">
                <th style="padding: 0.5rem;">Milestone</th>
                <th style="padding: 0.5rem;">Deposit Principal</th>
                <th style="padding: 0.5rem;">Interest Earned</th>
                <th style="padding: 0.5rem;">Ending Balance</th>
              </tr>
            </thead>
            <tbody>
              ${scheduleRows}
            </tbody>
          </table>
        </div>
      </div>

      <div class="result-formula" style="font-size: 0.85rem; color: var(--color-text-muted); border-top: 1px solid var(--color-border); padding-top: 1rem;">
        <strong>Compounding Formula:</strong><br>
        $A = P \\times (1 + r/n)^{nt} = \\$${P.toLocaleString()} \\times (1 + ${r.toFixed(4)}/${n})^{(${n} \\times ${t.toFixed(2)})} = \\$${maturityValue.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}<br>
        Effective APY = $(1 + r/n)^n - 1 = $ <strong>${effectiveApy.toFixed(4)}%</strong>
      </div>
    `;
  }

  calcBtn.addEventListener("click", calculateCD);
  [principalInput, rateInput, rateTypeSelect, compoundFreqSelect, termMonthsInput, termUnitSelect, earlyPenaltySelect].forEach(inp => {
    inp.addEventListener("input", calculateCD);
  });

  resetBtn.addEventListener("click", () => {
    principalInput.value = "10000";
    rateInput.value = "5.00";
    rateTypeSelect.value = "apy";
    compoundFreqSelect.value = "365";
    termMonthsInput.value = "12";
    termUnitSelect.value = "months";
    earlyPenaltySelect.value = "3";
    presetBtns.forEach(b => b.classList.remove("active"));
    const defBtn = container.querySelector('[data-months="12"]');
    if (defBtn) defBtn.classList.add("active");
    calculateCD();
  });

  // Initial calculation
  calculateCD();
}

/* ==========================================================================
   3. Early Loan Payoff / Extra Payment Calculator
   ========================================================================== */
function renderEarlyLoanPayoffCalculator(container, calcDef) {
  container.innerHTML = `
    <div class="form-grid">
      <div class="form-group">
        <label class="form-label" for="elpBalance">
          Current Loan Balance
          <span class="form-label-hint">Remaining principal</span>
        </label>
        <div class="input-with-addon">
          <span class="input-addon">$</span>
          <input type="number" id="elpBalance" class="form-control" value="200000" min="1000" step="5000">
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="elpInterestRate">
          Interest Rate (%)
          <span class="form-label-hint">Annual interest</span>
        </label>
        <div class="input-with-addon">
          <input type="number" id="elpInterestRate" class="form-control" value="6.50" min="0.1" max="30" step="0.125">
          <span class="input-addon suffix">%</span>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="elpRemainingTerm">
          Remaining Loan Term
          <span class="form-label-hint">Years left</span>
        </label>
        <div class="input-with-addon">
          <input type="number" id="elpRemainingTerm" class="form-control" value="25" min="1" max="40" step="1">
          <span class="input-addon suffix">Yrs</span>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="elpExtraMonthly">
          Extra Monthly Payment
          <span class="form-label-hint">Added each month</span>
        </label>
        <div class="input-with-addon">
          <span class="input-addon">$</span>
          <input type="number" id="elpExtraMonthly" class="form-control" value="200" min="0" step="25">
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="elpExtraYearly">
          Extra Yearly Payment (Optional)
          <span class="form-label-hint">Once per year (tax refund / bonus)</span>
        </label>
        <div class="input-with-addon">
          <span class="input-addon">$</span>
          <input type="number" id="elpExtraYearly" class="form-control" value="0" min="0" step="500">
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="elpOneTimeLump">
          One-Time Lump Sum (Optional)
          <span class="form-label-hint">Single prepayment</span>
        </label>
        <div class="input-with-addon">
          <span class="input-addon">$</span>
          <input type="number" id="elpOneTimeLump" class="form-control" value="0" min="0" step="1000">
        </div>
      </div>
    </div>

    <div class="calc-actions" style="margin-top: 1.5rem; display: flex; gap: 0.75rem;">
      <button type="button" id="elpCalculateBtn" class="btn btn-primary" style="flex: 1;">Calculate Payoff Acceleration</button>
      <button type="button" id="elpResetBtn" class="btn btn-secondary">Reset</button>
    </div>

    <div id="elpResults" class="result-card" style="margin-top: 1.75rem; display: none;"></div>
  `;

  const balanceInput = container.querySelector("#elpBalance");
  const rateInput = container.querySelector("#elpInterestRate");
  const termInput = container.querySelector("#elpRemainingTerm");
  const extraMonthlyInput = container.querySelector("#elpExtraMonthly");
  const extraYearlyInput = container.querySelector("#elpExtraYearly");
  const oneTimeLumpInput = container.querySelector("#elpOneTimeLump");

  const calcBtn = container.querySelector("#elpCalculateBtn");
  const resetBtn = container.querySelector("#elpResetBtn");
  const resultsDiv = container.querySelector("#elpResults");

  function calculateEarlyPayoff() {
    const P = parseFloat(balanceInput.value) || 0;
    const annualRate = parseFloat(rateInput.value) || 0;
    const r = annualRate / 100 / 12; // Monthly rate
    const years = parseFloat(termInput.value) || 0;
    const origMonths = Math.round(years * 12);

    const extraMonthly = parseFloat(extraMonthlyInput.value) || 0;
    const extraYearly = parseFloat(extraYearlyInput.value) || 0;
    const oneTimeLump = parseFloat(oneTimeLumpInput.value) || 0;

    if (P <= 0 || annualRate <= 0 || origMonths <= 0) {
      resultsDiv.style.display = "block";
      resultsDiv.innerHTML = `
        <div class="result-alert warning">
          Please enter valid positive values for loan balance, interest rate, and term.
        </div>
      `;
      return;
    }

    // Standard monthly payment: PMT = P * [r(1+r)^N] / [(1+r)^N - 1]
    const basePmt = P * (r * Math.pow(1 + r, origMonths)) / (Math.pow(1 + r, origMonths) - 1);
    const origTotalPayments = basePmt * origMonths;
    const origTotalInterest = origTotalPayments - P;

    // Simulate accelerated amortization
    let currentBalance = P;
    let newTotalInterest = 0;
    let accelMonths = 0;
    let newTotalPaid = 0;

    // Apply one-time lump sum at Month 1
    if (oneTimeLump > 0) {
      currentBalance = Math.max(0, currentBalance - oneTimeLump);
      newTotalPaid += oneTimeLump;
    }

    let comparisonSchedule = [];
    let origBalSim = P;
    let origInterestSim = 0;

    for (let m = 1; m <= origMonths; m++) {
      // Original track simulation for annual milestone comparison
      if (origBalSim > 0) {
        const origInt = origBalSim * r;
        origInterestSim += origInt;
        const origPrin = Math.min(origBalSim, basePmt - origInt);
        origBalSim -= origPrin;
      }

      // Accelerated track simulation
      if (currentBalance > 0) {
        accelMonths++;
        const monthlyInt = currentBalance * r;
        newTotalInterest += monthlyInt;

        let totalPmtThisMonth = basePmt + extraMonthly;
        if (m % 12 === 0) {
          totalPmtThisMonth += extraYearly;
        }

        const prinPortion = totalPmtThisMonth - monthlyInt;
        if (prinPortion >= currentBalance) {
          newTotalPaid += currentBalance + monthlyInt;
          currentBalance = 0;
        } else {
          currentBalance -= prinPortion;
          newTotalPaid += totalPmtThisMonth;
        }
      }

      // Record annual milestones
      if (m % 12 === 0 || m === origMonths || (currentBalance === 0 && comparisonSchedule.length === 0)) {
        comparisonSchedule.push({
          year: Math.ceil(m / 12),
          origBal: Math.max(0, origBalSim),
          accelBal: Math.max(0, currentBalance),
          interestSavedSoFar: Math.max(0, origInterestSim - newTotalInterest)
        });
      }
    }

    const monthsSaved = Math.max(0, origMonths - accelMonths);
    const yearsSaved = Math.floor(monthsSaved / 12);
    const remainingMonthsSaved = monthsSaved % 12;
    const totalInterestSaved = Math.max(0, origTotalInterest - newTotalInterest);

    resultsDiv.style.display = "block";
    resultsDiv.innerHTML = `
      <div class="result-header" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.25rem;">
        <div>
          <h3 class="result-title" style="margin: 0; font-size: 1.35rem;">Early Payoff Results</h3>
          <span style="font-size: 0.88rem; color: var(--color-text-muted);">
            Payoff in <strong>${Math.floor(accelMonths / 12)} Yrs, ${accelMonths % 12} Mo</strong> vs original ${years} Years
          </span>
        </div>
        <span class="badge badge-success" style="font-size: 0.9rem; padding: 0.4rem 0.8rem; border-radius: 9999px;">
          Saved $${totalInterestSaved.toLocaleString('en-US', {maximumFractionDigits: 0})}
        </span>
      </div>

      <div class="result-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
        <div class="stat-card highlight" style="padding: 1rem; border-radius: 10px; background: var(--color-bg-secondary); border: 1px solid var(--color-border);">
          <div class="stat-label" style="font-size: 0.85rem; color: var(--color-text-muted);">Total Interest Saved</div>
          <div class="stat-value" style="font-size: 1.9rem; font-weight: 700; color: var(--color-success, #10b981);">
            $${totalInterestSaved.toLocaleString('en-US', {maximumFractionDigits: 0})}
          </div>
          <div class="stat-subtext" style="font-size: 0.8rem; margin-top: 0.25rem;">Direct interest avoided</div>
        </div>

        <div class="stat-card" style="padding: 1rem; border-radius: 10px; background: var(--color-bg-secondary); border: 1px solid var(--color-border);">
          <div class="stat-label" style="font-size: 0.85rem; color: var(--color-text-muted);">Time Shaved Off Loan</div>
          <div class="stat-value" style="font-size: 1.7rem; font-weight: 700; color: var(--color-primary);">
            ${yearsSaved > 0 ? `${yearsSaved} Yrs ` : ''}${remainingMonthsSaved} Mo
          </div>
          <div class="stat-subtext" style="font-size: 0.8rem; margin-top: 0.25rem;">${monthsSaved} total months debt-free sooner</div>
        </div>

        <div class="stat-card" style="padding: 1rem; border-radius: 10px; background: var(--color-bg-secondary); border: 1px solid var(--color-border);">
          <div class="stat-label" style="font-size: 0.85rem; color: var(--color-text-muted);">Original Required Payment</div>
          <div class="stat-value" style="font-size: 1.4rem; font-weight: 700; color: var(--color-text);">
            $${basePmt.toFixed(2)}/mo
          </div>
          <div class="stat-subtext" style="font-size: 0.8rem; margin-top: 0.25rem;">Plus $${extraMonthly.toFixed(0)}/mo extra = $${(basePmt + extraMonthly).toFixed(2)}/mo</div>
        </div>

        <div class="stat-card" style="padding: 1rem; border-radius: 10px; background: var(--color-bg-secondary); border: 1px solid var(--color-border);">
          <div class="stat-label" style="font-size: 0.85rem; color: var(--color-text-muted);">New Total Loan Cost</div>
          <div class="stat-value" style="font-size: 1.4rem; font-weight: 700; color: var(--color-text);">
            $${(P + newTotalInterest).toLocaleString('en-US', {maximumFractionDigits: 0})}
          </div>
          <div class="stat-subtext" style="font-size: 0.8rem; margin-top: 0.25rem;">Down from $${origTotalPayments.toLocaleString('en-US', {maximumFractionDigits: 0})}</div>
        </div>
      </div>

      <div class="result-details" style="background: var(--color-bg-secondary); padding: 1.25rem; border-radius: 10px; margin-bottom: 1.5rem;">
        <h4 style="margin: 0 0 0.75rem; font-size: 1rem;">⚖️ Original Schedule vs. Accelerated Payoff Comparison</h4>
        <div style="overflow-x: auto;">
          <table class="schedule-table" style="width: 100%; font-size: 0.85rem; border-collapse: collapse;">
            <thead>
              <tr style="border-bottom: 2px solid var(--color-border); text-align: left;">
                <th style="padding: 0.5rem;">Metric</th>
                <th style="padding: 0.5rem;">Standard Schedule</th>
                <th style="padding: 0.5rem;">With Prepayments</th>
                <th style="padding: 0.5rem;">Your Benefit</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid var(--color-border);">
                <td style="padding: 0.5rem;"><strong>Payoff Horizon</strong></td>
                <td style="padding: 0.5rem;">${years} Years (${origMonths} months)</td>
                <td style="padding: 0.5rem; font-weight: 600; color: var(--color-primary);">${(accelMonths / 12).toFixed(1)} Years (${accelMonths} months)</td>
                <td style="padding: 0.5rem; color: var(--color-success, #10b981); font-weight: 600;">-${yearsSaved} Yrs, ${remainingMonthsSaved} Mo earlier</td>
              </tr>
              <tr style="border-bottom: 1px solid var(--color-border);">
                <td style="padding: 0.5rem;"><strong>Total Interest Paid</strong></td>
                <td style="padding: 0.5rem;">$${origTotalInterest.toLocaleString('en-US', {maximumFractionDigits: 0})}</td>
                <td style="padding: 0.5rem; font-weight: 600;">$${newTotalInterest.toLocaleString('en-US', {maximumFractionDigits: 0})}</td>
                <td style="padding: 0.5rem; color: var(--color-success, #10b981); font-weight: 600;">-$${totalInterestSaved.toLocaleString('en-US', {maximumFractionDigits: 0})}</td>
              </tr>
              <tr>
                <td style="padding: 0.5rem;"><strong>Total Lifetime Cost</strong></td>
                <td style="padding: 0.5rem;">$${origTotalPayments.toLocaleString('en-US', {maximumFractionDigits: 0})}</td>
                <td style="padding: 0.5rem; font-weight: 600;">$${(P + newTotalInterest).toLocaleString('en-US', {maximumFractionDigits: 0})}</td>
                <td style="padding: 0.5rem; color: var(--color-success, #10b981); font-weight: 600;">-$${totalInterestSaved.toLocaleString('en-US', {maximumFractionDigits: 0})} net savings</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="result-formula" style="font-size: 0.85rem; color: var(--color-text-muted); border-top: 1px solid var(--color-border); padding-top: 1rem;">
        <strong>How Accelerated Amortization Works:</strong><br>
        100% of your extra payment of <strong>$${extraMonthly.toLocaleString()}/month</strong> goes directly toward reducing loan principal, decreasing subsequent interest accrual exponentially.
      </div>
    `;
  }

  calcBtn.addEventListener("click", calculateEarlyPayoff);
  [balanceInput, rateInput, termInput, extraMonthlyInput, extraYearlyInput, oneTimeLumpInput].forEach(inp => {
    inp.addEventListener("input", calculateEarlyPayoff);
  });

  resetBtn.addEventListener("click", () => {
    balanceInput.value = "200000";
    rateInput.value = "6.50";
    termInput.value = "25";
    extraMonthlyInput.value = "200";
    extraYearlyInput.value = "0";
    oneTimeLumpInput.value = "0";
    calculateEarlyPayoff();
  });

  // Initial calculation
  calculateEarlyPayoff();
}

/* ==========================================================================
   4. APR to APY Converter
   ========================================================================== */
function renderAprToApyCalculator(container, calcDef) {
  container.innerHTML = `
    <div class="form-grid">
      <div class="form-group" style="grid-column: 1 / -1;">
        <label class="form-label" for="aprMode">
          Conversion Direction
          <span class="form-label-hint">Choose which rate to convert</span>
        </label>
        <select id="aprMode" class="form-control" style="font-size: 1rem; font-weight: 600;">
          <option value="aprToApy" selected>APR ➔ APY (Nominal Stated Rate to Effective Annual Yield)</option>
          <option value="apyToApr">APY ➔ APR (Effective Annual Yield to Nominal Stated Rate)</option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label" id="aprRateLabel" for="aprRateValue">
          Stated APR Rate (%)
          <span class="form-label-hint">Nominal annual interest</span>
        </label>
        <div class="input-with-addon">
          <input type="number" id="aprRateValue" class="form-control" value="6.00" min="0.001" max="100" step="0.05">
          <span class="input-addon suffix">%</span>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="aprCompounding">
          Compounding Frequency (n)
          <span class="form-label-hint">Times per year</span>
        </label>
        <select id="aprCompounding" class="form-control">
          <option value="365" selected>Daily (365 times / year)</option>
          <option value="360">Daily Commercial (360 times / year)</option>
          <option value="52">Weekly (52 times / year)</option>
          <option value="26">Bi-Weekly (26 times / year)</option>
          <option value="12">Monthly (12 times / year)</option>
          <option value="4">Quarterly (4 times / year)</option>
          <option value="2">Semi-Annually (2 times / year)</option>
          <option value="1">Annually (1 time / year)</option>
          <option value="continuous">Continuous Compounding (e)</option>
        </select>
      </div>

      <div class="form-group" style="grid-column: 1 / -1;">
        <label class="form-label" for="aprSampleBalance">
          Sample Principal Balance (Optional)
          <span class="form-label-hint">Calculate actual dollar return</span>
        </label>
        <div class="input-with-addon" style="max-width: 260px;">
          <span class="input-addon">$</span>
          <input type="number" id="aprSampleBalance" class="form-control" value="10000" min="0" step="1000">
        </div>
      </div>
    </div>

    <div class="calc-actions" style="margin-top: 1.5rem; display: flex; gap: 0.75rem;">
      <button type="button" id="aprCalculateBtn" class="btn btn-primary" style="flex: 1;">Convert Rate</button>
      <button type="button" id="aprResetBtn" class="btn btn-secondary">Reset</button>
    </div>

    <div id="aprResults" class="result-card" style="margin-top: 1.75rem; display: none;"></div>
  `;

  const modeSelect = container.querySelector("#aprMode");
  const rateLabel = container.querySelector("#aprRateLabel");
  const rateInput = container.querySelector("#aprRateValue");
  const compoundSelect = container.querySelector("#aprCompounding");
  const sampleBalanceInput = container.querySelector("#aprSampleBalance");

  const calcBtn = container.querySelector("#aprCalculateBtn");
  const resetBtn = container.querySelector("#aprResetBtn");
  const resultsDiv = container.querySelector("#aprResults");

  modeSelect.addEventListener("change", () => {
    if (modeSelect.value === "aprToApy") {
      rateLabel.innerHTML = `Stated APR Rate (%) <span class="form-label-hint">Nominal annual interest</span>`;
    } else {
      rateLabel.innerHTML = `Stated APY Rate (%) <span class="form-label-hint">Effective annual yield</span>`;
    }
    convertRates();
  });

  function convertRates() {
    const mode = modeSelect.value;
    const inputRate = parseFloat(rateInput.value) || 0;
    const compVal = compoundSelect.value;
    const isContinuous = compVal === "continuous";
    const n = isContinuous ? 0 : (parseFloat(compVal) || 12);
    const balance = parseFloat(sampleBalanceInput.value) || 10000;

    if (inputRate <= 0) {
      resultsDiv.style.display = "block";
      resultsDiv.innerHTML = `
        <div class="result-alert warning">
          Please enter a valid interest rate percentage greater than 0%.
        </div>
      `;
      return;
    }

    let apr = 0;
    let apy = 0;
    let formulaHtml = "";

    if (mode === "aprToApy") {
      apr = inputRate;
      const r = apr / 100;
      if (isContinuous) {
        apy = (Math.exp(r) - 1) * 100;
        formulaHtml = `\\text{APY} = e^{\\text{APR}} - 1 = e^{${r.toFixed(4)}} - 1 = <strong>${apy.toFixed(4)}%</strong>`;
      } else {
        apy = (Math.pow(1 + r / n, n) - 1) * 100;
        formulaHtml = `\\text{APY} = \\left(1 + \\frac{\\text{APR}}{n}\\right)^n - 1 = \\left(1 + \\frac{${r.toFixed(4)}}{${n}}\\right)^{${n}} - 1 = <strong>${apy.toFixed(4)}%</strong>`;
      }
    } else {
      // APY to APR
      apy = inputRate;
      const y = apy / 100;
      if (isContinuous) {
        apr = Math.log(1 + y) * 100;
        formulaHtml = `\\text{APR} = \\ln(1 + \\text{APY}) = \\ln(1 + ${y.toFixed(4)}) = <strong>${apr.toFixed(4)}%</strong>`;
      } else {
        apr = (n * (Math.pow(1 + y, 1 / n) - 1)) * 100;
        formulaHtml = `\\text{APR} = n \\times \\left[(1 + \\text{APY})^{1/n} - 1\\right] = ${n} \\times \\left[(1 + ${y.toFixed(4)})^{1/${n}} - 1\\right] = <strong>${apr.toFixed(4)}%</strong>`;
      }
    }

    const diffPercent = apy - apr;
    const annualDollarApr = balance * (apr / 100);
    const annualDollarApy = balance * (apy / 100);
    const dollarDifference = annualDollarApy - annualDollarApr;

    // Comparison grid for all standard compounding intervals
    const frequencies = [
      { name: "Annually (n = 1)", n: 1 },
      { name: "Semi-Annually (n = 2)", n: 2 },
      { name: "Quarterly (n = 4)", n: 4 },
      { name: "Monthly (n = 12)", n: 12 },
      { name: "Bi-Weekly (n = 26)", n: 26 },
      { name: "Weekly (n = 52)", n: 52 },
      { name: "Daily 360 (n = 360)", n: 360 },
      { name: "Daily 365 (n = 365)", n: 365 },
      { name: "Continuous (e)", n: "continuous" }
    ];

    let gridRows = "";
    frequencies.forEach(f => {
      let fApy = 0;
      let fApr = 0;

      if (mode === "aprToApy") {
        fApr = apr;
        const r = apr / 100;
        if (f.n === "continuous") {
          fApy = (Math.exp(r) - 1) * 100;
        } else {
          fApy = (Math.pow(1 + r / f.n, f.n) - 1) * 100;
        }
      } else {
        fApy = apy;
        const y = apy / 100;
        if (f.n === "continuous") {
          fApr = Math.log(1 + y) * 100;
        } else {
          fApr = (f.n * (Math.pow(1 + y, 1 / f.n) - 1)) * 100;
        }
      }

      const isCurrent = (isContinuous && f.n === "continuous") || (!isContinuous && f.n === n);
      gridRows += `
        <tr style="border-bottom: 1px solid var(--color-border); ${isCurrent ? 'background: rgba(59, 130, 246, 0.08); font-weight: 600;' : ''}">
          <td style="padding: 0.5rem;">${f.name} ${isCurrent ? '⭐ (Selected)' : ''}</td>
          <td style="padding: 0.5rem;">${fApr.toFixed(4)}%</td>
          <td style="padding: 0.5rem; color: var(--color-primary);">${fApy.toFixed(4)}%</td>
          <td style="padding: 0.5rem; color: var(--color-success, #10b981);">+$${(balance * (fApy / 100)).toFixed(2)}</td>
        </tr>
      `;
    });

    resultsDiv.style.display = "block";
    resultsDiv.innerHTML = `
      <div class="result-header" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.25rem;">
        <div>
          <h3 class="result-title" style="margin: 0; font-size: 1.35rem;">Conversion Results</h3>
          <span style="font-size: 0.88rem; color: var(--color-text-muted);">
            ${mode === 'aprToApy' ? `${apr.toFixed(2)}% APR converted to APY` : `${apy.toFixed(2)}% APY converted to APR`}
          </span>
        </div>
        <span class="badge badge-success" style="font-size: 0.9rem; padding: 0.4rem 0.8rem; border-radius: 9999px;">
          ${mode === 'aprToApy' ? `APY: ${apy.toFixed(4)}%` : `APR: ${apr.toFixed(4)}%`}
        </span>
      </div>

      <div class="result-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
        <div class="stat-card highlight" style="padding: 1rem; border-radius: 10px; background: var(--color-bg-secondary); border: 1px solid var(--color-border);">
          <div class="stat-label" style="font-size: 0.85rem; color: var(--color-text-muted);">Effective Annual Yield (APY)</div>
          <div class="stat-value" style="font-size: 1.9rem; font-weight: 700; color: var(--color-primary);">
            ${apy.toFixed(4)}%
          </div>
          <div class="stat-subtext" style="font-size: 0.8rem; margin-top: 0.25rem;">True annual yield with compounding</div>
        </div>

        <div class="stat-card" style="padding: 1rem; border-radius: 10px; background: var(--color-bg-secondary); border: 1px solid var(--color-border);">
          <div class="stat-label" style="font-size: 0.85rem; color: var(--color-text-muted);">Nominal Rate (APR)</div>
          <div class="stat-value" style="font-size: 1.9rem; font-weight: 700; color: var(--color-text);">
            ${apr.toFixed(4)}%
          </div>
          <div class="stat-subtext" style="font-size: 0.8rem; margin-top: 0.25rem;">Stated annual interest without compounding</div>
        </div>

        <div class="stat-card" style="padding: 1rem; border-radius: 10px; background: var(--color-bg-secondary); border: 1px solid var(--color-border);">
          <div class="stat-label" style="font-size: 0.85rem; color: var(--color-text-muted);">Compounding Boost</div>
          <div class="stat-value" style="font-size: 1.4rem; font-weight: 700; color: var(--color-success, #10b981);">
            +${diffPercent.toFixed(4)}%
          </div>
          <div class="stat-subtext" style="font-size: 0.8rem; margin-top: 0.25rem;">Extra yield gained from interest-on-interest</div>
        </div>

        <div class="stat-card" style="padding: 1rem; border-radius: 10px; background: var(--color-bg-secondary); border: 1px solid var(--color-border);">
          <div class="stat-label" style="font-size: 0.85rem; color: var(--color-text-muted);">1-Yr Yield on $${balance.toLocaleString()}</div>
          <div class="stat-value" style="font-size: 1.4rem; font-weight: 700; color: var(--color-text);">
            $${annualDollarApy.toFixed(2)}
          </div>
          <div class="stat-subtext" style="font-size: 0.8rem; margin-top: 0.25rem;">+$${dollarDifference.toFixed(2)} vs simple APR</div>
        </div>
      </div>

      <div class="result-details" style="background: var(--color-bg-secondary); padding: 1.25rem; border-radius: 10px; margin-bottom: 1.5rem;">
        <h4 style="margin: 0 0 0.75rem; font-size: 1rem;">📊 Compounding Frequency Sensitivity Grid</h4>
        <div style="overflow-x: auto;">
          <table class="schedule-table" style="width: 100%; font-size: 0.85rem; border-collapse: collapse;">
            <thead>
              <tr style="border-bottom: 2px solid var(--color-border); text-align: left;">
                <th style="padding: 0.5rem;">Frequency</th>
                <th style="padding: 0.5rem;">Nominal APR</th>
                <th style="padding: 0.5rem;">Effective APY</th>
                <th style="padding: 0.5rem;">1-Yr Payout on $${balance.toLocaleString()}</th>
              </tr>
            </thead>
            <tbody>
              ${gridRows}
            </tbody>
          </table>
        </div>
      </div>

      <div class="result-formula" style="font-size: 0.85rem; color: var(--color-text-muted); border-top: 1px solid var(--color-border); padding-top: 1rem;">
        <strong>Step-by-Step Mathematical Derivation:</strong><br>
        ${formulaHtml}
      </div>
    `;
  }

  calcBtn.addEventListener("click", convertRates);
  [rateInput, compoundSelect, sampleBalanceInput].forEach(inp => {
    inp.addEventListener("input", convertRates);
  });

  resetBtn.addEventListener("click", () => {
    modeSelect.value = "aprToApy";
    rateLabel.innerHTML = `Stated APR Rate (%) <span class="form-label-hint">Nominal annual interest</span>`;
    rateInput.value = "6.00";
    compoundSelect.value = "365";
    sampleBalanceInput.value = "10000";
    convertRates();
  });

  // Initial calculation
  convertRates();
}
