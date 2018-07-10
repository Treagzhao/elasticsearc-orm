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

    this.dateRange = (field, from, to, options = {}) => {
        if (typeof field !== 'string' || typeof from !== 'string' || typeof to !== 'string') {
            throw new Error('arguments type error');
        }
        this.aggCount++;
        return this;
    };

};