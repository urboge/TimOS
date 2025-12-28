dynamicIsland = document.getElementById("dynamic-island");
dynamicIsland.style.width = "150px";
dynamicIsland.style.justifyContent = "right";
dynamicIsland.innerHTML = `<ion-icon id="dynamic-island-loading-icon" name="hourglass-outline" style="color: orange; margin-right: 5px; transform: rotate(720deg); transition: 1s;"></ion-icon>`;
dynamicIsland.style.fontSize = "22px";
dynamicIsland.style.top = "15px";
dynamicIsland.style.border = "solid 2px rgba(201, 121, 46, 1)"

window.onload = (event) => {
  dynamicIsland.style.width = "96px";
  dynamicIsland.innerHTML = ``
  dynamicIsland.style.fontSize = "26px";
  dynamicIsland.style.top = "5px";
  dynamicIsland.style.justifyContent = "center";
  dynamicIsland.style.border = "solid 2px rgba(0, 0, 0, 0.5)"
};

const photosIcon = document.getElementById("photos");

photosIcon.onclick = function () {
  setTimeout(myTimer, 1000);
  dynamicIsland.style.height = "100px";
  dynamicIsland.style.width = "100px";
  dynamicIsland.innerHTML = `<ion-icon name="checkmark-outline" style="color: green;"></ion-icon>`;
  dynamicIsland.style.fontSize = "60px";
  dynamicIsland.style.top = "10px";
  function myTimer() {
    dynamicIsland.style.height = "26px";
    dynamicIsland.style.width = "96px";
    dynamicIsland.innerHTML = ``
    dynamicIsland.style.fontSize = "26px";
    dynamicIsland.style.top = "5px";
    clearTimeout(myTimer);
  }
}
