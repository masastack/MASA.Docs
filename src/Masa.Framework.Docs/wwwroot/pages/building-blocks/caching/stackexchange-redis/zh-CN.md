## 分布式Redis缓存

什么是[`分布式缓存`](https://learn.microsoft.com/zh-cn/aspnet/core/performance/caching/distributed)

## 使用

1. 安装`Masa.Contrib.Caching.Distributed.StackExchangeRedis`

``` powershell
dotnet add package Masa.Contrib.Caching.Distributed.StackExchangeRedis
```

2. 配置`Redis`信息, 修改`appsettings.json`

``` appsettings.json
{
    "RedisConfig":{
        "Servers":[
            {
                "Host":"localhost",
                "Port":6379
            }
        ],
        "DefaultDatabase":3,
        "ConnectionPoolSize":10
    }
}
```

3. 注册分布式缓存，并使用Redis缓存，修改`Program.cs`

```csharp
builder.Services.AddDistributedCache(distributedCacheOptions =>
{
    distributedCacheOptions.UseStackExchangeRedisCache();//使用分布式Redis缓存, 默认使用本地`RedisConfig`节点的配置
});
```

4. 新建`User`类，用于接收、存储用户信息使用

```csharp
public class User
{
    public string Name { get; set; }

    public int Age { get; set; }
}
```

5. 如何使用IDistributedCacheClient，修改Program.cs

仅当`name`为`string.Empty`或者当前项目仅存在一个分布式缓存客户端时, 可直接由DI获取，否则需要通过`IDistributedCacheClientFactory` (分布式缓存工厂) 根据`name`获取

* 设置缓存

```csharp
app.MapPost("/set/{id}", async (IDistributedCacheClient distributedCacheClient, [FromRoute] string id, [FromBody] User user) =>
{
    await distributedCacheClient.SetAsync(id, user);
    return Results.Accepted();
});

* 获取缓存

```csharp
app.MapGet("/get/{id}", async (IDistributedCacheClient distributedCacheClient, [FromRoute] string id) =>
{
    var value = await distributedCacheClient.GetAsync<User>(id);
    return Results.Ok(value);
});
```

## 配置

<div class="custom-table">
  <table style='border-collapse: collapse;table-layout:fixed;width:100%'>
   <col span=6>
   <tr style="background-color:#f3f4f5; font-weight: bold">
    <td colspan=3>参数名</td>
    <td colspan=2>参数描述</td>
    <td>类型</td>
    <td>默认值</td>
   </tr>
   <tr>
    <td colspan=3>AbsoluteExpiration</td>
    <td colspan=2>绝对过期时间</td>
    <td>DateTimeOffset?</td>
    <td>null (永不过期)</td>
   </tr>
   <tr>
    <td colspan=3>AbsoluteExpirationRelativeToNow</td>
    <td colspan=2>相对于现在的绝对到期时间 (与AbsoluteExpiration共存时，优先使用AbsoluteExpirationRelativeToNow)</td>
    <td>TimeSpan?</td>
    <td>null (永不过期)</td>
   </tr>
   <tr>
    <td colspan=3>SlidingExpiration</td>
    <td colspan=2>滑动过期时间</td>
    <td>TimeSpan?</td>
    <td>null (永不过期)</td>
   </tr>
   <tr>
    <td colspan=3>AbortOnConnectFail</td>
    <td colspan=2>是否应通过 TimeoutException 显式通知连接/配置超时</td>
    <td>bool</td>
    <td>false</td>
   </tr>
   <tr>
    <td colspan=3>AllowAdmin</td>
    <td colspan=2>是否应允许管理操作</td>
    <td>bool</td>
    <td>false</td>
   </tr>
   <tr>
    <td colspan=3>AsyncTimeout</td>
    <td colspan=2>允许异步操作的时间 (ms)</td>
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
    <td colspan=2>链接重试</td>
    <td>int</td>
    <td>3</td>
   </tr>
   <tr>
    <td colspan=3>ConnectTimeout</td>
    <td colspan=2>链接超时 (ms)</td>
    <td>int</td>
    <td>5000</td>
   </tr>
   <tr>
    <td colspan=3>DefaultDatabase</td>
    <td colspan=2>默认数据库</td>
    <td>int</td>
    <td>0</td>
   </tr>
   <tr>
    <td colspan=3>Password</td>
    <td colspan=2>密码</td>
    <td>string</td>
    <td>空字符串</td>
   </tr>
   <tr>
    <td colspan=3>Proxy</td>
    <td colspan=2>代理</td>
    <td>Enum</td>
    <td>0</td>
   </tr>
   <tr>
    <td colspan=3>Ssl</td>
    <td colspan=2>是否应加密连接</td>
    <td>bool</td>
    <td>false</td>
   </tr>
   <tr>
    <td colspan=3>SyncTimeout</td>
    <td colspan=2>允许同步操作的时间 (ms)</td>
    <td>int</td>
    <td>5000</td>
   </tr>
   <tr>
    <td colspan=3>Servers（redis 配置集合）</td>
    <td colspan=2>Redis配置信息</td>
    <td> </td>
   </tr>
   <tr>
    <td rowspan=12></td>
    <td colspan=2>Host</td>
    <td colspan=2>ip地址</td>
    <td>string</td>
    <td>localhost</td>
   </tr>
   <tr>
    <td colspan=2>Port</td>
    <td colspan=2>端口</td>
    <td>int</td>
    <td>6379</td>
   </tr>
  </table>
</div>

## 高阶用法

### 注册分布式Redis缓存

分布式Redis缓存客户端的Redis配置源是: `IOptionsMonitor<RedisConfigurationOptions>`, 我们可以通过很多办法来设置Redis的配置源信息, 但不论是哪种方法, 从根本来讲, 它们只是设置源的方式不同

#### 通过本地配置文件注册

在指定的本地配置文件中的指定节点配置Redis信息, 完成注册

:::: code-group
::: code-group-item 1. 修改`appsettings.json`文件
``` appsettings.json
{
    "RedisConfig":{
        "Servers":[
            {
                "Host":"localhost",
                "Port":6379
            }
        ],
        "DefaultDatabase":3,
        "ConnectionPoolSize":10
    }
}
```
:::
::: code-group-item 2. 注册分布式Redis缓存
```csharp
builder.Services.AddDistributedCache(distributedCacheOptions =>
{
    distributedCacheOptions.UseStackExchangeRedisCache();
});
```
:::
::::

> 如果本地配置的指定节点下不存在Redis配置, 则仍然尝试从`IOptionsMonitor<RedisConfigurationOptions>`获取, 如果获取失败则使用`localhost:6379`

#### 指定Redis配置注册

:::: code-group
::: code-group-item 注册分布式Redis缓存
```csharp
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
            CacheKeyType = CacheKeyType.None //可以全局禁用缓存Key格式化处理
        };
    });
});
```
:::
::::

#### 通过指定`Configuration`注册

:::: code-group
::: code-group-item 1. 修改`appsettings.json`
``` appsettings.json
{
    "RedisConfig":{
        "Servers":[
            {
                "Host": "localhost",
                "Port": 6379
            }
        ],
        "DefaultDatabase": 3,
        "ConnectionPoolSize": 10
    }
}
```
:::
::: code-group-item 2. 指定`Configuration`注册分布式Redis缓存
```csharp
builder.Services.AddDistributedCache(distributedCacheOptions =>
{
    distributedCacheOptions.UseStackExchangeRedisCache(builder.Configuration.GetSection("RedisConfig"));
});
```
:::
::::

#### 通过选项模式注册

:::: code-group
::: code-group-item 1. 支持选项模式
```csharp
builder.Services.Configure<RedisConfigurationOptions>(redisConfigurationOptions =>
{
    redisConfigurationOptions.Servers = new List<RedisServerOptions>()
    {
        new("localhost", 6379)
    };
    redisConfigurationOptions.DefaultDatabase = 3;
    redisConfigurationOptions.ConnectionPoolSize = 10;
    redisConfigurationOptions.GlobalCacheOptions = new CacheOptions()
    {
        CacheKeyType = CacheKeyType.None
    };
});
```
:::
::: code-group-item 2. 注册分布式Redis缓存
```csharp
builder.Services.AddDistributedCache(distributedCacheOptions =>
{
    distributedCacheOptions.UseStackExchangeRedisCache();
});
```
:::
::::

> 除此之外我们还可以借助 [`MasaConfiguration`](../../building-blocks/configuration/index.md) 完成选项模式支持

## 原理剖析

### 滑动过期

Redis缓存仅支持绝对过期, 即通过`EXPIRE`为给定`Key`设置过期时间 (以秒为单位), 那怎么使得它支持滑动过期的呢?

1. 数据类型改为`Hash`类型
2. 将绝对过期时间与滑动过期时间存储
3. 每次获取数据时会根据绝对过期时间与相对过期时间取最小值, 并通过`EXPIRE`为给定`Key`设置过期时间

因此当缓存超过设置的滑动过期时间后, 缓存会被删除, 当在滑动过期时间内时, 会重新计算过期时间并更新

<div class="custom-table">

|  Hash 字段   | 描述  | 详细  | 特殊 |
|  ----  | ----  | ----  | ----  |
|   absexp    | 绝对过期时间的[Ticks](https://learn.microsoft.com/zh-cn/dotnet/api/system.datetime.ticks?view=net-6.0) | 自公历 `0001-01-01 00:00:00:000` 到绝对过期时间的计时周期数 (1周期 = 100ns 即 1/10000 ms) | -1 为永不过期 |
|   sldexp   | 滑动过期时间的[Ticks](https://learn.microsoft.com/zh-cn/dotnet/api/system.datetime.ticks?view=net-6.0)  |  自公历 `0001-01-01 00:00:00:000` 到滑动过期时间的计时周期数 (1周期 = 100ns 即 1/10000 ms，每次获取数据时会刷新滑动过期时间) | -1 为永不过期 |
|   data   | 数据 | 存储用户设置的缓存数据 |

</div>

### 内容压缩规则

1. 当存储值类型为以下类型时，不对数据进行压缩：

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

2. 当存储值类型为字符串时，对数据进行压缩
3. 当存储值类型不满足以上条件时，对数据进行序列化并进行压缩