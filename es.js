const EventEmitter = require('events').EventEmitter;
const request = require('./util/request.js');
const config = require('./util/globalConfig.js');
const Entity = require('./src/entity.js');
const Condition = require('./src/esCondition.js');
const Aggs = require('./src/esAggs.js');
const Range = require('./src/esRange.js');
const buildVersion = (number) => {
    let list = number.split(',').map((item) => {
        return +item;
    });
    return list;
};

function Connection(opts) {
    EventEmitter.call(this);
    const self = this;
    const entities = new Map();
    const BASE_URL = `http://${opts.domain}:${opts.port}/`;

    let testConnection = async () => {
        let body = await request({
            'url': BASE_URL,
            'timeout': 1500
        });
        config.set('version', buildVersion(body.version.number));
    };

    let connect = async () => {
        await testConnection();
    };

    this.register = (name, opts, mappings, settings) => {
        if (!opts.index) {
            throw new Error("index could not be blank");
        }
        if (!opts.type) {
            throw new Error('type could not be blank');
        }
        entities.set(name, new Entity(name, opts, mappings, settings));
        return entities.get(name);
    };

    this.set = (key, value) => {
        config.set(key, value);
    };

    this.get = (key) => {
        return config.get(key);
    };

    connect().then((ret) => {
        config.set('domain', opts.domain);
        config.set('port', opts.port);
        config.set('BASE_URL', BASE_URL);
        self.emit('connected');
    }).catch((e) => {
        self.emit('error', e);
    });
};

Connection.prototype = new EventEmitter();

const ES = (opts) => {
    if (!opts.domain || !opts.port) {
        throw new Error("opts params is invalide");
    }
    let conn = new Connection(opts);
    return conn;
};
ES.Aggs = Aggs;
ES.Range = Range;
ES.Condition = Condition;
module.exports = ES;