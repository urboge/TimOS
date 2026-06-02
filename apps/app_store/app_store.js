document.getElementById("app-store-get-apps-section").innerHTML = `
   <!--watch-tk--> <div class="download-app-container"><div class="image-app-store"><img src="images/wallpapers/3.png" alt="image"></div><div class="app-app-store"><img src="images/app_icons/watchTK.png" alt="watch-tk"><p>WatchTK</p><button class="download-app-btn" id="download-app-btn-name-watchtk">Get</button></div></div>
   <!--Calculator--> <div class="download-app-container"><div class="image-app-store"><img src="apps/app_store/images/chat_bot.png" alt="image"></div><div class="app-app-store"><img src="images/app_icons/chat_bot.png" alt="chattkw"><p>ChatTKW</p><button class="download-app-btn" id="download-app-btn-name-chattkw">Get</button></div></div>
`;

function getDockApps() { dockApps = dock.innerHTML};

document.getElementById("download-app-btn-name-watchtk").onclick = function() {if(document.getElementById("download-app-btn-name-watchtk").innerText === "Open"){document.getElementById("watch-tk").click();}else{document.getElementById("watch-tk").style.display = "flex";document.getElementById("download-app-btn-name-watchtk").innerText = "Open";}};
document.getElementById("download-app-btn-name-chattkw").onclick = function() {if(document.getElementById("download-app-btn-name-chattkw").innerText === "Open"){document.getElementById("chat-bot").click();}else{document.getElementById("chat-bot").style.display = "flex";document.getElementById("download-app-btn-name-chattkw").innerText = "Open";}};