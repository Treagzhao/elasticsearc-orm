const TextCondition = require('./condition/text.js'),
    KeywordCondition = require('./condition/keyword.js'),
    GeoCondition = require('./condition/geo.js');

module.exports = function() {
    TextCondition.call(this);
    KeywordCondition.call(this);
    GeoCondition.call(this);
    var self = this;
    this.must = [];
    this.should = [];
    this.not = [];
    this.count = 0;


    this.valueOf = () => {
        if (this.count === 1 && this.must.length === 1) {
            let condition = this.must[0];
            if (condition instanceof module.exports) {

            } else {
                return condition;
            }
        } else {

        }
    };
}