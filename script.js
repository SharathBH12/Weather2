const apiKey = '2cb3612c2042966049e8a811c93300e6';
const baseUrl = 'https://api.openweathermap.org/data/2.5/weather';
const forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast';
const oneCallUrl = 'https://api.openweathermap.org/data/2.5/onecall';


// Get weather by city
function getWeatherByCity() {
    const city = document.getElementById('city').value;
    if (!city) {
        alert('Please enter a city name');
        return;
    }
    const url = `${baseUrl}?q=${city}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => displayWeather(data, 'weather-info'))
        .catch(error => showError(error, 'weather-info'));
}

// Get weather by coordinates
function getWeatherByCoordinates() {
    const lat = document.getElementById('latitude').value;
    const lon = document.getElementById('longitude').value;
    if (!lat || !lon) {
        alert('Please provide valid coordinates');
        return;
    }
    const url = `${baseUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => displayWeather(data, 'weather-info'))
        .catch(error => showError(error, 'weather-info'));
}

// Display weather data
function displayWeather(data, target) {
    if (data.cod === 200) {
        document.getElementById(target).innerHTML = `
            <h3>Weather in ${data.name}</h3>
            <p><i class="fas fa-temperature-high"></i> Temperature: ${data.main.temp} °C</p>
            <p><i class="fas fa-temperature-low"></i> Min Temperature: ${data.main.temp_min} °C</p>
            <p><i class="fas fa-thermometer-full"></i> Max Temperature: ${data.main.temp_max} °C</p>
            <p><i class="fas fa-cloud"></i> Condition: ${data.weather[0].description}</p>
            <p><i class="fas fa-wind"></i> Wind Speed: ${data.wind.speed} m/s</p>
        `;
    } else {
        document.getElementById(target).innerHTML = `<p>${data.message}</p>`;
    }
}

// Show error
function showError(error, target) {
    console.error(error);
    document.getElementById(target).innerHTML = `<p>Error retrieving data. Try again later.</p>`;
}

// Get weather prediction
function getWeatherPrediction() {
    const city = document.getElementById('city-prediction').value;
    if (!city) {
        alert('Please enter a city name');
        return;
    }
    const url = `${forecastUrl}?q=${city}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.cod === '200') {
                let predictions = '<h3>5-Day Weather Prediction</h3>';
                data.list.forEach((item, index) => {
                    if (index % 8 === 0) { // Filter for 24-hour intervals
                        predictions += `
                            <p><strong>${item.dt_txt}</strong></p>
                            <p>Temperature: ${item.main.temp} °C</p>
                            <p>Condition: ${item.weather[0].description}</p>
                            <hr>
                        `;
                    }
                });
                document.getElementById('prediction-info').innerHTML = predictions;
            } else {
                document.getElementById('prediction-info').innerHTML = `<p>${data.message}</p>`;
            }
        })
        .catch(error => showError(error, 'prediction-info'));
}


// Fetch alerts using city name
function getAlertsByCity() {
    const city = document.getElementById('city-alerts').value;

    if (city === '') {
        alert('Please enter a city name');
        return;
    }

    const cityWeatherUrl = `${baseUrl}?q=${city}&appid=${apiKey}&units=metric`;

    // Step 1: Fetch city coordinates
    fetch(cityWeatherUrl)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                const { lat, lon } = data.coord;
                fetchAlerts(lat, lon);
            } else {
                document.getElementById('alerts-info').innerHTML = `<p>${data.message}</p>`;
            }
        })
        .catch(error => showError(error, 'alerts-info'));
}

// Fetch alerts from One Call API
function fetchAlerts(lat, lon) {
    const url = `${oneCallUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => displayAlerts(data))
        .catch(error => showError(error, 'alerts-info'));
}

// Display alerts
function displayAlerts(data) {
    const target = 'alerts-info';
    if (data.alerts && data.alerts.length > 0) {
        let alertHtml = '<h3>Disaster Alerts</h3>';
        data.alerts.forEach(alert => {
            alertHtml += `
                <p><strong>${alert.event}</strong></p>
                <p><i class="fas fa-clock"></i> Start: ${new Date(alert.start * 1000).toLocaleString()}</p>
                <p><i class="fas fa-clock"></i> End: ${new Date(alert.end * 1000).toLocaleString()}</p>
                <p><i class="fas fa-info-circle"></i> Description: ${alert.description}</p>
                <hr>
            `;
        });
        document.getElementById(target).innerHTML = alertHtml;
    } else {
        document.getElementById(target).innerHTML = '<p>No disaster alerts for the specified city.</p>';
    }
}

// Error handler
function showError(error, targetId) {
    console.error(error);
    document.getElementById(targetId).innerHTML = `<p>Error retrieving data. Try again later.</p>`;
}