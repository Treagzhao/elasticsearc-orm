const Condition = require('../../../src/esCondition.js');
const expect = require('chai').expect;

describe('测试精确值的 term 方法', function() {
    it('term 的边界测试', function() {
        let condition = new Condition();
        expect(function() {
            condition.term(undefined, undefined);
        }).to.throw(Error);
        condition = new Condition();
        expect(function() {
            condition.term('field', undefined);
        }).to.throw(Error);
        condition = new Condition();
        expect(function() {
            condition.term(undefined, 'value');
        }).to.throw(Error);
        condition = new Condition();
        expect(function() {
            condition.term(1, 'value');
        }).to.throw(Error);
        condition = new Condition();
        expect(function() {
            condition.term('field', 'value');
        }).to.not.throw(Error);
        condition = new Condition();
        expect(function() {
            condition.term('field', ['value1', 'value2']);
        }).to.not.throw(Error);
    });

    it('term 的参数设置', function() {
        let condition = new Condition();
        condition.term('field', 'value');
        expect(condition.valueOf()).to.have.property('term');
        expect(condition.valueOf().term).to.have.property('field', 'value');
        condition = new Condition();
        condition.term('field', ['values1', 'value2']);
        expect(condition.valueOf()).to.have.property('terms');
        expect(condition.valueOf().terms).to.have.property('field');
        expect(condition.valueOf().terms.field).to.have.lengthOf(2);
    });
});