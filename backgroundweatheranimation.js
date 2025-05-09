let mode = 0; // 0 = sun, 1 = rain, 2 = thunder, 3 = moon
let flashInterval = null;

function toggleWeather() {
  const weather = document.getElementById("weather");
  const toppart = document.getElementById("top_part");

  // Stop thunder flashes if active
  if (flashInterval) {
    clearInterval(flashInterval);
    flashInterval = null;
  }

  weather.innerHTML = ""; // Clear content

  if (mode === 0) {
    // 🌧️ Rain mode
    weather.className = "weather-animation-container rain-bg";
    addRain(weather);
    toppart.style.color="#ffffff"
  } else if (mode === 1) {
    // ⛈️ Thunderstorm mode
    weather.className = "weather-animation-container rain-bg";
    addRain(weather);
    startFlashes(weather);
    toppart.style.color="#ffffff"
  } else if (mode === 2) {
    // 🌙 Moon mode
    weather.className = "weather-animation-container moon-bg";
    addMoon(weather);
    toppart.style.color="#ffffff"
  } else {
    // 🌞 Sun mode
    weather.className = "weather-animation-container sun-bg";
    const sun = document.createElement("div");
    sun.className = "sun";
    const rays = document.createElement("div");
    rays.className = "rays";
    weather.appendChild(sun);
    weather.appendChild(rays);
    toppart.style.color="#000000"
  }

  mode = (mode + 1) % 4;
}

function addRain(container) {
  const rainContainer = document.createElement("div");
  rainContainer.className = "rain";
  
  for (let i = 0; i < 150; i++) {
    const drop = document.createElement("div");
    drop.className = "raindrop";
    const left = Math.random() * 100;
    const delay = Math.random() * 5;
    const duration = 0.5 + Math.random() * 0.5;
    drop.style.left = `${left}vw`;
    drop.style.top = `${-Math.random() * 100}vh`;
    drop.style.animationDuration = `${duration}s`;
    drop.style.animationDelay = `${delay}s`;
    rainContainer.appendChild(drop);
  }
  container.appendChild(rainContainer);
}

function startFlashes(container) {
  flashInterval = setInterval(() => {
    const flashDiv = document.createElement("div");
    flashDiv.className = "flash";
    container.appendChild(flashDiv);
    setTimeout(() => container.removeChild(flashDiv), 200);
  }, 3000 + Math.random() * 4000);
}

function addMoon(container) {
  const moon = document.createElement("div");
  moon.className = "moon-container";
  const shadow = document.createElement("div");
  shadow.className = "shadow-mask";
  moon.appendChild(shadow);
  container.appendChild(moon);
}