const Condition = require('../../../src/esCondition.js');
const expect = require('chai').expect;

describe('测试地理位置的 geoPolygon 方法', function() {
    it('geoPolygon 方法的边界测试', function() {
        let condition = new Condition();
        expect(function() {
            condition.geoPolygon();
        }).to.throw(Error);
        condition = new Condition();
        expect(function() {
            condition.geoPolygon('location');
        }).to.throw(Error);
        condition = new Condition();
        expect(function() {
            condition.geoPolygon('location', []);
        }).to.throw(Error);
        condition = new Condition();
        expect(function() {
            condition.geoPolygon('location', [
                []
            ]);
        }).to.throw(Error);
        condition = new Condition();
        expect(function() {
            condition.geoPolygon('location', [
                [],
                [],
                []
            ]);
        }).to.not.throw(Error);
        condition = new Condition();
        expect(condition.geoPolygon('location', [
            [],
            [],
            []
        ])).to.equal(condition);
    });
});