module.exports.Between = function(from, to) {
    this.from = from;
    this.to = to;
    this.toString = (key) => {
        return " " + key + ":" + "[" + from + " TO " + to + "]";
    };
    this.valueOf = (key) => {
        return {
            'gt': from,
            'lt': to
        };
    };

};

module.exports.Or = function(value) {
    this.toString = (key) => {
        return " OR " + key + ":" + name + " ";
    };
    this.valueOf = (key, descriptions) => {
        let column = descriptions[key];
        if (!column) {
            throw new Error("column in not declared");
        }
        let type = column.type;
        let obj = {};
        obj[key] = value;
        return {
            'term': obj
        }
    }
};