const request = require('../util/request.js');
const config = require('../util/globalConfig.js');
module.exports = function(name, opts, mappings, settings) {
    const self = this;
    const DOMAIN = config.get('domain'),
        PORT = config.get('port'),
        BASE_URL = config.get('BASE_URL'),
        INDEX = opts.index,
        TYPE = opts.type;
    let exists;
    const checkExists = async() => {
        const url = BASE_URL + INDEX + (!!TYPE ? '/' + TYPE : '');
        let result, flag;
        try {
            result = await request({
                'url': url,
                'method': 'GET'
            });
            flag = true;
        } catch (e) {
            flag = false;
        }
        return flag;
    };

    const create = async() => {
        const url = BASE_URL + INDEX;
        const data = {};
        if (settings) {
            data.settings = settings;
        }
        if (mappings) {
            data.mappings = {
                [TYPE]: mappings
            };
        }
        console.log(data);
    };

    const init = async() => {
        exists = await checkExists();
    };

    this.sync = async() => {
        if (exists === undefined) {
            await checkExists();
        }
        if (!exists) {
            await create();
        } else {

        }
    };

    init();
};