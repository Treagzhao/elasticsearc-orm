const TextCondition = require('./condition/text.js'),
    KeywordCondition = require('./condition/keyword.js'),
    GeoCondition = require('./condition/geo.js');

module.exports = function() {
    TextCondition.call(this);
    KeywordCondition.call(this);
    GeoCondition.call(this);
    var self = this;
    this.mustList = [];
    this.shouldList = [];
    this.notList = [];
    this.filterList = [];
    this.count = 0;


    this.must = (condition) => {
        if (!condition instanceof module.exports) {
            throw new Error('condition must be an instance of ESCondition');
        }
        this.mustList.push(condition);
        this.count++;
        return this;
    };


    this.should = (condition) => {
        if (!condition instanceof module.exports) {
            throw new Error('condition must be an instance of ESCondition');
        }
        this.shouldList.push(condition);
        this.count++;
        return this;
    };

    this.not = (condition) => {
        if (!condition instanceof module.exports) {
            throw new Error('condition must be an instance of ESCondition');
        }
        this.notList.push(condition);
        this.count++;
        return this;
    };

    this.valueOf = () => {
        if (this.count === 1 && this.mustList.length === 1) {
            let condition = this.mustList[0];
            if (condition instanceof module.exports) {
                return condition.valueOf();
            } else {
                return condition;
            }
        } else {
            let mustList = this.mustList.map((condition) => {
                return condition.valueOf();
            });
            let shouldList = this.shouldList.map((condition) => {
                return condition.valueOf();
            });
            let notList = this.notList.map((condition) => {
                return condition.valueOf();
            });
            let ret = {};
            if (mustList.length > 0) {
                ret.must = mustList;
            }
            if (shouldList.length > 0) {
                ret.should = shouldList;
            }
            if (notList.length > 0) {
                ret.must_not = notList;
            }
            return {
                'bool': ret
            };
        }
    };
}