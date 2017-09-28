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

TestType.find({}).source(['age', 'name']).order("age").size(2).scroll().run((err, list, org) => {

});