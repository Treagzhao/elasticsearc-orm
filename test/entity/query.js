const orm = require('../../es.js');
const expect = require('chai').expect;
const Condition = orm.Condition;
const getEntity = () => {
    return new Promise(function(resolve, reject) {
        let instance = orm({
            'domain': 'zhaoxuebin.bytedance.com',
            'port': 9200
        });
        instance.on('connected', () => {
            let testType = instance.register('testType', {
                'index': 'mocha_test',
                'type': 'mocha_test'
            }, {
                'home': {
                    'type': "geo_point"
                }
            });
            resolve(testType);
        });
        instance.on('error', function(e) {
            reject(e);
        });
    });
};

const checkResultOk = function(ret) {
    expect(ret).to.have.property('list');
    expect(ret).to.have.property('orgResult');
};

describe('query 查询相关测试', function() {
    it('基本查询', function(done) {
        (async() => {
            let testType = await getEntity();
            let ret = await testType.query();
            return ret;
        })().then((ret) => {
            checkResultOk(ret);
            done();
        }).catch((e) => {
            done(e);
        });
    });

    it('多个条件查询', function(done) {
        (async() => {
            let testType = await getEntity();
            let ret = await testType
                .match('description', 'world')
                .range('age', 11)
                .query();
            return ret;
        })().then((ret) => {
            checkResultOk(ret);
            done();
        }).catch((e) => {
            done(e);
        })
    });

    it("should 条件查询", function(done) {
        (async() => {
            let testType = await getEntity();
            let ret = await testType
                .should(new Condition().match('name', 'Treagzhao'))
                .should(new Condition().range('age', null, 10))
                .query();
            return ret;
        })().then((ret) => {
            checkResultOk(ret);
            done();
        }).catch((e) => {
            done(e);
        })
    });

    it("not 条件查询", function(done) {
        (async() => {
            let testType = await getEntity();
            let ret = await testType
                .not(new Condition().match('name', 'Treagzhao'))
                .not(new Condition().range('age', null, 10))
                .query();
            return ret;
        })().then((ret) => {
            checkResultOk(ret);
            done();
        }).catch((e) => {
            done(e);
        })
    });

    it("filter 查询", function(done) {
        (async() => {
            let testType = await getEntity();
            let ret = await testType
                .filter(new Condition().match('name', 'Treagzhao'))
                .filter(new Condition().range('age', null, 10))
                .query();
            return ret;
        })().then((ret) => {
            checkResultOk(ret);
            done();
        }).catch((e) => {
            done(e);
        })
    });
    it("多条件查询", function(done) {
        (async() => {
            let testType = await getEntity();
            let ret = await testType
                .filter(new Condition().match('name', 'Treagzhao'))
                .match('title', "Treagzhao")
                .not(new Condition().exists('location'))
                .query();
            return ret;
        })().then((ret) => {
            checkResultOk(ret);
            done();
        }).catch((e) => {
            done(e);
        })
    });
});