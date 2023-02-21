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

不同的数据库在使用上差别不大, 仅需要更换引用的包以及替换注册数据上下文时使用数据库代码即可 

### 完整示例

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

```csharp 
builder.Services.AddMasaDbContext<CatalogDbContext>(optionsBuilder =>
{
    optionsBuilder.UseFilter();//启用数据过滤，由`Masa.Contrib.Data.Contracts`提供
    optionsBuilder.UseSqlServer();//使用SqlServer数据库，也可自行选择其它实现
});
```

### 其它数据库

不同数据库的链接字符串略有差别, 根据[文档](https://www.connectionstrings.com)选择对应的数据库字符串即可

#### SqlServer

1. 安装`Masa.Contrib.Data.EFCore.SqlServer`

``` powershelll
Install-Package Masa.Contrib.Data.EFCore.SqlServer
```

2. 注册`MasaDbContext`

```csharp 
builder.Services.AddMasaDbContext<CatalogDbContext>(optionsBuilder => optionsBuilder.UseSqlServer());
```

#### Pomelo.MySql

基于[`Pomelo.EntityFrameworkCore.MySql`](https://www.nuget.org/packages/Pomelo.EntityFrameworkCore.MySql)的扩展, 如果您使用的是mysql，建议使用它

1. 安装`Masa.Contrib.Data.EFCore.Pomelo.MySql`

``` powershelll
Install-Package Masa.Contrib.Data.EFCore.Pomelo.MySql
```

2注册`MasaDbContext`

```csharp 
builder.Services.AddMasaDbContext<CatalogDbContext>(optionsBuilder => optionsBuilder.UseMySql(new MySqlServerVersion("5.7.26")));
```

#### MySql

基于[`MySql.EntityFrameworkCore`](https://www.nuget.org/packages/MySql.EntityFrameworkCore)的扩展

1. 安装`Masa.Contrib.Data.EFCore.MySql`

``` powershelll
Install-Package Masa.Contrib.Data.EFCore.MySql
```

2. 注册`MasaDbContext`

```csharp 
builder.Services.AddMasaDbContext<CatalogDbContext>(optionsBuilder => optionsBuilder.UseMySQL());
```

#### Sqlite

1. 安装`Masa.Contrib.Data.EFCore.Sqlite`

``` powershelll
Install-Package Masa.Contrib.Data.EFCore.Sqlite
```

2. 注册`MasaDbContext`

```csharp 
builder.Services.AddMasaDbContext<CatalogDbContext>(optionsBuilder => optionsBuilder.UseSqlite());
```

#### Cosmos

1. 安装`Masa.Contrib.Data.EFCore.Cosmos`

``` powershelll
Install-Package Masa.Contrib.Data.EFCore.Cosmos
```

2. 注册`MasaDbContext`

```csharp 
builder.Services.AddMasaDbContext<CatalogDbContext>(optionsBuilder => optionsBuilder.UseCosmos());
```

#### InMemory

1. 安装`Masa.Contrib.Data.EFCore.InMemory`

``` powershelll
Install-Package Masa.Contrib.Data.EFCore.InMemory
```

2. 注册`MasaDbContext`

```csharp 
builder.Services.AddMasaDbContext<CatalogDbContext>(optionsBuilder => optionsBuilder.UseInMemoryDatabase());
```

#### Oracle

1. 安装`Masa.Contrib.Data.EFCore.Oracle`

``` powershelll
Install-Package Masa.Contrib.Data.EFCore.Oracle
```

2. 注册`MasaDbContext`

```csharp 
builder.Services.AddMasaDbContext<CatalogDbContext>(optionsBuilder => optionsBuilder.UseOracle());
```

#### PostgreSql

1. 安装`Masa.Contrib.Data.EFCore.PostgreSql`

``` powershelll
Install-Package Masa.Contrib.Data.EFCore.PostgreSql
```

2. 注册`MasaDbContext`

```csharp 
builder.Services.AddMasaDbContext<CatalogDbContext>(optionsBuilder => optionsBuilder.UseNpgsql());
```

### 使用其它方式存储数据库链接字符串

通过使用本地配置文件, 我们可以在对应环境的`appsettings.json`中存储数据库链接字符串, 这将使得我们调试项目、发布项目变得更加轻松. 除了使用本地配置文件之外我们还可以通过以下方式来传入对应的数据库链接地址:

#### 指定数据库链接字符串

```csharp
builder.Services.AddMasaDbContext<CatalogDbContext>(optionsBuilder =>
{
    optionsBuilder.UseSqlServer("server=localhost;uid=sa;pwd=P@ssw0rd;database=catalog");
});
```

> 虽然它是支持的, 但我们不建议这样做, 通常情况下不同环境使用的数据库地址是不同的, 如果不增加额外的环境判断, 那么就要求开发者在发布前修改地址, 这些操作都使得项目变得复杂

#### 选项模式

```csharp
builder.Services.Configure<MasaDbConnectionOptions>(masaDbConnectionOptions =>
{
    var connectionStrings = new List<KeyValuePair<string, string>>()
    {
        new(ConnectionStrings.DEFAULT_CONNECTION_STRING_NAME, "{Replace-With-Your-DbConnectionString}")
    };
    masaDbConnectionOptions.ConnectionStrings = new ConnectionStrings(connectionStrings);
});
```

或者借助支持选项模式的配置中心, 比如: [分布式配置中心](/stack/dcc/get-started)就提供了这个支持, 通过自定义配置节点与`MasaDbConnectionOptions`的映射关系, 完成对选项模式的正常使用

```csharp
builder.AddMasaConfiguration(masaBuilder =>
{
    masaBuilder.UseDcc();
    masaBuilder.UseMasaOptions(options =>
    {
        options.MappingConfigurationApi<MasaDbConnectionOptions>("Replace-With-Your-AppId", "Replace-With-Your-ConfigObject");
    });
});
```

> 此处忽略使用分布式配置中心所需的服务器配置, 如需了解请查看[文档](/framework/building-blocks/configuration/dcc)