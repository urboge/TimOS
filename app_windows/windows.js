document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  let highestZ = 10;

  const appWindows = document.querySelectorAll(".app-window");

  appWindows.forEach((windowEl) => {
    // Random initial position near center
    const centerX = window.innerWidth / 2 - windowEl.offsetWidth / 2;
    const centerY = window.innerHeight / 2 - windowEl.offsetHeight / 2;
    const offsetX = (Math.random() - 0.5) * (window.innerWidth / 3);
    const offsetY = (Math.random() - 0.5) * (window.innerHeight / 3);
    windowEl.style.left = `${centerX + offsetX}px`;
    windowEl.style.top = `${centerY + offsetY}px`;

    // Bring window to front helper
    function bringToFront(win) {
      let maxZ = 10;
      document.querySelectorAll(".app-window").forEach((w) => {
        const z = parseInt(window.getComputedStyle(w).zIndex) || 10;
        if (z > maxZ) maxZ = z;
      });
      win.style.zIndex = maxZ + 1;
    }

    // === Dragging ===
    const titleBar = windowEl.querySelector(".title-bar");
    let isDragging = false;
    let dragOffsetX, dragOffsetY;
    let isFullscreen = false;
    let prevState = {};
    let dragStartX, dragStartY;
    let hasMoved = false;

    titleBar.addEventListener("mousedown", (e) => {
      if (e.target.tagName === "BUTTON") return;

      dragStartX = e.clientX;
      dragStartY = e.clientY;
      hasMoved = false;

      if (!isFullscreen) {
        isDragging = true;
        dragOffsetX = e.clientX - windowEl.offsetLeft;
        dragOffsetY = e.clientY - windowEl.offsetTop;
        bringToFront(windowEl);
      } else {
        // wait until user moves mouse to restore
        isDragging = true;
      }
    });

    document.addEventListener("mousemove", (e) => {
      if (!isDragging) return;

      const moveX = Math.abs(e.clientX - dragStartX);
      const moveY = Math.abs(e.clientY - dragStartY);

      if (isFullscreen && !hasMoved && (moveX > 10 || moveY > 10)) {
        // Restore once mouse actually moves enough
        windowEl.classList.remove("fullscreen");
        windowEl.style.width = prevState.width + "px";
        windowEl.style.height = prevState.height + "px";
        windowEl.style.left = e.clientX - prevState.width / 2 + "px";
        windowEl.style.top = e.clientY - 15 + "px"; // offset for title bar
        windowEl.style.borderRadius = prevState.borderRadius;
        windowEl.style.background = prevState.background;
        isFullscreen = false;

        // update offsets after restoring
        dragOffsetX = e.clientX - windowEl.offsetLeft;
        dragOffsetY = e.clientY - windowEl.offsetTop;
        hasMoved = true;
        bringToFront(windowEl);
      } else if (!isFullscreen) {
        // normal dragging with clamping
        let newLeft = e.clientX - dragOffsetX;
        let newTop = e.clientY - dragOffsetY;

        newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - windowEl.offsetWidth));
        newTop = Math.max(0, Math.min(newTop, window.innerHeight - windowEl.offsetHeight));

        windowEl.style.left = `${newLeft}px`;
        windowEl.style.top = `${newTop}px`;
      }
    });

    document.addEventListener("mouseup", () => {
      isDragging = false;
    });

    // === Corner Resizing ===
    let isResizing = false;
    let resizeDir = "";
    let startX, startY, startWidth, startHeight, startLeft, startTop;
    const edgeSize = 10;

    windowEl.addEventListener("mousemove", (e) => {
      if (isResizing || isFullscreen) return;

      const rect = windowEl.getBoundingClientRect();
      const nearLeft = e.clientX < rect.left + edgeSize;
      const nearRight = e.clientX > rect.right - edgeSize;
      const nearTop = e.clientY < rect.top + edgeSize;
      const nearBottom = e.clientY > rect.bottom - edgeSize;

      if (nearTop && nearLeft) {
        windowEl.style.cursor = "nwse-resize";
        resizeDir = "top-left";
      } else if (nearTop && nearRight) {
        windowEl.style.cursor = "nesw-resize";
        resizeDir = "top-right";
      } else if (nearBottom && nearLeft) {
        windowEl.style.cursor = "nesw-resize";
        resizeDir = "bottom-left";
      } else if (nearBottom && nearRight) {
        windowEl.style.cursor = "nwse-resize";
        resizeDir = "bottom-right";
      } else {
        resizeDir = "";
        if (!isResizing) windowEl.style.cursor = "";
      }
    });

    windowEl.addEventListener("mousedown", (e) => {
      if (!resizeDir || isFullscreen) return;

      isResizing = true;
      startX = e.clientX;
      startY = e.clientY;
      startWidth = windowEl.offsetWidth;
      startHeight = windowEl.offsetHeight;
      startLeft = windowEl.offsetLeft;
      startTop = windowEl.offsetTop;

      e.preventDefault();
      bringToFront(windowEl);
    });

    document.addEventListener("mousemove", (e) => {
      if (!isResizing) return;

      let dx = e.clientX - startX;
      let dy = e.clientY - startY;

      let newWidth = startWidth;
      let newHeight = startHeight;
      let newLeft = startLeft;
      let newTop = startTop;

      switch (resizeDir) {
        case "bottom-right":
          newWidth = startWidth + dx;
          newHeight = startHeight + dy;
          break;
        case "bottom-left":
          newWidth = startWidth - dx;
          newHeight = startHeight + dy;
          newLeft = startLeft + dx;
          break;
        case "top-right":
          newWidth = startWidth + dx;
          newHeight = startHeight - dy;
          newTop = startTop + dy;
          break;
        case "top-left":
          newWidth = startWidth - dx;
          newHeight = startHeight - dy;
          newLeft = startLeft + dx;
          newTop = startTop + dy;
          break;
      }

      if (newWidth > 150) {
        windowEl.style.width = `${newWidth}px`;
        windowEl.style.left = `${newLeft}px`;
      }
      if (newHeight > 100) {
        windowEl.style.height = `${newHeight}px`;
        windowEl.style.top = `${newTop}px`;
      }
    });

    document.addEventListener("mouseup", () => {
      isResizing = false;
      resizeDir = "";
      if (!isFullscreen) windowEl.style.cursor = "";
    });

    // === Close / Hide Buttons ===
    const closeBtn = windowEl.querySelector(".close-window");
    const hideBtn = windowEl.querySelector(".hide-window");

    closeBtn.addEventListener("click", () => {
      windowEl.style.display = "none";
    });

    hideBtn.addEventListener("click", () => {
      windowEl.style.display = "none";
    });

    // === Fullscreen Button ===
    const fullscreenBtn = windowEl.querySelector(".fullscreen-window");

    fullscreenBtn.addEventListener("click", () => {
      windowEl.style.transition = "all 0.3s ease";

      if (!isFullscreen) {
        // Save current state
        prevState = {
          width: windowEl.offsetWidth,
          height: windowEl.offsetHeight,
          left: windowEl.offsetLeft,
          top: windowEl.offsetTop,
          borderRadius: window.getComputedStyle(windowEl).borderRadius,
          background: window.getComputedStyle(windowEl).background,
        };

        // Fullscreen
        windowEl.style.width = window.innerWidth + "px";
        windowEl.style.height = window.innerHeight + "px";
        windowEl.style.left = "0px";
        windowEl.style.top = "0px";
        windowEl.style.borderRadius = "0px";

        windowEl.style.background = windowEl.classList.contains("dark-mode")
          ? "rgba(46,46,46,1)"
          : "rgba(255,255,255,1)";

        isFullscreen = true;
      } else {
        // Restore previous state
        windowEl.style.width = prevState.width + "px";
        windowEl.style.height = prevState.height + "px";
        windowEl.style.left = prevState.left + "px";
        windowEl.style.top = prevState.top + "px";
        windowEl.style.borderRadius = prevState.borderRadius;
        windowEl.style.background = prevState.background;

        isFullscreen = false;
      }

      bringToFront(windowEl);

      setTimeout(() => {
        windowEl.style.transition = "";
      }, 300);
    });
  });

  // === Dark Mode Toggle ===
  const darkModeBtn = document.getElementById("dark-mode-btn");
  darkModeBtn.onclick = function () {
    body.classList.toggle("dark-mode");
    document.querySelectorAll(".app-window").forEach((win) => {
      win.classList.toggle("dark-mode");
    });

    if (body.classList.contains("dark-mode")) {
      localStorage.setItem("theme", "dark");
    } else {
      localStorage.setItem("theme", "light");
    }
  };

  if (localStorage.getItem("theme") === "dark") {
    body.classList.add("dark-mode");
    document.querySelectorAll(".app-window").forEach((win) => {
      win.classList.add("dark-mode");
    });
  }

  // === Dock Icon Clicks ===
  const dockIcons = document.querySelectorAll(".app-icon");
  dockIcons.forEach((icon) => {
    const appWindow = document.getElementById(`${icon.id}-window`);
    if (!appWindow) return;

    icon.addEventListener("click", () => {
      if (appWindow.style.display === "none") {
        appWindow.style.display = "flex";
      }
      let maxZ = 10;
      document.querySelectorAll(".app-window").forEach((w) => {
        const z = parseInt(window.getComputedStyle(w).zIndex) || 10;
        if (z > maxZ) maxZ = z;
      });
      appWindow.style.zIndex = maxZ + 1;
    });
  });
});