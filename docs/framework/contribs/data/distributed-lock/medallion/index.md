---
title: 数据 - 分布式锁 - Medallion
date: 2022/08/19
---

## 概念

基于[DistributedLock](https://github.com/madelson/DistributedLock)的一个分布式锁，核心能力由`Masa.Contrib.Data.DistributedLock.Medallion`提供, 除此之外, 还必须选择一个提供者

* [Azure](https://www.nuget.org/packages/Masa.Contrib.Data.DistributedLock.Medallion.Azure): [查看详细](/framework/contribs/data/distributed-lock/medallion/azure)
* [FileSystem](https://www.nuget.org/packages/Masa.Contrib.Data.DistributedLock.Medallion.FileSystem): [查看详细](/framework/contribs/data/distributed-lock/medallion/file-system)
* [MySql](https://www.nuget.org/packages/Masa.Contrib.Data.DistributedLock.Medallion.MySql): [查看详细](/framework/contribs/data/distributed-lock/medallion/mysql)
* [Oracle](https://www.nuget.org/packages/Masa.Contrib.Data.DistributedLock.Medallion.Oracle): [查看详细](/framework/contribs/data/distributed-lock/medallion/oracle)
* [PostgreSql](https://www.nuget.org/packages/Masa.Contrib.Data.DistributedLock.Medallion.PostgreSql): [查看详细](/framework/contribs/data/distributed-lock/medallion/postgre-sql)
* [Redis](https://www.nuget.org/packages/Masa.Contrib.Data.DistributedLock.Medallion.Redis): [查看详细](/framework/contribs/data/distributed-lock/medallion/redis)
* [SqlServer](https://www.nuget.org/packages/Masa.Contrib.Data.DistributedLock.Medallion.SqlServer): [查看详细](/framework/contribs/data/distributed-lock/medallion/sql-server)
* [WaitHandles](https://www.nuget.org/packages/Masa.Contrib.Data.DistributedLock.Medallion.WaitHandles): [查看详细](/framework/contribs/data/distributed-lock/medallion/wait-handles)
* [ZooKeeper](https://www.nuget.org/packages/Masa.Contrib.Data.DistributedLock.Medallion.ZooKeeper): [查看详细](/framework/contribs/data/distributed-lock/medallion/zoo-keeper)

## 使用

以Redis为例

1. 安装`Masa.Contrib.Data.DistributedLock.Medallion.Redis`

``` powershell
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