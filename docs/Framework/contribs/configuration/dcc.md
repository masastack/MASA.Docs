---
title: 配置 - Dcc
date: 2022/07/21
---

## 介绍

Dcc为MasaConfiguration提供了远程配置的能力，使项目支持获取远程配置信息的能力

## 如何使用

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
  "Secret": "", //Dcc AppId的秘钥，为更新远程配置提供许可
  "Cluster": "Default"
}
```

> Dcc项目需要使用Redis服务

3. 使用Dcc

``` C#
var app = builder.AddMasaConfiguration(configurationBuilder => configurationBuilder.UseDcc()).Build();
```

4. 新增Redis配置类，用于在项目中获取Reids配置

``` C#
/// <summary>
/// 自动映射远程节点Redis映射到RedisOptions类
/// </summary>
public class RedisOptions : ConfigurationApiMasaConfigurationOptions
{
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

## 映射

如果希望通过IOptions、IOptionsMonitor、IOptionsSnapshot来使用配置，则需要映射配置与类的关系，目前有两种方式映射

* 自动映射

配置在远程节点上，则可以继承`ConfigurationApiMasaConfigurationOptions`来实现自动映射，例如：

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

* 手动映射

如果类已经存在，通过手动映射完成配置与类的映射，例如：

```
builder.AddMasaConfiguration(configurationBuilder =>
{
    configurationBuilder.UseMasaOptions(option => 
    {
        option.MappingConfigurationApi<RedisOptions>("{Replace-With-Your-AppId}", "Redis");//映射远程配置
    });
});
```