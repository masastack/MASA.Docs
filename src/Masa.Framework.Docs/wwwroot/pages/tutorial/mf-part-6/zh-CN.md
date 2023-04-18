# 实战教程 - 第六章: 领域驱动设计

## 概述

本章将使用[领域驱动设计](/framework/building-blocks/ddd/overview)，并使用`MASA Framework`提供的基础设施帮助我们去改造项目

## 开始

1. 选中 `Masa.EShop.Service.Catalog` 项目并安装 `Masa.Contrib.Ddd.Domain`、`Masa.Contrib.Ddd.Domain.Repository.EFCore`、`Masa.Contrib.Data.UoW.EFCore`、`Masa.Contrib.Dispatcher.IntegrationEvents.EventLogs.EFCore`、`Masa.Contrib.Dispatcher.IntegrationEvents.Dapr`

```shell 终端
dotnet add package Masa.Contrib.Ddd.Domain
dotnet add package Masa.Contrib.Ddd.Domain.Repository.EFCore
dotnet add package Masa.Contrib.Data.UoW.EFCore
dotnet add package Masa.Contrib.Dispatcher.IntegrationEvents.Dapr
dotnet add package Masa.Contrib.Dispatcher.IntegrationEvents.EventLogs.EFCore
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
    <PackageReference Include="Masa.Contrib.Ddd.Domain" Version="$(MasaFrameworkPackageVersion)" />
    <PackageReference Include="Masa.Contrib.Ddd.Domain.Repository.EFCore" Version="$(MasaFrameworkPackageVersion)" />
    <!-- Omit other installed nuget packages -->
  </ItemGroup>

</Project>
```

2. 注册[领域事件](/framework/building-blocks/ddd/domain-event)、[仓储](/framework/building-blocks/ddd/repository)、工作单元

```csharp Program.cs
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDomainEventBus(options =>
{
    options
        .UseIntegrationEventBus(eventOptions => eventOptions.UseDapr().UseEventLog<CatalogDbContext>())
        .UseUoW<CatalogDbContext>()
        .UseRepository<CatalogDbContext>();
});

-----Ignore the rest of the service registration-----

var app = builder.AddServices();//`var app = builder.Build();` for projects not using MinimalAPis

-----Ignore the use of middleware, Swagger, etc.-----

app.Run();
```

> 领域事件使用需要注册`本地事件`、`集成事件`

3. 修改商品品牌、商品类型、商品信息模型

:::: code-group
::: code-group-item CatalogBrand
```csharp Domain/Entities/CatalogBrand.cs
using Masa.BuildingBlocks.Data;
using Masa.BuildingBlocks.Ddd.Domain.Entities.Full;

namespace Masa.EShop.Service.Catalog.Domain.Entities;

public class CatalogBrand : FullAggregateRoot<Guid, int>
{
    public string Brand { get; set; }

    public CatalogBrand(string brand)
    {
        Id = IdGeneratorFactory.SequentialGuidGenerator.NewId();
        Brand = brand;
    }
}
```
:::
::: code-group-item CatalogType
```csharp Domain/Entities/CatalogType.cs
using Masa.BuildingBlocks.Ddd.Domain.SeedWork;

namespace Masa.EShop.Service.Catalog.Domain.Entities;

public class CatalogType: Enumeration
{
    public static CatalogType WaterDispenser = new(1, "Water Dispenser");
    
    public CatalogType(int id, string name) : base(id, name)
    {
    }
}
```
:::
::: code-group-item CatalogItem
```csharp Domain/Entities/CatalogItem.cs
using Masa.BuildingBlocks.Data;
using Masa.BuildingBlocks.Ddd.Domain.Entities.Full;
using Masa.EShop.Service.Catalog.Domain.Events;

namespace Masa.EShop.Service.Catalog.Domain.Entities;

public class CatalogItem : FullAggregateRoot<Guid, int>
{
    public string Name { get; private set; } = null!;

    public decimal Price { get; private set; }

    public string PictureFileName { get; private set; } = "";

    public int CatalogTypeId { get; private set; }

    public CatalogType CatalogType { get; private set; } = null!;

    public Guid CatalogBrandId { get; private set; }

    public CatalogBrand CatalogBrand { get; private set; } = null!;

    public int Stock { get; private set; }

    public CatalogItem(string name, decimal price, string pictureFileName)
    {
        Id = IdGeneratorFactory.SequentialGuidGenerator.NewId();
        Name = name;
        Price = price;
        PictureFileName = pictureFileName;
        AddCatalogDomainIntegrationEvent();
    }

    private void AddCatalogDomainIntegrationEvent()
    {
        var catalogCreatedIntegrationDomainEvent = new CatalogCreatedIntegrationDomainEvent(this);
        this.AddDomainEvent(catalogCreatedIntegrationDomainEvent);
    }

    public void SetCatalogType(int catalogTypeId)
    {
        CatalogTypeId = catalogTypeId;
    }

    public void SetCatalogBrand(Guid catalogBrand)
    {
        CatalogBrandId = catalogBrand;
    }

    public void AddStock(int stock)
    {
        Stock += stock;
    }
}
```
:::
::::

> `IdGeneratorFactory.SequentialGuidGenerator.NewId();`需安装并注册[有序Guid生成器](/framework/building-blocks/data/sequential-guid)

4. 新增集成领域事件 (为方便其它服务订阅集成事件，共享类库，我们将其拆分为两个类)

:::: code-group
::: code-group-item CatalogCreatedIntegrationDomainEvent
```csharp Domain/Events/CatalogCreatedIntegrationDomainEvent.cs
using Masa.BuildingBlocks.Ddd.Domain.Events;
using Masa.EShop.Contracts.Catalog.IntegrationEvents;
using Masa.EShop.Service.Catalog.Domain.Entities;

namespace Masa.EShop.Service.Catalog.Domain.Events;

public record CatalogCreatedIntegrationDomainEvent : CatalogCreatedIntegrationEvent, IIntegrationDomainEvent
{
    private readonly CatalogItem _catalog;

    private int? _catalogTypeId;

    public override int CatalogTypeId
    {
        get => _catalogTypeId ??= _catalog.CatalogTypeId;
        set => _catalogTypeId = value;
    }

    private Guid? _catalogBrandId;

    public override Guid CatalogBrandId
    {
        get => _catalogBrandId ??= _catalog.CatalogBrandId;
        set => _catalogBrandId = value;
    }

    public CatalogCreatedIntegrationDomainEvent(CatalogItem catalog) : base()
    {
        _catalog = catalog;
    }
}
```
:::
::: code-group-item CatalogType
```csharp Masa.EShop.Contracts.Catalog/IntegrationEvents/CatalogCreatedIntegrationEvent.cs
using Masa.BuildingBlocks.Dispatcher.IntegrationEvents;

namespace Masa.EShop.Contracts.Catalog.IntegrationEvents;

public record CatalogCreatedIntegrationEvent : IntegrationEvent
{
    public Guid Id { get; set; }

    public string Name { get; set; } = default!;

    public string? PictureFileName { get; set; }

    public virtual int CatalogTypeId { get; set; }

    public virtual Guid CatalogBrandId { get; set; }
}
```
:::
::::


> 集成领域事件支持跨服务订阅

5. 新建[仓储](/framework/building-blocks/ddd/repository)接口与实现

:::: code-group
::: code-group-item ICatalogItemRepository
```csharp Domain/Repositories/ICatalogItemRepository.cs
using Masa.BuildingBlocks.Ddd.Domain.Repositories;
using Masa.EShop.Service.Catalog.Domain.Entities;

namespace Masa.EShop.Service.Catalog.Domain.Repositories;

public interface ICatalogItemRepository : IRepository<CatalogItem, Guid>
{
    
}
```
:::
::: code-group-item CatalogItemRepository
```csharp Infrastructure/Repositories/CatalogItemRepository.cs
using Masa.BuildingBlocks.Data.UoW;
using Masa.Contrib.Ddd.Domain.Repository.EFCore;
using Masa.EShop.Service.Catalog.Domain.Entities;
using Masa.EShop.Service.Catalog.Domain.Repositories;

namespace Masa.EShop.Service.Catalog.Infrastructure.Repositories;

public class CatalogItemRepository : Repository<CatalogDbContext, CatalogItem, Guid>, ICatalogItemRepository
{
    public CatalogItemRepository(CatalogDbContext context, IUnitOfWork unitOfWork) : base(context, unitOfWork)
    {
    }
}
```
:::
::::

> 通过自定义[仓储](/framework/building-blocks/ddd/repository)，可扩展基类仓储能力 （仓储按约定继承无需手动注册）

6. 更改`ProductCommandHandler`，通过仓储操作[聚合根](/framework/building-blocks/ddd/aggregate-root)

```csharp Application/Catalogs/ProductCommandHandler.cs
using Masa.BuildingBlocks.Caching;
using Masa.BuildingBlocks.Ddd.Domain.Repositories;
using Masa.Contrib.Dispatcher.Events;
using Masa.EShop.Service.Catalog.Application.Catalogs.Commands;
using Masa.EShop.Service.Catalog.Domain.Entities;

namespace Masa.EShop.Service.Catalog.Application.Catalogs;

public class ProductCommandHandler
{
    private readonly IRepository<CatalogItem, Guid> _repository;
    private readonly IMultilevelCacheClient _multilevelCacheClient;

    public ProductCommandHandler(
        IRepository<CatalogItem, Guid> repository,
        IMultilevelCacheClient multilevelCacheClient)
    {
        _repository = repository;
        _multilevelCacheClient = multilevelCacheClient;
    }

    [EventHandler]
    public async Task CreateHandleAsync(CreateProductCommand command)
    {
        var catalogItem = new CatalogItem(command.Name, command.Price, command.PictureFileName ?? "default.png");
        catalogItem.SetCatalogType(command.CatalogTypeId);
        catalogItem.SetCatalogBrand(command.CatalogBrandId);
        await _repository.AddAsync(catalogItem);
        
        await _multilevelCacheClient.SetAsync(catalogItem.Id.ToString(), catalogItem);
    }

    [EventHandler]
    public async Task DeleteHandlerAsync(DeleteProductCommand command)
    {
        await _repository.RemoveAsync(command.ProductId);
        await _multilevelCacheClient.RemoveAsync<CatalogItem>(command.ProductId.ToString());
    }
}
```

## 总结

[事件驱动设计](/framework/building-blocks/ddd/overview)是为了更聚焦业务，将复杂的设计放在领域模型上，模型反映的动作与实际业务一致，它使得后续迭代升级更为简单
