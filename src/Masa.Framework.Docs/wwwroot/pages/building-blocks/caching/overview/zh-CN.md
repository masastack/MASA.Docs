# Caching (缓存)

缓存是一种性能优化的技术，使用它可以显著提高应用性能，减少数据的读取速度。

## 什么场景适合使用缓存

缓存适用于读大于写的场景，针对不经常修改的数据，可通过使用缓存技术提高系统的性能

> 缓存的本质是通过空间换时间

## 缓存类型

我们将缓存分为以下两类:

* 内存缓存: Web服务器内存中的缓存, 重启项目会导致内存缓存丢失 [文档](https://learn.microsoft.com/zh-cn/aspnet/core/performance/caching/memory)

> 内存缓存虽然可以大幅度提升系统的性能, 但内存是很昂贵的, 因此存储到内存缓存的数据、时间也都需要仔细斟酌, 而并非越多越好

* 分布式缓存: 由多个应用服务器共享的缓存 [文档](https://learn.microsoft.com/zh-cn/aspnet/core/performance/caching/distributed)
  * 可伸缩性: 支持扩展
  * 高可用性: 跨多个区域使用缓存有助于提高缓存的可用性
  * 一致性: 数据在多个服务器的请求之间是一致的
  * 互不印象: 应用服务器重启不会造成缓存数据的丢失

## 缓存技术

`MASA Framework`提供了两种缓存方案:

* 分布式缓存: 定义了分布式缓存的抽象`IDistributedCacheClient`, 并提供了常用分布式缓存的实现
  * [Redis 缓存](https://www.nuget.org/packages/Masa.Contrib.Caching.Distributed.StackExchangeRedis): 基于[StackExchange.Redis](https://github.com/StackExchange/StackExchange.Redis)实现的分布式缓存 [查看详细](/framework/building-blocks/caching/stackexchange-redis)

* 多级缓存: 定义了多级缓存的抽象`IMultilevelCacheClient`, 并提供了基于内存缓存与分布式缓存的实现:
  * [多级缓存](https://www.nuget.org/packages/Masa.Contrib.Caching.MultilevelCache): 基于内存缓存与分布式缓存实现的多级缓存, 相比分布式缓存而言, 它减少了一次网络传入与反序列化的消耗, 具有更好的性能优势 [查看详细](/framework/building-blocks/caching/multilevel-cache)

> 多级缓存方案除了性能更高之外, 还实现了当缓存更新时, 其余复本的缓存也会同步更新, 不需要开发者介入完成缓存刷新

-----------------等待修改------------------

什么是缓存，在项目中，为了提高数据的读取速度，我们会对不经常变更但访问频繁的数据做缓存处理

## 功能列表

* 分布式缓存:
    * [Redis 缓存](https://www.nuget.org/packages/Masa.Contrib.Caching.Distributed.StackExchangeRedis): 基于[StackExchange.Redis](https://github.com/StackExchange/StackExchange.Redis)实现的分布式缓存 [查看详细](/framework/building-blocks/cache/stackexchange-redis)
* [多级缓存](https://www.nuget.org/packages/Masa.Contrib.Caching.MultilevelCache): 基于内存缓存与分布式缓存实现的多级缓存, 相比分布式缓存而言, 它减少了一次网络传入与反序列化的消耗, 具有更好的性能优势 [查看详细](/framework/building-blocks/cache/multilevel-cache)
* [内存缓存](https://www.nuget.org/packages/Masa.Utils.Caching.Memory): 提供了线程安全的字典集合 [查看详细](/framework/utils/caching/memory)

## 使用

以分布式缓存`StackExchange.Redis`为例:

1. 安装`Masa.Contrib.Caching.Distributed.StackExchangeRedis`

```shell 终端
dotnet add package Masa.Contrib.Caching.Distributed.StackExchangeRedis
```

2. 配置`Redis`信息, 修改`appsettings.json`

```json appsettings.json
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

3. 注册分布式缓存，并使用Redis缓存

```csharp Program.cs
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

5. 如何使用IDistributedCacheClient

仅当`name`为`string.Empty`或者当前项目仅存在一个分布式缓存客户端时, 可直接由DI获取，否则需要通过`IDistributedCacheClientFactory` (分布式缓存工厂) 根据`name`获取

* 设置缓存

```csharp Program.cs
app.MapPost("/set/{id}", async (IDistributedCacheClient distributedCacheClient, [FromRoute] string id, [FromBody] User user) =>
{
    await distributedCacheClient.SetAsync(id, user);
    return Results.Accepted();
});
```

* 获取缓存

```csharp Program.cs
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
            CacheKeyType = CacheKeyType.None //可以全局禁用缓存Key格式化处理
        };
    });
});
```

2. 为当前调用使用指定缓存Key规则
 
```csharp Program.cs
app.MapGet("/get/{id}", async (IDistributedCacheClient distributedCacheClient, string id) =>
{
    var value = await distributedCacheClient.GetAsync<User>(id, options =>
    {
        options.CacheKeyType = CacheKeyType.TypeName;
    });
    return Results.Ok(value);
});
```

> 虽然设置了全局缓存Key规则为`None`, 但由于当前方法指定了缓存Key规则, 则当前方法使用的全局缓存Key为: TypeName, 即最终的缓存Key为: $"{GetTypeName(T)}.{传入缓存Key}"

## 源码解读

### 分布式缓存客户端

`IDistributedCacheClient`被用来管理分布式缓存, 它提供了以下方法: 

> 分布式缓存中实际执行的缓存Key与传入的缓存Key不一定是相同的, 它受到全局配置的`CacheKeyType`以及当前方法传入`CacheKeyType`以及缓存Key三者共同决定 [查看规则](#缓存Key规则优先级)

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

### 多级缓存客户端

`IMultilevelCacheClient`被用来管理多级缓存, 它提供了以下方法: 

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

### 分布式缓存工厂

`IDistributedCacheClientFactory`被用来创建指定`name`的分布式缓存客户端, 它提供了以下方法: 

* Create： 创建指定`name`的`分布式缓存客户端`

### 多级缓存工厂

`IMultilevelCacheClientFactory`被用来创建指定`name`的多级缓存缓存客户端, 它提供了以下方法: 

* Create: 返回指定`name`的`多级缓存客户端`