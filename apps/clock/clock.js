function updateClock() {
  const hourHand = document.getElementById("hand-hour");
  const minuteHand = document.getElementById("hand-minute");
  const secondHand = document.getElementById("hand-second");

  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  const hourRotation = (hours % 12) * 30 + (minutes / 60) * 30;
  const minuteRotation = minutes * 6;
  const secondRotation = seconds * 6;

  hourHand.style.transform = `translateX(-50%) rotate(${hourRotation}deg)`;
  minuteHand.style.transform = `translateX(-50%) rotate(${minuteRotation}deg)`;
  secondHand.style.transform = `translateX(-50%) rotate(${secondRotation}deg)`;
}

document.addEventListener("DOMContentLoaded", updateClock);
setInterval(updateClock, 1000);
