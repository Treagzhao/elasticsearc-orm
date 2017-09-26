var request = require("request");
let QueryType = require("./queryType.js");

function Query(opt, path, params, descriptions = {}, config) {
    let domain = opt.domain;
    let port = opt.port;
    let from;
    let body = {},
        columnParams = [],
        mustList = [],
        shouldList = [];
    let queryString = "";

    let getColumnType = (column) => {
        if (descriptions[column]) {
            return descriptions[column].type;
        }
        return undefined;
    };


    let getBasicValue = (key, value) => {
        let flag = false;
    };

    let initParams = () => {
        let bodyInfo = {};
        let innerMustList = [],
            innerShouldList = [];
        Object.keys(params).forEach((key, index) => {
            let value = params[key];
            if (!body.query) {
                body.query = {
                    "bool": {}
                };
            }
            // if (value instanceof QueryType.Or) {
            //     if (!body.query, query_string) {
            //         body.query.query_string = {};
            //     }
            //     queryString += value.toString();
            // } else if (index > 0) {
            //     if (!body.query.query_string) {
            //         body.query.query_string = {};
            //     }
            //     queryString += " AND ";
            // }
            if (value instanceof QueryType.Or) {
                innerShouldList.push(value.valueOf(key, descriptions));
            } else if (value instanceof QueryType.Between) {
                let range = {
                    "range": {}
                };
                range.range[key] = value.valueOf();
                innerMustList.push(range);
            } else {
                //精确匹配
                let dataType = getColumnType(key);
                if (dataType) {
                    let term = {};
                    term[key] = value;
                    innerMustList.push({
                        'term': term
                    });
                }
            }
        });
        if (mustList.length > 0 || innerMustList.length > 0) {
            if (!body.query) {
                body.query = {};
            }
            if (!body.query.bool) {
                body.query.bool = {};
            }
            body.query.bool.must = mustList.concat(innerMustList);
        }
        if (shouldList.length > 0 || innerShouldList.length > 0) {
            if (!body.query) {
                body.query = {};
            }
            if (!body.query.bool) {
                body.query.bool = {};
            }
            body.query.bool.should = shouldList.concat(innerShouldList);
        }
        if (typeof from === 'number') {
            body.from = from;
        } else if (typeof from == "string") {
            // body.scroll_id = from;
        }
    }


    this.matchPhrase = (value, column) => {
        let query = {};
        query[column] = value
        mustList.push({
            'match_phrase': query
        });
        return this;
    };

    this.run = (cbk) => {
        initParams();
        let url = "http://" + domain + ":" + port + path + "/_search";
        let chunk = [];
        if (from !== undefined) {
            if (typeof from == 'number') {} else if (typeof from == 'string') {
                url = "http://" + domain + ":" + port + '/_search/scroll?scroll_id=' + from + "&scroll=" + config.scroll;
                body = {};
            }
        }
        request({
            'method': 'POST',
            'uri': url,
            'body': JSON.stringify(body),
            'headers': [{
                'name': 'content-type',
                'value': 'application/x-www-form-urlencoded'
            }]
        }).on("data", (data) => {
            chunk.push(data);
        }).on("end", () => {
            let buffer = Buffer.concat(chunk);
            let result;
            try {
                result = JSON.parse(buffer.toString('utf-8'));
            } catch (e) {
                if (cbk) {
                    cbk(new Error("ES返回接口不是JSON"));
                }
                return;
            }
            let list = [];
            //出错
            if (result.status) {
                cbk(new Error(result.error.type + " Reason:" + result.error.root_cause[0].reason));
                return;
            }
            result.hits.hits.forEach((item) => {
                item._source.id = item._id;
                list.push(item._source);
            });
            if (cbk) {
                cbk(null, list, result);
            }
        }).on("error", (err) => {
            if (cbk) {
                cbk(err);
            }
        });

    };

    this.size = (size) => {
        body.size = size;
        return this;
    };



    this.order = (order) => {
        let orderType = "asc";
        if (/^(\+|\-)/.test(order)) {
            let sort = RegExp.$1;
            if (sort == '-') {
                orderType = 'desc';
            }
        }
        order = order.replace(/^(\+|\-)/, '');
        if (!body.sort) {
            let obj = {};
            obj[order] = orderType;
            body['sort'] = [obj];
        }
        return this;
    };

    this.between = (key, arr) => {
        if (arr.length != 2) {
            throw new Error("between params is invalid")
            return this;
        }
        params[key] = new QueryType.Between(arr[0], arr[1]);
        return this;
    };

    this.offset = (offset) => {
        from = offset;
        return this;
    };


    this.match = (query, column) => {
        if (!body.query) {
            body.query = {
                "bool": {}
            };
        }
        if (typeof column === 'string') {
            let match = {
                "match": {}
            }
            match.match[column] = query;
            mustList.push(match);
        } else if (Object.prototype.toString.call(column).indexOf("Array") >= 0) {
            let columns = column;
            let match = {
                "multi_match": {}

            }
            match.multi_match.query = query;
            match.multi_match.fields = columns;
            mustList.push(match);
        }
        return this;
    };

    this.count = (cbk) => {
        initParams();
        let url = "http://" + domain + ":" + port + path + "/_search";
        let chunk = [];
        var promise = new Promise();
        body.size = 0;
        request({
            'method': 'POST',
            'uri': url,
            'body': JSON.stringify(body),
            'headers': [{
                'name': 'content-type',
                'value': 'application/x-www-form-urlencoded'
            }]
        }).on("data", (data) => {
            chunk.push(data);
        }).on("end", () => {
            let buffer = Buffer.concat(chunk);
            let result;
            try {
                result = JSON.parse(buffer.toString('utf-8'));
            } catch (e) {
                if (cbk) {
                    cbk(new Error("ES返回接口不是JSON"));
                } else {
                    promise.reject(new Error("ES返回接口不是JSON"));
                }
                return;
            }
            if (cbk) {
                cbk(null, +result.hits.total);
            } else {
                promise.resolve(+result.hits.total);
            }
        }).on("error", (err) => {
            if (cbk) {
                cbk(err);
            } else {
                promise.reject(err);
            }
        });
        return promise;
    };



};


module.exports = Query;