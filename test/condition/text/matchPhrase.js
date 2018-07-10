const Condition = require('../../../src/esCondition.js');
const expect = require('chai').expect;

describe('测试 matchPhrase 方法', function() {
    it('测试matchPhrase的边界', function() {
        let condition = new Condition();
        expect(function() {
            condition.matchPhrase(null, null)
        }).to.throw(Error);
        condition = new Condition();
        expect(function() {
            condition.matchPhrase('field');
        }).to.throw(Error);
        condition = new Condition();
        expect(function() {
            condition.matchPhrase(null, 'text');
        }).to.throw(Error);
        condition = new Condition();
        expect(function() {
            condition.matchPhrase('field', 'text');
        }).to.not.throw(Error);
        condition = new Condition();
        expect(condition.matchPhrase('field', 'text')).to.equal(condition);
    });

    it('测试 matchPhrasePrefix 的边界', function() {
        let condition = new Condition();
        expect(function() {
            condition.matchPhrasePrefix(null, null)
        }).to.throw(Error);
        condition = new Condition();
        expect(function() {
            condition.matchPhrasePrefix('field');
        }).to.throw(Error);
        condition = new Condition();
        expect(function() {
            condition.matchPhrasePrefix(null, 'text');
        }).to.throw(Error);
        condition = new Condition();
        expect(function() {
            condition.matchPhrasePrefix('field', 'text');
        }).to.not.throw(Error);
        condition = new Condition();
        expect(condition.matchPhrasePrefix('field', 'text')).to.equal(condition);
    });

    it('测试 matchPhrase 的参数', function() {
        let condition = new Condition();
        condition.matchPhrase('field', 'text text');
        expect(condition.valueOf()).to.have.property('match_phrase');
        expect(condition.valueOf().match_phrase).to.have.property('field', 'text text');
    });

    it('测试 matchPhrasePrefix 的参数', function() {
        let condition = new Condition();
        condition.matchPhrasePrefix('field', 'text text');
        expect(condition.valueOf()).to.have.property('match_phrase_prefix');
        expect(condition.valueOf().match_phrase_prefix).to.have.property('field', 'text text');
    });
});