---
title: 国际化 - 分布式配置能力 (DCC)
date: 2022/12/27
---

## 概念

`I18n`让程序具备了支持多种语言能力, 但它必须配置在本地配置文件中, 具有一定的局限性, 对于后期管理资源文件不太友好, 因此我们打通了与[`分布式配置中心-DCC`](http://localhost:8080/stack/dcc/guide/introduce.html)的协作, 我们可以将多语言的资源内容在`DCC`上进行配置, 后期管理资源文件可以在`DCC`的界面上进行操作, 并且它是支持热更新的

## 使用

1. 以`ASP.NET Core`项目为例, 安装`Masa.Contrib.Globalization.I18n.AspNetCore`、`Masa.Contrib.Globalization.I18n.Dcc`

``` powershell
dotnet add package Masa.Contrib.Globalization.I18n.AspNetCore (通过中间件提供解析设置当前线程区域性的能力)
dotnet add package Masa.Contrib.Globalization.I18n.Dcc (通过分布式配置中心使得`I18n`支持远程配置的能力)
```

2. 添加多语言资源文件, 文件夹结构如下:

``` structure
- Resources
  - I18n
    - en-US.json
    - zh-CN.json
    - supportedCultures.json
```

* en-US.json

``` en-US.json
{
    "Home":"Home"
}
```

* zh-CN.json

``` zh-CN.json
{
    "Home":"首页"
}
```

* supportedCultures.json

``` supportedCultures.json
[
    {
        "Culture":"zh-CN",
        "DisplayName":"中文简体",
        "Icon": "{Replace-Your-Icon}"
    },
    {
        "Culture":"en-US",
        "DisplayName":"English (United States)",
        "Icon": "{Replace-Your-Icon}"
    }
]
```

3. 注册`MasaConfiguration `, 并使用`分布式配置中心 (DCC)`提供的远程配置能力

``` C#
builder.Services.AddMasaConfiguration(configurationBuilder =>
{
    configurationBuilder.UseDcc();
});
```

4. 配置`DCC`所需信息, 修改`appsettings.json`

``` json
{
  "DccOptions": {
    "ManageServiceAddress": "{Replace-Your-DccManagerServiceHost}",
    "RedisOptions": {
      "Servers": [
        {
          "Host": "{Replace-Your-DccUseRedisHost}",
          "Port": 6379
        }
      ],
      "DefaultDatabase": 0,
      "Password": ""
    }
  }
}
```

> 详细情况可[查看](/framework/contribs/configuration/dcc.md)

5. 注册`I18n`, 并修改`Program.cs`

``` C#
builder.Services.AddI18n(null, options => options.UseDcc());
```

通过以上配置, 我们将使用与`DCC`配置中默认AppId, 并读取名称为`Culture.{语言}`的配置对象, 以上述例子来讲, 由于我们支持的语言为`zh-CN`、`en-US`, 因此我们将默认使用与DCC配置一致的默认AppId下的`Culture.zh-CN`、`Culture.en-Us`两个配置对象的值, 后续如果需要管理资源的话, 对应修改它们的值即可, 无需重启应用, 因为它们是支持热更新的 [如何管理对象](https://docs.masastack.com/stack/dcc/guide/quick-get-started/use-guide.html)