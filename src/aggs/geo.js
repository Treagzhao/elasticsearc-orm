module.exports = function(name) {
    this.geoBounds = (field, options = {}) => {
        if (typeof field !== 'string') {
            throw new Error('arguments type error');
        }
        let param = {
            'geo_bounds': {
                field
            }
        };
        if (options.wrap_longtitude) {
            param.geo_bounds.wrap_longtitude = true;
        }
        this.agg = param;
        this.aggCount++;
        return this;
    };

    this.geoCentroid = (field, options = {}) => {
        if (typeof field !== 'string') {
            throw new Error('arguments type error');
        }
        this.agg = {
            'geo_centroid': {
                field
            }
        };
        this.aggCount++;
        return this;
    }
};