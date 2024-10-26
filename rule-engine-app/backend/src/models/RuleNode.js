const mongoose = require('mongoose');

const ruleNodeSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['operator', 'operand'],
        required: true
    },
    operator: {
        type: String,
        enum: ['AND', 'OR', '>', '<', '=', '>=', '<='],
        required: function() { return this.type === 'operator'; }
    },
    field: {
        type: String,
        required: function() { return this.type === 'operand'; }
    },
    value: {
        type: mongoose.Schema.Types.Mixed,
        required: function() { return this.type === 'operand'; }
    },
    left: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RuleNode'
    },
    right: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RuleNode'
    }
});

module.exports = mongoose.model('RuleNode', ruleNodeSchema);