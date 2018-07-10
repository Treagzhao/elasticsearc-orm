const Condition = require('../../../src/esCondition.js');
const expect = require('chai').expect;

describe('测试关系类型的 hasChild方法', function() {
    it('hasChild 的边界测试', function() {
        let condition = new Condition();
        expect(function() {
            condition.hasChild();
        }).to.throw(Error);
        condition = new Condition();
        expect(function() {
            condition.hasChild('parentType')
        }).to.throw(Error);
        condition = new Condition();
        expect(function() {
            condition.hasChild('parentType', 'test');
        }).to.throw(Error);
        condition = new Condition();
        expect(function() {
            condition.hasChild('parentType', new Condition());
        }).to.not.throw(Error);
        condition = new Condition();
        expect(condition.hasChild("parent", new Condition())).to.equal(condition);
    });

    it('hasChild的参数测试', function() {
        let condition = new Condition();
        condition.hasChild('parent1', new Condition());
        expect(condition.valueOf()).to.have.property('has_child');
        expect(condition.valueOf().has_child).to.have.property('type', 'parent1');
        expect(condition.valueOf().has_child).to.have.property('query');
    });
});