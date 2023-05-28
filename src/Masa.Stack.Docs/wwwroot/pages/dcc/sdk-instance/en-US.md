`MASA.DCC` provides two SDKs, one is `Masa.Contrib.Configuration.ConfigurationApi.Dcc` for getting and managing your configuration information, and the other is `Masa.Contrib.StackSdks.Dcc` for getting tag information.

## Configuration Management Use Case

`DCC` extends the ability to manage remote configurations through `IConfiguration`. This not only depends on the `DCC` SDK, but also on `MasaConfiguration`. `MasaConfiguration` divides configurations into local nodes and remote nodes, and `DCC` is the remote node.

```csharp
IConfiguration
├── Local                                Local node (fixed)
├── ConfigurationApi                     Remote node (Dcc extends its capabilities)
│   ├── AppId                            Replace-With-Your-AppId
│   ├── AppId ├── Redis                  Custom node
│   ├── AppId ├── Redis ├── Host         Parameter
```

Installation

```shell terminal
dotnet add package Masa.Contrib.Configuration //Core of MasaConfiguration
dotnet add package Masa.Contrib.Configuration.ConfigurationApi.Dcc //Provides remote configuration capabilities through DCC
```

### Getting Started

1. Configure the parameters required by `DCC` (remote capabilities)

   ```json appsettings.json
   {
     "DccOptions": {
       //Dcc parameters
   ```

2. Add the `DCC` configuration source to `IConfiguration`

   ```csharp
   public static IHostBuilder CreateHostBuilder(string[] args) =>
       Host.CreateDefaultBuilder(args)
           .ConfigureAppConfiguration((hostingContext, config) =>
           {
               config.AddDccConfiguration(options =>
               {
                   options.AppId = "Replace-With-Your-AppId";
                   options.Environment = hostingContext.HostingEnvironment.EnvironmentName;
               });
           })
           .ConfigureWebHostDefaults(webBuilder =>
           {
               webBuilder.UseStartup<Startup>();
           });
   ```

3. Use the configuration in your application

   ```csharp
   public class HomeController : Controller
   {
       private readonly IConfiguration _configuration;

       public HomeController(IConfiguration configuration)
       {
           _configuration = configuration;
       }

       public IActionResult Index()
       {
           var redisHost = _configuration["Redis:Host"];
           //...
       }
   }
   ```Service Address
       "ManageServiceAddress": "",
       //Redis Node (Dcc uses Redis to provide remote configuration capabilities)
       "RedisOptions": {
         "Servers": [
           {
             "Host": "",
             "Port": ""
           }
         ],
         "DefaultDatabase": 0,
         "Password": ""
       },
       //Application Id
       "AppId": "Masa_Dcc_Test",
       //Environment
       "Environment": "Development",
       //List of configuration objects to access
       "ConfigObjects": [ "AppSettings" ],
       //Encryption key
       "Secret": "",
       //Cluster
       "Cluster": "Default"
     }
   }
   
   ```

2. Register `MasaConfiguration` and use `DCC`

   ```csharp Program.cs
   builder.AddMasaConfiguration(configurationBuilder =>
   {
       configurationBuilder.UseDcc()
   });
   ```

3. Get configuration

   ```csharp
   using Masa.BuildingBlocks.Configuration;
   using Masa.Contrib.Configuration.ConfigurationApi.Dcc;
   
   /// <summary>Controller

   /// <summary>
   /// A test controller for getting configuration
   /// </summary>
   [ApiController]
   [Route("[controller]/[action]")]
   public class DccConfigController : ControllerBase
   {
       private readonly IMasaConfiguration _configuration;
       public DccConfigController(IMasaConfiguration configuration)
       {
           _configuration = configuration;
       }
   
       [HttpGet]
       public string GetConfig()
       {
           // Get the configuration of the current app (if you want to get PublicConfig, you can use GetPublic())
           IConfiguration configuration = _configuration.ConfigurationApi.GetDefault();
           // AppSettings: configuration item name, ConnectionStrings:Db: json path
           string config = configuration.GetSection("AppSettings:ConnectionStrings:Db").Get<string>();
           return config;
       }
   }
   ```

### 2. Custom configuration options mapping

1. Mapped entity

   ```csharp
   public class AppSettings : ConfigurationApiMasaConfHere is the English translation:

1. The following code defines a class `ConfigurationOptions` with three properties: `Logging`, `AllowedHosts`, and `ConnectionStrings`. The `Logging` property is of type `Logging`, which in turn has a property `LogLevel` of type `LogLevel`. The `LogLevel` class has two properties: `Default` and `Microsoft_AspNetCore`. The `ConnectionStrings` property is of type `ConnectionStrings`, which has a single property `Db` of type `string`.

```csharp
public class ConfigurationOptions
{
    public Logging Logging { get; set; }

    public string AllowedHosts { get; set; }

    public ConnectionStrings ConnectionStrings { get; set; }
}

public class Logging
{
    public LogLevel LogLevel { get; set; }
}

public class LogLevel
{
    public string Default { get; set; }

    [JsonPropertyName("Microsoft.AspNetCore")]
    public string Microsoft_AspNetCore { get; set; }
}

public class ConnectionStrings
{
    public string Db { get; set; }
}
```

2. Register `MasaConfiguration` and use `DCC`.

   :::: code-group
   ::: code-group-item No manual mapping required
   ```csharp Program
   builder.Services.AddMasaConfiguration(configurationBuilder =>
   {
       configurationBuilder.UseDcc();
       configurationBuilder.UseMasaOptions(options =>
       {
           // Inherits Configur
   ```options = options;
       }

       [HttpGet]
       public IActionResult GetConfig()
       {
           var config = _options.Value;
           return Ok(config);
       }
   }
   ```

   在上面的代码中，我们使用了`IOptions<T>`来获取配置，其中`T`是我们要获取的配置类。在构造函数中注入`IOptions<T>`，然后通过`_options.Value`来获取配置对象。

   至此，我们已经完成了使用Masa.Configuration获取配置的全部流程。options = options;
       }
   
       [HttpGet]
       public string GetConfig()
       {
           string config = _options.Value.ConnectionStrings.Db;
           return config;
       }
   }
   ```

### 3. Summary

`DCC` provides remote configuration management and viewing capabilities for `IConfiguration`. For complete capabilities, please refer to the [documentation](https://docs.masastack.com/framework/building-blocks/configuration/overview).

In this example, Redis is used as the remote configuration, and the effect and usage of the configuration mounted on `IConfiguration` are introduced. This configuration has nothing to do with `Redis` in `MASA.Contrib.Configuration`. It only shows the difference in the usage and mapping node relationship of the same configuration information in two sources.

### 4. Use case of label management

Get the relevant data (labels) of `DCC` through the `DccClient` of `DCC SDK`.

```csharp
IDccClient
├── LabelService                  Label service
```

1. Install the package

   ``` shell
   dotnet add package Masa.Contrib.StackSdks.Dcc
   ```

2. Register `MasaConfiguration` and use `DCC`

   ```csharp Program.cs
   builder.Services.AddDccClient();
   ```

3. Get the label

   ```csharp
   using Masa.BuildingBlocks.StackSdk.Dcc;
   using Masa.BuildingBlocks.StackSdk.Dcc.Models;
   
   public class LabelController : ControllerBase
   {
       private readonly IDccClient _dccClient;
   
       public LabelController(IDccClient dccClient)
       {
           _dccClient = dccClient;
       }
   
       [HttpGet]
       public async Task<IActionResult> GetLabels()
       {
           var labels = await _dccClient.LabelService.GetLabelsAsync();
           return Ok(labels);
       }
   }
   ```

   This code uses the `GetLabelsAsync` method of the `LabelService` to get the labels.The above code is written in C# and it defines a controller named "DccLabelController" that is used to retrieve a list of labels. The controller is decorated with the attributes "ApiController" and "Route" to specify the route for the HTTP request. The "IDccClient" interface is injected into the controller's constructor to enable communication with the Dcc service. The "GetLabel" method is decorated with the "HttpGet" attribute to specify that it should handle HTTP GET requests. The method retrieves a list of labels by calling the "GetListByTypeCodeAsync" method of the "LabelService" object, which is obtained from the injected "IDccClient" instance. Finally, the method returns the retrieved list of labels.