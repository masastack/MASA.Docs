ion configuration = new ConfigurationBuilder()
    .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
    .AddJsonFile($"appsettings.{Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT")}.json", optional: true)
    .AddEnvironmentVariables()
    .Build();
```

变成了

```csharp
IConfiguration configuration = new ConfigurationBuilder()
    .AddMasaConfiguration()
    .Build();
```

### 本地配置

本地配置的使用方式和 `Microsoft.Extensions.Configuration` 基本一致，只是在构建 `ConfigurationBuilder` 时，使用了 `AddMasaConfiguration()` 方法。

```csharp
IConfiguration configuration = new ConfigurationBuilder()
    .AddMasaConfiguration()
    .Build();
```

### 远程配置

远程配置需要使用 `AddMasaConfiguration()` 方法的重载版本，传入配置中心的地址和应用程序的名称。

```csharp
IConfiguration configuration = new ConfigurationBuilder()
    .AddMasaConfiguration("http://localhost:5000", "MyApp")
    .Build();
```

## 总结

`MasaConfiguration` 扩展了 `Microsoft.Extensions.Configuration`，提供了更加方便的本地配置和远程配置的使用方式。对于分布式应用程序，使用远程配置可以实现配置的集中管理，方便快捷。ion
├── Local                           Local node (fixed)
│   ├── Redis                       Custom configuration
│   ├── ├── Host                    Parameter
├── ConfigurationApi                Remote node (fixed)
│   ├── AppId                       Replace with your AppId
│   ├── AppId ├── Redis             Custom node
│   ├── AppId ├── Redis ├── Host    Parameter
```

### IMasaConfiguration

Obtained through `DI`, provides the ability to obtain `Local` configuration and `ConfigurationApi` configuration.

### IConfigurationApiClient

Obtained through `DI`, provides the ability to obtain specified remote configuration (different from obtaining configuration through `IConfiguration`, as they have different configuration sources and require sending network requests).

* GetRawAsync: Obtains the raw configuration information.
* GetAsync: Obtains the strongly-typed configuration information.
* GetDynamicAsync: Obtains the dynamically-typed configuration information.

### IConfigurationApiManage

Obtained through `DI`, provides the ability to add or update configuration.

* AddAsync: Adds configuration.
* UpdateAsync: Updates configuration.