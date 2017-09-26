/**
 **
 */

let intance;
let request = require("request");
let ESQuery = require("./esQuery.js");
let QueryType = require("./queryType.js");
let ESEntity = require("./esEntity.js");

function ElasticSearch(opts) {
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




    this.entities = entities;
};
ElasticSearch.between = (from, to) => {
    return new QueryType.Between(from, to);
};

ElasticSearch.or = (value) => {
    let intance = new QueryType.Or(value);
    return intance;
};

module.exports = ElasticSearch;