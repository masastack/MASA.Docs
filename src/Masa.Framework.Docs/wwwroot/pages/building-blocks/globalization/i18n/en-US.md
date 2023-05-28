": "{Replace-Your-Icon}"
       }
   ]
   ```
   ::::

   在 `Resources` 目录下创建 `I18n` 文件夹，并在该文件夹下创建多语言资源文件，文件名格式为 `语言代码.json`，例如 `en-US.json` 和 `zh-CN.json`。

   在 `supportedCultures.json` 文件中添加支持的语言和对应的显示名称和图标。

3. 在 `Startup.cs` 中配置 `I18n`

   ```csharp Startup.cs
   public void ConfigureServices(IServiceCollection services)
   {
       // ...
       services.AddI18n(options =>
       {
           options.DefaultCulture = "en-US"; // 设置默认语言
           options.SupportedCultures = new[] { "en-US", "zh-CN" }; // 设置支持的语言
           options.ResourcesPath = "Resources/I18n"; // 设置多语言资源文件的路径
       });
       // ...
   }
   ```

4. 在需要使用多语言的地方注入 `I18n`，并使用 `GetString` 方法获取对应语言的字符串

   ```csharp HomeController.cs
   public class HomeController : Controller
   {
       private readonly II18n _i18n;

       public HomeController(II18n i18n)
       {
           _i18n = i18n;
       }

       public IActionResult Index()
       {
           var homeString = _i18n.GetString("Home"); // 获取对应语言的 "Home" 字符串
           ViewData["HomeString"] = homeString;
           return View();
       }
   }
   ```

   在需要使用多语言的地方注入 `II18n` 接口，并使用 `GetString` 方法获取对应语言的字符串。

## 贡献

如果您发现了任何问题或者有任何建议，欢迎提交 issue 或者 PR。感谢您的贡献！1. Introduction

In this tutorial, we will learn how to use the I18n library to implement internationalization in a .NET web application. I18n is a powerful library that provides a simple and flexible way to manage localized resources.

2. Getting Started

To get started, we need to install the I18n library using NuGet. Open the Package Manager Console and run the following command:

```
Install-Package I18n
```

Once the package is installed, we can start using the I18n library in our application.

3. Register I18n

To use I18n, we need to register it with the dependency injection container. In the Program.cs file, add the following code:

```csharp Program.cs l:2
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddI18n();
```

4. Using I18n

Now that we have registered I18n, we can use it in our application. In the following example, we use I18n to translate a string based on the current culture:

```csharp
app.Map("/test", (string key) => I18n.T(key));
```

5. Advanced Usage

I18n provides several advanced features that allow us to customize its behavior.

### Embedding Resources

By default, I18n reads language resources from a file in the default resource path `{SupportCultureName}` (default: `supportedCultures.json`). However, we can also embed the resources directly into the DLL by changing the file properties to `EmbeddedResource`. To use embedded resources, we need to modify the registration code as follows:

```csharp Program.cs
builder.Services.AddI18nByEmbedded(new[] { Assembly.GetEntryAssembly()! });
```

### Modifying the Default Resource Path

We can modify the default resource path by changing the `ResourcesDirectory` property:

```csharp Program.cs
builder.Services.AddI18n(options =>
{
    options.ResourcesDirectory = Path.Combine("Resources", "I18n");
});
```

This will change the default resource path to `Resources/I18n`.