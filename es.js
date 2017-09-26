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


    this.between = (from, to) => {
        return new QueryType.Between(from, to);
    };

    this.or = (value) => {
        return new QueryType.Or(value);
    };

    // this.distinctType = (key, type, cbk) => {
    //     let path = entities[key];
    //     new ESQuery(opts, path, {}).column(type).run().then((value) => {
    //         cbk && cbk(null, value);
    //     }, (e) => {
    //         cbk && cbk(e);
    //     });
    // };

    this.entities = entities;
};


module.exports = ElasticSearch;