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
        document.getElementById('getWeatherBtn').disabled = false;
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

    const overlay = document.querySelector('.background-overlay');

    if (overlay) {
        // Set the new background image and fade in
        overlay.style.backgroundImage = imageUrl;
        overlay.style.opacity = 1;
        
    } else {
        // Create and add the overlay if it doesn't exist
        const newOverlay = document.createElement('div');
        newOverlay.className = 'background-overlay';
        newOverlay.style.backgroundImage = imageUrl;
        document.body.appendChild(newOverlay);

        // Trigger fade-in
        requestAnimationFrame(() => {
            newOverlay.style.opacity = 1;
        });
    }

    document.body.style.color = textColor;
}

// Ensure the background overlay element is present on page load
document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.createElement('div');
    overlay.className = 'background-overlay';
    document.body.appendChild(overlay);
});



console.log('API Key Loaded:', apiKey);
console.log('API Key in getWeather:', apiKey);

let currentXRotation = 0;
let currentYRotation = 0;

const cube = document.getElementById('cube');
const leftArrow = document.getElementById('leftArrow');
const rightArrow = document.getElementById('rightArrow');
const upArrow = document.getElementById('upArrow');
const downArrow = document.getElementById('downArrow');

leftArrow.addEventListener('click', () => {
  currentYRotation += 90;
  rotateCube();
});

rightArrow.addEventListener('click', () => {
  currentYRotation -= 90;
  rotateCube();
});

upArrow.addEventListener('click', () => {
  currentXRotation -= 90;
  rotateCube();
});

downArrow.addEventListener('click', () => {
  currentXRotation += 90;
  rotateCube();
});

function rotateCube() {
  cube.style.transform = `rotateX(${currentXRotation}deg) rotateY(${currentYRotation}deg)`;
}

// Swipe Detection for Mobile Users
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
    console.log('Weather Data:', data); // Debugging line
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
//   document.getElementById('face-top').innerHTML = `<strong>Description:</strong> ${weather.description || 'N/A'}`;
  document.getElementById('face-bottom').innerHTML = `<strong>UV Index:</strong> ${weather.description || 'N/A'}`;

  // Reset rotation to show the front face
  currentXRotation = 0;
  currentYRotation = 0;
  rotateCube();
}

// Event listener for Get Weather button
document.getElementById('getWeatherBtn').addEventListener('click', fetchWeather);


