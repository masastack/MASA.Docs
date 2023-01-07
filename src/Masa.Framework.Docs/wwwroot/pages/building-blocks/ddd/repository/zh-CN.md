## 仓储

屏蔽业务逻辑和持久化基础设施的差异, 针对不同的存储设施, 会有不同的实现方式, 但这些不会对我们的业务产生影响, 它是领域驱动设计的一部分, 我们仅会提供针对`聚合根`做简单的增删改查操作, 而并非针对`单个表`, 我们可以在构造函数中注入`IRepository<TEntity, TKey>`使用框架提供的对聚合根的基础操作

``` c#
public class ProductCommandHandler
{
    private readonly IRepository<CatalogItem, int> _repository;

    public ProductCommandHandler(IRepository<CatalogItem, int> repository)
    {
        _repository = repository;
    }

    [EventHandler]
    public async Task CreateHandleAsync(CreateProductCommand command)
    {
        var catalogItem = new CatalogItem(
            command.CatalogBrandId, 
            command.CatalogTypeId, 
            command.Name,
            command.Description,
            PictureFileName = command.PictureFileName ?? "default.png",
            command.Price);
        await _repository.AddAsync(catalogItem);
    }
}
```

或者新建自定义`ICatalogItemRepository`接口并继承`IRepository<TEntity, TKey>`, 例如:

```c#
public interface ICatalogItemRepository: IRepository<CatalogItem, int>
{

}

public class CatalogItemRepository: Repository<CatalogDbContext, CatalogItem, Guid>, ICatalogItemRepository
{
    public CatalogItemRepository(CatalogDbContext context, IUnitOfWork unitOfWork) 
        : base(context, unitOfWork)
    {
    }
}
```

由于一些特殊的原因, 我们解除了对非聚合根的限制, 使得它们也可以使用`IRepository`, 但这个是错误的, 后续版本仍然会增加限制, 届时`IRepository`将只允许对聚合根进行操作

## 原理剖析

* 为何自定义仓储不需要注册就可以直接使用?

基于`约定大于配置`, 我们约定好继承`IRepository<TEntity, TKey>`的接口属于自定义仓储, 它是针对默认仓储的扩展, 我们会在项目启动时找到自定义仓储接口以及对应的实现进行注册, 如果出现自定义仓储未注册的情况, 则需要检查以下两点:

1. 仓储锁使用的类是否属于实体

例如: `ICatalogItemRepository`提示未注册, 则需要检查`CatalogItem`是否继承`IEntity`, 只有实体才可以使用仓储, 后续会调整为只有聚合根才支持仓储

2. 指定实体、自定义仓储所在程序集

框架完成仓储的自动注册是通过查询实体以及自定义仓储的接口以及实现完成的, 而获取自定义仓储接口以及自定义仓储的实现需要通过获取其所在程序集后利用反射获取, 但默认程序集使用的是全局配置中的程序集, 查看全局配置[文档](/framework/building-blocks/data/global-configuration)

我们可以通过修改全局配置中的程序集或者指定自定义仓储的程序集来修复自定义仓储的注册问题

* 为当前领域以及仓储指定程序集

```csharp
var assemblies = new[] { typeof(CatalogItem).Assembly };

builder.Services.AddDomainEventBus(assemblies, options =>
{
    options.UseRepository<CatalogDbContext>();
});
```

* 更改全局默认程序集

```csharp
var assemblies = AppDomain.CurrentDomain.GetAssemblies().ToList();
assemblies.Add(typeof(CatalogItem).Assembly);
MasaApp.SetAssemblies(assemblies);
```