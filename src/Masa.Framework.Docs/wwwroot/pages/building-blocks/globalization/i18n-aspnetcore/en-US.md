is a middleware specifically designed for `ASP.NET Core Web` projects to assist in parsing and setting the current thread's culture. It is a part of Microsoft's [localization middleware](https://learn.microsoft.com/zh-cn/aspnet/core/fundamentals/localization#localization-middleware) and supports three ways of language switching by default.

The first way is through URL parameters, with the format of `culture=locale code`, such as `?culture=en-US`. This method has the highest priority.

The second way is through cookies, with the format of `c=%LANGCODE%|uic=%LANGCODE%`. `c` controls which resource file to read, while `uic` controls which culture to use for formatting (different countries have different time formatting standards). For example:

``` cookie
c=en-UK|uic=en-US
```

The third way is through automatic matching of the client browser's language. If the first two methods are not set, the middleware will automatically match the language based on the client browser's language.

The priority of language selection is: URL parameters > Cookies > Client browser language > Default language. If the requested language is not supported, the default language will be used.

To use this middleware, simply install the [`Masa.Contrib.Globalization.I18n.AspNetCore`](https://www.nuget.org/packages/Masa.Contrib.Globalization.I18n.AspNetCore) package. Compared to [`Masa.Contrib.Globalization.I18n`](/framework/building-blocks/globalization/i18n), it is specifically designed for `ASP.NET Core Web` projects.代码如下，只需增加使用 `I18n` 中间件的操作，目的是解析并设置当前线程的区域。完整代码如下：

1. Install `Masa.Contrib.Globalization.I18n.AspNetCore`:

   ```shell
   dotnet add package Masa.Contrib.Globalization.I18n.AspNetCore
   ```

2. Add language resource files:

   :::: code-group
   ::: code-group-item en-US.json
   ```json Resources/I18n/en-US.json
   {
       "Home":"Home"
   }
   ```
   :::
   ::: code-group-item zh-CN.json
   ```json Resources/I18n/zh-CN.json
   {
       "Home":"首页"
   }
   ```
   :::
   ::: code-group-item supportedCultures.json
   ```json Resources/I18n/supportedCultures.json
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
   :::
   ::::

3. Register `I18n` and modify the code as follows:

   ```csharp
   public void ConfigureServices(IServiceCollection services)
   {
       // ...

       services.AddI18n(options =>
       {
           options.DefaultCulture = "zh-CN";
           options.SupportedCultures = new[] { "zh-CN", "en-US" };
           options.ResourceType = typeof(Resources.I18n.Resource);
           options.ResourcePath = "Resources/I18n";
       });

       // ...
   }

   public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
   {
       // ...

       app.UseI18n();

       // ...
   }
   ````程序`

```csharp
builder.Services.AddI18n();
```

4. 使用 `I18N`

```csharp
app.UseI18n();//启用中间件，完成请求解析并为当前请求设置区域
```

5. 使用 `I18n`

```csharp
app.Map("/test", (string key) => I18n.T(key));
```

## 高级用法

### 默认语言

默认语言有两种配置方式，它们分别是:

* 手动指定默认语言
    * 通过`app.UseI18n("{Replace-Your-DefaultCulture}")`
* 约定配置
    * `supportedCultures.json`文件中的第一个语言

它们的优先级是：

手动指定默认语言 > 约定配置

## 其它

如果你的项目不属于 `ASP.NET Core Web` 项目，那么只需要安装 [`Masa.Contrib.Globalization.I18n`](https://www.nuget.org/packages/Masa.Contrib.Globalization.I18n)，除此之外，你需要配合 `UI` 完成对当前语言的设置即可，点击查看如何使用 [`Masa.Contrib.Globalization.I18n`](/framework/building-blocks/globalization/i18n)