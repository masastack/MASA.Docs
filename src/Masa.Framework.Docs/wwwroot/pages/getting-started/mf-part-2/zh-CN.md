## 2. 领域层

在前面的章节中, 使用[`MinimalAPIs`](/framework/building-blocks/minimal-apis)提供最小依赖项的`HTTP API`

对于本篇文档, 我们将要展示创建一个[充血模型](https://paulovich.net/rich-domain-model-with-ddd-tdd-reviewed/)的商品模型, 并实现`领域驱动设计 (DDD)`的最佳实践

### 使用

领域层是项目的核心，我们建议您按照以下结构来存放:

* Domain //领域层(可以与主服务在同一项目，也可单独存储到一个独立的类库中)
  * Aggregates // [聚合根](/framework/building-blocks/ddd/aggregate-root)及相关[实体](/framework/building-blocks/ddd/entity)
  * Events // [领域事件](/framework/building-blocks/ddd/domain-event) (建议领域事件以`DomainEvent`结尾)
  * Repositories //[仓储](/framework/building-blocks/ddd/repository) (仅存放仓储的接口)
  * Services //[领域服务](/framework/building-blocks/ddd/domain-service)

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
    public string Name { get; private set; } = null!;

    public string Description { get; private set; } = string.Empty;

    public decimal Price { get; private set; }

    public string PictureFileName { get; private set; } = "";

    private int _catalogTypeId;

    public CatalogType CatalogType { get; private set; } = null!;

    private Guid _catalogBrandId;

    public CatalogBrand CatalogBrand { get; private set; } = null!;

    public int AvailableStock { get; private set; }

    public int RestockThreshold { get; private set; }

    public int MaxStockThreshold { get; private set; }

    public bool OnReorder { get; private set; }

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

* 继承`IAggregateRoot`接口的类为聚合根, 由于`CatalogItem`继承了`FullAggregateRoot<Guid, int>`使得它支持了[`软删除`](/framework/building-blocks/data/data-filter) (指的是当我们删除数据时, 数据仅被标记为删除, 并非从数据库真的删除), 同时还具备了审计的特性, 这将使得实体在被新建、修改、删除时会针对应的修改创建时间、创建人、修改时间、修改人
* 继承`IGenerateDomainEvents`接口的类支持添加或删除领域事件, 而`CatalogItem`继承了`FullAggregateRoot<Guid, int>`使得它支持了添加领域事件的功能
  * 在聚合根中添加的领域事件将在工作单元保存时通过`IDomainEventBus`入队, 并在工作单元提交时统一发送
  * 如果使用工作单元并且没有禁用工作单元, 那么无论是直接使用还是间接使用`IDomainEventBus`的领域事件入队, 当Handler出现异常时, 框架会通过工作单元进行回滚 (目前仅关系型数据库支持回滚, 而集成事件由于借助本地消息表实现发件箱模式, 因而回滚也同样生效, 其它服务暂不支持)

#### 商品类型

新建`CatalogType`类, 并继承`Enumeration`

```csharp
public class CatalogType : Enumeration
{
    public static CatalogType Cap = new(1, "Cap");
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
    public Cap(int id, string name) : base(id, name)
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

我们将新建创建商品的领域事件, 但由于此事件是集成事件, 需要被其它服务订阅, 因此我们将其拆分为`CatalogItemCreatedIntegrationDomainEvent`、`CatalogItemCreatedIntegrationEvent`两个类

其中`CatalogItemCreatedIntegrationDomainEvent`继承`CatalogItemCreatedIntegrationEvent`、`IIntegrationDomainEvent`，并将`CatalogItemCreatedIntegrationDomainEvent`存放到`领域层`下的`Events`文件夹 (领域事件)中

```csharp
public record CatalogItemCreatedIntegrationDomainEvent : CatalogItemCreatedIntegrationEvent, IIntegrationDomainEvent
{
}
```

其中`CatalogItemCreatedIntegrationEvent`继承`IntegrationEvent`并存放到一个独立的类库中

```csharp
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

> `CatalogItemCreatedIntegrationEvent`可以被其它服务所引用使用, 或者将它发布为`nuget`包以供其它服务使用

`IntegrationEvent`由`Masa.BuildingBlocks.Dispatcher.IntegrationEvents`提供, 请确保已正确安装`Masa.BuildingBlocks.Dispatcher.IntegrationEvents`

### 仓储

选中`Repositories`文件夹 (领域层下)并创建`ICatalogItemRepository`接口, 继承`IRepository<CatalogItem, Guid>`, 可用于扩展商品仓储

```csharp
public interface ICatalogItemRepository : IRepository<CatalogItem, Guid>
{
    //如果有需要扩展的能力, 可在自定义仓储中扩展
}
```

> 对于新增加继承`IRepository<CatalogItem, Guid>`的接口, 我们需要在`Repository<CatalogDbContext, CatalogItem, Guid>`的基础上扩展其实现, 由于实现并不属于领域层, 这里我们会在下一篇文档实现这个Repository

仓储服务我们建议以`Repository`结尾, 虽然它不是必须的, 但是遵守此约定会使得我们的项目可读性更强

### 领域服务

选中`Services`文件夹 (领域层下)并创建商品[领域服务](/framework/building-blocks/ddd/domain-service)

```csharp
public class CatalogItemDomainService : DomainService
{
    public CatalogItemDomainService(IDomainEventBus eventBus) : base(eventBus)
    {
    }
}
```

* 继承`DomainService`的类会自动完成服务注册, 无需手动注册

领域服务我们建议以`DomainService`结尾, 虽然它不是必须的, 但是遵守此约定会使得我们的项目可读性更强

最终的文件结构应该如下所示:

![DDD](https://s2.loli.net/2023/02/06/3qjgALZJS2ynt9F.png)