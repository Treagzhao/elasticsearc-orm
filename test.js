var ES = require("./es.js");
var esInstance = new ES({
    'domain': '10.172.232.237',
    'port': 9200
});

ES.set("debug", true);
let ZcOvertime = esInstance.register("zc_overtime", {
    'index': 'zc_overtime',
    'type': 'zc_overtime_2017-11-01'
}, {
    'url': { "type": "string" },
    "type": { "type": "long" }
});

ZcOvertime.find({
    'createDate': ES.between(new Date(), new Date()),
    'type': 1
}).count((err, result) => {});


ZcOvertime.find({
    'createDate': ES.between(new Date(), new Date()),
    'type': 1
}).run(() => {

})