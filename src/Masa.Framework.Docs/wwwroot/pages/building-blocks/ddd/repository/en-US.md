# Domain-Driven Design - Repository

## Overview

Repository is a part of Domain-Driven Design that shields the business logic from the differences in persistence infrastructure. Different storage facilities may have different implementation methods, but they will not affect our business. Repository provides a series of methods for managing domain objects, such as adding, deleting, updating, and querying.

## Usage

1. Install `Masa.Contrib.Ddd.Domain.Repository.EFCore`

   ```shell Terminal
   dotnet add package Masa.Contrib.Ddd.Domain.Repository.EFCore
   ```

2. Register the `Repository`

   ```csharp Program.cs l:3
   builder.Services.AddDomainEventBus(options =>
   {
       options.UseRepository<CatalogDbContext>();
   });
   ```
   > `AddDomainEventBus` is provided by `Masa.Contrib.Ddd.Domain`

3. Use the **Repository**

   ```csharp l:5-8,20
   public class ProductCommandHandler
   {
       private readonly IRepository<CatalogItem, int> _repository;
   
       public ProductCommandHandler(IRepository<CatalogItem, int> repository)
       {
           _repository = repository;
       }
   
       [EventHandler]
       public async Task CreateHandleAsync(CreateProductCommand command)
       {
           var product = new CatalogItem(command.Name, command.Description, command.Price);
           await _repository.AddAsync(product);
       }
   }
   ```t, unitOfWork)
       {
       }
   }
   ```

3. 在 `CatalogDbContext` 中添加 `ICatalogItemRepository`

   ```csharp
   public class CatalogDbContext : DbContext
   {
       public DbSet<CatalogBrand> CatalogBrands { get; set; }
       public DbSet<CatalogType> CatalogTypes { get; set; }
       public DbSet<CatalogItem> CatalogItems { get; set; }
   
       public CatalogDbContext(DbContextOptions<CatalogDbContext> options) : base(options)
       {
       }
   
       protected override void OnModelCreating(ModelBuilder builder)
       {
           base.OnModelCreating(builder);
           builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
       }
   
       public override int SaveChanges()
       {
           return base.SaveChanges();
       }
   
       public async Task<int> SaveChangesAsync()
       {
           return await base.SaveChangesAsync();
       }
   
       public ICatalogItemRepository CatalogItemRepository => new CatalogItemRepository(this, null);
   }
   ```

4. 在 `CatalogItemController` 中使用 `ICatalogItemRepository`

   ```csharp
   [HttpPost]
   public async Task<IActionResult> CreateCatalogItem([FromBody] CreateCatalogItemCommand command, CancellationToken cancellationToken)
   {
       if (!ModelState.IsValid)
       {
           return BadRequest(ModelState);
       }
   
       var catalogItem = new CatalogItem(
           command.CatalogBrandId,
           command.CatalogTypeId,
           command.Name,
           command.Description,
           PictureFileName = command.PictureFileName ?? "default.png",
           command.Price);
   
       await _catalogItemRepository.AddAsync(catalogItem);
       await _catalogItemRepository.UnitOfWork.SaveChangesAsync(cancellationToken);
   
       return CreatedAtAction(nameof(GetCatalogItemById), new { id = catalogItem.Id }, null);
   }
   ```1. Introduction

In this code snippet, we will discuss how to use the repository pattern in C# to perform CRUD operations on entities. The repository pattern is a design pattern that separates the data access logic from the business logic of an application.

2. Using Entity Framework Core

To use the repository pattern with Entity Framework Core, we need to create a repository class that implements the IRepository interface. The repository class should have a constructor that takes an instance of the DbContext class as a parameter. Here is an example:

```csharp l:5-10
public class CatalogItemRepository : IRepository<CatalogItem>
{
    private readonly DbContext _context;

    public CatalogItemRepository(DbContext context)
    {
        _context = context;
    }

    // implementation of IRepository methods
}
```

3. Using Custom Repository

We can also create a custom repository class that implements the IRepository interface. This allows us to add custom methods that are specific to our application. Here is an example:

```csharp l:5-8,20
public class ProductCommandHandler
{
    private readonly ICatalogItemRepository _repository;

    public ProductCommandHandler(ICatalogItemRepository repository)
    {
        _repository = repository;
    }

    [EventHandler]
    public async Task CreateHandleAsync(CreateProductCommand command)
    {
        var catalogItem = new CatalogItem(
            command.CatalogBrandId, 
            command.CatalogTypeId, 
            command.Name,
            command.Description,
            PictureFileName = command.PictureFileName ?? "default.png",
            command.Price);
        await _repository.AddAsync(catalogItem);
    }
}
```

## Features

* AddAsync: adds an entity
* AddRangeAsync: adds a collection of entities
* UpdateAsync: updates an entity* UpdateRangeAsync: Batch update entities
* RemoveAsync: Remove specified entity
* RemoveRangeAsync: Batch remove specified entity collection
* FindAsync: Query entities that meet the conditions based on the primary key. If not found, return `null`
* GetListAsync: Get entity list
* GetCountAsync: Get entity count
* GetPaginatedListAsync: Sort by specified sorting field in descending or ascending order and get paginated data

For the `IRepository<TEntity, TKey>` repository with specified primary key, in addition to supporting the above methods, it also provides:

* FindAsync: Get the entity with the specified primary key `id`
* RemoveAsync: Remove the entity with the specified primary key `id`
* RemoveRangeAsync: Remove the entities with the specified `id` collection

## Principle Analysis

* Why can custom repositories be used directly without registration?

  Based on the principle of **convention over configuration**, we agree that interfaces that inherit from `IRepository<TEntity>` belong to custom repositories. They are extensions of the default repository. During project startup, all entity classes and custom repository interfaces that inherit from `IRepository<TEntity>` will be registered through reflection. Developers only need to register and use them according to conventions.

  ```csharp l:3
  builder.Services.AddDomainEventBus(options =>
  {
      options.UseRepository<CatalogDbContext>();
  });
  ```

  > By default, the program will use the assembly set in the global configuration and query the corresponding entity classes for service registration.