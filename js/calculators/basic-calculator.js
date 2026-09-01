/**
 * ============================================================================
 * Basic Standard Online Calculator (Reusable Engine for Homepage & Dedicated)
 * ============================================================================
 */

function getBasicCalculatorMarkup(prefix = "basic") {
  return `
    <div class="basic-calc-case">
      <!-- Display Screen -->
      <div class="basic-calc-screen">
        <div class="basic-screen-indicators">
          <span id="${prefix}MemIndicator" style="display: none; font-size: 0.72rem; font-weight: 800; color: var(--accent-emerald);">M</span>
          <span id="${prefix}ScreenHistory" class="basic-screen-history"></span>
        </div>
        <div id="${prefix}ScreenMain" class="basic-screen-main">0</div>
      </div>

      <!-- Keypad Grid -->
      <div class="basic-calc-keypad" id="${prefix}Keypad">
        <!-- Row 1: Memory & Clear -->
        <button type="button" class="calc-key key-mem" data-action="mc">MC</button>
        <button type="button" class="calc-key key-mem" data-action="mr">MR</button>
        <button type="button" class="calc-key key-mem" data-action="m-plus">M+</button>
        <button type="button" class="calc-key key-mem" data-action="m-minus">M−</button>
        <button type="button" class="calc-key key-clear" data-action="clear">C</button>

        <!-- Row 2: Secondary ops -->
        <button type="button" class="calc-key key-fn" data-action="sqrt">√</button>
        <button type="button" class="calc-key key-fn" data-action="percent">%</button>
        <button type="button" class="calc-key key-fn" data-action="negate">±</button>
        <button type="button" class="calc-key key-fn" data-action="backspace">⌫</button>
        <button type="button" class="calc-key key-op" data-action="divide">÷</button>

        <!-- Row 3: Numbers 7,8,9 & Multiply -->
        <button type="button" class="calc-key key-num" data-val="7">7</button>
        <button type="button" class="calc-key key-num" data-val="8">8</button>
        <button type="button" class="calc-key key-num" data-val="9">9</button>
        <button type="button" class="calc-key key-fn" data-action="sqr">x²</button>
        <button type="button" class="calc-key key-op" data-action="multiply">×</button>

        <!-- Row 4: Numbers 4,5,6 & Subtract -->
        <button type="button" class="calc-key key-num" data-val="4">4</button>
        <button type="button" class="calc-key key-num" data-val="5">5</button>
        <button type="button" class="calc-key key-num" data-val="6">6</button>
        <button type="button" class="calc-key key-fn" data-action="reciprocal">1/x</button>
        <button type="button" class="calc-key key-op" data-action="subtract">−</button>

        <!-- Row 5: Numbers 1,2,3 & Add -->
        <button type="button" class="calc-key key-num" data-val="1">1</button>
        <button type="button" class="calc-key key-num" data-val="2">2</button>
        <button type="button" class="calc-key key-num" data-val="3">3</button>
        <button type="button" class="calc-key key-num" data-val="00">00</button>
        <button type="button" class="calc-key key-op" data-action="add">+</button>

        <!-- Row 6: Zero, Decimal, Equals -->
        <button type="button" class="calc-key key-num" data-val="0" style="grid-column: span 2;">0</button>
        <button type="button" class="calc-key key-num" data-val=".">.</button>
        <button type="button" class="calc-key key-equals" data-action="equals" style="grid-column: span 2;">=</button>
      </div>
    </div>
  `;
}

function initBasicCalculatorEngine(rootElement, prefix = "basic", historyContainerId = null) {
  let currentInput = "0";
  let previousValue = null;
  let currentOperator = null;
  let shouldResetInput = false;
  let memoryValue = 0;
  const historyTapeList = [];

  const screenMain = rootElement.querySelector(`#${prefix}ScreenMain`);
  const screenHistory = rootElement.querySelector(`#${prefix}ScreenHistory`);
  const memIndicator = rootElement.querySelector(`#${prefix}MemIndicator`);
  const keypad = rootElement.querySelector(`#${prefix}Keypad`);
  const historyTape = historyContainerId ? document.getElementById(historyContainerId) : null;

  if (!screenMain || !keypad) return;

  function updateDisplay() {
    screenMain.textContent = currentInput;
    if (previousValue !== null && currentOperator) {
      const opSymbols = { add: "+", subtract: "−", multiply: "×", divide: "÷" };
      screenHistory.textContent = `${previousValue} ${opSymbols[currentOperator] || ""}`;
    } else {
      screenHistory.textContent = "";
    }
    if (memIndicator) {
      memIndicator.style.display = (memoryValue !== 0) ? "inline" : "none";
    }
  }

  function addHistory(expr, res) {
    if (!historyTape) return;
    historyTapeList.unshift({ expr, res });
    if (historyTapeList.length > 15) historyTapeList.pop();
    
    historyTape.innerHTML = historyTapeList.map(h => `
      <div style="display: flex; justify-content: space-between; padding: 0.35rem 0.6rem; background: var(--bg-subtle); border-radius: 4px; border: 1px solid var(--border-color); font-size: 0.82rem;">
        <span>${h.expr}</span>
        <b style="color: var(--accent-primary);">= ${h.res}</b>
      </div>
    `).join("");
  }

  function handleNumber(val) {
    if (shouldResetInput) {
      currentInput = (val === ".") ? "0." : val;
      shouldResetInput = false;
    } else {
      if (val === ".") {
        if (!currentInput.includes(".")) currentInput += ".";
      } else if (val === "00") {
        if (currentInput !== "0") currentInput += "00";
      } else {
        currentInput = (currentInput === "0") ? val : currentInput + val;
      }
    }
    updateDisplay();
  }

  function executeCalculation(a, b, op) {
    const numA = parseFloat(a);
    const numB = parseFloat(b);
    switch (op) {
      case "add": return numA + numB;
      case "subtract": return numA - numB;
      case "multiply": return numA * numB;
      case "divide": return (numB === 0) ? "Error" : numA / numB;
      default: return numB;
    }
  }

  function handleOperator(op) {
    if (currentOperator !== null && !shouldResetInput) {
      const result = executeCalculation(previousValue, currentInput, currentOperator);
      previousValue = result;
      currentInput = String(result);
    } else {
      previousValue = currentInput;
    }
    currentOperator = op;
    shouldResetInput = true;
    updateDisplay();
  }

  function handleEquals() {
    if (currentOperator === null || previousValue === null) return;
    const opSymbols = { add: "+", subtract: "−", multiply: "×", divide: "÷" };
    const expr = `${previousValue} ${opSymbols[currentOperator]} ${currentInput}`;
    const result = executeCalculation(previousValue, currentInput, currentOperator);
    
    const formattedRes = (typeof result === "number") ? Number(result.toFixed(10)).toString() : result;
    addHistory(expr, formattedRes);
    
    currentInput = formattedRes;
    previousValue = null;
    currentOperator = null;
    shouldResetInput = true;
    updateDisplay();
  }

  function handleAction(action) {
    switch (action) {
      case "clear":
        currentInput = "0";
        previousValue = null;
        currentOperator = null;
        shouldResetInput = false;
        break;
      case "backspace":
        if (!shouldResetInput) {
          currentInput = currentInput.length > 1 ? currentInput.slice(0, -1) : "0";
        }
        break;
      case "negate":
        currentInput = String(-parseFloat(currentInput) || 0);
        break;
      case "sqrt":
        const val = parseFloat(currentInput);
        if (val < 0) currentInput = "Error";
        else {
          const res = Number(Math.sqrt(val).toFixed(8)).toString();
          addHistory(`√(${val})`, res);
          currentInput = res;
        }
        shouldResetInput = true;
        break;
      case "sqr":
        const v2 = parseFloat(currentInput);
        const res2 = Number((v2 * v2).toFixed(8)).toString();
        addHistory(`sqr(${v2})`, res2);
        currentInput = res2;
        shouldResetInput = true;
        break;
      case "percent":
        currentInput = String((parseFloat(currentInput) || 0) / 100);
        break;
      case "reciprocal":
        const rVal = parseFloat(currentInput);
        currentInput = (rVal === 0) ? "Error" : Number((1 / rVal).toFixed(8)).toString();
        shouldResetInput = true;
        break;
      case "mc":
        memoryValue = 0;
        break;
      case "mr":
        currentInput = String(memoryValue);
        shouldResetInput = true;
        break;
      case "m-plus":
        memoryValue += parseFloat(currentInput) || 0;
        shouldResetInput = true;
        break;
      case "m-minus":
        memoryValue -= parseFloat(currentInput) || 0;
        shouldResetInput = true;
        break;
    }
    updateDisplay();
  }

  // Keypad click
  keypad.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    if (btn.dataset.val !== undefined) {
      handleNumber(btn.dataset.val);
    } else if (btn.dataset.action) {
      const act = btn.dataset.action;
      if (["add", "subtract", "multiply", "divide"].includes(act)) {
        handleOperator(act);
      } else if (act === "equals") {
        handleEquals();
      } else {
        handleAction(act);
      }
    }
  });

  // Physical Keyboard Listener
  function handleKeyDown(e) {
    if (!document.body.contains(rootElement)) {
      window.removeEventListener("keydown", handleKeyDown);
      return;
    }
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

    if ((e.key >= "0" && e.key <= "9") || e.key === ".") {
      e.preventDefault();
      handleNumber(e.key);
    } else if (e.key === "+") {
      e.preventDefault();
      handleOperator("add");
    } else if (e.key === "-") {
      e.preventDefault();
      handleOperator("subtract");
    } else if (e.key === "*") {
      e.preventDefault();
      handleOperator("multiply");
    } else if (e.key === "/") {
      e.preventDefault();
      handleOperator("divide");
    } else if (e.key === "Enter" || e.key === "=") {
      e.preventDefault();
      handleEquals();
    } else if (e.key === "Escape" || e.key.toLowerCase() === "c") {
      e.preventDefault();
      handleAction("clear");
    } else if (e.key === "Backspace") {
      e.preventDefault();
      handleAction("backspace");
    }
  }

  window.addEventListener("keydown", handleKeyDown);
  updateDisplay();
}

function renderBasicCalculator(container, calcDef) {
  container.innerHTML = `
    <div style="max-width: 420px; margin: 0 auto;">
      ${getBasicCalculatorMarkup("dedicatedBasic")}

      <div style="margin-top: 1.5rem; background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 1.25rem;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
          <h4 style="font-family: var(--font-heading); font-size: 1rem; font-weight: 700; display: flex; align-items: center; gap: 0.4rem;">
            <span>📜</span> Calculation History Tape
          </h4>
          <button type="button" onclick="document.getElementById('dedicatedBasicHistoryTape').innerHTML='<div style=\\'text-align: center; color: var(--text-muted); font-size: 0.8rem; padding: 0.5rem 0;\\'>No calculations yet.</div>';" class="btn btn-secondary btn-sm" style="font-size: 0.75rem; padding: 0.25rem 0.6rem;">Clear</button>
        </div>
        <div id="dedicatedBasicHistoryTape" style="max-height: 160px; overflow-y: auto; font-family: var(--font-mono); font-size: 0.85rem; color: var(--text-secondary); display: flex; flex-direction: column; gap: 0.35rem;">
          <div style="text-align: center; color: var(--text-muted); font-size: 0.8rem; padding: 0.5rem 0;">No calculations yet.</div>
        </div>
      </div>
    </div>
  `;

  initBasicCalculatorEngine(container, "dedicatedBasic", "dedicatedBasicHistoryTape");
}
