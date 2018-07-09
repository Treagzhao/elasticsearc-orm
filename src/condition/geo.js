const Range = require('../esRange.js');
module.exports = function() {

    this.geoShape = (field, type, coordinates, opts={}) => {
        if (typeof field !== 'string' || typeof type !== 'string') {
            throw new Error('arguments type error');
        }
        if (Object.prototype.toString.call(coordinates).indexOf('Array') < 0) {
            throw new Error('arguments type error');
        }
        if (type === 'circle' && !opts.radius) {
            throw new Error('arguments type error');
        }
        this.count++;
        let param = {
            'geo_shape': {
                [field]: {
                    'shape': {
                        'type': type,
                        'coordinates': coordinates
                    },
                    'relation': opts.relation || 'within'
                }
            }
        };
        if (opts.radius) {
            param['geo_shape'][field].shape.radius = opts.radius;
        }

        this.must.push(param);
        return this;
    };

    this.geoDistance = (field, coordinates, radius) => {
        if (typeof field !== 'string' || typeof radius !== 'string') {
            throw new Error('arguments type error');
        }
        if (coordinates.lon === undefined || coordinates.lat === undefined) {
            throw new Error('arguments type error');
        }
        this.count++;
        let param = {
            'geo_distance': {
                'distance': radius,
                [field]: coordinates
            }
        };
        this.must.push(param);
        return this;
    }

    this.geoPolygon = (field, coordinates) => {
        if (typeof field !== 'string') {
            throw new Error('arguments type error');
        }
        if (Object.prototype.toString.call(coordinates).indexOf('Array') < 0) {
            throw new Error('arguments type error');
        }
        if (coordinates.length < 3) {
            throw new Error('coordinates length must be greater than 2');
        }
        this.count++;
        let param = {
            'geo_polygon': {
                [field]: {
                    'points': coordinates
                }
            }
        };
        this.must.push(param);
        return this;
    }

    /**
     * 这个方法已经在6.3版本里被废弃了
     **/
    // this.geoDistanceRange = (field, coordinates, from, to, fromEqual, toEqual) => {
    //     let param, range;
    //     if (typeof field !== 'string') {
    //         throw new Error('arguments type error');
    //     }
    //     if (coordinates.lon === undefined || coordinates.lat === undefined) {
    //         throw new Error('arguments type error');
    //     }
    //     if (from instanceof Range) {
    //         range = from;

    //     } else {
    //         if (typeof from !== 'string' || typeof to !== 'string') {
    //             throw new Error('arguments type error');
    //         }
    //         range = new Range(from, to, fromEqual, toEqual);
    //     }
    //     let rangeParam = range.valueOf();
    //     rangeParam[field] = coordinates;
    //     param = {
    //         'geo_distance_range': rangeParam
    //     }

    //     this.count++;
    //     this.must.push(param);
    //     return this;
    // };

    this.geoBoundingBox = (field, coordinates) => {
        if (typeof field !== 'string') {
            throw new Error('arguments type error');
        }
        if (!coordinates.top_left || !coordinates.bottom_right) {
            throw new Error('arguments type error');
        }
        this.count++;
        let param = {
            'geo_bounding_box': {
                [field]: {
                    'top_left': coordinates.top_left,
                    'bottom_right': coordinates.bottom_right
                }
            }
        };
        this.must.push(param);
        return this;
    }

};