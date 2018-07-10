const Aggs = require('../../src/esAggs.js');
const expect = require('chai').expect;
const Range = require('../../src/esRange.js');
const Condition = require('../../src/esCondition.js');

describe('地理相关聚合测试', function() {
    it('geoBound 的边界测试', function() {
        let aggs = new Aggs('name');
        expect(function() {
            aggs.geoBounds();
        }).to.throw(Error);
        aggs = new Aggs('name');
        expect(function() {
            aggs.geoBounds('age');
        }).to.not.throw(Error);
    });

    it('geoBounds的参数测试', function() {
        let aggs = new Aggs('name');
        aggs.geoBounds('age');
        expect(aggs.aggValueOf()).to.have.property('geo_bounds');
        expect(aggs.aggValueOf().geo_bounds).to.have.property('field', 'age')
    });

    it('geoDistance 的边界测试', function() {
        let aggs = new Aggs('name');
        expect(function() {
            aggs.geoDistance();
        }).to.throw(Error);
        aggs = new Aggs('name');
        expect(function() {
            aggs.geoDistance('location');
        }).to.throw(Error);
        aggs = new Aggs('name');
        expect(function() {
            aggs.geoDistance('location', {});
        }).to.throw(Error);
        aggs = new Aggs('name');
        expect(function() {
            aggs.geoDistance('location', {}, []);
        }).to.throw(Error);
        aggs = new Aggs('name');
        expect(function() {
            aggs.geoDistance('location', {
                'lon': 1,
                'lat': 2
            }, [1]);
        }).to.throw(Error);
        aggs = new Aggs('name');
        expect(function() {
            aggs.geoDistance('location', {
                'lon': 1,
                'lat': 2
            }, []);
        }).to.not.throw(Error);
        aggs = new Aggs('name');
        expect(function() {
            aggs.geoDistance('location', {
                'lon': 1,
                'lat': 2
            }, [new Range(10, 11)]);
        }).to.not.throw(Error);
    });

    it('geoDistance 的参数设置', function() {
        let aggs = new Aggs('name');
        aggs.geoDistance('location', {
            'lon': 1,
            'lat': 2
        }, [new Range(10, 11)]);
        expect(aggs.aggValueOf()).to.have.property('geo_distance');
        expect(aggs.aggValueOf().geo_distance).to.have.property('field', 'location');
        expect(aggs.aggValueOf().geo_distance).to.have.property('origin');
        expect(aggs.aggValueOf().geo_distance).to.have.property('ranges');
        expect(aggs.aggValueOf().geo_distance.origin).to.have.property('lon', 1);
        expect(aggs.aggValueOf().geo_distance.ranges).to.have.lengthOf(1);
    });
});