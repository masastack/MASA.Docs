## 聚合

是一组相关对象的集合, 作为一个整体被外界访问, 聚合根具有全局标识, 在全局中它是唯一的, 而实体在这个聚合内部才是唯一的

## 聚合根

聚合根继承`IAggregateRoot`, 一般我们的聚合根继承`AggregateRoot<TKey>`, 因为它提供了一个类型为`TKey`的主键`id`, 通常情况下这足够我们使用了, 如:

```csharp
public class Order: AggregateRoot<int>
{
    private DateTime _orderDate;

    public Address Address { get; private set; }

    public int? GetBuyerId => _buyerId;
    private int? _buyerId;

    public OrderStatus OrderStatus { get; private set; }
    private int _orderStatusId;

    private string _description;

    private bool _isDraft;

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

在聚合根中被允许发布[`领域事件`](/framework/building-blocks/ddd/domain-event), 它将在工作单元提交前执行, 例如: 在`Order`的构造函数中添加了一个订单状态为已提交的领域事件, 我们可以在项目的其他地方定义其`Handler`实现业务解耦

## 其它

除此之外, 我们还提供了支持审计的功能, 继承`IAuditEntity`接口的类拥有`Creator` (创建人)、`CreationTime` (创建时间)、`Modifier` (修改人)、`ModificationTime` (修改时间), 以及继承`ISoftDelete`接口的类拥有软删除功能, 我们可以根据需要自行继承对应的接口, 但为了方便使用, 我们也提供了以下类:

* AggregateRoot: 聚合根基类
* AuditAggregateRoot: 拥有审计功能的聚合根基类
* FullAggregateRoot: 拥有审计、软删除功能的聚合根基类