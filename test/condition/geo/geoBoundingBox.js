const Condition = require('../../../src/esCondition.js');
const expect = require('chai').expect;

describe('测试地理位置的 geoBoundingBox 方法', function() {
    it('geoBoundingBox 方法的边界测试', function() {
        let condition = new Condition();
        expect(function() {
            condition.geoBoundingBox();
        }).to.throw(Error);
        condition = new Condition();
        expect(function() {
            condition.geoBoundingBox('location');
        }).to.throw(Error);
        condition = new Condition();
        expect(function() {
            condition.geoBoundingBox('location', []);
        }).to.throw(Error);
        condition = new Condition();
        expect(function() {
            condition.geoBoundingBox('location', [
                []
            ]);
        }).to.throw(Error);
        condition = new Condition();
        expect(function() {
            condition.geoBoundingBox('location', {
                'top_left': [],
                'bottom_right': []
            });
        }).to.not.throw(Error);
        condition = new Condition();
        expect(condition.geoBoundingBox('location', {
            'top_left': [],
            'bottom_right': []
        })).to.equal(condition);
    });

    it('geoBoundingBox 的参数测试', function() {
        let condition = new Condition();
        condition.geoBoundingBox('location', {
            'top_left': [],
            'bottom_right': []
        });
        expect(condition.valueOf()).to.have.property('geo_bounding_box');
        expect(condition.valueOf().geo_bounding_box).to.have.property('location');
        expect(condition.valueOf().geo_bounding_box.location).to.have.property('top_left');
        expect(condition.valueOf().geo_bounding_box.location).to.have.property('bottom_right');
    });
});