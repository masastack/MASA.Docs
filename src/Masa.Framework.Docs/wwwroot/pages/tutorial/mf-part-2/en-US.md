# Practical Tutorial - Chapter 2: Data Context

## Overview

In this chapter, we will add data context using `EFCore` as the ORM provider (using `Sqlite` database instead of `in-memory data source`).

## Getting Started

1. Select the `Masa.EShop.Service.Catalog` project and install `Masa.Contrib.Data.EFCore.Sqlite` and `Masa.Contrib.Data.Contracts`.

   ```shell terminal
   dotnet add package Masa.Contrib.Data.EFCore.Sqlite -v 1.0.0-rc.1
   dotnet add package Masa.Contrib.Data.Contracts -v 1.0.0-rc.1
   ```

   > **Masa.Contrib.Data.Contracts** provides soft deletion and data filtering functionality.

2. Add the **CatalogBrand**, **CatalogType**, and **CatalogItem** models:

   :::: code-group
     ::: code-group-item CatalogBrand
   
     ```csharp Domain/Entities/CatalogBrand.cs
     using Masa.BuildingBlocks.Data;
     
     namespace Masa.EShop.Service.Catalog.Domain.Entities;
     
     public class CatalogBrand : ISoftDelete
     {
         public Guid Id { get; set; }
     
         public string Brand { get; set; }
     
         pu```csharp
public int Creator { get; set; }
     
public DateTime CreationTime { get; set; }
     
public int Modifier { get; set; } = default!;
     
public DateTime ModificationTime { get; set; }
     
public bool IsDeleted { get; private set; }
     
private CatalogBrand()
{
}
     
public CatalogBrand(Guid? id, string brand) : this()
{
    Brand = brand;
    Id = id ?? Guid.NewGuid();
}
```

```csharp
namespace Masa.EShop.Service.Catalog.Domain.Entities;
     
public class CatalogType
{
    public int Id { get; set; }
     
    public string Name { get; set; } = null!;
     
    private CatalogType()
    {
    }
}
```The following code is a C# code snippet for the CatalogType and CatalogItem classes in the Catalog service of an e-commerce application. The CatalogType class has two properties, Id and Name, and a constructor that initializes these properties. The CatalogItem class implements the ISoftDelete interface and has properties for Id, Name, Price, PictureFileName, CatalogTypeId, CatalogType, CatalogBrandId, and CatalogBrand.The code is defining the entity configurations for the CatalogBrand entity in the Catalog service. It is using the EntityTypeConfiguration class from the Microsoft.EntityFrameworkCore namespace to configure the entity's properties and relationships with other entities.The following code is a C# code for configuring the entity type of CatalogBrand in the Catalog service of an EShop application. It defines the table name, primary key, and properties of the entity. 

```csharp
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

Similarly, there is another code for configuring the entity type of CatalogType in the Catalog service.The following code is written in C# and is used to configure the entity type for a catalog in the Catalog Service of Masa EShop. It is located in the Infrastructure/EntityConfigurations folder and is named CatalogTypeEntityTypeConfiguration. The code imports the necessary namespaces from Microsoft.EntityFrameworkCore.Metadata.Builders and Masa.EShop.Service.Catalog.Infrastructure.EntityConfigurations. The class implements the IEntityTypeConfiguration interface for the CatalogType entity. The Configure method is used to configure the entity type using the EntityTypeBuilder. The builder is used to set the table name to "CatalogType", set the primary key to the Id property, and set the Id and Name properties to be required and have a maximum length of 100 characters.;
     using Microsoft.EntityFrameworkCore;
     using Microsoft.EntityFrameworkCore.Metadata.Builders;
     
     namespace Masa.EShop.Service.Catalog.Infrastructure.EntityConfigurations
     {
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
     }1. The code snippet shows the configuration of entity relationships in the Catalog service of Masa. The `CatalogItem` entity has a many-to-one relationship with `CatalogBrand` and `CatalogType` entities. The `CatalogBrand` and `CatalogType` entities have no navigation properties to `CatalogItem` entity. The configuration is done using the Fluent API of Entity Framework Core.

2. The `CatalogItemEntityTypeConfiguration` class is responsible for configuring the entity relationships for the `CatalogItem` entity. It inherits from `IEntityTypeConfiguration<CatalogItem>` and overrides the `Configure` method to configure the relationships using the `HasOne` and `WithMany` methods.

3. The `HasOne` method is used to configure a one-to-many or one-to-one relationship between two entities. The `WithMany` method is used to configure a many-to-one or many-to-many relationship between two entities. In this case, `HasOne` is used to configure the relationship between `CatalogItem` and `CatalogType` entities, and `WithMany` is used to configure the relationship between `CatalogItem` and `CatalogBrand` entities.

4. The `CatalogDbContext` class is the data context for the Catalog service. It inherits from `MasaDbContext<CatalogDbContext>` and provides a constructor that takes `MasaDbContextOptions<CatalogDbContext>` as a parameter. The `OnModelCreatingExecuting` method is overridden to apply the entity configurations using the `ModelBuilder` instance.1. Introduction

In this code snippet, we will be discussing how to configure a database context in a .NET application using Entity Framework Core. We will cover the following topics:

- Creating a database context class
- Configuring the database context
- Configuring the database connection string
- Registering the database context

2. Creating a database context class

To create a database context class, we need to inherit from the `DbContext` class provided by Entity Framework Core. Here is an example:

```csharp
using Microsoft.EntityFrameworkCore;

namespace MyNamespace
{
    public class MyDbContext : DbContext
    {
        public MyDbContext(DbContextOptions<MyDbContext> options) : base(options)
        {
        }

        // DbSet properties go here
    }
}
```

3. Configuring the database context

To configure the database context, we can override the `OnModelCreating` method and use the `ModelBuilder` class to configure the entity types and their relationships. Here is an example:

```csharp
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    modelBuilder.Entity<MyEntity>()
        .HasKey(e => e.Id);

    modelBuilder.Entity<MyEntity>()
        .Property(e => e.Name)
        .IsRequired()
        .HasMaxLength(50);

    modelBuilder.Entity<MyEntity>()
        .HasMany(e => e.OtherEntities)
        .WithOne(e => e.MyEntity)
        .HasForeignKey(e => e.MyEntityId);

    base.OnModelCreating(modelBuilder);
}
```

4. Configuring the database connection string

To configure the database connection string, we can add it to the `appsettings.json` file. Here is an example:

```json
{
  "ConnectionStrings": {
    "MyConnectionString": "Server=myServerAddress;Database=myDataBase;User Id=myUsername;Password=myPassword;"
  }
}
```

5. Registering the database context

To register the database context, we can use the `AddDbContext` method provided by the `IServiceCollection` interface. Here is an example:

```csharp
services.AddDbContext<MyDbContext>(options =>
    options.UseSqlServer(Configuration.GetConnectionString("MyConnectionString")));
```

That's it! With these steps, we have successfully configured a database context in our .NET application using Entity Framework Core.The `AddMasaDbContext` method is provided by `Masa.Contrib.Data.Contracts`. Register the data context before `AddServices`. 

To perform database migration, make sure that the EF Core command-line tool is installed. 

1. Select the `Masa.EShop.Service.Catalog` project and install `Microsoft.EntityFrameworkCore.Tools`.

   ```shell terminal
   dotnet add package Microsoft.EntityFrameworkCore.Tools --version 6.0.0
   ```

2. Model migration.1. To add a migration named "InitialCreate" in .NET Core CLI, run the following command in the "Masa.EShop.Service.Catalog" folder:

   ```
   dotnet ef migrations add InitialCreate
   ```

   In Visual Studio, run the following command in the Package Manager Console:

   ```
   Add-Migration InitialCreate
   ```

   Note: Make sure to execute the migration command in the "Masa.EShop.Service.Catalog" folder.

2. To update the database, run the following command in .NET Core CLI:

   ```
   dotnet ef database update
   ```

   In Visual Studio, run the following command in the Package Manager Console:

   ```
   Update-Database
   ```

   Note: Make sure to install "Microsoft.EntityFrameworkCore.Tools" for model migration.

   If you have multiple DbContexts, add " --context CatalogDbContext" at the end of the command.

3. Seed data migration (optional)

   To migrate data, add the following code to "Infrastructure/Extensions/HostExtensions.cs":

   ```
   using Microsoft.EntityFrameworkCore;
   
   namespace YourNamespace.Extensions
   {
       public static class HostExtensions
       {
           public static IHost MigrateDatabase(this IHost host)
           {
               using (var scope = host.Services.CreateScope())
               {
                   var services = scope.ServiceProvider;
                   var dbContext = services.GetRequiredService<YourDbContext>();
                   dbContext.Database.Migrate();
                   // Add your seed data here
               }
               return host;
           }
       }
   }
   ```

   Then, call the "MigrateDatabase" method in the "Program.cs" file:

   ```
   public static void Main(string[] args)
   {
       CreateHostBuilder(args)
           .Build()
           .MigrateDatabase() // Call the method here
           .Run();
   }
   ```epace Masa.EShop.Service.Catalog.Infrastructure.Extensions;
   
   public static class HostExtensions
   {
       public static Task MigrateDbContextAsync<TContext>(this IHost host, Func<TContext, IServiceProvider, Task> seeder)
           where TContext : DbContext
       {
           using var scope = host.Services.CreateScope();
           var services = scope.ServiceProvider;
           
           var env = services.GetRequiredService<IWebHostEnvironment>();
           if (!env.IsDevelopment())
               return Task.CompletedTask;
           
           var context = services.GetRequiredService<TContext>();
           return seeder(context, services);
       }
   }
   ```

   :::
   ::: code-group-item CatalogContextSeed (Seed data initialization)

   ```csharp Infrastructure/Extensions/CatalogContextSeed.cs
   using Masa.EShop.Service.Catalog.Domain.Entities;
   
   namespace Masa.EShop.Service.Catalog.Infrastructure.Extensions
   {
       public class CatalogContextSeed
       {
           public static async Task SeedAsync(CatalogContext context)
           {
               if (!context.CatalogBrands.Any())
               {
                   context.CatalogBrands.AddRange(GetPreconfiguredCatalogBrands());
                   await context.SaveChangesAsync();
               }
   
               if (!context.CatalogTypes.Any())
               {
                   context.CatalogTypes.AddRange(GetPreconfiguredCatalogTypes());
                   await context.SaveChangesAsync();
               }
   
               if (!context.CatalogItems.Any())
               {
                   context.CatalogItems.AddRange(GetPreconfiguredCatalogItems());
                   await context.SaveChangesAsync();
               }
           }
   
           private static IEnumerable<CatalogBrand> GetPreconfiguredCatalogBrands()
           {
               return new List<CatalogBrand>
               {
                   new CatalogBrand { Brand = "Brand 1" },
                   new CatalogBrand { Brand = "Brand 2" },
                   new CatalogBrand { Brand = "Brand 3" }
               };
           }
   
           private static IEnumerable<CatalogType> GetPreconfiguredCatalogTypes()
           {
               return new List<CatalogType>
               {
                   new CatalogType { Type = "Type 1" },
                   new CatalogType { Type = "Type 2" },
                   new CatalogType { Type = "Type 3" }
               };
           }
   
           private static IEnumerable<CatalogItem> GetPreconfiguredCatalogItems()
           {
               return new List<CatalogItem>
               {
                   new CatalogItem { CatalogTypeId = 1, CatalogBrandId = 1, Description = "Item 1", Name = "Item 1", Price = 100 },
                   new CatalogItem { CatalogTypeId = 2, CatalogBrandId = 2, Description = "Item 2", Name = "Item 2", Price = 200 },
                   new CatalogItem { CatalogTypeId = 3, CatalogBrandId = 3, Description = "Item 3", Name = "Item 3", Price = 300 }
               };
           }
       }
   }
   ```

   :::
   
   上面的代码是一个.NET Core项目中的一部分，用于初始化种子数据。其中，`HostExtensions`类提供了一个扩展方法`MigrateDbContextAsync`，用于在开发环境下自动迁移数据库，并执行种子数据初始化。`CatalogContextSeed`类则提供了种子数据的初始化方法。de first checks if there are any CatalogBrands and CatalogTypes in the CatalogDbContext. If there are none, it creates a new list of CatalogBrands and CatalogTypes and adds them to the context using the AddRangeAsync method. Finally, it saves the changes to the context using SaveChangesAsync.```csharp Program.cs
using Masa.EShop.Service.Catalog.Infrastructure.Extensions;

-----忽略其他命名空间-----

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddMasaDbContext<CatalogDbContext>(contextBuilder =>
{
    contextBuilder
        .UseSqlite()
        .UseFilter();
});

-----忽略其他服务注册-----

var app = builder.AddServices();//对于不使用MinimalAPis的项目，请使用`var app = builder.Build();`

-----忽略中间件、Swagger等的使用-----

await app.MigrateDbContextAsync<CatalogDbContext>(async (context, services) =>
{
    await CatalogContextSeed.SeedAsync(context);
});

app.Run();
```
Guid.Empty).FirstOrDefaultAsync();
   
           if (catalogItem == null)
               throw new UserFriendlyException("Product not found");
   
           return Result.Ok(catalogItem.ToDto());
       }
   
       public async Task<IResult> CreateAsync(CreateCatalogItemCommand command)
       {
           var catalog = await DbContext.Set<Catalog>().Where(c => c.Id == command.CatalogId).FirstOrDefaultAsync();
   
           if (catalog == null)
               throw new UserFriendlyException("Catalog not found");
   
           var catalogItem = new CatalogItem(command.Name, command.Description, command.Price, command.PictureFileName, catalog);
   
           await DbContext.Set<CatalogItem>().AddAsync(catalogItem);
           await DbContext.SaveChangesAsync();
   
           return Result.Ok(catalogItem.ToDto());
       }
   
       public async Task<IResult> UpdateAsync(UpdateCatalogItemCommand command)
       {
           var catalogItem = await DbContext.Set<CatalogItem>().Where(item => item.Id == command.Id).FirstOrDefaultAsync();
   
           if (catalogItem == null)
               throw new UserFriendlyException("Product not found");
   
           catalogItem.Update(command.Name, command.Description, command.Price, command.PictureFileName);
   
           await DbContext.SaveChangesAsync();
   
           return Result.Ok(catalogItem.ToDto());
       }
   
       public async Task<IResult> DeleteAsync(Guid id)
       {
           var catalogItem = await DbContext.Set<CatalogItem>().Where(item => item.Id == id).FirstOrDefaultAsync();
   
           if (catalogItem == null)
               throw new UserFriendlyException("Product not found");
   
           DbContext.Set<CatalogItem>().Remove(catalogItem);
           await DbContext.SaveChangesAsync();
   
           return Result.Ok();
       }
   }
   ```

   在`CatalogItemService`中，我们需要修改数据源，以便从新的数据库中获取数据。我们需要使用`CatalogDbContext`来获取数据。我们可以通过`GetRequiredService`方法来获取`CatalogDbContext`的实例。

   ```csharp
   private CatalogDbContext DbContext => GetRequiredService<CatalogDbContext>();
   ```

   然后，我们需要在每个方法中使用`DbContext`来获取数据。例如，在`GetAsync`方法中，我们需要使用以下代码：

   ```csharp
   var catalogItem = await DbContext.Set<CatalogItem>().Where(item => item.Id == id).FirstOrDefaultAsync();
   ```

   在`CreateAsync`方法中，我们需要使用以下代码：

   ```csharp
   var catalog = await DbContext.Set<Catalog>().Where(c => c.Id == command.CatalogId).FirstOrDefaultAsync();
   ```

   在`UpdateAsync`方法中，我们需要使用以下代码：

   ```csharp
   var catalogItem = await DbContext.Set<CatalogItem>().Where(item => item.Id == command.Id).FirstOrDefaultAsync();
   ```

   在`DeleteAsync`方法中，我们需要使用以下代码：

   ```csharp
   var catalogItem = await DbContext.Set<CatalogItem>().Where(item => item.Id == id).FirstOrDefaultAsync();
   ```

   现在，我们已经成功地修改了`CatalogItemService`的数据源，以便从新的数据库中获取数据。The code snippet is written in C# and it selects a CatalogItemDto object from a collection based on certain criteria. If the selected item is null, it throws a UserFriendlyException with the message "Product doesn't exist". 

There are also two methods, GetItemsAsync and GetRecycleItemsAsync, that retrieve a collection of CatalogItemDto objects based on optional parameters such as name, page, and pageSize. The difference between the two methods is that GetRecycleItemsAsync retrieves items that have been marked for recycling.private async Task<IResult> GetItemsAsync(
           string name,
           int page,
           int pageSize,
           bool isDelete)
       {
           if (page <= 0)
               throw new UserFriendlyException("Page number must be greater than 0");
   
           if (pageSize <= 0)
               throw new UserFriendlyException("Page size must be greater than 0");
   
           Expression<Func<CatalogItem, bool>> condition = item => item.IsDeleted == isDelete;
           condition = condition.And(!name.IsNullOrWhiteSpace(), item => item.Name.Contains(name));
           var queryable = DbContext.Set<CatalogItem>().Where(condition);
           var total = await queryable.LongCountAsync();
           var list = await queryable.Where(condition).Select(item => new CatalogListItemDto()
           {
               Id = item.Id,dId == null || command.CatalogTypeId == null)
               throw new UserFriendlyException("Catalog brand and type cannot be empty");
   
           var product = new Product()
           {
               Name = command.Name,
               Description = command.Description,
               Price = command.Price,
               PictureFileName = command.PictureFileName,
               CatalogBrandId = command.CatalogBrandId.Value,
               CatalogTypeId = command.CatalogTypeId.Value,
               Stock = command.Stock
           };
   
           await _productRepository.AddAsync(product);
           return Results.Ok();
       }

The above code is written in C# and it retrieves a list of products from a database and creates a new product. The retrieved products are filtered based on certain criteria and then paginated. The resulting page data is returned as a response. The create product method checks if the required fields are not empty and then creates a new product with the provided information.nd.CatalogBrandId,
               CatalogTypeId = command.CatalogTypeId,
               Description = command.Description,
               Name = command.Name,
               PictureUri = command.PictureUri,
               Price = command.Price,
               Stock = command.Stock
           };
   
           await _catalogRepository.AddAsync(catalogItem);
           await _unitOfWork.SaveChangesAsync();
   
           return catalogItem.Id;s not exist");
   
           DbContext.Set<CatalogItem>().Remove(catalogItem);
           await DbContext.SaveChangesAsync();
   
           return Results.Accepted();
       }occurred while updating the entries. See the inner exception for details.`

   检查数据库连接是否正常，以及是否有其他异常导致更新失败。可以查看内部异常的详细信息以获取更多帮助。An error occurred while saving the entity changes. See the inner exception for details. ---> Microsoft.Data.Sqlite.SqliteException (0x80004005): SQLite Error 1: 'no such table: Catalog'.

Foreign key constraint error, incorrect input for `CatalogBrandId` or `CatalogTypeId` (`CatalogBrandId`: `31b1c60b-e9c3-4646-ac70-09354bdb1522`, `CatalogTypeId`: 1).

Runtime error: `SQLite Error 1: no such table: CatalogBrand. at Microsoft.Data.Sqlite.SqliteException.ThrowExceptionForRC(Int32 rc, sqlite3 db) at Microsoft.Data.Sqlite.SqliteCommand`.

Database migration and update have not been performed. Please refer to the documentation for executing database migration.

In summary, through `MasaDbContext`, we have achieved data persistence and support for querying deleted products, meeting the basic requirements. The technologies used in the subsequent tutorials can help improve our project's read performance, facilitate maintenance, separate concerns, and focus on the core domain.