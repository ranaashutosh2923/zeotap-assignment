const express = require('express');
const weatherController = require('../controllers/weatherController.js');
const router = express.Router();

router.get('/latest', weatherController.getLatestWeather);
router.get('/summary', weatherController.getDailySummary);
router.get('/historical', weatherController.getHistoricalData);

module.exports = router;