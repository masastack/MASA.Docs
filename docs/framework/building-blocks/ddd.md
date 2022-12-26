---
title: 领域驱动设计
date: 2022/12/23
---

## 概念

什么是[领域驱动设计](https://blogs.masastack.com/2022/02/11/masa/framework/design/2.MASA%20Framework%20-%20DDD%E8%AE%BE%E8%AE%A1%EF%BC%881%EF%BC%89/)

[MasaFramework](https://github.com/masastack/MASA.Framework)框架提供了基础设施使得基于领域驱动设计的开发更容易实现, 但它并不能教会你什么是`DDD`, `DDD`能否在公司落地不仅需要开发人员的努力, 更需要业务专家以及领导的认可, 它需要公司全体人员的努力. 其中`DDD`的提供者有:

* [Masa.Contrib.Ddd.Domain](https://www.nuget.org/packages/Masa.Contrib.Ddd.Domain)
* [Masa.Contrib.Ddd.Domain.Repository.EFCore](https://www.nuget.org/packages/Masa.Contrib.Ddd.Domain.Repository.EFCore)
* [Masa.Contrib.Data.UoW.EFCore](https://www.nuget.org/packages/Masa.Contrib.Data.UoW.EFCore)

::: tip 提示
`Repository`、`UnitOfWork`和使用哪个`Orm`框架不应该是强耦合, 这里会在下个版本进行调整
:::

## 功能列表

* [领域模型](#领域模型)
* [领域事件 (DomainEvent)](#领域事件)
* [值对象 (ValueObject)](#值对象)
* [仓储 (Repository)](#仓库)
* [枚举类 (Enumeration)](#枚举类)
* [领域服务 (IDomainService)](#领域服务)
* [规约](#规约)
* [工作单元 (IUnitOfWork)](#工作单元)

## 使用

安装`Masa.Contrib.Ddd.Domain`

``` powershell
dotnet add package Masa.Contrib.Ddd.Domain
```

### <a id = "领域模型">领域模型</a>

提供了需要用到的`聚合根基类 (AggregateRoot)`、`实体基类 (Entity)`、`支持审计的聚合根基类 (AuditAggregateRoot)`、`支持审计的聚合根实体基类 (AuditEntity)`、`支持软删除和审计的聚合根基类 (FullAggregateRoot)`、`支持软删除和审计的实体基类 (FullEntity)`

其中未指定主键类型的实体需要通过重写`GetKeys`方法来指定主键, 聚合根支持添加领域事件 (并在EventBus的Handler执行完成后执行)

#### 实体

``` C#
public class OrderItem : Entity<Guid>
{
    private string _productName;
    private string _pictureUrl;
    private decimal _unitPrice;
    private decimal _discount;
    private int _units;

    public int ProductId { get; private set; }

    protected OrderItem() { }

    public OrderItem(int productId, string productName, decimal unitPrice, decimal discount, string PictureUrl, int units = 1)
    {
        if (units <= 0)
        {
            throw new OrderingDomainException("Invalid number of units");
        }

        if ((unitPrice * units) < discount)
        {
            throw new OrderingDomainException("The total of order item is lower than applied discount");
        }

        ProductId = productId;

        _productName = productName;
        _unitPrice = unitPrice;
        _discount = discount;
        _units = units;
        _pictureUrl = PictureUrl;
    }
}
```

#### 聚合根

``` C#
public class Order: AggregateRoot<int>
{
    // DDD Patterns comment
    // Using private fields, allowed since EF Core 1.1, is a much better encapsulation
    // aligned with DDD Aggregates and Domain Entities (Instead of properties and property collections)
    private DateTime _orderDate;

    // Address is a Value Object pattern example persisted as EF Core 2.0 owned entity
    public Address Address { get; private set; }

    public int? GetBuyerId => _buyerId;
    private int? _buyerId;

    public OrderStatus OrderStatus { get; private set; }
    private int _orderStatusId;

    private string _description;

    // Draft orders have this set to true. Currently we don't check anywhere the draft status of an Order, but we could do it if needed
    private bool _isDraft;

    // DDD Patterns comment
    // Using a private collection field, better for DDD Aggregate's encapsulation
    // so OrderItems cannot be added from "outside the AggregateRoot" directly to the collection,
    // but only through the method OrderAggrergateRoot.AddOrderItem() which includes behaviour.
    private readonly List<OrderItem> _orderItems;
    public IReadOnlyCollection<OrderItem> OrderItems => _orderItems;

    private int? _paymentMethodId;

    public static Order NewDraft()
    {
        var order = new Order
        {
            _isDraft = true
        };
        return order;
    }

    protected Order()
    {
        _orderItems = new List<OrderItem>();
        _isDraft = false;
    }

    public Order(
        string userId, 
        string userName, 
        Address address, 
        int cardTypeId, 
        string cardNumber, 
        string cardSecurityNumber,
        string cardHolderName, 
        DateTime cardExpiration, 
        int? buyerId = null, 
        int? paymentMethodId = null) : this()
    {
        _buyerId = buyerId;
        _paymentMethodId = paymentMethodId;
        _orderStatusId = OrderStatus.Submitted.Id;
        _orderDate = DateTime.UtcNow;
        Address = address;

        // Add the OrderStarterDomainEvent to the domain events collection
        // to be raised/dispatched when comitting changes into the Database [ After DbContext.SaveChanges() ]
        AddOrderStartedDomainEvent(userId, userName, cardTypeId, cardNumber, cardSecurityNumber, cardHolderName, cardExpiration);
    }
    
    private void AddOrderStartedDomainEvent(
        string userId, 
        string userName, 
        int cardTypeId, 
        string cardNumber,
        string cardSecurityNumber,
        string cardHolderName, 
        DateTime cardExpiration)
    {
        var orderStartedDomainEvent = new OrderStartedDomainEvent(this, userId, userName, cardTypeId,
                                                                    cardNumber, cardSecurityNumber,
                                                                    cardHolderName, cardExpiration);

        this.AddDomainEvent(orderStartedDomainEvent);
    }
}
```

### <a id = "领域事件">领域事件</a>

根据事件类型又可以分为本地事件 (`DomainEvent`)、集成事件 (`IntegrationDomainEvent`), 而本地事件根据读写性质不同划分为`DomainCommand`、`DomainQuery`, 例如:

``` C#
/// <summary>
/// Event used when an order is created
/// </summary>
public record OrderStartedDomainEvent(Order Order,
    string UserId,
    string UserName,
    int CardTypeId,
    string CardNumber,
    string CardSecurityNumber,
    string CardHolderName,
    DateTime CardExpiration) : DomainEvent;
```

### <a id = "值对象">值对象</a>

没有唯一标识, 任何属性的变化都将视为新的值对象, 例如:

``` C#
public class Address : ValueObject
{
    public String Street { get; private set; }
    public String City { get; private set; }
    public String State { get; private set; }
    public String Country { get; private set; }
    public String ZipCode { get; private set; }

    public Address() { }

    public Address(string street, string city, string state, string country, string zipCode)
    {
        Street = street;
        City = city;
        State = state;
        Country = country;
        ZipCode = zipCode;
    }

    protected override IEnumerable<object> GetEqualityValues()
    {
        yield return Street;
        yield return City;
        yield return State;
        yield return Country;
        yield return ZipCode;
    }
}
```

但在项目开发中, 我们可以通过模型映射将值对象映射存储到单独的表中, 也可以映射为一个json字符串存储又或者根据属性拆分为多列使用, 这些都是可以的, 无论数据是以什么方式存储, 它们是值对象这点不会改变, 因此我们不能错误的理解为在数据库中的表一定是实体或者聚合根, 这种想法是错误的

### <a id = "仓储">仓储</a>

屏蔽业务逻辑和持久化基础设施的差异, 针对不同的存储设施, 会有不同的实现方式, 但这些不会对我们的业务产生影响, 它是领域驱动设计的一部分, 我们仅会提供针对`聚合根`做简单的增删改查操作, 而并非针对`单个表`, 我们可以在构造函数中注入`IRepository<TEntity, TKey>`使用框架提供的对聚合根的基础操作

``` C#
public class CustomerDomainService : DomainService
{
    private readonly IRepository<Order, Guid> _orderRepository;
    public CustomerDomainService(IRepository<Order, Guid> orderRepository)
    {
        _orderRepository = orderRepository;
    }
}
```

或者新建自定义Repository类并继承`IRepository<TEntity, TKey>`, 例如自定义`OrderRepository`

安装`Masa.Contrib.Ddd.Domain.Repository.EFCore`

``` powershell
dotnet add package Masa.Contrib.Ddd.Domain.Repository.EFCore
```

``` C#
public interface IOrderRepository: IRepository<Order, Guid>
{

}

public class OrderRepository: Repository<OrderingContext, Order, Guid>, IOrderRepository
{
    public OrderRepository(OrderContext context, IUnitOfWork unitOfWork) 
        : base(context, unitOfWork)
    {
    }
}

public class CustomerDomainService : DomainService
{
    private readonly IRepository<Order, Guid> _orderRepository;
    public CustomerDomainService(IRepository<Order, Guid> orderRepository)
    {
        _orderRepository = orderRepository;
    }
}
```

> 由于一些特殊的原因, 我们解除了对非聚合根的限制, 使得它们也可以使用`IRepository`, 但这个是错误的, 后续版本仍然会增加限制, 届时`IRepository`将只允许对聚合根进行操作

### <a id = "枚举类">枚举类</a>

提供枚举类基类, 使用枚举类来代替使用枚举, [查看原因](https://learn.microsoft.com/zh-cn/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/enumeration-classes-over-enum-types)

``` C#
public class OrderStatus : Enumeration
{
    public static OrderStatus Submitted = new OrderStatus(1, nameof(Submitted).ToLowerInvariant());
    public static OrderStatus AwaitingValidation = new OrderStatus(2, nameof(AwaitingValidation).ToLowerInvariant());
    public static OrderStatus StockConfirmed = new OrderStatus(3, nameof(StockConfirmed).ToLowerInvariant());
    public static OrderStatus Paid = new OrderStatus(4, nameof(Paid).ToLowerInvariant());
    public static OrderStatus Shipped = new OrderStatus(5, nameof(Shipped).ToLowerInvariant());
    public static OrderStatus Cancelled = new OrderStatus(6, nameof(Cancelled).ToLowerInvariant());

    public OrderStatus(int id, string name) : base(id, name)
    {
    }
}
```

### <a id = "领域服务">领域服务</a>

是领域模型的操作者, 被用来处理业务逻辑, 它是无状态的, 状态由领域对象来保存, 提供面向应用层的服务, 完成封装领域知识, 供应用层使用。与应用服务不同的是, 应用服务仅负责编排和转发, 它将要实现的功能委托给一个或多个领域对象来实现, 它本身只负责处理业务用例的执行顺序以及结果的拼装, 在应用服务中不应该包含业务逻辑

继承`IDomainService`的类被标记为领域服务, 领域服务支持从DI获取, 其中提供了`EventBus` (用于提供发送领域事件)

``` C#
public class PaymentDomainService : DomainService
{
    private readonly ILogger<PaymentDomainService> _logger;

    public PaymentDomainService(IDomainEventBus eventBus, ILogger<PaymentDomainService> logger) : base(eventBus)
    {
        _logger = logger;
    }

    public async Task StatusChangedAsync(Aggregate.Payment payment)
    {
        IIntegrationDomainEvent orderPaymentDomainEvent;

        if (payment.Succeeded)
        {
            orderPaymentDomainEvent = new OrderPaymentSucceededDomainEvent(payment.OrderId);
        }
        else
        {
            orderPaymentDomainEvent = new OrderPaymentFailedDomainEvent(payment.OrderId);
        }

        _logger.LogInformation(
            "----- Publishing integration event: {IntegrationEventId} from {AppName} - ({@IntegrationEvent})", 
            orderPaymentDomainEvent.GetEventId(), 
            Program.AppName, 
            orderPaymentDomainEvent);

        await EventBus.PublishAsync(orderPaymentDomainEvent);
    }
}
```

### <a id = "规约">规约</a>

它被用于查询规范模式定义对象中的查询, 例如:

``` C#
public class OrderSpecification : SpecificationBase<Order>
{
    public OrderSpecification(OrderStatus status) : base(o => o.OrderStatus == status)
    {
    }

    public override bool IsSatisfiedBy(Order obj) => WhereExpression.Compile()(obj);
}

public IEnumerable<Order> List(ISpecification<Order> spec)
{
    // fetch a Queryable that includes all expression-based includes
    var queryableResultWithIncludes = spec.Includes
        .Aggregate(_dbContext.Set<Order>().AsQueryable(),
            (current, include) => current.Include(include));

    // modify the IQueryable to include any string-based include statements
    var secondaryResult = spec.IncludeStrings
        .Aggregate(queryableResultWithIncludes,
            (current, include) => current.Include(include));

    // return the result of the query using the specification's criteria expression
    return secondaryResult
        .Where(spec.WhereExpression)
        .AsEnumerable();
}
``` 

> [参考地址](https://docs.microsoft.com/zh-cn/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/infrastructure-persistence-layer-implementation-entity-framework-core)

### <a id = "工作单元">工作单元</a>

安装`Masa.Contrib.Data.UoW.EFCore`

``` powershell
dotnet add package Masa.Contrib.Data.UoW.EFCore
```

实现仓储对象的持久化, 通过工作单元实现原子性, 要么全部成功, 要么全部失败

通过`DI`获取到`IUnitOfWork`后可进行保存、提交或者回滚操作

``` C#
public async Task CreateAsync(IUnitOfWork unitOfWork, IRepository<Order, Guid> orderRepository,Order order)
{
    await orderRepository.AddAsync(order);
    await unitOfWork.SaveChangesAsync();
    await unitOfWork.CommitAsync();
}

```

## 源码解读

### IRepository

* AddAsync(TEntity entity, CancellationToken cancellationToken = default): 添加数据
* AddRangeAsync(IEnumerable\<TEntity\> entities, CancellationToken cancellationToken = default): 批量添加数据
* UpdateAsync(TEntity entity, CancellationToken cancellationToken = default): 更新数据
* UpdateRangeAsync(IEnumerable\<TEntity\> entities, CancellationToken cancellationToken = default): 批量更新数据
* RemoveAsync(TEntity entity, CancellationToken cancellationToken = default): 移除数据
* RemoveRangeAsync(IEnumerable\<TEntity\> entities, CancellationToken cancellationToken = default): 批量移除数据
* RemoveAsync(Expression\<Func\<TEntity, bool\>\> predicate, CancellationToken cancellationToken = default): 根据条件删除数据
* FindAsync(IEnumerable\<KeyValuePair\<string, object\>\> keyValues, CancellationToken cancellationToken = default): 根据主键id名以及id值得到符合条件的实体, 如果符合条件的有多个, 则取第一个, 如果未发现符合条件的实体, 则返回`null`
* FindAsync(Expression\<Func\<TEntity, bool\>\> predicate, CancellationToken cancellationToken = default): 根据条件返回符合条件的实体, 如果符合条件的有多个, 则取第一个, 如果未发现符合条件的实体, 则返回`null`
* GetListAsync(CancellationToken cancellationToken = default): 返回所有数据集合
* GetListAsync(string sortField, bool isDescending = true, CancellationToken cancellationToken = default): 获取数据集合，并根据指定字段降序或者升序排列
* GetListAsync(Expression\<Func\<TEntity, bool\>\> predicate, CancellationToken cancellationToken = default): 根据条件返回数据集合
* GetListAsync(Expression\<Func\<TEntity, bool\>\> predicate, string sortField, bool isDescending = true, CancellationToken cancellationToken = default): 根据条件得到数据集合, 并根据指定字段降序或者升序排列
* GetCountAsync(CancellationToken cancellationToken = default): 得到总数量
* GetCountAsync(Expression\<Func\<TEntity, bool\>\> predicate, CancellationToken cancellationToken = default): 得到满足条件数量
* GetPaginatedListAsync(int skip, int take, string sortField, bool isDescending = true, CancellationToken cancellationToken = default): 得到分页列表 (skip: 跳过多少条, take: 取多少条, sortField: 排序字段, isDescending: 是否降序)
* GetPaginatedListAsync(int skip, int take, Dictionary\<string, bool\>? sorting = null, CancellationToken cancellationToken = default): 得到分页列表 (skip: 跳过多少条, take: 取多少条, sorting: 支持多字段排序)
* GetPaginatedListAsync(Expression\<Func\<TEntity, bool\>\> predicate, int skip, int take, string sortField, bool isDescending = true, CancellationToken cancellationToken = default): 根据条件得到分页列表 (skip: 跳过多少条, take: 取多少条, sortField: 排序字段, isDescending: 是否降序)
* GetPaginatedListAsync(Expression\<Func<TEntity, bool\>\> predicate, int skip, int take, Dictionary<string, bool>? sorting = null, CancellationToken cancellationToken = default): 根据条件得到分页列表 (skip: 跳过多少条, take: 取多少条, sorting: 支持多字段排序)
* GetPaginatedListAsync(PaginatedOptions options, CancellationToken cancellationToken = default): 得到分页列表
* GetPaginatedListAsync(Expression\<Func<TEntity, bool\>\> predicate, PaginatedOptions options, CancellationToken cancellationToken = default): 根据条件得到分页列表

> `FindAsync`方法将忽略软删除进行查询, 其余方法不进行特殊处理

### IDomainEventBus

* Enqueue\<TDomainEvent\>(TDomainEvent @event): 领域事件入队
* PublishQueueAsync(): 发布领域事件
* AnyQueueAsync(): 是否存在领域事件

### IDomainService

* EventBus: 返回`IDomainEventBus`

## 参考文献

* [MASA Framework - DDD设计(1)](https://blogs.masastack.com/2022/02/11/masa/framework/design/2.MASA%20Framework%20-%20DDD%E8%AE%BE%E8%AE%A1%EF%BC%881%EF%BC%89/)
* [MASA Framework - DDD设计(2)](https://blogs.masastack.com/2022/02/12/masa/framework/design/3.MASA%20Framework%20-%20DDD%E8%AE%BE%E8%AE%A1%EF%BC%882%EF%BC%89/)
* [DDD 概念参考](https://domain-driven-design.org/zh/ddd-concept-reference.html)
* [DAO与Repository有什么区别](https://stackoverflow.com/questions/8550124/what-is-the-difference-between-dao-and-repository-patterns)