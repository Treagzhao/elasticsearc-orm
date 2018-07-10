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
    });
});