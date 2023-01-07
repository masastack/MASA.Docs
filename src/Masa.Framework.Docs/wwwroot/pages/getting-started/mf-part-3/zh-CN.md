## 自定义仓储实现

在项目根目录新建`Infrastructure`文件夹, 并在其中新建`Repositories`文件夹, 用于存放自定义仓储的实现

```csharp
public class CatalogItemRepository : Repository<CatalogDbContext, CatalogItem, int>, ICatalogItemRepository
{
    public CatalogItemRepository(CatalogDbContext context, IUnitOfWork unitOfWork) : base(context, unitOfWork)
    {
    }
}
```

自定义仓储实现可以继承`Repository<CatalogDbContext, CatalogItem, int>`, 它将继承默认提供的能力, 我们仅需要实现自己新扩展的方法即可, 当然如果你不满意父类提供的某个实现, 也可重写父类的方法, 之后再使用这些方法时将会执行我们重写后的实现, 而不是父类的默认实现, 仓储默认支持了很多功能, 详情可查看[文档](/framework/building-blocks/ddd/repository)

无论是直接使用框架提供的仓储能力, 还是希望基于仓储默认提供的能力基础上进行扩展, 都需要我们在`Program.cs`中进行注册, 否则仓储将无法正常使用, 例如:

```csharp
builder.Services.AddDomainEventBus(options =>
{
    options.UseRepository<CatalogDbContext>();
});
```

框架是如何完成自动注册, 为何项目提示仓储未注册, 点击查看[文档](/framework/building-blocks/ddd/repository)