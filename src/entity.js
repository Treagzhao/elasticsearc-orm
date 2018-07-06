const request = require('../util/request.js');
const config = require('../util/globalConfig.js');
const Condition = require('./esCondition.js');
module.exports = function(name, opts, mappings, settings) {
    const self = this;
    Condition.call(this);
    const DOMAIN = config.get('domain'),
        PORT = config.get('port'),
        BASE_URL = config.get('BASE_URL'),
        INDEX = opts.index,
        TYPE = opts.type;
    let exists, dbMappings;


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

    const createDb = async() => {
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



    this.sync = async() => {
        if (exists === undefined) {
            exists = await checkExists();
        }
        if (!exists) {
            await self.createDb();
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

    this.create = async(data, id = '') => {
        const url = `${BASE_URL}${INDEX}/${TYPE}/${id}`;
        const reqType = !!id ? 'PUT' : 'POST';
        const body = await request({
            url,
            'method': reqType,
            'body': JSON.stringify(data)
        });
        return body._id
    }

    this.update = async(id, data) => {
        const url = `${BASE_URL}${INDEX}/${TYPE}/${id}`;
        const body = await request({
            url,
            'method': 'PUT',
            'body': JSON.stringify(data)
        });
        return;
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

    this.query = async() => {
        let obj = this.valueOf();
        const body = {
            'query': obj
        };
        const url = `${BASE_URL}${INDEX}/${TYPE}/_search`;
        let result = await request({
            url,
            'body': JSON.stringify(body),
            'method': 'POST',
        });
        let list = result.hits.hits.map((item) => {
            item._source.id = item._id;
            return item._source;
        });
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