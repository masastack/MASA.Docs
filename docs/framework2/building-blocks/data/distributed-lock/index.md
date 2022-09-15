---
title: 数据 - 分布式锁供者
date: 2022/07/01
---

## 介绍

目前分布式锁的提供者有:

* [Masa.Contrib.Data.DistributedLock.Local](/framework/contribs/data/distributed-lock/local): 基于[`SemaphoreSlim`](https://docs.microsoft.com/zh-cn/dotnet/api/system.threading.semaphoreslim?redirectedfrom=MSDN&view=net-6.0)实现的分布式锁
* [Masa.Contrib.Data.DistributedLock.Medallion](/framework/contribs/data/distributed-lock/medallion): 基于[DistributedLock](https://github.com/madelson/DistributedLock)实现的分布式锁

后续将逐步提供更多的分布式锁支持

> 更多细节逐步完善中……