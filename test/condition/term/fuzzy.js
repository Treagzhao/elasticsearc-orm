const Condition = require('../../../src/esCondition.js');
const expect = require('chai').expect;

describe('精确值的 fuzzy 方法测试', function() {
    it('fuzzy 方法的边界测试', function() {
        let condition = new Condition();
        expect(function() {
            condition.fuzzy();
        }).to.throw(Error);
        condition = new Condition();
        expect(function() {
            condition.fuzzy('field');
        }).to.throw(Error);
        condition = new Condition();
        expect(function() {
            condition.fuzzy('field', 'value');
        }).to.not.throw(Error);
        condition = new Condition();
        expect(condition.fuzzy('field', 'value')).to.equal(condition);
    });

    it('fuzzy 的参数测试', function() {
        let condition = new Condition();
        condition.fuzzy('field', 'value');
        expect(condition.valueOf()).to.have.property('fuzzy');
        expect(condition.valueOf().fuzzy).to.have.property('field', 'value');
    });
});