const ValueAggs = require('./aggs/value.js');
const Geo = require('./aggs/geo.js');
const GroupAggs = require('./aggs/group.js');
module.exports = function(name) {
    if (typeof name !== 'string' || name.length == 0) {
        throw new Error('arguments name must be an string');
    }
    ValueAggs.call(this, name);
    Geo.call(this, name);
    GroupAggs.call(this, name);
    this.aggsList = [];
    this.agg = {};
    this.aggCount = 0;
    this.name = name;

    this.getName = () => {
        return this.name;
    };

    this.aggValueOf = () => {
        if (this.aggsList.length > 0) {
            this.agg.aggs = {};
            this.aggsList.forEach((agg) => {
                let name = agg.getName();
                this.agg.aggs[name] = agg.aggValueOf();
            });
        }
        return this.agg;
    };

    this.aggs = (aggs) => {
        if (!aggs instanceof module.exports) {
            throw new Error('aggs must be an instance of Aggs');
        }
        this.aggsList.push(aggs);
        return this;
    };
};

let i = new module.exports('a');
console.log(i);