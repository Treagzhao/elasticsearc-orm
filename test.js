var ES = require("./es.js");
var esInstance = new ES({
    'domain': '127.0.0.1',
    'port': 9200
});

ES.set("debug", true);
let ZcOvertime = esInstance.register("blog_article", {
    'index': 'blog_article',
    'type': 'blog_article'
}, {
    "mysqlId": { "type": "string", "index": "not_analyzed" },
    "summary": { "type": "string", "analyzer": "ik_max_word" },
    "title": { "type": "string", "analyzer": "ik_max_word" },
    "published": { "type": "boolean" },
    "createDate": { "type": "date" }
});


ZcOvertime.find({}).matchPhrase('测试', 'title', ES.TYPE_OR).matchPhrase('测试', 'summary', ES.TYPE_OR).filter("published", true).run((err, list) => {
    if (err) {
        console.error(err);
    }
    console.log(list);
});