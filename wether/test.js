// Get all necessary elements from the DOM
const app = document.querySelector(".weather-app");
const temp = document.querySelector(".temp");
const dateOutput = document.querySelector(".date");
const timeOutput = document.querySelector(".time");
const conditionOutput = document.querySelector(".condition");
const nameOutput = document.querySelector(".name");
const icon = document.querySelector(".icon");
const cloudOutput = document.querySelector(".cloud");
const humidityOutput = document.querySelector(".humidity");
const windOutput = document.querySelector(".wind");
const form = document.getElementById("locationInput");
const search = document.querySelector(".search");
const btn = document.querySelector(".submit");
const cities = document.querySelectorAll(".city");
const ctx = document.getElementById("weatherChart");

// Default city
let cityInput = "TOKYO";

// Click event for cities in the list panel
cities.forEach((city) => {
  city.addEventListener("click", (e) => {
    cityInput = e.target.textContent;
    displayForecast(cityInput);
    fetchWeatherData();
    app.style.opacity = "0";
  });
});

// Submit event
form.addEventListener("submit", (e) => {
  displayForecast(cityInput);
  e.preventDefault();
  if (search.value.length == 0) {
    alert("Please enter a city name");
  } else {
    cityInput = search.value;
    fetchWeatherData();
    search.value = "";
    app.style.opacity = "0";
  }
});

// Function to get the day of the week
function dayOfTheWeek(day, month, year) {
  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return weekday[new Date(`${year}-${month}-${day}`).getDay()];
}

// Function to fetch weather data
function fetchWeatherData() {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&appid=75837101bbe6f6540f58a44972bd2de4`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      // Update weather data elements
      temp.innerHTML = `${(data.main.temp - 273.15).toFixed(1)}&#176;C`;
      conditionOutput.innerHTML = data.weather[0].description;
      const dateTime = new Date(data.dt * 1000); // Convert Unix timestamp to milliseconds
      const date = dateTime.getDate();
      const month = dateTime.getMonth() + 1; // Months are zero-based
      const year = dateTime.getFullYear();
      const hours = dateTime.getHours();
      const minutes = dateTime.getMinutes().toString().padStart(2, "0");
      dateOutput.innerHTML = `${dayOfTheWeek(
        date,
        month,
        year
      )} ${date}, ${month} ${year}`;
      timeOutput.innerHTML = `${hours}:${minutes}`;
      nameOutput.innerHTML = data.name;
      icon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

      cloudOutput.innerHTML = `${data.clouds.all}%`;
      humidityOutput.innerHTML = `${data.main.humidity}%`;
      windOutput.innerHTML = `${data.wind.speed} m/s`;
      // Update background image and button color based on weather condition
      updateWeatherUI(data.weather[0].id);
      // Fade animation
      app.style.opacity = "1";
    })
    .catch(() => {
      //   alert("City not found");
      app.style.opacity = "1";
    });
}



// Initial fetch and animation
fetchWeatherData();
app.style.opacity = "1";

/////////// chartjs/////////////

let metric = "units=metric"; // Initialize metric variable
let chartInstance = null;
function displayForecast(cityInput) {
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityInput}&appid=75837101bbe6f6540f58a44972bd2de4&${metric}`;
  fetch(forecastUrl)
    .then((response) => response.json())
    .then((data) => {
      const forecastByDate = [];
      const fiveForecastDay = data.list.filter((responseLine) => {
        const date = new Date(responseLine.dt_txt).getDate();
        if (!forecastByDate.includes(date)) {
          return forecastByDate.push(date);
        }
      });

      // Filter the dates
      const forecastsDays = fiveForecastDay.map((el) => {
        const date = new Date(el.dt_txt).toLocaleString("fr-FR", {
          weekday: "long",
        });
        return date;
      });

      forecastsDays.forEach((el) => {
        console.log("Date:", el.date);
      });

      // Filter by temperature
      const forecastsTemp = fiveForecastDay.map((el) => {
        const temperature = el.main.temp;
        return temperature;
      });

      forecastsTemp.forEach((el) => {
        console.log("Temperature:", el.temperature);
      });

      const params = {
        type: "line",
        data: {
          labels: forecastsDays,
          datasets: [
            {
              label: "Temperature",
              data: forecastsTemp,
              borderWidth: 1,
              borderColor: "white",
              backgroundColor: "white",
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      };
      if (chartInstance) {
        chartInstance.clear();
        chartInstance.destroy();
      }
      chartInstance = new Chart(ctx, params);
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
      alert("City not found. Please try again.");
    });
}

displayForecast("casablanca");
