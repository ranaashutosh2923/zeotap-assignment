const RuleNode = require('../models/RuleNode');
const ruleEngine = require('../services/ruleEngine');

exports.createRule = async (req, res) => {
    try {
        const { ruleString } = req.body;
        const ast = ruleEngine.parseRule(ruleString);
        const savedRule = await RuleNode.create(ast);
        res.status(201).json({ ruleString, id: savedRule._id });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.evaluateRule = async (req, res) => {
    try {
        const { ruleId, data } = req.body;
        const rule = await RuleNode.findById(ruleId);
        const result = ruleEngine.evaluateRule(rule, data);
        res.json({ result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};