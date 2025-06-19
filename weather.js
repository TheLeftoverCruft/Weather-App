let tempcalbarchart = ""
let windcalbarchart = ""
let raincalbarchart = ""
let humidcalbarchart = ""
let cloudcalbarchart = ""
let weatherData = []
let modifiedData={}
let totalcalc = []
let dalyhumidoutput = Array(16).fill(0);
let dalycloudoutput = Array(16).fill(0);
let moonlight =[];
let moonillumin = [];
let moonphase = [];
let iconsarray = [];
let moonphasearray = [];
let speedmultipler = 0;
let speedunit = "";
let tempmultipler = 0;
let tempunit = "";



//settings

function toggleSettings() {
  const tab = document.getElementById("settingsTab");
  tab.classList.toggle("active");
}


document.addEventListener("click", e => {
  const container = document.querySelector(".settings-button");
  const tab = document.getElementById("settingsTab");
  if (!container.contains(e.target) && !tab.contains(e.target) && tab.classList.contains("active")) {
    tab.classList.remove("active");
  }
});
const switchEl = document.getElementById('unitSwitch');
let isImperial = false;

function toggleSwitch() {
  
  if (getCookie("scientific")) {
    switchEl.classList.toggle('active');
    switchEl.setAttribute('aria-checked', 'true');
    console.log('Selected unit: Imperial');
    setUnits("imperial")
  
  } else {
    switchEl.classList.toggle('active');
    switchEl.setAttribute('aria-checked', 'false');
    console.log('Selected unit: Metric');
    setUnits("metric")

  }
location.reload();
}

if (getCookie("imperial")) {
  switchEl.classList.add('active');
}

switchEl.addEventListener('click', toggleSwitch);
switchEl.addEventListener('keydown', e => {
  if (e.key === ' ' || e.key === 'Enter') {
    e.preventDefault();
    toggleSwitch();
  }
});

//unit cookie -----------------------------------------------------------------
  function setCookie(name, value, days = 7) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/`;
  }
  
  // Get a cookie by name
  function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (let c of cookies) {
      const [key, value] = c.trim().split('=');
      if (key === name) return value;
    }
    return null;
  }
  
  // Delete a cookie by name
  function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
  
  // Rename a cookie (copy value and delete old one)
  function renameCookie(oldName, newName) {
    const value = getCookie(oldName);
    if (value) {
      setCookie(newName, value);
      deleteCookie(oldName);
    }
  }
  
  // Button click handler
  function setUnits(unit) {
    if (unit=="unidentfied") {
    if (getCookie("imperial")) {
      renameCookie("imperial", "scientific");
    } else if (getCookie("scientific")) {
      renameCookie("scientific", "imperial");
    } else {
      setCookie("scientific", "true");
    }
  }
  else {
    if (unit=="metric"&&getCookie("imperial")) {
      renameCookie("imperial", "scientific");
    } else if (unit=="imperial"&&getCookie("scientific")) {
      renameCookie("scientific", "imperial");
    }
  }
    
  }


function openTab(tabId) {
  const tabs = document.querySelectorAll('.tab');
  const infos = document.querySelectorAll('.info');
  tabs.forEach(tab => tab.classList.remove('active'));
  infos.forEach(info => info.classList.remove('active'));
  document.querySelector(`[onclick*="${tabId}"]`).classList.add('active');
  document.getElementById(tabId).classList.add('active');
}
  function mooniconfunction(percentage,phase) {
    
      if (phase=="New Moon"||phase=="Waxing Crescent"||phase=="Waxing Gibbous"||phase=="Full Moon") {
         iconsarray={              
          0: "🌑",
      1: "🌒",
      2: "🌓",
      3: "🌔",
      4: "🌕"}
        moonphasearray={              
          0: "New Moon",
      1: "Waxing Crescent",
      2: "3rd Quarter",
      3: "Waxing Gibbous",
      4: "Full Moon"}
          }

    if (phase=="New Moon"||phase=="Waning Crescent"||phase=="Waning Gibbous"||phase=="Full Moon") {
        iconsarray={              
          0: "🌑",
      1: "🌘",
      2: "🌗",
      3: "🌖",
      4: "🌕"}
        moonphasearray={              
          0: "New Moon",
      1: "Waning Crescent",
      2: "3rd Quarter",
      3: "Waning Gibbous",
      4: "Full Moon"}
          }

          return [iconsarray[Math.round(((percentage)-1)/25)] + " "+moonphasearray[Math.round(((percentage)-1)/25)]];
         

      

    };

async function getWeather(gpslat,gpslong,gpscity,gpscountry) {
  const location = document.getElementById("locationInput").value;
  const currentDiv = document.getElementById("currentWeather");
  const firstmornDiv = document.getElementById("currentmorning");
  const firstnightDiv = document.getElementById("currentnight");
  const secmornDiv = document.getElementById("tomorrowmorning");
  const locationtitle = document.getElementById("location");
  const errorMsg = document.getElementById("errorMsg");
  errorMsg.textContent = "";
  currentDiv.innerHTML = "Loading...";
  locationtitle.innerHTML = "";

  

  try {
    if (getCookie("scientific")) {
      speedmultipler = 1;
      speedunit = "km/h";
      tempmultipler = 1;
      tempunit = "°C";
    }
    else {
      speedmultipler = 0.621371;
      speedunit = "mph";
      tempmultipler = (9/5)+32;
      tempunit = "°F";
    }
    // gets latitude and longitude sand name
    if (typeof lat == "undefined"||typeof lon == "undefined") {}
    
    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1`);
    const geoData = await geoRes.json();


    if (!geoData.results || geoData.results.length === 0) {
      errorMsg.textContent = "Location not found.";
      currentDiv.innerHTML = "";

      return;
    }

    const today = new Date();
    const endDate = new Date();
    endDate.setDate(today.getDate() + 15); // 16 days

    const formatDate = date => date.toISOString().split('T')[0];
    const start_date = formatDate(today);
    const end_date = formatDate(endDate);

    let { latitude, longitude, name, country } = geoData.results[0];

    if (typeof gpslat !== "undefined"&&typeof gpslong !== "undefined"&&typeof gpscity !== "undefined"&&typeof gpscountry !== "undefined") {
      latitude = gpslat;
      longitude = gpslong;
      name = gpscity;
      country = gpscountry;
    }

    const weatherlocationfetch = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}`;
    const current_weather_fetch = `&current_weather=true`;
    const hourly_fetch = `&hourly=temperature_2m,wind_speed_10m,cloudcover,precipitation_probability,relative_humidity_2m`;
    const daily_fetch = `&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,windspeed_10m_max`;
    const time_fetch = `&timezone=auto&start_date=${start_date}&end_date=${end_date}`;


    
    // gets current weather from lat and long data
    const weatherRes = await fetch((weatherlocationfetch + current_weather_fetch + hourly_fetch + daily_fetch + time_fetch));

    weatherData = await weatherRes.json();


    if (getCookie("imperial")) {
    modifiedData = structuredClone(weatherData);
    console.log(modifiedData )
    modifiedData.daily.temperature_2m_max = weatherData.daily.temperature_2m_max.map(temp => Math.round((temp * (9/5))+32));
    modifiedData.daily.temperature_2m_min = weatherData.daily.temperature_2m_min.map(temp => Math.round((temp * (9/5))+32));    
    modifiedData.hourly.temperature_2m = weatherData.hourly.temperature_2m.map(temp => Math.round((temp * (9/5))+32));   
    modifiedData.daily.windspeed_10m_max = weatherData.daily.windspeed_10m_max.map(speed => Math.round((speed*0.621371)));
    modifiedData.hourly.wind_speed_10m = weatherData.hourly.wind_speed_10m.map(speed => Math.round((speed*0.621371)));    
    modifiedData.current_weather.temperature = Math.round(( weatherData.current_weather.temperature * (9/5))+32);
    weatherData = structuredClone(modifiedData);
  }
  const weather = weatherData.current_weather;

    let cloudCover = "Unavailable";
    let precipitation = "Unavailable";
    let humidity = "Unavailable";

    if (weatherData.hourly && weatherData.hourly.time) {
      const now = new Date(weather.time);
      const index = weatherData.hourly.time.findIndex(t => {
        const time = new Date(t);
        return time.getHours() === now.getHours() && time.getDate() === now.getDate();
      });
      if (index !== -1) {
        cloudCover = weatherData.hourly.cloudcover?.[index] ?? cloudCover;
        precipitation = weatherData.hourly.precipitation_probability?.[index] ?? precipitation_probability;
        humidity = weatherData.hourly.relativehumidity_2m?.[index] ?? humidity;
      }
    }

    let maxtemps = weatherData.daily.temperature_2m_max;
    const maxtemp = Math.max(...maxtemps);
    let mintemps = weatherData.daily.temperature_2m_min;
    const mintemp = Math.max(...mintemps);


    // Current moon phase


    for (let i = 0; i < 16; i++) {
      const checkDate = new Date(Date.now() + i * 86400000);
      const timestamp = Math.floor(checkDate.setHours(12, 0, 0, 0) / 1000);
      const moonRes = await fetch(`https://api.farmsense.net/v1/moonphases/?d=${timestamp}`);
      const moonData = await moonRes.json();
      
      if (moonData[0]) {
        moonlight[i]=moonData[0].Illumination;
        moonillumin=moonlight.map(n => n*100);
        moonphase[i]=moonData[0].Phase;
       
        
        // moonillumin += '<tr><th>'+timestamp+'</th><th>'+(Math.round((((Math.abs(moonilluminreq-moonData[0].Illumination))/moonilluminreq)**2)*100)/100)+'</th></tr>' ;
        
      }
    }


    locationtitle.innerHTML = `
          <h2>Weather in ${name}, ${country}</h2>
            <p id="todayinfo">Time: ${weather.time} , Geo Location: ${latitude},  ${longitude}</p>
        `;




    let firstmorndaytemp = weatherData.hourly.temperature_2m.slice(0, 12)
    const firstmornavgtemp = firstmorndaytemp.reduce((p, c, _, a) => p + c / a.length, 0);

    let firstmorndaywindspeed = weatherData.hourly.wind_speed_10m.slice(0, 12)
    const firstmornavgwindspeed = firstmorndaywindspeed.reduce((p, c, _, a) => p + c / a.length, 0);

    let firstmorndaycloudcover = weatherData.hourly.cloudcover.slice(0, 12)
    const firstmornavgcloudcover = firstmorndaycloudcover.reduce((p, c, _, a) => p + c / a.length, 0);

    let firstmorndayprecipation = weatherData.hourly.precipitation_probability.slice(0, 12)
    const firstmornavgprecipation = firstmorndayprecipation.reduce((p, c, _, a) => p + c / a.length, 0);

    let firstmorndayhumidity = weatherData.hourly.relative_humidity_2m.slice(0, 12)
    const firstmornavghumidity = firstmorndayhumidity.reduce((p, c, _, a) => p + c / a.length, 0);

  
    //splits data into days



    firstmornDiv.innerHTML = `

          <div class="day-wrapper">
          <h2>This Morning</h2>
          <div id="firstdaytempcolorchange" class="largercircle">
            <p id="firstdaytemperature" class="tempcircle"> ${Math.round(firstmornavgtemp)}${tempunit}</p>
            <p id="firstmaxmintemp" class="tempcircle"> Max: ${Math.max(...firstmorndaytemp)}${tempunit}  Min: ${Math.min(...firstmorndaytemp)}${tempunit} </p>
          </div>
          
          <div class="maindaytext">
            <p><strong>Windspeed:</strong><p></p> ${Math.round((firstmornavgwindspeed) * 100) / 100} ${speedunit}</p>
            <p><strong>Cloud Coverage:</strong><p></p> ${Math.round(firstmornavgcloudcover * 100) / 100}%</p>
            <p><strong>Precipitation:</strong><p></p> ${Math.round(firstmornavgprecipation * 100) / 100} %</p>
            <p><strong>Humidity:</strong><p></p> ${Math.round(firstmornavghumidity * 100) / 100}%</p>
            <p><strong>Moon Phase:</strong><p></p> ${mooniconfunction(moonillumin[0],moonphase[0])}</p>

            </div>
            
              </div>
        `;

    let firstnightdaytemp = weatherData.hourly.temperature_2m.slice(12, 24)
    const firstnightavgtemp = firstnightdaytemp.reduce((p, c, _, a) => p + c / a.length, 0);

    let firstnightdaywindspeed = weatherData.hourly.wind_speed_10m.slice(12, 24)
    const firstnightavgwindspeed = firstnightdaywindspeed.reduce((p, c, _, a) => p + c / a.length, 0);

    let firstnightdaycloudcover = weatherData.hourly.cloudcover.slice(12, 24)
    const firstnightavgcloudcover = firstnightdaycloudcover.reduce((p, c, _, a) => p + c / a.length, 0);

    let firstnightdayprecipation = weatherData.hourly.precipitation_probability.slice(12, 24)
    const firstnightavgprecipation = firstnightdayprecipation.reduce((p, c, _, a) => p + c / a.length, 0);

    let firstnightdayhumidity = weatherData.hourly.relative_humidity_2m.slice(12, 24)
    const firstnightavghumidity = firstnightdayhumidity.reduce((p, c, _, a) => p + c / a.length, 0);


    //splits data into days



    firstnightDiv.innerHTML = `

          <div class="day-wrapper">
          <h2>Tonight</h2>
          <div id="firstnighttempcolorchange" class="largercircle">
            <p id="firstdaytemperature" class="tempcircle"> ${Math.round(firstnightavgtemp)}${tempunit}</p>
            <p id="firstmaxmintemp" class="tempcircle"> Max: ${Math.max(...firstnightdaytemp)}${tempunit}  Min: ${Math.min(...firstnightdaytemp)}${tempunit} </p>
          </div>
          
          <div class="maindaytext">
            <p><strong>Windspeed:</strong><p></p> ${Math.round((firstnightavgwindspeed) * 100) / 100} ${speedunit}</p>
            <p><strong>Cloud Coverage:</strong><p></p> ${Math.round(firstnightavgcloudcover * 100) / 100}%</p>
            <p><strong>Precipitation:</strong><p></p> ${Math.round(firstnightavgprecipation * 100) / 100} %</p>
            <p><strong>Humidity:</strong><p></p> ${Math.round(firstnightavghumidity * 100) / 100}%</p>
            <p><strong>Moon Phase:</strong><p></p> ${mooniconfunction(moonillumin[0],moonphase[0])}</p>
            </div>
            
              </div>
        `;

    let secmorndaytemp = weatherData.hourly.temperature_2m.slice(24, 36)
    const secmornavgtemp = secmorndaytemp.reduce((p, c, _, a) => p + c / a.length, 0);

    let secmorndaywindspeed = weatherData.hourly.wind_speed_10m.slice(24, 36)
    const secmornavgwindspeed = secmorndaywindspeed.reduce((p, c, _, a) => p + c / a.length, 0);

    let secmorndaycloudcover = weatherData.hourly.cloudcover.slice(24, 36)
    const secmornavgcloudcover = secmorndaycloudcover.reduce((p, c, _, a) => p + c / a.length, 0);

    let secmorndayprecipation = weatherData.hourly.precipitation_probability.slice(24, 36)
    const secmornavgprecipation = secmorndayprecipation.reduce((p, c, _, a) => p + c / a.length, 0);

    let secmorndayhumidity = weatherData.hourly.relative_humidity_2m.slice(24, 36)
    const secmornavghumidity = secmorndayhumidity.reduce((p, c, _, a) => p + c / a.length, 0);


    //splits data into days



    secmornDiv.innerHTML = `

          <div class="day-wrapper">
          <h2>Tomorrow Morning</h2>
          <div id="secdaytempcolorchange" class="largercircle">

            <p id="firstdaytemperature" class="tempcircle"> ${Math.round(secmornavgtemp)}${tempunit}</p>
            <p id="firstmaxmintemp" class="tempcircle"> Max: ${Math.max(...secmorndaytemp)}${tempunit}  Min: ${Math.min(...secmorndaytemp)}${tempunit} </p>

          </div>
          
          <div class="maindaytext">
            <p><strong>Windspeed:</strong><p></p> ${Math.round((secmornavgwindspeed) * 100) / 100} ${speedunit}</p>
            <p><strong>Cloud Coverage:</strong><p></p> ${Math.round(secmornavgcloudcover * 100) / 100}%</p>
            <p><strong>Precipitation:</strong><p></p> ${Math.round(secmornavgprecipation * 100) / 100} %</p>
            <p><strong>Humidity:</strong><p></p> ${Math.round(secmornavghumidity * 100) / 100}%</p>
            <p><strong>Moon Phase:</strong><p></p> ${mooniconfunction(moonillumin[1],moonphase[1])}</p>

            </div>
            
              </div>
        `;

    const humidityTimes = weatherData.hourly.time.map(n => n.split(":")[0]);

    const humidityValues = weatherData.hourly.relative_humidity_2m;

    // Find index of current time in hourly data
    const index = humidityTimes.indexOf(weatherData.current_weather.time.split(":")[0]);

    const currentHumidity = humidityValues[index];


    // block for current temp in that city
    currentDiv.innerHTML = `
          <div class="today-wrapper">
          <div id="tempcolorchange" class="largercircle">
            <p id="todaytemperature" class="tempcircle"> ${Math.round((weather.temperature))}${tempunit}</p>
            <p id="maxmintemp" class="tempcircle"> Max: ${maxtemp}${tempunit}  Min: ${mintemp}${tempunit} </p>
          </div>
          <div class="todaytext">
            <p><strong>Windspeed:</strong> ${Math.round((weather.windspeed) * 100) / 100} ${speedunit}</p>
            <p><strong>Cloud Coverage:</strong> ${cloudCover}%</p>
            <p><strong>Precipitation:</strong> ${precipitation} %</p>
            <p><strong>Humidity:</strong> ${Math.round((currentHumidity) * 100) / 100}%</p>
            <p><strong>Moon Phase:</strong> ${mooniconfunction(moonillumin[0],moonphase[0])}</p>

            </div>
              </div>
        `;

    //Code for the Hourly Graph

    //Graph 1
    const linegraph1 = {
      datasets: [weatherData.hourly.temperature_2m],
      labels: ['Temperature'],
      colors: ['red'],
      unit: [tempunit]
    };

    //Graph 2
    const linegraph2 = {
      datasets: [
        weatherData.hourly.relative_humidity_2m,
        weatherData.hourly.precipitation_probability,
        weatherData.hourly.cloudcover
      ],
      labels: ['Humdity', 'Precipitation Chance', 'Cloud Cover'],
      colors: ['rgb(50, 170, 218)', 'rgb(55, 96, 184)', 'rgb(92, 108, 114)'],
      unit: ["%"]
    };

    //Graph 3
    const linegraph3 = {
      datasets: [weatherData.hourly.wind_speed_10m],
      labels: ['Wind Speed'],
      colors: ['rgb(192, 201, 73)'],
      unit: [speedunit]
    };

    const chartBlocks = document.querySelectorAll('.chart-block');
    drawLineChart(chartBlocks[0], weatherData.hourly.time, linegraph1.datasets, linegraph1.labels, linegraph1.colors, linegraph1.unit);
    drawLineChart(chartBlocks[1], weatherData.hourly.time, linegraph2.datasets, linegraph2.labels, linegraph2.colors, linegraph2.unit);
    drawLineChart(chartBlocks[2], weatherData.hourly.time, linegraph3.datasets, linegraph3.labels, linegraph3.colors, linegraph3.unit);


    [dalyhumidoutput, dalycloudoutput] = populatemultiday(weatherData)


    //Best Day----------------------------------------------------------------------------
    //Function to output difference between 




    const bargraph1 = {
      datasets: [weatherData.daily.temperature_2m_max,
      weatherData.daily.windspeed_10m_max,
      weatherData.daily.precipitation_probability_max,
        dalyhumidoutput,
        dalycloudoutput,
        moonillumin
      ],
      labels: ['Temperature', 'Windspeed', 'Precipitation Chance', 'Humidty', 'Cloud Cover', "Moon Light"],
      colors: ['red', 'rgb(192, 201, 73)', 'rgb(55, 96, 184)', 'rgb(50, 170, 218)', 'rgb(92, 108, 114)','rgb(199, 141, 204)'],
      unit: [tempunit, speedunit, '%', '%', "%","%"]
    };

    drawBarChart(document.getElementById('chart2'), weatherData.daily.time, bargraph1.datasets, bargraph1.labels, bargraph1.colors, bargraph1.unit);

    drawbarchartfast();






















    updateTemp(Math.round((weather.temperature)))
  } catch (error) {
    errorMsg.textContent = "Failed to load data.";
    currentDiv.innerHTML = "";

    console.error(error);
  }




}

function gpsgetWeather() {
        if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error);
      } else {
        document.getElementById("errorMsg").textContent = "Geolocation not supported.";
      }

      function success(position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
 


        const geocodeURL = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
        fetch(geocodeURL)
        .then(res => res.json())
        .then(data => {
            const city = data.address.city || data.address.town || data.address.village || "Unknown City";
            const country = data.address.country || "Unknown Country";
            document.getElementById("locationInput").value = `${city}`;
            getWeather(lat,lon,city,country)
        });

      }
      function error() {
        document.getElementById("errorMsg").textContent = "Location access denied.";
      }

  
}
//Changes temp color
function temperatureToColor(tempF) {
  let minTemp = 0;  // coldest
  let maxTemp = 40; // hottest

  if (getCookie("imperial")) {
       minTemp = 32;  // coldest
       maxTemp = 40*9/5+32; // hottest
  }

  // Clamp temperature to range
  const clamped = Math.max(minTemp, Math.min(maxTemp, tempF));
  const percent = (clamped - minTemp) / (maxTemp - minTemp);

  // Interpolate between blue (#00f), orange (#ffa500), and red (#f00)
  let r, g, b;

  if (percent < (1 / 3)) {
    // Blue to Green
    const ratio = percent / (1 / 3);
    r = 0;
    g = Math.round(0 + ratio * 170);       // 0 → 170
    b = Math.round(255 - ratio * 255);     // 255 → 0
  } else if (percent < (2 / 3)) {
    // Blue to Orange
    const ratio = (percent - (1 / 3)) / (1 / 3);
    r = Math.round(0 + ratio * 255);       // 0 → 255
    g = Math.round(170 - ratio * 5);       // 170 → 165 (minor shift)
    b = 0;
  } else {
    // Orange to Red
    const ratio = (percent - (2 / 3)) / (1 / 3);
    r = 255;
    g = Math.round(165 - ratio * 165);          // 165 → 0
    b = 0;
  }

  return `rgb(${r}, ${g}, ${b})`;
}

function updateTemp(input) {


  const tempSpan = document.querySelectorAll('.largercircle');


  tempSpan.forEach(tempcol => {
   
    tempid=document.querySelector(`#${tempcol.id}`);
   
    tempid.style.border = " 10px solid " + temperatureToColor(input);

  });
}

function updateTempbestandclosest(id, input) {


  const tempSpan = document.querySelector(id);


  tempSpan.style.border = " 10px solid " + temperatureToColor(input);


}

// Graph for Hourly

function drawLineChart(container, xLabels, datasets, datasetLabels, colors, unit) {
  const canvas = container.querySelector('.hourlycanvas');
  const ctx = canvas.getContext('2d');
  const tooltip = container.querySelector('.tooltip');
  const legend = container.querySelector('.legend');

  const padding = 50;
  const pointRadius = 4;

  const flatData = datasets.flat();
  const maxValue = Math.max(...flatData);
  const scaleY = (canvas.height - 2 * padding) / maxValue;
  const scaleX = (canvas.width - 2 * padding) / (xLabels.length - 1);

  function drawAxes() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.moveTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.stroke();

    ctx.fillStyle = 'black';
    ctx.font = '12px sans-serif';
    for (let i = 0; i <= maxValue; i += (10)) {
      const y = canvas.height - padding - i * scaleY;
      ctx.fillText((i+" "+unit), padding - 50, y + 4);
      ctx.beginPath();
      ctx.moveTo(padding - 5, y);
      ctx.lineTo(padding, y);
      ctx.stroke();
    }

    // xLabels.forEach((label, i) => {
    //   const x = padding + i * scaleX;
    //   ctx.fillText(label, x - 10, canvas.height - padding + 15);
    // });
  }

  function drawLines() {
    datasets.forEach((data, idx) => {
      ctx.beginPath();
      ctx.strokeStyle = colors[idx];
      data.forEach((value, i) => {
        const x = padding + i * scaleX;
        const y = canvas.height - padding - value * scaleY;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

    });
  }

  function drawLegend() {
    legend.innerHTML = '';
    datasetLabels.forEach((label, idx) => {
      const div = document.createElement('div');
      div.className = 'legend-item';
      div.innerHTML = `<div class="legend-color" style="background-color:${colors[idx]}"></div>${label} (${unit})`;
      legend.appendChild(div);
    });
  }

  function drawAll() {
    drawAxes();
    drawLines();
  }

  canvas.addEventListener('mousemove', function (e) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;

    let closestIndex = Math.round((mouseX - padding) / scaleX);
    if (closestIndex < 0 || closestIndex >= xLabels.length) {
      tooltip.style.display = 'none';
      drawAll();
      return;
    }

    drawAll();

    const x = padding + closestIndex * scaleX;
    ctx.beginPath();
    ctx.moveTo(x, padding);
    ctx.lineTo(x, canvas.height - padding);
    ctx.strokeStyle = '#aaa';
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.setLineDash([]);

    const label = xLabels[closestIndex];
    let info = `<strong>${label}</strong>`;
    datasets.forEach((d, i) => {
      info += `<br>${datasetLabels[i]}: ${d[closestIndex]} ${unit}`;
    });

    tooltip.innerHTML = info;
    const blockRect = container.getBoundingClientRect();
    tooltip.style.left = (e.clientX - blockRect.left + 15) + 'px';
    tooltip.style.top = (e.clientY - blockRect.top + 15) + 'px';
    tooltip.style.display = 'block';
  });

  canvas.addEventListener('mouseleave', () => {
    tooltip.style.display = 'none';
    drawAll();
  });

  drawAll();
  drawLegend();
}

function populatemultiday(weatherData) {
  const cards = document.querySelectorAll('.card');


  cards.forEach((card, i) => {


    let humidityavg = weatherData.hourly.relative_humidity_2m.slice((24 * (i)), (24 * (i + 1)))
    const dailyhumid = humidityavg.reduce((p, c, _, a) => p + c / a.length, 0);
    dalyhumidoutput[i] = (dailyhumid);

    let cloudavg = weatherData.hourly.cloudcover.slice((24 * (i)), (24 * (i + 1)))
    const dailycloud = cloudavg.reduce((p, c, _, a) => p + c / a.length, 0);
    dalycloudoutput[i] = (dailycloud);


    

    card.innerHTML = `

          <div class="card-wrapper">
          <h2> ${(weatherData.hourly.time[i * 24].split("T"))[0]}</h2>

          <div id="${card.id}tempcolorchange" class="largercircle circlemultiday">

            <p> ${weatherData.daily.temperature_2m_max[i]}${tempunit}</p>

          </div>
            <div class="daytext">
            <p><strong>Windspeed:</strong> ${Math.round((weatherData.daily.windspeed_10m_max[i]) * 100) / 100} ${speedunit}</p>
            <p><strong>Cloud Coverage:</strong> ${Math.round(dailycloud * 100) / 100}%</p>
            <p><strong>Precipitation:</strong> ${Math.round(weatherData.daily.precipitation_probability_max[i] * 100) / 100} %</p>
            <p><strong>Humidity:</strong> ${Math.round(dailyhumid * 100) / 100}%</p>
            <p><strong>Moon Phase:</strong> ${mooniconfunction(moonillumin[i],moonphase[i])}</p>

            </div>
          
            
              </div>
        `;

  });
  return [dalyhumidoutput, dalycloudoutput];
}

function drawBarChart(container, xLabels, datasets, datasetLabels, colors, unit) {
  const canvas = container.querySelector('.bestdaycanvas');
  const ctx = canvas.getContext('2d');
  const tooltip = container.querySelector('.tooltip');
  const legend = container.querySelector('.legend');

  const padding = 50;

  const flatData = datasets.flat();
  const maxValue = Math.max(...flatData);
  const scaleY = (canvas.height - 2 * padding) / maxValue;

  const groupCount = xLabels.length;
  const barCount = datasets.length;

  const groupWidth = (canvas.width - 2 * padding) / groupCount;
  const barWidth = groupWidth / barCount * 0.8;

  function drawAxes() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.stroke();

    ctx.fillStyle = 'black';
    ctx.font = '12px sans-serif';

    const step = Math.ceil(maxValue / 10) || 1;
    for (let i = 0; i <= maxValue; i += step) {
      const y = canvas.height - padding - i * scaleY;
      ctx.fillText(i, padding - 30, y + 4);
      ctx.beginPath();
      ctx.moveTo(padding - 5, y);
      ctx.lineTo(padding, y);
      ctx.stroke();
    }

    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    xLabels.forEach((label, i) => {
      const x = padding + i * groupWidth + groupWidth / 2;
      ctx.fillText((label.split("-")[1] + "-" + label.split("-")[2]), x, canvas.height - padding + 15);
    });
  }

  function drawBars() {
    datasets.forEach((data, dsIndex) => {
      ctx.fillStyle = colors[dsIndex];
      data.forEach((value, i) => {
        const x = padding + i * groupWidth + dsIndex * barWidth + barWidth * 0.1;
        const y = canvas.height - padding - value * scaleY;
        const height = value * scaleY;
        ctx.fillRect(x, y, barWidth, height);
      });
    });
  }

  function drawLegend() {
    legend.innerHTML = '';
    datasetLabels.forEach((label, idx) => {
      const div = document.createElement('div');
      div.className = 'legend-item';
      div.innerHTML = `<div class="legend-color" style="background-color:${colors[idx]}"></div>${label}`;
      legend.appendChild(div);
    });
  }

  function drawAll() {
    drawAxes();
    drawBars();
  }

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;

    let groupIndex = Math.floor((mouseX - padding) / groupWidth);
    if (groupIndex < 0 || groupIndex >= xLabels.length) {
      tooltip.style.display = 'none';
      drawAll();
      return;
    }

    drawAll();

    const x = padding + groupIndex * groupWidth + groupWidth / 2;
    ctx.beginPath();
    ctx.moveTo(x, padding);
    ctx.lineTo(x, canvas.height - padding);
    ctx.strokeStyle = '#aaa';
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.setLineDash([]);

    const label = xLabels[groupIndex];
    let info = `<strong>${label}</strong>`;
    datasets.forEach((d, i) => {
      info += `<br>${datasetLabels[i]}: ${Math.round(d[groupIndex] * 100) / 100} ${unit[i]}`;
    });

    tooltip.innerHTML = info;
    const blockRect = container.getBoundingClientRect();
    tooltip.style.left = (e.clientX - blockRect.left + 15) + 'px';
    tooltip.style.top = (e.clientY - blockRect.top + 15) + 'px';
    tooltip.style.display = 'block';
  });

  canvas.addEventListener('mouseleave', () => {
    tooltip.style.display = 'none';
    drawAll();
  });

  drawAll();
  drawLegend();
}



//soundboard slider
const soundboard = document.getElementById('soundboard');
const sliderCount = 6;

const sliderdetails = {
  max: [50, 50, 100, 100, 100, 100, 100],
  min: [-50, 0, 0, 0, 0, 0, 0],
  value: [0, 25, 50, 50, 50, 50, 50],
  unit: [tempunit, speedunit, '%', '%', '%', '%'],
  label: ["Temperature", "Wind Speed", 'Precipiation Chance', 'Humidity', 'Cloud Cover', 'Moon Phase']
};

for (let i = 1; i <= sliderCount; i++) {
  const container = document.createElement('div');
  container.className = 'slider-container';

  const label = document.createElement('div');
  label.className = 'slider-label';
  label.textContent = sliderdetails.label[i - 1];



  const slider = document.createElement('input');
  slider.type = 'range';
  slider.min = sliderdetails.min[i - 1];
  slider.max = sliderdetails.max[i - 1];
  slider.value = sliderdetails.value[i - 1];
  slider.step = 1;
  slider.id = `slider${i}`;
  slider.className = 'slider';

  const valueDisplay = document.createElement('div');
  valueDisplay.className = 'slider-value';
  valueDisplay.textContent = slider.value + sliderdetails.unit[i - 1];

  const inputBox = document.createElement('input');
  inputBox.className = 'extra-input';
  inputBox.type = 'number';
  inputBox.value = slider.value;



  slider.addEventListener('input', () => {
    valueDisplay.textContent = slider.value + sliderdetails.unit[i - 1];
    inputBox.value = slider.value
    drawbarchartfast()

  });




  // Extra input box without arrows
  const extraInput = document.createElement('input');
  extraInput.type = 'number';
  extraInput.className = 'extra-input';
  extraInput.id = 'extra-input' + i;
  extraInput.placeholder = '0';

  extraInput.addEventListener('input', () => {

    drawbarchartfast()

  });

  container.appendChild(label);
  container.appendChild(slider);
  container.appendChild(valueDisplay);
  container.appendChild(extraInput);
  soundboard.appendChild(container);
}

function drawbarchartfast() {
  tempcalbarchart = closestcalc(weatherData.daily.temperature_2m_max, parseInt((document.getElementById("slider1").value)), parseInt((document.querySelector("#extra-input1").value)));
  windcalbarchart = closestcalc(weatherData.daily.windspeed_10m_max, parseInt((document.getElementById("slider2").value)), parseInt((document.querySelector("#extra-input2").value)));
  raincalbarchart = closestcalc(weatherData.daily.precipitation_probability_max, parseInt((document.getElementById("slider3").value)), parseInt((document.querySelector("#extra-input3").value)));
  humidcalbarchart = closestcalc(dalyhumidoutput, parseInt((document.getElementById("slider4").value)), parseInt((document.querySelector("#extra-input4").value)));
  cloudcalbarchart = closestcalc(dalycloudoutput, parseInt((document.getElementById("slider5").value)), parseInt((document.querySelector("#extra-input5").value)));
  mooncalbarchart = closestcalc(moonillumin, parseInt((document.getElementById("slider6").value)), parseInt((document.querySelector("#extra-input6").value)));
  totalcalc = tempcalbarchart.map((value, index) => value + windcalbarchart[index] + raincalbarchart[index] + raincalbarchart[index] + humidcalbarchart[index] + cloudcalbarchart[index] + mooncalbarchart[index]);

  // const closestdayindex = dayclosestcalc.indexOf(Math.max(...dayclosestcalc))

  const bargraph2 = {
    datasets: [tempcalbarchart,
      windcalbarchart,
      raincalbarchart,
      humidcalbarchart,
      cloudcalbarchart,
      mooncalbarchart,
      totalcalc
    ],
    labels: ['Temperature', 'Windspeed', 'Precipitation Chance', 'Humidty', 'Cloud Cover', 'Moon Phase','Day Total'],
    colors: ['red', 'rgb(192, 201, 73)', 'rgb(55, 96, 184)', 'rgb(50, 170, 218)', 'rgb(92, 108, 114)', 'rgb(199, 141, 204)','rgb(0, 0, 0)'],
    unit: ["", '', '', '', "", "",""]
  };

  drawBarChart(document.getElementById('chart1'), weatherData.daily.time, bargraph2.datasets, bargraph2.labels, bargraph2.colors, bargraph2.unit);
  outputbestday(parseInt((document.getElementById("slider1").value)), parseInt((document.getElementById("slider2").value)), parseInt((document.getElementById("slider3").value)), parseInt((document.getElementById("slider4").value)), parseInt((document.getElementById("slider5").value)), parseInt((document.getElementById("slider6").value)))
}

//Percentage Difference Calc
function closestcalc(input, required, weighting) {


  if (weighting == (0) || Number.isNaN(weighting)) {
    weighting = 1;
  }


  required += 0.001;
  output = input.map(n => Math.round(((Math.abs(required - n) / (required + n))) * 1000000) / 1000000);

  // Create an array of [value, originalIndex] pairs
  const indexed = output.map((value, index) => ({ value, index }));

  // Sort by value (ascending)
  indexed.sort((a, b) => b.value - a.value);

  // Create an array to hold the ranks
  const ranks = new Array(input.length);

  // Assign ranks based on sorted order
  for (let rank = 0; rank < indexed.length; rank++) {
    ranks[indexed[rank].index] = (rank + 1) ** (weighting * 0.5);
  }

  return ranks;

}


function outputbestday(temp, wind, rain, humid, cloud, moon) {
  const bestdayDiv = document.getElementById("bestdayweather");



  bestdayDiv.innerHTML = `
             
          <div class="bestday-wrapper">
          <h2 id="bestdaytitle">Best Day</h2>
          <div class="bestdaywidget">
          <div id="bestdaytempcolorchange" class="mainlargercircle">

            <p id="bestdaytemperature" class="tempcircle"> ${Math.round(temp)}${tempunit}</p>

          </div>
          <div class="bestdayovertext">
          <div class="bestdaytext">
            <p><strong>Windspeed:</strong></p><p> ${Math.round((wind) * 100) / 100} ${speedunit}</p>
            <p><strong>Cloud Coverage:</strong></p><p> ${Math.round(cloud * 100) / 100}%</p>
          </div>
          <div class="bestdaytext">
            <p><strong>Humidity:</strong></p><p> ${Math.round(humid * 100) / 100}%</p>
            <p><strong>Precipitation Chance:</strong></p><p> ${Math.round(rain * 100) / 100} %</p>
            <p><strong>Moon Phase:</strong><p></p> ${moon} %</p>
          </div>
            </div>
            </div>
              </div>`;

  updateTempbestandclosest("#bestdaytempcolorchange", temp);
}

function outputclosestday() {
  getWeather();
  setTimeout(() => { // 1000 ms = 1 second
    const closestdayDiv = document.getElementById("closestdayweather");
    const closestdayindex = totalcalc.indexOf(Math.max(...totalcalc))

    closestdayDiv.innerHTML = `
             
          <div class="closestday-wrapper">
          <h2 id="closestdaytitle">Closest Day</h2>
          <h2>${weatherData.daily.time[closestdayindex]}</h2>
          <div class="closestdaywidget">
          <div id="closestdaytempcolorchange" class="mainlargercircle">

            <p id="closestdaytemperature" class="tempcircle"> ${Math.round(weatherData.daily.temperature_2m_max[closestdayindex])}${tempunit}</p>

          </div>
          <div class="closestdayovertext">
          <div class="closestdaytext">
            <p><strong>Windspeed:</strong></p><p> ${Math.round((weatherData.daily.windspeed_10m_max[closestdayindex]) * 100) / 100} ${speedunit}</p>
            <p><strong>Cloud Coverage:</strong></p><p> ${Math.round(dalycloudoutput[closestdayindex] * 100) / 100}%</p>
          </div>
          <div class="closestdaytext">
            <p><strong>Humidity:</strong></p><p> ${Math.round(dalyhumidoutput[closestdayindex] * 100) / 100}%</p>
            <p><strong>Precipitation Chance:</strong></p><p> ${Math.round(weatherData.daily.precipitation_probability_max[closestdayindex] * 100) / 100} %</p>
            <p><strong>Moon Phase:</strong><p></p> ${mooniconfunction(moonillumin[closestdayindex],moonphase[closestdayindex])}</p>
          </div>
          
            </div>
            </div>
              </div>`;

    updateTempbestandclosest("#closestdaytempcolorchange", Math.round(weatherData.daily.temperature_2m_max[closestdayindex]));
  }, 1000);
}

setUnits()