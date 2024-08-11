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

function setBackgroundImage(description) {
    let imageUrl;
    let textColor;

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

    document.body.style.backgroundImage = imageUrl;
    document.body.style.color = textColor;
}

console.log('API Key Loaded:', apiKey); // After setting the key in fetchApiKey
console.log('API Key in getWeather:', apiKey); // Before making the request in getWeather

let currentXRotation = 0;
let currentYRotation = 0;

document.getElementById('getWeatherBtn').addEventListener('click', fetchWeather);
const cube = document.getElementById('cube');

// Swipe Detection
let startX, startY, endX, endY;

cube.addEventListener('touchstart', (e) => {
  startX = e.changedTouches[0].screenX;
  startY = e.changedTouches[0].screenY;
});

cube.addEventListener('touchend', (e) => {
  endX = e.changedTouches[0].screenX;
  endY = e.changedTouches[0].screenY;
  handleSwipe();
});

function handleSwipe() {
  const deltaX = endX - startX;
  const deltaY = endY - startY;

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    // Horizontal Swipe
    if (deltaX > 50) {
      // Swipe Right
      currentYRotation -= 90;
    } else if (deltaX < -50) {
      // Swipe Left
      currentYRotation += 90;
    }
  } else {
    // Vertical Swipe
    if (deltaY > 50) {
      // Swipe Down
      currentXRotation += 90;
    } else if (deltaY < -50) {
      // Swipe Up
      currentXRotation -= 90;
    }
  }
  rotateCube();
}

function rotateCube() {
  cube.style.transform = `rotateX(${currentXRotation}deg) rotateY(${currentYRotation}deg)`;
}

async function fetchWeather() {
  const city = document.getElementById('city').value.trim();
  if (!city) {
    alert('Please enter a city name.');
    return;
  }

  if (!apiKey) {
    alert('API key is not loaded.');
    return;
  }

  try {
    // Fetch weather data from the server, include the API key in headers
    const response = await fetch(`http://localhost:3000/api/weather?city=${city}`, {
      headers: {
        'x-api-key': apiKey,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch weather data.');
    }

    const data = await response.json();
    populateCubeFaces(data);
    setBackgroundImage(data.description);
  } catch (error) {
    alert(`Error fetching weather data: ${error.message}`);
    console.error(error);
  }
}

function populateCubeFaces(weather) {
  document.getElementById('face-front').innerHTML = `<strong>City:</strong> ${weather.city || 'N/A'}`;
  document.getElementById('face-back').innerHTML = `<strong>Temperature:</strong> ${weather.temperature || 'N/A'}°F`;
  document.getElementById('face-right').innerHTML = `<strong>Humidity:</strong> ${weather.humidity || 'N/A'}%`;
  document.getElementById('face-left').innerHTML = `<strong>Wind Speed:</strong> ${weather.windSpeed || 'N/A'} m/h`;
  document.getElementById('face-top').innerHTML = `<strong>Description:</strong> ${weather.description || 'N/A'}`;
  document.getElementById('face-bottom').innerHTML = `<strong>UV Index:</strong> ${weather.uvIndex || 'N/A'}`;

  // Reset rotation to show the front face
  currentXRotation = 0;
  currentYRotation = 0;
  rotateCube();
}
