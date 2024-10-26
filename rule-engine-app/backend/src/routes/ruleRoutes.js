const express = require('express');
const ruleController = require('../controllers/ruleController');
const router = express.Router();

router.post('/rules', ruleController.createRule);
router.post('/evaluate', ruleController.evaluateRule);

module.exports = router;
