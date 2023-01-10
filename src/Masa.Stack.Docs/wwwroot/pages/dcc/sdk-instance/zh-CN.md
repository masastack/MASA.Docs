---
title: SDK示例
date: 2022/09/29
---

### 简介

MASA.DCC提供了两个SDK，一个是`Masa.Contrib.Configuration.ConfigurationApi.Dcc`用来获取和管理你的配置信息。另一个是`Masa.Contrib.StackSdks.Dcc`用来获取标签信息。

### 配置管理用例

通过DCC扩展IConfiguration管理远程配置的能力。而这不单依赖于DCC的SDK，还需要依赖MasaConfiguration。MasaConfiguration把配置分为本地节点和远程节点，而DCC就是远程节点。

```
IConfiguration
├── Local                                本地节点（固定）
├── ConfigurationApi                     远程节点（固定 Dcc扩展其能力）
│   ├── AppId                            Replace-With-Your-AppId
│   ├── AppId ├── Redis                  自定义节点
│   ├── AppId ├── Redis ├── Host         参数
```

安装包：

```c#
Install-Package Masa.Contrib.Configuration //MasaConfiguration的核心
Install-Package Masa.Contrib.Configuration.ConfigurationApi.Dcc //由Dcc提供远程配置的能力
```

#### 入门:

1. 修改`appsettings.json`，配置`Dcc`所需参数（远程能力）

```json
{
  //Dcc配置，扩展Configuration能力，支持远程配置
  "DccOptions": {
    "ManageServiceAddress": "http://localhost:8890",
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
  }
}
```

1. 注册`MasaConfiguration`，并使用`Dcc`，修改`Program.cs`

```c#
builder.AddMasaConfiguration(configurationBuilder =>
{
    configurationBuilder.UseDcc()
});//使用Dcc提供远程配置的能力
```

1. 新建`RedisOptions`类，配置映射关系

```c#
/// <summary>
/// 自动映射节点关系
/// </summary>
public class RedisOptions : ConfigurationApiMasaConfigurationOptions
{
    /// <summary>
    /// 更换为Dcc平台上Redis配置所属AppId
    /// </summary>
    [JsonIgnore]
    public override string AppId { get; set; } = "Replace-With-Your-AppId";

    /// <summary>
    /// 更换为Dcc平台上Redis配置所属配置对象名称，不重写时与类名一致
    /// </summary>
    [JsonIgnore]
    public override string? ObjectName { get; init; } = "Redis";

    public string Host { get; set; }

    public int Port { get; set; }

    public int DefaultDatabase { get; set; }
}
```

> 由于Redis配置在Dcc平台中，因此类需要继承`ConfigurationApiMasaConfigurationOptions`

1. 获取配置

```c#
var app = builder.Build();

app.Map("/GetRedis", ([FromServices] IOptions<RedisOptions> option) =>
{
    //推荐（需要自动或手动映射节点关系后才能使用）
    return System.Text.Json.JsonSerializer.Serialize(option.Value);
});
```

#### 进阶

1. 手动指定映射关系，优势：无需更改原来类的继承关系

```c#
builder.Services.AddMasaConfiguration(configurationBuilder =>
{
    configurationBuilder.UseDcc();
    configurationBuilder.UseMasaOptions(options =>
    {
        options.MappingConfigurationApi<RedisOptions>("Replace-With-Your-AppId", "Redis"); //将RedisOptions绑定映射到ConfigurationApi:AppId:Redis节点
    });
});
```

1. 如何使用

除了通过IOptions、IOptionsMonitor、IOptionsSnapshot之外，还支持通过`IMasaConfiguration`获取

```c#
IMasaConfiguration masaConfiguration;//从DI获取IMasaConfiguration
masaConfiguration.ConfigurationApi["<Replace-With-Your-AppId>:Redis:Host"];
```

#### 总结

Dcc为IConfiguration提供了远程配置的管理以及查看能力，IConfiguration完整的能力请查看[文档](https://github.com/masastack/MASA.Framework/blob/main/src/Contrib/Configuration/Configuration/Masa.Contrib.Configuration/README.zh-CN.md)

此处Redis为远程配置，介绍的是远程配置挂载到IConfiguration之后的效果以及用法，此配置与MASA.Contrib.Configuration中Redis的毫无关系，仅仅是展示同一个配置信息在两个源的使用方式以及映射节点关系的差别

### 标签管理用例

通过DCC SDK的DccClient获取Dcc服务的相关数据（标签）。

```
IDccClient
├── LabelService                  标签服务
```

安装包：

```
Install-Package Masa.Contrib.StackSdks.Dcc
```

appsettings.json

```
{
  "DccOptions": {
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
  }
}
builder.Services.AddDccClient();
```

如何使用：

```
var app = builder.Build();

app.MapGet("/GetProjectTypes", ([FromServices] IDccClient dccClient, string typeCode) =>
{
    return dccClient.LabelService.GetListByTypeCodeAsync(typeCode);
});

app.Run();
```