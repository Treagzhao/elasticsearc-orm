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

    it('geoPolygon 的参数测试', function() {
        let condition = new Condition();
        condition.geoPolygon('location', [
            [],
            [],
            []
        ]);
        expect(condition.valueOf()).to.have.property('geo_polygon');
        expect(condition.valueOf().geo_polygon).to.have.property('location');
        expect(condition.valueOf().geo_polygon.location).to.have.property('points');
        expect(condition.valueOf().geo_polygon.location.points).to.have.lengthOf(3);
    });
});