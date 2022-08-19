---
title: 配置
date: 2022/07/01
---

## 介绍

Configuration配置由本地配置与远程配置两部分来组成，其中核心实现在`Masa.Contrib.Configuration`中，提供了默认Configuration的迁移以及组合远程节点的功能。

目前远程配置的提供者有:

* [Dcc](/framework/contribs/configuration/dcc): 分布式配置中心

## 如何使用

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

## 映射

如果希望通过IOptions、IOptionsMonitor、IOptionsSnapshot来使用配置，则需要映射配置与类的关系，目前有两种方式映射

* 自动映射

配置在本地节点上，则可以继承`LocalMasaConfigurationOptions`来实现自动映射，例如：

``` C#
public class AppConfig : LocalMasaConfigurationOptions
{
    /// <summary>
    /// 默认读取根节点下的《AppConfig》节点（默认节点名与类名一致，无需重载Section）
    /// 若当前配置不是根节点或者节点名与类名不一致，则需重载Section并重新赋值，多级节点以:分割
    /// 如果配置是根节点，则Section的值为空字符串
    /// </summary>
    // public override string? Section => null;

    public ConnectionStrings ConnectionStrings { get; set; }
}
```

* 手动映射

如果类已经存在，通过手动映射完成配置与类的映射，例如：

```
builder.AddMasaConfiguration(configurationBuilder =>
{
    configurationBuilder.UseMasaOptions(option => 
    {
        option.MappingLocal<AppConfig>("AppConfig");//映射本地配置
    });
});
```


## 常见问题

1. 当配置变更时，如何通知项目？
   1. 通过`IOptionsMonitor<TOptions>`的`OnChange`方法可以获取到配置变更