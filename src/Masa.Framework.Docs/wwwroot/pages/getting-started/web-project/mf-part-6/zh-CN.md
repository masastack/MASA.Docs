## 6. 应用服务层

我们在应用服务层, 存放事件以及事件处理程序, 使用[`CQRS`](/framework/building-blocks/cqrs)模式我们将事件分为命令端 (Command)、查询端 (Query)

### 必要条件

选中应用服务层所在类库并安装`Masa.BuildingBlocks.ReadWriteSplitting.Cqrs`

```csharp
dotnet add package Masa.Contrib.Service.MinimalAPIs
```

### 命令端

1. 在`Commands`文件夹中新建`CatalogItemCommand`类并继承`Command`

> 命令类命名格式: XXXCommand

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

2. 在`Commands`文件夹中新建`CatalogItemCommandValidator`类并继承`AbstractValidator<CatalogItemCommand>`

我们建议使用[FluentValidation](https://github.com/FluentValidation/FluentValidation)提供的验证功能, 为每个`Command`定义对应的验证类, 排除那些参数不符合规定的请求进入Handler, 如果不需要使用它, 可跳过此步骤

> 命令验证类格式: XXXCommandValidator

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

### 查询端

1. 在`Queries`文件夹中新建`CatalogItemQuery`类并继承`Query`

> 查询类命名格式: XXXQuery

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

2. 在`Queries`文件夹中新建`CatalogItemsQueryValidator`类并继承`AbstractValidator<CatalogItemsQuery>`

> 查询验证类格式: XXXQueryValidator

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

> 验证类不是必须的, 根据业务情况选择性创建即可, 并没有强制性要求每个事件都必须有对应一个的事件验证类

### 处理程序

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
        condition = condition.And(!query.Name.IsNullOrWhiteSpace(), catalogItem => catalogItem.Name.Contains(query.Name!));//此处使用了`Masa.Utils.Extensions.Expressions`提供的扩展

        var catalogItems = await repository.GetPaginatedListAsync(condition, new PaginatedOptions(query.Page, query.PageSize), cancellationToken);

        query.Result = new PaginatedListBase<CatalogListItemDto>()
        {
            Total = catalogItems.Total,
            TotalPages = catalogItems.TotalPages,
            Result = catalogItems.Result.Map<List<CatalogListItemDto>>()//使用了对象映射功能
        };
    }
}
```

简单的项目可以将读写的程序放到一个类中, 但对于复杂的项目, 建议将事件的读写程序程序分开, 无论选择哪种方式, 目的都是为了让我们的项目看起来更简洁, 查找并维护对应的业务时更加容易

> 什么是对象映射, 点击查看[文档](/framework/building-blocks/data-mapping/override) 

### 其它

* [基于 .NET 的 FluentValidation 验证教程](https://www.xcode.me/post/5849)