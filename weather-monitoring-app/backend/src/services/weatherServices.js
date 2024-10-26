const axios = require('axios');
const WeatherData = require('../models/weatherData.js');
const WeatherSummary = require('../models/weatherSummary.js');
const weatherData = require('../models/weatherData');
const weatherSummary = require('../models/weatherSummary');

class WeatherService {
    constructor() {
        this.apiKey = process.env.OPENWEATHER_API_KEY;
        this.cities = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'];
        this.tempThreshold = 35; // Temperature threshold in Celsius
    }

    kelvinToCelsius(kelvin) {
        return Math.round((kelvin - 273.15) * 10) / 10;
    }

    async fetchWeatherData() {
        console.log('Fetching weather data...');
        
        for (const city of this.cities) {
            try {
                
                const response = await axios.get(
                    `https://api.openweathermap.org/data/2.5/weather?q=${city},IN&appid=${this.apiKey}`
                );

                

                const weatherData = new WeatherData({
                    city,
                    main: response.data.weather[0].main,
                    temp: this.kelvinToCelsius(response.data.main.temp),
                    feels_like: this.kelvinToCelsius(response.data.main.feels_like),
                    humidity: response.data.main.humidity,
                    wind_speed: response.data.wind.speed,
                    timestamp: new Date()
                });

                await weatherData.save();
                await this.checkThresholds(weatherData);
                await this.updateDailySummary(city);
                
                console.log(`Weather data updated for ${city}`);
            } catch (error) {
                console.error(`Error fetching weather data for ${city}:`, error.message);
            }
        }
    }

    async updateDailySummary(city) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todayData = await WeatherData.find({
            city,
            timestamp: { $gte: today }
        });

        if (todayData.length === 0) return;

        // Calculate aggregates
        const temps = todayData.map(data => data.temp);
        const humidities = todayData.map(data => data.humidity);
        const windSpeeds = todayData.map(data => data.wind_speed);
        const conditions = todayData.map(data => data.main);

        // Find dominant condition
        const conditionCounts = {};
        conditions.forEach(condition => {
            conditionCounts[condition] = (conditionCounts[condition] || 0) + 1;
        });
        const dominantCondition = Object.entries(conditionCounts)
            .reduce((a, b) => a[1] > b[1] ? a : b)[0];

        await WeatherSummary.findOneAndUpdate(
            { city, date: today },
            {
                avgTemp: temps.reduce((a, b) => a + b) / temps.length,
                maxTemp: Math.max(...temps),
                minTemp: Math.min(...temps),
                avgHumidity: humidities.reduce((a, b) => a + b) / humidities.length,
                avgWindSpeed: windSpeeds.reduce((a, b) => a + b) / windSpeeds.length,
                dominantCondition,
                readings: todayData.length
            },
            { upsert: true }
        );
    }

    async checkThresholds(weatherData) {
        const recentReadings = await WeatherData.find({
            city: weatherData.city,
            timestamp: { 
                $gte: new Date(Date.now() - 15 * 60000) // Last 15 minutes
            }
        }).sort({ timestamp: -1 }).limit(2);

        if (recentReadings.length === 2 && 
            recentReadings.every(reading => reading.temp > this.tempThreshold)) {
            console.log(`🔥 ALERT: Temperature in ${weatherData.city} has exceeded ${this.tempThreshold}°C for consecutive readings`);
           
        }
    }

    async getLatestReadings() {
        const latestReadings = {};
        for (const city of this.cities) {
            const reading = await WeatherData.findOne({ city })
                .sort({ timestamp: -1 });
            if (reading) {
                latestReadings[city] = reading;
            }
        }
        return latestReadings;
    }
}

module.exports = new WeatherService();