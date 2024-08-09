


let apiKey;

async function fetchApiKey() {
    try {
        const response = await fetch('http://localhost:3000/api/get-api-key');
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        const data = await response.json();
        apiKey = data.apiKey; 

        console.log('API Key Loaded:', apiKey); // Debugging line

        // Enable weather button after successfully loading the API key
        document.getElementById('weatherBtn').disabled = false;
        document.getElementById('status').textContent = 'API key loaded successfully';
    } catch (error) {
        console.error('Error fetching API key:', error);
        document.getElementById('status').textContent = 'Error loading API key';
    }
}

// Run fetchApiKey when the document is loaded
document.addEventListener('DOMContentLoaded', fetchApiKey);



async function getWeather() {
    const city = document.getElementById('city').value;

    console.log('City:', city);
    console.log('API Key in getWeather:', apiKey); // Debugging line

    if (!apiKey) {
        document.getElementById('result-grid').innerHTML = `<p>Error: API key is missing</p>`;
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/weather?city=${city}`, {
            headers: { 'x-api-key': apiKey }, // Use the API key
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch weather data');
        }

        const weather = await response.json();

        setBackgroundImage(weather.description);

        console.log('Weather Data:', weather); // Debugging line

        const topSection = `
        <div class="top">
            <h3>${weather.city || 'Unknown City'}</h3>
            <div class="top-info">
                <h4>${weather.temperature !== undefined ? weather.temperature + '°F' : 'N/A'}</h4>
                
                <h5>${weather.description || 'N/A'}</h5>
            </div>
        </div>
    `;

    const gridInfo = `
        <div class="info-grid">
             <p>Humidity:<br><span class="weather-value">${weather.humidity !== undefined ? weather.humidity + '%' : 'N/A'}</span></p>
                <p>Wind Speed:<br><span class="weather-value">${weather.windSpeed !== undefined ? weather.windSpeed + ' m/h' : 'N/A'}</span></p>
                <p>Precipitation:<br><span class="weather-value">${weather.precipitation !== undefined ? weather.precipitation + ' in' : 'N/A'}</span></p>
                <p>Feels Like:<br><span class="weather-value">${weather.feelsLike !== undefined ? weather.feelsLike + '°C' : 'N/A'}</span></p>
                <p>Visibility:<br><span class="weather-value">${weather.visibility !== undefined ? weather.visibility + ' miles' : 'N/A'}</span></p>
                <p>UV Index:<br><span class="weather-value">${weather.uvIndex !== undefined ? weather.uvIndex : 'N/A'}</span></p>
            
        </div>
    `;

    // Insert the HTML into the result grid
    document.getElementById('result-grid').innerHTML = topSection + gridInfo;


        // Trigger the flip animation
        document.querySelector('.flip-container').classList.add('flipped');
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('result').innerHTML = `<p>Error: ${error.message}</p>`;
    }
}

function flipBack() {
    // Trigger the flip back animation
    document.querySelector('.flip-container').classList.remove('flipped');
}

function setBackgroundImage(description) {
    let imageUrl;
    let textColor;

    // Map weather descriptions to image URLs
    switch (true) {
        case /Sunny/i.test(description):
            imageUrl = 'url(../images/sunny.jpg)';
            textColor = 'white';
            break;
        case /Rainy/i.test(description):
            imageUrl = 'url(../images/rainy.jpg)';
            textColor = 'white';
            break;
        case /Cloudy/i.test(description):
            imageUrl = 'url(../images/cloudy.jpg)';
            textColor = 'black';
            break;
        case /Partially cloudy/i.test(description):
            imageUrl = 'url(../images/partially.jpg)';
            textColor = 'black';
                break;
        case /Snow/i.test(description):
            imageUrl = 'url(../images/snowy.jpg)';
            textColor = 'black';
            break;
        case /Clear/i.test(description):
            imageUrl = 'url(../images/sunny.jpg)';
            textColor = 'white';
                break;
        default:
            imageUrl = 'url(../images/sunny.jpg)';
            textColor = 'white';
    }

    // Apply the background image
    document.body.style.backgroundImage = imageUrl;
    document.body.style.color = textColor;
}

console.log('API Key Loaded:', apiKey); // After setting the key in fetchApiKey
console.log('API Key in getWeather:', apiKey); // Before making the request in getWeather
