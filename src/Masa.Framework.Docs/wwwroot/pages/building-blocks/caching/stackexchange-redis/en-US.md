# Cache - Distributed Redis Cache

## Overview

What is a [`distributed cache`](https://learn.microsoft.com/zh-cn/aspnet/core/performance/caching/distributed)?

## Usage

1. Install `Masa.Contrib.Caching.Distributed.StackExchangeRedis`

   ```shell terminal
   dotnet add package Masa.Contrib.Caching.Distributed.StackExchangeRedis
   ```

2. Add configuration information for `Redis`

   ```json appsettings.json
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

3. Register the distributed cache and use Redis cache

   ```csharp Program.cs
   builder.Services.AddDistributedCache(distributedCacheOptions =>
   {
       distributedCacheOptions.UseStackExchangeRedisCache();//Use distributed Redis cache, using the configuration of the local `RedisConfig` node by default
   });
   ```

4. Use the distributed cache and inject the `IDistributedCacheClient` object in the constructor

   ```csharpApiController]
   [Route("[controller]/[action]")]
   public class HomeController : ControllerBase
   {
       private readonly IDistributedCacheClient _distributedCacheClient;
       public HomeController(IDistributedCacheClient distributedCacheClient) => _distributedCacheClient = distributedCacheClient;
   
       [HttpGet]
       public async Task<string?> GetAsync()
       {
           var cacheData = await _distributedCacheClient.GetAsync<string>("key");
           if (string.IsNullOrEmpty(cacheData))
           {
               cacheData = "value";
               await _distributedCacheClient.SetAsync<string>("key", "value");
           }
   
           return cacheData;
       }
   }
   ```

## Advanced Usage

### Redis Distributed Cache Registration

We provide multiple ways to initialize Redis configuration. We recommend using the **Options pattern** with `Configure<RedisConfigurationOptions>` to set Redis configuration information.

#### Registration via Options Pattern

> We can also use the [```AddDistributedRedisCache```](https://docs.microsoft.com/en-us/dotnet/api/microsoft.extensions.caching.stackexchangeredisextensionservicecollectionextensions.adddistributedrediscache?view=dotnet-plat-ext-5.0) extension method to register Redis distributed cache.>` 中获取 Redis 配置信息。

You can enable option mode support in `MasaConfiguration` by configuring the `RedisConfigurationOptions` object. Here is an example of how to configure Redis servers and default database:

```csharp Program.cs
builder.Services.Configure<RedisConfigurationOptions>(redisConfigurationOptions =>
{
    redisConfigurationOptions.Servers = new List<RedisServerOptions>()
    {
        new("localhost", 6379)
    };
    redisConfigurationOptions.DefaultDatabase = 3;
    redisConfigurationOptions.GlobalCacheOptions = new CacheOptions()
    {
        CacheKeyType = CacheKeyType.None
    };
});
```

To register distributed Redis cache, you can use the following code:

```csharp Program.cs
builder.Services.AddDistributedCache(distributedCacheOptions =>
{
    distributedCacheOptions.UseStackExchangeRedisCache();
});
```

Alternatively, you can register Redis cache by specifying Redis information in a local configuration file. If Redis configuration is not found in the specified node of the local configuration file, `IOptionsMonitor<RedisConfigurationOptions>` will still be used to retrieve Redis configuration information.btions.ConfigurationOptions = new ConfigurationOptions()
        {
            AbortOnConnectFail = false,
            ConnectTimeout = 5000,
            EndPoints = { "localhost:6379" }
        };
    });
});
```The code snippet is configuring the distributed Redis cache in a .NET Core application. It can be done in two ways: either by using the `AddStackExchangeRedisCache` method or by specifying the configuration options. The first method is simpler and requires only the Redis connection string, while the second method allows for more customization.

The `CacheOptions` object is used to configure the cache options, such as the cache key type. In this case, the cache key type is set to `None`, which disables the global cache key formatting.

To register the distributed Redis cache using the configuration options, the Redis configuration options are specified in the `appsettings.json` file. Then, the `AddDistributedCache` method is used to register the cache with the specified Redis configuration options.ion 来中止连接失败的操作</td>
       <td>bool</td>
       <td>true</td>
      </tr>
      <tr>
       <td colspan=3>AllowAdmin</td>
       <td colspan=2>是否允许执行管理员命令</td>
       <td>bool</td>
       <td>false</td>
      </tr>
      <tr>
       <td colspan=3>ConnectTimeout</td>
       <td colspan=2>连接超时时间</td>
       <td>TimeSpan</td>
       <td>5000 毫秒</td>
      </tr>
</col> 

Translation:

<col span=6>
      <tr style="background-color:#f3f4f5; font-weight: bold">
       <td colspan=3>Parameter Name</td>
       <td colspan=2>Parameter Description</td>
       <td>Type</td>
       <td>Default Value</td>
      </tr>
      <tr>
       <td colspan=3>AbsoluteExpiration</td>
       <td colspan=2>Absolute expiration time: the cache item becomes invalid after this time</td>
       <td>DateTimeOffset?</td>
       <td>null (never expires)</td>
      </tr>
      <tr>
       <td colspan=3>AbsoluteExpirationRelativeToNow</td>
       <td colspan=2>Absolute expiration time relative to now (when used with AbsoluteExpiration, takes priority)</td>
       <td>TimeSpan?</td>
       <td>null (never expires)</td>
      </tr>
      <tr>
       <td colspan=3>SlidingExpiration</td>
       <td colspan=2>Sliding expiration time: the expiration time is extended by the window length as long as the item is accessed within the window</td>
       <td>TimeSpan?</td>
       <td>null (never expires)</td>
      </tr>
      <tr>
       <td colspan=3>AbortOnConnectFail</td>
       <td colspan=2>Whether to abort the operation on connection failure with a TimeoutException</td>
       <td>bool</td>
       <td>true</td>
      </tr>
      <tr>
       <td colspan=3>AllowAdmin</td>
       <td colspan=2>Whether to allow execution of admin commands</td>
       <td>bool</td>
       <td>false</td>
      </tr>
      <tr>
       <td colspan=3>ConnectTimeout</td>
       <td colspan=2>Connection timeout</td>
       <td>TimeSpan</td>
       <td>5000 milliseconds</td>
      </tr>
</col><td>int</td>
       <td>5000</td>
      </tr>
      <tr>
       <td colspan=3>ExplicitEndpointOrder</td>
       <td colspan=2>是否显式通知连接/配置超时</td>
       <td>bool</td>
       <td>false</td>
      </tr>
      <tr>
       <td colspan=3>AllowAdmin</td>
       <td colspan=2>是否允许管理操作</td>
       <td>bool</td>
       <td>false</td>
      </tr>
      <tr>
       <td colspan=3>AsyncTimeout</td>
       <td colspan=2>异步操作的允许时间 (毫秒)</td>
       <td>int</td>
       <td>5000</td>
      </tr>
      <tr>
       <td colspan=3>ClientName</td>
       <td colspan=2>用于所有连接的客户端名称</td>
       <td>string</td>
       <td>空字符串</td>
      </tr>
      <tr>
       <td colspan=3>ChannelPrefix</td>
       <td colspan=2>自动编码和解码频道</td>
       <td>string</td>
       <td>空字符串</td>
      </tr>
      <tr>
       <td colspan=3>ConnectRetry</td>
       <td colspan=2>连接重试次数</td>
       <td>int</td>
       <td>3</td>
      </tr>
      <tr>
       <td colspan=3>ConnectTimeout</td>
       <td colspan=2>连接超时时间 (毫秒)</td>="2" colspan=3>MaxCacheSize</td>
       <td colspan=2>缓存最大大小 (MB)</td>
       <td>int</td>
       <td>100</td>
      </tr>
      <tr>
       <td colspan=3>CacheTimeout</td>
       <td colspan=2>缓存超时时间 (s)</td>
       <td>int</td>
       <td>60</td>
      </tr>
      <tr>
       <td colspan=3>CacheCleanupInterval</td>
       <td colspan=2>缓存清理间隔时间 (s)</td>
       <td>int</td>
       <td>300</td>
      </tr>
     </tbody>
    </table>

Translation:

      <tr>
       <td>int</td>
       <td>5000</td>
      </tr>
      <tr>
       <td colspan=3>DefaultDatabase</td>
       <td colspan=2>Default Database</td>
       <td>int</td>
       <td>0</td>
      </tr>
      <tr>
       <td colspan=3>Password</td>
       <td colspan=2>Password</td>
       <td>string</td>
       <td>Empty string</td>
      </tr>
      <tr>
       <td colspan=3>Proxy</td>
       <td colspan=2>Proxy</td>
       <td>Enum</td>
       <td>0</td>
      </tr>
      <tr>
       <td colspan=3>Ssl</td>
       <td colspan=2>Whether to encrypt the connection</td>
       <td>bool</td>
       <td>false</td>
      </tr>
      <tr>
       <td colspan=3>SyncTimeout</td>
       <td colspan=2>Allowed time for synchronous operations (ms)</td>
       <td>int</td>
       <td>5000</td>
      </tr>
      <tr>
       <td colspan=3>GlobalCacheOptions</td>
       <td colspan=2>Cache global configuration</td>
       <td> </td>
      </tr>
      <tr>
       <td rows="2" colspan=3>MaxCacheSize</td>
       <td colspan=2>Maximum cache size (MB)</td>
       <td>int</td>
       <td>100</td>
      </tr>
      <tr>
       <td colspan=3>CacheTimeout</td>
       <td colspan=2>Cache timeout (s)</td>
       <td>int</td>
       <td>60</td>
      </tr>
      <tr>
       <td colspan=3>CacheCleanupInterval</td>
       <td colspan=2>Cache cleanup interval (s)</td>
       <td>int</td>
       <td>300</td>
      </tr>
     </tbody>
    </table>peName: 2 (将传入的 Key 前缀设置为数据类型的名称)
* TypeAlias: 3 (将传入的 Key 前缀设置为数据类型的别名)

### Redis配置信息

在MASA Framework中，我们使用 Redis 作为缓存组件的存储介质。以下是 Redis 配置信息的说明：

* Host: Redis 服务器的 IP 地址。
* Port: Redis 服务器的端口号。默认为 6379。

注意：以上信息可以根据实际情况进行修改。KeyTypeEnum.None
        };
    });
});
```

2. 注册分布式缓存时指定`CacheKeyType`为`PeName`

注册分布式缓存指定的 `CacheKeyType` 为 PeName，即使用默认的缓存 Key 规则，缓存 Key 由缓存值的类型与传入缓存 Key 组合而成。

```csharp Program.cs
builder.Services.AddDistributedCache(distributedCacheOptions =>
{
    distributedCacheOptions.UseStackExchangeRedisCache(options =>
    {
        options.Servers = new List<RedisServerOptions>()
        {
            new("localhost", 6379)
        };
        options.DefaultDatabase = 3;
        options.ConnectionPoolSize = 10;
        options.GlobalCacheOptions = new CacheOptions()
        {
            CacheKeyType = CacheKeyTypeEnum.PeName
        };
    });
});
```

3. 注册分布式缓存时指定`CacheKeyType`为`TypeAlias`

注册分布式缓存指定的 `CacheKeyType` 为 TypeAlias，即使用 TypeName 的升级版，为每个 TypeName 指定别名，缩减最后形成的缓存 Key 长度。

```csharp Program.cs
builder.Services.AddDistributedCache(distributedCacheOptions =>
{
    distributedCacheOptions.UseStackExchangeRedisCache(options =>
    {
        options.Servers = new List<RedisServerOptions>()
        {
            new("localhost", 6379)
        };
        options.DefaultDatabase = 3;
        options.ConnectionPoolSize = 10;
        options.GlobalCacheOptions = new CacheOptions()
        {
            CacheKeyType = CacheKeyTypeEnum.TypeAlias
        };
    });
});
```tamp.FromMinutes(30);
        //设置滑动过期，即每次访问后重新计算过期时间，保证缓存不会过早失效
        redisOptions.SlidingExpiration = TimeSpan.FromMinutes(5);
    });
});
```

#### 使用分布式锁
```csharp Program.cs
app.MapGet("/get/{id}", async (IDistributedCacheClient distributedCacheClient, string id) =>
{
    //使用分布式锁，避免缓存击穿
    using var distributedLock = await distributedCacheClient.CreateLockAsync(id);
    if (await distributedLock.TryAcquireAsync())
    {
        var value = await distributedCacheClient.GetAsync<User>(id);
        if (value != null)
        {
            return Results.Ok(value);
        }
        else
        {
            //缓存中不存在，从数据库中获取数据
            var user = await _userService.GetUserAsync(id);
            if (user != null)
            {
                //将数据存入缓存
                await distributedCacheClient.SetAsync(id, user);
                return Results.Ok(user);
            }
            else
            {
                return Results.NotFound();
            }
        }
    }
    else
    {
        //获取锁失败，等待一段时间后重试
        await Task.Delay(100);
        return await distributedCacheClient.GetAsync<User>(id);
    }
});
```

#### 使用多级缓存
```csharp Program.cs
builder.Services.AddDistributedCache(opt =>
{
    opt.UseStackExchangeRedisCache(redisOptions =>
    {
        redisOptions.Servers = new List<RedisServerOptions>()
        {
            new("localhost", 6379)
        };
    });
    //添加内存缓存
    opt.UseMemoryCache();
});

app.MapGet("/get/{id}", async (IDistributedCacheClient distributedCacheClient, string id) =>
{
    var value = await distributedCacheClient.GetAsync<User>(id, options =>
    {
        //设置缓存优先级为 Memory，即先从内存缓存中获取数据，如果不存在再从 Redis 中获取
        options.CachePriority = CachePriority.Memory;
    });
    if (value != null)
    {
        return Results.Ok(value);
    }
    else
    {
        //缓存中不存在，从数据库中获取数据
        var user = await _userService.GetUserAsync(id);
        if (user != null)
        {
            //将数据存入缓存
            await distributedCacheClient.SetAsync(id, user);
            return Results.Ok(user);
        }
        else
        {
            return Results.NotFound();
        }
    }
});
```pan.FromMinutes(30);
        // Set the sliding expiration time to 10 minutes. If the cache key is accessed within 10 minutes, it will continue to be extended for another 10 minutes (until it reaches the absolute expiration time and is deleted). If the cache key is not accessed within 10 minutes, it will be removed.
        redisOptions.SlidingExpiration= TimeSpan.FromMinutes(10);
    });
});
```

#### Using PubSub

Distributed caching also provides Pub/Sub functionality. If our system requires lightweight publish-subscribe, then we can consider using it.

> There is a possibility of message loss in the Pub/Sub functionality of distributed caching. If a message is published without any subscribers, the message will be lost.

```csharp
[ApiController]
[Route("[controller]/[action]")]
public class HomeController : ControllerBase
{
    private readonly IDistributedCacheClient _distributedCacheClient;
    public HomeController(IDistributedCacheClient distributedCacheClient) => _distributedCacheClient = distributedCacheClient;

    [HttpGet]
    public async Task StartSubscribe()
    {
        await _distributedCacheClient.SubscribeAsync<string>("channel", opt =>
        {
            Console.WriteLine($"Data has changed: {opt.Value}");
        });
    }

    [HttpPost]
    /learn.microsoft.com/zh-cn/dotnet/api/system.datetime.ticks?view=net-6.0) | 自上次访问时间开始的计时周期数 (1周期 = 100ns 即 1/10000 ms) | -1 为不启用滑动过期 |
|   value   | 缓存的值 | 缓存的实际值 | - |
|   version   | 缓存的版本号 | 缓存的版本号，用于实现缓存更新 | - |

### 发布订阅原理

MASA Framework 的分布式缓存是通过 Redis 的发布订阅机制实现的。当缓存更新时，会通过 Redis 的 `PUBLISH` 命令向指定的频道发布消息，订阅该频道的客户端会收到该消息并更新本地缓存。

在代码中，`Publish` 方法会调用 `_distributedCacheClient` 的 `PublishAsync` 方法，该方法会向 Redis 的 `channel` 频道发布消息，消息内容包括新的缓存值、缓存键和操作类型。订阅该频道的客户端会收到该消息并根据操作类型更新本地缓存。

## Conclusion

以上就是 MASA Framework 分布式缓存的实现原理，通过滑动过期和发布订阅机制，实现了高效、可靠的分布式缓存。| Property | Description | Default Value |
| --- | --- | --- |
| key | The key of the cached data | N/A |
| slidingExpiration | The time interval between the last access to the cached data and its expiration, represented in the number of ticks (1 tick = 100ns or 1/10000 ms). The sliding expiration time will be refreshed every time the data is accessed. Set to -1 for never expiring. | -1 |
| data | The cached data | N/A |

### Content Compression Rules

In MASA Framework's distributed cache, we compress the data for storage. However, please note the following:

1. Data will not be compressed if the value type is any of the following:

* Byte
* SByte
* UInt16
* UInt32
* UInt64
* Int16
* Int32
* Int64
* Double
* Single
* Decimal

2. Data will be compressed if the value type is a string.
3. For all other value types, the data will be serialized and then compressed.