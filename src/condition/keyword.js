module.exports = function() {
    this.term = (field, value) => {
        if (typeof field !== 'string' || value === undefined) {
            throw new Error('arguments type error');
        }

        this.count++;
        if (Object.prototype.toString.call(value).indexOf('Array') >= 0) {
            this.must.push({
                'terms': {
                    [field]: value
                }
            })
        } else {
            this.must.push({
                'term': {
                    [field]: value
                }
            });
        }
        return this;
    };

    this.range = (field, from, to, equalFrom, equalTo) => {
        if (typeof field !== 'string' || from === undefined || to === undefined) {
            throw new Error('arguments type error');
        }
        if (from === null && to === null) {
            throw new Error("from and to could not be null both");
        }
        this.count++;
        let param = {
            [field]: {}
        };
        if (from !== null) {
            let condition = "gt" + (!!equalFrom ? "e" : "");
            param[field][condition] = from;
        }
        if (to != null) {
            let condition = "lt" + (!!equalTo ? "e" : "");
            param[field][condition] = to;
        }
        this.must.push({
            'range': param
        });
        return this;
    };
};