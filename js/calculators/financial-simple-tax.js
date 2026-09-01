/**
 * ============================================================================
 * Financial Sub-Suite: Simple Interest, Sales Tax, Tip & Bill Splitter
 * ============================================================================
 */

// 1. Simple Interest Calculator (I = Prt)
function renderSimpleInterestCalculator(container, calcDef) {
  container.innerHTML = `
    <div class="form-grid">
      <div class="form-group">
        <label class="form-label" for="siPrincipal">
          <span>Principal Amount ($)</span>
          <span class="form-label-hint">Initial Investment / Loan</span>
        </label>
        <div class="input-with-addon">
          <span class="input-addon">$</span>
          <input type="number" id="siPrincipal" class="form-control" value="10000" min="1" step="100">
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="siRate">
          <span>Annual Interest Rate (%)</span>
          <span class="form-label-hint">Percentage per year</span>
        </label>
        <div class="input-with-addon">
          <input type="number" id="siRate" class="form-control" value="5.5" min="0.01" step="0.1">
          <span class="input-addon suffix">%</span>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="siTime">
          <span>Time Duration</span>
          <span class="form-label-hint">Loan / Investment Length</span>
        </label>
        <div style="display: flex; gap: 0.5rem;">
          <input type="number" id="siTime" class="form-control" value="3" min="0.1" step="0.5" style="border: 1.5px solid var(--border-color); border-radius: var(--radius-md); background: var(--bg-input);">
          <select id="siTimeUnit" class="form-control" style="width: 140px;">
            <option value="years" selected>Years</option>
            <option value="months">Months</option>
            <option value="days">Days (365/yr)</option>
          </select>
        </div>
      </div>
    </div>

    <div class="calc-actions">
      <button type="button" id="btnCalcSI" class="btn btn-primary">
        <span>⚡ Calculate Simple Interest</span>
      </button>
      <button type="button" id="btnResetSI" class="btn btn-secondary">
        <span>↺ Reset</span>
      </button>
    </div>

    <div id="siResultContainer" class="results-section animate-fade-in" style="display: none;"></div>
  `;

  const btnCalc = container.querySelector("#btnCalcSI");
  const btnReset = container.querySelector("#btnResetSI");
  const resultDiv = container.querySelector("#siResultContainer");

  function calculate() {
    const P = parseFloat(container.querySelector("#siPrincipal").value) || 0;
    const rPercent = parseFloat(container.querySelector("#siRate").value) || 0;
    const timeVal = parseFloat(container.querySelector("#siTime").value) || 0;
    const timeUnit = container.querySelector("#siTimeUnit").value;

    if (P <= 0 || rPercent <= 0 || timeVal <= 0) {
      alert("Please enter valid positive numbers for Principal, Rate, and Time.");
      return;
    }

    const r = rPercent / 100;
    let t = timeVal;
    let timeLabel = `${timeVal} years`;

    if (timeUnit === "months") {
      t = timeVal / 12;
      timeLabel = `${timeVal} months (${t.toFixed(4)} years)`;
    } else if (timeUnit === "days") {
      t = timeVal / 365;
      timeLabel = `${timeVal} days (${t.toFixed(4)} years)`;
    }

    const I = P * r * t;
    const A = P + I;

    resultDiv.innerHTML = `
      <div class="result-hero-box">
        <span class="result-hero-label">Total Simple Interest (I)</span>
        <div class="result-hero-value">$${I.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        <span style="font-size: 0.95rem; color: var(--text-secondary);">
          Total End Balance (Maturity Value A): <b>$${A.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</b>
        </span>
      </div>

      <div class="result-stat-grid">
        <div class="result-stat-card">
          <div class="result-stat-label">Initial Principal (P)</div>
          <div class="result-stat-val">$${P.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-label">Total Interest (I)</div>
          <div class="result-stat-val" style="color: var(--accent-amber);">$${I.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-label">Total Amount (P + I)</div>
          <div class="result-stat-val" style="color: var(--accent-emerald);">$${A.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-label">Effective Duration (t)</div>
          <div class="result-stat-val">${t.toFixed(2)} yrs</div>
        </div>
      </div>

      <div class="steps-wrapper">
        <div class="steps-header">
          <h4 class="steps-title"><span>📐</span> Step-by-Step Mathematical Solution</h4>
        </div>

        <div class="step-card">
          <span class="step-num-badge">Step 1: Identify Given Variables</span>
          <p class="step-content">
            Principal (<b>P</b>) = $${P.toLocaleString()}<br>
            Annual Rate (<b>r</b>) = ${rPercent}% = ${r}<br>
            Time in Years (<b>t</b>) = ${timeLabel}
          </p>
        </div>

        <div class="step-card">
          <span class="step-num-badge">Step 2: Apply Simple Interest Formula</span>
          <div class="math-formula-box">I = P × r × t</div>
          <p class="step-content">
            I = ${P} × ${r} × ${t.toFixed(4)}<br>
            I = <b>$${I.toFixed(2)}</b>
          </p>
        </div>

        <div class="step-card">
          <span class="step-num-badge">Step 3: Calculate Final Maturity Amount</span>
          <div class="math-formula-box">A = P + I = P(1 + rt)</div>
          <p class="step-content">
            A = ${P} + ${I.toFixed(2)} = <b>$${A.toFixed(2)}</b>
          </p>
        </div>
      </div>
    `;

    resultDiv.style.display = "block";
  }

  btnCalc.addEventListener("click", calculate);
  btnReset.addEventListener("click", () => {
    container.querySelector("#siPrincipal").value = "10000";
    container.querySelector("#siRate").value = "5.5";
    container.querySelector("#siTime").value = "3";
    container.querySelector("#siTimeUnit").value = "years";
    resultDiv.style.display = "none";
  });

  calculate();
}

// 2. Sales Tax & Discount Calculator
function renderSalesTaxCalculator(container, calcDef) {
  container.innerHTML = `
    <div class="form-grid">
      <div class="form-group">
        <label class="form-label" for="stOriginalPrice">
          <span>Original Price ($)</span>
          <span class="form-label-hint">Item Retail Price</span>
        </label>
        <div class="input-with-addon">
          <span class="input-addon">$</span>
          <input type="number" id="stOriginalPrice" class="form-control" value="120" min="0.01" step="1">
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="stTaxRate">
          <span>Sales Tax Rate (%)</span>
          <span class="form-label-hint">State / Local Tax</span>
        </label>
        <div class="input-with-addon">
          <input type="number" id="stTaxRate" class="form-control" value="8.5" min="0" step="0.1">
          <span class="input-addon suffix">%</span>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="stDiscountRate">
          <span>Discount / Sale (%)</span>
          <span class="form-label-hint">Optional coupon or % off</span>
        </label>
        <div class="input-with-addon">
          <input type="number" id="stDiscountRate" class="form-control" value="15" min="0" max="100" step="1">
          <span class="input-addon suffix">%</span>
        </div>
      </div>
    </div>

    <div class="calc-actions">
      <button type="button" id="btnCalcST" class="btn btn-primary">
        <span>⚡ Calculate Total Price</span>
      </button>
      <button type="button" id="btnResetST" class="btn btn-secondary">
        <span>↺ Reset</span>
      </button>
    </div>

    <div id="stResultContainer" class="results-section animate-fade-in" style="display: none;"></div>
  `;

  const btnCalc = container.querySelector("#btnCalcST");
  const btnReset = container.querySelector("#btnResetST");
  const resultDiv = container.querySelector("#stResultContainer");

  function calculate() {
    const price = parseFloat(container.querySelector("#stOriginalPrice").value) || 0;
    const taxRate = parseFloat(container.querySelector("#stTaxRate").value) || 0;
    const discountRate = parseFloat(container.querySelector("#stDiscountRate").value) || 0;

    if (price <= 0) {
      alert("Please enter a valid original price.");
      return;
    }

    const discountAmount = price * (discountRate / 100);
    const discountedPrice = price - discountAmount;
    const taxAmount = discountedPrice * (taxRate / 100);
    const finalTotal = discountedPrice + taxAmount;

    resultDiv.innerHTML = `
      <div class="result-hero-box">
        <span class="result-hero-label">Final Total Due (With Tax & Discount)</span>
        <div class="result-hero-value">$${finalTotal.toFixed(2)}</div>
        <span style="font-size: 0.95rem; color: var(--text-secondary);">
          You Save: <b>$${discountAmount.toFixed(2)}</b> (${discountRate}% Discount) | Sales Tax: <b>$${taxAmount.toFixed(2)}</b>
        </span>
      </div>

      <div class="result-stat-grid">
        <div class="result-stat-card">
          <div class="result-stat-label">Original Price</div>
          <div class="result-stat-val">$${price.toFixed(2)}</div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-label">Discount Saved</div>
          <div class="result-stat-val" style="color: var(--accent-emerald);">−$${discountAmount.toFixed(2)}</div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-label">Sales Tax (${taxRate}%)</div>
          <div class="result-stat-val" style="color: var(--accent-amber);">+$${taxAmount.toFixed(2)}</div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-label">Final Out-of-Pocket</div>
          <div class="result-stat-val" style="color: var(--accent-primary);">$${finalTotal.toFixed(2)}</div>
        </div>
      </div>

      <div class="steps-wrapper">
        <div class="steps-header">
          <h4 class="steps-title"><span>📐</span> Step-by-Step Calculation Breakdown</h4>
        </div>

        <div class="step-card">
          <span class="step-num-badge">Step 1: Calculate Discount Amount</span>
          <div class="math-formula-box">\\text{Discount} = \\text{Original Price} \\times \\left(\\frac{\\text{Discount \\%}}{100}\\right)</div>
          <p class="step-content">
            \\text{Discount} = $${price.toFixed(2)} \\times ${(discountRate / 100).toFixed(4)} = <b>$${discountAmount.toFixed(2)}</b><br>
            \\text{Sale Price} = $${price.toFixed(2)} - $${discountAmount.toFixed(2)} = <b>$${discountedPrice.toFixed(2)}</b>
          </p>
        </div>

        <div class="step-card">
          <span class="step-num-badge">Step 2: Calculate Sales Tax on Discounted Price</span>
          <div class="math-formula-box">\\text{Sales Tax} = \\text{Sale Price} \\times \\left(\\frac{\\text{Tax Rate \\%}}{100}\\right)</div>
          <p class="step-content">
            \\text{Sales Tax} = $${discountedPrice.toFixed(2)} \\times ${(taxRate / 100).toFixed(4)} = <b>$${taxAmount.toFixed(2)}</b>
          </p>
        </div>

        <div class="step-card">
          <span class="step-num-badge">Step 3: Sum to Find Total Final Price</span>
          <div class="math-formula-box">\\text{Total Price} = \\text{Sale Price} + \\text{Sales Tax}</div>
          <p class="step-content">
            \\text{Total Price} = $${discountedPrice.toFixed(2)} + $${taxAmount.toFixed(2)} = <b>$${finalTotal.toFixed(2)}</b>
          </p>
        </div>
      </div>
    `;

    resultDiv.style.display = "block";
  }

  btnCalc.addEventListener("click", calculate);
  btnReset.addEventListener("click", () => {
    container.querySelector("#stOriginalPrice").value = "120";
    container.querySelector("#stTaxRate").value = "8.5";
    container.querySelector("#stDiscountRate").value = "15";
    resultDiv.style.display = "none";
  });

  calculate();
}

// 3. Tip & Bill Splitter Calculator
function renderTipCalculator(container, calcDef) {
  container.innerHTML = `
    <div class="form-grid">
      <div class="form-group">
        <label class="form-label" for="tipBillAmount">
          <span>Bill Subtotal ($)</span>
          <span class="form-label-hint">Before tip</span>
        </label>
        <div class="input-with-addon">
          <span class="input-addon">$</span>
          <input type="number" id="tipBillAmount" class="form-control" value="85.50" min="0.01" step="0.5">
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="tipPercentage">
          <span>Tip Percentage (%)</span>
          <span class="form-label-hint">Gratuity level</span>
        </label>
        <div class="input-with-addon">
          <input type="number" id="tipPercentage" class="form-control" value="18" min="0" max="100" step="1">
          <span class="input-addon suffix">%</span>
        </div>
        <!-- Quick Tip Presets -->
        <div style="display: flex; gap: 0.35rem; margin-top: 0.4rem;">
          <button type="button" class="btn btn-secondary btn-sm tip-preset-btn" data-tip="15">15%</button>
          <button type="button" class="btn btn-secondary btn-sm tip-preset-btn" data-tip="18">18%</button>
          <button type="button" class="btn btn-secondary btn-sm tip-preset-btn" data-tip="20">20%</button>
          <button type="button" class="btn btn-secondary btn-sm tip-preset-btn" data-tip="25">25%</button>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="tipNumPeople">
          <span>Split Between (People)</span>
          <span class="form-label-hint">Number of diners</span>
        </label>
        <div class="input-with-addon">
          <span class="input-addon">👥</span>
          <input type="number" id="tipNumPeople" class="form-control" value="3" min="1" max="100" step="1">
        </div>
      </div>
    </div>

    <div class="calc-actions">
      <button type="button" id="btnCalcTip" class="btn btn-primary">
        <span>⚡ Calculate Tip & Split</span>
      </button>
      <button type="button" id="btnResetTip" class="btn btn-secondary">
        <span>↺ Reset</span>
      </button>
    </div>

    <div id="tipResultContainer" class="results-section animate-fade-in" style="display: none;"></div>
  `;

  const btnCalc = container.querySelector("#btnCalcTip");
  const btnReset = container.querySelector("#btnResetTip");
  const resultDiv = container.querySelector("#tipResultContainer");
  const presetBtns = container.querySelectorAll(".tip-preset-btn");

  presetBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      container.querySelector("#tipPercentage").value = btn.dataset.tip;
      calculate();
    });
  });

  function calculate() {
    const bill = parseFloat(container.querySelector("#tipBillAmount").value) || 0;
    const tipPct = parseFloat(container.querySelector("#tipPercentage").value) || 0;
    const people = parseInt(container.querySelector("#tipNumPeople").value, 10) || 1;

    if (bill <= 0 || people < 1) {
      alert("Please enter a valid bill amount and at least 1 person.");
      return;
    }

    const tipAmount = bill * (tipPct / 100);
    const totalBill = bill + tipAmount;
    const perPersonTip = tipAmount / people;
    const perPersonTotal = totalBill / people;

    resultDiv.innerHTML = `
      <div class="result-hero-box">
        <span class="result-hero-label">Total Amount Per Person</span>
        <div class="result-hero-value">$${perPersonTotal.toFixed(2)} <span style="font-size: 1rem; font-weight: 500; color: var(--text-secondary);">/ person</span></div>
        <span style="font-size: 0.95rem; color: var(--text-secondary);">
          Total Tip: <b>$${tipAmount.toFixed(2)}</b> ($${perPersonTip.toFixed(2)}/person) | Grand Total: <b>$${totalBill.toFixed(2)}</b>
        </span>
      </div>

      <div class="result-stat-grid">
        <div class="result-stat-card">
          <div class="result-stat-label">Bill Subtotal</div>
          <div class="result-stat-val">$${bill.toFixed(2)}</div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-label">Total Tip (${tipPct}%)</div>
          <div class="result-stat-val" style="color: var(--accent-emerald);">+$${tipAmount.toFixed(2)}</div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-label">Grand Total</div>
          <div class="result-stat-val" style="color: var(--accent-primary);">$${totalBill.toFixed(2)}</div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-label">Split Among</div>
          <div class="result-stat-val">${people} ${people === 1 ? 'person' : 'people'}</div>
        </div>
      </div>

      <div class="steps-wrapper">
        <div class="steps-header">
          <h4 class="steps-title"><span>📐</span> Step-by-Step Gratuity Breakdown</h4>
        </div>

        <div class="step-card">
          <span class="step-num-badge">Step 1: Calculate Total Tip</span>
          <div class="math-formula-box">\\text{Tip Amount} = \\text{Subtotal} \\times \\left(\\frac{\\text{Tip \\%}}{100}\\right)</div>
          <p class="step-content">
            \\text{Tip Amount} = $${bill.toFixed(2)} \\times ${(tipPct / 100).toFixed(4)} = <b>$${tipAmount.toFixed(2)}</b>
          </p>
        </div>

        <div class="step-card">
          <span class="step-num-badge">Step 2: Add Tip to Subtotal</span>
          <div class="math-formula-box">\\text{Grand Total} = \\text{Subtotal} + \\text{Tip Amount}</div>
          <p class="step-content">
            \\text{Grand Total} = $${bill.toFixed(2)} + $${tipAmount.toFixed(2)} = <b>$${totalBill.toFixed(2)}</b>
          </p>
        </div>

        <div class="step-card">
          <span class="step-num-badge">Step 3: Divide Evenly Per Person</span>
          <div class="math-formula-box">\\text{Amount Per Person} = \\frac{\\text{Grand Total}}{\\text{Number of People}}</div>
          <p class="step-content">
            \\text{Per Person} = \\frac{\\$${totalBill.toFixed(2)}}{${people}} = <b>$${perPersonTotal.toFixed(2)} per person</b>
          </p>
        </div>
      </div>
    `;

    resultDiv.style.display = "block";
  }

  btnCalc.addEventListener("click", calculate);
  btnReset.addEventListener("click", () => {
    container.querySelector("#tipBillAmount").value = "85.50";
    container.querySelector("#tipPercentage").value = "18";
    container.querySelector("#tipNumPeople").value = "3";
    resultDiv.style.display = "none";
  });

  calculate();
}
