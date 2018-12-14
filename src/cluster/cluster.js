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
};