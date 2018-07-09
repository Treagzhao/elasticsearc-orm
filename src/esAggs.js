module.exports = function() {
    this.aggsList = [];
    this.agg;
    this.aggCount = 0;
    this.avg = (name, field, options) => {
        this.agg = {
            'avg': {
                [name]: {
                    field
                }
            }
        };;
        this.aggCount++;
    };

    this.cardinality = (name, field, options) => {
        this.agg = {
            'cardinality': {
                [name]: {
                    field
                }
            }
        };;
        this.aggCount++;
    };

    this.max = (name, field, options) => {
        this.agg = {
            'max': {
                [name]: {
                    field
                }
            }
        };;
        this.aggCount++;
    };

    this.min = (name, field, options) => {
        this.agg = {
            'min': {
                [name]: {
                    field
                }
            }
        };
        this.aggCount++;
    };

    this.sum = (name, field, options) => {
        this.agg = {
            'sum': {
                [name]: {
                    field
                }
            }
        };;
        this.aggCount++;
    };

    this.valueCount = (name, field, options) => {
        this.agg = {
            'value_count': {
                [name]: {
                    field
                }
            }
        };
        this.aggCount++;
    };

    this.stats = (name, field, options) => {
        this.agg = {
            'stats': {
                [name]: {
                    field
                }
            }
        };
        this.aggCount++;
    };

    this.percentiles = (name, field, options) => {
        this.agg = {
            'percentiles': {
                [name]: {
                    field
                }
            }
        };
        this.aggCount++;
    };

    this.percentileRanks = (name, field, options) => {
        this.agg = {
            'percentile_ranks': {
                [name]: {
                    field
                }
            }
        };
        this.aggCount++;
    };

    this.aggValueOf = () => {

    };
};