## 保存或获取数据

在开发中, 我们需要用到数据库, 以便对数据能进行存储或读取, 下面例子我们将使用`Sqlite`数据库进行数据的存储与读取, 如果你的业务使用的是其它数据库, 可参考[文档](/framework/building-blocks/data/orm-efcore)选择与之匹配的数据库包

1. 安装`Masa.Contrib.Data.EFCore.Sqlite`、`Masa.Contrib.Data.Contracts`

```powershell
dotnet add package Masa.Contrib.Data.EFCore.Sqlite
dotnet add package Masa.Contrib.Data.Contracts
```

`Masa.Contrib.Data.Contracts`提供了[数据过滤](/framework/building-blocks/data/data-filter)的能力, 但它不是必须的

2. 新建数据上下文类`CatalogDbContext.cs`, 并继承`MasaDbContext<TDbContext>`

```csharp
public class CatalogDbContext : MasaDbContext<CatalogDbContext>
{
    public CatalogDbContext(MasaDbContextOptions<CatalogDbContext> options) : base(options)
    {

    }
}
```

3. 配置数据库连接字符串

```appsettings.json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=./Data/Catalog.db;"
  }
}
```

4. 注册数据上下文

```csharp
builder.Services.AddMasaDbContext<CatalogDbContext>(dbContextBuilder =>
{
    dbContextBuilder
        .UseSqlite() //使用Sqlite数据库
        .UseFilter(); //数据数据过滤
});
```

继承`MasaDbContext`的数据库默认使用`ConnectionStrings`节点下的`DefaultConnection`配置, 如果你需要更改默认读取节点可参考[文档](/framework/building-blocks/data/connection-strings)

## 其它

`MasaFramework`并未约束您的项目必须使用[`Entity Framework Core`](https://learn.microsoft.com/zh-cn/ef/core/), 查看已支持的[`ORM`](/framework/building-blocks/data/overview)框架 