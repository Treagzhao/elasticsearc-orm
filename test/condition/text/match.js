const Condition = require('../../../src/esCondition.js');
const expect = require('chai').expect;

describe('测试文本的 match 方法', function() {
    it('match方法的边界条件测试', function() {
        let condition = new Condition();
        expect(function() {
            condition.match(null, null);
        }).to.throw(Error);
        condition = new Condition();
        expect(function() {
            condition.match(null, 'text');
        }).to.throw(Error);
        condition = new Condition();
        expect(function() {
            condition.match('field', null);
        }).to.throw(Error);
        condition = new Condition();
        expect(function() {
            condition.match('field', 'text');
        }).to.not.throw(Error);
        condition = new Condition();
        expect(function() {
            condition.match(['field1', 'field2'], 'text');
        }).to.not.throw(Error);
        condition = new Condition();
        expect(condition.match('field', 'text')).to.equal(condition);
    });
    it('匹配单个字段测试', function() {
        let condition = new Condition();
        condition.match('field', 'text');
        expect(condition.valueOf()).to.be.an('object');
        expect(condition.valueOf()).to.have.property('match');
        expect(condition.valueOf().match).to.have.property('field');
        expect(condition.valueOf().match.field).to.have.property('query', 'text');
    });
    it('匹配多字段测试', function() {
        let condition = new Condition();
        condition.match(['field1', 'field2'], 'text');
        expect(condition.valueOf()).to.be.an('object');
        expect(condition.valueOf()).to.have.property('multi_match');
        expect(condition.valueOf().multi_match).to.have.property('query', 'text');
        expect(condition.valueOf().multi_match).to.have.property('fields');
        expect(condition.valueOf().multi_match.fields).to.have.lengthOf(2);
    });
    it('特殊参数设置', function() {
        let condition = new Condition();
        condition.match(['field1', 'field2'], 'text', {
            'type': 'type'
        });
        expect(condition.valueOf()).to.be.an('object');
        expect(condition.valueOf()).to.have.property('multi_match');
        expect(condition.valueOf().multi_match).to.have.property('type');
    });
});