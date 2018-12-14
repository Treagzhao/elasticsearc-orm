let orm = require('../es.js');
const expect = require('chai').expect;
const config = require('./config.json');
describe('连接相关测试', function() {
    it('创建连接测试', function(done) {
        let instance = orm({
            'domain': config.host,
            'port': config.port
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
            'port': config.port
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
            'domain': config.host,
            'port': config.port
        });
        instance.on('connected', () => {
            let testType = instance.register('testType', {
                'index': 'test',
                'type': 'test_type2'
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
            (async () => {
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
            'domain': config.host,
            'port': config.port
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
            (async () => {
                await testType.sync();
            })().then(() => {
                done();
            }).catch((e) => {
                done(e);
            });
        });
    });
});