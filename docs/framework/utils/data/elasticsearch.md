---
title: 数据 - Elasticsearch
date: 2022/12/06
---

## 概念

基于[`NEST`](https://www.nuget.org/packages/NEST)的扩展, 其中封装了`ES`的常用操作, 其中包括对`索引`、`别名`、`文档`的管理

## 功能

* 索引
* 别名
* 文档

## 使用

### 必要条件

安装`Masa.Utils.Data.Elasticsearch`包

``` Powershell
dotnet add package Masa.Utils.Data.Elasticsearch
```

1. 注册`Elasticsearch`, 修改`Program.cs`

``` C#
builder.Services.AddElasticsearch("http://localhost:9200"); // 或者builder.Services.AddElasticsearchClient("http://localhost:9200");
```

2. 使用`ElasticClient`

``` C#
IMasaElasticClient masaElasticClient;//从DI获取`IMasaElasticClient`
masaElasticClient.CreateIndexAsync("{Replace-Your-IndexName}");
```

## 源码解读

通过注册`Elasticsearch`,我们可以从DI中获取`IMasaElasticClient`与`IElasticClient`, 其中`IMasaElasticClient`, 而`IElasticClient`是[Nest](https://www.nuget.org/packages/NEST)对`ES`的抽象

### IMasaElasticClient

是[MasaFramework](https://github.com/masastack/MASA.Framework)对`ES`常用操作的抽象, 包括对`索引`、`别名`、`文档`的管理

<!-- 索引 -->
* IndexExistAsync(string indexName, CancellationToken cancellationToken = default): 判断索引是否存在
* CreateIndexAsync(string indexName, CreateIndexOptions? options = null, CancellationToken cancellationToken = default): 创建索引
* DeleteIndexAsync(string indexName, CancellationToken cancellationToken = default): 删除指定索引
* DeleteMultiIndexAsync(IEnumerable\<string\> indexNames, CancellationToken cancellationToken = default): 删除指定的索引集合
* DeleteIndexByAliasAsync(string alias, CancellationToken cancellationToken = default): 根据别名删除索引
* GetAllIndexAsync(CancellationToken cancellationToken = default): 得到当前ES服务所有的索引
* GetIndexByAliasAsync(string alias, CancellationToken cancellationToken = default): 得到指定别名的索引
<!-- 别名 -->
* GetAllAliasAsync(CancellationToken cancellationToken = default): 得到当前ES服务所有的别名
* GetAliasByIndexAsync(string indexName, CancellationToken cancellationToken = default): 根据索引名得到别名信息
* BindAliasAsync(BindAliasIndexOptions options, CancellationToken cancellationToken = default): 为指定索引绑定别名
* UnBindAliasAsync(UnBindAliasIndexOptions options, CancellationToken cancellationToken = default): 为指定索引解除绑定别名
<!-- 文档 -->
* DocumentExistsAsync(ExistDocumentRequest request, CancellationToken cancellationToken = default): 判断文档是否存在
* DocumentCountAsync(CountDocumentRequest request, CancellationToken cancellationToken = default):　得到指定索引下所有的文档总数
* CreateDocumentAsync\<TDocument\>(CreateDocumentRequest\<TDocument\> request, CancellationToken cancellationToken = default): 新增单个文档
* CreateMultiDocumentAsync\<TDocument\>(CreateMultiDocumentRequest\<TDocument\> request, CancellationToken cancellationToken = default): 新增多个文档
* SetDocumentAsync\<TDocument\>(SetDocumentRequest\<TDocument\> request, CancellationToken cancellationToken = default): 设置文档 (已存在文档会覆盖, 等同于Upsert)
* DeleteDocumentAsync(DeleteDocumentRequest request, CancellationToken cancellationToken = default): 根据文档Id删除指定文档
* DeleteMultiDocumentAsync(DeleteMultiDocumentRequest request, CancellationToken cancellationToken = default): 根据文档id集合删除文档
* ClearDocumentAsync(string indexNameOrAlias, CancellationToken cancellationToken = default): 根据索引或者别名清空文档
* UpdateDocumentAsync\<TDocument\>(UpdateDocumentRequest\<TDocument\> request, CancellationToken cancellationToken = default): 更新单个文档
* UpdateMultiDocumentAsync\<TDocument\>(UpdateMultiDocumentRequest\<TDocument\> request, CancellationToken cancellationToken = default): 更新文档集合
* GetAsync\<TDocument\>(GetDocumentRequest request, CancellationToken cancellationToken = default): 根据文档id得到文档详情
* GetMultiAsync\<TDocument\>(GetMultiDocumentRequest request, CancellationToken cancellationToken = default): 根据文档id集合得到文档集合
* GetListAsync\<TDocument\>(QueryOptions\<TDocument\> options, CancellationToken cancellationToken = default): 得到文档列表
* GetPaginatedListAsync\<TDocument\>(PaginatedOptions\<TDocument\> options, CancellationToken cancellationToken = default): 得到文档分页列表

### IElasticClient

`IElasticClient`是[`NEST`](https://github.com/elastic/elasticsearch-net)为`ES`提供功能的抽象, 详细用法可[查看](https://www.elastic.co/guide/en/elasticsearch/client/net-api/7.17/elasticsearch-net-getting-started.html)

### IMasaElasticClientFactory

`IMasaElasticClient`的工厂抽象, 可用于创建指定`name`的[`IMasaElasticClient`](#IMasaElasticClient)

### IElasticClientFactory

`IElasticClient`的工厂抽象, 可用于创建指定`name`的[`IElasticClient`](#IElasticClient)

## 常见问题

* 出错提示为：`"Content-Type header [application/vnd.elasticsearch+json; compatible-with=7] is not supported"`

    我们默认启用兼容模式，即`EnableApiVersioningHeader(true)`，这样对8.*版本支持很好，但在部分7.*会导致错误，此时需要手动关闭兼容模式，即`EnableApiVersioningHeader(false)`。

    ``` C#
    service.AddElasticsearchClient("es", option =>
    {
        option.UseNodes("http://localhost:9200")
            .UseConnectionSettings(setting => setting.EnableApiVersioningHeader(false));
    });
    ```

[为何开启兼容模式？](https://github.com/elastic/elasticsearch-net/issues/6154)

## 参考文献

* [索引别名](https://www.elastic.co/guide/cn/elasticsearch/guide/current/index-aliases.html)