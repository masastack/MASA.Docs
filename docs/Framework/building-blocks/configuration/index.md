---
title: 配置
date: 2022/07/01
---

## 介绍

我们开发项目中会有很多需要配置的信息，通过`IConfiguration`我们可以获取到这些配置信息，但由于并非强类型，我们使用起来会不太方便，并且当配置存在相同的节点Key时，如何能获取获取到正确的配置是我们需要考虑的。

为了达成这个目标，我们希望新的配置可以:

1. 支持强类型
2. 配置变更后通知
3. 学习难度低

## 必要条件

* [.Net 6.0](https://dotnet.microsoft.com/zh-cn/download/dotnet/6.0)
* 安装`Masa.Contrib.Configuration`
``` C#
dotnet add package Masa.Contrib.Configuration
```

## 如何使用

### 本地配置

1. 注册`MasaConfiguration`

``` C#
builder.AddMasaConfiguration();
```

2. 新增配置信息，修改文件`appsettings.json`

 ``` json
{
  "AppConfig": {
    "ConnectionStrings": {
      "DefaultConnection": "server=localhost;uid=sa;pwd=P@ssw0rd;database=identity"
    }
  }
}
```

3. 新建类`AppConfig`

``` C#
/// <summary>
/// 自动映射本地节点
/// </summary>
public class AppConfig : LocalMasaConfigurationOptions
{
    /// <summary>
    /// 默认读取根节点下的《AppConfig》节点（默认节点名与类名一致，无需重载Section）
    /// 若当前配置不是根节点或者节点名与类名不一致，则需重载Section并重新赋值，多级节点以:分割
    /// </summary>
    // public override string? Section => null;
    public ConnectionStrings ConnectionStrings { get; set; }
}

public class ConnectionStrings
{
    public string DefaultConnection { get; set; }
}
```

4. 获取`AppConfig`配置信息

``` C#
// 通过DI获取到IOptions<AppConfig> options;

IOptions<AppConfig> options = serviceProvider.GetRequiredService<IOptions<AppConfig>>(); 
Console.WriteLine(options.Value.ConnectionStrings.DefaultConnection);
```

### 本地配置 + 远程配置

实际开发中，我们会有一些配置信息希望保存在远程的配置中心服务上，使得我们的项目支持热更新，目前提供远程配置的实现:

[Dcc](/framework/building-blocks/Configuration/dcc): 集成Masa提供的分布式配置中心

## 常见问题

1. 当配置变更时，如何通知项目？
   1. 通过`IOptionsMonitor<TOptions>`的`OnChange`方法可以获取到配置变更
2. 必须要新建配置对象的类，才能获取到配置吗？原来已经存在配置类，可以使用吗？
   1. 通过增加配置对象的类，分别继承`LocalMasaConfigurationOptions`(本地配置)、`ConfigurationApiMasaConfigurationOptions`(远程配置)完成自动映射
   2. 如果原来已存在类，则可通过手动映射方式完成
    
    ```
    builder.AddMasaConfiguration(configurationBuilder =>
    {
        configurationBuilder.UseMasaOptions(option => {
            option.MappingLocal<AppConfig>("AppConfig");//映射本地配置

            option.MappingConfigurationApi<AppConfig>("Replace-With-Your-AppId", "Replace-With-Your-ConfigObject");//映射远程配置
        });
    });
    ```