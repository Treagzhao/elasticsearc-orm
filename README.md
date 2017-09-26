# Elasticsearch Orm
这个是一个针对于Elasticsearch的Orm框架，通过一些基本的api，来实现增删改查，后续功能有待完善。敬请期待。
## 开始
```javascript
	var ESOrm = require("elasticsearch-orm");
	var esInstance = new ESOrm({
		"domain":"127.0.0.1",
		"port":"9200"
	});
```

## node支持版本
node 6.0.0+

## 主要功能
1. 连接ES库
2. 注册ES索引和类型
3. 对数据进行增删改查

## 使用文档
### 注册索引和类型
通过`register`方法，可以注册一个跟索引和类型绑定的Entity实例
```javascript
var TestType =	esInstance.regster("testtype",{
	"index":"yourindex",
	"type":"yourtype"
});
```
在注册索引和类型的时候，可以传入这个类型的映射关系
```javascript
var TestType = esInstance.register("testtype",{
	"index":"yourindex",
	"type":"yourtype"
},{
	"name":{"type":"string"},
	"age":{"type":"long"},
	"birthday":{"type":"date"},
	"userId":{"type":"string","index":"not_analyzed"}
});
```
当传入了索引的映射类型后，orm会自动检测index和type有没有建立，如果没有建立，就会自动按照指定的配置创建映射。如果没有传入映射关系，orm就不会执行自动创建。
```javascript
esInstance.register("testtype",{
	"index":"yourindex",
	"type":"yourtype"
},{
	"name":{"type":"string"},
	"age":{"type":"long"},
	"birthday":{"type":"date"},
	"userId":{"type":"string","index":"not_analyzed"}
}).ready(() => {
	console.log('ready');
});
```
### 获取Entity实例
除了通过`register`的方法返回值获取Entity实例，也可以在orm的`entities`里面通过key来获取实例。
```javascript
	var TestType = esInstance.entities['testtype'];
```
### 插入一条文档
```javascript
	TestType.create({
		'name':"Treagzhao",
		"age":18,
		'userId':'xsdf9012xf',
		'birtyDate':new Date()
	},(err,result,orgResult) => {
		console.log('插入成功');
	});
```
### 更新一条文档
```javascript
	TestType.update(id,{
		'name':"New Name":
		"age":100,
		"birthday":new Date()
	},(err,result,orgResult) => {
		console.log("更新成功");
	});
```
### 删除一条文档
```javascript
	TestType.delete(id,(err,result,orgResult) => {
		console.log("更新成功");
	});
```
### 获取一条文档
```javascript
	TestType.get(id,(err,result,orgResult)=>{
		console.log(result);
	});
```
### 查询
#### 基本查询
```javascript
TestType.find({
		'userId':'userId1'
}).run((err,list,orgResult) => {
		console.log(list);
});
```
查询的返回值有两个，一个是`list`，另一个是`orgResult`，分别对应着提取之后的列表信息，和原始数据。

list:
```json
[
    {
        "name": "Treagzhao",
        "age": 18,
        "userId": "e9jud46niso",
        "createDate": "2017-09-26T08:28:32.441Z",
		"id":"AV69TUk8gw-LyrZU-U1H"
    }
]
```

orgResult:
```json
{
    "took": 2,
    "timed_out": false,
    "_shards": {
        "total": 5,
        "successful": 5,
        "failed": 0
    },
    "hits": {
        "total": 1,
        "max_score": null,
        "hits": [
            {
                "_index": "testindex",
                "_type": "testtype",
                "_id": "AV69TUk8gw-LyrZU-U1H",
                "_score": null,
                "_source": {
                    "name": "Treagzhao",
        			"age": 18,
        			"userId": "e9jud46niso",
        			"createDate": "2017-09-26T08:28:32.441Z"
                },
                "sort": [
                    1506414512441
                ]
            }
        ]
    }
}
```
#### 获取数量
```javascript
TestType.find({
	'age':13
}).count((err,result,org) => {
	console.log(result);
});
```
#### 匹配查询
单个字段匹配查询
```javascript
TestType.find({}).match("内容","name").run((err,list,org) => {
	console.log(list);
});
```
多字段匹配查询
```javascript
TestType.find({}).match("内容",["name","userId"]).run((err,list,org) => {
	console.log(list);
});
```
多组内容查询
```javascript
TestType.find({}).matchPhrase("内容1 内容2","name").run((err,list,org) => {
	console.log(list);
});
```
#### 分页
```javascript
TestType.find({}).offset(0).size(100).run((err,list,org) => {
	console.log(list);
});
```
#### 排序
通过在字段名前加* - *来倒序排列
```javascript
TestType.find({}).order("createDate").run((err,list,org) => {
	console.log(list);
});
TestType.find({}).order("-createDate").run((err,list,org) => {
	console.log(list);
});
```
#### 范围查询
`between` 方法的第二个参数必须是长度为2的数组
```javascript
TestType.find({}).between("age",[1,30]).run((err,list,org) => {
	console.log(list);
});
```
还可以通过find来进行范围查询
```javascript
TestType.find({
	'age':ESOrm.between(1,30)
}).run((err,list,org) => {
	console.log(list);
});
```