const request = require('request');
const config = require('../util/globalConfig.js');
const initContentType = (opts) => {
    if (!opts.headers) {
        opts.headers = {};
    }
    if (!opts.headers['Content-Type']) {
        opts.headers['Content-Type'] = 'application/json';
    }
};

module.exports = (opts) => {
    const DEBUG = config.get('debug');
    const log = config.get("log") || console.log;
    initContentType(opts);
    let logArr = [];
    return new Promise((resolve, reject) => {
        if (DEBUG) {
            logArr.push('----------start');
            logArr.push('url:' + opts.url);
            logArr.push('method:' + opts.method);
            logArr.push('params:' + opts.body);
        }
        let start = +new Date();
        request(opts, (err, response, body) => {
            if (err) {
                reject(err);
                return;
            }
            try {
                body = JSON.parse(body);
                let duration = new Date() - start;
                body.netDuration = duration;
                if (DEBUG) {
                    logArr.push('body:' + JSON.stringify(body));
                    logArr.push('----------end');
                    log(logArr.join('\n'));
                }
                if (response.statusCode === 404) {
                    let error = "Not Found";
                    reject(new Error(response.statusCode + ": " + error));
                } else if (response.statusCode >= 300) {
                    let error = body.result || body.error.reason;
                    reject(new Error(response.statusCode + ": " + error));
                } else {
                    resolve(body);
                }
            } catch (e) {
                reject(e);
            }
        });
    });
};