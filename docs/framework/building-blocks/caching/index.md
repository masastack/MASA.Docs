---
title: 缓存
date: 2022/11/17
---

## 概念

什么是缓存，在项目中，为了提高数据的读取速度，我们会对不经常变更但访问频繁的数据做缓存处理

## 功能列表

* 分布式缓存: [IDistributedCacheClient](#IDistributedCacheClient)
    * [Redis 缓存](../../contribs/cache/stackexchange-redis.md): 基于[StackExchange.Redis](https://github.com/StackExchange/StackExchange.Redis)实现的分布式缓存
* [多级缓存](../../contribs/cache/multilevel-cache.md): [IMultilevelCacheClient](#IMultilevelCacheClient), 基于内存缓存与分布式缓存实现的多级缓存

## 使用

以`StackExchange.Redis`为例:

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

``` C#
builder.Services.AddDistributedCache(distributedCacheOptions =>
{
    distributedCacheOptions.UseStackExchangeRedisCache();//使用分布式Redis缓存, 默认使用本地`RedisConfig`节点的配置
});
```

4. 新建`User`类，用于接收、存储用户信息使用

``` C#
public class User
{
    public string Name { get; set; }

    public int Age { get; set; }
}
```

5. 如何使用IDistributedCacheClient，修改Program.cs

仅当`name`为`string.Empty`或者当前项目仅存在一个分布式缓存客户端时, 可直接由DI获取，否则需要通过`IDistributedCacheClientFactory` (分布式缓存工厂) 根据`name`获取

* 设置缓存

``` C#
app.MapPost("/set/{id}", async (IDistributedCacheClient distributedCacheClient, [FromRoute] string id, [FromBody] User user) =>
{
    await distributedCacheClient.SetAsync(id, user);
    return Results.Accepted();
});

* 获取缓存

``` C#
app.MapGet("/get/{id}", async (IDistributedCacheClient distributedCacheClient, [FromRoute] string id) =>
{
    var value = await distributedCacheClient.GetAsync<User>(id);
    return Results.Ok(value);
});
```

## 规则

### 缓存Key规则

* None: 1 (不处理)
* TypeName: 2 (由缓存值的类型与传入缓存Key组合而成 **默认**)
    * 实际的缓存Key = $"{GetTypeName(T)}.{传入缓存Key}"
* TypeAlias: 3 (TypeName的升级版, 为每个TypeName指定`别名`, 缩减最后形成的`缓存Key`长度)
    * 实际的缓存Key = ${TypeAliasName}{:}{key}

### 缓存Key规则优先级

自定义规则 > 全局缓存Key规则

1. 注册分布式缓存时指定`CacheKeyType`为`None`

注册分布式缓存指定的`CacheKeyType`为全局缓存Key规则, 设置使用当前分布式缓存客户端时, 默认传入的缓存key即为最终的缓存Key

``` C#
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

2. 为当前调用使用指定缓存Key规则
 
``` C#
var value = await distributedCacheClient.GetAsync<User>(id, options =>
{
    options.CacheKeyType = CacheKeyType.TypeName;
});
```

> 虽然设置了全局缓存Key规则为`None`, 但由于当前方法指定了缓存Key规则, 则当前方法使用的全局缓存Key为: TypeName, 即最终的缓存Key为: $"{GetTypeName(T)}.{传入缓存Key}"

## 源码解读

### IDistributedCacheClient

分布式缓存客户端

<!-- 以下方法会根据全局缓存Key的规则配置以及传入缓存Key的规则配置，检测是否需要格式化缓存Key，对需要格式化Key的操作按照缓存Key格式化规则进行处理，[详细查看](#缓存Key的生成规则):  -->
::: tip 提示
* 分布式缓存中实际的缓存Key与传入的缓存Key不一定是相同的
    * 泛型方法以及HashIncrementAsync、HashDecrementAsync方法的实际缓存Key是需要经过格式化得到
    * 非泛型方法的实际缓存Key与传入的缓存Key一致
:::

① 需要重新计算缓存Key的方法

* `Get<T>`、`GetAsync<T>`: 根据缓存Key返回类型为`T`的结果 (如果缓存不存在，则返回Null)
* `GetList<T>`、`GetListAsync<T>`: 根据缓存Key集合返回对应的缓存值的集合 (针对不存在的缓存key，其值返回Null)
* `GetOrSet<T>`、`GetOrSetAsync<T>`: 如果在缓存中找到，则返回类型为`T`的结果，如果缓存未找到，则执行`Setter`，并返回`Setter`的结果
* `Set<T>`、`SetAsync<T>`: 将指定的缓存Key以及缓存值添加到缓存
* `SetList<T>`、`SetListAsync<T>`: 将指定的缓存Key、Value集合添加缓存
* `Remove<T>`、`RemoveAsync<T>`: 将指定的缓存Key (缓存Key集合) 从缓存中移除
* `Refresh<T>`、`RefreshAsync<T>`: 刷新指定的缓存Key (缓存Key集合) 的生命周期
  * 适用于未被删除、绝对过期时间没有到，但相对过期时间快到的缓存 (延长滑动过期时间)
* `Exists<T>`、`ExistsAsync<T>`: 如果在缓存中找到，则返回true，否则返回false
* `GetKeys<T>`、`GetKeysAsync<T>`: 根据key pattern 得到符合规则的所有缓存Key
* `GetByKeyPattern<T>`、`GetByKeyPatternAsync<T>`: 根据key pattern 得到符合规则的所有缓存Key、Value集合
* `HashIncrementAsync`: 将指定的缓存Key的值增加Value，并返回增长后的结果
* `HashDecrementAsync`: 将指定的缓存Key的值减少Value，并返回减少后的结果
  * 支持设置最小的Value，避免减少后的值低于设置的最小值，执行失败则返回: -1
* `KeyExpire<T>`、`KeyExpireAsync<T>`: 设置缓存Key的生命周期

② 传入缓存Key即为实际缓存Key的方法

* `Remove`、`RemoveAsync`: 将指定的缓存Key (缓存Key集合) 从缓存中移除
* `Refresh`、`RefreshAsync`: 刷新指定的缓存Key (缓存Key集合) 的生命周期
  * 适用于未被删除、绝对过期时间没有到，但相对过期时间快到的缓存
* `Exists`、`ExistsAsync`: 如果在缓存中找到，则返回true，否则返回false
* `GetKeys`、`GetKeysAsync`: 根据key pattern 得到符合规则的所有缓存Key
  * 例: 传入User*，可得到缓存中以User开头的所有缓存Key
* `KeyExpire`、`KeyExpireAsync`: 设置缓存Key的生命周期

### IMultilevelCacheClient

多级缓存客户端, 基于分布式缓存以及内存缓存组合而成, 当触发`Set`、`Remove`方法后

> 本机内存缓存更新 -> 分布式缓存更新 -> 其它副本内存缓存更新

* `Get<T>`、`GetAsync<T>`: 根据缓存Key返回类型为`T`的结果 (如果缓存不存在，则返回Null) (支持监控缓存变更)
* `GetList<T>`、`GetListAsync<T>`: 根据缓存Key集合返回对应的缓存值的集合 (针对不存在的缓存key，其值返回Null)
* `GetOrSet<T>`、`GetOrSetAsync<T>`: 如果在缓存中找到，则返回类型为`T`的结果，如果缓存未找到，则执行`Setter`，并返回`Setter`的结果
* `Set<T>`、`SetAsync<T>`: 将指定的缓存Key以及缓存值添加到缓存
* `SetList<T>`、`SetListAsync<T>`: 将指定的缓存Key、Value集合添加缓存
* `Remove<T>`、`RemoveAsync<T>`: 将指定的缓存Key (缓存Key集合) 从缓存中移除
* `Refresh<T>`、`RefreshAsync<T>`: 刷新指定的缓存Key (缓存Key集合) 的生命周期
  * 适用于未被删除、绝对过期时间没有到，但相对过期时间快到的缓存 (延长滑动过期时间)

### IDistributedCacheClientFactory

分布式缓存工厂, 通过分布式缓存工厂根据`name`创建指定的`分布式缓存客户端`

* Create： 创建指定`name`的`分布式缓存客户端`

### IMultilevelCacheClientFactory

多级缓存工厂, 通过(多级缓存工厂根据`name`创建指定的`多级缓存客户端`

* Create: 返回指定`name`的`多级缓存客户端`