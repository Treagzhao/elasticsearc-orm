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

};