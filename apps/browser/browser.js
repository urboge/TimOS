const browserInput = document.getElementById("browser-input");
const browserSearchBtn = document.getElementById("browser-search-btn");
const browserIframe = document.getElementById("browser-iframe");

browserSearchBtn.addEventListener("click", () => {
  const url = browserInput.value.trim();
  if (!url) return;

  // Prepend https:// if missing
  const validUrl = url.startsWith("http://") || url.startsWith("https://") ? url : "https://" + url;

  browserIframe.src = validUrl;
});
