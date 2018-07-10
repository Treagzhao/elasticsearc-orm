const Condition = require('../../../src/esCondition.js');
const expect = require('chai').expect;

describe('精确值的 wildcard 方法测试', function() {
    it('wildcard 方法的边界测试', function() {
        let condition = new Condition();
        expect(function() {
            condition.wildcard();
        }).to.throw(Error);
        condition = new Condition();
        expect(function() {
            condition.wildcard('field');
        }).to.throw(Error);
        condition = new Condition();
        expect(function() {
            condition.wildcard('field', 'value');
        }).to.not.throw(Error);
        condition = new Condition();
        expect(condition.wildcard('field', 'value')).to.equal(condition);
    });

    it('wildcard 的参数测试', function() {
        let condition = new Condition();
        condition.wildcard('field', 'value');
        expect(condition.valueOf()).to.have.property('wildcard');
        expect(condition.valueOf().wildcard).to.have.property('field', 'value');
    });
});