module.exports = function() {

    this.geoShape = (field, type, coordinates, opts) => {
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
                        'coordinates': [coordinates]
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

    this.geoDistanceRange = (field, coordinates, from, to, fromEqual, toEqual) => {
        if (typeof field !== 'string' || typeof from !== 'string' || typeof to !== 'string') {
            throw new Error('arguments type error');
        }
        if (coordinates.lon === undefined || coordinates.lat === undefined) {
            throw new Error('arguments type error');
        }
        this.count++;
        let param = {
            'geo_distance_range': {
                from,
                to,
                [field]: coordinates
            }
        }
        this.must.push(param);
        return this;
    };

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