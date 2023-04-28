## 概述

提供服务调用的能力，通过它可以调用其它服务，Caller被设计为与提供者无关

目前的提供者有:

* [Masa.Contrib.Service.Caller.HttpClient](https://www.nuget.org/packages/Masa.Contrib.Service.Caller.HttpClient): 基于HttpClient实现 [查看详细](/framework/building-blocks/caller/httpclient)
* [Masa.Contrib.Service.Caller.DaprClient](https://www.nuget.org/packages/Masa.Contrib.Service.Caller.DaprClient): 基于DaprClient实现 [查看详细](/framework/building-blocks/caller/daprclient)

## 功能列表

* [常用请求](#ICaller)
* [中间件](#中间件)
* [Xml格式](#Xml格式)
* [认证](#认证)

## 使用

Caller提供了两种方式的注册:

* [手动注册](手动注册)
* [自动注册](自动注册)

### 必要条件

场景: 以HttpClient实现为例, 向 https://api.github.com/repos/masastack/MASA.Framework/issues 发送Get请求, 参数信息: state=open

安装`Masa.Contrib.Service.Caller.HttpClient`

``` powershell
dotnet add package Masa.Contrib.Service.Caller.HttpClient
```

#### 手动注册

1. 修改`Program.cs`, 注册Caller

```csharp
builder.Services.AddCaller(callerBuilder =>
{
    callerBuilder.UseHttpClient(httpClient =>
    {
        httpClient.BaseAddress = "https://api.github.com"; //指定API服务域名地址
        httpClient.Prefix = "repos/masastack/MASA.Framework";//指定API服务前缀
    });
});
```

2. 通过IOC获取到`ICaller`

```csharp
ICaller caller;//通过DI获取
var response = await caller.GetStringAsync("issues", new
{
    state = "open"
});
```

#### 自动注册

1. 修改`Program.cs`, 按约定注册Caller

```csharp
builder.Services.AddAutoRegistrationCaller();
```

2. 新增`GithubCaller`, 并继承`HttpClientCallerBase`

```csharp
public class GithubCaller : HttpClientCallerBase
{
    protected override string BaseAddress { get; set; } = "https://api.github.com";
    
    protected override string Prefix { get; set; } = "repos/masastack/MASA.Framework";

    public Task<string> GetIssuesByOpenAsync()
    {
        return Caller.GetStringAsync("issues", new
        {
            state = "open"
        });
    }
}
```

3. 通过IOC获取到`GithubCaller`

```csharp
GithubCaller caller;//通过DI获取
var response = await caller.GetIssuesByOpenAsync();
```

## 高阶用法

### 中间件

Caller提供了中间件，我们可以通过中间件技术为不同的Caller定制请求

![CallerMiddleware.png](https://s2.loli.net/2023/03/13/C9utKhBEOloIePr.png)

> RequestMessage、ResponseMessage分别为当前请求提供处理请求数据以及处理响应数据的能力, Caller默认支持Json格式

每个Caller对应一个API服务, 我们可以为每个Caller定制中间件, 比如: 新增加一个TraceMiddleware, 用户将当前的TraceId传递到目标API服务器

1. 新增`TraceMiddleware`并实现`ICallerMiddleware`

```csharp
public class TraceMiddleware : ICallerMiddleware
{
    private readonly string _traceId;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public TraceMiddleware(IHttpContextAccessor httpContextAccessor)
    {
        _traceId = "trace-id";
        _httpContextAccessor = httpContextAccessor;
    }

    public Task HandleAsync(MasaHttpContext masaHttpContext, CallerHandlerDelegate next, CancellationToken cancellationToken = default)
    {
        if (!masaHttpContext.RequestMessage.Headers.Contains(_traceId) && _httpContextAccessor.HttpContext != null)
        {
            masaHttpContext.RequestMessage.Headers.Add(_traceId, _httpContextAccessor.HttpContext.Request.Headers[_traceId].ToString());
        }
        return next();
    }
}
```

2. 使用中间件, 以HttpClient实现为例:

:::: code-group
::: code-group-item 手动指定Caller
```csharp
builder.Services.AddCaller(clientBuilder =>
{
    clientBuilder.UseHttpClient(httpClient =>
    {
        httpClient.BaseAddress = "https://api.github.com"; //指定API服务域名地址
        httpClient.Prefix = "repos/masastack/MASA.Framework";//指定API服务前缀
    }).AddMiddleware<TraceMiddleware>();
});
```
:::
::: code-group-item 自动注册Caller
```csharp
public class GithubHttpCaller : HttpClientCallerBase
{
    protected override string BaseAddress { get; set; } = "https://api.github.com";
    
    protected override string Prefix { get; set; } = "repos/masastack/MASA.Framework";

    /// <summary>
    /// 重写UseHttpClientPost方法, 使用自定义链路中间件
    /// </summary>
    /// <param name="masaHttpClientBuilder"></param>
    protected override void UseHttpClientPost(MasaHttpClientBuilder masaHttpClientBuilder)
    {
        masaHttpClientBuilder.AddMiddleware<TraceMiddleware>();
    }
}
```
:::
::::

### Xml格式

针对支持`Xml`格式的API, 我们可以这样做:

1. 安装`Masa.Contrib.Service.Caller.Serialization.Xml`

``` powershell
dotnet add package Masa.Contrib.Service.Caller.Serialization.Xml
```

2. 使用`Xml`请求, 以HttpClient实现为例:

:::: code-group
::: code-group-item 手动指定Caller
```csharp
builder.Services.AddCaller(clientBuilder =>
{
    clientBuilder.UseHttpClient(httpClient =>
    {
        httpClient.BaseAddress = "https://api.github.com";//指定API服务域名地址
        httpClient.Prefix = "repos/masastack/MASA.Framework";//指定API服务前缀
        
        httpClient.UseXml();//使用Xml请求
    });
});
```
:::
::: code-group-item 自动注册Caller
```csharp
public class GithubHttpCaller : HttpClientCallerBase
{
    protected override string BaseAddress { get; set; } = "https://api.github.com";
    
    protected override string Prefix { get; set; } = "repos/masastack/MASA.Framework";

    /// <summary>
    /// 重写ConfigMasaCallerClient方法, 并指定当前Caller使用Xml格式
    /// </summary>
    /// <param name="callerClient"></param>
    protected override void ConfigMasaCallerClient(MasaCallerClient callerClient)
    {
        callerClient.UseXml();
    }
}
```
:::
::::

### 认证

Caller默认增加了认证的支持, 并提供了针对BlazorServer项目、AspNetCore项目使用Caller的两种实现:

* Masa.Contrib.Service.Caller.Authentication.AspNetCore: 提供用于传递当前请求的认证信息到目标服务的功能 (如果目标服务的认证信息与当前请求的认证不一致, 则需要自行实现`IAuthenticationService`)
* Masa.Contrib.Service.Caller.Authentication.BlazorServer: 提供`TokenProvider`, `BlazorServer`项目需要为其赋值, 确保使用Caller时将其传递到目标API服务 

![CallerAuthenticationMiddleware.png](https://s2.loli.net/2023/03/13/GyslLfw5O38dpKB.png)

#### 默认认证提供服务

以AspNetCore项目的HttpClient实现为例:

1. 安装`Masa.Contrib.Service.Caller.Authentication.AspNetCore`

``` powershell
dotnet add package Masa.Contrib.Service.Caller.Authentication.AspNetCore
```

2. 使用认证

:::: code-group
::: code-group-item 手动指定Caller
```csharp
builder.Services.AddCaller(clientBuilder =>
{
    clientBuilder.UseHttpClient(httpClient =>
    {
        httpClient.BaseAddress = "https://api.github.com";//指定API服务域名地址
        httpClient.Prefix = "repos/masastack/MASA.Framework";//指定API服务前缀
    }).UseAuthentication();
});
```
:::
::: code-group-item 自动注册Caller
```csharp
public class GithubHttpCaller : HttpClientCallerBase
{
    protected override string BaseAddress { get; set; } = "https://api.github.com";
    
    protected override string Prefix { get; set; } = "repos/masastack/MASA.Framework";

    /// <summary>
    /// 重写UseHttpClientPost方法, 使用认证
    /// </summary>
    /// <param name="masaHttpClientBuilder"></param>
    protected override void UseHttpClientPost(MasaHttpClientBuilder masaHttpClientBuilder)
    {
        masaHttpClientBuilder.UseAuthentication();
    }
}
```
:::
::::

#### 自定义认证提供服务

默认提供的认证功能并不能支持所有的调用场景, 针对默认提供的认证服务不能满足要求时, 可以通过自定义认证信息的方式得到支持, 我们需要实现`IAuthenticationService`, 并指定认证服务处理即可

1. 新增认证服务, 并实现`IAuthenticationService`

```csharp
public class XXXAuthenticationService: IAuthenticationService
{
    public Task ExecuteAsync(HttpRequestMessage requestMessage)
    {
        //custom Authentication logic

        return Task.CompletedTask;
    }
} 
```

2. 使用自定义认证服务

:::: code-group
::: code-group-item 手动指定Caller
```csharp
builder.Services.AddCaller(clientBuilder =>
{
    clientBuilder.UseHttpClient(httpClient =>
    {
        httpClient.BaseAddress = "https://api.github.com";//指定API服务域名地址
    }).UseAuthentication(serviceProvider => new XXXAuthenticationService());
});
```
:::
::: code-group-item 自动注册Caller
```csharp
public class GithubHttpCaller : HttpClientCallerBase
{
    protected override string BaseAddress { get; set; } = "https://api.github.com";
    
    protected override string Prefix { get; set; } = "repos/masastack/MASA.Framework";

    /// <summary>
    /// 重写UseHttpClientPost方法, 使用认证
    /// </summary>
    /// <param name="masaHttpClientBuilder"></param>
    protected override void UseHttpClientPost(MasaHttpClientBuilder masaHttpClientBuilder)
    {
        masaHttpClientBuilder.UseAuthentication(serviceProvider => new XXXAuthenticationService());
    }
}
```
:::
::::

## 扩展

### 全局处理程序

如何更改全局请求处理程序、响应处理程序为xml，使得当Caller未指定处理程序时使用的是xml格式而并非json格式

1. 安装`Masa.Contrib.Service.Caller.Serialization.Xml`

``` powershell
dotnet add package Masa.Contrib.Service.Caller.Serialization.Xml
```

2. 在使用Caller之前注入XmlRequestMessage、XmlResponseMessage代替默认的Json处理程序

```csharp
builder.Services.AddSingleton<IRequestMessage, XmlRequestMessage>();
builder.Services.AddSingleton<IResponseMessage, XmlResponseMessage>();
builder.Services.AddAutoRegistrationCaller();//无论是手动注册、还是自动注册Caller, 更改全局处理程序应该在它们之前被添加
```

### 扩展其它自定义处理程序

以Yaml为例:

1. 新建支持Yaml的RequestMessage、ResponseMessage, 并分别实现IRequestMessage、IResponseMessage

```csharp
public class YmlRequestMessage : IRequestMessage
{
    public void ProcessHttpRequestMessage(HttpRequestMessage requestMessage)
    {
        //custom logic
    }

    public void ProcessHttpRequestMessage<TRequest>(HttpRequestMessage requestMessage, TRequest data)
    {
        //custom logic
    }
}

public class YmlResponseMessage : DefaultResponseMessage
{
    protected override Task<TResponse?> FormatResponseAsync<TResponse>(
        HttpContent httpContent,
        CancellationToken cancellationToken = default) where TResponse : default
    {
        TResponse? response = default;
        //custom logic

        return Task.FromResult(response);
    }
}
```

> DefaultResponseMessage 继承`IResponseMessage`, 通过继承`DefaultResponseMessage`, 我们仅需要实现将流通过yaml解析为对象即可

2. 新增`MasaCallerClientExtensions`

```csharp
public static class MasaCallerClientExtensions
{
    /// <summary>
    /// Set the request handler and response handler for the specified Caller
    /// </summary>
    /// <param name="masaCallerOptions"></param>
    /// <returns></returns>
    public static MasaCallerClient UseYaml(this MasaCallerClient masaCallerClient)
    {
        masaCallerClient.RequestMessageFactory = _ => new YmlRequestMessage();
        masaCallerClient.ResponseMessageFactory = serviceProvider =>
        {
            return new YmlResponseMessage(loggerFactory);
        };
        return masaCallerClient;
    }
}
```

## 源码解读

当返回类型为
* `TResponse`: `自定义返回类型`, 框架自行处理异常请求
* `其它类型 (非自定义返回类型)`: 根据传入参数`autoThrowException`的值决定是否默认处理框架异常, 默认: true

框架处理异常请求机制, 当请求响应的 `HttpStatusCode`为
* `299`: 上抛`UserFriendlyException`异常
* `298`: 上抛`ValidatorException`异常

### ICaller

服务调用抽象, 它提供了以下能力

> `autoThrowException`为`true`会检查`HttpStatus`状态码并抛出对应的`Exception`, 部分方法的返回类型是指定类型, 且没有`autoThrowException`参数, 那么它们会自动检查HttpStatus状态码并抛出对应的`Exception` (gRPC请求除外)

* SendAsync: 提供原始的Send方法, 需要自行提供`HttpRequestMessage`类型的请求信息
* SendGrpcAsync: 提供基于gRPC的请求
* GetStringAsync: 提供`Get`请求并获取返回类型为`string`的结果
* GetByteArrayAsync: 提供`Get`请求并获取返回类型为`byte[]`的结果
* GetStreamAsync: 提供`Get`请求并获取返回类型为`Stream`的结果
* GetAsync: 提供`Get`请求并获取返回类型为`指定类型`的结果
* PostAsync: 提供`Post`请求并获取返回类型为`指定类型`的结果
* PatchAsync: 提供`Patch`请求并获取返回类型为`指定类型`的结果
* PutAsync: 提供`Put`请求并获取返回类型为`指定类型`的结果
* DeleteAsync: 提供`Delete`请求并获取返回类型为`指定类型`的结果

### ICallerFactory

服务调用抽象工厂, 它提供了以下能力

* Create (): 创建name值为`string.Empty`的Caller提供者, 当不存在name为`string.Empty`的提供者时, 从Caller提供者列表中取第一个
* Create (string name): 创建指定`name`的Caller提供者

### IRequestMessage

请求消息抽象, 提供了处理`HttpRequestMessage`的请求消息抽象, 默认实现: [`JsonRequestMessage`](https://github.com/masastack/MASA.Framework/blob/main/src/BuildingBlocks/Service/Masa.BuildingBlocks.Service.Caller/Infrastructure/Json/JsonRequestMessage.cs)

* ProcessHttpRequestMessageAsync(HttpRequestMessage requestMessage): 处理请求消息默认程序 (不支持自定义请求参数)
* ProcessHttpRequestMessageAsync\<TRequest\>(HttpRequestMessage requestMessage, TRequest data): 支持自定义请求参数的处理请求消息默认程序

### IResponseMessage

响应消息抽象, 提供了处理`HttpResponseMessage`的响应消息抽象, 默认实现: [`JsonResponseMessage`](https://github.com/masastack/MASA.Framework/blob/main/src/BuildingBlocks/Service/Masa.BuildingBlocks.Service.Caller/Infrastructure/Json/JsonResponseMessage.cs)

* ProcessResponseAsync\<TResponse\>(HttpResponseMessage response, CancellationToken cancellationToken = default): 针对指定响应类型的处理程序
* ProcessResponseAsync(HttpResponseMessage response, CancellationToken cancellationToken = default): 针对未指定响应自定义类型的处理程序