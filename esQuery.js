var request = require("request");
let QueryType = require("./queryType.js");
let globalConfig = require("./config.js");
let logger = globalConfig.logger;
const BOOL_TYPE = require("./boolType.json");
let QueryAnalyzer = require("./queryTypeParamsAnalysiz.js");
let Promise = require("./promise.js");
let FilterBuilder = require("./builder/filterBuilder.js");

function Query(opt, path, params, descriptions = {}, config) {
    let domain = opt.domain;
    let port = opt.port;
    let from, size;
    let body = {},
        columnParams = [],
        mustList = [],
        shouldList = [],
        notList = [],
        filterList = [],
        aggs = {};
    let queryString = "",
        scrollTag = false;

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
        delete body.size;
        let analyzResult = QueryAnalyzer(params);
        let innerMustList = analyzResult.must,
            innerShouldList = analyzResult.should,
            innerNotList = analyzResult.not;
        Object.keys(params).forEach((key, index) => {
            let value = params[key];
            if (!body.query) {
                body.query = {
                    "bool": {}
                };
            }
            if (!(value instanceof QueryType.BaseType)) {
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
        if (notList.length > 0 || innerNotList.length > 0) {
            if (!body.query) {
                body.query = {};
            }
            if (!body.query.bool) {
                body.query.bool = {};
            }
            body.query.bool.must_not = notList.concat(innerNotList);
        }
        if (typeof from === 'number') {
            body.from = from;
        }
        if (Object.keys(aggs).length > 0) {
            body.aggs = aggs;
        }
        if (filterList.length > 0) {
            if (!body.query) {
                body.query = {};
            }
            if(!body.query.bool){
                body.query.bool = {};
            }
            body.query.bool.filter = FilterBuilder(filterList);
        }
        if (size) {
            body.size = size;
        }
    }

    this.groupBy = (columnName, displayName) => {
        aggs[displayName] = {
            "terms": {
                'field': columnName
            }
        };
        return this;
    };

    this.scroll = (scrollId) => {
        if (scrollId === undefined) {
            scrollTag = true;
        } else {
            body.scroll_id = scrollId;
            body.scroll = globalConfig.scroll;
        }
        return this;
    };

    this.source = (source) => {
        body._source = source;
        return this;
    };

    this.filter = (column, value) => {
        var typeOfValue = typeof value;
        if (typeOfValue === 'string' || typeOfValue === 'boolean' || typeOfValue === 'number') {
            filterList.push({
                'name': column,
                'type': 'term',
                'value': value
            });
        }
        return this;
    };

    this.matchPhrase = (value, column, queryType) => {
        let query = {};
        query[column] = value
        if (!queryType) {
            mustList.push({
                'match_phrase': query
            });
        } else if (queryType === BOOL_TYPE.TYPE_OR) {
            shouldList.push({
                'match_phrase': query
            })
        } else if (queryType === BOOL_TYPE.TYPE_NOT) {
            notList.push({
                'match_phrase': query
            });
        }
        return this;
    };

    this.run = (cbk) => {
        initParams();
        body.size = size;
        let url = "http://" + domain + ":" + port + path + "/_search";
        if (scrollTag) {
            url += "?scroll=" + globalConfig.scroll;
        }
        if (body.scroll_id) {
            let scrollId = body.scroll_id;
            url = "http://" + domain + ":" + port + "/_search/scroll";
            body = {
                'scroll_id': scrollId,
                'scroll': globalConfig.scroll
            };
        }
        let chunk = [];
        if (globalConfig.debug) {
            logger(JSON.stringify(body));
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
            if (result.error) {
                let error;
                if (typeof result.error === 'string') {
                    error = result.error;
                } else if (typeof result === 'object') {
                    error = result.error.type + " Reason:" + result.error.root_cause[0].reason;
                }
                cbk(new Error(error));
                return;
            }
            //请求列表的情况和groupBy的情况
            if (body.aggs && result.aggregations) {
                list = result.aggregations;
            } else {
                result.hits.hits.forEach((item) => {
                    item._source[globalConfig.primaryKey] = item._id;
                    list.push(item._source);
                });
            }
            if (cbk) {
                cbk(null, list, result);
            }
        }).on("error", (err) => {
            if (cbk) {
                cbk(err);
            }
        });

    };

    this.size = (s) => {
        size = s;
        return this;
    };


    this.gt = (value, name, equal, type) => {
        params[name] = new QueryType.Gt(value, equal);
        return this;
    };
    this.lt = (value, name, equal, type) => {
        params[name] = new QueryType.Lt(value, equal);
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

    this.between = (key, arr, equalFrom, equalTo, queryType = 0) => {
        if (arr.length != 2) {
            throw new Error("between params is invalid")
            return this;
        }
        params[key] = new QueryType.Between(arr[0], arr[1], equalFrom, equalTo, queryType);
        return this;
    };

    this.offset = (offset) => {
        from = offset;
        return this;
    };


    this.match = (query, column, queryType) => {
        if (!body.query) {
            body.query = {
                "bool": {}
            };
        }
        let match;
        if (typeof column === 'string') {
            match = {
                "match": {}
            }
            match.match[column] = query;
        } else if (Object.prototype.toString.call(column).indexOf("Array") >= 0) {
            let columns = column;
            match = {
                "multi_match": {}

            }
            match.multi_match.query = query;
            match.multi_match.fields = columns;
        }
        if (!queryType) {
            mustList.push(match);
        } else if (queryType === BOOL_TYPE.TYPE_OR) {
            shouldList.push(match)
        } else if (queryType === BOOL_TYPE.TYPE_NOT) {
            notList.push(match);
        }
        return this;
    };

    this.count = (cbk) => {
        initParams();
        let url = "http://" + domain + ":" + port + path + "/_search";
        let chunk = [];
        var promise = new Promise();
        body.size = 0;
        if (globalConfig.debug) {
            globalConfig.logger(JSON.stringify(body));
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
                } else {
                    promise.reject(new Error("ES返回接口不是JSON"));
                }
                return;
            }
            if (result.error) {
                let error;
                if (typeof result.error === 'string') {
                    error = result.error;
                } else if (typeof result === 'object') {
                    error = result.error.type + " Reason:" + result.error.root_cause[0].reason;
                }
                if (cbk) {
                    cbk(new Error(error));
                } else {
                    promise.reject(new Error(error));
                }
            } else {
                if (cbk) {
                    cbk(null, +result.hits.total);
                } else {
                    promise.resolve(+result.hits.total);
                }
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