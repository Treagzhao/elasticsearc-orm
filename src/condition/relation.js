let Condition = require('../esCondition.js');
module.exports = function() {
    this.hasParent = (parentType, condition) => {
        if (typeof parentType !== 'string') {
            throw new Error('arguments type error');
        }
        if (!(condition.isInstanceofCondition && condition.isInstanceofCondition())) {
            throw new Error('condition must be an instance of Condition');
        }
        this.count++;
        let param = {
            'has_parent': {
                'parent_type': parentType,
                'query': condition.valueOf()
            }
        };
        this.mustList.push(param);
        return this;
    };
    this.hasChild = (childType, condition) => {
        if (typeof childType !== 'string') {
            throw new Error('arguments type error');
        }
        if (!(condition.isInstanceofCondition && condition.isInstanceofCondition())) {
            throw new Error('condition must be an instance of Condition');
        }
        this.count++;
        let param = {
            'has_child': {
                'type': childType,
                'query': condition.valueOf()
            }
        };
        this.mustList.push(param);
        return this;
    };
};