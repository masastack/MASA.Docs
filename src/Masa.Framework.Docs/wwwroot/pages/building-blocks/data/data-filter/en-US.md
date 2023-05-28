# Data - Data Filtering

The `Masa.BuildingBlocks.Data.Contracts` provides data filtering functionality, and we have defined some filters that can be used out of the box.

## Features

### Soft Deletion

Entities that implement `ISoftDelete` support soft deletion. When a delete operation is executed, the current data is marked as deleted. It is not a physical deletion, and the data is still saved in the database. However, by default, the data that has been marked as deleted will be filtered out when queried.

```csharp
public class Student : ISoftDelete
{
    public int Id { get; set; }

    public string Name { get; set; }
    
    public bool IsDeleted { get; private set; }
}
```

### Multi-Tenancy

Entities that implement `IMultiTenant` support multi-tenancy. It is more suitable to use it when logical isolation is used. Its essence is to add a condition that the tenant `ID` is equal to the `ID` of the current request tenant after the default query, in order to meet the default data filtering function. If the tenant is physically isolated (each tenant uses a brand new database), its usefulness is not significant.

```csharp
public class User : IMultiTenant
{
    public int Id { get; set; }

    public string Name { get; set; }
    
    public Guid TenantId { get; set; }
}
```

> If your tenant `ID` is not of type `Guid`, you can modify the inheritance interface to `IMultiTenant<T>` to support other types of tenant `ID`, such as `IMultiTenant<int>`.

### Multi-Environment

Entities that implement `IMultiEnvironment` support multi-environment. It is more suitable to use it when logical isolation is used. Its essence is to add a condition that the environment is equal to the current request environment after the default query.In the current request environment, the default data filtering function is implemented to meet the conditions. However, if the environment is physically isolated (each environment uses a brand new database), its usefulness is limited.

```csharp
public class User : IMultiEnvironment
{
    public int Id { get; set; }

    public string Name { get; set; }
    
    public string Environment { get; set; }
}
```

## Usage

We provide three out-of-the-box filters that automatically filter data during queries. If we want to temporarily disable the filtering function, such as providing a recycle bin function, we can use `IDataFilter` to temporarily disable the soft delete function to query data that has been marked as deleted, for example:

```csharp
public class CatalogItemService: IScopedDependency
{
    private readonly CatalogDbContext _dbContext; 
    private readonly IDataFilter _dataFilter;

    public CatalogItemService(CatalogDbContext dbContext, IDataFilter dataFilter)
    {
        _dbContext = dbContext;
        _dataFilter = dataFilter;
    }

    public Task<List<CatalogItem>> GetCrecycleListAsync()
    {
        using (_dataFilter.Disable<ISoftDelete>())
        {
            return _dbContext.Set<CatalogItem>().Where(u => u.```csharp
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace MyNamespace
{
    public class MyClass
    {
        private readonly MyDbContext _context;

        public MyClass(MyDbContext context)
        {
            _context = context;
        }

        public async Task<List<MyEntity>> GetEntitiesAsync()
        {
            return await _context.MyEntities.Where(e => !e.IsDeleted).ToListAsync();
        }
    }
}
```