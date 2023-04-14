# 实战教程 - 第二章: 创建数据上下文

## 概述

本章将新增数据上下文，这里我们使用的是EFCore作为ORM提供程序，用于提供数据的增删改查支持

### 补充

* 更换`CatalogItemService`中内存数据源为`Sqlite`数据库，
* 新增支持对已删除产品进行查询

## 开始

1. 选中 `Masa.EShop.Service.Catalog` 项目并安装 `Masa.Contrib.Data.EFCore.Sqlite` 、`Masa.Contrib.Data.Contracts`

```shell
dotnet add package Masa.Contrib.Data.EFCore.Sqlite
dotnet add package Masa.Contrib.Data.Contracts
```

或者直接修改 **Masa.EShop.Service.Catalog.csproj** 文件为:

```xml
<Project Sdk="Microsoft.NET.Sdk.Web">

  <PropertyGroup>
    <TargetFramework>net6.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Masa.Contrib.Data.Contracts" Version="$(MasaFrameworkPackageVersion)" />
    <PackageReference Include="Masa.Contrib.Data.EFCore.Sqlite" Version="$(MasaFrameworkPackageVersion)" />
    <!-- Omit other installed nuget packages -->
  </ItemGroup>

</Project>
```

> 推荐安装使用**Masa.Contrib.Data.Contracts**，目前它提供了软删除、数据过滤的功能

2. 创建数据上下文 `CatalogDbContext`, 并继承 `MasaDbContext<CatalogDbContext>`

```csharp
using Masa.EShop.Service.Catalog.Domain.Entities;
using Masa.EShop.Service.Catalog.Infrastructure.EntityConfigurations;
using Microsoft.EntityFrameworkCore;

namespace Masa.EShop.Service.Catalog.Infrastructure;

public class CatalogDbContext : MasaDbContext<CatalogDbContext>
{
    public DbSet<CatalogItem> CatalogItems { get; set; } = null!;

    public DbSet<CatalogBrand> CatalogBrands { get; set; } = null!;

    public DbSet<CatalogType> CatalogTypes { get; set; } = null!;

    public CatalogDbContext(MasaDbContextOptions<CatalogDbContext> dbContextOptions) : base(dbContextOptions)
    {
    }

    protected override void OnModelCreatingExecuting(ModelBuilder builder)
    {
        builder.ApplyConfigurationsFromAssembly(typeof(CatalogBrandEntityTypeConfiguration).Assembly);
        base.OnModelCreatingExecuting(builder);
    }
}
```

> [MasaDbContext](/framework/building-blocks/data/orm-efcore)的更多用法

* 商品品牌、商品类型、商品信息模型:

:::: code-group
::: code-group-item CatalogBrand
```csharp
using Masa.BuildingBlocks.Data;

namespace Masa.EShop.Service.Catalog.Domain.Entities;

public class CatalogBrand : ISoftDelete
{
    public Guid Id { get; set; }

    public string Brand { get; set; }
    
    public bool IsDeleted { get; private set; }
}
```
:::
::: code-group-item CatalogType
```csharp
namespace Masa.EShop.Service.Catalog.Domain.Entities;

public class CatalogType
{
    public int Id { get; set; }

    public string Type { get; set; } = null!;

    public CatalogType() { }

    public CatalogType(string type)
    {
        Type = type;
    }
}
```
:::
::: code-group-item CatalogItem
```csharp
using Masa.BuildingBlocks.Data;

namespace Masa.EShop.Service.Catalog.Domain.Entities;

public class CatalogItem : ISoftDelete
{
    public Guid Id { get; set; }

    public string Name { get; set; } = null!;

    public decimal Price { get; set; }

    public string PictureFileName { get; set; } = "";

    public Guid CatalogTypeId { get; set; }

    public CatalogType CatalogType { get; private set; } = null!;

    public Guid CatalogBrandId { get; set; }

    public CatalogBrand CatalogBrand { get; private set; } = null!;

    public int Stock { get; set; }

    public bool IsDeleted { get; private set; }
}
```
:::
::::

* 为商品品牌、商品分类、商品信息配置数据库映射关系

:::: code-group
::: code-group-item CatalogBrandEntityTypeConfiguration
```csharp
using Masa.EShop.Service.Catalog.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Masa.EShop.Service.Catalog.Infrastructure.EntityConfigurations;

class CatalogBrandEntityTypeConfiguration
    : IEntityTypeConfiguration<CatalogBrand>
{
    public void Configure(EntityTypeBuilder<CatalogBrand> builder)
    {
        builder.ToTable(nameof(CatalogBrand));

        builder.HasKey(cb => cb.Id);

        builder.Property(cb => cb.Id)
           .IsRequired();

        builder.Property(cb => cb.Brand)
            .IsRequired()
            .HasMaxLength(100);
    }
}
```
:::
::: code-group-item CatalogTypeEntityTypeConfiguration
```csharp
using Masa.EShop.Service.Catalog.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Masa.EShop.Service.Catalog.Infrastructure.EntityConfigurations;

class CatalogTypeEntityTypeConfiguration
    : IEntityTypeConfiguration<CatalogType>
{
    public void Configure(EntityTypeBuilder<CatalogType> builder)
    {
        builder.ToTable(nameof(CatalogType));
        
        builder.HasKey(ct => ct.Id);

        builder.Property(ct => ct.Id)
           .IsRequired();

        builder.Property(ct => ct.Type)
            .IsRequired()
            .HasMaxLength(100);
    }
}
```
:::
::: code-group-item CatalogItemEntityTypeConfiguration
```csharp
using Masa.EShop.Service.Catalog.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Masa.EShop.Service.Catalog.Infrastructure.EntityConfigurations;

class CatalogItemEntityTypeConfiguration
    : IEntityTypeConfiguration<CatalogItem>
{
    public void Configure(EntityTypeBuilder<CatalogItem> builder)
    {
        builder.ToTable("Catalog");

        builder.Property(ci => ci.Id)
            .IsRequired();

        builder.Property(ci => ci.Name)
            .IsRequired(true)
            .HasMaxLength(50);

        builder.Property(ci => ci.Price)
            .IsRequired(true);

        builder.Property(ci => ci.PictureFileName)
            .IsRequired(false);

        builder.HasOne(ci => ci.CatalogBrand)
            .WithMany()
            .HasForeignKey(ci => ci.CatalogBrandId);

        builder.HasOne(ci => ci.CatalogType)
            .WithMany()
            .HasForeignKey(ci => ci.CatalogTypeId);
    }
}
```
:::
::::

3. 配置数据库连接字符串

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=Catalog.db;"
  }
}
```

<app-alert type="warning" content="推荐在appsettings.{环境变量}.json配置数据库连接字符串"></app-alert>

4. 注册数据上下文 `CatalogDbContext` ，修改 `Program.cs`

```csharp
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddMasaDbContext<CatalogDbContext>(contextBuilder =>
{
    contextBuilder
        .UseSqlite()
        .UseFilter();
});

-----Ignore the rest of the service registration-----

var app = builder.AddServices();//`var app = builder.Build();` for projects not using MinimalAPis

-----Ignore the use of middleware, Swagger, etc.-----

app.Run();
```

> **UseFilter**方法由**Masa.Contrib.Data.Contracts**提供, 如需使用，请确保执行步骤2
> 
> 注册数据上下文在**AddServices**之前即可

5. 数据库迁移，确保已安装 [EF Core 命令行工具](https://learn.microsoft.com/zh-cn/ef/core/cli/dotnet)

    1. 模型迁移
  
    :::: code-group
    ::: code-group-item .NET Core CLI
    ```csharp 终端
    dotnet ef migrations add InitialCreate
    ```
    :::
    ::: code-group-item Visual Studio
    ```csharp Visual Studio
    Add-Migration InitialCreate
    ```
    :::
    ::::
  
    2. 更新数据库
  
    :::: code-group
    ::: code-group-item .NET Core CLI
    ```csharp 终端
    dotnet ef database update
    ```
    :::
    ::: code-group-item Visual Studio
    ```csharp Visual Studio
    Update-Database
    ```
    :::
    ::::

    > 模型迁移需要安装`Microsoft.EntityFrameworkCore.Tools`，请确保已正确安装
    > 
    > 多数据上下文时请在命令行尾部增加 ` --context CatalogDbContext`

6. 种子数据迁移 （非必须）

    1. 新建**HostExtensions**类，得到数据上下文用于后续生成种子数据
  
    ```csharp
    using Microsoft.EntityFrameworkCore;
    
    namespace Masa.EShop.Service.Catalog.Infrastructure.Extensions;
    
    public static class HostExtensions
    {
        public static Task MigrateDbContextAsync<TContext>(this IHost host, Func<TContext, IServiceProvider, Task> seeder)
            where TContext : DbContext
        {
            using var scope = host.Services.CreateScope();
            var services = scope.ServiceProvider;
            var context = services.GetRequiredService<TContext>();
            return seeder(context, services);
        }
    }
    ```
     
    2. 新建`CatalogContextSeed`，用于种子数据迁移
   
    ```csharp
    using Masa.EShop.Service.Catalog.Domain.Entities;
    
    namespace Masa.EShop.Service.Catalog.Infrastructure.Extensions;
    
    public class CatalogContextSeed
    {
        public static async Task SeedAsync(
            CatalogDbContext context,
            IWebHostEnvironment env)
        {
            if (!env.IsDevelopment())
                return;
            
            if (!context.CatalogBrands.Any())
            {
                var catalogBrands = new List<CatalogBrand>()
                {
                    new()
                    {
                        Id = 1,
                        Brand = "LONSID"
                    }
                };
                await context.CatalogBrands.AddRangeAsync(catalogBrands);
    
                await context.SaveChangesAsync();
            }
    
            if (!context.CatalogTypes.Any())
            {
                var catalogTypes = new List<CatalogType>()
                {
                    new()
                    {
                        Id = 1,
                        Type = "Water Dispenser"
                    }
                };
                await context.CatalogTypes.AddRangeAsync(catalogTypes);
                await context.SaveChangesAsync();
            }
        }
    }
    ```
   
    3. 使用迁移并完成种子数据初始化, 修改 `Program.cs`
   
    ```csharp
    var builder = WebApplication.CreateBuilder(args);
    
    builder.Services.AddMasaDbContext<CatalogDbContext>(contextBuilder =>
    {
        contextBuilder
            .UseSqlite()
            .UseFilter();
    });
    
    -----Ignore the rest of the service registration-----
    
    var app = builder.AddServices();//`var app = builder.Build();` for projects not using MinimalAPis
    
    -----Ignore the use of middleware, Swagger, etc.-----
    
    await app.MigrateDbContextAsync<CatalogDbContext>(async (context, services) =>
    {
        var env = services.GetRequiredService<IWebHostEnvironment>();
    
        await CatalogContextSeed.SeedAsync(context, env);
    });
    
    app.Run();
    ``` 
   
7. 修改`CatalogItemService`的数据源为`Sqlite`数据库

```csharp
using System.Linq.Expressions;
using Masa.BuildingBlocks.Data;
using Masa.EShop.Contracts.Catalog.Dto;
using Masa.EShop.Service.Catalog.Application.Catalogs.Commands;
using Masa.EShop.Service.Catalog.Domain.Entities;
using Masa.EShop.Service.Catalog.Infrastructure;
using Masa.Utils.Models;
using Microsoft.EntityFrameworkCore;

namespace Masa.EShop.Service.Catalog.Services;

public class CatalogItemService : ServiceBase
{
    private CatalogDbContext DbContext => GetRequiredService<CatalogDbContext>();

    public async Task<IResult> GetAsync(Guid id)
    {
        if (id <= 0)
            throw new UserFriendlyException("Please enter the ProductId");

        var catalogItem = await DbContext.CatalogItems.Where(item => item.Id == id).Select(item => new CatalogItemDto()
        {
            Id = item.Id,
            Name = item.Name,
            Price = item.Price,
            PictureFileName = item.PictureFileName,
            CatalogTypeId = item.CatalogTypeId,
            CatalogBrandId = item.CatalogBrandId
        }).FirstOrDefaultAsync();
        if (catalogItem == null)
            throw new UserFriendlyException("Product doesn't exist");

        return Results.Ok(catalogItem);
    }

    /// <summary>
    /// `PaginatedListBase` is provided by **Masa.Utils.Models.Config**, if you want to use it, please install `Masa.Utils.Models.Config`
    /// </summary>
    /// <returns></returns>
    public async Task<IResult> GetItemsAsync(
        string? name,
        int page = 1,
        int pageSize = 10)
    {
        if (page <= 0)
            throw new UserFriendlyException("Page must be greater than 0");

        if (pageSize <= 0)
            throw new UserFriendlyException("PageSize must be greater than 0");

        Expression<Func<CatalogItem, bool>> condition = item => true;
        condition = condition.And(!name.IsNullOrWhiteSpace(), item => item.Name.Contains(name));
        var queryable = DbContext.CatalogItems.Where(condition);
        var total = await queryable.LongCountAsync();
        var list = await queryable.Where(condition).Select(item => new CatalogListItemDto()
        {
            Id = item.Id,
            Name = item.Name,
            Price = item.Price,
            PictureFileName = item.PictureFileName,
            CatalogTypeId = item.CatalogTypeId,
            CatalogBrandId = item.CatalogBrandId,
            Stock = item.Stock,
        }).Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

        var pageData = new PaginatedListBase<CatalogListItemDto>()
        {
            Total = total,
            TotalPages = (int)Math.Ceiling((double)total / pageSize),
            Result = list
        };
        return Results.Ok(pageData);
    }
    
    /// <summary>
    /// Show only deleted listings
    /// </summary>
    public async Task<IResult> GetRecycleItemsAsync(
        string? name,
        IDataFilter dataFilter,
        int page = 1,
        int pageSize = 10)
    {
        if (page <= 0)
            throw new UserFriendlyException("页码必须大于0");

        if (pageSize <= 0)
            throw new UserFriendlyException("页大小必须大于0");

        Expression<Func<CatalogItem, bool>> condition = item => item.IsDeleted;
        condition = condition.And(!name.IsNullOrWhiteSpace(), item => item.Name.Contains(name));

        using (dataFilter.Disable<ISoftDelete>())
        {
            var queryable = DbContext.CatalogItems.Where(condition);
            var total = await queryable.LongCountAsync();
            var list = await queryable.Where(condition).Select(item => new CatalogListItemDto()
            {
                Id = item.Id,
                Name = item.Name,
                Price = item.Price,
                PictureFileName = item.PictureFileName,
                CatalogTypeId = item.CatalogTypeId,
                CatalogBrandId = item.CatalogBrandId,
                Stock = item.Stock,
            }).Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

            var pageData = new PaginatedListBase<CatalogListItemDto>()
            {
                Total = total,
                TotalPages = (int)Math.Ceiling((double)total / pageSize),
                Result = list
            };
            return Results.Ok(pageData);
        }
    }

    public async Task<IResult> CreateProductAsync(CreateProductCommand command)
    {
        if (command.Name.IsNullOrWhiteSpace())
            throw new UserFriendlyException("产品名不能为空");

        var catalogItem = new CatalogItem()
        {
            CatalogBrandId = command.CatalogBrandId,
            CatalogTypeId = command.CatalogTypeId,
            Name = command.Name,
            PictureFileName = command.PictureFileName ?? "default.png",
            Price = command.Price
        };

        await DbContext.CatalogItems.AddAsync(catalogItem);
        await DbContext.SaveChangesAsync();
        return Results.Accepted();
    }

    public async Task<IResult> DeleteProductAsync(Guid id)
    {
        if (id <= 0)
            throw new UserFriendlyException("Please enter the ProductId");

        var catalogItem = await DbContext.CatalogItems.FirstOrDefaultAsync(item => item.Id == id);
        if (catalogItem == null)
            throw new UserFriendlyException("Product doesn't exist");

        DbContext.CatalogItems.Remove(catalogItem);
        await DbContext.SaveChangesAsync();

        return Results.Accepted();
    }
}
```

> [IDataFilter](/framework/building-blocks/data/data-filter)由`Masa.Contrib.Data.Contracts`提供

最终的文件夹/文件结构应该如下所示:

<div>
  <img alt="Directory Structure" src="https://s2.loli.net/2023/04/10/7idENInSXFutvQa.png"/>
</div>

## 其它

通过`MasaDbContext`我们做到了数据的持久化，也支持查询已删除的产品