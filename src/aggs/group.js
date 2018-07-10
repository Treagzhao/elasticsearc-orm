let Range = require('../esRange.js');
let Condition = require('../esCondition.js');
module.exports = function(name) {
    this.terms = (field, options = {}) => {
        if (typeof field !== 'string') {
            throw new Error('arguments type error');
        }
        this.aggCount++;
        let params = {
            'terms': {
                field
            }
        };
        if (options.order) {
            let type = options.order.type.toLowerCase();
            if (type !== 'asc' && type !== 'desc') {
                throw new Error('order type must be on of `asc` or `desc`');
            }
            params.order[options.order.field] = options.order.type;
        }
        if (options.size) {
            params.size = options.size;
        }
        this.agg = params;
        return this;
    };

    this.histogram = (field, interval) => {
        if (typeof field !== 'string' || typeof interval !== 'number' || interval <= 0) {
            throw new Error('arguments type error');
        }
        this.aggCount++;
        let param = {
            'histogram': {
                field,
                interval
            }
        };
        this.agg = param;
        return this;
    };

    this.dateHistogram = (field, interval, options = {}) => {
        if (typeof field !== 'string' || typeof interval !== 'string') {
            throw new Error('arguments type error');
        }
        this.aggCount++;
        let param = {
            'date_histogram': {
                field,
                interval
            }
        };
        let ordinary = ['format', 'time_zone', 'offset'];
        ordinary.forEach((key) => {
            if (options[key]) {
                param.date_histogram[key] = options[key];
            }
        });
        this.agg = param;
        return this;
    };

    this.dateRange = (field, ranges, options = {}) => {
        if (typeof field !== 'string') {
            throw new Error('arguments type error');
        }
        let flag = ranges.every((item) => {
            return item instanceof Range;
        });
        if (!flag) {
            throw new Error('ranges must be a list of ESRange');
        }
        this.aggCount++;
        let param = {
            'date_range': {
                field,
                'ranges': ranges.map((item) => { return item.fromToValue() })
            }
        };
        let ordinary = ['format'];
        ordinary.forEach((key) => {
            if (options[key]) {
                param.date_histogram[key] = options[key];
            }
        });
        this.agg = param;
        return this;
    };

    this.range = (field, ranges) => {
        if (typeof field !== 'string') {
            throw new Error('arguments type error');
        }
        let flag = ranges.every((item) => {
            return item instanceof Range;
        });
        if (!flag) {
            throw new Error('ranges must be a list of ESRange');
        }
        this.aggCount++;
        let param = {
            'range': {
                field,
                'ranges': ranges.map((item) => { return item.fromToValue() })
            }
        };
        this.agg = param;
        return this;
    };

    this.filter = (field, condition) => {
        if (typeof field !== 'string') {
            throw new Error('arguments type error');
        }
        if (!condition instanceof Condition) {
            throw new Error('condition must be an instance of ESCondition');
        }
        this.aggCount++;
        this.agg = {
            'filter': condition.valueOf()
        };
        return this;
    };

    this.missing = (field) => {
        if (typeof field !== 'string') {
            throw new Error('arguments type error');
        }
        this.agg = {
            'missing': {
                field
            }
        };
        this.aggCount++;
        return this;
    };
    this.sampler = (shardSize = 100, options = {}) => {
        if (typeof shardSize !== 'number' || shardSize <= 0) {
            throw new Error('shardSize must be a positive integer');
        }
        let param = {
            'sampler': {
                'shard_size': shardSize
            }
        };
        let ordinary = ['max_doc_per_value'];
        ordinary.forEach((key) => {
            if (options[key] !== undefined) {
                param.date_histogram[key] = options[key];
            }
        });
        this.agg = param;
        this.aggCount++;
        return this;
    };

    this.significantTerms = (field) => {
        if (typeof field !== 'string') {
            throw new Error('arguments type error');
        }
        this.agg = {
            'significant_terms': {
                field
            }
        };
        this.aggCount++;
        return this;
    };
};