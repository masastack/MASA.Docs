## 商品: 领域层

在前面的章节中, 使用[`MinimalAPIs`](/framework/building-blocks/minimal-apis)提供最小依赖项的`HTTP API`

对于本篇文档, 我们将要展示创建一个[充血模型](https://paulovich.net/rich-domain-model-with-ddd-tdd-reviewed/)的商品模型, 并实现`领域驱动设计 (DDD)`的最佳实践

## 商品实体

新建`Domain`文件夹并创建`Aggregates`文件夹, 并在其中加入`CatalogItem`类, 并继承`FullAggregateRoot`

```csharp
public class CatalogItem : FullAggregateRoot<int, int>
{
    public string Name { get; private set; } = null!;

    public string Description { get; private set; } = string.Empty;

    public decimal Price { get; private set; }

    public string PictureFileName { get; private set; } = "";

    public int CatalogTypeId { get; private set; }

    public CatalogType CatalogType { get; private set; } = null!;

    public int CatalogBrandId { get; private set; }

    public CatalogBrand CatalogBrand { get; private set; } = null!;

    public int AvailableStock { get; private set; }

    public int RestockThreshold { get; private set; }

    public int MaxStockThreshold { get; private set; }

    public bool OnReorder { get; private set; }

    public CatalogItem(int catalogBrandId, int catalogTypeId, string name, string description, decimal price, string pictureFileName)
    {
        CatalogBrandId = catalogBrandId;
        CatalogTypeId = catalogTypeId;
        Name = name;
        Description = description;
        Price = price;
        PictureFileName = pictureFileName;
    }
}
```

> 继承`FullAggregateRoot<int, int>`类使得商品实体支持了[`软删除`](/framework/building-blocks/data/data-filter) (指的是当我们删除数据时, 数据仅被标记为删除, 并非从数据库真的删除), 同时还具备了审计的特性, 这将使得实体在被新建、修改、删除时会针对应的修改创建时间、创建人、修改时间、修改人

## 商品类型

`CatalogType`类是一个[枚举类](/framework/building-blocks/ddd/enumeration), 它位于`Masa.EShop.Service.Catalog`项目的`Domain`命名空间(文件夹)中:

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
}
```

## ICatalogItemRepository

在`Domain`文件夹下新建`Repositories`文件夹并创建`ICatalogItemRepository`接口, 继承`IRepository<CatalogItem, int>`, 可用于扩展商品仓储

```csharp
public interface ICatalogItemRepository : IRepository<CatalogItem, int>
{
    //如果有需要扩展的能力, 可在自定义仓储中扩展
}
```

> 对于新增加继承`IRepository<CatalogItem, int>`的接口, 我们需要在Repository<CatalogDbContext, CatalogItem, int>的基础上扩展其实现, 由于实现并不属于领域层, 这里我们会在下一篇文档实现这个Repository

## IDomainEventBus

在`DDD`中提供了领域事件总线, 它提供了:

* Enqueue<TDomainEvent>(TDomainEvent @event): 领域事件入队
* PublishQueueAsync(): 发布领域事件 (根据领域事件入队顺序依次发布)
* AnyQueueAsync(): 得到是否存在领域事件

> 领域事件总线不仅仅可以发布[进程内事件](/framework/building-blocks/dispatcher/local-event)、也可发布[集成事件](/framework/building-blocks/dispatcher/integration-event)