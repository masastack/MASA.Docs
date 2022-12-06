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

通过注册`Elasticsearch`,我们可以从DI中获取`IMasaElasticClient`与`IElasticClient`, 其中`IMasaElasticClient`是[MasaFramework](https://github.com/masastack/MASA.Framework)对`ES`常用操作的抽象, 包括对`索引`、`别名`、`文档`的管理, 而`IElasticClient`是[Nest](https://www.nuget.org/packages/NEST)对`ES`的抽象
