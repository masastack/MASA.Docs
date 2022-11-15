---
title: 异常处理
date: 2022/11/15
---

## 概念

为Web应用程序提供处理异常的模型, 并提供了基于中间件的全局异常处理和针对MVC使用的异常过滤器来处理异常信息, 在我们实际开发过程中, 全局异常中间件与异常过滤器二选一使用即可

## 功能

* [支持I18n](./i18n.md)
* [支持自定义异常处理](#高阶用法)

## 配置

### 异常类型与日志等级

在全局异常中间件或异常过滤器中，异常类型与日志的默认映射关系：

* UserFriendlyException: Information
* 非UserFriendlyException异常: Error

如果我希望异常类型为`UserFriendlyException`（友好异常）不记录日志

``` C#
builder.Services.Configure<MasaExceptionLogRelationOptions>(options =>
{
    options.MapLogLevel<UserFriendlyException>(LogLevel.None);
});
```

> 通过配置异常类型与日志等级, 它将更改全局异常类型与日志等级的默认关系, 但如果抛出异常时指定了日志等级, 则当前异常不受默认关系影响, 比如:

``` C#
throw new MasaException("自定义异常错误, 当前日志等级为Warning.", LogLevel.Warning);
```

## 使用

全局异常中间件与全局异常过滤器是两种处理异常的手段, 它们的执行顺序是不同的，详细可查看[ASP.NET Core 中间件](https://learn.microsoft.com/zh-cn/aspnet/core/fundamentals/middleware)、[ASP.NET Core 中的筛选器](https://learn.microsoft.com/zh-cn/aspnet/core/mvc/controllers/filters)

它们默认支持i18n, 当服务

### 全局异常中间件

1. 修改`Program.cs`, 使用全局异常中间件

``` C#
app.UseMasaExceptionHandler();
```

### 全局异常过滤器

1. 修改`Program.cs`, 使用全局异常过滤器

``` C#
builder.Services
    .AddMvc()
    .AddMasaExceptionHandler();
```

## 高阶用法

### 自定义异常处理

#### 中间件

方案一. 手动指定异常处理`ExceptionHandler`
  
``` C#
app.UseMasaExceptionHandler(options =>
{
    //处理自定义异常
    options.ExceptionHandler = context =>
    {
        if (context.Exception is ArgumentNullException ex)
            context.ToResult(ex.Message, 299);
    };
});
```

方案二. 实现IExceptionHandler接口，并注册到服务中

``` C#
public class ExceptionHandler : IMasaExceptionHandler
{
    private readonly ILogger<ExceptionHandler> _logger;
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
}
builder.Services.AddSingleton<ExceptionHandler>();
app.UseMasaExceptionHandler();
```

方案三. 实现`IExceptionHandler`接口，并指定ExceptionHanlder

``` C#
app.UseMasaExceptionHandler(option =>
{
    option.UseExceptionHanlder<ExceptionHandler>();
});
```

#### 异常过滤器

方案一. 手动指定`ExceptionHandler`

``` C#
builder.Services
    .AddMvc()
    .AddMasaExceptionHandler(options =>
    {
        options.ExceptionHandler = context =>
        {
            if (context.Exception is ArgumentNullException ex)
                context.ToResult(ex.Message, 299);
        };
    });
```

方案二. 实现IExceptionHandler接口，并注册到服务中

``` C#
builder.Services.AddSingleton<ExceptionHandler>();

builder.Services
  .AddMvc()
  .AddMasaExceptionHandler();
``` 

方案三. 实现`IExceptionHandler`接口，并指定ExceptionHanlder

``` C#
builder.Services
  .AddMvc()
  .AddMasaExceptionHandler(options =>
  {
      options.UseExceptionHanlder<ExceptionHandler>();
  });
```

### I18n

当异常类型是`MasaException`时, 如果`ErrorCode`不等于`null`或空字符 且使用了I18n，则会根据当前请求的Culture返回对应语言下的Message, 否则返回其Message

### Exception与HttpStatusCode

|  异常类型   | 描述  |  HttpStatusCode  |
|  ----  | ----  | ----  |
| UserFriendlyException  | 用户友好异常 | 299 |
| MasaValidatorException  | 验证异常 | 298 |
| MasaArgumentException  | 参数异常 | 500 |
| MasaException  | 内部服务错误 | 500 |

> HttpStatusCode为298是验证异常，存在固定格式的响应信息
> Validation failed: 
> -- {Name}: {Message} Severity: {ValidationLevel}

::: tip 提示
HttpStatusCode为298是验证异常，存在固定格式的响应信息

``` http
Validation failed: 
-- {Name}: {Message} Severity: {ValidationLevel}
-- {Name2}: {Message2} Severity: {ValidationLevel}
```
:::