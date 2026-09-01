/**
 * ============================================================================
 * Financial Calculators: Compound Interest Calculator
 * ============================================================================
 */

function renderCompoundInterestCalculator(container, calcDef) {
  container.innerHTML = `
    <div class="form-grid">
      <div class="form-group">
        <label class="form-label" for="compPrincipal">
          Initial Investment (Principal)
          <span class="form-label-hint">Starting balance</span>
        </label>
        <div class="input-with-addon">
          <span class="input-addon">$</span>
          <input type="number" id="compPrincipal" class="form-control" value="10000" min="1" step="100">
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="compMonthlyDeposit">
          Monthly Contribution
          <span class="form-label-hint">Optional add</span>
        </label>
        <div class="input-with-addon">
          <span class="input-addon">$</span>
          <input type="number" id="compMonthlyDeposit" class="form-control" value="200" min="0" step="50">
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="compRate">
          Annual Interest Rate
          <span class="form-label-hint">% per year</span>
        </label>
        <div class="input-with-addon">
          <input type="number" id="compRate" class="form-control" value="8" min="0.1" max="100" step="0.1">
          <span class="input-addon suffix">%</span>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="compYears">
          Investment Duration
          <span class="form-label-hint">Years</span>
        </label>
        <div class="input-with-addon">
          <input type="number" id="compYears" class="form-control" value="10" min="1" max="50" step="1">
          <span class="input-addon suffix">Yrs</span>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="compFrequency">
          Compounding Frequency
          <span class="form-label-hint">Times per year</span>
        </label>
        <select id="compFrequency" class="form-control">
          <option value="12" selected>Monthly (12/yr)</option>
          <option value="1">Annually (1/yr)</option>
          <option value="4">Quarterly (4/yr)</option>
          <option value="365">Daily (365/yr)</option>
        </select>
      </div>
    </div>

    <div class="calc-actions">
      <button type="button" id="btnCalculateComp" class="btn btn-primary">
        <span>⚡ Calculate Growth</span>
      </button>
      <button type="button" id="btnResetComp" class="btn btn-secondary">
        <span>↺ Reset</span>
      </button>
    </div>

    <!-- Results Container -->
    <div id="compResultContainer" class="results-section animate-fade-in" style="display: none;"></div>
  `;

  const btnCalc = container.querySelector("#btnCalculateComp");
  const btnReset = container.querySelector("#btnResetComp");
  const resultDiv = container.querySelector("#compResultContainer");

  function calculate() {
    const P = parseFloat(container.querySelector("#compPrincipal").value) || 0;
    const PMT = parseFloat(container.querySelector("#compMonthlyDeposit").value) || 0;
    const r = (parseFloat(container.querySelector("#compRate").value) || 0) / 100;
    const t = parseFloat(container.querySelector("#compYears").value) || 0;
    const n = parseInt(container.querySelector("#compFrequency").value) || 12;

    if (P < 0 || r <= 0 || t <= 0) {
      alert("Please enter valid positive values.");
      return;
    }

    // Compound Interest with periodic deposits:
    // FV = P * (1 + r/n)^(nt) + PMT * [ ((1 + r/n)^(nt) - 1) / (r/n) ] * (deposit frequency factor)
    // For simplicity & accuracy, let's step year by year:
    let currentBalance = P;
    let totalDeposited = P;
    let growthRows = "";

    for (let yr = 1; yr <= t; yr++) {
      const startOfYear = currentBalance;
      // Step month by month or compound period
      for (let m = 1; m <= 12; m++) {
        currentBalance += PMT;
        totalDeposited += PMT;
        // compound monthly effective
        currentBalance += currentBalance * (r / 12);
      }
      const interestEarnedThisYear = currentBalance - startOfYear - (PMT * 12);

      growthRows += `
        <tr style="border-bottom: 1px solid var(--border-color); font-size: 0.85rem;">
          <td style="padding: 0.6rem 0.75rem; text-align: center; font-weight: 600;">Year ${yr}</td>
          <td style="padding: 0.6rem 0.75rem; text-align: right;">$${totalDeposited.toFixed(2)}</td>
          <td style="padding: 0.6rem 0.75rem; text-align: right; color: var(--accent-emerald);">$${interestEarnedThisYear.toFixed(2)}</td>
          <td style="padding: 0.6rem 0.75rem; text-align: right; font-weight: 700; color: var(--accent-primary);">$${currentBalance.toFixed(2)}</td>
        </tr>
      `;
    }

    const totalInterest = currentBalance - totalDeposited;

    resultDiv.innerHTML = `
      <div class="result-hero-box">
        <span class="result-hero-label">Future Investment Value (${t} Years)</span>
        <div class="result-hero-value" style="color: var(--accent-emerald);">
          $${currentBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      </div>

      <div class="result-stat-grid">
        <div class="result-stat-card">
          <div class="result-stat-label">Initial Principal</div>
          <div class="result-stat-val">$${P.toLocaleString()}</div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-label">Total Contributions</div>
          <div class="result-stat-val">$${(totalDeposited - P).toLocaleString()}</div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-label">Total Interest Earned</div>
          <div class="result-stat-val" style="color: var(--accent-emerald);">$${totalInterest.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-label">Total Capital Invested</div>
          <div class="result-stat-val">$${totalDeposited.toLocaleString()}</div>
        </div>
      </div>

      <!-- Step by step -->
      <div class="steps-wrapper">
        <h3 class="steps-title">📈 Compound Interest Formula Breakdown</h3>

        <div class="step-card">
          <span class="step-num-badge">Formula: Continuous / Periodic Compounding</span>
          <div class="math-formula-box">
            A = P(1 + r/n)^(nt)
          </div>
          <p class="step-content">
            Where <b>A</b> = Final Amount, <b>P</b> = Principal ($${P.toLocaleString()}), <b>r</b> = Annual interest (${r * 100}%), <b>n</b> = Compounding frequency per year (${n}), and <b>t</b> = Time in years (${t}).
          </p>
        </div>
      </div>

      <!-- Growth Table -->
      <div style="margin-top: 1.5rem;">
        <h4 style="font-family: var(--font-heading); font-size: 1.1rem; margin-bottom: 0.75rem;">📊 Year-by-Year Growth Summary</h4>
        <div style="overflow-x: auto; border: 1px solid var(--border-color); border-radius: var(--radius-md);">
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: var(--bg-subtle); border-bottom: 1.5px solid var(--border-color); font-size: 0.82rem; text-transform: uppercase; color: var(--text-muted);">
                <th style="padding: 0.75rem; text-align: center;">Year</th>
                <th style="padding: 0.75rem; text-align: right;">Total Invested</th>
                <th style="padding: 0.75rem; text-align: right;">Interest Earned</th>
                <th style="padding: 0.75rem; text-align: right;">End Balance</th>
              </tr>
            </thead>
            <tbody>
              ${growthRows}
            </tbody>
          </table>
        </div>
      </div>
    `;

    resultDiv.style.display = "block";
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  btnCalc.addEventListener("click", calculate);
  btnReset.addEventListener("click", () => {
    container.querySelector("#compPrincipal").value = 10000;
    container.querySelector("#compMonthlyDeposit").value = 200;
    container.querySelector("#compRate").value = 8;
    container.querySelector("#compYears").value = 10;
    resultDiv.style.display = "none";
  });

  calculate();
}
