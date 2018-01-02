let QueryType = require("../queryType.js");
const BOOL_TYPE = require("../boolType.json");

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

module.exports = Analyzer;