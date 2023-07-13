// Constants
const API_KEY = '63ed354d4e700fecc83ba60efc346be5';
const API_BASE_URL = 'https://api.openweathermap.org/data/2.5/';
const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const currentWeatherSection = document.getElementById('current-weather');
const forecastSection = document.getElementById('forecast');
const searchHistorySection = document.getElementById('search-history');

// Event listeners
searchForm.addEventListener('submit', handleFormSubmit);
searchHistorySection.addEventListener('click', handleSearchHistoryClick);

// Load search history from localStorage
let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

// Form submission handler
function handleFormSubmit(event) {
    event.preventDefault();
    const city = cityInput.value.trim();
    if (city !== '') {
        getWeatherData(city);
        cityInput.value = '';
    }
}

// Fetch weather data from the API
function getWeatherData(city) {
    // Fetch current weather data
    fetch(`${API_BASE_URL}weather?q=${city}&units=imperial&appid=${API_KEY}`)
        .then(response => response.json())
        .then(data => {
            // Handle current weather data
            renderCurrentWeather(data);
            // Fetch forecast weather data
            fetch(`${API_BASE_URL}forecast?q=${city}&units=imperial&appid=${API_KEY}`)
                .then(response => response.json())
                .then(data => {
                    // Handle forecast weather data
                    renderForecast(data);
                })
                .catch(error => console.log(error));
        })
        .catch(error => console.log(error));
}

// Render current weather data
function renderCurrentWeather(data) {
    // Clear previous data
    currentWeatherSection.innerHTML = '';

    // Extract relevant data
    const city = data.name;
    const date = new Date(data.dt * 1000).toLocaleDateString();
    const iconCode = data.weather[0].icon;
    const temperature = Math.round(data.main.temp);
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;

    // Create HTML elements
    const cityElement = document.createElement('h2');
    cityElement.textContent = city;

    const dateElement = document.createElement('p');
    dateElement.textContent = date;

    const iconElement = document.createElement('img');
    iconElement.src = `https://openweathermap.org/img/wn/${iconCode}.png`;
    iconElement.alt = data.weather[0].description;

    const temperatureElement = document.createElement('p');
    temperatureElement.textContent = `Temperature: ${temperature}°F`;

    const humidityElement = document.createElement('p');
    humidityElement.textContent = `Humidity: ${humidity}%`;

    const windElement = document.createElement('p');
    windElement.textContent = `Wind Speed: ${windSpeed} mph`;

    // Append elements to the current weather section
    currentWeatherSection.appendChild(cityElement);
    currentWeatherSection.appendChild(dateElement);
    currentWeatherSection.appendChild(iconElement);
    currentWeatherSection.appendChild(temperatureElement);
    currentWeatherSection.appendChild(humidityElement);
    currentWeatherSection.appendChild(windElement);

    // Add city to search history
    addToSearchHistory(city);
}

// Render forecast weather data
function renderForecast(data) {
    // Clear previous data
    forecastSection.innerHTML = '';

    // Extract relevant data
    const forecastData = data.list.filter(item => item.dt_txt.includes('12:00:00'));

    // Loop through forecast data
    forecastData.forEach(item => {
        const date = new Date(item.dt * 1000).toLocaleDateString();
        const iconCode = item.weather[0].icon;
        const temperature = Math.round(item.main.temp);
        const humidity = item.main.humidity;
        const windSpeed = item.wind.speed;

        // Create forecast item container
        const forecastItem = document.createElement('div');
        forecastItem.classList.add('forecast-item');

        // Create HTML elements
        const dateElement = document.createElement('p');
        dateElement.textContent = date;

        const iconElement = document.createElement('img');
        iconElement.src = `https://openweathermap.org/img/wn/${iconCode}.png`;
        iconElement.alt = item.weather[0].description;

        const temperatureElement = document.createElement('p');
        temperatureElement.textContent = `Temperature: ${temperature}°F`;

        const humidityElement = document.createElement('p');
        humidityElement.textContent = `Humidity: ${humidity}%`;

        const windElement = document.createElement('p');
        windElement.textContent = `Wind Speed: ${windSpeed} mph`;

        // Append elements to the forecast item
        forecastItem.appendChild(dateElement);
        forecastItem.appendChild(iconElement);
        forecastItem.appendChild(temperatureElement);
        forecastItem.appendChild(humidityElement);
        forecastItem.appendChild(windElement);

        // Append forecast item to the forecast section
        forecastSection.appendChild(forecastItem);
    });
}

// Add city to search history and localStorage
function addToSearchHistory(city) {
    // Add city to search history array
    searchHistory.unshift(city);

    // Limit search history to 5 entries
    if (searchHistory.length > 5) {
        searchHistory.pop();
    }

    // Update localStorage
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));

    // Render search history
    renderSearchHistory();
}

// Render search history
function renderSearchHistory() {
    searchHistorySection.innerHTML = '';

    searchHistory.forEach(city => {
        const button = document.createElement('button');
        button.textContent = city;
        searchHistorySection.appendChild(button);
    });
}

// Handle click on search history
function handleSearchHistoryClick(event) {
    if (event.target.tagName === 'BUTTON') {
        const city = event.target.textContent;
        getWeatherData(city);
    }
}

// Initial rendering of search history
renderSearchHistory();
