let ESOrm = require("./es.js");
let instance = new ESOrm({
    'domain': '127.0.0.1',
    'port': 9200
});

let TestType = instance.register("testindex", {
    'index': 'testindex',
    'type': 'testtype'
}, {
    'name': { "type": "string" },
    "age": { "type": "long" },
    "createDate": { "type": "date" },
    "cid": { "type": "string" }
}).ready(() => {});

TestType.find({}).lt(13, 'age',true).run((err, list, org) => {
    console.log(list);
});