class RuleEngine {
    parseRule(ruleString) {
        ruleString = ruleString.replace(/\s+/g, ' ').trim();
        const tokens = this.tokenize(ruleString);
        return this.buildAST(tokens);
    }

    tokenize(ruleString) {
        const regex = /([()[\]]|\bAND\b|\bOR\b|[<>=]=?|\w+|'[^']*'|\d+)/g;
        return ruleString.match(regex);
    }

    buildAST(tokens) {
        let position = 0;

        const parseExpression = () => {
            if (tokens[position] === '(') {
                position++;
                const left = parseExpression();
                const operator = tokens[position++];
                const right = parseExpression();
                position++;
                return {
                    type: 'operator',
                    operator: operator,
                    left: left,
                    right: right
                };
            } else {
                const field = tokens[position++];
                const operator = tokens[position++];
                const value = tokens[position++];
                return {
                    type: 'operand',
                    field: field,
                    operator: operator,
                    value: value.replace(/'/g, '')
                };
            }
        };

        return parseExpression();
    }

    evaluateRule(node, data) {
        if (node.type === 'operand') {
            const value = data[node.field];
            switch (node.operator) {
                case '>': return value > Number(node.value);
                case '<': return value < Number(node.value);
                case '=': return value === node.value;
                case '>=': return value >= Number(node.value);
                case '<=': return value <= Number(node.value);
                default: return false;
            }
        }

        if (node.operator === 'AND') {
            return this.evaluateRule(node.left, data) && this.evaluateRule(node.right, data);
        }
        if (node.operator === 'OR') {
            return this.evaluateRule(node.left, data) || this.evaluateRule(node.right, data);
        }

        return false;
    }
}

module.exports = new RuleEngine();