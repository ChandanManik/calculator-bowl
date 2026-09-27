/**
 * ============================================================================
 * Basic Standard Online Calculator (Reusable Engine for Homepage & Dedicated)
 * + Scientific Calculator (tokenizer + shunting-yard parser, DEG/RAD)
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

/* ==========================================================================
   Scientific Calculator — tokenizer + shunting-yard parser (no eval)
   Trig (DEG/RAD), log/ln, roots, powers, factorial, constants, parens
   ========================================================================== */
function renderScientificCalculator(container, calcDef) {
  const KEYS = [
    { l: "AC", a: "clear" }, { l: "⌫", a: "back" }, { l: "(", i: "(" }, { l: ")", i: ")" }, { l: "π", i: "pi" },
    { l: "sin", i: "sin(" }, { l: "cos", i: "cos(" }, { l: "tan", i: "tan(" }, { l: "log", i: "log(" }, { l: "ln", i: "ln(" },
    { l: "7", i: "7" }, { l: "8", i: "8" }, { l: "9", i: "9" }, { l: "÷", i: "/" }, { l: "√", i: "sqrt(" },
    { l: "4", i: "4" }, { l: "5", i: "5" }, { l: "6", i: "6" }, { l: "×", i: "*" }, { l: "^", i: "^" },
    { l: "1", i: "1" }, { l: "2", i: "2" }, { l: "3", i: "3" }, { l: "−", i: "-" }, { l: "%", i: "%" },
    { l: "0", i: "0" }, { l: ".", i: "." }, { l: "e", i: "e" }, { l: "+", i: "+" }, { l: "=", a: "eval" }
  ];

  const keyHtml = KEYS.map((k, idx) => {
    const accent = k.a === "eval" ? "var(--accent-emerald)"
      : k.a === "clear" ? "#ef4444"
      : /[a-z(]/i.test(k.l) && !/^[0-9.]$/.test(k.l) ? "var(--accent, #38bdf8)"
      : "var(--bg-subtle)";
    return `<button type="button" id="sciKey${idx}" class="sci-key"
      style="padding: 0.7rem 0.2rem; border-radius: 10px; border: 1px solid var(--border-color);
      background: ${accent}; color: ${k.a === "eval" || k.a === "clear" ? "#fff" : "var(--text-primary)"};
      font-weight: 700; font-size: 0.95rem; cursor: pointer;">${k.l}</button>`;
  }).join("");

  container.innerHTML = `
    <div class="form-grid">
      <div class="form-group" style="grid-column: 1 / -1;">
        <label class="form-label" for="sciExpr">Expression</label>
        <input type="text" id="sciExpr" class="form-control" spellcheck="false"
          placeholder="e.g. sin(30) + sqrt(144) * 2^3" style="font-family: var(--font-mono, monospace); font-size: 1.1rem;">
      </div>
      <div class="form-group">
        <label class="form-label" for="sciMode">Angle Mode</label>
        <select id="sciMode" class="form-control">
          <option value="deg" selected>Degrees (DEG)</option>
          <option value="rad">Radians (RAD)</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Result</label>
        <div id="sciResult" style="font-family: var(--font-mono, monospace); font-size: 1.5rem; font-weight: 800;
          padding: 0.6rem 0.9rem; border-radius: 10px; background: var(--bg-subtle); border: 1px solid var(--border-color);
          min-height: 3.1rem; word-break: break-all; color: var(--accent-emerald);">0</div>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; margin-top: 1rem;">${keyHtml}</div>

    <div id="sciSteps" style="margin-top: 1.25rem;"></div>
  `;

  const exprInput = container.querySelector("#sciExpr");
  const modeSel = container.querySelector("#sciMode");
  const resultEl = container.querySelector("#sciResult");
  const stepsDiv = container.querySelector("#sciSteps");

  const FUNCS = ["sin", "cos", "tan", "asin", "acos", "atan", "log", "ln", "log2", "sqrt", "cbrt", "abs", "exp", "round", "floor", "ceil"];
  const CONSTS = { pi: Math.PI, e: Math.E };

  function tokenize(src) {
    const tokens = [];
    let i = 0;
    const isDigit = c => c >= "0" && c <= "9";
    const prev = () => tokens[tokens.length - 1];
    while (i < src.length) {
      const c = src[i];
      if (c === " ") { i++; continue; }
      if (isDigit(c) || (c === "." && isDigit(src[i + 1]))) {
        let j = i;
        while (j < src.length && (isDigit(src[j]) || src[j] === ".")) j++;
        const num = parseFloat(src.slice(i, j));
        if (isNaN(num)) throw new Error("Invalid number literal");
        tokens.push({ t: "num", v: num });
        i = j;
        continue;
      }
      if (/[a-zA-Z]/.test(c)) {
        let j = i;
        while (j < src.length && /[a-zA-Z]/.test(src[j])) j++;
        const word = src.slice(i, j).toLowerCase();
        if (Object.prototype.hasOwnProperty.call(CONSTS, word)) {
          tokens.push({ t: "num", v: CONSTS[word] });
        } else if (FUNCS.includes(word)) {
          tokens.push({ t: "fn", v: word });
        } else {
          throw new Error('Unknown name "' + word + '"');
        }
        i = j;
        continue;
      }
      if ("+-*/^%!".includes(c)) {
        const p = prev();
        const unaryPos = !p || p.t === "op" || p.t === "fn" || (p.t === "par" && p.v === "(");
        if ((c === "-" || c === "+") && unaryPos) {
          // attach sign directly to a following number literal when possible
          let j = i + 1;
          while (j < src.length && src[j] === " ") j++;
          if (j < src.length && (isDigit(src[j]) || (src[j] === "." && isDigit(src[j + 1])))) {
            let k = j;
            while (k < src.length && (isDigit(src[k]) || src[k] === ".")) k++;
            const num = parseFloat(src.slice(j, k));
            if (isNaN(num)) throw new Error("Invalid number literal");
            tokens.push({ t: "num", v: c === "-" ? -num : num });
            i = k;
            continue;
          }
          tokens.push({ t: "op", v: c === "-" ? "u-" : "u+" });
          i++;
          continue;
        }
        tokens.push({ t: "op", v: c });
        i++;
        continue;
      }
      if (c === "(" || c === ")") { tokens.push({ t: "par", v: c }); i++; continue; }
      throw new Error('Unexpected character "' + c + '"');
    }
    return tokens;
  }

  function toRPN(tokens) {
    const out = [];
    const stack = [];
    const prec = { "u-": 4, "u+": 4, "^": 3, "*": 2, "/": 2, "%": 2, "+": 1, "-": 1 };
    const rightAssoc = { "^": true, "u-": true, "u+": true };
    const isOperator = tk => tk.t === "op";
    for (let idx = 0; idx < tokens.length; idx++) {
      const tk = tokens[idx];
      if (tk.t === "num") {
        out.push(tk);
      } else if (tk.t === "fn") {
        stack.push(tk);
      } else if (tk.t === "op") {
        if (tk.v === "!") { out.push(tk); continue; }
        while (stack.length) {
          const top = stack[stack.length - 1];
          if (top.t === "fn") { out.push(stack.pop()); continue; }
          if (top.t === "op" && top.v !== "!") {
            const tp = prec[top.v] !== undefined ? prec[top.v] : -1;
            const cp = prec[tk.v];
            if (tp > cp || (tp === cp && !rightAssoc[tk.v])) { out.push(stack.pop()); continue; }
          }
          break;
        }
        stack.push(tk);
      } else if (tk.t === "par" && tk.v === "(") {
        stack.push(tk);
      } else if (tk.t === "par" && tk.v === ")") {
        let found = false;
        while (stack.length) {
          const top = stack.pop();
          if (top.t === "par" && top.v === "(") { found = true; break; }
          out.push(top);
        }
        if (!found) throw new Error("Mismatched parentheses");
        if (stack.length && stack[stack.length - 1].t === "fn") out.push(stack.pop());
      }
    }
    while (stack.length) {
      const top = stack.pop();
      if (top.t === "par") throw new Error("Mismatched parentheses");
      out.push(top);
    }
    return out;
  }

  function factorial(n) {
    if (!Number.isInteger(n) || n < 0) throw new Error("Factorial needs a whole number ≥ 0");
    if (n > 170) throw new Error("Factorial overflows past 170! (double precision limit)");
    let r = 1;
    for (let i = 2; i <= n; i++) r *= i;
    return r;
  }

  function evalRPN(rpn, mode) {
    const deg = mode === "deg";
    const toRad = x => deg ? x * Math.PI / 180 : x;
    const fromRad = x => deg ? x * 180 / Math.PI : x;
    const applyFn = (name, a) => {
      switch (name) {
        case "sin": return Math.sin(toRad(a));
        case "cos": return Math.cos(toRad(a));
        case "tan": return Math.tan(toRad(a));
        case "asin": {
          if (a < -1 || a > 1) throw new Error("asin needs a value between −1 and 1");
          return fromRad(Math.asin(a));
        }
        case "acos": {
          if (a < -1 || a > 1) throw new Error("acos needs a value between −1 and 1");
          return fromRad(Math.acos(a));
        }
        case "atan": return fromRad(Math.atan(a));
        case "log": {
          if (a <= 0) throw new Error("log needs a positive value");
          return Math.log10(a);
        }
        case "ln": {
          if (a <= 0) throw new Error("ln needs a positive value");
          return Math.log(a);
        }
        case "log2": {
          if (a <= 0) throw new Error("log2 needs a positive value");
          return Math.log2(a);
        }
        case "sqrt": {
          if (a < 0) throw new Error("sqrt needs a non-negative value");
          return Math.sqrt(a);
        }
        case "cbrt": return Math.cbrt(a);
        case "abs": return Math.abs(a);
        case "exp": return Math.exp(a);
        case "round": return Math.round(a);
        case "floor": return Math.floor(a);
        case "ceil": return Math.ceil(a);
        default: throw new Error('Unknown function "' + name + '"');
      }
    };
    const applyOp = (op, a, b) => {
      switch (op) {
        case "+": return a + b;
        case "-": return a - b;
        case "*": return a * b;
        case "/":
          if (b === 0) throw new Error("Division by zero");
          return a / b;
        case "%":
          if (b === 0) throw new Error("Modulo by zero");
          return a - b * Math.trunc(a / b);
        case "^": return Math.pow(a, b);
        default: throw new Error('Unknown operator "' + op + '"');
      }
    };
    const st = [];
    for (const tk of rpn) {
      if (tk.t === "num") {
        st.push(tk.v);
      } else if (tk.t === "fn") {
        if (!st.length) throw new Error("Function missing its argument");
        st.push(applyFn(tk.v, st.pop()));
      } else if (tk.t === "op") {
        if (tk.v === "!") {
          if (!st.length) throw new Error("Invalid expression");
          st.push(factorial(st.pop()));
          continue;
        }
        if (tk.v === "u-") { if (!st.length) throw new Error("Invalid expression"); st.push(-st.pop()); continue; }
        if (tk.v === "u+") { if (!st.length) throw new Error("Invalid expression"); continue; }
        if (st.length < 2) throw new Error("Incomplete expression");
        const b = st.pop();
        const a = st.pop();
        st.push(applyOp(tk.v, a, b));
      }
    }
    if (st.length !== 1) throw new Error("Incomplete expression");
    return st[0];
  }

  function fmtResult(x) {
    if (!isFinite(x)) throw new Error(x > 0 ? "Result overflows to Infinity" : "Result is not finite");
    if (x === 0) return "0";
    const a = Math.abs(x);
    if (a >= 1e12 || a < 1e-9) return x.toExponential(8);
    return String(Number(x.toPrecision(12)));
  }

  function rpnLabel(rpn) {
    return rpn.map(tk => {
      if (tk.t === "num") return String(Number(tk.v.toPrecision(6)));
      if (tk.t === "fn") return tk.v + "()";
      return tk.v;
    }).join(" ");
  }

  function calculate() {
    const src = (exprInput.value || "").trim();
    if (!src) {
      resultEl.textContent = "0";
      resultEl.style.color = "var(--accent-emerald)";
      stepsDiv.innerHTML = "";
      return;
    }
    try {
      const tokens = tokenize(src);
      if (!tokens.length) throw new Error("Empty expression");
      const rpn = toRPN(tokens);
      const value = evalRPN(rpn, modeSel.value);
      const out = fmtResult(value);
      resultEl.textContent = out;
      resultEl.style.color = "var(--accent-emerald)";
      stepsDiv.innerHTML = `
        <div class="steps-wrapper">
          <div class="steps-header"><h3 class="steps-title">📐 Parse Breakdown</h3></div>
          <div class="step-card">
            <span class="step-num-badge">Step 1 — Tokens → RPN (shunting-yard)</span>
            <div class="math-formula-box">${rpnLabel(rpn)}</div>
            <p class="step-content">Expression: <b>${src.replace(/</g, "&lt;")}</b> · angle mode <b>${modeSel.value === "deg" ? "DEG" : "RAD"}</b> · result <b>${out}</b></p>
          </div>
        </div>`;
    } catch (err) {
      resultEl.textContent = "Error";
      resultEl.style.color = "#ef4444";
      stepsDiv.innerHTML = `
        <div class="step-card" style="border-left: 3px solid #ef4444;">
          <span class="step-num-badge" style="background: #ef4444;">Invalid Expression</span>
          <p class="step-content">${String(err.message || err).replace(/</g, "&lt;")}</p>
        </div>`;
    }
  }

  KEYS.forEach((k, idx) => {
    const btn = container.querySelector("#sciKey" + idx);
    btn.addEventListener("click", () => {
      if (k.a === "clear") {
        exprInput.value = "";
      } else if (k.a === "back") {
        exprInput.value = exprInput.value.slice(0, -1);
      } else if (k.a === "eval") {
        calculate();
        return;
      } else {
        exprInput.value += k.i;
      }
      calculate();
    });
  });

  exprInput.addEventListener("change", calculate);
  exprInput.addEventListener("keydown", ev => {
    if (ev && ev.key === "Enter") calculate();
  });
  modeSel.addEventListener("change", calculate);

  // sensible default expression
  exprInput.value = "";
  calculate();
}
