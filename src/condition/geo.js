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
                        'coordinates': coordinates
                    }
                }
            }
        };
        if (opts.radius) {
            param['geo_shape'][field].shape.radius = opts.radius;
        }

        this.must.push(param);
        return this;
    };

};