
# elasticsearch-orm - 一个基本的 Elasticsearch 的 查询 API

[![npm package](https://nodei.co/npm/elasticsearch-orm.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/elasticsearch-orm/)

## 安装

```bash
  npm install elasticsearch-orm
```

## 目录

- [创建连接](#创建连接)
- [Promises & Async/Await](#promises--asyncawait)
- [Forms](#forms)
- [HTTP Authentication](#http-authentication)
- [Custom HTTP Headers](#custom-http-headers)
- [OAuth Signing](#oauth-signing)
- [Proxies](#proxies)
- [Unix Domain Sockets](#unix-domain-sockets)
- [TLS/SSL Protocol](#tlsssl-protocol)
- [Support for HAR 1.2](#support-for-har-12)
- [**All Available Options**](#requestoptions-callback)

---


## 创建连接

```js
  const orm = require('elasticsearch-orm');
  const instance = orm({
      'domain':'127.0.0.1',
      'port':9200
  });

  instance.on('connected',() =>{
      console.log('连接成功');
  });

  instance.on('error',(e) =>{
    console.log('连接异常',e);
  });
```
## 索引相关

### 创建一个索引

生成一个索引类型

```js
  
  const demoIndex = instance.register('demoIndex',{
      'index':'demoindex',
      'type':'demotype'
    },{
        'title':{
            'type':'text'
        },
        'age':{
            'type':'integer'
        },
        'location':{
            'type':'geo_point'
        }
      },{
        'number_of_shards': 2,
        'number_of_replicas': 4
      });

```
同步索引：如果索引还未被创建，就会按照 mappings 和 settings `创建`索引，如果索引已经创建，则会自动判断哪些 mappings 是新增的，并将这些新增的 mappings `添加`到索引中。sync 方法返回一个 Promise 对象，所以可以使用 await 关键字。


```js
   await demoIndex.sync();
```

## 文档相关
### 创建文档
create 方法返回一个 Promise 对象，可以使用 await 关键字，最终返回新建的文档 ID
```js
let id = await demoIndex.create({
    'title':'Demo Title',
    'age',12,
    'location':{
      'lon':100.1,
      'lat':40.2
    }
  });
```

指定文档 ID 创建文档
```js
  await demoIndex.create({
    'title':'Demo Title',
    'age',12,
    'location':{
      'lon':100.1,
      'lat':40.2
    }
  },'document_id');
```
指定文档 routing 
```js
  await demoIndex.create({
    'title':'Demo Title',
    'age',12,
    'location':{
      'lon':100.1,
      'lat':40.2
    }
  },'document_id','routing_hash');
```
### 更新文档
```js
  await demoIndex.update('docuemnt_id',{
    'title':"Demo Title 2",
    'age':13
  })
```
指定文档 routing
```js
  await demoIndex.update('document_id',{
    'title':'Demo Title 2',
    'age':14
    },'routing_hash')
```
### 删除文档
```js
  await demoIndex.delete(id);
```
### 通过 id 获取文档 
如果 id 不存在，会返回一个 Error
```js
  let doc = await demoIndex.get(id);
```

## 查询相关
### 构建简单查询
```js
    let ret = await demoIndex.query();
```
ret 对象返回连个子对象，一个是list，是将结果提取好的_source 数组，另一个是 orgResult，是 es 返回的原始内容
### 查询条件
单一查询条件，全部查询条件列表请参看 [查询 API](#查询API)
```js
  let ret = await demoIndex.term('age',12).query();
```
多查询条件
```js
  let ret = await demoIndex.term('age',12).match('title','')
```
must,should,not 查询
```js
  const Condition = require("elasticsearch-orm").Condition;
  let ret = await demoIndex
    .must(new Condition().term('age',12))
    .should(new Condition().match('title','Tiel'))
    .not(new Condition().exists('age'))
    .query();

```
filter 查询
```js
  const Condition = require("elasticsearch-orm").Condition;
  let ret = await demoIndex
            .filter(new Condition().matchAll())
            .query();
```
### 构建嵌套查询
```js
const Condition = require("elasticsearch-orm").Condition;
let condition = new Condition();
condition.term('age',12).match('title','Title').not(new Conditio().range('age',0,10));
let ret = await demoIndex
    .should(condition)
    .exists('location')
    .query();
```

## 使用聚合
### 使用基本聚合
通过 orgResult 对象的原始返回值，可以拿到聚合的结果，完整的聚合 API 请参看 [聚合 API](#聚合API)
```js
  const Aggs = require('elasticsearch-orm').Aggs;
  let ret = await demoIndex
      .exist('age')
      .aggs(new Aggs('avg_age').avg(age))
      .query();
```
### 聚合的子聚合
```js
  const Aggs = require('elasticsearch-orm').Aggs;
  let aggs = new Aggs('test_aggs').terms('title');
  aggs.aggs(new Aggs('sub_aggs').valueCount('age'));
  let ret = await demoIndex
      .exist('age')
      .aggs(aggs)
      .query();
```
## 分页相关
### 分页
```js
  let ret = await demoIndex
      .from(0)
      .size(15)
      .query();
```
### 排序
```js
  let ret = await demoIndex
      .sort('age','asc')
      .sort('title','asc','min')
      .query();
```
或者
```js
  let ret = await demoIndex
      .sort({
          'age':{
              'order':'desc',
              'mode':'min'
          }
      })
      .query();
```
## 设置
如果设置了 debug 为 true，则每次请求的请求体和、url和返回值都会被打印出来
```js
  let instance = orm({
    'domain':'127.0.0.1',
    'port':9200
  });
  instance.set("debug",true);
```
可以设置 debug 的方法
```js
  instance.set("log",console.log);
```
```js
request.get('http://google.com/img.png').pipe(request.put('http://mysite.com/img.png'))
```
## 查询API
