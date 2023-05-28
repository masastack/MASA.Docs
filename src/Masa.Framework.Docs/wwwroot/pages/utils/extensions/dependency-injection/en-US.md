# Extension - Dependency Injection

## Overview

Provides **automatic service registration** functionality and extension methods for `IServiceCollection` type.

> The automatic service registration feature avoids the trouble of manually registering services and automatically registers them through configuration conventions.

## Features

* [Inject by convention](#automatic-registration)
* [Extension methods for IServiceCollection](#section-5ffd75656ce85165-ignoreinjection)

## Usage

1. Install `Masa.Utils.Extensions.DependencyInjection`

   ```shell terminal
   dotnet add package Masa.Utils.Extensions.DependencyInjection
   ```

2. Create an interface class `IRepository` and inherit from `IScopedDependency`

   ```csharp
   public interface IRepository<TEntity> : IScopedDependency
       where TEntity : class
   {
   }
   ```

3. Create an implementation class `RepositoryBase` and inherit from `IRepository`

   ```csharp
   public class Repository<TEntity> : IRepository<TEntity>
       where TEntity : class
   {
   }
   ```

4. Register services according to conventions

   ```csharp l:2
   var services = new ServiceCollection();
   services.AddAutoInject();
   ```

   > Only one registration is supported, multiple registrations are invalid.

5. How to use

   ```csharp l:4
   ```The code above is written in C# and it creates a new `ServiceCollection` object, adds auto-injection functionality to it, and builds a service provider. Then, it retrieves a repository object of a specific type using the service provider. 

For advanced usage, the framework provides automatic registration of services based on certain interfaces that are inherited by the classes. These interfaces include `ISingletonDependency`, `IScopedDependency`, `ITransientDependency`, and `IAutoFireDependency`. When a class inherits one of these interfaces, it will be automatically registered as a service with a specific lifetime. 

If the inherited class is an interface, both the interface and its implementation will be registered, and this registration will be propagated to any interfaces or implementations that inherit from it. For example, the `IRepository<TEntity>` interface inherits from `IScopedDependency`, so any implementation of `IRepository<TEntity>` will be registered as a scoped service, and any interface or implementation that inherits from `IRepository<TEntity>` will also be registered as a scoped service.lass Dependency
   {
   }

   public class Repository<TEntity> : IRepository<TEntity>
       where TEntity : class
   {
   }

   public interface IUserRepository : IRepository<User>
   {
   }

   public class UserRepository : IUserRepository
   {
   }
   ```

   The actual registration effect is equivalent to:

   ```csharp
   services.Add(typeof(IRepository<>), typeof(Repository<>), ServiceLifetime.Scoped);
   services.AddScoped<IUserRepository, UserRepository>();
   ```

2. When the inherited class is a regular class, the current class and its derived classes will be automatically registered, but abstract classes will not be automatically registered. For example:

   ```csharp
   public abstract class ServiceBase: IScopedDependency
   {
   }

   public class UserService: ServiceBase
   {
   }
   ```

   The actual effect is equivalent to:

   ```csharp
   services.AddScoped<UserService>();
   ```

### Attributes

#### IgnoreInjection

Used to exclude classes from automatic injection. You can add the `IgnoreInjection` attribute, for example:

```csharp
[IgnoreInjection]
public class ServiceBase: IScopedDependency
{
}
```ime` 的服务 `TService`，默认为 `ServiceLifetime.Singleton`
* TryAdd\<TService, TImplementation\>()：尝试添加服务 `TService` 的实现 `TImplementation`，如果服务已经存在则不进行添加
    * lifetime：服务的生命周期，默认为 `ServiceLifetime.Singleton`
* TryAddScoped\<TService, TImplementation\>()：尝试添加服务 `TService` 的实现 `TImplementation`，生命周期为 `Scoped`
* TryAddTransient\<TService, TImplementation\>()：尝试添加服务 `TService` 的实现 `TImplementation`，生命周期为 `Transient`
* AddIfNotExists\<TService, TImplementation\>()：如果服务 `TService` 不存在，则添加服务 `TService` 的实现 `TImplementation`
    * lifetime：服务的生命周期，默认为 `ServiceLifetime.Singleton`
* AddScopedIfNotExists\<TService, TImplementation\>()：如果服务 `TService` 不存在，则添加服务 `TService` 的实现 `TImplementation`，生命周期为 `Scoped`
* AddTransientIfNotExists\<TService, TImplementation\>()：如果服务 `TService` 不存在，则添加服务 `TService` 的实现 `TImplementation`，生命周期为 `Transient`The service "TService" provided by "ime" (does not support generic services):
- Any<TService, TImplementation>(): Determines whether there exists a service of type "TService" with an implementation of type "TImplementation".
    - lifetime: Determines whether there exists a service of type "TService" with an implementation of type "TImplementation" and a lifetime of "lifetime" (does not support generic services).
- Replace<TService>(Type implementationType, ServiceLifetime lifetime): Removes the first implementation of the service type "TService" and adds "implementationType" to the collection with a lifetime of "lifetime".
- ReplaceAll<TService>(Type implementationType, ServiceLifetime lifetime): Removes all services of type "TService" and adds "implementationType" to the collection with a lifetime of "lifetime".