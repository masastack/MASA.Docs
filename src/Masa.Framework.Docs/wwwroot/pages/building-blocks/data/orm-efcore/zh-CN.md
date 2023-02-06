## 概念

提供了基于[`Entity Framework Core`](https://learn.microsoft.com/zh-cn/ef/core/)的ORM框架, 可以根据使用的`数据库`引用对应的包, 目前支持:

* [SqlServer](#SqlServer)
* [Pomelo.MySql](#Pomelo.MySql)：如果您使用的是mysql，建议使用
* [MySql](#MySql)
* [Sqlite](#Sqlite)
* [Cosmos](#Cosmos)
* [InMemory](#InMemory)
* [Oracle](#Oracle)
* [PostgreSql](#PostgreSql)

## 使用

不同的数据库在使用上差别不大, 仅需要更换引用包以及替换使用数据库代码即可, 完整例子如下:

1. 安装`Masa.Contrib.Data.EFCore.SqlServer`、`Masa.Contrib.Data.Contracts`

```powershelll
Install-Package Masa.Contrib.Data.EFCore.SqlServer //这里以SqlServer举例，也可自行选择其它实现
Install-Package Masa.Contrib.Data.Contracts //使用规约提供的数据过滤、软删除能力，如果不需要可不引用
```

2. 配置`appsettings.json`

``` appsettings.json
{
  "ConnectionStrings": {
    "DefaultConnection": "server=localhost;uid=sa;pwd=P@ssw0rd;database=catalog"
  }
}
```

3. 声明`CatalogDbContext`并继承`MasaDbContext`

```csharp
public class CatalogDbContext : MasaDbContext<CatalogDbContext>
{
    public CatalogDbContext(MasaDbContextOptions<CatalogDbContext> options) : base(options)
    {

    }
}
```

4. 注册`MasaDbContext`

``` C#
builder.Services.AddMasaDbContext<CatalogDbContext>(optionsBuilder =>
{
    optionsBuilder.UseFilter();//启用数据过滤，由`Masa.Contrib.Data.Contracts`提供
    optionsBuilder.UseSqlServer();//使用SqlServer数据库，也可自行选择其它实现
});
```

### SqlServer

1. 安装`Masa.Contrib.Data.EFCore.SqlServer`

``` powershelll
Install-Package Masa.Contrib.Data.EFCore.SqlServer
```

2. 配置`appsettings.json`

``` appsettings.json
{
  "ConnectionStrings": {
    "DefaultConnection": "server=localhost;uid=sa;pwd=P@ssw0rd;database=catalog"
  }
}
```

3. 注册`MasaDbContext`

``` C#
builder.Services.AddMasaDbContext<CatalogDbContext>(optionsBuilder => optionsBuilder.UseSqlServer());
```

### Pomelo.MySql

基于[`Pomelo.EntityFrameworkCore.MySql`](https://www.nuget.org/packages/Pomelo.EntityFrameworkCore.MySql)的扩展, 如果您使用的是mysql，建议使用它

1. 安装`Masa.Contrib.Data.EFCore.Pomelo.MySql`

``` powershelll
Install-Package Masa.Contrib.Data.EFCore.Pomelo.MySql
```

2. 配置appsettings.json

``` appsettings.json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;port=3306;Database=catalog;Uid=myUsername;Pwd=P@ssw0rd;"
  }
}
```

3. 注册`MasaDbContext`

``` C#
builder.Services.AddMasaDbContext<CatalogDbContext>(optionsBuilder => optionsBuilder.UseMySql(new MySqlServerVersion("5.7.26")));
```

### MySql

基于[`MySql.EntityFrameworkCore`](https://www.nuget.org/packages/MySql.EntityFrameworkCore)的扩展

1. 安装`Masa.Contrib.Data.EFCore.MySql`

``` powershelll
Install-Package Masa.Contrib.Data.EFCore.MySql
```

2. 配置appsettings.json

``` appsettings.json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;port=3306;Database=catalog;Uid=myUsername;Pwd=P@ssw0rd;"
  }
}
```

3. 注册`MasaDbContext`

``` C#
builder.Services.AddMasaDbContext<CatalogDbContext>(optionsBuilder => optionsBuilder.UseMySQL());
```

### Sqlite

1. 安装`Masa.Contrib.Data.EFCore.Sqlite`

``` powershelll
Install-Package Masa.Contrib.Data.EFCore.Sqlite
```

2. 配置appsettings.json

``` appsettings.json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=test.db;"
  }
}
```

3. 注册`MasaDbContext`

``` C#
builder.Services.AddMasaDbContext<CatalogDbContext>(optionsBuilder => optionsBuilder.UseSqlite());
```

### Cosmos

1. 安装`Masa.Contrib.Data.EFCore.Cosmos`

``` powershelll
Install-Package Masa.Contrib.Data.EFCore.Cosmos
```

2. 配置appsettings.json

``` appsettings.json
{
  "ConnectionStrings": {
    "DefaultConnection": "AccountKey=AccountKey;AccountEndpoint=AccountEndpoint;Database=Database" //或"ConnectionString=ConnectionString;Database=Database;"
  }
}
```

3. 注册`MasaDbContext`

``` C#
builder.Services.AddMasaDbContext<CatalogDbContext>(optionsBuilder => optionsBuilder.UseCosmos());
```

### InMemory

1. 安装`Masa.Contrib.Data.EFCore.InMemory`

``` powershelll
Install-Package Masa.Contrib.Data.EFCore.InMemory
```

2. 配置appsettings.json

``` appsettings.json
{
  "ConnectionStrings": {
    "DefaultConnection": "catalog"
  }
}
```

3. 注册`MasaDbContext`

``` C#
builder.Services.AddMasaDbContext<CatalogDbContext>(optionsBuilder => optionsBuilder.UseInMemoryDatabase());
```

### Oracle

1. 安装`Masa.Contrib.Data.EFCore.Oracle`

``` powershelll
Install-Package Masa.Contrib.Data.EFCore.Oracle
```

2. 配置appsettings.json

``` appsettings.json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=MyOracleDB;Integrated Security=yes;"
  }
}
```

3. 注册`MasaDbContext`

``` C#
builder.Services.AddMasaDbContext<CatalogDbContext>(optionsBuilder => optionsBuilder.UseOracle());
```

### PostgreSql

1. 安装`Masa.Contrib.Data.EFCore.PostgreSql`

``` powershelll
Install-Package Masa.Contrib.Data.EFCore.PostgreSql
```

2. 配置appsettings.json

``` appsettings.json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=myserver;Username=sa;Password=P@ssw0rd;Database=catalog;"
  }
}
```

3. 注册`MasaDbContext`

``` C#
builder.Services.AddMasaDbContext<CatalogDbContext>(optionsBuilder => optionsBuilder.UseNpgsql());
```