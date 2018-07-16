const orm = require('../es.js');
const expect = require('chai').expect;
const testId = 'test_id' + Math.random().toString(32).substr(2);
const testConfig = require('./config.json');
const getEntity = () => {
    return new Promise(function(resolve, reject) {
        let instance = orm({
            'domain': testConfig.host,
            'port': testConfig.port
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

describe('Index 与 Type 相关功能', function() {
    it('获取一个 index 的 mappings', function(done) {
        (async() => {
            let testType = await getEntity();
            let mappings = await testType.getMappings();
            return mappings;
        })().then((mappings) => {
            expect(mappings).to.be.an('object');
            done();
        }).catch((e) => {
            done(e);
        });
    });
});

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


    it('更新一个文档', function(done) {
        (async() => {
            let testType = await getEntity();
            let random = Math.floor(Math.random() * 50);
            await testType.update('testId', {
                'age': random,
                'name': "Treagzhao",
                'description': "The most handsome guy in the world",
                'birthday': +new Date(),
                'home': {
                    'lon': 166.12123,
                    'lat': 43.234
                }
            });
            let info = await testType.get('testId');
            return info.data.age === random;
        })().then((flag) => {
            expect(flag).to.be.true;
            done();
        }).catch((e) => {
            done(e);
        });
    });

    it('删除一个文档', function(done) {
        (async() => {
            let testType = await getEntity();
            let id = await testType.create({
                'age': 34,
                'name': "Treagzhao",
                'description': "The most handsome guy in the world",
                'birthday': +new Date(),
                'home': {
                    'lon': 166.12123,
                    'lat': 43.234
                }
            });
            let existsFlag, deletedFlag;
            try {
                await testType.get(id);
                existsFlag = true;
            } catch (e) {
                existsFlag = false;
            }
            await testType.delete(id);
            try {
                await testType.get(id);
                deletedFlag = true;
            } catch (e) {
                deletedFlag = false;
            }
            return existsFlag && !deletedFlag;
        })().then((flag) => {
            expect(flag).to.be.true;
            done();
        }).catch((e) => {
            done(e);
        });
    });

    it('获取一个不存在的文档', function(done) {
        (async() => {
            let testType = await getEntity();
            let info = await testType.get('notexists');
        })().then((e) => {
            done(new Error("get info fail"));
        }).catch((e) => {
            done();
        });
    });
    it('获取一个存在的文档', function(done) {
        (async() => {
            let testType = await getEntity();
            let info = await testType.get('testId');
        })().then((e) => {
            done();
        }).catch((e) => {
            done(e);
        });
    });
});