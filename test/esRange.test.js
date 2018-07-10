const Range = require('../src/esRange.js');
const expect = require('chai').expect;
describe('ES Range 相关测试', function() {
    it('新建一个范围', function() {
        let range = new Range();
        expect(range).to.be.an.instanceof(Range);
    });
    it('一个空范围的取值', function() {
        let range = new Range();
        expect(range.valueOf).to.throw(Error);
    });
    it('只赋值 to 的取值范围', function() {
        let range = new Range(undefined, 10);
        expect(range.valueOf()).to.have.property('lt', 10);
        expect(range.fromToValue()).to.have.property('to', 10);
        range = new Range(undefined, 10, false, true);
        expect(range.valueOf()).to.have.property('lte', 10);
        expect(range.fromToValue()).to.have.property('to', 10);
        range = new Range().lt(10);
        expect(range.valueOf()).to.have.property('lt', 10);
        expect(range.fromToValue()).to.have.property('to', 10);
        range = new Range().lt(10, true);
        expect(range.valueOf()).to.have.property('lte', 10);
        expect(range.fromToValue()).to.have.property('to', 10);
    });

    it('只赋值 from 的取值范围', function() {
        let range = new Range(10);
        expect(range.valueOf()).to.have.property('gt', 10);
        expect(range.fromToValue()).to.have.property('from', 10);
        range = new Range(10, null, true);
        expect(range.valueOf()).to.have.property('gte', 10);
        expect(range.fromToValue()).to.have.property('from', 10);
        range = new Range().gt(10);
        expect(range.valueOf()).to.have.property('gt', 10);
        expect(range.fromToValue()).to.have.property('from', 10);
        range = new Range().gt(10, true);
        expect(range.valueOf()).to.have.property('gte', 10);
        expect(range.fromToValue()).to.have.property('from', 10);
    });
    it('同时赋值 from 和 to的 取值范围', function() {
        let range = new Range(0, 10);
        expect(range.valueOf()).to.have.all.keys('lt', 'gt');
        expect(range.valueOf()).to.have.property('lt', 10);
        expect(range.valueOf()).to.have.property('gt', 0);
        expect(range.fromToValue()).to.have.all.keys('from', 'to');
        range = new Range(0, 10, true, true);
        expect(range.valueOf()).to.have.all.keys('lte', 'gte');
        expect(range.valueOf()).to.have.property('lte', 10);
        expect(range.valueOf()).to.have.property('gte', 0);
        expect(range.fromToValue()).to.have.all.keys('from', 'to');
        range = new Range(10, 0);
        expect(range.valueOf()).to.have.all.keys('lt', 'gt');
        expect(range.valueOf()).to.have.property('lt', 0);
        expect(range.valueOf()).to.have.property('gt', 10);
        expect(range.fromToValue()).to.have.all.keys('from', 'to');
        range = new Range(10, 0, true, true);
        expect(range.valueOf()).to.have.all.keys('lte', 'gte');
        expect(range.valueOf()).to.have.property('lte', 0);
        expect(range.valueOf()).to.have.property('gte', 10);
        expect(range.fromToValue()).to.have.all.keys('from', 'to');
        range = new Range().gt(10).lt(20, true);
        expect(range.valueOf()).to.have.all.keys('lte', 'gt');
        expect(range.fromToValue()).to.have.all.keys('from', 'to');
        range = new Range().gt(10, true).lt(10);
        expect(range.valueOf()).to.have.all.keys('lt', 'gte');
        expect(range.fromToValue()).to.have.all.keys('from', 'to');
    });
});