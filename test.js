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
}).ready(() => {

});

TestType.mapping((err, result) => {
    console.log(err);
    console.log(JSON.stringify(result));
});