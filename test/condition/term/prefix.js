const Condition = require('../../../src/esCondition.js');
const expect = require('chai').expect;

describe('精确值的 prefix 方法测试', function() {
    it('prefix 方法的边界测试', function() {
        let condition = new Condition();
        expect(function() {
            condition.prefix();
        }).to.throw(Error);
        condition = new Condition();
        expect(function() {
            condition.prefix('field');
        }).to.throw(Error);
        condition = new Condition();
        expect(function() {
            condition.prefix('field', 'value');
        }).to.not.throw(Error);
        condition = new Condition();
        expect(condition.prefix('field', 'value')).to.equal(condition);
    });

    it('prefix 的参数测试', function() {
        let condition = new Condition();
        condition.prefix('field', 'value');
        expect(condition.valueOf()).to.have.property('prefix');
        expect(condition.valueOf().prefix).to.have.property('field', 'value');
    });
});