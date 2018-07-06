module.exports = function() {
    this.match = (field, value, opts = {}) => {
        if (value === undefined) {
            throw new Error('arguments type error');
        }
        if (typeof field === 'string') {
            this.count++;
            this.must.push({
                'match': {
                    [field]: value
                }
            })
        } else if (Object.prototype.toString.call(field).indexOf('Array') >= 0) {
            this.count++;
            let condition = {
                'multi_match': {
                    'query': value,
                    'fields': field
                }
            };
            if (opts.type) {
                condition['multi_match'].type = opts.type;
            }
            this.must.push(condition);
        } else {
            throw new Error('arguments type error');
        }
        return this;
    };

    this.matchPhrase = (field, value) => {
        if (typeof field !== 'string' || value === undefined) {
            throw new Error('arguments type error');
        }
        this.count++;
        this.must.push({
            'match_phrase': {
                [field]: value
            }
        });
        return this;
    };
    this.matchPhrasePrefix = (field, value) => {
        if (typeof field !== 'string' || value === undefined) {
            throw new Error('arguments type error');
        }
        this.count++;
        this.must.push({
            'match_phrase_prefix': {
                [field]: value
            }
        });
        return this;
    };
}