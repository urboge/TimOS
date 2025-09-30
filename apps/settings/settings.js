const floatingTaskbarBtn = document.getElementById("floating-taskbar-btn");
const floatingFullWidthBtn = document.getElementById("full-width-taskbar-btn");

let dock = document.getElementById("dock");

floatingFullWidthBtn.onmouseover = function() {
  dock.style.width = "100%"
  dock.style.bottom = "0"
  floatingFullWidthBtn.innerText = "hello"
}