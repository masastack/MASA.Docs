---
title: 缓存 - 多级缓存
date: 2022/11/17
---

## 概念

基于内存缓存与分布式缓存实现的, 通过使用多级缓存, 可以降低请求穿透到分布式缓存, 减少网络消耗以及序列化带来的性能影响, 使用它可以大大缩减响应时间

它支持分布式部署, 当配置发生更新或者删除后, 其它副本也会随之更新或者删除, [查看原因](#同步更新)

## 使用

使用多级缓存需要安装`Masa.Contrib.Caching.MultilevelCache`和任意一个分布式缓存提供者 (例: [Masa.Contrib.Caching.Distributed.StackExchangeRedis](./stackexchange-redis.md))才可以

1. 安装`Masa.Contrib.Caching.MultilevelCache`、`Masa.Contrib.Caching.Distributed.StackExchangeRedis`

``` powershell
dotnet add package Masa.Contrib.Caching.MultilevelCache
dotnet add package Masa.Contrib.Caching.Distributed.StackExchangeRedis
```

2. 注册多级缓存，并使用[`分布式Redis缓存`](./stackexchange-redis.md)，修改`Program.cs`

``` C#
//注册多级缓存
builder.Services.AddMultilevelCache(distributedCacheOptions =>
{
    distributedCacheOptions.UseStackExchangeRedisCache();//使用分布式Redis缓存, 默认localhost:6379
});
```

3. 新建`User`类，用于接收、存储用户信息使用

``` C#
public class User
{
    public string Name { get; set; }

    public int Age { get; set; }
}
```

4. 如何使用`IMultilevelCacheClient`，修改`Program.cs`

``` C#
// 设置缓存
app.MapPost("/set/{id}", async (IMultilevelCacheClient multilevelCacheClient, [FromRoute] string id, [FromBody] User user) =>
{
    await multilevelCacheClient.SetAsync(id, user);
    return Results.Accepted();
});

// 获取缓存
app.MapGet("/get/{id}", async (IMultilevelCacheClient multilevelCacheClient, [FromRoute] string id) =>
{
    var value = await multilevelCacheClient.GetAsync<User>(id);
    return Results.Ok(value);
});
```

> 当项目中仅存在一个多级缓存客户端或者注册多级缓存时未指定`name`时可直接使用`IMultilevelCacheClient`, 否则需要通过`IMultilevelCacheClientFactory`的`Create`方法创建指定`name`的`IMultilevelCacheClient`

## 配置

<table style='border-collapse: collapse;table-layout:fixed;width=100%'>
 <col span=6>
 <tr style="background-color:#f3f4f5; font-weight: bold">
  <td colspan=3>参数名</td>
  <td colspan=2>参数描述</td>
  <td>类型</td>
  <td>默认值</td>
 </tr>
 <tr>
  <td colspan=3>SubscribeKeyType</td>
  <td colspan=2>订阅Key规则 (生成订阅Channel)</td>
  <td><a href="https://github.com/masastack/MASA.Framework/blob/0.7.0/src/BuildingBlocks/Caching/Masa.BuildingBlocks.Caching/Enumerations/SubscribeKeyType.cs">Enum</a></td>
  <td>2</td>
 </tr>
 <tr>
  <td colspan=3>SubscribeKeyPrefix</td>
  <td colspan=2>订阅Key前缀 (生成订阅Channel)</td>
  <td>string</td>
  <td>空字符串</td>
 </tr>
 <tr>
  <td colspan=3>CacheEntryOptions</td>
  <td colspan=2>内存缓存有效期</td>
  <td><a href="https://github.com/masastack/MASA.Framework/blob/0.7.0/src/Contrib/Caching/Masa.Contrib.Caching.MultilevelCache/Options/MultilevelCacheOptions.cs">object</a></td>
  <td></td>
 </tr>

<tr>
  <td rowspan=12></td>
  <td colspan=2>AbsoluteExpiration</td>
  <td colspan=2>绝对过期时间</td>
  <td>DateTimeOffset?</td>
  <td>null (永不过期)</td>
 </tr>
 <tr>
  <td colspan=2>AbsoluteExpirationRelativeToNow</td>
  <td colspan=2>相对于现在的绝对到期时间 (与AbsoluteExpiration共存时，优先使用AbsoluteExpirationRelativeToNow)</td>
  <td>TimeSpan?</td>
  <td>null (永不过期)</td>
 </tr>
 <tr>
  <td colspan=2>SlidingExpiration</td>
  <td colspan=2>滑动过期时间</td>
  <td>TimeSpan?</td>
  <td>null (永不过期)</td>
 </tr>
</table>

## 高阶用法

### 注册多级缓存

#### 通过本地配置文件注册

:::: code-group
::: code-group-item 1. 修改`appsettings.json`文件
``` appsettings.json
{
  // 多级缓存全局配置，非必填
  "MultilevelCache": {
    "SubscribeKeyPrefix": "masa",//默认订阅方key前缀，用于拼接channel
    "SubscribeKeyType": 3, //默认订阅方key的类型，默认ValueTypeFullNameAndKey，用于拼接channel
    "CacheEntryOptions": {
      "AbsoluteExpirationRelativeToNow": "00:00:30",//绝对过期时长（距当前时间）
      "SlidingExpiration": "00:00:50"//滑动过期时长（距当前时间）
    }
  },

  // Redis分布式缓存配置
  "RedisConfig": {
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
::: code-group-item 2. 添加多级缓存并使用分布式Redis缓存
``` C#
builder.Services.AddMultilevelCache(distributedCacheOptions =>
{
    distributedCacheOptions.UseStackExchangeRedisCache();
});
```
:::
::::

#### 手动指定配置

使用默认配置, 并指定Redis配置信息

:::: code-group
::: code-group-item 1. 添加多级缓存并使用分布式Redis缓存
``` C#
builder.Services.AddMultilevelCache(distributedCacheOptions =>
{
    distributedCacheOptions.UseStackExchangeRedisCache(RedisConfigurationOptions);
});
```
:::
::::

#### 选项模式

:::: code-group
::: code-group-item 1. 支持选项模式
``` C#
builder.Services.Configure<MultilevelCacheOptions>(options =>
{
    options.SubscribeKeyType = SubscribeKeyType.ValueTypeFullNameAndKey;
});
```
:::
::: code-group-item 2. 添加多级缓存并使用分布式Redis缓存
``` C#
builder.Services.AddMultilevelCache(distributedCacheOptions =>
{
    distributedCacheOptions.UseStackExchangeRedisCache(RedisConfigurationOptions);
});
```
:::
::::

> 除此之外我们还可以借助 [`MasaConfiguration`](../../building-blocks/configuration/index.md) 完成选项模式支持

## 原理剖析

### 同步更新

为何多级缓存可以实现缓存发生更新后, 其它副本会随之更新, 而不需要等待缓存失效后重新加载? 

多级缓存中使用了分布式缓存提供的Pub/Sub能力

![Multilevel.png](https://s2.loli.net/2022/11/17/W5AgTiX9LOjyGza.png)