var util = require("util");
var BaseType = function() {

};
var Between = function(from, to, equalFrom, equalTo) {
    this.from = from;
    this.to = to;
    this.toString = (key) => {
        return " " + key + ":" + "[" + from + " TO " + to + "]";
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
    this.toString = (key) => {
        return " OR " + key + ":" + name + " ";
    };
    this.valueOf = (key, descriptions) => {
        let column = descriptions[key];
        if (!column) {
            throw new Error("column in not declared");
        }
        let obj = {};
        obj[key] = value;
        return {
            'term': obj
        }
    }
};

var Gt = function(value, equal) {
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
var Lt = function(value, equal) {
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
util.inherits(Gt, BaseType);
util.inherits(Or, BaseType)
util.inherits(Between, BaseType)
util.inherits(Lt, BaseType);
module.exports.BaseType = BaseType;
module.exports.Lt = Lt;
module.exports.Or = Or;
module.exports.Between = Between;
module.exports.Gt = Gt;