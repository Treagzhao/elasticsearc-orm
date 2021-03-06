
# elasticsearch-orm - 一个基本的 Elasticsearch 的 查询 API

[![npm package](https://nodei.co/npm/elasticsearch-orm.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/elasticsearch-orm/)

## 安装

```bash
  npm install elasticsearch-orm
```

## 目录

- [创建连接](#user-content-创建连接)
- [索引相关](#user-content-索引相关)
- [文档相关](#user-content-文档相关)
- [查询相关](#user-content-查询相关)
- [使用聚合](#user-content-使用聚合)
- [分页相关](#user-content-分页相关)
- [设置](#user-content-设置)
- [集群相关接口](#user-content-集群相关接口)
- [查询API](#user-content-查询api)
- [聚合API](#user-content-聚合api)

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

### 索引健康值
```js
    const health = await demoIndex.health();
```
### 索引状态
```js
    const stat = await demoIndex.stat();
```
### 索引统计
```js
    const state = await demoIndex.state();
```
### 设置索引别名
```js
    const result = await demoIndex.alias(['alias_name']);
```
### 删除别名
```js
    const result = await demoIndex.removeAlias(['alias_name']);
```
### 刷新
```js
    const result = await demoIndex.refresh();
```
### 冲洗
```js
    const result = await demoIndex.flush();
```
### 强制合并
```js
    const result = await demoIndex.forceMerge();
```
### 测试分词器
```js
    const result = await demoIndex.analyze('我爱北京天安门','ik_max_word');
```
### 开启一个索引
```js
    const result = await demoIndex.open();
```

### 关闭一个索引
```js
    const result = await demoIndex.close();
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
指定父节点
```js
  await demoIndex.create({
    'title':'Title',
    'age':123
    },null,null,{
      'parent':'parent_id'
    })
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
  await demoIndex.delete(['id1','id2'])
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
单一查询条件，全部查询条件列表请参看 [查询 API](#user-content-查询api)
```js
  let ret = await demoIndex.term('age',12).query();
```
多查询条件
```js
  let ret = await demoIndex
      .term('age',12)
      .match('title','')
      .query();
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
condition.term('age',12)
    .match('title','Title')
    .not(new Conditio()
    .range('age',0,10));
let ret = await demoIndex
    .should(condition)
    .exists('location')
    .query();
```

## 使用聚合
### 使用基本聚合
通过 orgResult 对象的原始返回值，可以拿到聚合的结果，完整的聚合 API 请参看 [聚合 API](#user-content-聚合api)
```js
  const Aggs = require('elasticsearch-orm').Aggs;
  let ret = await demoIndex
      .exists('age')
      .aggs(new Aggs('avg_age').avg('age'))
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
### 使用滚动
发起一个滚动
```js
    await demoIndex.query({
        'scroll':'1m'
    })
```
执行滚动
```js
    await demoIndex.scroll(scrollId,{
        'scroll':'1m'
    });
```
清除一个滚动
```js
    await demoIndex.clearScroll(scrollId);
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
如果设置了 debug 为 true，则每次请求的请求体、url和返回值都会被打印出来
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
设置请求超时时间，以毫秒为单位（默认是30s）
```js
  instance.set('timeout',5000);
```
## 集群相关接口
### 获取集群健康值
```js
    const health = await instance.health();
```
### 获取集群状态
```js
    const state = await instance.state();
```
### 获取集群统计
```js
    const stat = await instance.stat();
```
### 获取索引列表
```js
    const result = await instance.indices();
```
### 节点信息
```js
    const result = await instance.nodes();
```
### 节点状态
```js
    const result = await instance.nodeStat('node_id');
```
### 关闭一个节点
```js
    const result = await instance.shutDown('node_id');
```

## 查询API
### 文本匹配
#### match 查询
```js
  let condition = new Condition();
  condition.match('title','content1 content2');
  condition.match('title','content1 content2',{
    'operator':'and'
    });
```
生成的查询json 为
```json
  {
    "match":{
        "title":"content1 content2",
        "operator":"and"
    }
  }
```
field 参数可以是数组
```js
  condition.match(['title','description'],'content1 content2');
  condition.match(['title','description'],'content1 content2',{
      'type':'best_fields'
    });
```
生成的查询 json 为
```json
  {
    "multi_match":{
        "query":"content1 content2",
        "type":"best_fields",
        "fields":["title","description"]
    }
  }
```
#### 短语查询 matchPhrase 和 matchPhrasePrefix
```js
condition.matchPhrase('title','content1 content2');
condition.matchPrasePrefix('title','content1 content2');
condition.matchPhrase('title','content1 content2',{
  'analyzer':'test_analyzer'
  });
```
生成查询 json
```json
  {
    "match_phrase":{
      "title":{
        "query":"content1 content2",
        "analyzer":"test_analyzer"
      }
    }
  }
  {
    "match_phrase_prefix":{
      "title":{
        "query":"content1 content2"
      }
    }
  }
```
### 精确值
#### term 查询
```js
condition.term('age',13);
condition.term('age',[13,15]);
```
生成查询 json
```json
  {
    "term":{
        "age":13
    }
  }
  {
    "terms":{
        "age":[13,15]
    }
  }
```
#### exists 查询
```js
condition.exists('age');
condition.exists(['age','title']);
```
生成json
```json
{
  "exists":{
    "field":"age"
  }
}
{
  "exists":{
    "fields":["age","title"]
  }
}
```
#### range 查询
```js
condition.range('age',1);
condition.range('age',1,10);
condition.range('age',null,10);
condition.range('age',1,10,true,false);
```
生成json
```json
  {
    "range":{
        "age":{
            "gt":1
        }
    }
  }
  {
    "range":{
        "age":{
            "gt":1,
            "lt":10
        }
    }
  }
  {
    "range":{
        "age":{
            "lt":10
        }
    }
  }
  {
    "range":{
        "age":{
            "gte":1,
            "lt":10
        }
    }
  }
```
使用 Range 对象
```js
const Range = require('elasticsearch-orm').Range();
let range = new Range(1);
range = new Range(1,10);
range = new Range(1,10,false,true);
range = new Range().gt(1,true).lt(10,false);
condition.range(range);
```
#### prefix、wildcard 和fuzzy
```js
condition.prefix('title','Tre');
condition.wildcard('title','Tre*hao');
condition.fuzzy('title',{
  'value':'ki',
  'boost':1.0
})
```
生成 json 文件
```json
{
  "prefix":{
    "title":"Tre"
  }
}
{
  "wildcard":{
    "title":"Tre*hao"
  }
}
{
  "fuzzy":{
    "title":{
        "value":"ki",
        "boost":1.0
    }
  }
}
```
### 地理位置查询
#### geoShape
```js
condition.geoShape('location','circle',
  [{
  'lon':100.0,
  'lat':41.0
  }],
  {
    'radius':"100m",
    "relation":"within"
    })
```
生成json
```json
  {
    "geo_shape":{
        "location":{
            "shape":{
              "type":"circle",
              "coordinates":[{
                "lon":100.0,
                "lat":41.0
              }],
              "relation":"within"
            }
        }
    }
  }
```
#### geoDistance
```js
  condition.geoDistance('location',{
    'lon':100.0,
    'lat':31.0
    },'100m');
```
生成 json
```json
  {
    "geo_distance":{
      "distance":"100m",
      "location":{
        "lon":100.0,
        "lat":31.0
      }
    }
  }
```
#### geoPolygon
```js
condition.geoPolygon('location',[{
  'lon':100.0,
  'lat':41.1
  },{
    'lon':101.0,
    'lat':42.1
   },{
     'lot':102.3,
     'lat':42.4
    }])
```
生成 json
```json
{
  "geo_polygon":{
      "location":{
          "points":[{
                  "lon":100.0,
                  "lat":41.1
                },{
                  "lon":101.0,
                  "lat":42.1
                },{
                  "lot":102.3,
                  "lat":42.4
                }]
      }
  }
}
```
#### geoBoundingBox
```js
  condition.geoBoundingBox('location',{
    'top_left':{
        'lon':100.1,
        'lat':31.3
    },
    'bottom_right':{
      'lon':100.3,
      'lat':32.1
    }
    });
```
生成 json
```json
{
  "geo_bounding_box":{
    "location":{
        "top_left":{
          "lon":100.0,
          "lat":31.3
        },
        "bottom_right":{
          "lon":103.3,
          "lat":31.3
        }
    }
  }
}
```
### 关系查询
#### hasParent
```js
  condition.hasParent('parentType',new Condition().matchAll(),{
    'score':1
    });
```
生成 json
```json
  {
    "has_parent":{
      "parent_type":"parentType",
      "query":{
          "match_all":{}
      }
    }
  }
```
#### hasChild
```js
  condition.hasChild('childType',new Condition().matchAll(),{
    'min_children':10
    });
```
生成 json
```json
  {
    "has_child":{
      "type":"childType",
      "query":{
        "match_all":{}
      }
    }
  }
```
#### parentId
```js
condition.parentId('parent_id_1','type');
```
生成 json
```json
{
  "parent_id":{
    "type":"type",
    "id":"parent_id_1"
  }
}
```

## 聚合API
### 基本的数值聚合
```js
  const Aggs = require('elasticsearch-orm').Aggs;
  aggs = new Aggs('test').avg('age');
  aggs = new Aggs('test').cardinality('age');
  aggs = new Aggs('test').max('age');
  aggs = new Aggs('test').min('age');
  aggs = new Aggs('test').sum('age');
  aggs = new Aggs('test').valueCount('age');
  aggs = new Aggs('test').stats('age');
  aggs = new Aggs('test').percentiles('age');
  aggs = new Aggs('test').percentileRanks('age');

```
### 分组聚合
#### terms
```js
aggs = new Aggs('test').terms('age',{
  'order':{
      'field':"age",
      'type':'desc'
  },
  'size':10
  })
```
#### histogram
```js
aggs = new Aggs('test').histogram('age',10);
```
#### dateHistogram
```js
aggs= new Aggs('test').dateHistogram('date','month',{
  'format':"yyyy-MM",
  'offset':'+1h'
  });
```
#### dateRange
```js
const Range = require('elasticsearch-orm').Range;
aggs = new Aggs('test').dateRange('date',[new Range()],{
  'format':"yyyy-MM"
});
```
#### range
```js
aggs = new Aggs('test').ranges('age',[new Range(1,10)]);
```
#### filter
```js
aggs = new Aggs('test').filter('age',new Condition().matchAll());
```
#### missing
```js
aggs = new Aggs('test').missing('age')

```
#### sampler
```js
aggs =new Aggs('test').sampler(100,{
  'max_doc_per_value':10
});
```
#### children
```js
  aggs = new Aggs('test').children('childrenType');
```
#### significantTerms
```js
  aggs = new Aggs('test').significantTerms('age');
```
### 地理相关的聚合
#### geoBounds
```js
aggs = new Aggs('test').geoBounds('location',{
  'wrap_longtitude':true
})
```

#### geoDistance
```js
aggs = new Aggs('test').geoDistance('location',{
  'lon':100.0,
  'lat':13.1
},[new Range(1,10)],{
  'unit':'m'
  });
```
#### geoCentroid
```js
aggs = new Aggs('test').geoCentroid('location');
```