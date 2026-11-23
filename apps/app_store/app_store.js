document.getElementById("app-store-get-apps-section").innerHTML = `
   <!--watch-tk--> <div class="download-app-container"><div class="image-app-store"><img src="images/wallpapers/3.png" alt="image"></div><div class="app-app-store"><img src="images/app_icons/watchTK.png" alt="watch-tk"><p>WatchTK</p><button class="download-app-btn" id="download-app-btn-name-watchtk">Get</button></div></div>
   <!--Calculator--> <div class="download-app-container"><div class="image-app-store"><img src="apps/app_store/images/chat_bot.png" alt="image"></div><div class="app-app-store"><img src="images/app_icons/chat_bot.png" alt="chattkw"><p>ChatTKW</p><button class="download-app-btn" id="download-app-btn-name-chattkw">Get</button></div></div>
`;

const INSTALLED_APPS_KEY = "timos-installed-apps";
const downloadableApps = {
  watchtk: {
    icon: document.getElementById("watch-tk"),
    button: document.getElementById("download-app-btn-name-watchtk")
  },
  chattkw: {
    icon: document.getElementById("chat-bot"),
    button: document.getElementById("download-app-btn-name-chattkw")
  }
};

function readInstalledApps() {
  try {
    const savedApps = JSON.parse(localStorage.getItem(INSTALLED_APPS_KEY) || "[]");
    return Array.isArray(savedApps) ? savedApps : [];
  } catch (error) {
    console.warn("Could not read installed apps from localStorage.", error);
    return [];
  }
}

function saveInstalledApps(installedApps) {
  try {
    localStorage.setItem(INSTALLED_APPS_KEY, JSON.stringify(installedApps));
  } catch (error) {
    console.warn("Could not save installed apps to localStorage.", error);
  }
}

function installApp(appId) {
  const app = downloadableApps[appId];
  if (!app) return;

  app.icon.classList.remove("uninstalled");
  app.icon.style.display = "flex";
  app.button.textContent = "Open";

  const installedApps = readInstalledApps();
  if (!installedApps.includes(appId)) {
    installedApps.push(appId);
    saveInstalledApps(installedApps);
  }
}

// Restore downloaded apps and their Get/Open buttons after every page load.
readInstalledApps().forEach(installApp);

Object.entries(downloadableApps).forEach(([appId, app]) => {
  app.button.addEventListener("click", () => {
    if (app.button.textContent === "Open") {
      app.icon.click();
      return;
    }
    installApp(appId);
  });
});
