## 7. 多级缓存

随着业务的增长, 访问系统的用户越来越多, 直接读取数据库的性能也变得越来越差, IO读取出现瓶颈, 这个时候我们可以有两种选择:

* 使用IO读写更快的磁盘, 比如: 使用固态磁盘代替读写速度差一点的机械磁盘
  * 优点: 无需更改代码
  * 缺点: 读写速度更高的磁盘意味着更大的成本压力, 且提升是有限的

* 使用缓存技术代替直接读取数据库
  * 优点: 服务器硬件成本未上涨, 但可以带来十倍的性能提升
  * 缺点: 针对读大于写的场景更为实用, 不可用于复杂查询

而多级缓存是由分布式缓存与内存缓存的组合而成, 它可以给我们提供比分布式缓存更强的读取能力, 下面我们将使用[多级缓存](/framework/building-blocks/caching/multilevel-cache)技术, 用于提升获取`商品`详情的速度

### 必要条件

安装`Masa.Contrib.Caching.MultilevelCache`、`Masa.Contrib.Caching.Distributed.StackExchangeRedis`

```powershell
dotnet add package Masa.Contrib.Caching.MultilevelCache // 多级缓存提供者

dotnet add package Masa.Contrib.Caching.Distributed.StackExchangeRedis //分布式Redis缓存提供者
```

### 使用

1. 配置分布式Redis缓存配置信息, 修改`appsettings.json`

```appsettings.json
{
  "RedisConfig": {
    "Servers": [
      {
        "Host": "localhost",
        "Port": 6379
      }
    ],
    "DefaultDatabase": 0
  }
}
```

2. 配置多级缓存中内存缓存的配置信息, 修改`appsettings.json`

```appsettings.json
{
  "MultilevelCache": {
    "CacheEntryOptions": {
      "AbsoluteExpirationRelativeToNow": "72:00:00", //绝对过期时间（从当前时间算起）
      "SlidingExpiration": "00:05:00" //滑动到期时间（从当前时间开始）
    }
  }
}
```

3. 注册缓存, 修改`Program`

```csharp
builder.Services.AddMultilevelCache(distributedCacheOptions =>
{
    distributedCacheOptions.UseStackExchangeRedisCache();
});
```

分布式Redis缓存、多级缓存支持通过其它方式配置, 详细可参考[Redis文档](/framework/building-blocks/caching/stackexchange-redis), [多级缓存文档](/framework/building-blocks/caching/multilevel-cache) 

4. 重写`FindAsync`, 优先从缓存中获取数据, 缓存不存在时读取数据库

```csharp
public class CatalogItemRepository : Repository<CatalogDbContext, CatalogItem, Guid>, ICatalogItemRepository
{
    /// <summary>
    /// 使用多级缓存
    /// </summary>
    private readonly IMultilevelCacheClient _multilevelCacheClient;

    public CatalogItemRepository(CatalogDbContext context, IUnitOfWork unitOfWork, IMultilevelCacheClient multilevelCacheClient) : base(context, unitOfWork)
    {
        _multilevelCacheClient = multilevelCacheClient;
    }

    public override async Task<CatalogItem?> FindAsync(Guid id, CancellationToken cancellationToken = default)
    {
        TimeSpan? timeSpan = null;
        var catalogInfo = await _multilevelCacheClient.GetOrSetAsync(id.ToString(), () =>
        {
            //仅当内存缓存、Redis缓存都不存在时执行, 当db不存在时此数据将在5秒内被再次访问时将直接返回`null`, 如果db存在则写入`redis`, 写入内存缓存 (并设置滑动过期: 5分钟, 绝对过期时间: 3小时)
            var info = Context.Set<CatalogItem>()
                .Include(catalogItem => catalogItem.CatalogType)
                .Include(catalogItem => catalogItem.CatalogBrand)
                .AsSplitQuery()
                .FirstOrDefaultAsync(catalogItem => catalogItem.Id == id, cancellationToken).ConfigureAwait(false).GetAwaiter().GetResult();

            if (info != null)
                return new CacheEntry<CatalogItem>(info, TimeSpan.FromDays(3))
                {
                    SlidingExpiration = TimeSpan.FromMinutes(5)
                };

            timeSpan = TimeSpan.FromSeconds(5);
            return new CacheEntry<CatalogItem>(info);
        }, timeSpan == null ? null : new CacheEntryOptions(timeSpan));
        return catalogInfo;
    }
}
```

> 多级缓存与分布式缓存相比, 它有更高的性能, 对Redis集群的压力更小, 但当缓存更新时, 多级缓存会有1-2秒左右的刷新延迟, 详细可查看[文档](/framework/building-blocks/caching/multilevel-cache)