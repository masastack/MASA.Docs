## 概念

基于 [MASA DCC](/stack/dcc/introduce) 分布式配置中心实现的远程配置。当远程配置发生变更的时候，我们的应用中的配置也会同步更新[查看原理](#同步更新配置)

## 使用

1. 安装 `Masa.Contrib.Configuration.ConfigurationApi.Dcc`

   ``` shell 终端
   dotnet add package Masa.Contrib.Configuration.ConfigurationApi.Dcc
   ```

2. 添加 `MASA DCC` 配置，并注册 DCC 服务

   > MASA DCC 是将配置写入到 Redis。所以我们的项目读取配置信息需要配置 Redis 服务。

   :::: code-group
   ::: code-group-item appsettings.json
   ``` json appsettings.json
   {
     //Dcc配置，扩展Configuration能力，支持远程配置（新增）
     "DccOptions": {
       "ManageServiceAddress ": "http://localhost:8890",
       "RedisOptions": {
         "Servers": [
           {
             "Host": "localhost",
             "Port": 8889
           }
         ],
         "DefaultDatabase": 0,
         "Password": ""
       }
     },
     "AppId": "Dcc's Application Id",
     "Environment": "Development",
     "ConfigObjects": [ "Platforms" ], //待挂载的配置对象名
     "Secret": "", //Dcc AppId的秘钥，为更新远程配置提供许可
     "Cluster": "Default"
   }
   ```
   :::
   ::: code-group-item Program.cs
   ``` csharp Program.cs
   builder.Services.AddMasaConfiguration(configureBuilder => configureBuilder.UseDcc());
   ```
   :::
   ::::

3. 新增 AppConfig 配置类，并继承 `DccConfigurationOptions` 类

   ```csharp
   public class AppConfig : DccConfigurationOptions
   {
       public override string? Section => "App";
       
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

4. 在 MASA DCC 中增加一个 AppConfig 配置项，如下图所示：

   > 增加的配置项，最好添加到指定的应用集群环境中去，指定的应用集群环境是指和appsettings.json配置的AppId、Cluster、Environment 保持一致。
   
   ![DCC-Configuration](https://cdn.masastack.com/framework/building-blocks/configuration/dcc-configuration.png)

5. 在构造函数中注入 `IOptions<AppConfig>` 对象获取`AppConfig`配置信息

   ```csharp
      [Route("api/[controller]")]
      [ApiController]
      public class HomeController : ControllerBase
      {
          private readonly IOptions<AppConfig> _positionTypeOptions;
      
          public HomeController(IOptions<AppConfig> positionTypeOptions)
          {
              _positionTypeOptions = positionTypeOptions;
          }
      
          [HttpGet]
          public AppConfig GetStrings()
          {
              return _positionTypeOptions.Value;
          }
      }
   ```

## 高阶用法


### 手动映射

MASA DCC 配置默认是通过类名称和属性名称去跟远程配置项的名称进行匹配来进行配置的。如果当我们的配置节点和属性名称不一致时，那么可以手动指定映射的配置节点。手动指定配置有以下两种方式：

* 通过重写配置类中的 Section 属性指定映射
* `AddMasaConfiguration` 的时候指定映射

   :::: code-group
   ::: code-group-item 重写Section属性指定映射
   ```csharp AppConfig.cs l:3
   public class AppConfig : DccConfigurationOptions
   {
       public override string? Section => "App";
       
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
   ::: code-group-item AddMasaConfiguration指定映射
   ```csharp Program.cs
   builder.Services.AddMasaConfiguration(configureBuilder =>
   {
       configureBuilder.UseDcc();
       configureBuilder.UseMasaOptions(options =>
       {
           options.MappingConfigurationApi<AppConfig>("Dcc's Application Id","App");
       });
   });
   ```
   :::
   ::::

### 通过 Configuration 获取配置

当然我们的配置也可以通过使用 [IConfiguration](https://learn.microsoft.com/en-us/dotnet/core/extensions/configuration) 或 `IMasaConfiguration` 获取配置。我们更加推荐你使用 `IMasaConfiguration` 去获取配置

首先我们先添加一个配置类，去 MASA DCC 中配置它

```csharp AppConfig.cs l:3
public class AppConfig : DccConfigurationOptions
{
    public override string? Section => "App";
    
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

1. 推荐使用 `IMasaConfiguration` 获取配置值。我们只需要在构造函数中注入该对象，并使用 `ConfigurationApi` 属性中的 `GetSection` 方法

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
           return _masaConfiguration.ConfigurationApi.Get("Dcc's Application Id").GetSection("App:JWTConfig:Issuer")?.Value;
       }
   }
   ```

2. 使用 `IConfiguration` 获取配置值

   > 特此说明：通过 IConfiguration 获取配置需要再配置值前面增加 ConfigurationApi 节点，如获取App节点值，则需要 Configuration[ConfigurationApi:App]。这个获取方式会在 **1.0** 正式版本中调整

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
           return _configuration.GetSection("ConfigurationApi:App:JWTConfig:Issuer")?.Value;
       }
   }
   ```

### 通过 IConfigurationApiClient 获取配置

我们也可以通过 `IConfigurationApiClient` 对象获取配置，以及监听配置变更。并且该对象除了能够获取当前应用的配置，也可以获取其它集群环境应用的配置信息。

1. 获取当前应用的配置

   ```cshapr
   [Route("api/[controller]")]
   [ApiController]
   public class HomeController : ControllerBase
   {
       private readonly IConfigurationApiClient _configurationApiClient;
   
       public HomeController(IConfigurationApiClient configurationApiClient)
       {
           _configurationApiClient = configurationApiClient;
       }
   
       [HttpGet]
       public async Task<AppConfig> GetAppConfig()
       {
           return await _configurationApiClient.GetAsync<AppConfig>("AppConfig", newvalue =>
           {
               Console.WriteLine("值发生了改变");
           });
       }
   }
   ```
   
2. 获取其它集群环境应用的配置

   ```cshapr
   [Route("api/[controller]")]
   [ApiController]
   public class HomeController : ControllerBase
   {
       private readonly IConfigurationApiClient _configurationApiClient;
   
       public HomeController(IConfigurationApiClient configurationApiClient)
       {
           _configurationApiClient = configurationApiClient;
       }
   
       [HttpGet]
       public async Task<AppConfig> GetAppConfig()
       {
           return await _configurationApiClient.GetAsync<AppConfig>("enviroment", "cluster", "appId", "AppConfig", newvalue =>
           {
               Console.WriteLine("值发生了改变");
           });
       }
   }
   ```

### 使用 IConfigurationApiManage 管理配置

当你需要在当前应用修改和更新某个配置的时候，你可以使用 `IConfigurationApiManage` 对象进行管理，如下：

```csharp
[Route("api/[controller]")]
[ApiController]
public class ConfigurationApiManageController : ControllerBase
{
    private readonly IConfigurationApiManage _configurationApiManage;

    public ConfigurationApiManageController(IConfigurationApiManage configurationApiManage)
    {
        _configurationApiManage = configurationApiManage;
    }

    [HttpPost]
    public async Task AddConfiguration()
    {
        var configObjectDic = new Dictionary<string, object> { };
        configObjectDic[nameof(AppConfig)] = new AppConfig
        {
            JWTConfig = new JWTConfig { Audience = "MASAStack.com" },
            PositionTypes = new List<string> { "MASA Stack" }
        };
        await _configurationApiManage.AddAsync("development enviroment", "default cluster", "application id", configObjectDic);
    }

    [HttpPut]
    public async Task UpdateConfiguration()
    {
        var configObject = new AppConfig
        {
            JWTConfig = new JWTConfig { Audience = "MASAStack.com" },
            PositionTypes = new List<string> { "MASA Stack" }
        };
        await _configurationApiManage.UpdateAsync("development enviroment", "default cluster", "application id", nameof(AppConfig), configObject);
    }
}
```

## 原理剖析

### 同步更新配置

   为何分布式配置可以实现远程配置发生更新后, 应用的配置会随之更新?
   
   远程配置更新使用了分布式缓存提供的[Pub/Sub](/framework/building-blocks/caching/stackexchange-redis#使用PubSub)能力
