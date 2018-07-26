const config = require('../../util/globalConfig.js');
module.exports = function(BASE, INDEX, TYPE) {

    const getJoinFlag = (mappings) => {
        return Object.keys(mappings).some((key) => {
            return mappings[key].type === 'join';
        });
    };

    this.buildCreateUrl = (mappings, id, options = {}) => {
        let joinFlag = getJoinFlag(mappings);
        let url = `${BASE}${INDEX}/${TYPE}`;
        if (id !== undefined) {
            url += '/' + id;
        }
        let opts = Object.keys(options).filter((key) => { return options[key] !== undefined; });
        if (opts.length > 0) {
            url += '?';
        }
        if (joinFlag && options['routing'] === undefined) {
            throw new Error('join type must have routing');
        }
        opts.forEach((key, index) => {
            if (index > 0) {
                url += '&';
            }
            url += key + '=' + options[key];
        });
        return url;
    };

    this.buildUpdateUrl = (mappings, id, options = {}) => {
        let joinFlag = getJoinFlag(mappings);
        let url = `${BASE}${INDEX}/${TYPE}/${id}`;
        let opts = Object.keys(options).filter((key) => { return options[key] !== undefined; });
        if (opts.length > 0) {
            url += '?';
        }
        if (joinFlag && options['routing'] === undefined) {
            throw new Error('join type must have routing');
        }
        opts.forEach((key, index) => {
            if (index > 0) {
                url += '&';
            }
            url += key + '=' + options[key];
        });
        return url;
    };

    this.buildQueryUrl = (options = {}) => {
        let url = `${BASE}${INDEX}/${TYPE}/_search`;
        let params = Object.keys(options).filter((item) => { return options[item] !== undefined });
        if (params.length > 0) {
            url += '?';
        }
        params.forEach((key, index) => {
            if (index > 0) {
                url += '&';
            }
            url += key + '=' + options[key];
        });
        return url;
    };

    this.buildScrollUrl = (id, options = {}) => {
        let url = `${BASE}_search/scroll/${id}`;
        if (!options.scroll) {
            options.scroll = config.get('scroll');
        }
        if (options.scroll) {
            url += '?scroll=' + options.scroll;
        }
        return url;
    };

};