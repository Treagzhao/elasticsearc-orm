const Aggs = require('../../src/esAggs.js');
const expect = require('chai').expect;
describe('基本数值型聚合测试', function() {
    let methods = ['avg', 'cardinality', 'max', 'min', 'sum', 'valueCount', 'stats', 'percentiles', 'percentileRanks'];
    methods.forEach(function(method) {
        it('测试基本聚合 ' + method + " 的功能", function() {
            let aggs = new Aggs('name');
            expect(function() {
                aggs[method]();
            }).to.throw(Error);
            aggs = new Aggs('name');
            expect(function() {
                aggs[method]('field')
            }).to.not.throw(Error);
            aggs = new Aggs('name');
            aggs[method]('field');
            expect(aggs.aggValueOf()).to.be.a('object');
            method = method.replace(/[A-Z]/g, function(str) {
                return '_' + str.toLowerCase();
            });
            expect(aggs.aggValueOf()).to.have.property(method);
        });
    });
});