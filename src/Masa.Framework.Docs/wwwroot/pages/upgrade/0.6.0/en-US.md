# 0.6.0 Upgrade Guide

## Package Renaming

In `0.6.0`, we have standardized the project directory structure and library names, which involves renaming many libraries. The renaming rules are as follows:

* `EntityFrameworkCore` -> `EFCore`: Affected packages are
    * `Masa.Contrib.Authentication.Oidc.EntityFrameworkCore` -> `Masa.Contrib.Authentication.OpenIdConnect.EFCore`
    * `Masa.Contrib.Data.EntityFrameworkCore` -> `Masa.Contrib.Data.EFCore`
    * `Masa.Contrib.Data.EntityFrameworkCore.SqlServer` -> `Masa.Contrib.Data.EFCore.SqlServer`
    * `Masa.Contrib.Data.EntityFrameworkCore.Sqlite` -> `Masa.Contrib.Data.EFCore.Sqlite`
    * `Masa.Contrib.Data.EntityFrameworkCore.Cosmos` -> `Masa.Contrib.Data.EFCore.Cosmos`
    * `Masa.Contrib.Data.EntityFrameworkCore.Oracle` -> `Masa.Contrib.Data.EFCore.Oracle`
    * `Masa.Contrib.Data.EntityFrameworkCore.PostgreSql` -> `Masa.Contrib.Data.EFCore.PostgreSql`
    * `Masa.Contrib.Data.EntityFrameworkCore.MySql` -> `Masa.Contrib.Data.EFCore.MySql`
    * `Masa.Contrib.Data.EntityFra`yFrameworkCore.Pomelo.MySql` → `Masa.Contrib.Data.EFCore.Pomelo.MySql`
* `Masa.Contrib.Data.EntityFrameworkCore.InMemory` → `Masa.Contrib.Data.EFCore.InMemory`
* `XXX.EF` -> `XXX.EFCore`
    * `Masa.Contrib.Isolation.UoW.EF` → `Masa.Contrib.Isolation.UoW.EFCore`
    * `Masa.Contrib.Dispatcher.IntegrationEvents.EventLogs.EF` → `Masa.Contrib.Dispatcher.IntegrationEvents.EventLogs.EFCore`
    * `Masa.Contrib.Ddd.Domain.Repository.EF` → `Masa.Contrib.Ddd.Domain.Repository.EFCore`
    * `Masa.Contrib.Data.UoW.EF` → `Masa.Contrib.Data.UoW.EFCore`
    * `Masa.Contrib.Data.Contracts.EF` → `Masa.Contrib.Data.Contracts.EFCore`
* `Oidc` -> `OpenIdConnect`
    * `Masa.BuildingBlocks.Authentication.Oidc.Cache` → `Masa.BuildingBlocks.Authentication.OpenIdConnect.Cache`
    * `Masa.BuildingBlocks.Authentication.Oidc.Domain` → `Masa.BuildingBlocks.Authentication.OpenIdConnect.Domain`.BuildingBlocks.BasicAbility.Cache` → `Masa.BuildingBlocks.StackSdks.Cache`
    * `Masa.BuildingBlocks.BasicAbility.Cache.Contracts` → `Masa.BuildingBlocks.StackSdks.Cache.Contracts`
    * `Masa.BuildingBlocks.BasicAbility.EventBus` → `Masa.BuildingBlocks.StackSdks.EventBus`
    * `Masa.BuildingBlocks.BasicAbility.EventBus.Contracts` → `Masa.BuildingBlocks.StackSdks.EventBus.Contracts`
    * `Masa.BuildingBlocks.BasicAbility.FileStorage` → `Masa.BuildingBlocks.StackSdks.FileStorage`
    * `Masa.BuildingBlocks.BasicAbility.FileStorage.Contracts` → `Masa.BuildingBlocks.StackSdks.FileStorage.Contracts`
    * `Masa.BuildingBlocks.BasicAbility.HealthChecks` → `Masa.BuildingBlocks.StackSdks.HealthChecks`
    * `Masa.BuildingBlocks.BasicAbility.HealthChecks.Contracts` → `Masa.BuildingBlocks.StackSdks.HealthChecks.Contracts`
    * `Masa.BuildingBlocks.BasicAbility.MessageQueue` → `Masa.BuildingBlocks.StackSdks.MessageQueue`
    * `Masa.BuildingBlocks.BasicAbility.MessageQueue.Contracts` → `Masa.BuildingBlocks.StackSdks.MessageQueue.Contracts`
    * `Masa.BuildingBlocks.BasicAbility.Monitoring` → `Masa.BuildingBlocks.StackSdks.Monitoring`
    * `Masa.BuildingBlocks.BasicAbility.Monitoring.Contracts` → `Masa.BuildingBlocks.StackSdks.Monitoring.Contracts`
    * `Masa.BuildingBlocks.BasicAbility.RedisCache` → `Masa.BuildingBlocks.StackSdks.RedisCache`
    * `Masa.BuildingBlocks.BasicAbility.RedisCache.Contracts` → `Masa.BuildingBlocks.StackSdks.RedisCache.Contracts`y.Tsc` → `Masa.Contrib.StackSdks.Tsc`

The following translations are from `BuildingBlocks.BasicAbility` to `Masa.BuildingBlocks.StackSdks` and `Masa.Contrib.BasicAbility` to `Masa.Contrib.StackSdks`:
- `Dcc` → `Dcc`
- `Pm` → `Pm`
- `Mc` → `Mc`
- `Scheduler` → `Scheduler`
- `Tsc` → `Tsc`

The following translations are from `Masa.Contrib.BasicAbility` to `Masa.Contrib.StackSdks`:
- `Auth` → `Auth`
- `Auth.Contracts` → `Auth.Contracts`
- `Dcc` → `Dcc`
- `Pm` → `Pm`
- `Mc` → `Mc`
- `Scheduler` → `Scheduler`
- `Tsc` → `Tsc`y.Tsc` should be changed to `Masa.Contrib.StackSdks.Tsc`.
* `ReadWriteSpliting` should be changed to `ReadWriteSplitting`.
    * `Masa.BuildingBlocks.ReadWriteSpliting.Cqrs` should be changed to `Masa.BuildingBlocks.ReadWriteSplitting.Cqrs`.
    * `Masa.Contrib.ReadWriteSpliting.Cqrs` should be changed to `Masa.Contrib.ReadWriteSplitting.Cqrs`.
* Other changes:
    * `Masa.Contrib.Identity.IdentityModel` should be changed to `Masa.Contrib.Authentication.Identity`.
    * `Masa.BuildingBlocks.Identity.IdentityModel` should be changed to `Masa.BuildingBlocks.Authentication.Identity`.
* Refactoring:
    * `Caller` should be moved from `Utils` to `Contrib`, and the changes should be as follows:
        * `MASA.Utils.Caller.Core` should be changed to `Masa.Contrib.Service.Caller`.
        * `MASA.Utils.Caller.HttpClient` should be changed to `Masa.Contrib.Service.Caller.HttpClient`.
        * `MASA.Utils.Caller.DaprClient` should be changed to `Masa.Contrib.Service.Caller.DaprClient`.
    * `Caching` should be moved from `Utils` to `Contrib`, and the changes should be as follows:
        * `Masa.Utils.Caching.Redis` should be changed to `Masa.Contrib.Caching.Distributed.StackExchangeRedis`.Distributed cache, provided by Redis, see [documentation](/framework/building-blocks/caching/stackexchange-redis).
        * `Masa.Utils.Caching.DistributedMemory` -> `Masa.Contrib.Caching.MultilevelCache` (multilevel cache, provided by combining memory cache and distributed cache, see [documentation](/framework/building-blocks/caching/multilevel-cache))
        * `Masa.Utils.Caching.Core`: deleted, simply delete the package

## Namespace Adjustments

Namespace adjustments have been made, and many namespaces have been deleted. If encountering a non-existent namespace, it can be deleted directly.

## Writing Optimization

1. Integrated events

   :::: code-group
   ::: code-group-item Before 0.6.0

   ```csharp Program.cs
   builder.Services.AddDaprEventBus<IntegrationEventLogService>(options =>
   {
       options.UseEventLog<CatalogDbContext>()
              .UseEventBus()
              .UseUoW<CatalogDbContext>(dbOptions => dbOptions.UseSqlServer());
   });
   ```
   :::
   ::: code-group-item 0.6.0 and later
   ```csharp Program.cs
   builder.Services.AddIntegrationEventBus(options =>
   {
       options.UseDapr().UseEventLog<CatalogDbContext>()herOptions => dispatcherOptions.UseMiddleware(typeof(ValidatorMiddleware<>)))
              .UseUnitOfWork<PaymentDbContext>(dbOptions => dbOptions.UseSqlServer())
              .UseRepository<PaymentDbContext>();
   });
   ```
   :::
   ::::1. The `herOptions` code block is configuring various options for a service, including using Dapr for dispatching, using an event log for the PaymentDbContext, using a middleware for event bus validation, using SQL Server for the PaymentDbContext, and using a repository for the PaymentDbContext.

2. The `UseDapr`, `UseEventLog`, `UseEventBus`, `UseUoW`, and `UseRepository` methods are being called with various options to configure the service.

3. Previously, the service did not support automatic route mapping and required a parameterless constructor. The example code shows a `DemoService` class that maps a GET request to `/api/v1/demo/username` to a `GetUserName` method that returns the string "Tony".```csharp
public class ServiceBase
{
    public string GetUserName()
    {
        return "Tony";
    }
}
```

## `MasaConfiguration`

`MasaConfiguration` supports extension for `IServiceCollection`.

:::: code-group
::: code-group-item Before 0.6.0
```csharp Program.cs
builder.AddMasaConfiguration();
```
:::
::: code-group-item 0.6.0 and later
```csharp Program.cs
builder.Services.AddMasaConfiguration();
```
:::
::::

## OpenIdConnect

Model primary key type changed from `Int` to `Guid`. A new package [Masa.Contrib.Authentication.OpenIdConnect.EFCore.Oracle](/framework/building-blocks/data/orm-efcore/oracle) is added to adapt to the `Oracle` database.