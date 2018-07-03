let ESQuery = require("./esQuery.js");
let request = require("request");
let co = require("co");
let thunkify = require("thunkify");
let globalConfig = require("./config.js");
let logger = globalConfig.logger;


function EsEntity(opts, entityName, indexConfig, descriptions) {
    let entityPath = "/" + indexConfig.index + (!!indexConfig.type ? "/" + indexConfig.type : "");
    const BASE_PATH = "http://" + opts.domain + ":" + opts.port;
    let config = {
        'scroll': '1m'
    };
    let readyCallback, readyErrorCallback;

    this.count = (cbk) => {
        new ESQuery(opts, entityPath, {}, descriptions, config).count().then((value) => {
            cbk && cbk(null, value);
        }, (er) => {
            cbk && cbk(er);
        });
    };

    this.mapping = (callback) => {
        let url = BASE_PATH + "/" + indexConfig.index + "/" + indexConfig.type + "/_mapping";
        request({
            'uri': url,
            'method': 'GET'
        }, (err, resposne, body) => {
            if (err) {
                callback(err);
                return;
            }
            let result = JSON.parse(body);
            callback(null, result);
        });
    };

    this.find = (params) => {
        return new ESQuery(opts, entityPath, params, descriptions, config);
    };


    // this.filter = () => {
    //     return new ESQuery(opts, entityPath, params, descriptions, config);
    // };
    this.get = (id, callback) => {
        if (globalConfig.debug) {
            logger("GET:" + BASE_PATH + '/' + indexConfig.index + "/" + indexConfig.type + "/" + id);
        }
        request({
            'uri': BASE_PATH + '/' + indexConfig.index + "/" + indexConfig.type + "/" + id,
            'method': 'get'
        }, (err, response, body) => {
            if (err) {
                callback(err);
                return;
            }
            let result = JSON.parse(body);
            if (result.error) {
                callback(null, result, result);
            } else {
                result._source.id = result._id;
                callback(null, result._source, result);
            }
        });
    };

    this.create = (data, callback) => {
        if (globalConfig.debug) {
            logger("CREATE:" +
                JSON.stringify(data));
        }
        request({
            'uri': BASE_PATH + "/" + indexConfig.index + "/" + indexConfig.type,
            'headers': {
                'Content-Type': 'application/json'
            },
            'method': 'POST',
            'body': JSON.stringify(data)
        }, (err, response, body) => {
            if (err) {
                callback(err);
                return;
            }
            let result = JSON.parse(body);
            callback(null, result, result);
        });
    };


    this.update = (id, model, callback) => {
        delete model[globalConfig.primaryKey];
        if (globalConfig.debug) {
            logger("UPDATE:" + JSON.stringify(model));
        }
        request({
            'uri': BASE_PATH + "/" + indexConfig.index + "/" + indexConfig.type + "/" + id,
            'method': 'POST',
            'body': JSON.stringify(model)
        }, (err, response, body) => {
            if (err) {
                callback(err);
                return;
            }
            let result = JSON.parse(body);
            callback(null, result, result);
        });
    };

    this.ready = (callback, error) => {
        readyCallback = callback;
        readyErrorCallback = error;
        return this;
    };


    this.delete = (id, callback) => {
        if (globalConfig.debug) {
            logger("DELETE:" + BASE_PATH + "/" + indexConfig.index + "/" + indexConfig.type + "/" + id)
        }
        request({
            'uri': BASE_PATH + "/" + indexConfig.index + "/" + indexConfig.type + "/" + id,
            'method': 'DELETE'

        }, (err, response, body) => {
            if (err) {
                callback(err);
                return;
            }
            let result = JSON.parse(body);
            callback(null, result);
        });
    };

    let init = () => {
        if (!descriptions) {

            return;
        }
        let indexExists = thunkify((callback) => {
            request({
                'uri': 'http://' + opts.domain + ":" + opts.port + "/" + indexConfig.index,
                'method': 'GET'
            }, (err, response, body) => {
                if (err) {
                    callback(err);
                    return;
                }
                let result = JSON.parse(body);
                callback(null, !!result[indexConfig.index]);
            });
        });

        let createIndex = thunkify((callback) => {
            request({
                'uri': 'http://' + opts.domain + ":" + opts.port + "/" + indexConfig.index,
                'body': "{}",
                'method': 'PUT'
            }, (err, response, body) => {
                if (err) {
                    callback(err);
                    return;
                }
                callback(null, JSON.parse(body));
            });
        });


        let createMapping = thunkify((callback) => {
            let body = {
                'properties': descriptions
            };
            let url = 'http://' + opts.domain + ":" + opts.port + "/" + indexConfig.index + "/_mapping/" + indexConfig.type;
            request({
                'uri': url,
                'method': 'PUT',
                'body': JSON.stringify(body)
            }, (err, response, body) => {
                if (err) {
                    callback(err);
                    return;
                }
                callback(null, JSON.parse(body));
            });
        });


        co(function*() {
            let exists = yield indexExists();
            if (!exists) {
                yield createIndex();
            }
            yield createMapping();
        }).then((value) => {
            readyCallback && readyCallback();
        }).catch((e) => {
            readyErrorCallback && readyErrorCallback(e);
        });;
    };

    init();
}


module.exports = EsEntity;