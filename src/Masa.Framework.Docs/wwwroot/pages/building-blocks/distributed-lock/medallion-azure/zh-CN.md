---
## 入门

1. 安装`Masa.Contrib.Data.DistributedLock.Medallion`、`Masa.Contrib.Data.DistributedLock.Medallion.Redis`

``` powershell
dotnet add package Masa.Contrib.Data.DistributedLock.Medallion.Redis
```

2. 修改类`Program`

``` C#
builder.Services.AddDistributedLock(medallionBuilder => medallionBuilder.UseAzure("Replace Your connectionString", "Replace your blobContainerName"));
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