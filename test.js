let ESOrm = require("./es.js");
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

TestType.find({
    'cid': ESOrm.or("test"),
    'createDate': ESOrm.or(new Date())
}).match("8o3a45kn9", "name", ESOrm.TYPE_OR).between("age", [15, 30], false, false, ESOrm.TYPE_OR).run((err, list, org) => {
    console.log(err,list);
});