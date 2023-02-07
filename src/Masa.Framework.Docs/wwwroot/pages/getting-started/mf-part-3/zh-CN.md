## 3. 保存或获取数据

在开发中, 我们需要用到数据库, 以便对数据能进行存储或读取, 下面例子我们将使用`Sqlite`数据库进行数据的存储与读取, 如果你的业务使用的是其它数据库, 可参考[文档](/framework/building-blocks/data/orm-efcore)选择与之匹配的数据库包

1. 安装`Masa.Contrib.Data.EFCore.Sqlite`、`Masa.Contrib.Data.Contracts`

```powershell
dotnet add package Masa.Contrib.Data.EFCore.Sqlite
dotnet add package Masa.Contrib.Data.Contracts
```

`Masa.Contrib.Data.Contracts`提供了[数据过滤](/framework/building-blocks/data/data-filter)的能力, 但它不是必须的

2. 新建数据上下文类`CatalogDbContext`, 并继承`MasaDbContext<TDbContext>`

```csharp
public class CatalogDbContext : MasaDbContext<CatalogDbContext>
{
    public CatalogDbContext(MasaDbContextOptions<CatalogDbContext> options) : base(options)
    {

    }
    
    protected override void OnModelCreatingExecuting(ModelBuilder builder)
    {
        builder.ApplyConfigurationsFromAssembly(typeof(CatalogDbContext).Assembly);
        base.OnModelCreatingExecuting(builder);
    }
}
```

> 数据库迁移时将执行`OnModelCreatingExecuting`方法, 我们可以在其中配置与数据库表的映射关系, 为避免出现流水账式的数据库映射记录, 我们通常会将不同表的映射情况分别写到不同的配置对象中去, 并在`OnModelCreatingExecuting`指定当前上下文映射的程序集

3. 配置数据库中商品表与`CatalogItem`的映射关系, 新建`CatalogItemEntityTypeConfiguration`类

```csharp
public class CatalogItemEntityTypeConfiguration
    : IEntityTypeConfiguration<CatalogItem>
{
    public void Configure(EntityTypeBuilder<CatalogItem> builder)
    {
        builder.ToTable("Catalog");

        builder.Property(ci => ci.Id)
            .IsRequired();

        builder.Property(ci => ci.Name)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(ci => ci.Price)
            .IsRequired();

        builder.Property(ci => ci.PictureFileName)
            .IsRequired(false);

        builder
            .Property<Guid>("_catalogBrandId")
            .UsePropertyAccessMode(PropertyAccessMode.Field)
            .HasColumnName("CatalogBrandId")
            .IsRequired();
        
        builder
            .Property<int>("_catalogTypeId")
            .UsePropertyAccessMode(PropertyAccessMode.Field)
            .HasColumnName("CatalogTypeId")
            .IsRequired();
        
        builder.HasOne(ci => ci.CatalogBrand)
            .WithMany()
            .HasForeignKey("_catalogBrandId");
        
        builder.HasOne(ci => ci.CatalogType)
            .WithMany()
            .HasForeignKey("_catalogTypeId");
    }
}
```

映射关系类我们建议按照`XXXEntityTypeConfiguration`格式进行创建, 虽然它不是必须的, 但是遵守此约定会使得我们的项目可读性更强

4. 配置数据库连接字符串

通常情况下数据库链接字符串配置信息存储在本地配置文件中, 框架支持在不同的配置文件中存放不同环境下使用的数据库链接字符串, 而不需要修改任何代码

```appsettings.json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=./Data/Catalog.db;"
  }
}
```

如果你的项目使用了配置中心, 数据库链接字符串也将在配置中心存储, 那么请跳过步骤4, 它不会对你有任何的帮助

5. 注册数据上下文

```csharp
builder.Services.AddMasaDbContext<CatalogDbContext>(dbContextBuilder =>
{
    dbContextBuilder
        .UseSqlite() //使用Sqlite数据库
        .UseFilter(); //数据数据过滤
});
```

> `UseSqlite`方法由`Masa.Contrib.Data.EFCore.Sqlite`提供, 我们建议在使用时不传入数据库字符串, 虽然它也支持传入数据库链接字符串, 但我们不建议你这样做

继承`MasaDbContext`的数据库默认使用`ConnectionStrings`节点下的`DefaultConnection`配置, 如果你需要更改默认读取节点或者查看更多数据库上下文配置可查看[文档](/framework/building-blocks/data/connection-strings)

## 其它

`MasaFramework`并未约束您的项目必须使用[`Entity Framework Core`](https://learn.microsoft.com/zh-cn/ef/core/), 查看已支持的[`ORM`](/framework/building-blocks/data/overview)框架 