const WeatherData = require('../models/weatherData.js');
const WeatherSummary = require('../models/weatherSummary.js');
const weatherService = require('../services/weatherServices.js');

exports.getLatestWeather = async (req, res) => {
    try {
        const latestData = await weatherService.getLatestReadings();
        res.json(latestData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getDailySummary = async (req, res) => {
    try {
        const { date } = req.query;
        const queryDate = date ? new Date(date) : new Date();
        queryDate.setHours(0, 0, 0, 0);

        const summaries = await WeatherSummary.find({
            date: queryDate
        });
        res.json(summaries);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getHistoricalData = async (req, res) => {
    try {
        const { city, days = 7 } = req.query;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const data = await WeatherData.find({
            city,
            timestamp: { $gte: startDate }
        }).sort({ timestamp: 1 });

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};