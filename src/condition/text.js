module.exports = function() {
    this.match = (field, value, opts = {}) => {
        if (value === undefined || value === null) {
            throw new Error('arguments type error');
        }
        if (typeof field === 'string') {
            this.count++;
            let param = {
                'match': {
                    [field]: value
                }
            };
            let ordinary = ['operator', 'zero_terms_query'];
            ordinary.forEach(function(key) {
                if (opts[key] !== undefined) {
                    param.match[key] = opts[key];
                }
            });
            this.mustList.push(param);
        } else if (Object.prototype.toString.call(field).indexOf('Array') >= 0) {
            this.count++;
            let condition = {
                'multi_match': {
                    'query': value,
                    'fields': field
                }
            };
            let ordinary = ['type', 'tie_breaker'];
            ordinary.forEach(function(key) {
                if (opts[key] !== undefined) {
                    condition.multi_match[key] = opts[key];
                }
            });
            this.mustList.push(condition);
        } else {
            throw new Error('arguments type error');
        }
        return this;
    };

    this.matchPhrase = (field, value, opts = {}) => {
        if (typeof field !== 'string' || value === undefined || value === null) {
            throw new Error('arguments type error');
        }
        let param = {
            'match_phrase': {
                [field]: value
            }
        };
        let ordinary = ['analyzer', 'max_expansions'];
        ordinary.forEach(function(key) {
            if (opts[key] !== undefined) {
                param.match_phrase[key] = opts[key];
            }
        });
        this.count++;
        this.mustList.push(param);
        return this;
    };
    this.matchPhrasePrefix = (field, value, opts = {}) => {
        if (typeof field !== 'string' || value === undefined) {
            throw new Error('arguments type error');
        }
        let param = {
            'match_phrase_prefix': {
                [field]: value
            }
        }
        let ordinary = ['analyzer', 'max_expansions'];
        ordinary.forEach(function(key) {
            if (opts[key] !== undefined) {
                param.match_phrase_prefix[key] = opts[key];
            }
        });
        this.count++;
        this.mustList.push(param);
        return this;
    };
}