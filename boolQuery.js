let ES = require("./es.js");
let QueryType = require("./queryType.js");
let QueryAnalyzer = require("./queryTypeParamsAnalysiz.js");
const BOOL_TYPE = require("./boolType.json");
let Analysizer = require("./analysizer/analyzer.js");

function BoolQuery(params = {}) {
    let _self = this;
    let mustList = [],
        shouldList = [],
        notList = [];
    let data = {
        "bool": {}
    };

    let initParams = () => {
        let analyzResult = QueryAnalyzer(params);
        let innerMustList = analyzResult.must,
            innerShouldList = analyzResult.should,
            innerNotList = analyzResult.not;
        Object.keys(params).forEach((key, index) => {
            let value = params[key];
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
            data.bool.must = mustList.concat(innerMustList)
        }
        if (shouldList.length > 0 || innerShouldList.length > 0) {
            data.bool.should = shouldList.concat(innerShouldList);
        }
        if (notList.length > 0 || innerNotList.length > 0) {
            data.bool.not = notList.concat(innerNotList);
        }
        console.log(JSON.stringify(data));
    };

    this.matchPhrase = (value, column, queryType) => {
        let query = {};
        query[column] = value
        if (!queryType || queryType == BOOL_TYPE.TYPE_MUST) {
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

    this.gt = (value, name, equal, type) => {
        let query = new QueryType.Gt(value, equal, type);
        let ana = new Analysizer(type);
        ana.addParam(name, query);
        switch (query.getType()) {
            case BOOL_TYPE.TYPE_MUST:
                mustList = mustList.concat(ana.getList());
                break;
            case BOOL_TYPE.TYPE_OR:
                shouldList = shouldList.concat(ana.getList());
                break;
            case BOOL_TYPE.TYPE_NOT:
                notList = notList.concat(ana.getList());
                break;
        }
        return this;
    };
    this.lt = (value, name, equal, type = 0) => {
        let query = new QueryType.Lt(value, equal, type);
        let ana = new Analysizer(type);
        ana.addParam(name, query);
        switch (type) {
            case BOOL_TYPE.TYPE_MUST:
                mustList = mustList.concat(ana.getList());
                break;
            case BOOL_TYPE.TYPE_OR:
                shouldList = shouldList.concat(ana.getList());
                break;
            case BOOL_TYPE.TYPE_NOT:
                notList = notList.concat(ana.getList());
                break;
        }
        return this;
    };

    this.between = (key, arr, equalFrom, equalTo, queryType = 0) => {
        if (arr.length != 2) {
            throw new Error("between params is invalid")
            return this;
        }
        let query = new QueryType.Between(arr[0], arr[1], equalFrom, equalTo, queryType);
        let ana = new Analysizer(queryType);
        ana.addParam(key, query);
        switch (queryType) {
            case BOOL_TYPE.TYPE_MUST:
                mustList = mustList.concat(ana.getList());
                break;
            case BOOL_TYPE.TYPE_OR:
                shouldList = shouldList.concat(ana.getList());
                break;
            case BOOL_TYPE.TYPE_NOT:
                notList = notList.concat(ana.getList());
                break;
        }
        return this;
    };

    this.match = (query, column, queryType) => {
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

    this.getValue = () => {
        initParams();
        return data;
    };
};

module.exports = BoolQuery;