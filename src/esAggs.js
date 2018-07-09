module.exports = function(name) {
    this.aggsList = [];
    this.agg;
    this.aggCount = 0;
    this.name = name;
    this.avg = (field, options) => {
        this.agg = {
            'avg': {
                field
            }
        };;
        this.aggCount++;
        return this;
    };

    this.getName = () => {
        return this.name;
    };
    this.cardinality = (field, options) => {
        this.agg = {
            'cardinality': {
                field
            }
        };;
        this.aggCount++;
        return this;
    };

    this.max = (field, options) => {
        this.agg = {
            'max': {
                field
            }
        };;
        this.aggCount++;
        return this;
    };

    this.min = (field, options) => {
        this.agg = {
            'min': {
                field
            }
        };
        this.aggCount++;
        return this;
    };

    this.sum = (field, options) => {
        this.agg = {
            'sum': {
                field
            }
        };;
        this.aggCount++;
        return this;
    };

    this.valueCount = (field, options) => {
        this.agg = {
            'value_count': {
                field
            }
        };
        this.aggCount++;
        return this;
    };

    this.stats = (field, options) => {
        this.agg = {
            'stats': {
                field
            }
        };
        this.aggCount++;
        return this;
    };

    this.percentiles = (field, options) => {
        this.agg = {
            'percentiles': {
                field
            }
        };
        this.aggCount++;
        return this;
    };

    this.percentileRanks = (field, options) => {
        this.agg = {
            'percentile_ranks': {
                field
            }
        };
        this.aggCount++;
        return this;
    };

    this.aggValueOf = () => {
        console.log("testtset", JSON.stringify(this.agg));
        return this.agg;
    };
};