## 介绍

提供了配置的核心实现以及默认Configuration的迁移以及组合远程节点的功能。

## 使用

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

## 配置

MasaConfiguration默认支持选项模式, 本地配置可以通过继承`LocalMasaConfigurationOptions`来实现自动映射, 例如:

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

> 手动映射可[查看](/building-blocks/framework/configuration/override#手动映射)