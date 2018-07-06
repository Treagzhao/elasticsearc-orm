const request = require('../util/request.js');
const config = require('../util/globalConfig.js');
module.exports = function(name, opts, mappings, settings) {
    const self = this;
    const DOMAIN = config.get('domain'),
        PORT = config.get('port'),
        BASE_URL = config.get('BASE_URL');
    const { INDEX, TYPE } = opts;

    const checkExists = async() => {
        const url = `http://`;
        console.log(DOMAIN, PORT, BASE_URL)
    };

    const init = async() => {
    	await checkExists();
    };

    init();
};