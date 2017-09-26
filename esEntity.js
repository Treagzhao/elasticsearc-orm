let ESQuery = require("./esQuery.js");
let request = require("request");
let co = require("co");
let thunkify = require("thunkify");

function EsEntity(opts, entityName, indexConfig, descriptions) {
    let entityPath = "/" + indexConfig.index + (!!indexConfig.type ? "/" + indexConfig.type : "");
    const BASE_PATH = "http://" + opts.domain + ":" + opts.port;
    let config = {
        'scroll': '1m'
    };
    let readyCallback, readyErrorCallback;


    this.set = (key, value) => {
        config[key] = value;
    };

    this.count = (cbk) => {
        new ESQuery(opts, entityPath, {}, descriptions, config).count().then((value) => {
            cbk && cbk(null, value);
        }, (er) => {
            cbk && cbk(er);
        });
    };

    this.find = (params) => {
        return new ESQuery(opts, entityPath, params, descriptions, config);
    };


    this.get = (id, callback) => {
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
        request({
            'uri': BASE_PATH + "/" + indexConfig.index + "/" + indexConfig.type,
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
        delete model['id'];
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
                    next(err);
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