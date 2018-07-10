const Condition = require('../../../src/esCondition.js');
const expect = require('chai').expect;

describe('测试关系类型的 HasParent方法', function() {
    it('hasParent 的边界测试', function() {
        let condition = new Condition();
        expect(function() {
            condition.hasParent();
        }).to.throw(Error);
        condition = new Condition();
        expect(function() {
            condition.hasParent('parentType')
        }).to.throw(Error);
        condition = new Condition();
        expect(function() {
            condition.hasParent('parentType', 'test');
        }).to.throw(Error);
        condition = new Condition();
        expect(function() {
            condition.hasParent('parentType', new Condition());
        }).to.not.throw(Error);
        condition = new Condition();
        expect(condition.hasParent("parent", new Condition())).to.equal(condition);
    });

    it('hasParent的参数测试', function() {
        let condition = new Condition();
        condition.hasParent('parent1', new Condition());
        expect(condition.valueOf()).to.have.property('has_parent');
        expect(condition.valueOf().has_parent).to.have.property('parent_type', 'parent1');
        expect(condition.valueOf().has_parent).to.have.property('query');
    });
});