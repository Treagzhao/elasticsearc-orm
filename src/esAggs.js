const ValueAggs = require('./aggs/value.js');
const Geo = require('./aggs/geo.js');
const GroupAggs = require('./aggs/group.js');
module.exports = function(name) {
    ValueAggs.call(this, name);
    Geo.call(this, name);
    GroupAggs.call(this, name);
    this.aggsList = [];
    this.agg;
    this.aggCount = 0;
    this.name = name;

    this.getName = () => {
        return this.name;
    };

    this.aggValueOf = () => {
        return this.agg;
    };
};