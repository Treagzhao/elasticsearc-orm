const requestBuilder = require('../util/request.js');
const Condition = require('./esCondition.js'),
    Aggs = require('./esAggs.js');
const UrlBuilder = require('./uri-builder/urlBuilder.js');
module.exports = function(BASE_URL, INDEX, TYPE, config) {
    const urlBuilder = new UrlBuilder(BASE_URL, INDEX, TYPE, config);
    const request = requestBuilder(config);
    Condition.call(this);
    this.sortList = [];
    this.aggsList = [];
    this.sourceList = undefined;
    const reset = () => {
        this.mustList = [];
        this.shouldList = [];
        this.notList = [];
        this.filterList = [];
        this.sortList = [];
        this.sourceList = [];
        this.count = 0;
        this.offset = undefined;
        this.limit = undefined;
    };

    const buildAggs = () => {
        let param = {};
        this.aggsList.forEach((aggs) => {
            let name = aggs.getName();
            param[name] = aggs.aggValueOf();
        });
        return param;
    };

    this.query = async (options = {}) => {
        let obj = this.valueOf();
        const body = {
            'query': obj
        };
        if (this.offset !== undefined) {
            body.from = this.offset;
        }
        if (this.limit !== undefined) {
            body.size = this.limit;
        }
        if (this.sortList.length > 0) {
            body.sort = this.sortList;
        }
        if (!!this.sourceList) {
            body['_source'] = this.sourceList;
        }
        if (this.aggsList.length > 0) {
            body.aggs = buildAggs();
        }
        if (options.slice) {
            body.slice = options.slice;
        }
        const params = {};
        if (options.scroll) {
            params.scroll = options.scroll;
        }
        const url = urlBuilder.buildQueryUrl(params);
        let result = await request({
            url,
            'body': JSON.stringify(body),
            'method': 'POST',
        });
        let list = result.hits.hits.map((item) => {
            item._source.id = item._id;
            return item._source;
        });
        reset();
        return {
            list,
            'orgResult': result
        }
    };

    this.from = (from) => {
        if (isNaN(from)) {
            throw new Error('from parameter is invalid');
        }
        this.offset = from;
        return this;
    };
    this.size = (size) => {
        if (isNaN(size)) {
            throw new Error('from parameter is invalid');
        }
        this.limit = size;
        return this;
    };

    this.sort = (...args) => {
        if (args.length === 1 && typeof args[0] === 'object') {
            this.sortList.push(args[0]);
        } else {
            let [field, type, mode] = args;
            if (typeof field !== 'string' || typeof type !== 'string') {
                throw new Error('arguments type error');
            }
            type = type.toLowerCase();
            if (type !== 'asc' && type !== 'desc') {
                throw new Error('arguments type must be one of `asc` or `desc`');
            }
            let item = {
                [field]: {
                    'order': type
                }
            };
            if (!!mode) {
                item[field].mode = mode;
            }
            this.sortList.push(item);
        }
        return this;
    };
    this.source = (sources) => {
        this.sourceList = sources;

        return this;
    };

    this.aggs = (aggs) => {
        if (!aggs instanceof Aggs) {
            throw new Error('arguments type error');
        }
        this.aggsList.push(aggs);
        return this;
    };
};