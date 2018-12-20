const orm = require('../../es.js');
const expect = require('chai').expect;
const Condition = orm.Condition;
const config = require('../config.json');
const getEntity = () => {
    return new Promise(function(resolve, reject) {
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
            resolve(testType);
        });
        instance.on('error', function(e) {
            reject(e);
        });
    });
};

describe('索引相关功能测试', function() {
    it('索引健康状态', function(done) {
        (async () => {
            const entity = await getEntity();
            const health = await entity.health();
            return health;
        })().then((ret) => {
            expect(ret).to.have.property('cluster_name')
            expect(ret).to.have.property('status');
            done();
        }).catch((e) => {
            done(e);
        })
    });

    it('索引状态信息', function(done) {
        (async () => {
            const entity = await getEntity();
            const state = await entity.state();
            return state;
        })().then((ret) => {
            expect(ret).to.have.property('state');
            expect(ret).to.have.property('settings');
            done();
        }).catch((e) => {
            done(e);
        })
    });

    it('索引统计信息', function(done) {
        (async () => {
            const entity = await getEntity();
            const stat = await entity.stat();
            return stat;
        })().then((ret) => {
            done();
        }).catch((e) => {
            done(e);
        })
    });
    it('新建别名', function(done) {
        (async () => {
            const entity = await getEntity();
            const ret = await entity.alias(['test_Test1']);
            return ret;
        })().then((ret) => {
            expect(ret).to.have.property('acknowledged', true);
            done();
        }).catch((e) => {
            done(e);
        });
    });
    it('删除别名', function(done) {
        (async () => {
            const entity = await getEntity();
            const ret = await entity.removeAlias(['test_Test1']);
            return ret;
        })().then((ret) => {
            expect(ret).to.have.property('acknowledged', true);
            done();
        }).catch((e) => {
            done(e);
        });
    });

    it('刷新', function(done) {
        (async () => {
            const entity = await getEntity();
            const ret = await entity.refresh();
            return ret;
        })().then((ret) => {
            expect(ret).to.have.property('_shards');
            done();
        }).catch((e) => {
            done(e);
        });
    });
    it('冲洗', function(done) {
        (async () => {
            const entity = await getEntity();
            const ret = await entity.flush();
            return ret;
        })().then((ret) => {
            expect(ret).to.have.property('_shards');
            done();
        }).catch((e) => {
            done(e);
        });
    });

    it('合并索引', function(done) {
        (async () => {
            const entity = await getEntity();
            const ret = await entity.forceMerge();
            return ret;
        })().then((ret) => {
            expect(ret).to.have.property('_shards');
            done();
        }).catch((e) => {
            done(e);
        });
    });
    it('测试分词器', function(done) {
        (async () => {
            const entity = await getEntity();
            const ret = await entity.analyze('测试中文', 'ik_max_word');
            return ret;
        })().then((ret) => {
            expect(ret).to.have.property('tokens');
            done();
        }).catch((e) => {
            done(e);
        });
    });

    // it('关闭索引', function(done) {
    //     (async () => {
    //         const entity = await getEntity();
    //         const ret = await entity.close();
    //         return ret;
    //     })().then((ret) => {
    //         expect(ret).to.have.property('acknowledged', true);
    //         done();
    //     }).catch((e) => {
    //         done(e);
    //     });
    // });

    it('开启索引', function(done) {
        (async () => {
            const entity = await getEntity();
            const ret = await entity.open();
            return ret;
        })().then((ret) => {
            expect(ret).to.have.property('acknowledged', true);
            done();
        }).catch((e) => {
            done(e);
        })
    });

    it('获取索引 mappings', function(done) {
        (async () => {
            const entity = await getEntity();
            const ret = await entity.mappings();
            return ret;
        })().then((ret) => {
            expect(ret).to.have.property('mocha_test');
            done();
        }).catch((e) => {
            done(e);
        })
    });


    // it('删除索引', function(done) {
    //     (async () => {
    //         const entity = await getEntity();
    //         const ret = await entity.deleteIndex();
    //         return ret;
    //     })().then((ret) => {
    //         expect(ret).to.have.property('acknowledged');
    //         done();
    //     }).catch((e) => {
    //         done(e);
    //     })
    // });


    it('索引的分片信息', function(done) {
        (async () => {
            const entity = await getEntity();
            const ret = await entity.shards();
            return ret;
        })().then((ret) => {
            expect(ret).to.have.property('shards');
            done();
        }).catch((e) => {
            done(e);
        })
    });
});