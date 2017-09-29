let ESOrm = require("./es.js");
ESOrm.set("debug", true);
let instance = new ESOrm({
    'domain': '127.0.0.1',
    'port': 9200
}, {
    'debug': true
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

TestType.find({}).between("age", [15, 30]).run((err, list) => {
    console.log(list);
})