let orm = require('../es.js');
const expect = require('chai').expect;
describe('连接相关测试', function() {
    it('创建连接测试', function(done) {
        let instance = orm({
            'domain': 'zhaoxuebin.bytedance.com',
            'port': 9200
        });
        instance.on('connected', () => {
            done();
        });
        instance.on('error', (e) => {
            done(e);
        });
    });
    it('创建错误的连接', function(done) {
        let instance = orm({
            'domain': 'not.exists.com',
            'port': 9200
        });
        instance.on('connected', () => {
            done(new Error('???'));
        });
        instance.on('error', (e) => {
            expect(e).to.be.an.instanceof(Error);
            done();
        });
    });
    it('创建Index 和 Type', function(done) {
        let instance = orm({
            'domain': 'zhaoxuebin.bytedance.com',
            'port': 9200
        });
        instance.on('connected', () => {
            let testType = instance.register('testType', {
                'index': 'mocha_test',
                'type': 'mocha_test'
            }, {
                'age': {
                    'type': 'integer'
                },
                'name': {
                    'type': 'keyword'
                },
                'description': {
                    'type': 'text'
                },
                'birthday': {
                    'type': 'date'
                }
            });
            (async() => {
                await testType.sync();
            })().then(() => {
                done();
            }).catch((e) => {
                done(e);
            });
        });
    });

    it('为 Index 和 Type 增加 mapping', function(done) {
        let instance = orm({
            'domain': 'zhaoxuebin.bytedance.com',
            'port': 9200
        });
        let testType = instance.register('testType', {
            'index': 'mocha_test',
            'type': 'mocha_test'
        }, {
            'home': {
                'type': "geo_point"
            }
        });
        (async() => {
            await testType.sync();
        })().then(() => {
            done();
        }).catch((e) => {
            done(e);
        });
    });

});