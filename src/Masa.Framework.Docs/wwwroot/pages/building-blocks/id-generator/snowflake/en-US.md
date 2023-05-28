Generator = SnowflakeIdGeneratorFactory.CreateGenerator();
           // 生成唯一有序的ID
           Id = Generator.NextId();
       }
   }
   ```

   :::

   ::: code-group-item 通过依赖注入获取

   ```csharp Domain/Services/CatalogService.cs
   using Masa.BuildingBlocks.Data;
   
   namespace Masa.EShop.Service.Catalog.Domain.Services;
   
   public class CatalogService : ICatalogService
   {
       private readonly ISnowflakeIdGenerator _generator;
       
       public CatalogService(ISnowflakeIdGenerator generator)
       {
           _generator = generator;
       }
       
       public async Task<CatalogItem> CreateCatalogItemAsync(string name, decimal price, long catalogTypeId, long catalogBrandId)
       {
           var item = new CatalogItem
           {
               Id = _generator.NextId(),
               Name = name,
               Price = price,
               CatalogTypeId = catalogTypeId,
               CatalogBrandId = catalogBrandId
           };
           
           // 省略其他代码
           
           return item;
       }
   }
   ```

   :::
   ::::

## 配置

可以通过 `SnowflakeIdGeneratorOptions` 配置雪花 `ID` 生成器的参数，如下：

```csharp Program.cs
var builder = WebApplication.CreateBuilder(args);
builder.Services.Configure<SnowflakeIdGeneratorOptions>(options =>
{
    options.WorkerId = 1;
    options.DatacenterId = 1;
});
builder.Services.AddSnowflake();
```

目前支持的配置项有：

- `WorkerId`：工作机器 ID，取值范围为 `[0, 31]`，默认值为 `0`
- `DatacenterId`：数据中心 ID，取值范围为 `[0, 31]`，默认值为 `0`
- `Epoch`：起始时间戳，单位为毫秒，可以设置一个较小的值来减小生成的 `ID` 的长度，默认值为 `1609459200000`（2021 年 1 月 1 日 0 点）

## 注意事项

- 不要在多个进程中使用相同的 `WorkerId` 和 `DatacenterId`，否则会导致生成的 `ID` 不唯一
- `SnowflakeIdGenerator` 不是线程安全的，如果需要在多线程环境下使用，需要进行同步处理The following is a code snippet in C# that demonstrates how to use the Snowflake ID generator:

```csharp
using Masa.Contrib.Data.IdGenerator.Snowflake;

public class MyClass
{
    private readonly ISnowflakeGenerator _generator;

    public MyClass(ISnowflakeGenerator generator)
    {
        _generator = generator;
    }

    public void GenerateId()
    {
        var id = _generator.NewId();
    }
}
```

In the above code, we create a class `MyClass` that uses the Snowflake ID generator. We inject the generator into the class using dependency injection. We then call the `NewId` method of the generator to generate a new ID.

The following code demonstrates how to use the Snowflake ID generator with dependency injection:

```csharp
using Masa.Contrib.Data.IdGenerator.Snowflake;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);
        builder.Services.AddSnowflake();
        var app = builder.Build();
        app.MapGet("/getid", () =>
        {
            var generator = app.Services.GetService<ISnowflakeGenerator>();
            return generator.NewId();
        });
        app.Run();
    }
}
```

In the above code, we create a new `WebApplication` and register the Snowflake ID generator with the dependency injection container. We then use the `MapGet` method to map a GET request to the `/getid` endpoint. In the endpoint handler, we retrieve the Snowflake ID generator from the dependency injection container and call the `NewId` method to generate a new ID.

The following code demonstrates how to use the Snowflake ID generator with dependency injection and Redis for distributed deployment:

```csharp
using Masa.Contrib.Data.IdGenerator.Snowflake;
using Masa.Contrib.Data.IdGenerator.Snowflake.Distributed.Redis;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);
        builder.Services.AddSnowflake(distributedIdGeneratorOptions =>
        {
            distributedIdGeneratorOptions.UseRedis(
                option => option.GetWorkerIdFromEnvironmentVariable("WORKER_ID"),
                option => option.Configuration = "localhost:6379"
            );
        });
        var app = builder.Build();
        app.MapGet("/getid", (ISnowflakeGenerator generator) => { return generator.NewId(); });
        app.Run();
    }
}
```

In the above code, we register the Snowflake ID generator with Redis for distributed deployment. We use the `UseRedis` method to configure the generator to use Redis. We specify the environment variable `WORKER_ID` to get the worker ID and the Redis configuration. We then use the `MapGet` method to map a GET request to the `/getid` endpoint. In the endpoint handler, we retrieve the Snowflake ID generator from the dependency injection container and call the `NewId` method to generate a new ID.```
MinInterval = 5000,
           redisOptions =>
           {
               redisOptions.Servers = new List<RedisServerOptions>()
               {
                   new("localhost", 6379)
               };
           });
   });
   ```

### Configuration

#### Basic

| Parameter Name     | Description                                               | Details                                                                                   |
| ------------------ | --------------------------------------------------------- |----------------------------------------------------------------------------------------|
| BaseTime           | The base time, which is less than the current time (UTC+0) | It is recommended to use a fixed time closer to the present. Once used, it cannot be changed (changing may cause: duplicate `ID`) |
| SequenceBits       | Sequence number, default: **12**, supports 0-4095 (2^12-1) | Each worker can generate up to 4095 requests per millisecond.                               || Parameter Name     | Description                                                  | Details                                                      |
|--------------------|--------------------------------------------------------------|--------------------------------------------------------------|
| WorkerIdBits       | Worker machine ID, default: **10**, supports 0-1023 machines | By default, it does not support use in a `k8s` cluster. In a `Pod` with multiple replicas, the `WorkerId` obtained may be the same, which may result in duplicate IDs. |
| EnableMachineClock | Enable clock lock, default: **false**                         | When the clock lock is enabled, the generated ID is no longer directly related to the current time. The generated ID uses the project start time as the initial time, and clock backtracking during project operation will not affect ID generation. |
| TimestampType      | Timestamp type, default: **1** (milliseconds: `Milliseconds`, seconds: `Seconds`) | When `TimestampType` is `Milliseconds`, the maximum length of `SequenceBits` + `WorkerIdBits` is 22. |
| MaxCallBackTime    | Maximum callback time, default: 3000 milliseconds             | When the clock lock is not enabled, if the time is rolled back by less than `MaxCallBackTime`, the ID generation will wait until the time is greater than the time of the last generated ID before generating a new ID. If it exceeds the maximum callback time, an exception will be thrown. |

> The value of `WorkerId` is obtained by default from the environment variable `WORKER_ID`. If it is not set, it will return 0. (When deploying on multiple machines, ensure that the `WorkerId` of each service is unique.)

| ------------------ | ------------------------------------------------------------ |
| SupportDistributed | Whether to support distributed deployment, default: **false** (assigned by the library providing `WorkerId`) |
| HeartbeatInterval  | Heartbeat interval, default: **3000ms (3s)**                 | Used to periodically check and refresh the status of the service to ensure that `WorkerId` is not reclaimed. |
| MaxExpirationTime  | Maximum expiration time, default: **10000ms (10s)**         | When refreshing the service status fails, if the time difference between the current time and the first time the service failed to refresh exceeds the maximum expiration time, the current `WorkerId` will be abandoned and the service of generating `ID` will be refused until a new `WorkerId` can be obtained and the service can be provided again. |

#### Distributed Snowflake ID (Redis)

| Parameter Name | Description |
| -------------- | ----------- |
| SupportDistributed | Whether to support distributed deployment, default: **false** (assigned by the library providing `WorkerId`) |
| HeartbeatInterval | Heartbeat interval, default: **3000ms (3s)** | Used to periodically check and refresh the status of the service to ensure that `WorkerId` is not reclaimed. |
| MaxExpirationTime | Maximum expiration time, default: **10000ms (10s)** | When refreshing the service status fails, if the time difference between the current time and the first time the service failed to refresh exceeds the maximum expiration time, the current `WorkerId` will be abandoned and the service of generating `ID` will be refused until a new `WorkerId` can be obtained and the service can be provided again. |的 `WorkerId` 时，需要等待 `GetWorkerIdMinInterval` 的时间间隔后才能获取新的 `WorkerId` |
|RetryInterval|重试间隔时间，默认: **500ms**| 当获取 `WorkerId` 失败时，会在 `RetryInterval` 的时间间隔后进行重试，直到获取到可用的 `WorkerId` 为止                                                                                           |
|MaxRetryTimes|最大重试次数，默认: **10次**| 当获取 `WorkerId` 失败时，最多进行 `MaxRetryTimes` 次重试，如果仍然无法获取到可用的 `WorkerId`，则会抛出异常                                                                                           |
|Epoch|起始时间戳，默认: **2019-01-01 00:00:00**| `Snowflake` 算法中的时间戳是基于 `Epoch` 的，即从 `Epoch` 开始计算，每一毫秒都会自增，直到达到 `4095` 后会重新从 `0` 开始自增，因此 `Epoch` 的选择非常重要，需要根据实际情况进行选择，以免出现时间戳重复的情况 |When obtaining an `ID`, the system will attempt to retrieve a new `WorkerId`. If the time elapsed since the last `WorkerId` retrieval is less than `GetWorkerIdMinInterval`, the request for a new `WorkerId` will be rejected. The default value for `GetWorkerIdMinInterval` is 10 seconds. 

When the clock lock is enabled, the `RefreshTimestampInterval` is set to 500ms by default. If the time elapsed between the current timestamp and the last saved timestamp exceeds `RefreshTimestampInterval`, the current timestamp and `WorkerId` mapping will be saved in `Redis` for future use, reducing the dependency on the current system time. 

The Snowflake ID consists of four parts, including a timestamp and a sequence number, both of which have the potential to be duplicated. To ensure that the `ID` is unique, it is necessary to ensure that the `WorkerId` is unique. The `MASA Framework` provides support for distributed Snowflake `ID` using `Redis` as an external storage to record the remaining valid `WorkerId`s. 

In terms of performance testing, when `TimestampType` is set to 1 (milliseconds), the system can retrieve a new `ID` within 1ms. The `MASA Framework` uses `Redis` to store the `WorkerId` and timestamp mapping, which can handle up to 10,000 requests per second.RyuJIT DEBUG
   Job-JPQDWN: .NET 6.0.5 (6.0.522.21309), X64 RyuJIT
   Job-BKJUSV: .NET 6.0.5 (6.0.522.21309), X64 RyuJIT
   Job-UGZQME: .NET 6.0.5 (6.0.522.21309), X64 RyuJIT

   Runtime=.NET 6.0  RunStrategy=ColdStart

   | Method                 | Job        | IterationCount |       Mean |     Error |     StdDev |     Median |        Min |          Max |
   | ---------------------- | ---------- | -------------- | ---------: | --------: | ---------: | ---------: | ---------: | -----------: |
   | SnowflakeByMillisecond | Job-JPQDWN | 1000           | 2,096.1 ns | 519.98 ns | 4,982.3 ns | 1,900.0 ns | 1,000.0 ns | 156,600.0 ns |
   | SnowflakeByMillisecond | Job-BKJUSV | 10000          |   934.0 ns |  58.44 ns | 1,775.5 ns |   500.0 ns |   200.0 ns | 161,900.0 ns |
   | SnowflakeByMillisecond | Job-UGZQME | 100000         |   474.6 ns |   5.54 ns |   532.8 ns |   |   400.0 ns |   200.0 ns | 140,500.0 ns |
   
   The `TimestampType` is set to 2 (seconds).
   
   The benchmark was conducted using the following specifications:
   
   - BenchmarkDotNet=v0.13.1, OS=Windows 10.0.19043.1023 (21H1/May2021Update)
   - 11th Gen Intel Core i7-11700 2.50GHz, 1 CPU, 16 logical and 8 physical cores
   - .NET SDK=7.0.100-preview.4.22252.9
   - [Host]     : .NET 6.0.5 (6.0.522.21309), X64 RyuJIT
   - Job-RVUKKG : .NET 6.0.5 (6.0.522.21309), X64 RyuJIT
   - Job-JAUDMW : .NET 6.0.5 (6.0.522.21309), X64 RyuJIT
   - Job-LOMSTK : .NET 6.0.5 (6.0.522.21309), X64 RyuJIT
   
   The runtime is .NET 6.0 and the run strategy is ColdStart.
   
   The table below shows the benchmark results for the `SnowflakeBySecond` method with an iteration count of 1000:
   
   |            Method |        Job | IterationCount |      Mean |      Error |       StdDev |    Median |       Min |          Max |
   |------------------ |----------- |--------------- |----------:|-----------:|-------------:|----------:|----------:|-------------:|
   | SnowflakeBySecond | Job-RVUKKG |           1000  |   400.0 ns |   200.0 ns |   140,500.0 ns ||  Time Unit |        Mean |     Error |    StdDev |  Gen 0 | Gen 1 | Gen 2 | Allocated |
   |-----------|------------:|----------:|----------:|-------:|------:|------:|----------:|
   | SnowflakeBySecond | Job-BBZSDR |          10000 |  1.045 us | 0.0200 us | 0.0187 us |  0.055 us |     104 B |
   | SnowflakeBySecond | Job-NUSWYF |         100000 |  1.045 us | 0.0200 us | 0.0187 us |  0.055 us |     104 B |
   | SnowflakeBySecond | Job-FYICRN |        1000000 |  1.045 us | 0.0200 us | 0.0187 us |  0.055 us |     104 B |

   以上数据是在 `TimestampType` 为1（毫秒）、启用时钟锁的情况下得出的。在这个测试中，我们使用了 .NET 6.0.5 运行时，测试了 `SnowflakeBySecond` 方法在不同数量级下的性能表现。从结果来看，该方法的平均执行时间非常短，仅为微秒级别，且标准差和误差都非常小，表明该方法的性能非常稳定。同时，该方法在内存分配方面也表现出色，仅分配了 104 字节的内存。The table shows the performance of the MachineClockByMillisecond job with different iteration counts. The Mean, Error, StdDev, Median, Min, and Max values are presented for each iteration count. It is worth noting that the snowflake ID heavily relies on time, and even with clock locking enabled, the project still needs to obtain the current time as a reference time during startup. If the initial time obtained is already expired, there is still a possibility of duplicate IDs being generated. Therefore, it is crucial to ensure that the time is accurate.