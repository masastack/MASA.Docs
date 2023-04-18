# 实战教程 - 第三章: 事件总线和读写分离

## 概述

本章将使用[事件总线](/framework/building-blocks/dispatcher/local-event)和[读写分离](/framework/building-blocks/cqrs)，通过使用它们，将使得我们的应用程序维护性以及可读性、查询性能更强

> 本文中提到的事件总线如未加特殊说明，均指的是`进程内事件总线`

### 补充

本章实例还将做以下操作

* 完善参数校验，确保输入参数的合法性
* 不再创建读模型，使用与写入模型完全一致的数据库，但会创建一个`CatalogQueryDbContext`用来标记当前使用的是读模型

## 开始

1. 选中 `Masa.EShop.Service.Catalog`项目并安装 `Masa.Contrib.Dispatcher.Events`、 `Masa.Contrib.Dispatcher.Events.FluentValidation`、 `FluentValidation.AspNetCore`

```shell 终端
dotnet add package Masa.Contrib.Dispatcher.Events
dotnet add package Masa.Contrib.Dispatcher.Events.FluentValidation
dotnet add package FluentValidation.AspNetCore
```

或者直接修改项目文件为:

```xml Masa.EShop.Service.Catalog.csproj
<Project Sdk="Microsoft.NET.Sdk.Web">

  <PropertyGroup>
    <TargetFramework>net6.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Masa.Contrib.Dispatcher.Events" Version="$(MasaFrameworkPackageVersion)" />
    <PackageReference Include="Masa.Contrib.Dispatcher.Events.FluentValidation" Version="$(MasaFrameworkPackageVersion)" />
    <PackageReference Include="FluentValidation.AspNetCore" Version="11.3.0" />
    <!-- Omit other installed nuget packages -->
  </ItemGroup>

</Project>
```

> `FluentValidation.AspNetCore`、`Masa.Contrib.Dispatcher.Events.FluentValidation`提供了基于`FluentValidation`的验证中间件，用于事件总线在发布事件后完成参数验证操作

2. 注册[事件总线](/framework/building-blocks/dispatcher/local-event)，并使用 `FluentValidation` 进行参数验证`

```csharp Program.cs
var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddEventBus(eventBusBuilder => eventBusBuilder.UseMiddleware(typeof(ValidatorEventMiddleware<>)))
    .AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());

-----Ignore the rest of the service registration-----

var app = builder.AddServices();//`var app = builder.Build();` for projects not using MinimalAPis

-----Ignore the use of middleware, Swagger, etc.-----

app.Run();
```

> 注册事件总线在**AddServices**之前即可

3. 新建读库上下文`CatalogQueryDbContext`

:::: code-group
::: code-group-item CatalogQueryDbContext（读模型）
```csharp Program.cs
public class CatalogQueryDbContext : MasaDbContext<CatalogQueryDbContext>
{
    public DbSet<CatalogItem> CatalogItems { get; set; } = null!;

    public DbSet<CatalogBrand> CatalogBrands { get; set; } = null!;

    public DbSet<CatalogType> CatalogTypes { get; set; } = null!;

    public CatalogQueryDbContext(MasaDbContextOptions<CatalogQueryDbContext> dbContextOptions) : base(dbContextOptions)
    {
    }

    protected override void OnModelCreatingExecuting(ModelBuilder builder)
    {
        builder.ApplyConfigurationsFromAssembly(typeof(CatalogBrandEntityTypeConfiguration).Assembly);
        base.OnModelCreatingExecuting(builder);
    }
}
```
:::
::: code-group-item 注册 CatalogQueryDbContext
```csharp Program.cs
var builder = WebApplication.CreateBuilder(args);

-----Ignore the rest of the service registration-----

builder.Services.AddMasaDbContext<CatalogDbContext>(contextBuilder =>
{
    contextBuilder
        .UseSqlite()
        .UseFilter();
});

//Use the same database as the write library (pseudo read-write separation)
builder.Services.AddMasaDbContext<CatalogQueryDbContext>(contextBuilder =>
{
    contextBuilder
        .UseSqlite()
        .UseFilter();
});

var app = builder.AddServices();//`var app = builder.Build();` for projects not using MinimalAPis

-----Ignore the use of middleware, Swagger, etc.-----

app.Run();
```
:::
::::

4. 调整之前接受参数的对象，按照类型将其分为`XXXCommand`、`XXXQuery`，并为其创建对应的参数验证类`XXXCommandValidator`、`XXXQueryValidator`

其中写命令事件、读命令事件分别为

:::: code-group
::: code-group-item CreateProductCommand
```csharp Application/Catalogs/Commands/CreateProductCommand.cs
using Masa.BuildingBlocks.ReadWriteSplitting.Cqrs.Commands;

namespace Masa.EShop.Service.Catalog.Application.Catalogs.Commands;

public record CreateProductCommand : Command
{
    public string Name { get; set; } = default!;

    /// <summary>
    /// seed data：31b1c60b-e9c3-4646-ac70-09354bdb1522
    /// </summary>
    public Guid CatalogBrandId { get; set; }

    /// <summary>
    /// seed data：1
    /// </summary>
    public int CatalogTypeId { get; set; } 

    public decimal Price { get; set; }

    public string? PictureFileName { get; set; }

    public int Stock { get; set; }
}
```
:::
::: code-group-item DeleteProductCommand
```csharp Application/Catalogs/Commands/DeleteProductCommand.cs
using Masa.BuildingBlocks.ReadWriteSplitting.Cqrs.Commands;

namespace Masa.EShop.Service.Catalog.Application.Catalogs.Commands;

public record DeleteProductCommand : Command
{
    public Guid ProductId { get; set; }
}
```
:::
::: code-group-item ProductQuery
```csharp Application/Catalogs/Queries/ProductQuery.cs
using Masa.BuildingBlocks.ReadWriteSplitting.Cqrs.Queries;
using Masa.EShop.Contracts.Catalog.Dto;

namespace Masa.EShop.Service.Catalog.Application.Catalogs.Queries;

public record ProductQuery : Query<CatalogItemDto>
{
    public Guid ProductId { get; set; } = default!;
    
    public override CatalogItemDto Result { get; set; } = default!;
}
```
:::
::: code-group-item ProductsQuery
```csharp Application/Catalogs/Queries/ProductsQuery.cs
using Masa.BuildingBlocks.ReadWriteSplitting.Cqrs.Queries;
using Masa.EShop.Contracts.Catalog.Dto;
using Masa.Utils.Models;

namespace Masa.EShop.Service.Catalog.Application.Catalogs.Queries;

public record ProductsQuery : Query<PaginatedListBase<CatalogListItemDto>>
{
    public int PageSize { get; set; } = default!;

    public int Page { get; set; } = default!;

    public string? Name { get; set; }

    public bool IsRecycle { get; set; } = false;

    public override PaginatedListBase<CatalogListItemDto> Result { get; set; } = default!;
}
```
:::
::::

为对应事件添加参数验证类，用于验证参数是否合法

:::: code-group
::: code-group-item CreateProductCommandValidator
```csharp Application/Catalogs/Commands/CreateProductCommandValidator.cs
using FluentValidation;

namespace Masa.EShop.Service.Catalog.Application.Catalogs.Commands;

public class CreateProductCommandValidator : AbstractValidator<CreateProductCommand>
{
    public CreateProductCommandValidator()
    {
        RuleFor(cmd => cmd.Name).Must(name => !string.IsNullOrWhiteSpace(name)).WithMessage("Product name cannot be empty");
        RuleFor(cmd => cmd.CatalogBrandId).GreaterThan(0).WithMessage("Please select a product brand");
        RuleFor(cmd => cmd.CatalogTypeId).GreaterThan(0).WithMessage("Please select a product category");
        RuleFor(cmd => cmd.Price).GreaterThanOrEqualTo(0).WithMessage("Please enter product price");
        RuleFor(cmd => cmd.Stock).GreaterThanOrEqualTo(0).WithMessage("Please enter product inventory");
    }
}
```
:::
::: code-group-item DeleteProductCommandValidator
```csharp Application/Catalogs/Commands/DeleteProductCommandValidator.cs
using FluentValidation;

namespace Masa.EShop.Service.Catalog.Application.Catalogs.Commands;

public class DeleteProductCommandValidator : AbstractValidator<DeleteProductCommand>
{
    public DeleteProductCommandValidator()
    {
        RuleFor(cmd => cmd.ProductId).GreaterThan(0).WithMessage("Please enter the ProductId");
    }
}
```
:::
::: code-group-item ProductQueryValidator
```csharp Application/Catalogs/Queries/ProductQueryValidator.cs
using FluentValidation;

namespace Masa.EShop.Service.Catalog.Application.Catalogs.Queries;

public class ProductQueryValidator : AbstractValidator<ProductQuery>
{
    public ProductQueryValidator()
    {
        RuleFor(item => item.ProductId).GreaterThan(0).WithMessage("Please enter the ProductId");
    }
}
```
:::
::: code-group-item ProductsQueryValidator
```csharp Application/Catalogs/Queries/ProductsQueryValidator.cs
using FluentValidation;

namespace Masa.EShop.Service.Catalog.Application.Catalogs.Queries;

public class ProductsQueryValidator : AbstractValidator<ProductsQuery>
{
    public ProductsQueryValidator()
    {
        RuleFor(item => item.Page).GreaterThan(0);
        RuleFor(item => item.PageSize).GreaterThan(0);
    }
}
```
:::
::::

> 参数验证类并非是必须的，根据实际业务按需创建即可

5. 新建`ProductCommandHandler`、`ProductQueryHandler`用于处理产品的增删改查

* `ProductCommandHandler`：**新增产品**、**删除产品**
* `ProductQueryHandler`：**查询产品详情**、**查询产品列表**、**查询已被删除的产品列表**

:::: code-group
::: code-group-item ProductCommandHandler
```csharp Application/Catalogs/ProductCommandHandler.cs
using Masa.EShop.Service.Catalog.Infrastructure;
using Masa.Contrib.Dispatcher.Events;
using Masa.EShop.Service.Catalog.Application.Catalogs.Commands;
using Masa.EShop.Service.Catalog.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Masa.EShop.Service.Catalog.Application.Catalogs;

public class ProductCommandHandler
{
    private readonly CatalogDbContext _dbContext;

    public ProductCommandHandler(CatalogDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [EventHandler]
    public async Task CreateHandleAsync(CreateProductCommand command)
    {
        var catalogItem = new CatalogItem()
        {
            CatalogBrandId = command.CatalogBrandId,
            CatalogTypeId = command.CatalogTypeId,
            Name = command.Name,
            PictureFileName = command.PictureFileName ?? "default.png",
            Price = command.Price
        };

        await _dbContext.CatalogItems.AddAsync(catalogItem);
        await _dbContext.SaveChangesAsync();
    }

    [EventHandler]
    public async Task DeleteHandlerAsync(DeleteProductCommand command)
    {
        var catalogItem = await _dbContext.CatalogItems.FirstOrDefaultAsync(item => item.Id == command.ProductId) ??
                          throw new UserFriendlyException("Product doesn't exist");
        _dbContext.CatalogItems.Remove(catalogItem);
        await _dbContext.SaveChangesAsync();
    }
}
```
:::
::: code-group-item ProductQueryHandler
```csharp Application/Catalogs/ProductQueryHandler.cs
using System.Linq.Expressions;
using Masa.BuildingBlocks.Data;
using Masa.Contrib.Dispatcher.Events;
using Masa.EShop.Contracts.Catalog.Dto;
using Masa.EShop.Service.Catalog.Application.Catalogs.Queries;
using Masa.EShop.Service.Catalog.Domain.Entities;
using Masa.EShop.Service.Catalog.Infrastructure;
using Masa.Utils.Models;
using Microsoft.EntityFrameworkCore;

namespace Masa.EShop.Service.Catalog.Application.Catalogs;

public class ProductQueryHandler
{
    private readonly CatalogQueryDbContext _dbContext;

    public ProductQueryHandler(CatalogQueryDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [EventHandler]
    public async Task ProductsHandleAsync(ProductsQuery query, IDataFilter dataFilter)
    {
        Expression<Func<CatalogItem, bool>> condition = item => true;
        condition = condition.And(!query.Name.IsNullOrWhiteSpace(), item => item.Name.Contains(query.Name!));

        if (!query.IsRecycle)
        {
            await GetItemsAsync();
        }
        else
        {
            using (dataFilter.Disable<ISoftDelete>())
            {
                condition = condition.And(item => item.IsDeleted); //Only query the data of the recycle bin
                await GetItemsAsync();
            }
        }

        async Task GetItemsAsync()
        {
            var queryable = _dbContext.CatalogItems.Where(condition);

            var total = await queryable.LongCountAsync();

            var totalPages = (int)Math.Ceiling((double)total / query.PageSize);

            var list = await queryable.Where(condition)
                .Select(item => new CatalogListItemDto()
                {
                    Id = item.Id,
                    Name = item.Name,
                    Price = item.Price,
                    PictureFileName = item.PictureFileName,
                    CatalogTypeId = item.CatalogTypeId,
                    CatalogBrandId = item.CatalogBrandId,
                    Stock = item.Stock,
                })
                .Skip((query.Page - 1) * query.PageSize)
                .Take(query.PageSize)
                .ToListAsync();

            query.Result = new PaginatedListBase<CatalogListItemDto>()
            {
                Total = total,
                TotalPages = totalPages,
                Result = list
            };
        }
    }

    [EventHandler]
    public async Task ProductHandleAsync(ProductQuery query)
    {
        var catalogItem = await _dbContext.CatalogItems
            .Where(item => item.Id == query.ProductId)
            .Select(item => new CatalogItemDto()
            {
                Id = item.Id,
                Name = item.Name,
                Price = item.Price,
                PictureFileName = item.PictureFileName,
                CatalogTypeId = item.CatalogTypeId,
                CatalogBrandId = item.CatalogBrandId
            }).FirstOrDefaultAsync() ?? throw new UserFriendlyException("Product doesn't exist");
        query.Result = catalogItem;
    }
}
```
:::
::::

> 事件处理程序所在类支持通过构造函数注入、也支持方法注入 (标记`EventHandler`特性的方法)

6. 修改`CatalogItemService.cs`

```csharp Services/CatalogItemService.cs
using Masa.BuildingBlocks.Data;
using Masa.BuildingBlocks.Dispatcher.Events;
using Masa.EShop.Service.Catalog.Application.Catalogs.Commands;
using Masa.EShop.Service.Catalog.Application.Catalogs.Queries;

namespace Masa.EShop.Service.Catalog.Services;

public class CatalogItemService : ServiceBase
{
    private IEventBus EventBus => GetRequiredService<IEventBus>();

    public async Task<IResult> GetAsync(Guid id)
    {
        var query = new ProductQuery() { ProductId = id };
        await EventBus.PublishAsync(query);
        return Results.Ok(query.Result);
    }

    /// <summary>
    /// `PaginatedListBase` is provided by **Masa.Utils.Models.Config**, if you want to use it, please install `Masa.Utils.Models.Config`
    /// </summary>
    /// <returns></returns>
    public async Task<IResult> GetItemsAsync(
        string? name,
        int page = 1,
        int pageSize = 10)
    {
        var query = new ProductsQuery()
        {
            Name = name,
            Page = page,
            PageSize = pageSize
        };
        await EventBus.PublishAsync(query);
        return Results.Ok(query.Result);
    }

    /// <summary>
    /// Show only deleted listings
    /// </summary>
    public async Task<IResult> GetRecycleItemsAsync(
        string? name,
        int page = 1,
        int pageSize = 10)
    {
        var query = new ProductsQuery()
        {
            Name = name,
            IsRecycle = true,
            Page = page,
            PageSize = pageSize
        };
        await EventBus.PublishAsync(query);
        return Results.Ok(query.Result);
    }

    public async Task<IResult> CreateProductAsync(CreateProductCommand command)
    {
        await EventBus.PublishAsync(command);
        return Results.Accepted();
    }

    public async Task<IResult> DeleteProductAsync(Guid id)
    {
        await EventBus.PublishAsync(new DeleteProductCommand() { ProductId = id });

        return Results.Accepted();
    }
}
```

## 总结

通过事件总线、读写分离，它将使我们更专注

* 读关注读取性能
* 写关注复杂业务逻辑
* 参数校验程序关注参数验证