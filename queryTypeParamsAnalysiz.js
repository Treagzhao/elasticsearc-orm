let QueryType = require("./queryType.js");
const BOOL_TYPE = require("./boolType.json");

function Analyzer(queryType) {
    let list = [];
    let range = null,
        term = null;
    this.addParam = (key, param) => {
        if (param instanceof QueryType.Or) {
            list.push(param.valueOf(key));
        } else if (param instanceof QueryType.Not) {
            list.push(param.valueOf(key));
        } else {
            if (!range) {
                range = {
                    "range": {}
                };
                list.push(range);
            }
            range.range[key] = param.valueOf(key);
        }
    };
    this.getList = () => {
        return list;
    };
};


module.exports = (params) => {
    let mustAnalyzer = new Analyzer(BOOL_TYPE.TYPE_MUST);
    let shouldAnalyzer = new Analyzer(BOOL_TYPE.TYPE_OR);
    let notAnalyzer = new Analyzer(BOOL_TYPE.TYYPE_NOT);
    Object.keys(params).forEach((key) => {
        let value = params[key];
        if (!(value instanceof QueryType.BaseType)) {
            return;
        }
        switch (value.getType()) {

            case BOOL_TYPE.TYPE_MUST:
                mustAnalyzer.addParam(key, value)
                break;
            case BOOL_TYPE.TYPE_OR:
                shouldAnalyzer.addParam(key, value);
                break;
            case BOOL_TYPE.TYPE_NOT:
                notAnalyzer.addParam(key, value);
                break;
            case BOOL_TYPE.TYPE_BETWEEN:
                mustAnalyzer.addParam(key, value);
                break;
        }
    });
    return {
        'must': mustAnalyzer.getList(),
        'should': shouldAnalyzer.getList(),
        'not': notAnalyzer.getList()
    }
};