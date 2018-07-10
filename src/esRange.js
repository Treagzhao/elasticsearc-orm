function Range(from, to, fromEqual, toEqual) {

    this.gt = (value, equal) => {
        from = value;
        fromEqual = equal;
        return this;
    }

    this.lt = (value, equal) => {
        to = value;
        toEqual = equal;
        return this;
    }

    this.valueOf = () => {
        let obj = {};
        if (from !== undefined) {
            let key = !!fromEqual ? 'gte' : 'gt';
            obj[key] = from;
        }
        if (to !== undefined) {
            let key = !!toEqual ? 'lte' : 'lt';
            obj[key] = to;
        }
        return obj;
    }

    this.fromToValue = () => {
        let obj = {};
        if (from !== undefined && from !== '') {
            obj.from = from;
        }
        if (to !== undefined && to !== '') {
            obj.to = to;
        }
        if (Object.keys(obj).length === 0) {
            throw new Error('from and to could not be blank both');
        }
        return obj;
    };
};

module.exports = Range;