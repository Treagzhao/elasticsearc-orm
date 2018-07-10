const Condition = require('../../../src/esCondition.js');
const expect = require('chai').expect;
const Range = require('../../../src/esRange.js');
describe('测试精确值的 range 方法', function() {
    it('测试 range 方法的边界', function() {
        let condition = new Condition();
        expect(function() {
            condition.range();
        }).to.throw(Error);
        condition = new Condition();
        expect(function() {
            condition.range(null, 10, 10);
        }).to.throw(Error);
        condition = new Condition();
        expect(function() {
            condition.range('field');
        }).to.throw(Error);
        condition = new Condition();
        expect(function() {
            condition.range('field', 1);
        }).to.not.throw(Error);
        condition = new Condition();
        expect(function() {
            condition.range('field', undefined, 1);
        }).to.not.throw(Error);
        condition = new Condition();
        expect(function() {
            //range 没有设置值
            condition.range('field', new Range());
        }).to.throw(Error);
        condition = new Condition();
        expect(function() {
            condition.range('field', new Range(10))
        }).to.not.throw(Error);
        condition = new Condition();
        expect(condition.range('field', 1, 10)).to.equal(condition);
    });

    it('测试 range 方法的参数——通过参数方法', function() {
        //左边界
        let condition = new Condition();
        condition.range('field', 1);
        expect(condition.valueOf()).to.have.property('range');
        expect(condition.valueOf().range).to.have.property('field');
        expect(condition.valueOf().range.field).to.have.property('gt', 1);
        condition = new Condition();
        condition.range('field', 1, null, true);
        expect(condition.valueOf()).to.have.property('range');
        expect(condition.valueOf().range).to.have.property('field');
        expect(condition.valueOf().range.field).to.have.property('gte', 1);
        //右边界
        condition = new Condition();
        condition.range('field', undefined, 1);
        expect(condition.valueOf()).to.have.property('range');
        expect(condition.valueOf().range).to.have.property('field');
        expect(condition.valueOf().range.field).to.have.property('lt', 1);
        condition = new Condition();
        condition.range('field', undefined, 1, false, true);
        expect(condition.valueOf()).to.have.property('range');
        expect(condition.valueOf().range).to.have.property('field');
        expect(condition.valueOf().range.field).to.have.property('lte', 1);
        //双边界
        condition = new Condition();
        condition.range('field', 1, 10);
        expect(condition.valueOf()).to.have.property('range');
        expect(condition.valueOf().range).to.have.property('field');
        expect(condition.valueOf().range.field).to.have.property('gt', 1);
        expect(condition.valueOf().range.field).to.have.property('lt', 10);
        condition = new Condition();
        condition.range('field', 1, 10, true, true);
        expect(condition.valueOf()).to.have.property('range');
        expect(condition.valueOf().range).to.have.property('field');
        expect(condition.valueOf().range.field).to.have.property('gte', 1);
        expect(condition.valueOf().range.field).to.have.property('lte', 10);
    });

    it('测试 range 方法的参数——通过 Range 对象', function() {
        let condition = new Condition();
        let range = new Range(1, 10);
        condition.range('field', range);
        expect(condition.valueOf()).to.have.property('range');
        expect(condition.valueOf().range).to.have.property('field');
        expect(condition.valueOf().range.field).to.have.property('gt', 1);
        expect(condition.valueOf().range.field).to.have.property('lt', 10);
    });
});