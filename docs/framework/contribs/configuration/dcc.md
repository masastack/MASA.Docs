---
title: 配置 - Dcc
date: 2022/07/21
---

## 概念

`Dcc`是分布式配置中心, 默认支持了`Dcc`, 为`MasaConfiguration`提供了远程配置的能力，使项目支持获取远程配置信息的能力

## 使用

1. 安装`Masa.Contrib.Configuration.ConfigurationApi.Dcc`

``` powershell
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

MasaConfiguration默认支持选项模式, Dcc 可以通过继承`ConfigurationApiMasaConfigurationOptions`来实现自动映射, 例如: 

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

> 手动映射可[查看](../../building-blocks/configuration/index.md#手动映射)