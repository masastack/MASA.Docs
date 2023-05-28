# Data - Common Issues

This article outlines common issues that may arise when working with **data** and provides solutions to these issues.

## EFCore

1. How can I modify the node name that `XXXDbContext` reads from?

   You can customize the node that the current context reads from by using the `ConnectionStringName` attribute. For example:

   :::: code-group
   ::: code-group-item CustomDbContext

   ```csharp Infrastructure/CustomDbContext.cs
   [ConnectionStringName("Custom")]
   public class CustomDbContext : MasaDbContext<CustomDbContext>
   {
       public CustomDbContext(MasaDbContextOptions<CustomDbContext> options) : base(options)
       {
       }
   }
   ```

   :::
   ::: code-group-item appsettings.json

   ```json appsettings.json
   {
     "ConnectionStrings": {
       "Custom": "{Replace-Your-Read-DbConnectionString}"
     }
   }
   ```

   :::
   ::::

2. How can I modify the default global tracking for `XXXDbContext`?

   :::: code-group
   ::: code-group-item Solution 1

   ```csharp Infrastructure/CustomDbContext.cs
   public class CustomDbContext : MasaDbContext<CustomDbContext>
   {
       public CustomDbContext(MasaDbContextOptions<CustomDbContext> options) : base(options)
       {
           ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
       }
   }
   ```

   :::
   ::: code-group-item Solution 2

   ```csharp Startup.cs
   services.AddDbContext<CustomDbContext>(options =>
   {
       options.UseSqlServer(Configuration.GetConnectionString("Custom"));
       options.UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking);
   });
   ```

   :::
   ::::The following code shows two solutions for configuring a custom `DbContext` in C#:

Solution 1:

```csharp
public class CustomDbContext : MasaDbContext
{
    public CustomDbContext(MasaDbContextOptions<CustomDbContext> options) : base(options)
    {
        ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.TrackAll;
    }
}
```

Solution 2:

```csharp
var services = new ServiceCollection();
services.AddMasaDbContext<CustomDbContext>(masaDbContextBuilder =>
{
    masaDbContextBuilder.UseInMemoryDatabase("{Replace-Your-Database-Name}");
    masaDbContextBuilder.UseQueryTrackingBehavior(QueryTrackingBehavior.NoTrackingWithIdentityResolution);
});
```

Please note that `MasaDbContext` does not limit the version of `EFCore`, but if you are using `EFCore 6.0` or above, make sure to upgrade all `Microsoft.EntityFrameworkCore.XXX` packages to the same version. For example, if you are using `SqlServer` database.After installing version 7.0.5 of `Microsoft.EntityFrameworkCore.Tools`, you also need to install the following package:

```shell terminal
dotnet add package Microsoft.EntityFrameworkCore.SqlServer --version 7.0.5
```

To check the **XXX.csproj** file:

```xml
<Project Sdk="Microsoft.NET.Sdk.Web">
   
  <PropertyGroup>
    <TargetFramework>net7.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
  </PropertyGroup>
   
  <ItemGroup>
    <PackageReference Include="Masa.Contrib.Data.EFCore.SqlServer" Version="1.0.0-rc.1" />
    <PackageReference Include="Microsoft.EntityFrameworkCore.Tools" Version="7.0.5">
      <IncludeAssets>runtime; build; native; contentfiles; analyzers; buildtransitive</IncludeAssets>
      <PrivateAssets>all</PrivateAssets>
    </PackageReference>
    <PackageReference Include="Microsoft.EntityFrameworkCore.SqlServer" Version="7.0.5" />
  </ItemGroup>
   
</Project>
``````
< Project Sdk="Microsoft.NET.Sdk">

  < PropertyGroup>
    < TargetFramework>netcoreapp3.1</TargetFramework>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Microsoft.EntityFrameworkCore" Version="7.0.5" />
  </ItemGroup>

  <ItemGroup>
    <ProjectReference Include="..\Masa.EShop.Contracts.Catalog\Masa.EShop.Contracts.Catalog.csproj" />
  </ItemGroup>

</Project>

```

> If `Microsoft.EntityFrameworkCore.XXX` related packages are referenced in Masa.Contrib.Data.EFCore.XXX, they need to be installed and used in the business project with the same version.