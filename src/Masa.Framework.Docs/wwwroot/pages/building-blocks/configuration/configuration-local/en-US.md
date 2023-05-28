# Configuration - Local Configuration

Based on `Microsoft.Extensions.Configuration`, it has been optimized so that you don't need to manually `Configure<XXXOptions>`.

## Usage

1. Register `MasaConfiguration`

   ```csharp
   builder.Services.AddMasaConfiguration(new List<Assembly>{ typeof(Program).Assembly });
   ```

2. Add a configuration class `AppConfig` and add configuration items in the `appsettings.json` file.

   :::: code-group
   ::: code-group-item AppConfig.cs
   ```csharp AppConfig.cs
   public class AppConfig : LocalMasaConfigurationOptions
   {
       public List<string> PositionTypes { get; set; }
   
       public JWTConfig JWTConfig { get; set; }
   }
   
   public class JWTConfig
   {
       public string Issuer { get; set; }
       public string SecretKey { get; set; }
       public string Audience { get; set; }
   }
   ```
   :::
   ::: code-group-item appsettings.json

   ```json appsettings.json l:2-9
   {
     "AppConfig": {
       "PositionTypes": [ "Low", "Middle", "High" ],
       "JWTConfig": {
         "Issuer": "masa",
         "SecretKey": "masa_secret_key",
         "Audience": "masa_audience"
       }
     }
   }
   ```
   :::
   ::::h-cn/dotnet/architecture/microservices/multi-container-microservice-net-applications/options-pattern)，可以通过 `IOptionsMonitor<T>` 接口来实现选项模式。选项模式可以让我们更方便地管理配置信息，同时也支持配置热更新。

### 配置热更新

在 `ASP.NET Core` 中，我们可以通过 `IOptionsMonitor<T>` 接口来实现配置热更新。具体实现方式是在 `Startup.cs` 中注册 `IOptionsMonitor<T>`，然后在需要使用配置信息的地方注入 `IOptionsMonitor<T>` 对象。当配置信息发生变化时，`IOptionsMonitor<T>` 会自动更新配置信息。

```csharp
public void ConfigureServices(IServiceCollection services)
{
    services.Configure<AppConfig>(Configuration.GetSection("AppConfig"));
    services.AddSingleton<IOptionsMonitor<AppConfig>, OptionsMonitor<AppConfig>>();
}

public class HomeController : ControllerBase
{
    private readonly IOptionsMonitor<AppConfig> _appConfig;

    public HomeController(IOptionsMonitor<AppConfig> appConfig)
    {
        _appConfig = appConfig;
        _appConfig.OnChange(config =>
        {
            // 配置信息发生变化时的回调函数
        });
    }

    [HttpGet]
    public AppConfig GetConfig()
    {
        return _appConfig.CurrentValue;
    }
}
```

以上就是 `ASP.NET Core` 中使用本地配置的基本用法和高阶用法。通过本地配置，我们可以方便地管理应用程序的配置信息，同时也支持配置热更新，让我们的应用程序更加灵活和可维护。ic JWTConfig JWTConfig { get; set; }
}

public class JWTConfig
{
    public string Issuer { get; set; }
    public string SecretKey { get; set; }
    public string Audience { get; set; }
}
```
:::

::: code-group-item Program.cs
```csharp Program.cs
var builder = new ConfigurationBuilder()
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
    .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
    .AddEnvironmentVariables();

var configuration = builder.Build();

var jwtConfig = new JWTConfig();
configuration.GetSection("JWTConfig").Bind(jwtConfig);

var appConfig = new AppConfig();
configuration.GetSection("AppConfig").Bind(appConfig);

Console.WriteLine($"Issuer: {jwtConfig.Issuer}");
Console.WriteLine($"SecretKey: {jwtConfig.SecretKey}");
Console.WriteLine($"Audience: {jwtConfig.Audience}");
Console.WriteLine($"PositionTypes: {string.Join(",", appConfig.PositionTypes)}");
```
:::
::::

在上面的代码中，我们手动指定了 `JWTConfig` 和 `AppConfig` 的映射节点，并通过 `Bind` 方法将配置信息绑定到对应的类中。```csharp
public class JWTConfig
{
    public string Issuer { get; set; }
    public string SecretKey { get; set; }
    public string Audience { get; set; }
}

public class AppConfig
{
    public List<string> PositionTypes { get; set; }
    public JWTConfig JWTConfig { get; set; }
}

// In ConfigureServices method
builder.Services.AddMasaConfiguration(configureBuilder =>
{
    configureBuilder.UseMasaOptions(options =>
    {
        options.MappingLocal<AppConfig>("App");
    });
});

// In your code, you can get the configuration like this:
var config = serviceProvider.GetService<IMasaConfiguration>().Get<AppConfig>();
var positionTypes = config.PositionTypes;
var jwtConfig = config.JWTConfig;
```uration方法注册了配置，推荐使用IMasaConfiguration获取配置值。如果使用了其他方式注册配置，可以使用IConfiguration获取配置值。

It is recommended to use `IMasaConfiguration` to get configuration values. We only need to inject this object in the constructor and use the `GetSection` method in the `Local` property to retrieve the configuration value.

```csharp l:15
[Route("api/[controller]")]
[ApiController]
public class HomeController : ControllerBase
{
    private readonly IMasaConfiguration _masaConfiguration;

    public HomeController(IMasaConfiguration masaConfiguration)
    {
        _masaConfiguration = masaConfiguration;
    }

    [HttpGet]
    public string? GetStrings()
    {
        return _masaConfiguration.Local.GetSection("App:JWTConfig:Issuer")?.Value;
    }
}
```

If you have registered the configuration using the `AddMasaConfiguration` method, it is recommended to use `IMasaConfiguration` to get the configuration value. If you have registered the configuration using other methods, you can use `IConfiguration` to get the configuration value."uration" requires adding the "Local" node before the configuration value when accessing it through IConfiguration. For example, to get the value of the App node, you need to use Configuration[Local:App]. This way of accessing configuration values will be adjusted in version 1.0.

```csharp l:15
[Route("api/[controller]")]
[ApiController]
public class HomeController : ControllerBase
{
    private readonly IConfiguration _configuration;

    public HomeController(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    [HttpGet]
    public string? GetStrings()
    {
        return _configuration.GetSection("Local:App:JWTConfig:Issuer")?.Value;
    }
}
```

## Analysis

### Automatic Configuration Mapping

The reason why there is no need to manually `Configure<xxxOptions>` in MASA Framework is mainly because it scans the assembly collection passed in the `AddMasaConfiguration(assemblies)` method (defaults to the current assembly if not passed) to find all classes that inherit from `LocalMasaConfigurationOptions`. Then it traverses the subclass collection and creates a `NamedConfigureFromConfigurationOptions` object for each subclass. This object maps the configuration values to the corresponding options object.Add an Options configuration to the instance using Microsoft.Extensions.Options.NamedConfigureFromConfigurationOptions.