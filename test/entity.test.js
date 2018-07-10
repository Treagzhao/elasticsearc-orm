const orm = require('../es.js');
const expect = require('chai').expect;
const testId = 'test_id' + Math.random().toString(32).substr(2);

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

describe('文档相关功能测试', function() {

    it('创建一个文档——不指定 ID', function(done) {
        (async() => {
            let testType = await getEntity();
            let id = await testType.create({
                'age': 10,
                'name': "Treagzhao",
                'description': "The most handsome guy in the world",
                'birthday': +new Date(),
                'home': {
                    'lon': 166.12123,
                    'lat': 43.234
                }
            });
            await testType.get(id);
        })().then(() => {
            done();
        }).catch((e) => {
            done(e);
        });
    });

    it('创建一个文档——指定 ID', function(done) {
        (async() => {
            let testType = await getEntity();
            let id = await testType.create({
                'age': 10,
                'name': "Treagzhao",
                'description': "The most handsome guy in the world",
                'birthday': +new Date(),
                'home': {
                    'lon': 166.12123,
                    'lat': 43.234
                }
            }, testId);
            await testType.get(id);
            return id === testId;
        })().then((flag) => {
            expect(flag).to.be.true;
            done();
        }).catch((e) => {
            done(e);
        });
    });

    it('创建一个文档——创建重复 Id', function(done) {
        (async() => {
            let testType = await getEntity();
            let id = await testType.create({
                'age': 10,
                'name': "Treagzhao",
                'description': "The most handsome guy in the world",
                'birthday': +new Date(),
                'home': {
                    'lon': 166.12123,
                    'lat': 43.234
                }
            }, testId);
        })().then(() => {
            done(new Error('???'));
        }).catch((e) => {
            expect(e).to.be.an.instanceof(Error);
            done();
        });
    });

    it('创建一个文档——指定routing', function(done) {
        (async() => {
            let testType = await getEntity();
            let id = await testType.create({
                'age': 10,
                'name': "Treagzhao",
                'description': "The most handsome guy in the world",
                'birthday': +new Date(),
                'home': {
                    'lon': 166.12123,
                    'lat': 43.234
                }
            }, testId + Math.random().toString(32).substr(2), 'sdfsdf');
        })().then(() => {
            done();
        }).catch((e) => {
            done(e);
        });
    });
});