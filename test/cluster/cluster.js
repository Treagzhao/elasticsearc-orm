const orm = require('../../es.js');
const expect = require('chai').expect;
const config = require('../config.json');
let instance;
const getInstance = () => {
    return new Promise((resolve, reject) => {
        if (!instance) {
            instance = orm({
                'domain': config.host,
                'port': config.port
            });
            instance.on("connected", () => {
                resolve(instance);
            });
            instance.on('error', (e) => {
                reject(e);
            });
        } else {
            resolve(instance);
        }
    });
}


describe('集群相关信息的测试脚本', function() {
    it('集群健康信息', function(done) {
        (async () => {
            const instance = await getInstance();
            const health = await instance.health();
            return health;
        })().then((ret) => {
            ["cluster_name", "status", "timed_out", "number_of_nodes", "number_of_data_nodes", "active_primary_shards", "active_shards", "relocating_shards", "initializing_shards", "unassigned_shards", "delayed_unassigned_shards", "number_of_pending_tasks", "number_of_in_flight_fetch", "task_max_waiting_in_queue_millis", "active_shards_percent_as_number"].forEach((key) => {
                expect(ret).to.have.property(key);
            })
            done();
        }).catch((e) => {
            done(e);
        })
    });
    it('集群的统计状态', function(done) {
        (async () => {
            const instance = await getInstance();
            const stats = await instance.stats();
            return stats;
        })().then((ret) => {
            ['nodes', '_nodes', 'status', 'indices'].forEach((key) => {
                expect(ret).to.have.property(key);
            });
            done();
        }).catch((e) => {
            done(e);
        })
    });
    it('集群的状态', function(done) {
        (async () => {
            const instance = await getInstance();
            const state = await instance.state();
            return state;
        })().then((ret) => {
            ['nodes', 'metadata', 'master_node', 'routing_table'].forEach((key) => {
                expect(ret).to.have.property(key);
            });
            done();
        }).catch((e) => {
            done(e);
        })
    });
    it('集群的索引列表', function(done) {
        (async () => {
            const instance = await getInstance();
            const indices = await instance.indices();
            return indices;
        })().then((ret) => {
            for (let i = 0; i < ret.length; i++) {
                expect(ret[i]).to.have.property('status');
                expect(ret[i]).to.have.property('health');
            }
            done();
        }).catch((e) => {
            done(e);
        })
    });
});