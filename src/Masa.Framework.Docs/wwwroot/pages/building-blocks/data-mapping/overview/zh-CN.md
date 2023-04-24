## Data Mapping（数据映射） - 概念

提供对象映射的能力, 通过添加提供者的引用并注册, 即可轻松完成对象映射的能力

目前对象映射的提供者有:

* [Masa.Contrib.Data.Mapping.Mapster](/framework/building-blocks/mapping/mapster): 基于[Mapster](https://github.com/MapsterMapper/Mapster)的扩展, 轻松完成对象映射的能力

## 使用

以[Mapster](/framework/building-blocks/mapping/mapster)的提供者为例

1. 安装`Masa.Contrib.Data.Mapping.Mapster`

``` powershell
dotnet add package Masa.Contrib.Data.Mapping.Mapster
```

2. 注册`Mapster`的映射器

```csharp
builder.Services.AddMapster();
```

3. 映射对象

```csharp
public void Main()
{
    var request = new
    {
        Name = "Teach you to learn Dapr ……",
        OrderItem = new OrderItem("Teach you to learn Dapr hand by hand", 49.9m)
    };
    IMapper mapper;// 通过DI获取
    var order = _mapper.Map<Order>(request);// 将request映射到新的对象
    Assert.IsNotNull(order);
    Assert.AreEqual(request.Name, order.Name);
    Assert.AreEqual(1, order.OrderItems.Count);
    Assert.AreEqual(49.9m, order.TotalPrice);
}

public class Order
{
    public string Name { get; set; }
    public decimal TotalPrice { get; set; }
    public List<OrderItem> OrderItems { get; set; }

    public Order(string name)
    {
        Name = name;
    }
    
    public Order(string name, OrderItem orderItem) : this(name)
    {
        OrderItems = new List<OrderItem> { orderItem };
        TotalPrice = OrderItems.Sum(item => item.Price * item.Number);
    }
}

public class OrderItem
{
    public string Name { get; set; }
    public decimal Price { get; set; }
    public int Number { get; set; }
    
    public OrderItem(string name, decimal price) : this(name, price, 1)
    {
    }

    public OrderItem(string name, decimal price, int number)
    {
        Name = name;
        Price = price;
        Number = number;
    }
}
```

## 高阶用法

通过`IMapper`我们可以很简单的完成对象映射, 但是使用它必须要先获取到`IMapper`, 而它需要通过DI获取, 这样就使得我们在某些地方使用起来变得复杂, 为了解决这一问题, 我们针对`Object`类型做了方法扩展

1. 安装`Masa.BuildingBlocks.Data.MappingExtensions`

``` powershell
dotnet add package Masa.BuildingBlocks.Data.MappingExtensions
```

2. 注册`Mapster`的映射器

```csharp
builder.Services.AddMapster();
```

3. 使用映射

```csharp
public void Main()
{
    var request = new
    {
        Name = "masastack",
        TotalPrice = 10
    };
    var order = request.Map<Order>();// 将request映射到新的对象
}

public class Order
{
    public string Name { get; set; }

    public decimal TotalPrice { get; set; }
}
```

> `Object`类型的方法扩展与对象映射的提供者并没有强绑定关系，项目中注入哪一个提供者，那映射方法就会使用哪一个提供者的映射方法

## 源码解读

提供了映射的抽象`IMapper`, 它支持:

* Map\<TSource, TDestination\>(TSource source, MapOptions? options = null): 根据源类型以及目标类型将源类型对象映射为目标类型并返回
* Map\<TDestination\>(object source, MapOptions? options = null): 根据目标类型将源类型对象转换为目标类型并返回
* Map\<TSource, TDestination\>(TSource source, TDestination destination, MapOptions? options = null): 将源类型映射为目标类型并返回, 在映射过程中, 仅映射符合映射的参数信息, 属于目标类型独有的参数将不会被重新初始化

```csharp
public void Main()
{
    var request = new
    {
        Name = "Jim",
        Age = 18
    };
    var user = new User()
    {
        Name = "Time"
        Description = "Description",
    };
    var newUser = request.Map(user);//使用Mapping扩展
    Assert.IsNotNull(newUser);
    Assert.IsTrue(newUser.Description == "Description");
    Assert.IsTrue(newUser.Name == "Jim");
}

public class User
{
    public string Name { get; set; }

    public string Description { get; set; }
}
```