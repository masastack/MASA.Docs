Overview

This is an unordered GUID generator used to generate globally unique IDs. However, it is not suitable for use as a primary key ID in a database. If you want to use it as a primary key ID, we recommend using sequential-guid.

Usage

1. Install Masa.Contrib.Data.IdGenerator.NormalGuid

   ```shell terminal
   dotnet add package Masa.Contrib.Data.IdGenerator.NormalGuid
   ```

2. Register the GUID generator

   ```csharp terminal
   var builder = WebApplication.CreateBuilder(args);
   builder.Services.AddSimpleGuidGenerator();
   ```

3. Use the GUID generator to generate ordered IDs

   :::: code-group
   ::: code-group-item Create through ID generator factory (static)

   ```csharp Domain/Entities/CatalogBrand.cs
   using Masa.BuildingBlocks.Data;
   
   namespace Masa.EShop.Service.Catalog.Domain.Entities;
   
   public class CatalogBrand
   {
       public Guid Id { get; set; }
       
       public string Brand { get; set; }
   
       private CatalogBrand()
   ```

   ::: 
   ::: code-group-item Create through ID generator instance (non-static)

   ```csharp Domain/Entities/CatalogBrand.cs
   using Masa.BuildingBlocks.Data;
   
   namespace Masa.EShop.Service.Catalog.Domain.Entities;
   
   public class CatalogBrand
   {
       private readonly IIdGenerator _idGenerator;
   
       public Guid Id { get; set; }
       
       public string Brand { get; set; }
   
       public CatalogBrand(IIdGenerator idGenerator)
       {
           _idGenerator = idGenerator;
           Id = _idGenerator.NewId();
       }
   }
   ```

   :::

   ::::The following code snippet shows how to generate a new GUID using a GUID generator factory:

```csharp
public class MyClass
{
    public Guid Id { get; }

    public MyClass()
    {
        Id = IdGeneratorFactory.GuidGenerator.NewId();
    }
}
```

Alternatively, you can obtain a GUID generator through dependency injection:

```csharp Program.cs
app.MapGet("/getid", (IGuidGenerator generator) => { return generator.NewId(); });
```