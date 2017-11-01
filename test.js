var ES = require("./es.js");
var esInstance = new ES({
    'domain': '10.172.232.237',
    'port': 9200
});


let ZcOvertime = esInstance.register("zc_overtime", {
    'index': 'zc_overtime',
    'type': 'zc_overtime_2017-11-01'
});

ZcOvertime.find({
    'createDate': ES.between(new Date(), new Date()),
    'type': 1
}).match("adffd", "pid").count((err, result) => {
    console.log(err, result);
});