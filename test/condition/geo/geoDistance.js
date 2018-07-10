const Condition = require('../../../src/esCondition.js');
const expect = require('chai').expect;

describe('地理位置的geoDistance 的测试', function() {
    it('geoDistance 的边界测试', function() {
        let condition = new Condition();
        expect(function() {
            condition.geoDistance();
        }).to.throw(Error);
        condition = new Condition();
        expect(function() {
            condition.geoDistance('field')
        }).to.throw(Error);
        condition = new Condition();
        expect(function() {
            condition.geoDistance('field', {
                'lon': 1,
                'lat': 2
            })
        }).to.throw(Error);
        condition = new Condition();
        expect(function() {
            condition.geoDistance('field', {}, '10m');
        }).to.throw(Error);
        condition = new Condition();
        expect(function() {
            condition.geoDistance('field', {
                'lon': 1,
                'lat': 2
            }, '100m')
        }).to.not.throw(Error);
        condition = new Condition();
        expect(condition.geoDistance('location', {
            'lon': 100,
            'lat': 10
        }, '100m')).to.equal(condition);
    });
    it('geoDistance 的参数测试', function() {
        let condition = new Condition();
        condition.geoDistance('location', {
            'lon': 100,
            'lat': 45
        }, '100m');
        expect(condition.valueOf()).to.have.property('geo_distance');
        expect(condition.valueOf().geo_distance).to.have.property('location');
        expect(condition.valueOf().geo_distance).to.have.property('distance', '100m');
        expect(condition.valueOf().geo_distance.location).to.have.property('lon', 100);
        expect(condition.valueOf().geo_distance.location).to.have.property('lat', 45);
    });
});