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

public class OrderRepository: Repository<CatalogDbContext, CatalogItem, Guid>, ICatalogItemRepository
{
    public OrderRepository(CatalogDbContext context, IUnitOfWork unitOfWork) 
        : base(context, unitOfWork)
    {
    }
}
```

由于一些特殊的原因, 我们解除了对非聚合根的限制, 使得它们也可以使用`IRepository`, 但这个是错误的, 后续版本仍然会增加限制, 届时`IRepository`将只允许对聚合根进行操作