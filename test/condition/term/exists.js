const Condition = require('../../../src/esCondition.js');
const expect = require('chai').expect;

describe('测试精确值 exists ', function() {
    it('exists 边界测试', function() {
        let condition = new Condition();
        expect(function() {
            condition.exists();
        }).to.throw(Error);
        condition = new Condition();
        expect(function() {
            condition.exists('field');
        }).to.not.throw(Error);
        condition = new Condition();
        expect(function() {
            condition.exists(['field1', 'field2'])
        }).to.not.throw(Error);
        condition = new Condition();
        expect(function() {
            condition.exists(null);
        }).to.throw(Error);
        condition = new Condition();
        expect(condition.exists('field1')).to.equal(condition);
    });

    it('exists 参数测试', function() {
        let condition = new Condition();
        condition.exists('field')
        expect(condition.valueOf()).to.have.property('exists');
        expect(condition.valueOf().exists).to.have.property('field', 'field');
        condition = new Condition();
        condition.exists(['field1', 'field2']);
        expect(condition.valueOf()).to.have.property('exists');
        expect(condition.valueOf().exists).to.have.property('fields');
        expect(condition.valueOf().exists.fields).to.have.lengthOf(2);
    });
});