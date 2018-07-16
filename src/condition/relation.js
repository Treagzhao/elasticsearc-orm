let Condition = require('../esCondition.js');
module.exports = function() {
    this.hasParent = (parentType, condition, options = {}) => {
        if (typeof parentType !== 'string') {
            throw new Error('arguments type error');
        }
        if (!(condition && condition.isInstanceofCondition && condition.isInstanceofCondition())) {
            throw new Error('condition must be an instance of Condition');
        }
        this.count++;
        let param = {
            'has_parent': {
                'parent_type': parentType,
                'query': condition.valueOf()
            }
        };
        if (options.score) {
            param.has_parent.score = options.score;
        }
        this.mustList.push(param);
        return this;
    };
    this.hasChild = (childType, condition, options = {}) => {
        if (typeof childType !== 'string') {
            throw new Error('arguments type error');
        }
        if (!(condition.isInstanceofCondition && condition.isInstanceofCondition())) {
            throw new Error('condition must be an instance of Condition');
        }
        this.count++;
        let ordinary = ['score_mode', 'min_children', 'max_children'];
        let param = {
            'has_child': {
                'type': childType,
                'query': condition.valueOf()
            }
        };
        ordinary.forEach((item) => {
            if (options[item] !== undefined) {
                param.has_child[item] = options[item];
            }
        });
        this.mustList.push(param);
        return this;
    };
    this.parentId = (parentId, type) => {
        if (parentId === undefined || typeof type !== 'string') {
            throw new Error('arguments type error');
        }
        this.count++;
        let param = {
            'parent_id': {
                type,
                'id': parentId
            }
        };
        this.mustList.push(param);
        return this;
    };
};