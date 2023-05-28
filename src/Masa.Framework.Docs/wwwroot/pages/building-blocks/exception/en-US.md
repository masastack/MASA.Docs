# Exception Handling

## Overview

Provides a model for handling exceptions in web applications, and offers global exception handling based on middleware and exception filters for use with MVC. In actual development, either the global exception middleware or the exception filter can be used.

## Features

* [Supports I18n](/framework/building-blocks/globalization/i18n)
* [Supports custom exception handling](#advanced-usage)
* [Custom exception types](#custom-exception-handling)

## Usage

The global exception middleware and global exception filter are two ways to handle exceptions, and their execution order is different. For details, see [ASP.NET Core Middleware](https://learn.microsoft.com/zh-cn/aspnet/core/fundamentals/middleware) and [Filters in ASP.NET Core](https://learn.microsoft.com/zh-cn/aspnet/core/mvc/controllers/filters).

1. Install `Masa.Contrib.Exceptions`

   ```shell Terminal
   dotnet add package Masa.Contrib.Exceptions
   ```

2. Use global exception middleware/global exception filter

   :::: code-group
   ::: code-group-item Global Exception Middleware

   ```csharp Program.cs
   app.UseMasaExceptionHandler();
   ```
   :::
   ::: code-group-item Global Exception Filter

   ```csharp Program.cs l:3
   builder.Services
       .AddMvc()
       .AddMvcOptions(options =>
       {
           options.Filters.Add<MasaExceptionFilter>();
       });
   ```

   ::::
   
The default supports `i18n`. When the service uses `i18n`, the exception information will be converted to the corresponding language based on the request culture information.```csharp
       .AddMasaExceptionHandler();
   ```
   :::
   ::::

   > Choose either middleware or filter to use.

## Configuration

### Exception Types and Log Levels

In the global exception middleware or exception filter, the default mapping between exception types and log levels is:

* UserFriendlyException: Information
* Non-UserFriendlyException: Error

If I want the exception type `UserFriendlyException` (friendly exception) not to be logged:

```csharp
builder.Services.Configure<MasaExceptionLogRelationOptions>(options =>
{
    options.MapLogLevel<UserFriendlyException>(LogLevel.None);
});
```

> By configuring the mapping between exception types and log levels, it will change the default relationship between global exception types and log levels. However, if the log level is specified when throwing an exception, the current exception will not be affected by the default relationship. For example:

```csharp
throw new MasaException("Custom exception error, the current log level is Warning.", LogLevel.Warning);
```

## Advanced Usage

### Custom Exception Handling

#### Middleware

:::: code-group
::: code-group-item Manually specify exception handling
```csharp Program.cs l:4-8
app.UseMasaExceptionHandler(options =>
{
    // Handle custom exceptions
    options.ExceptionHandler = context =>
    {
        if (context.Exception is ArgumentNullException)
        {
            context.Response.StatusCode = StatusCodes.Status400BadRequest;
            context.Response.ContentType = "text/plain";
            return context.Response.WriteAsync("ArgumentNullException occurred.");
        }

        return Task.CompletedTask;
    };
});
```
:::

::: code-group-item Use a custom exception handler class
```csharp Program.cs l:10-14
app.UseMasaExceptionHandler<CustomExceptionHandler>();
```
:::
::::

#### Filter

```csharp
services.AddControllers(options =>
{
    options.Filters.Add<MasaExceptionFilter>();
});
```

### Custom Exception Types

```csharp
public class CustomException : Exception
{
    public CustomException(string message) : base(message)
    {
    }
}

public class CustomExceptionHandler : IMasaExceptionHandler
{
    public Task HandleAsync(HttpContext context, Exception exception)
    {
        if (exception is CustomException)
        {
            context.Response.StatusCode = StatusCodes.Status400BadRequest;
            context.Response.ContentType = "text/plain";
            return context.Response.WriteAsync("CustomException occurred.");
        }

        return Task.CompletedTask;
    }
}
```

```csharp
builder.Services.Configure<MasaExceptionOptions>(options =>
{
    options.ExceptionTypes.Add(typeof(CustomException));
});
```ExceptionContext context)
{
    if (context.Exception is ArgumentNullException)
    {
        // Log the warning message
        _logger.LogWarning(context.Message);
        
        // Return a custom error result with status code 299
        context.ToResult(context.Exception.Message, 299);
    }
}
```

```csharp
// Register the custom exception handler
builder.Services.AddSingleton<ExceptionHandler>();

var app = builder.Build();

// Use the custom exception handler
app.UseMasaExceptionHandler();
```
:::ExceptionLogger _logger;

    public ExceptionHandler(ExceptionLogger logger)
    {
        _logger = logger;
    }

    public void HandleException(ExceptionContext context)
    {
        if (context.Exception is ArgumentNullException)
        {
            context.ToResult(context.Exception.Message, 299);
        }
        else
        {
            _logger.LogException(context.Exception);
            context.ToResult("An error occurred while processing your request.", 500);
        }
    }
}

builder.Services.AddSingleton<ExceptionLogger>();

builder.Services
    .AddMvc()
    .AddMasaExceptionHandler(options =>
    {
        options.UseExceptionHandler<ExceptionHandler>();
    });
```
:::
::: code-group-item 使用自定义异常处理程序
```csharp l:1-17,19,23
public class ExceptionHandler : IMasaExceptionHandler
{
    private readonly ExceptionLogger _logger;

    public ExceptionHandler(ExceptionLogger logger)
    {
        _logger = logger;
    }

    public void HandleException(ExceptionContext context)
    {
        if (context.Exception is ArgumentNullException)
        {
            context.ToResult(context.Exception.Message, 299);
        }
        else
        {
            _logger.LogException(context.Exception);
            context.ToResult("An error occurred while processing your request.", 500);
        }
    }
}

builder.Services.AddSingleton<ExceptionLogger>();

builder.Services
    .AddMvc()
    .AddMasaExceptionHandler(options =>
    {
        options.UseExceptionHandler<ExceptionHandler>();
    });
```
:::
::::

以上是在 ASP.NET Core 中使用 Masa 异常处理程序的示例代码。dSingleton<ExceptionHandler>();

builder.Services
  .AddMvc()
  .AddMasaExceptionHandler();
```
::: 
::: code-group-item 使用自定义异常处理程序（翻译）
```
ILogger<ExceptionHandler> _logger;
public ExceptionHandler(ILogger<ExceptionHandler> logger)
{
    _logger = logger;
}

public void OnException(MasaExceptionContext context)
{
    if (context.Exception is ArgumentNullException)
    {
        _logger.LogWarning(context.Message);
        context.ToResult(context.Exception.Message, 299);
    }
}
builder.Services.AddSingleton<ExceptionHandler>();

builder.Services
  .AddMvc()
  .AddMasaExceptionHandler();
```
翻译：

```csharp
ILogger<ExceptionHandler> _logger;
public ExceptionHandler(ILogger<ExceptionHandler> logger)
{
    _logger = logger;
}

public void OnException(MasaExceptionContext context)
{
    // 如果异常是 ArgumentNullException 类型
    if (context.Exception is ArgumentNullException)
    {
        // 记录警告日志
        _logger.LogWarning(context.Message);
        // 将异常信息转换为结果并返回
        context.ToResult(context.Exception.Message, 299);
    }
}

// 将自定义异常处理程序注册为单例服务
builder.Services.AddSingleton<ExceptionHandler>();

// 将自定义异常处理程序添加到 MVC 中
builder.Services
  .AddMvc()
  .AddMasaExceptionHandler();
```

说明：以上代码是一个自定义异常处理程序的示例，它实现了 `IMasaExceptionHandler` 接口，并在 `OnException` 方法中处理了特定类型的异常。在 `AddMasaExceptionHandler` 方法中，我们将自定义异常处理程序添加到 MVC 中，以便在应用程序中捕获和处理异常。The code snippet is registering a custom exception handler in the `dMvc()` method. The `AddMasaExceptionHandler()` method is used to add the custom exception handler, which can be obtained through dependency injection or by using a custom exception handler with a parameterless constructor. The `MASA Framework` provides several common exception types, and when an API service throws one of these exceptions, the server will respond with the corresponding `Http` status code. The `HttpStatusCode` for a validation exception is 298, and it has a fixed response format. The `Masa Blazor` can be used in conjunction with this to provide more user-friendly form validation. Additionally, the framework supports multiple languages through `I18n`.Combination, better user experience

1. Install `Masa.Contrib.Globalization.I18n.AspNetCore`

   ```shell terminal
   dotnet add package Masa.Contrib.Globalization.I18n.AspNetCore
   ```

2. Install `exception`

   ```shell terminal
   dotnet add package Masa.Contrib.Exceptions
   ```

3. Register `i18n` and use global exception middleware

   ```csharp Program.cs l:3,9,11-17
   var builder = WebApplication.CreateBuilder(args);
   
   builder.Services.AddI18n();
   
   var app = builder.Build();
   
   app.UseHttpsRedirection();
   
   app.UseI18n();
   
   app.UseMasaExceptionHandler(exceptionHandlerOptions =>
   {
       exceptionHandlerOptions.ExceptionHandler = exceptionContext =>
       {
           
       };
   });
   
   app.Run();
   ```

4. Create multi-language resource files

   :::: code-group
   ::: code-group-item en-US.json

   ```json Resources/I18n/en-US.json
   {
     "Exception": {
       "NotSupport": "Unsupported Combination"
     }
   }
   ```

   ::: code-group-item zh-CN.json

   ```json Resources/I18n/zh-CN.json
   {
     "Exception": {
       "NotSupport": "不支持的组合"
     }
   }
   ```

   ::::

5. Use multi-language resources in code

   ```csharp
   var message = i18n["Exception:NotSupport"];
   ```1. Introduction to Localization

Localization is the process of adapting a product or service to meet the language, cultural, and other specific requirements of a particular country or region. In software development, localization is the process of translating software user interfaces and other content into different languages and adapting them to local cultures.

2. Benefits of Localization

Localization can help businesses expand their reach and increase their customer base by making their products and services accessible to people in different countries and regions. It can also improve customer satisfaction by providing a more personalized and culturally relevant experience.

3. Localization Best Practices

When localizing software, it is important to consider the following best practices:

- Use a professional translation service to ensure accurate and high-quality translations.
- Test the localized software thoroughly to ensure that it works correctly and is culturally appropriate.
- Use Unicode encoding to support all languages and scripts.
- Use a localization framework or tool to manage the localization process and simplify the translation and deployment of localized content.
- Provide clear and concise documentation and support in the user's language.

4. Example of Localization

Here is an example of how localization can be implemented in a software application:

- Define the localized resources in separate JSON files for each language, such as en-US.json for English (United States) and zh-CN.json for Chinese (Simplified).
- Use a supportedCultures.json file to define the list of supported cultures and their display names and icons.
- Use a localization framework or tool, such as .NET Core's built-in localization support, to load the appropriate localized resources based on the user's language preference.
- Use friendly exception messages to provide clear and helpful error messages to users in their language.

5. Conclusion

Localization is an important aspect of software development that can help businesses reach a wider audience and improve customer satisfaction. By following best practices and using localization frameworks and tools, developers can simplify the localization process and provide a seamless and culturally relevant experience for users around the world.出异常
* ThrowIfLessThan：参数小于指定值时抛出异常
* ThrowIfGreaterThan：参数大于指定值时抛出异常

## Code Sample

The following code sample shows the usage of the exception classes provided by the MASA Framework:

```csharp
app.MapGet("/masa-argument-exception", () =>
{
    List<string> list = null;
    MasaArgumentException.ThrowIfNullOrEmptyCollection(list, "list");
    return I18n.T("Tip.VerificationSucceeded");
});

app.MapGet("/user-friendly-exception", () =>
{
    throw new UserFriendlyException(errorCode: "Exception.NotSupport");
});

app.MapGet("/masa-exception", () =>
{
    throw new MasaException("An error occurred while processing your request.");
});
```

In the above code sample, we use the `MasaArgumentException` class to validate the input parameter `list`. If the parameter is null or an empty collection, an exception will be thrown with the message "list cannot be null or empty".

We also use the `UserFriendlyException` class to throw a user-friendly exception with the error code "Exception.NotSupport".

Finally, we use the `MasaException` class to throw a general exception with the message "An error occurred while processing your request".Exception Handling
* ThrowIfNullOrEmpty: Throws an exception when the parameter is `null` or an empty string.
* ThrowIfNullOrWhiteSpace: Throws an exception when the parameter is `null` or contains only white space characters.
* ThrowIfGreaterThan: Throws an exception when the parameter is greater than `{value}`.
* ThrowIfGreaterThanOrEqual: Throws an exception when the parameter is greater than or equal to `{value}`.
* ThrowIfLessThan: Throws an exception when the parameter is less than `{value}`.
* ThrowIfLessThanOrEqual: Throws an exception when the parameter is less than or equal to `{value}`.
* ThrowIfOutOfRange: Throws an exception when the parameter is not within the specified range (\< minValue & \> maxValue).
* ThrowIfContain: Throws an exception when the parameter contains the specified string.
* ThrowIf: Throws an exception when the condition is met.

### MasaValidatorException

An extension of the MasaArgumentException, MasaValidatorException is a validation exception class provided by the MASA Framework. By default, it throws an error code of `298` with a fixed format output: 

``` http
"Validation failed: 
-- {Name}: {Message1} Severity: {ValidationLevel}
-- {Name2}: {Message2} Severity: {ValidationLevel}"
```

> When used in conjunction with [MasaBlazor](/blazor/introduction/why-masa-blazor), it can provide better form validation effects.