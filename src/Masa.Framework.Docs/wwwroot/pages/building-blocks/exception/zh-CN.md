## 异常处理

为Web应用程序提供处理异常的模型, 并提供了基于中间件的全局异常处理和针对MVC使用的异常过滤器来处理异常信息, 在我们实际开发过程中, 全局异常中间件与异常过滤器二选一使用即可

## 功能

* [支持I18n](/framework/building-blocks/globalization/i18n)
* [支持自定义异常处理](#高阶用法)
* [自定义异常类型](#自定义异常处理)

## 配置

### 异常类型与日志等级

在全局异常中间件或异常过滤器中，异常类型与日志的默认映射关系：

* UserFriendlyException: Information
* 非UserFriendlyException异常: Error

如果我希望异常类型为`UserFriendlyException`（友好异常）不记录日志

```csharp
builder.Services.Configure<MasaExceptionLogRelationOptions>(options =>
{
    options.MapLogLevel<UserFriendlyException>(LogLevel.None);
});
```

> 通过配置异常类型与日志等级, 它将更改全局异常类型与日志等级的默认关系, 但如果抛出异常时指定了日志等级, 则当前异常不受默认关系影响, 比如:

```csharp
throw new MasaException("自定义异常错误, 当前日志等级为Warning.", LogLevel.Warning);
```

## 使用

全局异常中间件与全局异常过滤器是两种处理异常的手段, 它们的执行顺序是不同的，详细可查看[ASP.NET Core 中间件](https://learn.microsoft.com/zh-cn/aspnet/core/fundamentals/middleware)、[ASP.NET Core 中的筛选器](https://learn.microsoft.com/zh-cn/aspnet/core/mvc/controllers/filters)

它们默认支持i18n, 当服务使用i18n后, 异常信息会根据请求文化 ( Culture) 信息转换为对应的语言

安装`Masa.Contrib.Exceptions`

``` powershell
dotnet add package Masa.Contrib.Exceptions
```

### 全局异常中间件

1. 修改`Program`, 使用全局异常中间件

```csharp
app.UseMasaExceptionHandler();
```

### 全局异常过滤器

1. 修改`Program`, 使用全局异常过滤器

```csharp
builder.Services
    .AddMvc()
    .AddMasaExceptionHandler();
```

## 高阶用法

### 自定义异常处理

#### 中间件

:::: code-group
::: code-group-item 方案1
```csharp
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
:::
::: code-group-item 方案2
```csharp
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
:::
::: code-group-item 方案3
```csharp
app.UseMasaExceptionHandler(option =>
{
    option.UseExceptionHanlder<ExceptionHandler>();
});
```
:::
::::

#### 异常过滤器

:::: code-group
::: code-group-item 方案1
```csharp
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
:::
::: code-group-item 方案2
```csharp
builder.Services.AddSingleton<ExceptionHandler>();

builder.Services
  .AddMvc()
  .AddMasaExceptionHandler();
```
:::
::: code-group-item 方案3
```csharp
builder.Services
  .AddMvc()
  .AddMasaExceptionHandler(options =>
  {
      options.UseExceptionHanlder<ExceptionHandler>();
  });
```
:::
::::

### 异常与Http状态码

MasaFramework提供的了几种常用的异常类型, 当API服务对外抛出以下异常类型时, 服务端将响应与之对应的Http状态码:  

|  异常类型   | 描述  |  HttpStatusCode  |
|  ----  | ----  | ----  |
| UserFriendlyException  | 用户友好异常 | 299 |
| MasaValidatorException  | 验证异常 | 298 |
| MasaArgumentException  | 参数异常 | 500 |
| MasaException  | 内部服务错误 | 500 |

其中HttpStatusCode为298是验证异常，存在固定格式的响应信息

``` http
Validation failed: 
-- {Name}: {Message} Severity: {ValidationLevel}
-- {Name2}: {Message2} Severity: {ValidationLevel}
```

> 配合[`Masa Blazor`](https://docs.masastack.com/blazor/introduction/why-masa-blazor)使用, 可以提供更友好的表单验证

### 多语言

当异常类型是`MasaException`时, 如果`ErrorCode`不等于`null`或空字符且使用了[I18n](/framework/building-blocks/globalization/overview)，则会根据当前请求的Culture返回对应语言下的Message, 否则返回其Message, 例如:

:::: code-group
::: code-group-item 注册全局异常使用多语言
```csharp
builder.Services.AddI18n();

------省略------

app.UseI18n();//使用i18n

app.UseMasaExceptionHandler();
```
:::
::: code-group-item 多语言资源文件
```csharp

文件夹结构如下:

- Resources
  - I18n
    - en-US.json
    - zh-CN.json
    - supportedCultures.json

* supportedCultures.json (支持语言配置)
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

* en-US.json
{
  "Home":"Home",
  "CustomFailed": "自定义错误"
}

* zh-CN.json
{
  "Home":"首页",
  "CustomFailed": "custom error"
}
```
:::
::: code-group-item 抛出支持多语言的异常
```csharp
public class HealthService : ServiceBase
{
    public IResult GetFailed() => throw new UserFriendlyException(errorCode: "CustomFailed");
}
```
:::
::::

## 源码解读

### MasaException

基于Exception的扩展类, 是Masa提供的异常基类, 对外抛出`HttpStatusCode`为`500`的错误码, 并将其Message作为响应内容输出

* ErrorCode: 错误码, 针对ErrorCode不为null且不等于空字符, 且开启了[多语言](/framework/building-blocks/globalization/overview)后, 可以通过`GetLocalizedMessage`方法获取当前语言的错误信息

### UserFriendlyException

基于MasaException的扩展类, 是Masa提供的用户友好异常类, 对外抛出`HttpStatusCode`为`299`的错误码, 并将其Message作为响应内容输出

### MasaArgumentException

基于MasaException的扩展类, 是Masa提供的参数异常类, 默认对外抛出`HttpStatusCode`为`500`的错误码, 并将其Message作为响应内容输出, 提供了以下方法

* ThrowIfNullOrEmptyCollection: 若参数为Null或者空集合时抛出异常
* ThrowIfNull: 若参数为Null时抛出异常
* ThrowIfNullOrEmpty: 若参数为Null或空字符串时抛出异常
* ThrowIfNullOrWhiteSpace: 若参数为Null或空白字符时抛出异常
* ThrowIfGreaterThan: 若参数大于{value}时抛出异常
* ThrowIfGreaterThanOrEqual: 若参数大于等于{value}时抛出异常
* ThrowIfLessThan: 若参数小于{value}时抛出异常
* ThrowIfLessThanOrEqual: 若参数小于等于{value}时抛出异常
* ThrowIfOutOfRange: 若参数不在指定范围之间时抛出异常 (\< minValue & \> maxValue)
* ThrowIfContain: 若参数包含指定字符串时抛出异常
* ThrowIf: 若条件满足时抛出异常

### MasaValidatorException

基于MasaArgumentException的扩展类, 是Masa提供的验证异常类, 默认对外抛出`HttpStatusCode`为`298`的错误码, 对外输出内容为固定格式:

``` http
"Validation failed: 
-- {Name}: {Message1} Severity: {ValidationLevel}
-- {Name2}: {Message2} Severity: {ValidationLevel}"
```

> 与[MasaBlazor](/blazor/introduction/why-masa-blazor)结合使用可以提供更好的表单验证效果