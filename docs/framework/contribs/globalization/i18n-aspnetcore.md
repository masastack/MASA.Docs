---
title: 国际化 - i18n
date: 2022/12/23
---

## 概念

[`Masa.Contrib.Globalization.I18n.AspNetCore`](https://www.nuget.org/packages/Masa.Contrib.Globalization.I18n.AspNetCore)为`I18n`提供了解析当前请求属于哪个区域的能力, 对于`ASP.NET Core Web`项目来说, 只需要使用它即可, 它属于微软提供[本地化的中间件](https://learn.microsoft.com/zh-cn/aspnet/core/fundamentals/localization#localization-middleware)的能力, 它默认支持以下三种方式进行语言切换

* URL 参数 方式： ?culture=en-US，此方式优先级最高，格式为：culture=区域码
* Cookies 方式：cookie 格式为 c=%LANGCODE%|uic=%LANGCODE%，其中 c 是 Culture，uic 是 UICulture, 例如:

``` cookie
c=en-UK|uic=en-US
```

* 客户端浏览器语言自动匹配：如果前面两种方式都没有设置，支持自动根据客户端浏览器语言进行匹配

语言优先级: URL 参数 方式 > Cookies方式 > 客户端语言 > 默认语言

## 使用

与[`Masa.Contrib.Globalization.I18n`](./i18n.md)相比, 它仅仅是增加了使用`I18n`中间件的操作, 完整代码如下

1. 安装`Masa.Contrib.Globalization.I18n.AspNetCore`

``` powershell
dotnet add package Masa.Contrib.Globalization.I18n.AspNetCore
```

> 如果是非`Web`项目, 则仅安装`Masa.Contrib.Globalization.I18n`即可, `Masa.Contrib.Globalization.I18n.AspNetCore`对项目是毫无作用的

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

3. 注册`I18n`, 并修改`Program.cs`

``` C#
builder.Services.AddI18n();
```

4. 使用`I18N`

``` C#
app.UseI18n();//启用本地化中间件, 解析并设置当前请求的区域信息
```

5. 使用`I18n`

``` C#
app.Map("/test", (string key) => I18n.T(key));
```

## 其它

如果你的项目不属于`ASP.NET Core Web`项目, 那么只需要安装[`Masa.Contrib.Globalization.I18n`](https://www.nuget.org/packages/Masa.Contrib.Globalization.I18n), 除此之外, 你需要配合`UI`完成对当前语言的设置即可, 点击查看如何使用[`Masa.Contrib.Globalization.I18n`](./i18n.md)

