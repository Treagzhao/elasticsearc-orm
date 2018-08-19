const Range = require('../esRange.js');
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

    this.geoDistance = (field, origin, ranges, options = {}) => {
        if (typeof field !== 'string' || !ranges) {
            throw new Error('arguments type error');
        }
        if (!origin.lon || !origin.lat) {
            throw new Error('origin must be a geoPoint');
        }
        if (Object.prototype.toString.call(ranges).indexOf("Array") < 0) {
            throw new Error('ranges must be a list');
        }
        let flag = ranges.every((item) => {
            return item instanceof Range;
        });
        if (!flag) {
            throw new Error('ranges must be a list of ESRange');
        }
        this.aggCount++;

        this.agg = {
            'geo_distance': {
                field,
                origin,
                'unit': options.unit,
                'ranges': ranges.map((item) => { return item.fromToValue() })
            }
        };
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