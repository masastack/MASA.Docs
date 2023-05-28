e, order.Name);
       Assert.AreEqual(request.OrderItem.Name, order.OrderItem.Name);
       Assert.AreEqual(request.OrderItem.Price, order.OrderItem.Price);
   }
   ```

   :::

   ::: code-group-item 结果

   ```csharp l:14
   public class Order
   {
       public string Name { get; set; }
       public OrderItem OrderItem { get; set; }
   }

   public class OrderItem
   {
       public OrderItem(string name, decimal price)
       {
           Name = name;
           Price = price;
       }

       public string Name { get; set; }
       public decimal Price { get; set; }
   }
   ```

   :::
   ::::

## 特性

- 自动获取并使用最佳构造函数映射
- 支持嵌套映射
- 映射器可通过 DI 注入
- 支持自定义映射规则

## 更多信息

请参阅 [Mapster 文档](https://github.com/MapsterMapper/Mapster/blob/master/docs/README_CN.md) 以获取更多信息。; set; }
   
       public OrderItem(string name, decimal price, int number)
       {
           Name = name;
           Price = price;
           Number = number;
       }
   }
   ```

   :::
   :::

   The above code is a unit test for a C# program that tests the functionality of the `Order` and `OrderItem` classes. The test creates an `OrderItem` object and passes it to the `Order` constructor along with a name. The test then asserts that the `Order` object has the correct name, contains one `OrderItem`, and has a total price of 49.9.

   The `Order` class has properties for the name, total price, and a list of `OrderItem` objects. It has two constructors, one that takes only a name and another that takes a name and an `OrderItem` object. The second constructor initializes the `OrderItems` list with the passed `OrderItem` and calculates the total price based on the price and number of the `OrderItem`.

   The `OrderItem` class has properties for the name, price, and number of items. It has a constructor that takes values for all three properties.

   Overall, this code tests the basic functionality of the `Order` and `OrderItem` classes and ensures that they are working as intended.; set; }
       
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

   :::
   ::::

## Advanced

### Mapping Rules

* If the target object does not have a constructor: use the empty constructor and map to fields and properties.

* If the target object has multiple constructors: find the best constructor to map to.

    > Best constructor: search for the target object constructor parameters in descending order of the number of parameters, and the parameter names are the same (case-insensitive) and the parameter types are the same as the source object properties.

### Extend Map

To facilitate the use of object mapping capabilities, instead of having to first obtain `IMapper` through `DI`, **static extension methods** are provided.

1. Install `Masa.BuildingBlocks.Data.MappingExtensions`

   ```shell Terminal
   dotnet add package Masa.BuildingBlocks.Data.MappingExtensions
   ```

2. Register the `Mapster` mapper

   ```csharp Program.cs
   builder.Services.AddMapster();
   ```

3. Use mapping

   ```csharp l:8
   public void Main()
   {
       var request = new
       {
           Name = "apple",
           Price = 3.5m,
           Number = 2
       };
       
       var orderItem = request.Adapt<OrderItem>();
   }
   ```

   ::: tip
   The `Adapt` method is a static extension method provided by `Mapster`. It maps the source object to the target object according to the mapping rules.
   :::"教你手把手学习Dapr……",
           OrderItem = new OrderItem("教你手把手学习Dapr", 49.9m)
       };
       var order = request.Map<Order>();// 将request映射到新的对象
   }
   ```

   > 扩展Map和对象映射的提供者并没有强绑定关系。在项目中注入哪个提供者，映射方法就会使用哪个提供者的映射方法。