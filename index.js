require('dotenv').config();
const express = require('express');
const axios = require('axios'); // Import Axios for making HTTP requests
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Sample data for demonstration (can be removed)
const data = [
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
  { id: 3, name: 'Item 3' },
];

// API key for authentication (your custom API key for the app)
const API_KEY = process.env.API_KEY;

// OpenWeatherMap API Key
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

// Middleware to check API key for the app's own endpoints
const authenticate = (req, res, next) => {
  const apiKey = req.header('x-api-key');
  if (apiKey && apiKey === API_KEY) {
    next(); // Continue to the next middleware or route handler
  } else {
    res.status(401).json({ message: 'Unauthorized: Invalid API Key' });
  }
};

// Define a route to fetch weather data
app.get('/api/weather', authenticate, async (req, res) => {
  const { city } = req.query; // Expect the client to provide the city name as a query parameter

  if (!city) {
    return res.status(400).json({ message: 'City is required' });
  }

  try {
    // Make a request to the OpenWeatherMap API
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`
    );

    // Extract relevant weather data
    const weatherData = response.data;
    const weather = {
      city: weatherData.name,
      temperature: weatherData.main.temp,
      description: weatherData.weather[0].description,
      icon: `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`,
    };

    // Send weather data to the client
    res.json(weather);
  } catch (error) {
    console.error('Error fetching weather data:', error.message);

    // Handle errors (e.g., city not found, invalid API key)
    if (error.response) {
      // OpenWeatherMap returned an error response
      res.status(error.response.status).json({
        message: error.response.data.message,
      });
    } else {
      // Some other error occurred
      res.status(500).json({
        message: 'An error occurred while fetching weather data',
      });
    }
  }
});

// Sample data route
app.get('/api/data', authenticate, (req, res) => {
  res.json(data);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


async function getWeather() {
  const city = document.getElementById('city').value;
  const apiKey = 'your_api_key_here'; // Replace with your actual API key

  try {
      const response = await fetch(`http://localhost:3000/api/weather?city=${city}`, {
          headers: { 'x-api-key': apiKey },
      });

      if (!response.ok) {
          throw new Error('Failed to fetch weather data');
      }

      const weather = await response.json();

      document.getElementById('result').innerHTML = `
          <h3>${weather.city}</h3>
          <img src="${weather.icon}" alt="Weather Icon">
          <p>Temperature: ${weather.temperature}°C</p>
          <p>Description: ${weather.description}</p>
      `;
  } catch (error) {
      console.error('Error:', error);
      document.getElementById('result').innerHTML = `<p>Error: ${error.message}</p>`;
  }
}