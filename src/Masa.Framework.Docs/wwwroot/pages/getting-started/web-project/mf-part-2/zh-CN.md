## 2. 领域层

在前面的章节中, 使用[`MinimalAPIs`](/framework/building-blocks/minimal-apis)提供最小依赖项的`HTTP API`

对于本篇文档, 我们将要展示创建一个[充血模型](https://paulovich.net/rich-domain-model-with-ddd-tdd-reviewed/)的商品模型, 并实现`领域驱动设计 (DDD)`的最佳实践

### 使用

领域层是项目的核心，我们建议您按照以下结构来存放:

* Domain: 领域层 (可以与主服务在同一项目, 也可单独存储到一个独立的类库中)
  * Aggregates: [聚合根](/framework/building-blocks/ddd/aggregate-root)及相关[实体](/framework/building-blocks/ddd/entity)
  * Events: [领域事件](/framework/building-blocks/ddd/domain-event) (建议领域事件以`DomainEvent`结尾)
  * Repositories: [仓储](/framework/building-blocks/ddd/repository) (仅存放仓储的接口)
  * Services: [领域服务](/framework/building-blocks/ddd/domain-service)

选中领域层所属项目, 并安装`Masa.Contrib.Ddd.Domain`

```powershell
dotnet add package Masa.Contrib.Ddd.Domain
```

### 聚合

选中`Aggregates`文件夹, 我们将新建包括`CatalogItem`、`CatalogBrand`的[聚合根](/framework/building-blocks/ddd/aggregate-root)以及`CatalogType`[枚举类](/framework/building-blocks/ddd/enumeration), 并在初始化商品时添加商品领域事件

#### 商品

新建`CatalogItem`类, 并继承`FullAggregateRoot`

```csharp
public class CatalogItem : FullAggregateRoot<Guid, int>
{
    public string Name { get; private set; } = default!;

    public string Description { get; private set; } = default!;

    public decimal Price { get; private set; }

    public string PictureFileName { get; private set; } = default!;

    private int _catalogTypeId;

    public CatalogType CatalogType { get; private set; } = default!;

    private Guid _catalogBrandId;

    public CatalogBrand CatalogBrand { get; private set; } = default!;

    public int AvailableStock { get; private set; }

    public int RestockThreshold { get; private set; }

    public int MaxStockThreshold { get; private set; }

    public CatalogItem(Guid id, Guid catalogBrandId, int catalogTypeId, string name, string description, decimal price, string pictureFileName) : base(id)
    {
        _catalogBrandId = catalogBrandId;
        _catalogTypeId = catalogTypeId;
        Name = name;
        Description = description;
        Price = price;
        PictureFileName = pictureFileName;
        AddCatalogItemDomainEvent();
    }

    private void AddCatalogItemDomainEvent()
    {
        var domainEvent = this.Map<CatalogItemCreatedIntegrationDomainEvent>();
        domainEvent.CatalogBrandId = _catalogBrandId;
        domainEvent.CatalogTypeId = _catalogTypeId;
        AddDomainEvent(domainEvent);
    }
}
```

* 继承`IAggregateRoot`接口的类为聚合根
  * `CatalogItem`继承了`FullAggregateRoot<Guid, int>`使得它获得了[`软删除`](/framework/building-blocks/data/data-filter) (指的是当我们删除数据时, 数据仅被标记为删除, 并非从数据库真的删除)的能力, 同时还具备了审计的特性, 这将使得实体在被新建、修改、删除时会针对应的修改创建时间、创建人、修改时间、修改人
* 继承`IGenerateDomainEvents`接口的类支持添加或删除领域事件
  * `CatalogItem`继承了`FullAggregateRoot<Guid, int>`使得它获得了添加[领域事件](/framework/building-blocks/ddd/domain-event)的能力

> 在聚合根中添加的领域事件在何时被执行? 查看[文档](/framework/building-blocks/ddd/aggregate-root) 

#### 商品类型

新建`CatalogType`类, 并继承`Enumeration`

```csharp
public class CatalogType : Enumeration
{
    public static CatalogType Cap = new Cap();
    public static CatalogType Mug = new(2, "Mug");
    public static CatalogType Pin = new(3, "Pin");
    public static CatalogType Sticker = new(4, "Sticker");
    public static CatalogType TShirt = new(5, "T-Shirt");

    public CatalogType(int id, string name) : base(id, name)
    {
    }
    
    public virtual decimal TotalPrice(decimal price, int num)
    {
        return price * num;
    }
}

public class Cap : CatalogType
{
    public Cap() : base(1, "Cap")
    {
    }

    public override decimal TotalPrice(decimal price, int num)
    {
        return price * num * 0.95m;
    }
}
```

#### 品牌

新建`CatalogBrand`类, 并继承`FullAggregateRoot<Guid, int>`

```csharp
public class CatalogBrand : FullAggregateRoot<Guid, int>
{
    public string Brand { get; private set; } = null!;

    public CatalogBrand(string brand)
    {
        Brand = brand;
    }
}
```

### 领域事件

我们将创建商品的领域事件, 同时它还是集成事件, 需要被其它服务订阅, 因此我们将其拆分为`CatalogItemCreatedIntegrationDomainEvent`、`CatalogItemCreatedIntegrationEvent`两个类

* `CatalogItemCreatedIntegrationDomainEvent`继承`CatalogItemCreatedIntegrationEvent`、`IIntegrationDomainEvent` (位于`领域层`下的`Events`文件夹 (领域事件)中)

```csharp
public record CatalogItemCreatedIntegrationDomainEvent : CatalogItemCreatedIntegrationEvent, IIntegrationDomainEvent
{
}
```

* `CatalogItemCreatedIntegrationEvent`继承`IntegrationEvent` (建议独立一个类库)

```
public record CatalogItemCreatedIntegrationEvent : IntegrationEvent
{
    public Guid Id { get; set; }

    public string Name { get; set; } = default!;

    public string Description { get; set; }

    public decimal Price { get; set; }

    public string PictureFileName { get; set; } = "";

    public int CatalogTypeId { get; set; }

    public Guid CatalogBrandId { get; set; }
}
```

> 独立一个类库方便被其他服务直接或间接以`nuget`包的方式使用 (`IntegrationEvent`由`Masa.BuildingBlocks.Dispatcher.IntegrationEvents`提供, 请确保已正确安装`Masa.BuildingBlocks.Dispatcher.IntegrationEvents`)

### 仓储

选中领域层中的`Repositories`文件夹并创建`ICatalogItemRepository`接口, 继承`IRepository<CatalogItem, Guid>`, 可用于扩展商品仓储

```csharp
public interface ICatalogItemRepository : IRepository<CatalogItem, Guid>
{
    //如果有需要扩展的能力, 可在自定义仓储中扩展
}
```

> 对于新增加继承`IRepository<CatalogItem, Guid>`的接口, 我们需要在`Repository<CatalogDbContext, CatalogItem, Guid>`的基础上扩展其实现, 由于实现并不属于领域层, 这里我们会在后面的文档实现这个Repository

### 领域服务

选中领域层中的`Services`文件夹并创建商品[领域服务](/framework/building-blocks/ddd/domain-service)

```csharp
public class CatalogItemDomainService : DomainService
{
}
```

* 继承`DomainService`的类会自动完成服务注册, 无需手动注册

最终的文件结构应该如下所示:

![DDD](https://s2.loli.net/2023/02/06/3qjgALZJS2ynt9F.png)