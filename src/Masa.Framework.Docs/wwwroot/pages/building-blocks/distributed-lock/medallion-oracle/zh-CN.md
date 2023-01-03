## 入门

1. 安装`Masa.Contrib.Data.DistributedLock.Medallion.Oracle`

``` powershell
dotnet add package Masa.Contrib.Data.DistributedLock.Medallion.Oracle
```

2. 修改类`Program`

```csharp
builder.Services.AddDistributedLock(medallionBuilder => medallionBuilder.UseOracle("Data Source=MyOracleDB;Integrated Security=yes;"));
```

3. 使用分布式锁

```csharp
IDistributedLock distributedLock;//从DI获取`IDistributedLock`
using (var lockObj = distributedLock.TryGet("Replace Your Lock Name"))
{
    if (lockObj != null)
    {
        // todo: The code that needs to be executed after acquiring the distributed lock
    }
}
```