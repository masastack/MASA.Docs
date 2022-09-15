---
title: 数据 - 分布式锁 - Medallion
date: 2022/08/19
---

## 介绍

基于[DistributedLock](https://github.com/madelson/DistributedLock)的一个分布式锁，核心能力由`Masa.Contrib.Data.DistributedLock.Medallion`提供

目前Medallion的提供者有:

* [Azure](/framework/contribs/data/distributed-lock/medallion/azure)
* [FileSystem](/framework/contribs/data/distributed-lock/medallion/file-system)
* [MySql](/framework/contribs/data/distributed-lock/medallion/mysql)
* [Oracle](/framework/contribs/data/distributed-lock/medallion/oracle)
* [PostgreSql](/framework/contribs/data/distributed-lock/medallion/postgre-sql)
* [Redis](/framework/contribs/data/distributed-lock/medallion/redis)
* [SqlServer](/framework/contribs/data/distributed-lock/medallion/sql-server)
* [WaitHandles](/framework/contribs/data/distributed-lock/medallion/wait-handles)
* [ZooKeeper](/framework/contribs/data/distributed-lock/medallion/zoo-keeper)

## 入门

以Redis为例

1. 安装`Masa.Contrib.Data.DistributedLock.Medallion`、`Masa.Contrib.Data.DistributedLock.Medallion.Redis`

``` shell
dotnet add package Masa.Contrib.Data.DistributedLock.Medallion
dotnet add package Masa.Contrib.Data.DistributedLock.Medallion.Redis
```

2. 修改类`Program`

``` C#
builder.Services.AddDistributedLock(medallionBuilder => medallionBuilder.UseRedis("127.0.0.1:6379"));
```

3. 使用分布式锁

``` C#
IDistributedLock distributedLock;//从DI获取`IDistributedLock`
using (var lockObj = distributedLock.TryGet("Replace Your Lock Name"))
{
    if (lockObj != null)
    {
        // todo: The code that needs to be executed after acquiring the distributed lock
    }
}
```