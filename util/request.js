const request = require('request');

const initContentType = (opts) => {
    if (!opts.headers) {
        opts.headers = {};
    }
    if (!opts.headers['Content-Type']) {
        opts.headers['Content-Type'] = 'application/json';
    }
};

module.exports = (opts) => {
    initContentType(opts);
    return new Promise((resolve, reject) => {
        request(opts, (err, response, body) => {
            if (err) {
                reject(err);
                return;
            }
            try {
                body = JSON.parse(body);
                if (response.statusCode !== 200) {
                    reject(new Error(response.statusCode + ": " + body.error.reason));
                } else {
                    resolve(body);
                }
            } catch (e) {
                reject(e);
            }
        });
    });
};