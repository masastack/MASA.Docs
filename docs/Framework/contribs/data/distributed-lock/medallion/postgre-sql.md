---
title: 数据 - 分布式锁 - Medallion - PostgreSql
date: 2022/08/19
---

## 入门

1. 安装`Masa.Contrib.Data.DistributedLock.Medallion.PostgreSql`

``` shell
dotnet add package Masa.Contrib.Data.DistributedLock.Medallion.PostgreSql
```

1. 修改类`Program`

``` C#
builder.Services.AddDistributedLock(medallionBuilder => medallionBuilder.UseNpgsql("Host=myserver;Username=sa;Password=P@ssw0rd;Database=identity"));
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