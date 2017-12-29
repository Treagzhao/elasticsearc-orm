var ES = require("./es.js");
var esInstance = new ES({
    'domain': '10.111.3.199',
    'port': 9200
});

ES.set("debug", true);
let ZcOvertime = esInstance.register("blog_article", {
    'index': 'blog_article',
    'type': 'blog_article'
}, {
    "published": { "type": "object" }
});
ZcOvertime.find({}).filter("published", true).scroll().size(10).run((err, list) => {
    let set = new Set();
    if (err) {
        console.log(err);
        return;
    }
    list.forEach((item) => {
        console.log(item);
    });
});