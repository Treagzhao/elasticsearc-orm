const TextCondition = require('./condition/text.js'),
    KeywordCondition = require('./condition/keyword.js');

module.exports = function() {
    TextCondition.call(this);
    KeywordCondition.call(this);
    var self = this;
    this.must = [];
    this.should = [];
    this.not = [];
    this.count = 0;


    this.valueOf = () => {
        if (this.count === 1 && this.must.length === 1) {
            return this.must[0];
        } else {

        }
    };
}