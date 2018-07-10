module.exports = function() {
    this.avg = (field, options = {}) => {
        if (typeof field !== 'string') {
            throw new Error('arguments type error');
        }
        this.agg = {
            'avg': {
                field
            }
        };;
        this.aggCount++;
        return this;
    };


    this.cardinality = (field, options = {}) => {
        if (typeof field !== 'string') {
            throw new Error('arguments type error');
        }
        this.agg = {
            'cardinality': {
                field
            }
        };;
        this.aggCount++;
        return this;
    };

    this.max = (field, options = {}) => {
        if (typeof field !== 'string') {
            throw new Error('arguments type error');
        }
        this.agg = {
            'max': {
                field
            }
        };;
        this.aggCount++;
        return this;
    };

    this.min = (field, options = {}) => {
        if (typeof field !== 'string') {
            throw new Error('arguments type error');
        }
        this.agg = {
            'min': {
                field
            }
        };
        this.aggCount++;
        return this;
    };

    this.sum = (field, options = {}) => {
        if (typeof field !== 'string') {
            throw new Error('arguments type error');
        }
        this.agg = {
            'sum': {
                field
            }
        };;
        this.aggCount++;
        return this;
    };

    this.valueCount = (field, options = {}) => {
        if (typeof field !== 'string') {
            throw new Error('arguments type error');
        }
        this.agg = {
            'value_count': {
                field
            }
        };
        this.aggCount++;
        return this;
    };

    this.stats = (field, options = {}) => {
        if (typeof field !== 'string') {
            throw new Error('arguments type error');
        }
        this.agg = {
            'stats': {
                field
            }
        };
        this.aggCount++;
        return this;
    };

    this.percentiles = (field, options = {}) => {
        if (typeof field !== 'string') {
            throw new Error('arguments type error');
        }
        this.agg = {
            'percentiles': {
                field
            }
        };
        this.aggCount++;
        return this;
    };

    this.percentileRanks = (field, options = {}) => {
        if (typeof field !== 'string') {
            throw new Error('arguments type error');
        }
        this.agg = {
            'percentile_ranks': {
                field
            }
        };
        this.aggCount++;
        return this;
    };
};
