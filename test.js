var request = require("request");
request.post({
    'url': 'http://kf.stnts.com/chat/user/config.action',
    'formData': {
        'sysNum': '41076deba1104a1ba055bc38sheng3f4',
        'source': 0,
        'lanFlag': 0,
        'robotFlag': ''
    }
}, (err, response, body) => {
    console.log(body);
});