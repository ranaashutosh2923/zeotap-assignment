const mongoose = require('mongoose');

const weatherSummarySchema = new mongoose.Schema({
    city: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    avgTemp: Number,
    maxTemp: Number,
    minTemp: Number,
    avgHumidity: Number,
    avgWindSpeed: Number,
    dominantCondition: String,
    readings: Number
});

module.exports = mongoose.model('WeatherSummary', weatherSummarySchema);