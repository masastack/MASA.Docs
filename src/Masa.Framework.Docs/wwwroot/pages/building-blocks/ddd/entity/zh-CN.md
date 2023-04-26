## 实体

实体是领域模型中的领域对象，它具有连续性，与值对象之间的主要区别:

* 比较: 实体是使用标识Id来比较指定; 值对象使用结构比较，结构属性的值如果相同则是同一个
* 可变性: 实体是可变的，值对象不可变
* 生命周期: 实体有生命周期，值对象没有生命周期

实体可以随时间跟踪信息，而值对象更像是一个时间点的快照

## 实体类

实体都继承自`IEntity`，它需要实现`GetKeys()`方法，或者实现`IEntity<TKey>`,它提供了一个`TKey`类型的主键id，如:

```csharp
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

> `Entity<Guid>`继承了`IEntity<Guid>`，提供了一个主键为`Guid`类型的主键

如果你的实体Id类型为其它类型，则可通过修改继承`Entity<TKey>`来调整

## 复合主键

如果你需要的是[`复合主键`](https://learn.microsoft.com/zh-cn/ef/core/modeling/keys?tabs=data-annotations#alternate-keys)，则可以继承`Entity`并重写`GetKeys()`方法以完成复合主键

```csharp
public class UserRole : Entity
{
    public Guid UserId { get; set; }

    public Guid RoleId { get; set; }
    
    public DateTime CreationTime { get; set; }

    public UserRole()
    {
            
    }
    
    public override IEnumerable<(string Name, object Value)> GetKeys()
    {
        yield return ("UserId", UserId);
        yield return ("RoleId", RoleId);
    }
}
```

## 其它

除此之外，我们还提供了支持审计的功能，继承`IAuditEntity`接口的类拥有`Creator` (创建人)、`CreationTime` (创建时间)、`Modifier` (修改人)、`ModificationTime` (修改时间)，以及继承`ISoftDelete`接口的类拥有软删除功能, 我们可以根据需要自行继承对应的接口, 但为了方便使用, 我们也提供了以下类:

* Entity: 实体基类
* AuditEntity: 拥有审计功能的实体基类
* FullEntity: 拥有审计、软删除功能的实体基类

同时支持审计功能的实体, 有一些很好用的小功能, 比如: 我们将根据当前操作类型对创建时间以及修改时间完成自动赋值操作 (时间使用`UTC +0` 时区), 同时如果使用了[`用户身份`](/framework/building-blocks/identity/overview)功能, 创建人、修改人框架也会完成自动赋值操作