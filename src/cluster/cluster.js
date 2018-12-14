const requestBuiler = require('../../util/request.js');
module.exports = function(BASE_URL, config) {
    const self = this;
    const request = requestBuiler(config);
    this.health = async () => {
        const url = `${BASE_URL}_cluster/health`;
        let result = await request({
            url,
            'method': 'GET'
        });
        return result;
    };

    this.stats = async () => {
        const url = `${BASE_URL}_cluster/stats`;
        let result = await request({
            url,
            'method': 'GET'
        });
        return result;
    };

    this.state = async () => {
        const url = `${BASE_URL}_cluster/state`;
        let result = await request({
            url,
            'method': 'GET'
        });
        return result;
    };

    this.indices = async () => {
        const url = `${BASE_URL}_cat/indices?format=json`;
        const result = await request({
            url,
            'method': 'GET'
        });
        return result;
    }

    this.nodes = async () => {
        const url = `${BASE_URL}_nodes`;
        const result = await request({
            url,
            'method': 'GET'
        });
        return result;
    };
    this.nodeStat = async (id) => {
        let url = `${BASE_URL}_nodes`;
        if (!!id) {
            url += `/${id}`;
        }
        url += `/stats`;
        const result = await request({
            url,
            'method': 'GET'
        });
        return result;
    };
};