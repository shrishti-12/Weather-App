const apiKey = "df5e9718eb9285c02403338423d45473"; // Replace with your OpenWeatherMap API key
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBtn = document.getElementById("search-btn");
const cityInput = document.getElementById("city-input");
const cityName = document.getElementById("city-name");
const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const icon = document.getElementById("icon");
const error = document.getElementById("error");
const extra = document.getElementById("extra");

// --- Show date and time ---
function updateTime() {
  const now = new Date();
  document.getElementById("date-time").innerText = now.toLocaleString();
}
setInterval(updateTime, 1000);

// --- Dynamic background based on weather ---
function setBackground(weather) {
  const body = document.body;
  if (weather === "Clear") {
    body.style.background = "linear-gradient(to right, #f9d423, #ff4e50)";
  } else if (weather === "Clouds") {
    body.style.background = "linear-gradient(to right, #bdc3c7, #2c3e50)";
  } else if (weather === "Rain") {
    body.style.background = "linear-gradient(to right, #74ebd5, #ACB6E5)";
  } else if (weather === "Snow") {
    body.style.background = "linear-gradient(to right, #E0EAFC, #CFDEF3)";
  } else {
    body.style.background = "linear-gradient(to right, #89f7fe, #66a6ff)";
  }
}

// --- Fetch and show weather ---
async function getWeather(city) {
  try {
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
    if (!response.ok) throw new Error("City not found");
    const data = await response.json();

    error.innerText = "";
    cityName.innerText = data.name;
    temperature.innerText = Math.round(data.main.temp) + "°C";
    humidity.innerText = data.main.humidity + "%";
    wind.innerText = data.wind.speed + " km/h";
    extra.innerText = "Feels like " + Math.round(data.main.feels_like) + "°C";

    const weatherMain = data.weather[0].main;
    icon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    setBackground(weatherMain);

    localStorage.setItem("lastCity", city);
  } catch (err) {
    error.innerText = "❌ City not found. Please try again.";
  }
}

// --- Event listeners ---
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) getWeather(city);
});

cityInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const city = cityInput.value.trim();
    if (city) getWeather(city);
  }
});

// --- Auto detect user location ---
function getLocationWeather() {
  navigator.geolocation.getCurrentPosition(success => {
    const { latitude, longitude } = success.coords;
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`)
      .then(res => res.json())
      .then(data => {
        cityName.innerText = data.name;
        temperature.innerText = Math.round(data.main.temp) + "°C";
        humidity.innerText = data.main.humidity + "%";
        wind.innerText = data.wind.speed + " km/h";
        icon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        setBackground(data.weather[0].main);
      });
  });
}

// --- Load last searched or location weather on start ---
window.onload = () => {
  const lastCity = localStorage.getItem("lastCity");
  if (lastCity) {
    getWeather(lastCity);
  } else {
    getLocationWeather();
  }
};
