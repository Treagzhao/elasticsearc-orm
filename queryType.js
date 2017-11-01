var util = require("util");

function BaseType() {};
const BOOL_TYPE = require("./boolType.json");
BaseType.prototype.getType = function() {
    return this.queryType;
};
var Between = function(from, to, equalFrom, equalTo, queryType) {
    this.from = from;
    this.to = to;
    this.queryType = queryType;
    this.toString = (key) => {
        return " " + key + ":" + "[" + from + " TO " + to + "]";
    };
    this.getType = () => {
        return BOOL_TYPE.TYPE_BETWEEN;
    };
    this.valueOf = (key) => {
        let params = {};
        if (equalFrom) {
            params['gte'] = from;
        } else {
            params['gt'] = from;
        }
        if (equalTo) {
            params['lte'] = to;
        } else {
            params['lt'] = to;
        }
        return params;
    };

};

var Or = function(value) {
    this.getType = () => {
        return BOOL_TYPE.TYPE_OR;
    };
    this.toString = (key) => {
        return " OR " + key + ":" + name + " ";
    };
    this.valueOf = (key) => {
        let obj = {};
        obj[key] = value;
        return {
            'term': obj
        }
    }
};


var Not = function(value, queryType) {
    this.queryType = BOOL_TYPE.TYPE_NOT;
    this.valueOf = (key) => {
        let obj = {};
        obj[key] = value;
        return {
            'term': obj
        }
    };
};


var Gt = function(value, equal, queryType) {
    this.queryType = queryType;
    this.valueOf = (key, descriptions) => {
        let column = descriptions[key];
        if (!column) {
            throw new Error("column in not declared");
        }
        let obj = {};
        let keyName = !!equal ? "gte" : "gt";
        obj[keyName] = value;
        return obj;
    };
};
var Lt = function(value, equal, queryType) {
    this.queryType = queryType;
    this.valueOf = (key, descriptions) => {
        let column = descriptions[key];
        if (!column) {
            throw new Error("column in not declared");
        }
        let obj = {};
        let keyName = !!equal ? "lte" : "lt";
        obj[keyName] = value;
        return obj;
    };
};

util.inherits(Not, BaseType);
util.inherits(Gt, BaseType);
util.inherits(Or, BaseType)
util.inherits(Between, BaseType)
util.inherits(Lt, BaseType);
module.exports.BaseType = BaseType;
module.exports.Lt = Lt;
module.exports.Or = Or;
module.exports.Not = Not;
module.exports.Between = Between;
module.exports.Gt = Gt;