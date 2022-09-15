---
title: 异常处理
date: 2022/07/21
---

## 介绍

异常处理中提供了`框架异常 (MasaException)`，`用户友好异常 (UserFriendlyException)`模型，以及用于处理Web应用程序异常的模型，并提供了基于中间件的全局异常处理和针对Mvc使用的异常过滤器，在我们开发过程中，全局异常中间件与异常过滤器二选一使用即可

## 必要条件

* [.Net 6.0](https://dotnet.microsoft.com/zh-cn/download/dotnet/6.0)
* 安装`Masa.Utils.Exceptions`

``` C#
dotnet add package Masa.Utils.Exceptions --version
```

## 全局异常中间件

* 使用默认全局异常中间件

当异常类型为`UserFriendlyException`时，输出异常的Message信息，Http状态码为`299`。当类型为其它异常时输出"An error occur in masa framework."，Http状态码为`500`

``` C#
app.UseMasaExceptionHandler();
```

* 针对特定的异常进行处理，以下三选一即可
  * 手动指定`ExceptionHandler`
  
  ``` C#
  app.UseMasaExceptionHandler(options =>
  {
      //支持处理自定义异常
      options.ExceptionHandler = context =>
      {
          if (context.Exception is ArgumentNullException ex)
              context.ToResult(ex.Message, 299);
      };
  });
  ```

  * 实现IExceptionHandler接口，并注册到服务中

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
  
  * 实现`IExceptionHandler`接口，并指定ExceptionHanlder

  ``` C#
  app.UseMasaExceptionHandler(option =>
  {
      option.UseExceptionHanlder<ExceptionHandler>();
  });
  ```

## 异常过滤器

* 使用默认异常过滤器

当异常类型为`UserFriendlyException`时，输出异常的Message信息，Http状态码为`299`。当类型为其它异常时输出"An error occur in masa framework."，Http状态码为`500`

``` C#
builder.Services
    .AddMvc()
    .AddMasaExceptionHandler();
```

* 针对特定的异常进行处理，以下三选一即可
  * 手动指定`ExceptionHandler`
  
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

  * 实现IExceptionHandler接口，并注册到服务中

  ``` C#
  builder.Services.AddSingleton<ExceptionHandler>();
  
  builder.Services
    .AddMvc()
    .AddMasaExceptionHandler();
  ``` 

  * 实现`IExceptionHandler`接口，并指定ExceptionHanlder

  ``` C#
  builder.Services
    .AddMvc()
    .AddMasaExceptionHandler(options =>
    {
        options.UseExceptionHanlder<ExceptionHandler>();
    });
  ```

## 异常与日志

在全局异常中间件或异常过滤器中，默认异常类型与日志的映射关系：

* UserFriendlyException: Information
* 非UserFriendlyException异常: Error

如果我希望异常类型为`UserFriendlyException`（友好异常）不记录日志

  ``` C#
  builder.Services.Configure<MasaExceptionLogRelationOptions>(options =>
  {
      options.MapLogLevel<UserFriendlyException>(LogLevel.None);
  });
  ```