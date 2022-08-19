---
title: 数据 - 分布式锁 - Medallion - FileSystem
date: 2022/08/19
---

## 入门

1. 安装`Masa.Contrib.Data.DistributedLock.Medallion.FileSystem`

``` shell
dotnet add package Masa.Contrib.Data.DistributedLock.Medallion.FileSystem
```

1. 修改类`Program`

``` C#
builder.Services.AddDistributedLock(medallionBuilder => medallionBuilder.UseFileSystem("Replace your directory path"));
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