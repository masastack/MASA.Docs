---
title: 数据 - 分布式锁 - Medallion - Redis
date: 2022/08/19
---

## 入门

1. 安装`Masa.Contrib.Data.DistributedLock.Medallion.Redis`

``` shell
dotnet add package Masa.Contrib.Data.DistributedLock.Medallion.Redis
```

1. 修改类`Program`

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