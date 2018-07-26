const request = require('../util/request.js');
const config = require('../util/globalConfig.js');
const UrlBuilder = require('./uri-builder/urlBuilder.js');
const Condition = require('./esCondition.js'),
    Aggs = require('./esAggs.js');
module.exports = function(name, opts, mappings = {}, settings) {
    const self = this;
    Condition.call(this);
    const DOMAIN = config.get('domain'),
        PORT = config.get('port'),
        BASE_URL = config.get('BASE_URL'),
        INDEX = opts.index,
        TYPE = opts.type;
    const urlBuilder = new UrlBuilder(BASE_URL, INDEX, TYPE);
    let exists, dbMappings;
    let shardsCount;
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

    const checkExists = async() => {
        const url = BASE_URL + INDEX;
        let result, flag = false;
        try {
            result = await request({
                'url': url,
                'method': 'GET'
            });
            let mappings = result[INDEX].mappings;
            flag = mappings.hasOwnProperty(TYPE);
            if (flag) {
                dbMappings = mappings[TYPE].properties;
            }
        } catch (e) {
            return false;
        }
        return flag;
    };

    const checkIndexExists = async() => {
        let flag = false;
        try {
            let url = `${BASE_URL}${INDEX}`;
            let ret = await request({
                'url': url,
                'method': 'GET'
            });
            return true;

        } catch (e) {
            return flag;
        }
    };

    const createDb = async() => {
        let indexExists = await checkIndexExists();
        if (!indexExists) {
            const url = BASE_URL + INDEX;
            const data = {};
            if (settings) {
                data.settings = settings;
            }
            if (mappings) {
                data.mappings = {
                    [TYPE]: {
                        'properties': mappings
                    }
                };
            }
            let body = await request({
                'url': url,
                'method': 'PUT',
                'body': JSON.stringify(data)
            });
        } else {
            const url = `${BASE_URL}${INDEX}/${TYPE}`;
            let params = {
                mappings
            };
            let ret = await request({
                url,
                'method': 'POST',
                'body': JSON.stringify(params)
            });
        }
    };

    const buildAggs = () => {
        let param = {};
        this.aggsList.forEach((aggs) => {
            let name = aggs.getName();
            param[name] = aggs.aggValueOf();
        });
        return param;
    };

    const updateDb = async() => {
        let incremental = {};
        if (mappings && dbMappings) {
            Object.keys(mappings).filter((key) => {
                return !dbMappings.hasOwnProperty(key);
            }).forEach((key) => {
                incremental[key] = mappings[key];
            });
        }
        let params = {
            'properties': incremental
        };
        const url = `${BASE_URL}${INDEX}/_mapping/${TYPE}`;
        body = await request({
            url,
            'method': 'PUT',
            'body': JSON.stringify(params)
        });
    };

    const getRandomRouting = async() => {
        if (!shardsCount) {
            const url = `${BASE_URL}${INDEX}`;
            const ret = await request({
                url,
                'method': 'GET'
            });
            if (ret[INDEX].settings) {
                shardsCount = ret[INDEX].settings.index.number_of_shards;
            }
        }
        let routing = Math.floor(Math.random() * shardsCount) + 1;
        return routing;
    };


    this.getMappings = async() => {
        const url = `${BASE_URL}${INDEX}/_mappings`;
        let ret = await request({
            url,
            'method': 'GET'
        });
        let mappings = ret[INDEX].mappings;
        if (mappings.hasOwnProperty(TYPE)) {
            return mappings[TYPE].properties;
        } else {
            return;
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

    this.sync = async() => {
        if (exists === undefined) {
            exists = await checkExists();
        }
        if (!exists) {
            await createDb();
        } else {
            await updateDb();
        }
        if (!mappings) {
            mappings = dbMappings;
        }
    };

    this.delete = async(id) => {
        if (!id) {
            throw new Error("id is not defined");
        }
        const url = `${BASE_URL}${INDEX}/${TYPE}/${id}`;
        let result = await request({
            url,
            'method': 'DELETE'
        });
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
    }

    const getJoinFlag = (data) => {
        let joinList = Object.keys(mappings).filter((key) => {
            return mappings[key].type === 'join';
        });
        const joinFlag = Object.keys(data).some((key) => {
            return joinList.indexOf(key) >= 0;
        });
        return joinFlag;
    };

    this.checkIndexExists = checkIndexExists;

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


    this.create = async(data, id = '', routing) => {
        if (exists === undefined) {
            exists = await checkExists();
        }
        if (!exists) {
            throw new Error("index and type do not exist");
        }
        id = !!id ? id : '';
        let url = urlBuilder.buildCreateUrl(dbMappings, id, { routing }); //`${BASE_URL}${INDEX}/${TYPE}/${id}?`;
        const reqType = !!id ? 'PUT' : 'POST';
        // const joinFlag = getJoinFlag(data);
        // if (!!id) {
        //     let exists = false;
        //     try {
        //         let info = await this.get(id);
        //         exists = true;
        //     } catch (e) {
        //         exists = false;
        //     };
        //     if (exists) {
        //         throw new Error('id is exists');
        //     }
        // }
        // if (joinFlag || !!routing) {
        //     let routing;
        //     if (!routing) {
        //         routing = await getRandomRouting();
        //     }
        //     url += 'routing=' + routing;
        // }
        const body = await request({
            url,
            'method': reqType,
            'body': JSON.stringify(data)
        });
        return body._id
    }

    this.update = async(id, data, routing) => {
        if (exists === undefined) {
            exists = await checkExists();
        }
        if (!exists) {
            throw new Error("index and type do not exist");
        }
        if (id === undefined || id === '') {
            throw new Error('id could not be null');
        }
        let url = urlBuilder.buildUpdateUrl(dbMappings, id, { routing });
        const body = await request({
            url,
            'method': 'PUT',
            'body': JSON.stringify(data)
        });
        return;
    };

    this.scroll = (options = {}) => {
        this.scroll = options;
        return this;
    };

    this.get = async(id) => {
        const url = `${BASE_URL}${INDEX}/${TYPE}/${id}`;
        const body = await request({ url, 'method': 'GET' });
        const data = body._source;
        data.id = body._id;
        return {
            data,
            orgData: body
        }
    };

    this.scroll = async(id, options = {}) => {
        if (!id) {
            throw new Error('id could not be blank');
        }
        if (exists === undefined) {
            exists = await checkExists();
        }
        if (!exists) {
            throw new Error("index and type do not exist");
        }
        let url = urlBuilder.buildScrollUrl(id, options);
        let result = await request({
            url,
            'method': 'POST',
            'data': '{}'
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

    this.query = async(options = {}) => {
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

    const init = async() => {
        exists = await checkExists();
    };
    init();
};
module.exports.prototype = Condition.prototype;