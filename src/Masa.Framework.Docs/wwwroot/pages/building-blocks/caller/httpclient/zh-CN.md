## 概念

基于HttpClient实现的Caller

## 使用

安装`Masa.Contrib.Service.Caller.HttpClient`

``` powershell
dotnet add package Masa.Contrib.Service.Caller.HttpClient
```

### 手动注册

使用`Caller`并使用指定实现的`Caller`

1. 注册`Caller`并使用基于`HttpClient`的Caller实现, 修改`Program`

```csharp
builder.Services.AddCaller("{Replace-With-Your-Name}", options =>
{
    //name可以是任意字符串, 但不可重复添加两个相同 name 的Caller实现
    options.UseHttpClient(clientBuilder =>
    {
        clientBuilder.BaseAddress = "https://api.github.com" ;
        clientBuilder.Prefix = "repos/masastack/MASA.Framework"; //服务前缀
    });
});
```

2. 获取指定 name 的Caller, 并发送`Get`请求, 修改`Program`

例如: 服务端的接口请求地址为: $"https://api.github.com/repos/masastack/MASA.Framework/issues?state=open", 则

```csharp
app.MapGet("/Test/User/Hello", ([FromServices] ICallerFactory callerFactory, string state)
{
    var caller = callerFactory.Create($"{Replace-With-Your-Name}");
    return caller.GetAsync<string>("issues", new { state = state }));
}
```

> 若当前项目添加的name为空字符串, 或者仅存在一个`name`的Caller实现时, 可直接使用ICaller, 而不必要通过`ICallerFactory`提供的`Create`方法获得

### 自动注册

使用`Caller`并根据约定自动注册其实现

1. 注册`Caller`, 并自动注册`Caller`的实现, 修改`Program`

```csharp
builder.Services.AddAutoRegistrationCaller();
```

2. 新建类`GithubCaller`，并继承**HttpClientCallerBase**

```csharp
public class GithubCaller : HttpClientCallerBase
{
    protected override string Prefix { get; set; } = "repos/masastack/MASA.Framework";

    protected override string BaseAddress { get; set; } = "https://api.github.com";

    public Task<string> GetIssuesByOpenAsync(string state)
    {
        return Caller.GetStringAsync("issues", new
        {
            state = state
        });
    }
}
```

3. 使用自定义`Caller`, 并调用`HelloAsync`方法, 修改`Program`

```csharp
app.MapGet("issues", ([FromServices] GithubCaller caller, string state)
    => caller.GetIssuesByOpenAsync(state);
```

## 高阶用法

基于HttpClient的Caller实现不仅仅支持了[中间件](/framework/building-blocks/caller/overview#section-4e2d95f44ef6)、[Xml请求](/framework/building-blocks/caller/overview#xml683c5f0f)、[认证](/framework/building-blocks/caller/overview#section-8ba48bc1), 还支持[自定义HttpClient](#自定义HttpClient) 

### 自定义HttpClient

如果你希望设置超时时间, 默认请求头等信息, 则可通过重写`HttpClientCallerBase`提供的`ConfigureHttpClient`方法, 例如:

:::: code-group
::: code-group-item 手动指定Caller
```csharp
builder.Services.AddCaller(clientBuilder =>
{
    clientBuilder.UseHttpClient(httpClient =>
    {
        httpClient.BaseAddress = "https://api.github.com"; //指定API服务域名地址
        httpClient.Prefix = "repos/masastack/MASA.Framework"; //指定API服务前缀

        //自定义HttpClient
        httpClient.Configure = httpClient =>
        {
            httpClient.Timeout = TimeSpan.FromSeconds(30);//30s超时
        };
    });
});
```
:::
::: code-group-item 自动注册Caller
```csharp
public class GithubCaller : HttpClientCallerBase
{
    protected override string Prefix { get; set; } = "repos/masastack/MASA.Framework";

    protected override string BaseAddress { get; set; } = "https://api.github.com";
    
    /// <summary>
    /// 自定义HttpClient
    /// </summary>
    /// <param name="httpClient"></param>
    protected override void ConfigureHttpClient(System.Net.Http.HttpClient httpClient)
    {
        httpClient.Timeout = TimeSpan.FromSeconds(30);//30s超时
    }
}
```
:::
::::

## 常见问题

* 继承`HttpClientCallerBase`的实现类支持从DI获取, 如果你需要获取来自DI的服务，可通过构造函数注入所需服务
* 继承`HttpClientCallerBase`的实现类的生命周期为: `Scoped`
* 如果`自定义Caller` (继承HttpClientCallerBase的类)与`AddAutoRegistrationCaller`方法不在一个程序集, 可能会出现自动注册自定义Caller失败的情况, 可通过下面提供的任一方案解决:

① 指定Assembly集合 (仅对当前Caller有效)
```csharp
var assemblies = typeof({Replace-With-Your-CustomCaller}).Assembly;
builder.Services.AddAutoRegistrationCaller(assemblies);
```

② 设置全局Assembly集合 (影响全局Assembly默认配置, 设置错误的Assembly集合会导致其它使用全局Assembly的服务出现错误)

```csharp
var assemblies = typeof({Replace-With-Your-CustomCaller}).Assembly;
MasaApp.SetAssemblies(assemblies);
builder.Services.AddAutoRegistrationCaller();
```