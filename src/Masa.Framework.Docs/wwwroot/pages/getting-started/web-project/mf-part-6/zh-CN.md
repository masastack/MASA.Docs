## 6. 应用服务层

新建`Application`文件夹, 并在其中新建`Catalogs`文件夹, 在其中根据读写操作分为`Commands`、`Queries`

### Command

我们将写操作放到`Commands`中, 类名以`Command`结尾, 例如:

1. 在`Commands`文件夹中新建`CatalogItemCommand`类并继承`Command`

```csharp
public record CatalogItemCommand : Command
{
    public string Name { get; set; } = null!;

    public string Description { get; set; } = string.Empty;

    public decimal Price { get; set; }

    public string PictureFileName { get; set; } = string.Empty;

    public Guid CatalogBrandId { get;  set; }
    
    public int CatalogTypeId { get; set; }
}
```

> 我们建议命令事件以`Command`结尾, 虽然它不是必须的, 但是遵守此约定会使得我们的项目可读性更强.

2. 在`Commands`文件夹中新建`CatalogItemCommandValidator`类并继承`AbstractValidator<CatalogItemCommand>`

自定义验证提供了很多验证方法, 比如`NotNull`、`Length`等, 更多使用技巧查看[文档](https://docs.fluentvalidation.net/en/latest)

```csharp
public class CatalogItemCommandValidator : AbstractValidator<CatalogItemCommand>
{
    public CatalogItemCommandValidator()
    {
        RuleFor(command => command.Name).NotNull().Length(1, 20).WithMessage("商品名称长度介于在1-20之间");
        RuleFor(command => command.CatalogTypeId).Must(typeId => Enumeration.GetAll<CatalogType>().Any(item => item.Id == typeId)).WithMessage("不支持的商品分类");
    }
}
```

> 除此之外, 我们还扩展了其它验证方法, 例如: 中文验证、手机号验证、身份证验证等, 查看[文档](/framework/utils/extensions/fluent-validation)

### Query

我们在读操作放到`Queries`中, 类名以`Query`结尾, 例如:

1. 在`Queries`文件夹中新建`CatalogItemQuery`类并继承`Query`

```csharp
public record CatalogItemQuery: ItemsQueryBase<List<CatalogItem>>
{
    public string Name { get; set; }
    
    public int Page { get; set; } = 1;

    public int PageSize { get; set; } = 20;
    
    /// <summary>
    /// 存储查询结果
    /// </summary>
    public override List<CatalogItem> Result { get; set; }
}
```

> 我们建议读事件以`Query`结尾, 虽然它不是必须的, 但是遵守此约定会使得我们的项目可读性更强.

2. 在`Queries`文件夹中新建`CatalogItemsQueryValidator`类并继承`AbstractValidator<CatalogItemsQuery>`

```csharp
public class CatalogItemsQueryValidator : AbstractValidator<CatalogItemsQuery>
{
    public CatalogItemsQueryValidator()
    {
        RuleFor(command => command.Page).GreaterThan(1).WithMessage("页码错误");
        RuleFor(command => command.PageSize).GreaterThan(0).WithMessage("页大小错误");
    }
}
```

> 验证类不是必须的, 根据业务情况选择性创建即可, 并没有强制性要求每个`Event`都必须有对应的`EventValidator`

### Handler

在`Catalogs`文件夹中新建`CatalogItemHandler`类, 用于存放商品事件的处理程序

```csharp
public class CatalogItemHandler
{
    private readonly ICatalogItemRepository _catalogItemRepository;

    public CatalogItemHandler(ICatalogItemRepository catalogItemRepository)
    {
        _catalogItemRepository = catalogItemRepository;
    }

    /// <summary>
    /// 创建商品处理程序
    /// </summary>
    [EventHandler]
    public async Task AddAsync(CatalogItemCommand command, ISequentialGuidGenerator guidGenerator, CancellationToken cancellationToken)
    {
        var catalogItem = new CatalogItem(guidGenerator.NewId(), command.CatalogBrandId, command.CatalogTypeId, command.Name, command.Description, command.Price, command.PictureFileName);
        await _catalogItemRepository.AddAsync(catalogItem, cancellationToken);
    }

    /// <summary>
    /// 查询处理程序
    /// </summary>
    [EventHandler]
    public async Task GetListAsync(CatalogItemsQuery query, CancellationToken cancellationToken)
    {
        Expression<Func<CatalogItem, bool>> condition = catalogItem => true;
        condition = condition.And(!query.Name.IsNullOrWhiteSpace(), catalogItem => catalogItem.Name.Contains(query.Name!));

        var catalogItems = await repository.GetPaginatedListAsync(condition, new PaginatedOptions(query.Page, query.PageSize), cancellationToken);

        query.Result = new PaginatedListBase<CatalogListItemDto>()
        {
            Total = catalogItems.Total,
            TotalPages = catalogItems.TotalPages,
            Result = catalogItems.Result.Map<List<CatalogListItemDto>>()
        };
    }
}
```

使用`EventBus`后无需手动保存, 除非你有以下需求:

* 主键id是子增的, 后续代码需要使用主键id, 则需要通过`IUnitOfWork`执行`SaveChangesAsync()`

> `CatalogItemHandler`构造函数的参数必须支持从`DI`获取, 否则将无法正常使用, 更多信息查看[文档](/framework/building-blocks/dispatcher/local-event)

在`QueryHandler`中我们还使用了对象映射功能, 使用它使得我们的代码变得更加优美, 查看[文档](/framework/building-blocks/getting-started/) 

## 其它

* [基于 .NET 的 FluentValidation 验证教程](https://www.xcode.me/post/5849)