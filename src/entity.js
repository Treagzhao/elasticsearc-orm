const requestBuilder = require('../util/request.js');
const UrlBuilder = require('./uri-builder/urlBuilder.js');
const Condition = require('./esCondition.js'),
    Query = require('./esQuery.js'),
    Index = require('./index/index.js'),
    Aggs = require('./esAggs.js');
module.exports = function(name, opts, mappings = {}, settings, config) {
    const self = this;
    const request = requestBuilder(config);

    //Condition.call(this);
    const DOMAIN = config.get('domain'),
        PORT = config.get('port'),
        BASE_URL = config.get('BASE_URL'),
        INDEX = opts.index,
        TYPE = opts.type;
    Index.call(this, BASE_URL, INDEX, config);
    const urlBuilder = new UrlBuilder(BASE_URL, INDEX, TYPE, config);
    let exists, dbMappings;
    let shardsCount;
    this.sortList = [];
    this.aggsList = [];
    this.sourceList = undefined;
    Object.keys(new Condition()).forEach((key) => {
        self[key] = (...args) => {
            let query = new Query(BASE_URL, INDEX, TYPE, config);
            query[key].apply(query, args);
            return query;
        };
    });
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

    const checkExists = async () => {
        const url = BASE_URL + INDEX;
        let result, flag = false;
        try {
            result = await request({
                'url': url,
                'method': 'GET'
            });
            let mappings = {};
            if (result[INDEX]) {
                mappings = result[INDEX].mappings;
            } else {
                Object.keys(result).some((key) => {
                    let item = result[key];
                    if (!!item.aliases) {
                        mappings = item.mappings;
                    }
                    return false;
                });
            }
            flag = mappings.hasOwnProperty(TYPE);
            if (flag) {
                dbMappings = mappings[TYPE].properties;
            }
        } catch (e) {
            return false;
        }
        return flag;
    };

    const checkIndexExists = async () => {
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

    const createDb = async () => {
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

    const updateDb = async () => {
        let incremental = {};
        if (mappings && dbMappings) {
            Object.keys(mappings).filter((key) => {
                return !dbMappings.hasOwnProperty(key);
            }).forEach((key) => {
                incremental[key] = mappings[key];
            });
        }
        if (Object.keys(incremental).length == 0) {
            return;
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

    const getRandomRouting = async () => {
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


    this.getMappings = async () => {
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
        let query = new Query(BASE_URL, INDEX, TYPE, config);
        query.from(from);
        return query;
    };
    this.size = (size) => {
        if (isNaN(size)) {
            throw new Error('from parameter is invalid');
        }
        let query = new Query(BASE_URL, INDEX, TYPE, config);
        query.size(size);
        return query;
    };

    this.sync = async () => {
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

    this.delete = async (id) => {
        let idStr;
        if (Object.prototype.toString.call(id).indexOf("Array") >= 0) {
            let bodies = id.map((item) => {
                let obj = {
                    'delete': {
                        '_id': item
                    }
                };
                return JSON.stringify(obj);
            });
            const url = `${BASE_URL}${INDEX}/${TYPE}/_bulk`;
            let result = await request({
                url,
                'method': 'POST',
                'body': bodies.join('\n')
            });
        } else {
            idStr = id;
            if (!id) {
                throw new Error("id is not defined");
            }
            const url = `${BASE_URL}${INDEX}/${TYPE}/${idStr}`;
            let result = await request({
                url,
                'method': 'DELETE'
            });
        }

    };

    this.sort = (...args) => {
        let query = new Query(BASE_URL, INDEX, TYPE, config);
        query.sort.apply(query, args);
        return query;
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
        let query = new Query(BASE_URL, INDEX, TYPE, config);
        query.source(sources);
        return query;
    };

    this.aggs = (aggs) => {
        if (!aggs instanceof Aggs) {
            throw new Error('arguments type error');
        }
        let query = new Query(BASE_URL, INDEX, TYPE, config);
        query.aggs(aggs);
        return query;
    };


    this.create = async (data, id = '', routing, options = {}) => {
        if (exists === undefined) {
            exists = await checkExists();
        }
        if (!exists) {
            throw new Error("index and type do not exist");
        }
        //判断是否存在
        let docExists = false;
        id = !!id ? id : '';
        if (id) {
            try {
                await this.get(id);
                docExists = true;
            } catch (e) {
                docExists = false;
            };
            if (docExists) {
                throw new Error('id already exists');
            }
        }

        let url = urlBuilder.buildCreateUrl(dbMappings, id, {
            routing,
            parent: options.parent
        });
        const reqType = !!id ? 'PUT' : 'POST';
        const body = await request({
            url,
            'method': reqType,
            'body': JSON.stringify(data)
        });
        return body._id
    }

    this.update = async (id, data, routing) => {
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
        return body;
    };


    this.get = async (id) => {
        const url = `${BASE_URL}${INDEX}/${TYPE}/${id}`;
        const body = await request({ url, 'method': 'GET' });
        const data = body._source;
        data.id = body._id;
        return {
            data,
            orgData: body
        }
    };

    this.scroll = async (id, options = {}) => {
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


    this.clearScroll = async (id) => {
        if (!id) {
            throw new Error('id could not be blank');
        }
        if (exists === undefined) {
            exists = await checkExists();
        }
        if (!exists) {
            throw new Error("index and type do not exist");
        }
        let url = urlBuilder.buildScrollUrl(id);
        let result = await request({
            url,
            'method': 'DELETE'
        });
        return result;
    }

    this.query = async (options = {}) => {
        let query = new Query(BASE_URL, INDEX, TYPE, config);
        let ret = await query.query(options);
        return ret;
    };

    const init = async () => {
        exists = await checkExists();
    };
    init();
};
module.exports.prototype = Condition.prototype;