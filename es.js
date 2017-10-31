/**
 **
 */

let intance;
let request = require("request");
let ESQuery = require("./esQuery.js");
let QueryType = require("./queryType.js");
let ESEntity = require("./esEntity.js");
let globalConfig = require("./config.js");
let boolType = require("./boolType.json");

function ElasticSearch(opts, config) {
    let entities = {};
    let domain = opts.domain;
    let port = opts.port;

    this.register = (key, config, descriptions) => {
        /**
         ** 第二个参数可以是字符串也可以是配置项
         */
        if (typeof config === 'string') {
            let list = config.split("/");
            if (list.length <= 0) {
                throw new Error("index could not be empty");
            }
            let obj = {
                'index': list[1],
                'type': !!list[2] ? list[2] : ""
            };
            config = obj
        }
        let entity = new ESEntity(opts, key, config, descriptions);
        entities[key] = entity;
        return entity;
    };

    let init = () => {
        if (config) {
            Object.keys(config).forEach((key) => {
                globalConfig[key] = config[key];
            });
        }
        Object.keys(boolType).forEach((key) => {
            ElasticSearch[key] = boolType[key];
        });
    };


    init();
    this.entities = entities;
};
ElasticSearch.between = (from, to, equalFrom, equalTo) => {
    return new QueryType.Between(from, to, equalFrom, equalTo);
};


ElasticSearch.not = (value) => {
    return new QueryType.Not(value);
};

ElasticSearch.or = (value) => {
    let intance = new QueryType.Or(value);
    return intance;
};
ElasticSearch.gt = (value, equal) => {
    let intance = new QueryType.Gt(value, equal);
    return intance;
};
ElasticSearch.lt = (value, equal) => {
    let intance = new QueryType.Lt(value, equal);
    return intance;
};

ElasticSearch.set = (name, value) => {
    globalConfig[name] = value;
};
module.exports = ElasticSearch;