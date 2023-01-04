## 连接字符串

默认情况下, 数据上下文读取的配置节点为:

``` appsettings.json
{
  "ConnectionStrings": {
    "DefaultConnection": "{Replace-Your-ConnectionString}"
  }
}
```

如果希望更改默认读取的节点, 可通过自定义特性来修改读取的节点

## ConnectionStringName

我们通过`ConnectionStringName`可用于修改默认读取的节点, 例如当我们使用多数据上下文时, 可以这样做

1. 修改`appsettings.json`, 并配置默认数据库地址以及读库地址

``` appsettings.json
{
  "ConnectionStrings": {
    "DefaultConnection": "{Replace-Your-ConnectionString}",
    "ReadDbConnection": "{Replace-Your-Read-DbConnectionString}"
  }
}
```

2. 新建数据库上下文

```csharp
public class OrderDbContext: MasaDbContext<OrderDbContext>
{
    public OrderReadDbContext(MasaDbContextOptions<OrderDbContext> options) : base(options)
    {
    }
}

[ConnectionStringName("ReadDbConnection")]
public class OrderReadDbContext: MasaDbContext<OrderReadDbContext>
{
    public OrderReadDbContext(MasaDbContextOptions<OrderReadDbContext> options) : base(options)
    {
    }
}
```