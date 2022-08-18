---
title: 配置 - Dcc
date: 2022/07/21
---

1. 安装`Masa.Contrib.Configuration.ConfigurationApi.Dcc`

``` shell
dotnet add package Masa.Contrib.Configuration.ConfigurationApi.Dcc
```

2. 配置Dcc服务器信息，修改`appsettings.json`

``` appsettings.json
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
  "AppId": "Replace-With-Your-AppId",
  "Environment": "Development",
  "ConfigObjects": [ "Platforms" ], //待挂载的配置对象名
  "Secret": "", //Dcc App 秘钥，为更新远程配置提供许可
  "Cluster": "Default"
}
```

3. 使用Dcc

``` C#
var app = builder.AddMasaConfiguration(configurationBuilder =>
{
    configurationBuilder.UseDcc();
}).Build();
```

4. 新增Redis配置类，用于在项目中获取Reids配置

``` C#
/// <summary>
/// 自动映射远程节点Redis映射到RedisOptions类
/// </summary>
public class RedisOptions : ConfigurationApiMasaConfigurationOptions
{
    /// <summary>
    /// 配置中心的AppId，如果与默认AppId一致，可省略
    /// </summary>
    [JsonIgnore]
    public override string AppId { get; set; } = "Replace-With-Your-AppId";

    /// <summary>
    /// 配置对象名称, 如果配置对象名与类名一致，可省略
    /// </summary>
    [JsonIgnore]
    public override string? ObjectName { get; init; } = "Redis";

    public string Host { get; set; }

    public int Port { get; set; }

    public string Password { get; set; }

    public int DefaultDatabase { get; set; }
}
```

5. 获取Redis配置信息

``` C#
// 通过DI获取到IOptions<RedisOptions> options;

IOptions<RedisOptions> options = serviceProvider.GetRequiredService<IOptions<RedisOptions>>(); 
Console.WriteLine(options.Value.Host + ":" + options.Value.Port);
```