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
});