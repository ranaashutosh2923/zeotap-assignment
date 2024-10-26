const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
require('dotenv').config();
const connectDB = require('./config/db');
const weatherRoutes = require('./routes/weatherRoutes.js');
const weatherService = require('./services/weatherServices.js');


const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/weather', weatherRoutes);

// Schedule weather data fetching every 5 minutes
cron.schedule('*/5 * * * *', () => {
    weatherService.fetchWeatherData();
});

// Initial weather data fetch
weatherService.fetchWeatherData();

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Weather Monitoring Server running on port ${PORT}`);
});