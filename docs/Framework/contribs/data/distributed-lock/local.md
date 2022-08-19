---
title: 数据 - 分布式锁 - Local
date: 2022/07/01
---

## 介绍

基于[`SemaphoreSlim`](https://docs.microsoft.com/zh-cn/dotnet/api/system.threading.semaphoreslim?redirectedfrom=MSDN&view=net-6.0)实现的分布式锁

## 入门

1. 安装`Masa.Contrib.Data.DistributedLock.Local`

``` shell
dotnet add package Masa.Contrib.Data.DistributedLock.Local
```

2. 修改类`Program`，注册分布式锁

``` C#
builder.Services.AddLocalDistributedLock();
```

3. 使用锁

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