var ES = require("./es.js");
var esInstance = new ES({
    'domain': '10.172.232.237',
    'port': 9200
});

ES.set("debug", true);
let ZcOvertime = esInstance.register("blog_article", {
    'index': 'nginx-access-2017.12.25',
    'type': 'nginx-access'
}, {
    'path': { "type": "string" },
    "msg_size": { "type": "long" },
    "test_con": { "type": "object" }
});
ZcOvertime.find({}).match("122.190.208.146", "@fields.remote_addr").scroll().size(100000).run((err, list) => {
    let set = new Set();
    list.forEach((item) => {
        var request = (item['@fields'].request);
        set.add(request);
        // let data = item['@fields'];
        // let referer = data.http_referrer;
        // referer = referer.replace(/https?:\/\//, '');
        // referer = referer.substring(0, referer.indexOf("/"));
        // set.add(referer);
    });
    console.log(set);
});