let Condition = require('../src/esCondition.js');
let expect = require("chai").expect;

describe('条件相关测试', function() {
    it('新建一个条件', function() {
        let condition = new Condition();
        expect(condition).to.be.an.instanceof(Condition);
    });
    it('获取一个空条件的值', function() {
        let condition = new Condition();
        expect(condition.valueOf()).to.have.property('match_all');
    });
    it('获取一个唯一条件的值', function() {
        let condition = new Condition();
        condition.term('field', 'text');
        expect(condition.valueOf()).to.be.a('object');
        expect(condition.valueOf()).to.not.have.property('bool');
        condition = new Condition();
        condition.must(new Condition());
        expect(condition.valueOf()).to.be.a('object');
        expect(condition.valueOf()).to.not.have.property('bool');
    });
    it('获取多个 must 数组的值', function() {
        let condition = new Condition();
        condition.term('field', 'text').range('age', 1, 10).exists('location');
        expect(condition.valueOf()).to.have.property('bool');
        expect(condition.valueOf().bool).to.have.property('must');
        expect(condition.valueOf().bool.must).to.have.lengthOf(3);
        condition = new Condition();
        condition.must(new Condition().term('field', 'text'));
        condition.must(new Condition().range('field', 'text'));
        condition.must(new Condition().exists('field'));
        expect(condition.valueOf()).to.have.property('bool');
        expect(condition.valueOf().bool).to.have.property('must');
        expect(condition.valueOf().bool.must).to.have.lengthOf(3);
    });

    it('获取多个 should 数组的值', function() {
        let condition = new Condition();
        condition
            .should(new Condition().term('title', 'text'))
            .should(new Condition().range('age', 1, 10))
            .should(new Condition().exists('location'));
        expect(condition.valueOf()).to.have.property('bool');
        expect(condition.valueOf().bool).to.have.property('should');
        expect(condition.valueOf().bool.should).to.have.lengthOf(3);
    });

    it('获取多个 not 数组的值', function() {
        let condition = new Condition();
        condition
            .not(new Condition().term('title', 'text'))
            .not(new Condition().range('age', 1, 10))
            .not(new Condition().exists('location'));
        expect(condition.valueOf()).to.have.property('bool');
        expect(condition.valueOf().bool).to.have.property('must_not');
        expect(condition.valueOf().bool.must_not).to.have.lengthOf(3);
    });
    it('测试单个 filter 的值', function() {
        let condition = new Condition();
        condition
            .filter(new Condition().match("title", 'text'));
        expect(condition.valueOf()).to.have.property('bool');
        expect(condition.valueOf().bool).to.have.property('filter');
        expect(condition.valueOf().bool.filter).to.have.property('match');
    });
    it('测试多个 filter 的值', function() {
        let condition = new Condition();
        condition
            .filter(new Condition().match("title", 'text'))
            .filter(new Condition().term('test', 'test'));
        expect(condition.valueOf()).to.have.property('bool');
        expect(condition.valueOf().bool).to.have.property('filter');
        expect(condition.valueOf().bool.filter).to.have.property('bool');
        expect(condition.valueOf().bool.filter.bool).to.have.property('must');
        expect(condition.valueOf().bool.filter.bool.must).to.have.lengthOf(2);
    });
});