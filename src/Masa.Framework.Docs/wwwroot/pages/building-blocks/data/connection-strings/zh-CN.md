## 连接字符串

默认情况下, 数据上下文读取的配置节点为:

``` appsettings.json
{
  "ConnectionStrings": {
    "DefaultConnection": "{Replace-Your-ConnectionString}"
  }
}
```
### 设置数据上下文所使用的数据库链接字符串名称

如果希望更改默认读取的节点, 可通过为当前上下文增加[ConnectionStringName]特性来修改当前数据上下文读取的节点

1. 修改`appsettings.json`, 并配置默认数据库地址以及读库地址

``` appsettings.json
{
  "ConnectionStrings": {
    "DefaultConnection": "{Replace-Your-ConnectionString}",
    "ReadDbConnection": "{Replace-Your-Read-DbConnectionString}"
  }
}
```

当数据上下文未指定[ConnectionStringName]特性时

* 第一个注册的数据上下文默认读取的节点为`DefaultConnection`
* 第二个注册的数据上下文默认读取的节点为当前数据上下文的[完全限定名称](https://learn.microsoft.com/zh-cn/dotnet/api/system.type.fullname) (即 `typeof(CustomDbContext).FullName`)

2. 新建数据上下文

设置读库上下文所属用的数据库链接字符串名称为`ReadDbConnection`

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