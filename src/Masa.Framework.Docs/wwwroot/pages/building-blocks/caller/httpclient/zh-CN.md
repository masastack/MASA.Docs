## 概念

基于HttpClient实现的Caller

## 使用

安装`Masa.Contrib.Service.Caller.HttpClient`

``` powershell
dotnet add package Masa.Contrib.Service.Caller.HttpClient
```

### 基础用法

使用`Caller`并使用指定实现的`Caller`

1. 注册`Caller`并使用基于`HttpClient`的Caller实现, 修改`Program`

```csharp
builder.Services.AddCaller(options =>
{
    //name可以是任意字符串, 但不可重复添加两个相同 name 的Caller实现
    options.UseHttpClient("{Replace-With-Your-Name}", clientBuilder =>
    {
        clientBuilder.BaseAddress = "http://localhost:5000" ;
        clientBuilder.Prefix = "{Replace-With-Your-Prefix}"; //服务前缀
    });
});
```

2. 获取指定 name 的Caller, 并发送`Get`请求, 修改`Program`

例如: 服务端的接口请求地址为: $"http://localhost:5000/{Replace-With-Your-Prefix}/Hello?Name={name}", 则

```csharp
app.MapGet("/Test/User/Hello", ([FromServices] ICallerFactory callerFactory, string name)
{
    var caller = callerFactory.Create($"{Replace-With-Your-Name}");
    return caller.GetAsync<string>($"/Hello", new { Name = name }));
}
```

> 若当前项目添加的name为空字符串, 或者仅存在一个`name`的Caller实现时, 可直接使用ICaller, 而不必要通过`ICallerFactory`提供的`Create`方法获得

### 推荐用法

使用`Caller`并根据约定自动注册其实现

1. 注册`Caller`, 并自动注册`Caller`的实现, 修改`Program`

```csharp
builder.Services.AddCaller();
```

2. 新建类`CustomCaller`，并继承**HttpClientCallerBase**

```csharp
public class CustomCaller : HttpClientCallerBase
{
    protected override string BaseAddress { get; set; } = "http://localhost:5000";

    protected virtual string Prefix { get; set; } = $"{Replace-With-Your-Name}";

    public Task<string?> HelloAsync(string name)
        => Caller.GetAsync<string>($"/Hello", new { Name = name }));
}
```

3. 使用自定义`Caller`, 并调用`HelloAsync`方法, 修改`Program`

```csharp
app.MapGet("/Test/User/Hello", ([FromServices] CustomCaller caller, string name)
    => caller.HelloAsync(name);
```

## 高级

如果你希望设置超时时间, 默认请求头等信息, 则可通过重写`HttpClientCallerBase`提供的`ConfigureHttpClient`方法, 例如:

```csharp
public class CustomHttpClientCaller : HttpClientCallerBase
{
    protected override string BaseAddress { get; set; } = "{Replace-Your-BaseAddress}";
    
    protected override void ConfigureHttpClient(System.Net.Http.HttpClient httpClient)
    {
        httpClient.Timeout = TimeSpan.FromSeconds(30);//30s超时
    }
}
```

如果你希望在发送请求之前可以增加一个发送请求日志的功能, 则可以通过重写`HttpClientCallerBase`提供的`UseHttpClient`方法, 例如:

```csharp
public class CustomHttpClientCaller : HttpClientCallerBase
{
    protected override string BaseAddress { get; set; } = "{Replace-Your-BaseAddress}";
    
    protected override IHttpClientBuilder UseHttpClient()
    {
        return base
            .UseHttpClient()
            .AddHttpMessageHandler<LogDelegatingHandler>();
    }
}

public class LogDelegatingHandler : DelegatingHandler
{
    protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
    {
        //记录请求日志
        return base.SendAsync(request, cancellationToken);
    }
}
```

## 常见问题

* 继承`HttpClientCallerBase`的实现类支持从DI获取, 如果你需要获取来自DI的服务，可通过构造函数注入所需服务
* 继承`HttpClientCallerBase`的自定义Caller默认支持身份认证, 它需要借助`Masa.Contrib.Service.Caller.Authentication.OpenIdConnect`来实现, 如果你需要重写Caller默认的`HttpRequestMessage`信息, 也可重写`HttpClientCallerBase`父类提供的`ConfigHttpRequestMessage`方法来实现
* 继承`HttpClientCallerBase`的实现类的生命周期为: `Scoped`
* 如果`自定义Caller` (继承HttpClientCallerBase的类)与`AddCaller`方法不在一个程序集, 可能会出现自动注册自定义Caller失败的情况, 可通过下面提供的任一方案解决:

① 指定Assembly集合 (仅对当前Caller有效)
```csharp
var assemblies = typeof({Replace-With-Your-CustomCaller}).Assembly;
builder.Services.AddCaller(assemblies);
```

② 设置全局Assembly集合 (影响全局Assembly默认配置, 设置错误的Assembly集合会导致其它使用全局Assembly的服务出现错误)

```csharp
var assemblies = typeof({Replace-With-Your-CustomCaller}).Assembly;
MasaApp.SetAssemblies(assemblies);
builder.Services.AddCaller();
```