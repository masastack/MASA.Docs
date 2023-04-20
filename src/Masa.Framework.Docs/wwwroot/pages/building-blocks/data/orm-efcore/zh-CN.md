# Entity Framework Core (EFCore)

提供了基于[`Entity Framework Core`](https://learn.microsoft.com/zh-cn/ef/core/)的数据访问技术, 它不依赖任何的DBMS, 根据实际使用的DBMS引用安装对应的包即可, 目前支持:

* [SqlServer](#SqlServer)
* [Pomelo.MySql](#Pomelo.MySql)：如果您使用的是mysql，建议使用
* [MySql](#MySql)
* [Sqlite](#Sqlite)
* [Cosmos](#Cosmos)
* [InMemory](#InMemory)
* [Oracle](#Oracle)
* [PostgreSql](#PostgreSql)

## 使用

### 必要条件

安装**Masa.Contrib.Data.EFCore.XXX**, 以**SqlServer**数据库为例:

```shell
dotnet add package Masa.Contrib.Data.EFCore.SqlServer
```

> 不同的数据库在使用上差别不大, 仅需要更换引用的包以及替换注册数据上下文时使用数据库代码即可

### 创建DbContext

与直接使用`DbContext`类似, 但它<font color=Red>需要继承 MasaDbContext\<TDbContext\></font>或<font color=Red>MasaDbContext</font>

  :::: code-group
  ::: code-group-item 方案1: MasaDbContext<TDbContext> (推荐)
  ```csharp
  public class CatalogDbContext : MasaDbContext<CatalogDbContext>
  {
      public CatalogDbContext(MasaDbContextOptions<CatalogDbContext> options) : base(options)
      {
      }
  }
  ```
  :::
  ::: code-group-item 方案2: MasaDbContext
  ```csharp
  public class CatalogDbContext : MasaDbContext
  {
      public CatalogDbContext(MasaDbContextOptions masaDbContextOptions)
          : base(masaDbContextOptions)
      {
  
      }
  }
  ```
  :::
  ::::

<app-alert type="warning" content="在最新版本中, MasaDbContext支持使用无参构造函数, 但必须要重载OnConfiguring"></app-alert>

### 注册DbContext

注册数据上下文通常使用以下两种方式:

* UseXXX时不指定数据库连接字符串地址

  :::: code-group
  ::: code-group-item 1. 配置 appsettings.json
  ```json
  {
    "ConnectionStrings": {
      "DefaultConnection": "server=localhost;uid=sa;pwd=P@ssw0rd;database=catalog"
    }
  }
  ```
  :::
  ::: code-group-item 2. 注册MasaDbContext
  ```csharp
  var builder = WebApplication.CreateBuilder(args);
  
  builder.Services.AddMasaDbContext<CatalogDbContext>(optionsBuilder =>
  {
      optionsBuilder.UseSqlServer();
  });

  var app = builder.Build();
  
  app.Run();
  ```
  :::
  ::::

* UseXXX时指定数据库连接字符串地址

  ```csharp
  var builder = WebApplication.CreateBuilder(args);
  
  builder.Services.AddMasaDbContext<CatalogDbContext>(optionsBuilder =>
  {
      optionsBuilder.UseSqlServer("{Replace-Your-ConnectionString}");
  });

  var app = builder.Build();
  
  app.Run();
  ```

## 其它方式指定配置数据库连接字符串

通过使用本地配置文件, 我们可以在对应环境的`appsettings.json`中存储数据库连接字符串, 这将使得我们调试项目、发布项目变得更加轻松. 除了使用本地配置文件之外我们还可以通过以下方式来传入对应的数据库链接地址:

### 指定数据库连接字符串

```csharp
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddMasaDbContext<CatalogDbContext>(optionsBuilder =>
{
    optionsBuilder.UseSqlServer("server=localhost;uid=sa;pwd=P@ssw0rd;database=catalog");
});

var app = builder.Build();

app.Run();
```

> 通常情况下不同环境使用的数据库地址是不同的, 如果使用指定连接字符串的方式, 那么它将变得不易维护 

### 选项模式

```csharp
var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<ConnectionStrings>(connectionString =>
{
    connectionString.DefaultConnection = "{Replace-Your-ConnectionString}";
});

builder.Services.AddMasaDbContext<CatalogDbContext>(optionsBuilder =>
{
    optionsBuilder.UseSqlServer();
});

var app = builder.Build();

app.Run();
```

> 借助选项卡模式, 通过配置数据上下文别名与数据库连接字符串的对应关系实现

<app-alert type="warning" content="MasaConfiguration支持选项模式, 我们可通过简单配置映射关系使用分布式配置中心的数据库连接字符串, 以满足配置热更新的效果, 详情可查看[文档](/framework/building-blocks/configuration/overview)"></app-alert>

## 高级

### 无参构造函数的MasaDbContext

新版本的`MasaDbContext`支持其<font color=Red>派生类 (子类)使用无参数的构造函数</font>, 但其派生类必须<font color=Red>重写 OnConfiguring</font>方法, 以**SqlServer**数据库为例, 完整代码如下:

  :::: code-group
  ::: code-group-item 1. 安装包
  ``` shell
  Install-Package Masa.Contrib.Data.EFCore.SqlServer
  ```
  :::
  ::: code-group-item 2. 创建 CatalogDbContext
  ```csharp
  public class CatalogDbContext : MasaDbContext<CatalogDbContext>
  {
      protected override void OnConfiguring(MasaDbContextOptionsBuilder optionsBuilder)
      {
          optionsBuilder.UseSqlite("Data Source=test.db;");
      }
  }
  ```
  :::
  ::: code-group-item 3. 注册 MasaDbContext
  ```csharp
  var builder = WebApplication.CreateBuilder(args);
  
  builder.Services.AddMasaDbContext<CatalogDbContext>();
  
  var app = builder.Build();
  
  app.Run();
  ```
  :::
  ::::

虽然`MasaDbContext`支持无参数构造函数创建数据上下文, 但我们不推荐使用, 原因如下:

1. OnConfiguring方法中不支持启用软删除等条件, 如果需要使用软删除, 除了自定义数据上下文<font Color=Red>需要重载 OnConfiguring</font>, 还需要在<font Color=Red>注册MasaDbContext时启用过滤</font>

  ```csharp
  var builder = WebApplication.CreateBuilder(args);
  
  builder.Services.AddMasaDbContext<CatalogDbContext>(optionsBuilder => optionsBuilder.UseFilter());
  
  var app = builder.Build();
  
  app.Run();
  ```
  
  > 软删除、数据过滤等功能由`Masa.Contrib.Data.Contracts`提供, 如需使用, 请安装nuget包

2. 在集成事件总线、隔离性等组件中需要得到默认数据库连接字符串地址, 还需额外配置:

  ```csharp
  builder.Services.Configure<ConnectionStrings>(connectionString =>
  {
      connectionString.DefaultConnection = "{Replace-Your-ConnectionString}";
  });
  ```

## 其它数据库

不同数据库的连接字符串略有差别, 可参考[文档](https://www.connectionstrings.com)选择对应的数据库字符串即可

### SqlServer

  :::: code-group
  ::: code-group-item 1. 安装包
  ``` shell
  Install-Package Masa.Contrib.Data.EFCore.SqlServer
  ```
  :::
  ::: code-group-item 2. 配置 appsettings.json
  ```json
  {
    "ConnectionStrings": {
      "DefaultConnection": "server=localhost;uid=sa;pwd=P@ssw0rd;database=catalog"
    }
  }
  ```
  :::
  ::: code-group-item 3. 注册 MasaDbContext
  ```csharp
  var builder = WebApplication.CreateBuilder(args);
  
  builder.Services.AddMasaDbContext<CatalogDbContext>(optionsBuilder => optionsBuilder.UseSqlServer());
  
  var app = builder.Build();
  
  app.Run();
  ```
  :::
  ::::

### Pomelo.MySql

  :::: code-group
  ::: code-group-item 1. 安装包
  ``` shell
  Install-Package Masa.Contrib.Data.EFCore.Pomelo.MySql
  ```
  :::
  ::: code-group-item 2. 配置 appsettings.json
  ```json
  {
    "ConnectionStrings": {
      "DefaultConnection": "Server=localhost;port=3306;Database=identity;Uid=myUsername;Pwd=P@ssw0rd;"
    }
  }
  ```
  :::
  ::: code-group-item 3. 注册 MasaDbContext
  ```csharp
  var builder = WebApplication.CreateBuilder(args);
  
  builder.Services.AddMasaDbContext<CatalogDbContext>(optionsBuilder => optionsBuilder.UseMySql(new MySqlServerVersion("5.7.26"));
  
  var app = builder.Build();
  
  app.Run();
  ```
  :::
  ::::

> 基于[`Pomelo.EntityFrameworkCore.MySql`](https://www.nuget.org/packages/Pomelo.EntityFrameworkCore.MySql)的扩展, 如果您使用的是mysql，建议使用它

### MySql

  :::: code-group
  ::: code-group-item 1. 安装包
  ``` shell
  Install-Package Masa.Contrib.Data.EFCore.MySql
  ```
  :::
  ::: code-group-item 2. 配置 appsettings.json
  ```json
  {
    "ConnectionStrings": {
      "DefaultConnection": "Server=localhost;port=3306;Database=identity;Uid=myUsername;Pwd=P@ssw0rd;"
    }
  }
  ```
  :::
  ::: code-group-item 3. 注册 MasaDbContext
  ```csharp
  var builder = WebApplication.CreateBuilder(args);
  
  builder.Services.AddMasaDbContext<CatalogDbContext>(optionsBuilder => optionsBuilder.UseMySQL());
  
  var app = builder.Build();
  
  app.Run();
  ```
  :::
  ::::

基于[`MySql.EntityFrameworkCore`](https://www.nuget.org/packages/MySql.EntityFrameworkCore)的扩展, 不推荐使用

### Sqlite

  :::: code-group
  ::: code-group-item 1. 安装包
  ``` shell
  Install-Package Masa.Contrib.Data.EFCore.Sqlite
  ```
  :::
  ::: code-group-item 2. 配置 appsettings.json
  ```json
  {
    "ConnectionStrings": {
      "DefaultConnection": "Data Source=test.db;"
    }
  }
  ```
  :::
  ::: code-group-item 3. 注册 MasaDbContext
  ```csharp
  var builder = WebApplication.CreateBuilder(args);
  
  builder.Services.AddMasaDbContext<CatalogDbContext>(optionsBuilder => optionsBuilder.UseSqlite());
  
  var app = builder.Build();
  
  app.Run();
  ```
  :::
  ::::

### Cosmos

  :::: code-group
  ::: code-group-item 1. 安装包
  ``` shell
  Install-Package Masa.Contrib.Data.EFCore.Cosmos
  ```
  :::
  ::: code-group-item 2. 配置 appsettings.json
  ```json
  {
    "ConnectionStrings": {
      "DefaultConnection": "AccountKey=AccountKey;AccountEndpoint=AccountEndpoint;Database=Database"
    }
  }
  ```
  :::
  ::: code-group-item 3. 注册 MasaDbContext
  ```csharp
  var builder = WebApplication.CreateBuilder(args);
  
  builder.Services.AddMasaDbContext<CatalogDbContext>(optionsBuilder => optionsBuilder.UseCosmos());
  
  var app = builder.Build();
  
  app.Run();
  ```
  :::
  ::::

### InMemory

  :::: code-group
  ::: code-group-item 1. 安装包
  ``` shell
  Install-Package Masa.Contrib.Data.EFCore.InMemory
  ```
  :::
  ::: code-group-item 2. 配置 appsettings.json
  ```json
  {
    "ConnectionStrings": {
      "DefaultConnection": "identity"
    }
  }
  ```
  :::
  ::: code-group-item 3. 注册 MasaDbContext
  ```csharp
  var builder = WebApplication.CreateBuilder(args);
  
  builder.Services.AddMasaDbContext<CatalogDbContext>(optionsBuilder => optionsBuilder.UseInMemoryDatabase());
  
  var app = builder.Build();
  
  app.Run();
  ```
  :::
  ::::

### Oracle

  :::: code-group
  ::: code-group-item 1. 安装包
  ``` shell
  Install-Package Masa.Contrib.Data.EFCore.Oracle
  ```
  :::
  ::: code-group-item 2. 配置 appsettings.json
  ```json
  {
    "ConnectionStrings": {
      "DefaultConnection": "Data Source=MyOracleDB;Integrated Security=yes;"
    }
  }
  ```
  :::
  ::: code-group-item 3. 注册 MasaDbContext
  ```csharp
  var builder = WebApplication.CreateBuilder(args);
  
  builder.Services.AddMasaDbContext<CatalogDbContext>(optionsBuilder => optionsBuilder.UseOracle());
  
  var app = builder.Build();
  
  app.Run();
  ```
  :::
  ::::

### PostgreSql

  :::: code-group
  ::: code-group-item 1. 安装包
  ``` shell
  Install-Package Masa.Contrib.Data.EFCore.PostgreSql
  ```
  :::
  ::: code-group-item 2. 配置 appsettings.json
  ```json
  {
    "ConnectionStrings": {
      "DefaultConnection": "Host=myserver;Username=sa;Password=P@ssw0rd;Database=identity;"
    }
  }
  ```
  :::
  ::: code-group-item 3. 注册 MasaDbContext
  ```csharp
  var builder = WebApplication.CreateBuilder(args);
  
  builder.Services.AddMasaDbContext<CatalogDbContext>(optionsBuilder => optionsBuilder.UseNpgsql());
  
  var app = builder.Build();
  
  app.Run();
  ```
  :::
  ::::
  
## 常见问题

### 1. 如何修改 XXXDbContext 所读取的节点名称?

通过`ConnectionStringName`特性可自定义当前上下文读取的节点, 例如:

```shell
[ConnectionStringName("Catalog")]
public class CatalogDbContext : MasaDbContext<CatalogDbContext>
{
    public CatalogDbContext(MasaDbContextOptions<CatalogDbContext> options) : base(options)
    {
    }
}
```

> 修改后读取节点为`Catalog`, 详细文档可[查看](/framework/building-blocks/data/connection-strings)

```json
{
  "ConnectionStrings": {
    "Catalog": "{Replace-Your-Read-DbConnectionString}"
  }
}
```