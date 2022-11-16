---
title: 缓存
date: 2022/07/01
---

## 概念

什么是缓存，在项目中，为了提高数据的读取速度，我们会对不经常变更但访问频繁的数据做缓存处理

## 功能列表

* 分布式缓存: IDistributedCacheClient
    * [Redis 缓存](../../contribs/cache/stackexchange-redis.md): 基于[StackExchange.Redis](https://github.com/StackExchange/StackExchange.Redis)实现的分布式缓存
* [多级缓存](../../contribs/cache/multilevel-cache.md): IMultilevelCacheClient, 基于内存缓存与分布式缓存实现的多级缓存
