# Cache - Multilevel Cache

## Overview

Multilevel cache refers to caching data at different levels of a system architecture to improve access efficiency. The multilevel cache in MASA Framework is based on distributed caching and adds an additional layer of in-memory caching. By using multilevel cache, requests can be reduced from penetrating the distributed cache, reducing network consumption and performance impact caused by serialization, greatly reducing response time. Additionally, MASA Framework's multilevel cache supports distributed deployment, so when cached data is updated or deleted on a node in the cluster, other nodes in the cluster will also synchronize the update or deletion of cached data. [See reason](#synchronized-updates)

> When using multilevel cache, it is important to note that when there is a large amount of cached data in memory, it may cause memory overload. In this case, we recommend using [sliding expiration](#sliding-expiration).

![Multilevel Cache Structure Diagram](https://cdn.masastack.com/framework/building-blocks/cache/multilevel_design.png)

## Usage

Because multilevel cache is based on distributed caching, we need to install `Masa.Contrib.Caching.MultilevelCache` and any distributed caching provider (e.g. [Masa.Contrib.Caching.Distributed.StackExchangeRedis](./stackexchange-redis.md)).

1. Install `Masa.Contrib.Caching.MultilevelCache` and `Masa.Contrib.Caching.Distributed.StackExchangeRedis`.

   ```shell terminal
   dotnet add package Masa.Contrib.Caching.MultilevelCache
   dotnet add package Masa.Contrib.Caching.Distributed.StackExchangeRedis
   ```

2. Register multilevel cache and use [`distributed Redis cache`](./stackexchange-red```csharp Program.cs
builder.Services.AddMultilevelCache(distributedCacheOptions =>
{
    distributedCacheOptions.UseStackExchangeRedisCache();
});
```

> This code adds multilevel cache with Redis distributed cache, defaulting to localhost:6379.

3. Add configuration information for distributed cache `Redis`.

   ```json appsettings.json l:2-10
   {
       "RedisConfig":{
           "Servers":[
               {
                   "Host":"localhost",
                   "Port":6379
               }
           ],
           "DefaultDatabase":3
       }
   }
   ```

4. Use multilevel cache and inject `IMultilevelCacheClient` object in the constructor.

   ```csharp Controllers/HomeController.cs l:5-6,12,17
   [ApiController]
   [Route("[controller]/[action]")]
   public class HomeController : ControllerBase
   {
       private readonly IMultilevelCacheClient _multilevelCacheClient;
       public HomeController(IMultilevelCacheClient multilevelCacheClient) => ```csharp
_multilevelCacheClient = multilevelCacheClient;

[HttpGet]
public async Task<string?> GetAsync()
{
    //read
    var cacheData = await _multilevelCacheClient.GetAsync<string>("key");
    if (string.IsNullOrEmpty(cacheData))
    {
        cacheData = "value";
        //write
        await _multilevelCacheClient.SetAsync<string>("key", "value");
    }
    return cacheData;
}
```

## Advanced Usage

### Multi-level Cache Registration

We provide multiple ways to initialize the configuration of multi-level cache. We recommend using the **Options Pattern** and using `Configure<MultilevelCacheOptions>` to set the configuration information of multi-level cache.

#### Options Pattern

> We can also use [`MasaConfiguration`](/framework/building-blocks/configuration/overview) to support the Options Pattern.

:::: code-group
::: code-group-item 1. Support Options Pattern
```csharp Program.cs
builder.Services.Configure<MultilevelCacheOptions>(options =>
{
    options.SubscribeKeyType = SubscribeKeyType.String;
    options.CacheProviders = new List<ICacheProvider>
    {
        new MemoryCacheProvider(),
        new RedisCacheProvider("localhost:6379,password=123456")
    };
});
```

:::

::: code-group-item 2. Without Options Pattern
```csharp Program.cs
var options = new MultilevelCacheOptions
{
    SubscribeKeyType = SubscribeKeyType.String,
    CacheProviders = new List<ICacheProvider>
    {
        new MemoryCacheProvider(),
        new RedisCacheProvider("localhost:6379,password=123456")
    }
};
builder.Services.AddSingleton(options);
```

:::
::::

### Custom Cache Provider

You can also implement your own cache provider by implementing the `ICacheProvider` interface.

```csharp
public interface ICacheProvider
{
    Task<T?> GetAsync<T>(string key) where T : class;
    Task SetAsync<T>(string key, T value, TimeSpan? expiration = null) where T : class;
    Task RemoveAsync(string key);
}
```ration": "00:00:10"//滑动过期时长
    }
  },
  // Redis缓存配置，必填
  "RedisCache": {
    "Servers": [
      {
        "Host": "localhost",
        "Port": 6379
      }
    ],
    "DefaultDatabase": 3
  }
}
```
:::
::: code-group-item 2. 在 Startup.cs 中注册
```csharp Startup.cs
public void ConfigureServices(IServiceCollection services)
{
    services.AddControllers();

    // 添加多级缓存
    services.AddMultilevelCache(Configuration.GetSection("MultilevelCache"));

    // 添加 Redis 缓存
    services.AddStackExchangeRedisCache(Configuration.GetSection("RedisCache"));
}
```
:::
::::

以上就是使用多级缓存的两种注册方式，可以根据实际情况选择适合自己的方式。

### 使用多级缓存

使用多级缓存需要注入 `IMultilevelCache` 接口，然后就可以使用其中的方法了。

```csharp
public class WeatherForecastController : ControllerBase
{
    private readonly IMultilevelCache _multilevelCache;

    public WeatherForecastController(IMultilevelCache multilevelCache)
    {
        _multilevelCache = multilevelCache;
    }

    [HttpGet]
    public async Task<IEnumerable<WeatherForecast>> Get()
    {
        var cacheKey = "weather_forecast";
        var cacheValue = await _multilevelCache.GetAsync<IEnumerable<WeatherForecast>>(cacheKey);

        if (cacheValue != null)
        {
            return cacheValue;
        }

        var rng = new Random();
        var result = Enumerable.Range(1, 5).Select(index => new WeatherForecast
        {
            Date = DateTime.Now.AddDays(index),
            TemperatureC = rng.Next(-20, 55),
            Summary = Summaries[rng.Next(Summaries.Length)]
        });

        await _multilevelCache.SetAsync(cacheKey, result);

        return result;
    }
}
```

以上代码中，我们首先从多级缓存中获取缓存数据，如果获取到了就直接返回，否则就从数据源中获取数据，并将数据存入多级缓存中。这样就实现了多级缓存的使用。

### 总结

本文介绍了多级缓存的概念、原理和使用方法，通过使用多级缓存可以有效地提高系统的性能和稳定性。在实际开发中，可以根据实际情况选择适合自己的缓存方案，提高系统的性能和用户体验。级缓存和分布式 Redis 缓存的配置已经在代码中完成。在第一个示例中，我们使用了默认配置，而在第二个示例中，我们手动指定了 Redis 配置信息。这些配置将确保我们的应用程序能够使用多级缓存和分布式 Redis 缓存来提高性能和可伸缩性。able>
<h2>Explanation of Level Cache Configuration Parameters</h2>

<div class="custom-table">
  <table style='border-collapse: collapse;table-layout:fixed;width:100%'>
   <col span=6>
   <tr style="background-color:#f3f4f5; font-weight: bold">
    <td colspan=3>Parameter Name</td>
    <td colspan=2>Parameter Description</td>
    <td>Type</td>
    <td>Default Value</td>
   </tr>
   <tr>
    <td colspan=3>SubscribeKeyType</td>
    <td colspan=2>Subscription key rule (generates subscription channel)</td>
    <td>Enum</td>
    <td>2</td>
   </tr>
   <tr>
    <td colspan=3>SubscribeKeyPrefix</td>
    <td colspan=2>Subscription key prefix (generates subscription channel)</td>
    <td>string</td>
    <td>Empty string</td>
   </tr>
   <tr>
    <td colspan=3>CacheEntryOptions</td>
    <td colspan=2>Memory cache expiration time</td>
    <td>object</td>
    <td></td>
   </tr>
  <tr>
    <td rowspan=12></td>
    <td colspan=2>AbsoluteExpiration</td>
    <td colspan=2>Absolute expiration time: expires after the specified time</td>
    <td>DateTimeOffset?</td>
    <td>null (never expires)</td>
   </tr>
   <t英文翻译：

```
<tr>
    <td colspan=2>AbsoluteExpirationRelativeToNow</td>
    <td colspan=2>Absolute expiration time relative to now (when used with AbsoluteExpiration, AbsoluteExpirationRelativeToNow takes precedence)</td>
    <td>TimeSpan?</td>
    <td>null (never expires)</td>
</tr>
<tr>
    <td colspan=2>SlidingExpiration</td>
    <td colspan=2>Sliding expiration time: as long as it is accessed within the window period, its expiration time will always be extended by a window length</td>
    <td>TimeSpan?</td>
    <td>null (never expires)</td>
</tr>
```

更多使用：

#### Sliding Expiration

Sliding expiration can be used through global configuration and direct specification for single operations. When both global configuration and direct specification have set sliding expiration time, the time specified directly will be used.

1. Global configuration

```csharp Program.cs
builder.Services.AddMultilevelCache(opt =>
{
    opt.UseStackExchangeRedisCache(redisOptions =>
    {
        redisOptions.Servers = new List<RedisServerOptions>()
        {
            new("localhost", 6379)
        };
        // Set the key's expiration time to 30 minutes, and the cache will expire after 30 minutes
        redisOptions.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(30);
        // Set the sliding expiration time to 10 minutes
        redisOptions.SlidingExpiration = TimeSpan.FromMinutes(10);
    });
});
```

2. Direct specification

```csharp
await _cache.SetAsync("key", "value", new DistributedCacheEntryOptions
{
    // Set the sliding expiration time to 5 minutes
    SlidingExpiration = TimeSpan.FromMinutes(5)
});
```iveToNow = TimeSpan.FromMinutes(30)
            };

            await _multilevelCacheClient.SetAsync("key", cacheData, options);
        }

        return cacheData;
    }
}
```

3. 使用缓存标签

在 `Set` 方法中，可以为缓存数据设置标签，然后在删除缓存时，可以根据标签批量删除。

```csharp
[ApiController]
[Route("[controller]/[action]")]
public class HomeController : ControllerBase
{
    private readonly IMultilevelCacheClient _multilevelCacheClient;
    public HomeController(IMultilevelCacheClient multilevelCacheClient) => _multilevelCacheClient = multilevelCacheClient;

    [HttpGet]
    public async Task<string?> GetAsync()
    {
        var cacheData = await _multilevelCacheClient.GetAsync<string>("key", "tag");
        if (string.IsNullOrEmpty(cacheData))
        {
            cacheData = "value";

            var options = new CacheEntryOptions
            {
                //设置key的有效期是30分钟，超过30分钟缓存过期
                AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(30),
                //设置缓存标签
                Tags = new[] { "tag" }
            };

            await _multilevelCacheClient.SetAsync("key", cacheData, options);
        }

        return cacheData;
    }

    [HttpDelete]
    public async Task DeleteAsync()
    {
        //根据标签批量删除缓存
        await _multilevelCacheClient.RemoveByTagAsync("tag");
    }
}
```

以上就是使用 `EasyCaching` 实现缓存过期策略的三种方式。The code sets the cache options for a multi-level cache, which includes a distributed cache and an in-memory cache. The cache options include an absolute expiration time of 30 minutes and a sliding expiration time of 10 minutes. The sliding expiration time means that if the cache key is accessed within 10 minutes, the expiration time will be extended by another 10 minutes until it reaches the absolute expiration time and is removed. The code also uses the Pub/Sub capability of the distributed cache to synchronize updates across all cache replicas.