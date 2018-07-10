const Aggs = require('../../src/esAggs.js');
const expect = require('chai').expect;

describe('分组聚合的相关测试', function() {
    it('terms 的边界测试', function() {
        let aggs = new Aggs('name');
        expect(function() {
            aggs.terms();
        }).to.throw(Error);
        aggs = new Aggs('name');
        expect(function() {
            aggs.terms('age');
        }).to.not.throw(Error);
        aggs = new Aggs('name');
        expect(function() {
            aggs.terms('age', {
                'order': 'test'
            });
        }).to.throw(Error);
        aggs = new Aggs('name');
        expect(function() {
            aggs.terms('age', {
                'order': {
                    'field': 'location',
                    'type': "test"
                }
            });
        }).to.throw(Error);

        aggs = new Aggs('name');
        expect(function() {
            aggs.terms('age', {
                'order': {
                    'field': 'location',
                    'type': "desc"
                }
            });
        }).to.not.throw(Error);
        aggs = new Aggs('name');
        expect(aggs.terms('name')).to.equal(aggs);
    });

    it('terms 的参数测试', function() {
        let aggs = new Aggs('name');
        aggs.terms('age', {
            'order': {
                'field': 'location',
                'type': "desc"
            },
            'size': 5
        });
        expect(aggs.aggValueOf()).to.have.property('terms');
        expect(aggs.aggValueOf().terms).to.have.property('field', 'age');
        expect(aggs.aggValueOf().terms).to.have.property('order');
        expect(aggs.aggValueOf().terms.order).to.have.property('location', 'desc');
        expect(aggs.aggValueOf().terms).to.have.property('size', 5);
    });

    it('histogram 的边界测试', function() {
        let aggs = new Aggs('name');
        expect(function() {
            aggs.histogram();
        }).to.throw(Error);
        aggs = new Aggs('name');
        expect(function() {
            aggs.histogram('location');
        }).to.throw(Error);
        aggs = new Aggs('name');
        expect(function() {
            aggs.histogram('location', 0);
        }).to.throw(Error);
        aggs = new Aggs('name');
        expect(function() {
            aggs.histogram('location', 5);
        }).to.not.throw(Error);
        aggs = new Aggs('name');
        expect(aggs.histogram('location', 4)).to.equal(aggs);
    });

    it('histogram的参数测试', function() {
        let aggs = new Aggs('name');
        aggs.histogram('location', 5);
        expect(aggs.aggValueOf()).to.have.property('histogram');
        expect(aggs.aggValueOf().histogram).to.have.property('field', 'location');
        expect(aggs.aggValueOf().histogram).to.have.property('interval', 5);
    });

    it('dateHistogram 的边界测试', function() {
        let aggs = new Aggs('name');
        expect(function() {
            aggs.dateHistogram();
        }).to.throw(Error);
        aggs = new Aggs('name');
        expect(function() {
            aggs.dateHistogram('date');
        }).to.throw(Error);
        aggs = new Aggs('name');
        expect(function() {
            aggs.dateHistogram('date', 5);
        }).to.throw(Error);
        aggs = new Aggs('name');
        expect(function() {
            aggs.dateHistogram('date', 'month');
        }).to.not.throw(Error);
        aggs = new Aggs('name');
        expect(aggs.dateHistogram('date', 'month')).to.equal(aggs);
    });

    it('dateHistogram 的参数测试', function() {
        let aggs = new Aggs('name');
        aggs.dateHistogram('date', 'month', {
            'offset': '+1h',
            'format': 'yyyy-MM',
            'time_zone': '-01:00'
        });
        expect(aggs.aggValueOf()).to.have.property('date_histogram');
        expect(aggs.aggValueOf().date_histogram).to.have.property('field', 'date');
        expect(aggs.aggValueOf().date_histogram).to.have.property('interval', 'month');
        expect(aggs.aggValueOf().date_histogram).to.have.property('offset', '+1h');
        expect(aggs.aggValueOf().date_histogram).to.have.property('format', 'yyyy-MM');
        expect(aggs.aggValueOf().date_histogram).to.have.property('time_zone', '-01:00');
    });
});