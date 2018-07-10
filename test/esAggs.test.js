const Aggs = require('../src/esAggs.js');
const expect = require('chai').expect;

describe('测试聚合的功能', function() {
    it('聚合对象的边界测试', function() {
        expect(function() {
            new Aggs();
        }).to.throw(Error);
        expect(function() {
            new Aggs('');
        }).to.throw(Error);
        expect(function() {
            new Aggs('name');
        }).to.not.throw(Error);
    });

    it("聚合对象的子对象测试", function() {
        let aggs = new Aggs('name');
        aggs.aggs(new Aggs("name_sub").avg('age'));
        expect(aggs.aggValueOf()).to.be.a('object');
        expect(aggs.aggValueOf()).to.have.property('aggs');
        expect(aggs.aggValueOf().aggs).to.have.property('name_sub');
    });
});