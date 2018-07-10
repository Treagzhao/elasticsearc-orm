const Condition = require('../../../src/esCondition.js');
const expect = require('chai').expect;

describe('地理类型的 geoShape 方法', function() {
    it('geoShape 的 边界测试', function() {
        let condition = new Condition();
        expect(function() {
            condition.geoShape();
        }).to.throw(Error);
        condition = new Condition();
        expect(function() {
            condition.geoShape('field');
        }).to.throw(Error);
        condition = new Condition();
        expect(function() {
            condition.geoShape('field', 'type')
        }).to.throw(Error);
        condition = new Condition();
        expect(function() {
            condition.geoShape('field', 'type', 'test')
        }).to.throw(Error);
        condition = new Condition();
        expect(function() {
            condition.geoShape('field', 'type', [])
        }).to.not.throw(Error);
        condition = new Condition();
        expect(condition.geoShape('field', 'type', [])).to.equal(condition);
    });


    it("geoShape 的参数测试", function() {
        let condition = new Condition();
        expect(function() {
            condition.geoShape('field', 'circle', []);
        }).to.throw(Error);
        condition = new Condition();
        condition.geoShape('field', 'polygon', []);
        expect(condition.valueOf()).to.have.property('geo_shape');
        expect(condition.valueOf().geo_shape).to.have.property('field');
        expect(condition.valueOf().geo_shape.field).to.have.property('shape');
        expect(condition.valueOf().geo_shape.field.shape).to.have.property('type', 'polygon');
        expect(condition.valueOf().geo_shape.field.shape).to.have.property('coordinates');
        expect(condition.valueOf().geo_shape.field.shape.coordinates).to.have.lengthOf(0);
        condition = new Condition();
        condition.geoShape('field', 'circle', [], {
            'radius': 10
        });
        expect(condition.valueOf().geo_shape.field.shape.radius).to.be.equal(10);
    });
});