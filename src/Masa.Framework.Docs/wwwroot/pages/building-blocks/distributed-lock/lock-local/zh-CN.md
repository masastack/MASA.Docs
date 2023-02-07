## 概念

基于[`SemaphoreSlim`](https://learn.microsoft.com/zh-cn/dotnet/api/system.threading.semaphoreslim)实现的本地锁, 建议在单个应用中使用

## 使用

1. 安装`Masa.Contrib.Data.DistributedLock.Local`

``` powershell
dotnet add package Masa.Contrib.Data.DistributedLock.Local
```

2. 注册锁, 修改类`Program`

```csharp
builder.Services.AddLocalDistributedLock();
```

3. 使用锁

```csharp
IDistributedLock distributedLock; //从DI获取`IDistributedLock`
using (var lockObj = distributedLock.TryGet("Replace Your Lock Name"))
{
    if (lockObj != null)
    {
        // todo: 获取分布式锁后需要执行的代码
    }
}
```