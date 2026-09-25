/**
 * ============================================================================
 * Date, Time & Physical Measurement Suite: Age Calculator, Time Duration,
 * Weight / Mass Unit Converter, and Business Days Calculator
 * ============================================================================
 */

// Local-timezone-safe ISO date (YYYY-MM-DD). toISOString() is UTC and shifts
// dates backwards for users east of UTC (e.g. Asia/Dhaka, Asia/Kolkata).
function toLocalIso(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// 1. Age Calculator (Exact Years, Months, Days & Next Birthday)
function renderAgeCalculator(container, calcDef) {
  const today = new Date();
  const todayStr = toLocalIso(today);

  container.innerHTML = `
    <div class="form-grid">
      <div class="form-group">
        <label class="form-label" for="ageBirthDate">
          <span>Date of Birth</span>
          <span class="form-label-hint">Month / Day / Year</span>
        </label>
        <input type="date" id="ageBirthDate" class="form-control" value="1998-05-15" max="${todayStr}" style="border: 1.5px solid var(--border-color); border-radius: var(--radius-md); background: var(--bg-input); font-size: 1rem;">
      </div>

      <div class="form-group">
        <label class="form-label" for="ageTargetDate">
          <span>Age at Date</span>
          <span class="form-label-hint">Default is today's date</span>
        </label>
        <input type="date" id="ageTargetDate" class="form-control" value="${todayStr}" style="border: 1.5px solid var(--border-color); border-radius: var(--radius-md); background: var(--bg-input); font-size: 1rem;">
      </div>
    </div>

    <div class="calc-actions">
      <button type="button" id="btnCalcAge" class="btn btn-primary">
        <span>⚡ Calculate Exact Age</span>
      </button>
      <button type="button" id="btnResetAge" class="btn btn-secondary">
        <span>↺ Reset</span>
      </button>
    </div>

    <div id="ageResultContainer" class="results-section animate-fade-in" style="display: none;"></div>
  `;

  const btnCalc = container.querySelector("#btnCalcAge");
  const btnReset = container.querySelector("#btnResetAge");
  const resultDiv = container.querySelector("#ageResultContainer");

  function calculate() {
    const bdayVal = container.querySelector("#ageBirthDate").value;
    const targetVal = container.querySelector("#ageTargetDate").value;

    if (!bdayVal || !targetVal) {
      alert("Please select both birth date and target date.");
      return;
    }

    const birth = new Date(bdayVal + 'T00:00:00');
    const target = new Date(targetVal + 'T00:00:00');

    if (target < birth) {
      alert("Target date cannot be earlier than birth date.");
      return;
    }

    let years = target.getFullYear() - birth.getFullYear();
    let months = target.getMonth() - birth.getMonth();
    let days = target.getDate() - birth.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    // Total units
    const diffMs = target - birth;
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;

    // Next Birthday calculation
    let nextBday = new Date(target.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBday < target) {
      nextBday.setFullYear(target.getFullYear() + 1);
    }
    const daysToNextBday = Math.ceil((nextBday - target) / (1000 * 60 * 60 * 24));

    resultDiv.innerHTML = `
      <div class="result-hero-box">
        <span class="result-hero-label">Your Exact Chronological Age</span>
        <div class="result-hero-value" style="font-size: 2.3rem;">
          ${years} <span style="font-size: 1.2rem; font-weight: 600;">years</span>, ${months} <span style="font-size: 1.2rem; font-weight: 600;">months</span>, ${days} <span style="font-size: 1.2rem; font-weight: 600;">days</span>
        </div>
        <span style="font-size: 0.95rem; color: var(--text-secondary);">
          🎂 Next Birthday: in <b>${daysToNextBday === 0 ? 'Today! 🎉' : daysToNextBday + ' days'}</b> (${nextBday.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })})
        </span>
      </div>

      <div class="result-stat-grid">
        <div class="result-stat-card">
          <div class="result-stat-label">Total Days Lived</div>
          <div class="result-stat-val" style="color: var(--accent-primary);">${totalDays.toLocaleString()} days</div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-label">Total Weeks</div>
          <div class="result-stat-val" style="color: var(--accent-emerald);">${totalWeeks.toLocaleString()} weeks</div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-label">Total Hours</div>
          <div class="result-stat-val">${totalHours.toLocaleString()} hrs</div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-label">Total Minutes</div>
          <div class="result-stat-val">${totalMinutes.toLocaleString()} mins</div>
        </div>
      </div>
    `;

    resultDiv.style.display = "block";
  }

  btnCalc.addEventListener("click", calculate);
  btnReset.addEventListener("click", () => {
    container.querySelector("#ageBirthDate").value = "1998-05-15";
    container.querySelector("#ageTargetDate").value = todayStr;
    resultDiv.style.display = "none";
  });

  calculate();
}

// 2. Time & Duration Calculator
function renderTimeCalculator(container, calcDef) {
  container.innerHTML = `
    <div class="form-grid">
      <div class="form-group">
        <label class="form-label" for="timeStart">
          <span>Start Time</span>
          <span class="form-label-hint">HH:MM:SS</span>
        </label>
        <div style="display: flex; gap: 0.4rem;">
          <input type="number" id="timeStartH" class="form-control" value="09" min="0" max="23" placeholder="HH" style="text-align: center; border: 1.5px solid var(--border-color); border-radius: var(--radius-md); background: var(--bg-input);">
          <span style="display: flex; align-items: center; font-weight: bold;">:</span>
          <input type="number" id="timeStartM" class="form-control" value="30" min="0" max="59" placeholder="MM" style="text-align: center; border: 1.5px solid var(--border-color); border-radius: var(--radius-md); background: var(--bg-input);">
          <span style="display: flex; align-items: center; font-weight: bold;">:</span>
          <input type="number" id="timeStartS" class="form-control" value="00" min="0" max="59" placeholder="SS" style="text-align: center; border: 1.5px solid var(--border-color); border-radius: var(--radius-md); background: var(--bg-input);">
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="timeEnd">
          <span>End Time</span>
          <span class="form-label-hint">HH:MM:SS</span>
        </label>
        <div style="display: flex; gap: 0.4rem;">
          <input type="number" id="timeEndH" class="form-control" value="17" min="0" max="23" placeholder="HH" style="text-align: center; border: 1.5px solid var(--border-color); border-radius: var(--radius-md); background: var(--bg-input);">
          <span style="display: flex; align-items: center; font-weight: bold;">:</span>
          <input type="number" id="timeEndM" class="form-control" value="45" min="0" max="59" placeholder="MM" style="text-align: center; border: 1.5px solid var(--border-color); border-radius: var(--radius-md); background: var(--bg-input);">
          <span style="display: flex; align-items: center; font-weight: bold;">:</span>
          <input type="number" id="timeEndS" class="form-control" value="00" min="0" max="59" placeholder="SS" style="text-align: center; border: 1.5px solid var(--border-color); border-radius: var(--radius-md); background: var(--bg-input);">
        </div>
      </div>
    </div>

    <div class="calc-actions">
      <button type="button" id="btnCalcTime" class="btn btn-primary">
        <span>⚡ Calculate Time Difference</span>
      </button>
      <button type="button" id="btnResetTime" class="btn btn-secondary">
        <span>↺ Reset</span>
      </button>
    </div>

    <div id="timeResultContainer" class="results-section animate-fade-in" style="display: none;"></div>
  `;

  const btnCalc = container.querySelector("#btnCalcTime");
  const btnReset = container.querySelector("#btnResetTime");
  const resultDiv = container.querySelector("#timeResultContainer");

  function calculate() {
    const sH = parseInt(container.querySelector("#timeStartH").value, 10) || 0;
    const sM = parseInt(container.querySelector("#timeStartM").value, 10) || 0;
    const sS = parseInt(container.querySelector("#timeStartS").value, 10) || 0;

    const eH = parseInt(container.querySelector("#timeEndH").value, 10) || 0;
    const eM = parseInt(container.querySelector("#timeEndM").value, 10) || 0;
    const eS = parseInt(container.querySelector("#timeEndS").value, 10) || 0;

    let startTotalSec = sH * 3600 + sM * 60 + sS;
    let endTotalSec = eH * 3600 + eM * 60 + eS;

    if (endTotalSec < startTotalSec) {
      endTotalSec += 24 * 3600; // Passed midnight
    }

    const diffSec = endTotalSec - startTotalSec;
    const hours = Math.floor(diffSec / 3600);
    const minutes = Math.floor((diffSec % 3600) / 60);
    const seconds = diffSec % 60;
    const decimalHours = diffSec / 3600;

    resultDiv.innerHTML = `
      <div class="result-hero-box">
        <span class="result-hero-label">Elapsed Time Duration</span>
        <div class="result-hero-value">${hours} hrs, ${minutes} mins, ${seconds} secs</div>
        <span style="font-size: 0.95rem; color: var(--text-secondary);">
          Decimal Hours: <b>${decimalHours.toFixed(4)} hours</b> | Total Minutes: <b>${(diffSec / 60).toFixed(2)} mins</b>
        </span>
      </div>

      <div class="result-stat-grid">
        <div class="result-stat-card">
          <div class="result-stat-label">Hours</div>
          <div class="result-stat-val" style="color: var(--accent-primary);">${hours} hrs</div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-label">Minutes</div>
          <div class="result-stat-val" style="color: var(--accent-emerald);">${minutes} mins</div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-label">Seconds</div>
          <div class="result-stat-val">${seconds} secs</div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-label">Total Seconds</div>
          <div class="result-stat-val">${diffSec.toLocaleString()} s</div>
        </div>
      </div>
    `;

    resultDiv.style.display = "block";
  }

  btnCalc.addEventListener("click", calculate);
  btnReset.addEventListener("click", () => {
    container.querySelector("#timeStartH").value = "09";
    container.querySelector("#timeStartM").value = "30";
    container.querySelector("#timeStartS").value = "00";
    container.querySelector("#timeEndH").value = "17";
    container.querySelector("#timeEndM").value = "45";
    container.querySelector("#timeEndS").value = "00";
    resultDiv.style.display = "none";
  });

  calculate();
}

// 3. Weight & Mass Unit Converter
function renderWeightConverter(container, calcDef) {
  container.innerHTML = `
    <div class="form-grid">
      <div class="form-group">
        <label class="form-label" for="weightInputVal">
          <span>Enter Value</span>
        </label>
        <input type="number" id="weightInputVal" class="form-control" value="75" step="any" style="border: 1.5px solid var(--border-color); border-radius: var(--radius-md); background: var(--bg-input); font-size: 1.1rem; font-weight: 700;">
      </div>

      <div class="form-group">
        <label class="form-label" for="weightFromUnit">
          <span>From Unit</span>
        </label>
        <select id="weightFromUnit" class="form-control">
          <option value="kg" selected>Kilograms (kg)</option>
          <option value="lbs">Pounds (lbs)</option>
          <option value="g">Grams (g)</option>
          <option value="oz">Ounces (oz)</option>
          <option value="st">Stone (st)</option>
          <option value="ton">Metric Tons (t)</option>
          <option value="uston">US Short Tons</option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label" for="weightToUnit">
          <span>To Unit</span>
        </label>
        <select id="weightToUnit" class="form-control">
          <option value="lbs" selected>Pounds (lbs)</option>
          <option value="kg">Kilograms (kg)</option>
          <option value="g">Grams (g)</option>
          <option value="oz">Ounces (oz)</option>
          <option value="st">Stone (st)</option>
          <option value="ton">Metric Tons (t)</option>
          <option value="uston">US Short Tons</option>
        </select>
      </div>
    </div>

    <div class="calc-actions">
      <button type="button" id="btnCalcWeight" class="btn btn-primary">
        <span>⚡ Convert Weight / Mass</span>
      </button>
      <button type="button" id="btnSwapWeight" class="btn btn-secondary">
        <span>⇄ Swap Units</span>
      </button>
    </div>

    <div id="weightResultContainer" class="results-section animate-fade-in" style="display: none;"></div>
  `;

  const btnCalc = container.querySelector("#btnCalcWeight");
  const btnSwap = container.querySelector("#btnSwapWeight");
  const resultDiv = container.querySelector("#weightResultContainer");

  const TO_KG = {
    kg: 1,
    g: 0.001,
    lbs: 0.45359237,
    oz: 0.028349523125,
    st: 6.35029318,
    ton: 1000,
    uston: 907.18474
  };

  const UNIT_NAMES = {
    kg: "Kilograms (kg)",
    g: "Grams (g)",
    lbs: "Pounds (lbs)",
    oz: "Ounces (oz)",
    st: "Stone (st)",
    ton: "Metric Tons (t)",
    uston: "US Short Tons"
  };

  function calculate() {
    const val = parseFloat(container.querySelector("#weightInputVal").value);
    const from = container.querySelector("#weightFromUnit").value;
    const to = container.querySelector("#weightToUnit").value;

    if (isNaN(val)) {
      alert("Please enter a valid number to convert.");
      return;
    }

    const kgVal = val * TO_KG[from];
    const converted = kgVal / TO_KG[to];

    resultDiv.innerHTML = `
      <div class="result-hero-box">
        <span class="result-hero-label">Converted Weight / Mass</span>
        <div class="result-hero-value">${Number(converted.toFixed(6)).toLocaleString()} <span style="font-size: 1.1rem; color: var(--text-secondary); font-weight: 600;">${to}</span></div>
        <span style="font-size: 0.95rem; color: var(--text-secondary);">
          ${val} ${from} = <b>${Number(converted.toFixed(6)).toLocaleString()} ${to}</b>
        </span>
      </div>

      <div class="steps-wrapper">
        <div class="steps-header">
          <h4 class="steps-title"><span>📐</span> Multi-Unit Conversion Matrix</h4>
        </div>

        <div class="result-stat-grid">
          <div class="result-stat-card">
            <div class="result-stat-label">Kilograms (kg)</div>
            <div class="result-stat-val">${(kgVal).toFixed(4)} kg</div>
          </div>
          <div class="result-stat-card">
            <div class="result-stat-label">Pounds (lbs)</div>
            <div class="result-stat-val">${(kgVal / TO_KG.lbs).toFixed(4)} lbs</div>
          </div>
          <div class="result-stat-card">
            <div class="result-stat-label">Ounces (oz)</div>
            <div class="result-stat-val">${(kgVal / TO_KG.oz).toFixed(2)} oz</div>
          </div>
          <div class="result-stat-card">
            <div class="result-stat-label">Grams (g)</div>
            <div class="result-stat-val">${(kgVal * 1000).toLocaleString()} g</div>
          </div>
        </div>
      </div>
    `;

    resultDiv.style.display = "block";
  }

  btnSwap.addEventListener("click", () => {
    const fromEl = container.querySelector("#weightFromUnit");
    const toEl = container.querySelector("#weightToUnit");
    const temp = fromEl.value;
    fromEl.value = toEl.value;
    toEl.value = temp;
    calculate();
  });

  btnCalc.addEventListener("click", calculate);
  calculate();
}

/* ==========================================================================
   Business Days & Working Day Calculator
   ========================================================================== */
function renderBusinessDaysCalculator(container, calcDef) {
  const today = new Date();
  const iso = toLocalIso;
  const in30 = new Date(today.getTime() + 30 * 86400000);

  container.innerHTML = `
    <div class="form-grid">
      <div class="form-group">
        <label class="form-label" for="bdMode">
          <span>Calculation Mode</span>
        </label>
        <select id="bdMode" class="form-control">
          <option value="count" selected>Count working days between two dates</option>
          <option value="add">Add / subtract working days from a date</option>
        </select>
      </div>

      <div class="form-group" id="bdStartGroup">
        <label class="form-label" for="bdStart">
          <span id="bdStartLabel">Start Date</span>
        </label>
        <input type="date" id="bdStart" class="form-control" value="${iso(today)}">
      </div>

      <div class="form-group" id="bdEndGroup">
        <label class="form-label" for="bdEnd">
          <span>End Date</span>
        </label>
        <input type="date" id="bdEnd" class="form-control" value="${iso(in30)}">
      </div>

      <div class="form-group" id="bdDaysGroup" style="display: none;">
        <label class="form-label" for="bdDays">
          <span>Working Days to Add / Subtract</span>
          <span class="form-label-hint">Negative = go backwards</span>
        </label>
        <input type="number" id="bdDays" class="form-control" value="10" step="1">
      </div>

      <div class="form-group">
        <label class="form-label" for="bdHolidays">
          <span>Holiday Dates (optional)</span>
          <span class="form-label-hint">One per line: YYYY-MM-DD</span>
        </label>
        <textarea id="bdHolidays" class="form-control" rows="3" placeholder="2026-12-25&#10;2027-01-01"></textarea>
      </div>

      <div class="form-group">
        <label class="form-label" for="bdInclusive">
          <span>Counting Options</span>
        </label>
        <select id="bdInclusive" class="form-control">
          <option value="exclude" selected>Exclude start date, include end date</option>
          <option value="include">Include both start and end dates</option>
        </select>
      </div>
    </div>

    <div class="calc-actions">
      <button type="button" id="btnCalcBd" class="btn btn-primary">
        <span>⚡ Calculate Business Days</span>
      </button>
      <button type="button" id="btnResetBd" class="btn btn-secondary">
        <span>↺ Reset</span>
      </button>
    </div>

    <div id="bdResultContainer" class="results-section animate-fade-in" style="display: none;"></div>
  `;

  const modeSel = container.querySelector("#bdMode");
  const startGroup = container.querySelector("#bdStartGroup");
  const endGroup = container.querySelector("#bdEndGroup");
  const daysGroup = container.querySelector("#bdDaysGroup");
  const startLabel = container.querySelector("#bdStartLabel");
  const btnCalc = container.querySelector("#btnCalcBd");
  const btnReset = container.querySelector("#btnResetBd");
  const resultDiv = container.querySelector("#bdResultContainer");

  function syncMode() {
    const isAdd = modeSel.value === "add";
    endGroup.style.display = isAdd ? "none" : "";
    daysGroup.style.display = isAdd ? "" : "none";
    startLabel.textContent = isAdd ? "Starting Date" : "Start Date";
  }

  function getHolidaySet() {
    const raw = container.querySelector("#bdHolidays").value || "";
    const set = new Set();
    raw.split(/[\n,;]+/).forEach(s => {
      const t = s.trim();
      if (/^\d{4}-\d{2}-\d{2}$/.test(t)) set.add(t);
    });
    return set;
  }

  const isWorkday = (d, holidays) => {
    const day = d.getDay();
    return day !== 0 && day !== 6 && !holidays.has(iso(d));
  };

  function countBetween(startStr, endStr, holidays, inclusive) {
    let start = new Date(startStr + "T00:00:00");
    let end = new Date(endStr + "T00:00:00");
    let flipped = false;
    if (start > end) {
      [start, end] = [end, start];
      flipped = true;
    }

    let count = 0;
    const cursor = new Date(start);
    if (!inclusive) cursor.setDate(cursor.getDate() + 1);
    while (cursor <= end) {
      if (isWorkday(cursor, holidays)) count++;
      cursor.setDate(cursor.getDate() + 1);
    }
    return { count, flipped };
  }

  function addWorkdays(startStr, n, holidays) {
    const cursor = new Date(startStr + "T00:00:00");
    const dir = n >= 0 ? 1 : -1;
    let remaining = Math.abs(n);
    while (remaining > 0) {
      cursor.setDate(cursor.getDate() + dir);
      if (isWorkday(cursor, holidays)) remaining--;
    }
    return cursor;
  }

  function calculate() {
    const mode = modeSel.value;
    const holidays = getHolidaySet();
    const startStr = container.querySelector("#bdStart").value;

    if (!startStr) {
      alert("Please enter a valid start date.");
      return;
    }

    if (mode === "count") {
      const endStr = container.querySelector("#bdEnd").value;
      if (!endStr) {
        alert("Please enter a valid end date.");
        return;
      }
      const inclusive = container.querySelector("#bdInclusive").value === "include";
      const { count, flipped } = countBetween(startStr, endStr, holidays, inclusive);

      const startDate = new Date(startStr + "T00:00:00");
      const endDate = new Date(endStr + "T00:00:00");
      const calendarDays = Math.round(Math.abs(endDate - startDate) / 86400000);

      resultDiv.innerHTML = `
        <div class="result-hero-box">
          <span class="result-hero-label">Business Days</span>
          <div class="result-hero-value">${count} <span style="font-size: 1.1rem; color: var(--text-secondary); font-weight: 600;">working days</span></div>
          <span style="font-size: 0.95rem; color: var(--text-secondary);">
            ${flipped ? "(end date was earlier than start — counted in reverse)" : ""}
            ${holidays.size ? ` · ${holidays.size} holiday${holidays.size > 1 ? "s" : ""} excluded` : ""}
          </span>
        </div>

        <div class="result-stat-grid">
          <div class="result-stat-card">
            <div class="result-stat-label">Total Calendar Days</div>
            <div class="result-stat-val">${calendarDays}</div>
          </div>
          <div class="result-stat-card">
            <div class="result-stat-label">Business Days</div>
            <div class="result-stat-val" style="color: var(--accent-emerald);">${count}</div>
          </div>
          <div class="result-stat-card">
            <div class="result-stat-label">Weekend / Holiday Off</div>
            <div class="result-stat-val">${calendarDays - count}</div>
          </div>
        </div>

        <div class="steps-wrapper" style="margin-top: 2rem;">
          <div class="steps-header">
            <h3 class="steps-title">📐 Calculation Breakdown</h3>
          </div>
          <div class="step-card">
            <span class="step-num-badge">Step 1 — Calendar Span</span>
            <div class="math-formula-box">calendar days = |end − start| ÷ 86,400,000 ms</div>
            <p class="step-content">${startStr} → ${endStr} = <b>${calendarDays} calendar days</b></p>
          </div>
          <div class="step-card">
            <span class="step-num-badge">Step 2 — Exclude Non-Working Days</span>
            <div class="math-formula-box">business days = calendar days − Sat/Sun − holidays</div>
            <p class="step-content">Each day is checked: Monday–Friday that is not a listed holiday counts. Result = <b>${count} business days</b>.</p>
          </div>
        </div>
      `;
    } else {
      const n = parseInt(container.querySelector("#bdDays").value, 10);
      if (isNaN(n) || n === 0) {
        alert("Please enter a non-zero number of working days.");
        return;
      }
      const resultDate = addWorkdays(startStr, n, holidays);
      const daysName = resultDate.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

      resultDiv.innerHTML = `
        <div class="result-hero-box">
          <span class="result-hero-label">${n >= 0 ? `${n} Working Days After` : `${Math.abs(n)} Working Days Before`}</span>
          <div class="result-hero-value" style="font-size: 1.6rem;">${daysName}</div>
          <span style="font-size: 0.95rem; color: var(--text-secondary);">
            ${holidays.size ? `${holidays.size} holiday${holidays.size > 1 ? "s" : ""} skipped · ` : ""}weekends skipped
          </span>
        </div>

        <div class="steps-wrapper" style="margin-top: 2rem;">
          <div class="steps-header">
            <h3 class="steps-title">📐 Calculation Breakdown</h3>
          </div>
          <div class="step-card">
            <span class="step-num-badge">Working Day Walk</span>
            <div class="math-formula-box">result = advance 1 day at a time, count Mon–Fri only</div>
            <p class="step-content">Starting from <b>${startStr}</b>, the calculator walks ${n >= 0 ? "forward" : "backward"}, skipping every Saturday, Sunday${holidays.size ? " and listed holiday" : ""}, until <b>${Math.abs(n)}</b> working days are accumulated.</p>
          </div>
        </div>
      `;
    }

    resultDiv.style.display = "block";
    resultDiv.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  modeSel.addEventListener("change", syncMode);
  btnCalc.addEventListener("click", calculate);
  btnReset.addEventListener("click", () => {
    modeSel.value = "count";
    container.querySelector("#bdStart").value = iso(new Date());
    container.querySelector("#bdEnd").value = iso(new Date(Date.now() + 30 * 86400000));
    container.querySelector("#bdDays").value = "10";
    container.querySelector("#bdHolidays").value = "";
    container.querySelector("#bdInclusive").value = "exclude";
    syncMode();
    resultDiv.style.display = "none";
  });

  syncMode();
  calculate();
}
