// require('dotenv').config();
// require('dotenv').config({ path: './server/process.env' }); // Specify the path to your .env file

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'process.env') }); // Adjust path as needed



const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Import CORS middleware
const app = express();

console.log('Loaded API_KEY:', process.env.API_KEY); // Debug line
console.log('Loaded PORT:', process.env.PORT);





// Middleware to parse JSON requests
app.use(express.json());

// Use CORS middleware
app.use(cors());

// Sample data for demonstration (can be removed)
const data = [
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
  { id: 3, name: 'Item 3' },
];

// API key for authentication (your custom API key for the app)
const API_KEY = process.env.API_KEY;

// OpenWeatherMap API Key
// const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

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
  const { city } = req.query;

  if (!city) {
    return res.status(400).json({ message: 'City is required' });
  }

  try {
    // Make a request to the Visual Crossing Weather API
    const response = await axios.get(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?key=${API_KEY}&unitGroup=metric`
    );
    
    // Extract relevant weather data
    const weatherData = response.data;
    const weather = {
      city: weatherData.address,
      temperature: weatherData.currentConditions.temp,
      description: weatherData.currentConditions.conditions,
      icon: weatherData.currentConditions.icon,
    };

    // Send weather data to the client
    res.json(weather);
  } catch (error) {
    console.error('Error fetching weather data:', error.message);

    // Handle errors (e.g., city not found, invalid API key)
    if (error.response) {
      res.status(error.response.status).json({
        message: error.response.data.message,
      });
    } else {
      res.status(500).json({
        message: 'An error occurred while fetching weather data',
      });
    }
  }
});


// Endpoint to send the API key to the client
// Endpoint to send the API key to the client
app.get('/api/get-api-key', (req, res) => {
  res.json({ apiKey: API_KEY });
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


