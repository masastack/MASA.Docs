## 枚举类

提供枚举类基类, 使用枚举类来代替使用枚举, [查看原因](https://learn.microsoft.com/zh-cn/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/enumeration-classes-over-enum-types), 例如:

```csharp
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

### 根据值得到枚举对象

```csharp
Enumeration.FromValue<OrderStatus>(1);
```

### 根据描述得到枚举对象

```csharp
Enumeration.FromDisplayName<OrderStatus>(nameof(Submitted).ToLowerInvariant());
```