Global Configuration

The following properties or methods are provided:

* RootServiceProvider: `RootServiceProvider`, initialized only once
* Build: used to build `RootServiceProvider`
* GetService: get the instance of the specified `Service`, returns `null` if the instance does not exist
* GetRequiredService: get the instance of the specified `Service` (throws an exception if the service is not registered)
* TrySetServiceCollection: attempt to store the global service collection, skip if the service already exists
* SetServiceCollection: re-store the global service collection
* GetServices: get the global service collection
* TrySetAssemblies: attempt to set the global `Assembly` collection, skip if already set
* SetAssemblies: set the global `Assembly` collection
* GetAssemblies: get the global `Assembly` collection, returns `AppDomain.CurrentDomain.GetAssemblies()` if the global `Assembly` collection is not set
* TrySetJsonSerializerOptions: attempt to set the global `JsonSerializerOptions` configuration, skip if already set
* SetJsonSerializerOptions: set the global `JsonSerializerOptions` configuration
* GetJsonSerializerOptions: return the global `JsonSerializerOptions` configuration, returns `null` if not set

Global configuration is used to provide default values, for example:

When registering `MinimalAPIs` without specifying the collection of assemblies to scan for services, the global `Assembly` collection is used by default. However, if the collection of assemblies is specified during registration, the manually specified collection takes precedence over the global configuration, with the priority:

Manually specified > Global configuration

```csharp
builder.Add...Services();

> With the exception of `MinimalAPIs`, all other modules adhere to the priority rule of `manual specification` > `global configuration`.