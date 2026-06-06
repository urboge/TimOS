document.addEventListener("DOMContentLoaded", function () {

  const input = document.getElementById("calculator-input");

  let equation = "";
  let justCalculated = false;

  function updateDisplay() {
    input.value = equation || "0";
  }

  // Expose these globally so openCalculatorWithEquation can call them
  window.calAppendNumber = function(num) {
    if (justCalculated) { equation = ""; justCalculated = false; }
    equation += num;
    updateDisplay();
  }

  window.calAppendOperator = function(op) {
    if (!equation) return;
    const lastChar = equation.slice(-1);
    if (["+", "-", "*", "/"].includes(lastChar)) { equation = equation.slice(0, -1); }
    equation += op;
    justCalculated = false;
    updateDisplay();
  }

  window.calAppendDecimal = function() {
    const parts = equation.split(/[\+\-\*\/]/);
    const lastNumber = parts[parts.length - 1];
    if (!lastNumber.includes(".")) { equation += "."; updateDisplay(); }
  }

  window.calCalculate = function() {
    if (!equation) return;
    try {
      const result = Function("return " + equation)();
      equation = result.toString();
      justCalculated = true;
    } catch {
      equation = "";
      input.value = "Error";
      return;
    }
    updateDisplay();
  }

  window.calBackspace = function() {
    if (justCalculated) { equation = ""; justCalculated = false; }
    else { equation = equation.slice(0, -1); }
    updateDisplay();
  }

  window.calClearAll = function() {
    equation = "";
    justCalculated = false;
    updateDisplay();
  }

  document.getElementById("cal-btn-zero").onclick = () => window.calAppendNumber("0");
  document.getElementById("cal-btn-one").onclick = () => window.calAppendNumber("1");
  document.getElementById("cal-btn-two").onclick = () => window.calAppendNumber("2");
  document.getElementById("cal-btn-three").onclick = () => window.calAppendNumber("3");
  document.getElementById("cal-btn-four").onclick = () => window.calAppendNumber("4");
  document.getElementById("cal-btn-five").onclick = () => window.calAppendNumber("5");
  document.getElementById("cal-btn-six").onclick = () => window.calAppendNumber("6");
  document.getElementById("cal-btn-seven").onclick = () => window.calAppendNumber("7");
  document.getElementById("cal-btn-eight").onclick = () => window.calAppendNumber("8");
  document.getElementById("cal-btn-nine").onclick = () => window.calAppendNumber("9");

  document.getElementById("cal-btn-plus").onclick = () => window.calAppendOperator("+");
  document.getElementById("cal-btn-minus").onclick = () => window.calAppendOperator("-");
  document.getElementById("cal-btn-multiply").onclick = () => window.calAppendOperator("*");
  document.getElementById("cal-btn-divide").onclick = () => window.calAppendOperator("/");

  document.getElementById("cal-btn-point").onclick = window.calAppendDecimal;
  document.getElementById("cal-btn-equal").onclick = window.calCalculate;
  document.getElementById("cal-btn-delete").onclick = window.calClearAll;
  document.getElementById("cal-btn-backspace").onclick = window.calBackspace;

  updateDisplay();
});
