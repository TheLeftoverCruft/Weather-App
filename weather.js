  // slider


  const sliders = document.querySelectorAll('.slider');

  sliders.forEach(slider => {
    if (getCookie("imperial")) {
      slider.addEventListener('input', function(event) {
        const sliderId = event.target.id; // Get the ID of the slider that triggered the event
        // console.log('.'+sliderId.replace('Slider','Display'));
        display =document.getElementById(sliderId.replace('Slider','Display'));
        // console.log(display)
        
        const valuetype = {
          "tempSlider": "°F",
          "windSlider": "mph",
          "cloudSlider": "%",
          "rainSlider": "%",
          "humiditySlider": "%",
          "moonSlider": "%",
          
        };
        display.textContent = `${event.target.value}`+valuetype[sliderId];
        // console.log("Slider ID:", sliderId); // Logs 'moonSlider'
      });
    } else if (getCookie("scientific")) {
      slider.addEventListener('input', function(event) {
        const sliderId = event.target.id; // Get the ID of the slider that triggered the event
        // console.log('.'+sliderId.replace('Slider','Display'));
        display =document.getElementById(sliderId.replace('Slider','Display'));
        // console.log(display)
        
        const valuetype = {
          "tempSlider": "°C",
          "windSlider": "km/h",
          "cloudSlider": "%",
          "rainSlider": "%",
          "humiditySlider": "%",
          "moonSlider": "%",
          
        };
        display.textContent = `${event.target.value}`+valuetype[sliderId];
        // console.log("Slider ID:", sliderId); // Logs 'moonSlider'
      });
    } else {
      slider.addEventListener('input', function(event) {
        const sliderId = event.target.id; // Get the ID of the slider that triggered the event
        // console.log('.'+sliderId.replace('Slider','Display'));
        display =document.getElementById(sliderId.replace('Slider','Display'));
        // console.log(display)
        
        const valuetype = {
          "tempSlider": "°C",
          "windSlider": "km/h",
          "cloudSlider": "%",
          "rainSlider": "%",
          "humiditySlider": "%",
          "moonSlider": "%",
          
        };
        display.textContent = `${event.target.value}`+valuetype[sliderId];
        // console.log("Slider ID:", sliderId); // Logs 'moonSlider'
      });
    }
    slider.addEventListener('input', function(event) {
      const sliderId = event.target.id; // Get the ID of the slider that triggered the event
      // console.log('.'+sliderId.replace('Slider','Display'));
      display =document.getElementById(sliderId.replace('Slider','Display'));
      // console.log(display)
      
      const valuetype = {
        "tempSlider": "°C",
        "windSlider": "km/h",
        "cloudSlider": "%",
        "rainSlider": "%",
        "humiditySlider": "%",
        "moonSlider": "%",
        
      };
      display.textContent = `${event.target.value}`+valuetype[sliderId];
      // console.log("Slider ID:", sliderId); // Logs 'moonSlider'
    });
  });

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
  function setUnits() {
    if (getCookie("imperial")) {
      renameCookie("imperial", "scientific");
    } else if (getCookie("scientific")) {
      renameCookie("scientific", "imperial");
    } else {
      setCookie("imperial", "true");
    }
    location.reload();
  }

  function closestcalc(input,required,range) {
    required+=0.001;
    output = input.map(n => Math.round(((Math.abs(required-n)/required)/range)*100)/100)
    return (output)
    
  }

  function closestcalc4temp(input,required,range) {
    required+=0.001;
    output = input.map(n => Math.round(((Math.abs(required-n)/required)/(2))/100)/(100))
    return (output)
    
  }

// search

function getSliderUnit() {
  if (getCookie("imperial")) {

    setslidersImp()
  } else if (getCookie("scientific")) {

    setslidersSci()
  } else {

    setslidersSci()
  }
}

async function getWeather() {
    const location = document.getElementById("locationInput").value;
    const currentDiv = document.getElementById("currentWeather");
    const bestdayDiv = document.getElementById("fullMoonWeather");
    const clostestdaydiv = document.getElementById("closestday");
    const errorMsg = document.getElementById("errorMsg");
    errorMsg.textContent = "";
    currentDiv.innerHTML = "Loading...";
    bestdayDiv.innerHTML = "Loading...";
    clostestdaydiv.innerHTML = "Loading...";


   
      if (getCookie("imperial")) {
        
        try {
          // gets latitude and longitude sand name
          const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1`);
          const geoData = await geoRes.json();
      
    
          if (!geoData.results || geoData.results.length === 0) {
            errorMsg.textContent = "Location not found.";
            currentDiv.innerHTML = "";
            bestdayDiv.innerHTML = "";
            return;
          }
    
          const { latitude, longitude, name, country } = geoData.results[0];
    
          // gets current weather from lat and long data
          const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=cloudcover,precipitation_probability,relativehumidity_2m&timezone=auto`);
          const weatherData = await weatherRes.json();
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
    
          // Current moon phase
          const today = new Date();
          const timestamp = Math.floor(today.setHours(12, 0, 0, 0) / 1000);
          const moonRes = await fetch(`https://api.farmsense.net/v1/moonphases/?d=${timestamp}`);
          const moonData = await moonRes.json();
    
          let moonPhase = "Unavailable";
          let moonIcon = "";
          const mooniconMap = {
            "New Moon": "🌑",
            "Waxing Crescent": "🌒",
            "1st Quarter": "🌓",
            "Waxing Gibbous": "🌔",
            "Full Moon": "🌕",
            "Waning Gibbous": "🌖",
            "3rd Quarter": "🌗",
            "Waning Crescent": "🌘"
          };
          if (moonData && moonData[0] && moonData[0].Phase) {
            moonPhase = moonData[0].Phase;
            moonIcon = mooniconMap[moonPhase] || "";
          }
    
          // block for current temp in that city
          currentDiv.innerHTML = `
            <h2>Current Weather in ${name}, ${country}</h2>
            <p><strong>Temperature:</strong> ${Math.round((weather.temperature)*(9/5)+(32))}°C</p>
            <p><strong>Windspeed:</strong> ${Math.round((weather.windspeed)*0.621371*100)/100} km/h</p>
            <p><strong>Cloud Coverage:</strong> ${cloudCover}%</p>
            <p><strong>Precipitation:</strong> ${precipitation} %</p>
            <p><strong>Humidity:</strong> ${humidity}%</p>
            <p><strong>Moon Phase:</strong> ${moonIcon} ${moonPhase}</p>
            <p><em>Last Updated:</em> ${weather.time}</p>
          `;
     
    
          // thrid tab
    
          try {
        
            let moonillumin = [];
            let moonphase = [];
            for (let i = 0; i < 16; i++) {
              const checkDate = new Date(Date.now() + i * 86400000);
              const timestamp = Math.floor(checkDate.setHours(12, 0, 0, 0) / 1000);
              const moonRes = await fetch(`https://api.farmsense.net/v1/moonphases/?d=${timestamp}`);
              const moonData = await moonRes.json();
             
              if (moonData[0]) {
                moonillumin[i]=moonData[0].Illumination;
                moonphase[i]=moonData[0].Phase;
                
                // moonillumin += '<tr><th>'+timestamp+'</th><th>'+(Math.round((((Math.abs(moonilluminreq-moonData[0].Illumination))/moonilluminreq)**2)*100)/100)+'</th></tr>' ;
                
              }
            }
        
        
            // gets the open meteo api
        
    
            const today = new Date();
            const endDate = new Date();
            endDate.setDate(today.getDate() + 15); // 16 days
        
            const formatDate = date => date.toISOString().split('T')[0];
            const start_date = formatDate(today);
            const end_date = formatDate(endDate);
        
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,wind_speed_10m,cloudcover,precipitation_probability,relative_humidity_2m&timezone=auto&start_date=${start_date}&end_date=${end_date}`;
        
            try {
              const response = await fetch(url);
              const data = await response.json();
        
              if (!data.hourly) {
                console.error("No hourly data returned:", data);
                return;
              }
        
        
            const timeArray = data.hourly.time;
            const temperatureArray = data.hourly.temperature_2m;
            const windspeedArray = data.hourly.wind_speed_10m;
            const cloudcoverArray = data.hourly.cloudcover;
            const precipitationChanceArray = data.hourly.precipitation_probability;
            const humidityArray = data.hourly.relative_humidity_2m;
        
            const moonreq  = (document.getElementById("moonSlider").value)/100;
            const tempreq  = (document.getElementById("tempSlider").value)*(9/5)+(32);
            const cloudreq  = (document.getElementById("cloudSlider").value);
            const windreq  = (document.getElementById("windSlider").value)/100;
            const precipreq  = (document.getElementById("rainSlider").value)/100;
            const humidreq  = (document.getElementById("humiditySlider").value);
    
            const moonrange  = (document.getElementById("moonSlider").max-document.getElementById("moonSlider").min)/100;
            const temprange = (document.getElementById("tempSlider").max-document.getElementById("tempSlider").min);
            const cloudrange  = (document.getElementById("cloudSlider").max-document.getElementById("cloudSlider").min);
            const windrange  = (document.getElementById("windSlider").max-document.getElementById("windSlider").min);
            const preciprange  = (document.getElementById("rainSlider").max-document.getElementById("rainSlider").min);
            const humidrange  = (document.getElementById("humiditySlider").max-document.getElementById("humiditySlider").min);
              
    
            const timedaily = Array(16).fill(0);
            const tempdaily = Array(16).fill(0);
            const winddaily = Array(16).fill(0);
            const clouddaily = Array(16).fill(0);
            const precipdaily = Array(16).fill(0);
            const humiddaily = Array(16).fill(0);
    
            timedaily[0]=timeArray[0].split("T")[0];
            dayinc=0;
            
            for (let i=0; i<timeArray.length; i++) {
              
              if (timeArray[i].split("T")[0]!=timedaily[dayinc]) {
                dayinc++;
                
              }
              
    
              timedaily[dayinc]=timeArray[i].split("T")[0];
              tempdaily[dayinc]+=((temperatureArray[i]*(9/5)+(32))/24);
              winddaily[dayinc]+=((windspeedArray[i]*0.621371)/24);
              clouddaily[dayinc]+=(cloudcoverArray[i]/24);
              precipdaily[dayinc]+=(precipitationChanceArray[i]/24);
              humiddaily[dayinc]+=(humidityArray[i]/24);
            }
        
            const moon= closestcalc(moonillumin,moonreq,moonrange);
            const temp = closestcalc4temp(tempdaily,tempreq,temprange);
            const wind = closestcalc(winddaily,windreq,windrange);
            const cloud = closestcalc(clouddaily,cloudreq,cloudrange);
            const precip = closestcalc(precipdaily,precipreq,preciprange);
            const humid = closestcalc(humiddaily,humidreq,humidrange);
    
            const dayclosestcalc = moon.map((value, index) => value + temp[index] + wind[index] + cloud[index] + precip[index] + humid[index]);
            console.log(dayclosestcalc);
            const closestdayindex = dayclosestcalc.indexOf(Math.min(...dayclosestcalc))
            
            console.log(timedaily[closestdayindex],timedaily);
    
            // console.log(moonillumin[0],moonreq,moonrange);
            // console.log(tempdaily[0],tempreq,temprange);
            // console.log(winddaily[0],windreq,windrange);
            // console.log(clouddaily[0],cloudreq,cloudrange);
            // console.log(precipdaily[0],precipreq,preciprange);
            // console.log(humiddaily[0],humidreq,humidrange);
    
            //ouput to third bar
            console.log(timedaily.length);
            bar3output = ""
            for (let i=0; i<timedaily.length; i++) {
              bar3output += `
                <tr>
                <td>${timedaily[i]}</td>
                <td>${Math.round(moonillumin[i]*100)}%</td>
                <td>${Math.round(tempdaily[i])}°F</td>
                <td>${Math.round(winddaily[i])}mph</td>
                <td>${Math.round(clouddaily[i])}%</td>
                <td>${Math.round(precipdaily[i])}%</td>
                <td>${Math.round(humiddaily[i])}%</td>
                </tr>
              `
    
              
              ;
            }
        
            clostestdaydiv.innerHTML = `
            
        
            <h2><strong>Weather for the next 15 days in ${name}, ${country}:</strong> </h2>
            <table>
            <tr>
            <th>Time</th>
            <th>Moon</th>
            <th>Temp</th>
            <th>Wind</th>
            <th>Cloud</th>
            <th>Rain</th>
            <th>Humid</th>
            </tr>
            ${bar3output}</table>
          `;
            // bestdayDiv.innerHTML = `
            //   <h2>Weather in ${name}, ${country}</h2>
            //   <p><strong>Date:</strong> ${fullMoonDate.toDateString()} (Midnight)</p>
            //   <p><strong>Temperature:</strong> ${temp}°C</p>
            //   <p><strong>Wind Speed:</strong> ${windspeed10m}km/h</p>
            //   <p><strong>Cloud Coverage:</strong> ${cloud}%</p>
            //   <p><strong>Precipitation:</strong> ${precip} %</p>
            //   <p><strong>Humidity:</strong> ${humid}%</p>
            //   <p><strong>Moon Phase:</strong> 🌕 Full Moon</p>
            // `;
          //second tab
    
          bestdayDiv.innerHTML = `
            <h2>Best Day in ${name}, ${country}</h2>
            <p><strong>Date:</strong> ${timedaily[closestdayindex]}</p>
            <p><strong>Temperature:</strong> ${Math.round(tempdaily[closestdayindex])}°F</p>
            <p><strong>Wind Speed:</strong> ${Math.round(winddaily[closestdayindex])}mph</p>
            <p><strong>Cloud Coverage:</strong> ${Math.round(clouddaily[closestdayindex])}%</p>
            <p><strong>Precipitation:</strong> ${Math.round(precipdaily[closestdayindex])} %</p>
            <p><strong>Humidity:</strong> ${Math.round(humiddaily[closestdayindex])}%</p>
            <p><strong>Moon Phase:</strong> ${mooniconMap[moonphase[closestdayindex]]} ${moonphase[closestdayindex]}</p>
          `;
    
    
    
    
        } catch (error) {
          errorMsg.textContent = "Failed to load data.";
          currentDiv.innerHTML = "";
          bestdayDiv.innerHTML = "";
          console.error(error);
        }
        
            } catch (error) {
              console.error("Failed to fetch weather data:", error);
            }
          } catch (error) {
            errorMsg.textContent = "Failed to load data.";
            currentDiv.innerHTML = "";
            bestdayDiv.innerHTML = "";
            console.error(error);
          }
    
          //second tab
      } else {
        try {
          // gets latitude and longitude sand name
          const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1`);
          const geoData = await geoRes.json();
      
    
          if (!geoData.results || geoData.results.length === 0) {
            errorMsg.textContent = "Location not found.";
            currentDiv.innerHTML = "";
            bestdayDiv.innerHTML = "";
            return;
          }
    
          const { latitude, longitude, name, country } = geoData.results[0];
    
          // gets current weather from lat and long data
          const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=cloudcover,precipitation_probability,relativehumidity_2m&timezone=auto`);
          const weatherData = await weatherRes.json();
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
    
          // Current moon phase
          const today = new Date();
          const timestamp = Math.floor(today.setHours(12, 0, 0, 0) / 1000);
          const moonRes = await fetch(`https://api.farmsense.net/v1/moonphases/?d=${timestamp}`);
          const moonData = await moonRes.json();
    
          let moonPhase = "Unavailable";
          let moonIcon = "";
          const mooniconMap = {
            "New Moon": "🌑",
            "Waxing Crescent": "🌒",
            "1st Quarter": "🌓",
            "Waxing Gibbous": "🌔",
            "Full Moon": "🌕",
            "Waning Gibbous": "🌖",
            "3rd Quarter": "🌗",
            "Waning Crescent": "🌘"
          };
          if (moonData && moonData[0] && moonData[0].Phase) {
            moonPhase = moonData[0].Phase;
            moonIcon = mooniconMap[moonPhase] || "";
          }
    
          // block for current temp in that city
          currentDiv.innerHTML = `
            <h2>Current Weather in ${name}, ${country}</h2>
            <p><strong>Temperature:</strong> ${weather.temperature}°C</p>
            <p><strong>Windspeed:</strong> ${weather.windspeed} km/h</p>
            <p><strong>Cloud Coverage:</strong> ${cloudCover}%</p>
            <p><strong>Precipitation:</strong> ${precipitation} %</p>
            <p><strong>Humidity:</strong> ${humidity}%</p>
            <p><strong>Moon Phase:</strong> ${moonIcon} ${moonPhase}</p>
            <p><em>Last Updated:</em> ${weather.time}</p>
          `;
     
    
          // thrid tab
    
          try {
        
            let moonillumin = [];
            let moonphase = [];
            for (let i = 0; i < 16; i++) {
              const checkDate = new Date(Date.now() + i * 86400000);
              const timestamp = Math.floor(checkDate.setHours(12, 0, 0, 0) / 1000);
              const moonRes = await fetch(`https://api.farmsense.net/v1/moonphases/?d=${timestamp}`);
              const moonData = await moonRes.json();
             
              if (moonData[0]) {
                moonillumin[i]=moonData[0].Illumination;
                moonphase[i]=moonData[0].Phase;
                
                // moonillumin += '<tr><th>'+timestamp+'</th><th>'+(Math.round((((Math.abs(moonilluminreq-moonData[0].Illumination))/moonilluminreq)**2)*100)/100)+'</th></tr>' ;
                
              }
            }
        
        
            // gets the open meteo api
        
    
            const today = new Date();
            const endDate = new Date();
            endDate.setDate(today.getDate() + 15); // 16 days
        
            const formatDate = date => date.toISOString().split('T')[0];
            const start_date = formatDate(today);
            const end_date = formatDate(endDate);
        
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,wind_speed_10m,cloudcover,precipitation_probability,relative_humidity_2m&timezone=auto&start_date=${start_date}&end_date=${end_date}`;
        
            try {
              const response = await fetch(url);
              const data = await response.json();
        
              if (!data.hourly) {
                console.error("No hourly data returned:", data);
                return;
              }
        
        
            const timeArray = data.hourly.time;
            const temperatureArray = data.hourly.temperature_2m;
            const windspeedArray = data.hourly.wind_speed_10m;
            const cloudcoverArray = data.hourly.cloudcover;
            const precipitationChanceArray = data.hourly.precipitation_probability;
            const humidityArray = data.hourly.relative_humidity_2m;
        
            const moonreq  = (document.getElementById("moonSlider").value)/100;
            const tempreq  = (document.getElementById("tempSlider").value);
            const cloudreq  = (document.getElementById("cloudSlider").value);
            const windreq  = (document.getElementById("windSlider").value)/100;
            const precipreq  = (document.getElementById("rainSlider").value)/100;
            const humidreq  = (document.getElementById("humiditySlider").value);
    
            const moonrange  = (document.getElementById("moonSlider").max-document.getElementById("moonSlider").min)/100;
            const temprange = (document.getElementById("tempSlider").max-document.getElementById("tempSlider").min);
            const cloudrange  = (document.getElementById("cloudSlider").max-document.getElementById("cloudSlider").min);
            const windrange  = (document.getElementById("windSlider").max-document.getElementById("windSlider").min);
            const preciprange  = (document.getElementById("rainSlider").max-document.getElementById("rainSlider").min);
            const humidrange  = (document.getElementById("humiditySlider").max-document.getElementById("humiditySlider").min);
              
    
            const timedaily = Array(16).fill(0);
            const tempdaily = Array(16).fill(0);
            const winddaily = Array(16).fill(0);
            const clouddaily = Array(16).fill(0);
            const precipdaily = Array(16).fill(0);
            const humiddaily = Array(16).fill(0);
    
            timedaily[0]=timeArray[0].split("T")[0];
            dayinc=0;
            
            for (let i=0; i<timeArray.length; i++) {
              
              if (timeArray[i].split("T")[0]!=timedaily[dayinc]) {
                dayinc++;
                
              }
              
    
              timedaily[dayinc]=timeArray[i].split("T")[0];
              tempdaily[dayinc]+=(temperatureArray[i]/24);
              winddaily[dayinc]+=(windspeedArray[i]/24);
              clouddaily[dayinc]+=(cloudcoverArray[i]/24);
              precipdaily[dayinc]+=(precipitationChanceArray[i]/24);
              humiddaily[dayinc]+=(humidityArray[i]/24);
            }
        
            const moon= closestcalc(moonillumin,moonreq,moonrange);
            const temp = closestcalc4temp(tempdaily,tempreq,temprange);
            const wind = closestcalc(winddaily,windreq,windrange);
            const cloud = closestcalc(clouddaily,cloudreq,cloudrange);
            const precip = closestcalc(precipdaily,precipreq,preciprange);
            const humid = closestcalc(humiddaily,humidreq,humidrange);
    
            const dayclosestcalc = moon.map((value, index) => value + temp[index] + wind[index] + cloud[index] + precip[index] + humid[index]);
            console.log(dayclosestcalc);
            const closestdayindex = dayclosestcalc.indexOf(Math.min(...dayclosestcalc))
            
            console.log(timedaily[closestdayindex],timedaily);
    
            // console.log(moonillumin[0],moonreq,moonrange);
            // console.log(tempdaily[0],tempreq,temprange);
            // console.log(winddaily[0],windreq,windrange);
            // console.log(clouddaily[0],cloudreq,cloudrange);
            // console.log(precipdaily[0],precipreq,preciprange);
            // console.log(humiddaily[0],humidreq,humidrange);
    
            //ouput to third bar
            console.log(timedaily.length);
            bar3output = ""
            for (let i=0; i<timedaily.length; i++) {
              bar3output += `
                <tr>
                <td>${timedaily[i]}</td>
                <td>${Math.round(moonillumin[i]*100)}%</td>
                <td>${Math.round(tempdaily[i])}°C</td>
                <td>${Math.round(winddaily[i])}km/h</td>
                <td>${Math.round(clouddaily[i])}%</td>
                <td>${Math.round(precipdaily[i])}%</td>
                <td>${Math.round(humiddaily[i])}%</td>
                </tr>
              `
    
              
              ;
            }
        
            clostestdaydiv.innerHTML = `
            
        
            <h2><strong>Weather for the next 15 days in ${name}, ${country}:</strong> </h2>
            <table>
            <tr>
            <th>Time</th>
            <th>Moon</th>
            <th>Temp</th>
            <th>Wind</th>
            <th>Cloud</th>
            <th>Rain</th>
            <th>Humid</th>
            </tr>
            ${bar3output}</table>
          `;
            // bestdayDiv.innerHTML = `
            //   <h2>Weather in ${name}, ${country}</h2>
            //   <p><strong>Date:</strong> ${fullMoonDate.toDateString()} (Midnight)</p>
            //   <p><strong>Temperature:</strong> ${temp}°C</p>
            //   <p><strong>Wind Speed:</strong> ${windspeed10m}km/h</p>
            //   <p><strong>Cloud Coverage:</strong> ${cloud}%</p>
            //   <p><strong>Precipitation:</strong> ${precip} %</p>
            //   <p><strong>Humidity:</strong> ${humid}%</p>
            //   <p><strong>Moon Phase:</strong> 🌕 Full Moon</p>
            // `;
          //second tab
    
          bestdayDiv.innerHTML = `
            <h2>Best Day in ${name}, ${country}</h2>
            <p><strong>Date:</strong> ${timedaily[closestdayindex]}</p>
            <p><strong>Temperature:</strong> ${Math.round(tempdaily[closestdayindex])}°C</p>
            <p><strong>Wind Speed:</strong> ${Math.round(winddaily[closestdayindex])}km/h</p>
            <p><strong>Cloud Coverage:</strong> ${Math.round(clouddaily[closestdayindex])}%</p>
            <p><strong>Precipitation:</strong> ${Math.round(precipdaily[closestdayindex])} %</p>
            <p><strong>Humidity:</strong> ${Math.round(humiddaily[closestdayindex])}%</p>
            <p><strong>Moon Phase:</strong> ${mooniconMap[moonphase[closestdayindex]]} ${moonphase[closestdayindex]}</p>
          `;
    
    
    
    
        } catch (error) {
          errorMsg.textContent = "Failed to load data.";
          currentDiv.innerHTML = "";
          bestdayDiv.innerHTML = "";
          console.error(error);
        }
        
            } catch (error) {
              console.error("Failed to fetch weather data:", error);
            }
          } catch (error) {
            errorMsg.textContent = "Failed to load data.";
            currentDiv.innerHTML = "";
            bestdayDiv.innerHTML = "";
            console.error(error);
          }
    
          //second tab
      }
      
   
  }

function setslidersSci() {
  const sliderDiv = document.getElementById("sliders-wrapper");
  sliderDiv.innerHTML = `
    <div class="slider-container">
      <div class="label">Temperature</div>
      <input type="range" class="slider" id="tempSlider" min="-50" max="50" value="0" autocomplete="off">
      <div class="percentage-display" id="tempDisplay">0°C</div>
    </div>

    <div class="slider-container">
      <div class="label">Wind Speed</div>
      <input type="range" class="slider" id="windSlider" min="0" max="50" value="25" autocomplete="off">
      <div class="percentage-display" id="windDisplay">25km/h</div>
    </div>

    <div class="slider-container">
      <div class="label">Cloud Coverage</div>
      <input type="range" class="slider" id="cloudSlider" min="0" max="100" value="50" autocomplete="off">
      <div class="percentage-display" id="cloudDisplay">50%</div>
    </div>
    

    <div class="slider-container">
      <div class="label">Precipitation Chance</div>
      <input type="range" class="slider" id="rainSlider" min="0" max="100" value="50" autocomplete="off">
      <div class="percentage-display" id="rainDisplay">50%</div>
    </div>

    <div class="slider-container">
      <div class="label">Humidity</div>
      <input type="range" class="slider" id="humiditySlider" min="0" max="100" value="50" autocomplete="off">
      <div class="percentage-display" id="humidityDisplay">50%</div>
    </div>

    <div class="slider-container">
      <div class="label">Full Moon</div>
      <input type="range" class="slider" id="moonSlider" min="0" max="100" value="50" autocomplete="off">
      <div class="percentage-display" id="moonDisplay">50%</div>
    </div>
`;
}



function setslidersImp() {
const sliderDiv = document.getElementById("sliders-wrapper");
sliderDiv.innerHTML = `
  <div class="slider-container">
    <div class="label">Temperature</div>
    <input type="range" class="slider" id="tempSlider" min="-50" max="100" value="25" autocomplete="off">
    <div class="percentage-display" id="tempDisplay">25°F</div>
  </div>

  <div class="slider-container">
    <div class="label">Wind Speed</div>
    <input type="range" class="slider" id="windSlider" min="0" max="50" value="25" autocomplete="off">
    <div class="percentage-display" id="windDisplay">25mph</div>
  </div>

  <div class="slider-container">
    <div class="label">Cloud Coverage</div>
    <input type="range" class="slider" id="cloudSlider" min="0" max="100" value="50" autocomplete="off">
    <div class="percentage-display" id="cloudDisplay">50%</div>
  </div>
  

  <div class="slider-container">
    <div class="label">Precipitation Chance</div>
    <input type="range" class="slider" id="rainSlider" min="0" max="100" value="50" autocomplete="off">
    <div class="percentage-display" id="rainDisplay">50%</div>
  </div>

  <div class="slider-container">
    <div class="label">Humidity</div>
    <input type="range" class="slider" id="humiditySlider" min="0" max="100" value="50" autocomplete="off">
    <div class="percentage-display" id="humidityDisplay">50%</div>
  </div>

  <div class="slider-container">
    <div class="label">Full Moon</div>
    <input type="range" class="slider" id="moonSlider" min="0" max="100" value="50" autocomplete="off">
    <div class="percentage-display" id="moonDisplay">50%</div>
  </div>
`;
}

getSliderUnit();