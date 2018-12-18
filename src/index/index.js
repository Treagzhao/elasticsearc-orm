const requestBuilder = require('../../util/request.js');
module.exports = function(BASE_URL, INDEX, config) {
    const request = requestBuilder(config);
    this.health = async () => {
        const url = `${BASE_URL}_cluster/health/${INDEX}`;
        const body = await request({
            url,
            'method': 'GET'
        });
        return body;
    }

    this.state = async () => {
        const url = `${BASE_URL}_cluster/state`;
        const body = await request({
            url,
            'method': 'GET'
        });
        const info = body.metadata.indices[INDEX];
        if (!info) {
            throw new Error('index does not exists');
        }
        return info;
    };

    this.stat = async () => {
        const url = `${BASE_URL}${INDEX}/_stats`;
        const body = await request({
            url,
            'method': 'GET'
        });
        const info = body['indices'][INDEX];
        return info;
    }

    this.alias = async (names) => {
        const url = `${BASE_URL}_aliases`;
        let type = Object.prototype.toString.call(names);
        if (type.indexOf('Array') < 0) throw new Error('names should be a array');
        const actions = names.map((item) => {
            return {
                "add": {
                    "index": INDEX,
                    "alias": item
                }
            }
        });;
        const params = { actions };
        const body = await request({
            url,
            'method': 'POST',
            'body': JSON.stringify(params)
        });
        return body;
    };

    this.removeAlias = async (names) => {
        const url = `${BASE_URL}_aliases`;
        let type = Object.prototype.toString.call(names);
        if (type.indexOf('Array') < 0) throw new Error('names should be a array');
        const actions = names.map((item) => {
            return {
                "remove": {
                    "index": INDEX,
                    "alias": item
                }
            }
        });;
        const params = { actions };
        const body = await request({
            url,
            'method': 'POST',
            'body': JSON.stringify(params)
        });
        return body;
    };

    this.refresh = async () => {
        const url = `${BASE_URL}${INDEX}/_refresh`;
        const body = await request({
            url,
            'method': 'POST'
        });
        return body;
    };

    this.flush = async () => {
        const url = `${BASE_URL}${INDEX}/_flush`;
        const body = await request({
            url,
            'method': 'POST'
        });
        return body;
    };

    this.forceMerge = async () => {
        const url = `${BASE_URL}${INDEX}/_forcemerge`;
        const body = await request({
            url,
            'method': 'POST'
        });
        return body;
    };

    this.analyze = async (text, analyzer) => {
        const url = `${BASE_URL}${INDEX}/_analyze`;
        const params = {
            text
        };
        if (analyzer) {
            params.analyzer = analyzer;
        }
        const body = await request({
            url,
            'method': "POST",
            'body': JSON.stringify(params)
        });
        return body;
    };

    this.open = async () => {
        const url = `${BASE_URL}${INDEX}/_open`;
        const body = await request({
            url,
            'method': 'POST'
        });
        return body;
    };

    this.close = async () => {
        const url = `${BASE_URL}${INDEX}/_close`;
        const body = await request({
            url,
            'method': 'POST'
        });
        return body;
    }

    this.mappings = async () => {
        const url = `${BASE_URL}${INDEX}/_mappings`;
        const body = await request({
            url,
            'method': 'GET'
        });
        return body;
    };

    this.deleteIndex = async () => {
        const url = `${BASE_URL}${INDEX}`;
        const body = await request({
            url,
            'method': "DELETE"
        });
        return body;
    };
}