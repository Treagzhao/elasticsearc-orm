const Aggs = require('../../src/esAggs.js');
const expect = require('chai').expect;
const Range = require('../../src/esRange.js');
const Condition = require('../../src/esCondition.js');
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

    it('dateRange 的边界测试', function() {
        let aggs = new Aggs('name');
        expect(function() {
            aggs.dateRange();
        }).to.throw(Error);
        aggs = new Aggs('name');
        expect(function() {
            aggs.dateRange('date')
        }).to.throw(Error);
        aggs = new Aggs('name');
        expect(function() {
            aggs.dateRange('date', [1])
        }).to.throw(Error);
        aggs = new Aggs('name');
        expect(function() {
            aggs.dateRange('date', [new Range()]);
        }).to.throw(Error);
        aggs = new Aggs('name');
        expect(function() {
            aggs.dateRange('date', [new Range(1, 10)]);
        }).to.not.throw(Error);
        aggs = new Aggs('name');
        expect(aggs.dateRange('date', [new Range(1, 10)])).to.equal(aggs);
    });

    it('dateRange 的参数测试', function() {
        let aggs = new Aggs('name');
        aggs.dateRange('date', [new Range(1, 10)], {
            'format': 'MM-yyyy'
        });
        expect(aggs.aggValueOf()).to.have.property('date_range');
        expect(aggs.aggValueOf().date_range).to.have.property('field', 'date');
        expect(aggs.aggValueOf().date_range).to.have.property('format', 'MM-yyyy');
        expect(aggs.aggValueOf().date_range).to.have.property('ranges');
        expect(aggs.aggValueOf().date_range.ranges).to.have.lengthOf(1);
    });

    it('range 的边界测试', function() {
        let aggs = new Aggs('name');
        expect(function() {
            aggs.range();
        }).to.throw(Error);
        aggs = new Aggs('name');
        expect(function() {
            aggs.range('age');
        }).to.throw(Error);
        aggs = new Aggs('name');
        expect(function() {
            aggs.range('name', [1]);
        }).to.throw(Error);
        aggs = new Aggs('name');
        expect(function() {
            aggs.range('age', [new Range()]);
        }).to.throw(Error);
        aggs = new Aggs('name');
        expect(function() {
            aggs.range('age', [new Range(1, 10)]);
        }).to.not.throw(Error);
        aggs = new Aggs('name');
        expect(aggs.range('age', [new Range(1, 10)])).to.equal(aggs);
    });

    it('range 的参数测试', function() {
        let aggs = new Aggs('name');
        aggs.range('age', [new Range(1, 10)]);
        expect(aggs.aggValueOf()).to.have.property('range');
        expect(aggs.aggValueOf().range).to.have.property('field');
        expect(aggs.aggValueOf().range).to.have.property('ranges');
        expect(aggs.aggValueOf().range.ranges).to.have.lengthOf(1);
    });

    it('filter 的边界测试', function() {
        let aggs = new Aggs('name');
        expect(function() {
            aggs.filter();
        }).to.throw(Error);
        aggs = new Aggs('name');
        expect(function() {
            aggs.filter('age');
        }).to.throw(Error);
        aggs = new Aggs('name');
        expect(function() {
            aggs.filter('age', 1);
        }).to.throw(Error);
        aggs = new Aggs('name');
        expect(function() {
            aggs.filter('age', new Condition());
        }).to.not.throw(Error);
        aggs = new Aggs('name');
        expect(aggs.filter('age', new Condition())).to.equal(aggs);
    });
    it('filter 的参数测试', function() {
        let aggs = new Aggs('name');
        aggs.filter('age', new Condition().exists('age'));
        expect(aggs.aggValueOf()).to.have.property('filter');
        expect(aggs.aggValueOf().filter).to.have.property('exists');
    });

    it('missing 的边界测试', function() {
        let aggs = new Aggs('name');
        expect(function() {
            aggs.missing();
        }).to.throw(Error);
        aggs = new Aggs('name');
        expect(function() {
            aggs.missing('age');
        }).to.not.throw(Error);
    });

    it('missing 的参数测试', function() {
        let aggs = new Aggs('name');
        aggs.missing('age');
        expect(aggs.aggValueOf()).to.have.property('missing');
        expect(aggs.aggValueOf().missing).to.have.property('field', 'age');
    });

    it('sampler 的边界测试', function() {
        let aggs = new Aggs('name');
        expect(function() {
            aggs.sampler();
        }).to.not.throw(Error);
        aggs = new Aggs('name');
        expect(function() {
            aggs.sampler(-1);
        }).to.throw(Error);
    });

    it('sampler 的参数测试', function() {
        let aggs = new Aggs('name');
        aggs.sampler(100, {
            'max_doc_per_value': 10
        });
        expect(aggs.aggValueOf()).to.have.property('sampler');
        expect(aggs.aggValueOf().sampler).to.have.property('shard_size', 100);
        expect(aggs.aggValueOf().sampler).to.have.property('max_doc_per_value', 10);
    });

    it('significantTerms 的边界测试', function() {
        let aggs = new Aggs('name');
        expect(function() {
            aggs.significantTerms();
        }).to.throw(Error);
        aggs = new Aggs('name');
        expect(function() {
            aggs.significantTerms('age')
        }).to.not.throw(Error);
    });

    it('significantTerms 的参数测试', function() {
        let aggs = new Aggs('name');
        aggs.significantTerms('age');
        expect(aggs.aggValueOf()).to.have.property('significant_terms');
        expect(aggs.aggValueOf().significant_terms).to.have.property('field', 'age');
        aggs = new Aggs('name').significantTerms('name', {
            'min_doc_count': 5,
            'shard_size': 10
        });
        expect(aggs.aggValueOf().significant_terms).to.have.property('min_doc_count', 5);
    });
});