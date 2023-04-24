## 概念

基于`DaprClient`实现的Caller

## 使用

安装`Masa.Contrib.Service.Caller.DaprClient`

``` powershell
dotnet add package Masa.Contrib.Service.Caller.DaprClient
```

### 手动注册

使用`Caller`并使用指定实现的`Caller`

1. 注册`Caller`并使用基于`DaprClient`的Caller实现, 修改`Program`

```csharp
builder.Services.AddCaller("{Replace-With-Your-Name}", options =>
{
    //name可以是任意字符串, 但不可重复添加两个相同 name 的Caller实现
    options.UseDaprClient(clientBuilder =>
    {
        clientBuilder.AppId = "{Replace-With-Your-Dapr-AppID}"; //指定服务对应Sidecar的AppId
    });
});
```

2. 获取指定 name 的Caller, 并发送`Get`请求, 修改`Program`

例如: 服务端的接口请求地址为: $"http://localhost:3500/v1.0/invoke/{Replace-Your-Dapr-AppID}/method/Hello?Name={name}", 则

```csharp
app.MapGet("/Test/User/Hello", ([FromServices] ICallerFactory callerFactory, string name)
{
    var caller = callerFactory.Create($"{Replace-With-Your-Name}");
    return caller.GetAsync<string>($"/Hello", new { Name = name }));
}
```

> 若当前项目添加的name为空字符串, 或者仅存在一个`name`的Caller实现时, 可直接使用ICaller, 而不必要通过`ICallerFactory`提供的`Create`方法获得

### 自动注册

使用`Caller`并根据约定自动注册其实现

1. 注册`Caller`, 并自动注册`Caller`的实现, 修改`Program`

```csharp
builder.Services.AddAutoRegistrationCaller();
```

2. 新建类`CustomCaller`，并继承**DaprCallerBase**

```csharp
public class CustomCaller : DaprCallerBase
{
    protected override string AppId { get; set; } = "{Replace-With-Your-Dapr-AppID}";

    public Task<string?> HelloAsync(string name)
        => Caller.GetAsync<string>($"/Hello", new { Name = name }));
}
```

3. 使用自定义`Caller`, 并调用`HelloAsync`方法, 修改`Program`

```csharp
app.MapGet("/Test/User/Hello", ([FromServices] CustomCaller caller, string name)
    => caller.HelloAsync(name);
```

## 高阶用法

基于DaprClient的Caller实现不仅仅支持了[中间件](/framework/building-blocks/caller/overview#section-4e2d95f44ef6)、[Xml请求](/framework/building-blocks/caller/overview#xml683c5f0f)、[认证](/framework/building-blocks/caller/overview#section-8ba48bc1), 还支持自定义`DaprClient`的`HttpEndpoint`、`GrpcEndpoint`

### 自定义DaprClient

:::: code-group
::: code-group-item 手动指定Caller
```csharp
builder.Services.AddCaller(callerBuilder =>
{
    callerBuilder.UseDapr(client => client.AppId = "{Replace-With-Your-Dapr-AppID}", daprClientBuilder =>
    {
        daprClientBuilder.UseHttpEndpoint("http://localhost:3500");
        daprClientBuilder.UseGrpcEndpoint("http://localhost:50001");
    });
});
```
:::
::: code-group-item 自动注册Caller
```csharp
public class CustomCaller : DaprCallerBase
{

    protected override string AppId { get; set; } = "{Replace-With-Your-Dapr-AppID}";

    protected override Action<DaprClientBuilder>? Configure { get; set; } = daprClientBuilder =>
    {
        daprClientBuilder.UseHttpEndpoint("http://localhost:3500");
        daprClientBuilder.UseGrpcEndpoint("http://localhost:50001");
    };
}
```
:::
::::

## 常见问题

* 继承`DaprCallerBase`的实现类支持从DI获取, 如果你需要获取来自DI的服务，可通过构造函数注入所需服务
* 继承`HttpClientCallerBase`的实现类的生命周期为: `Scoped`
* 如果`自定义Caller` (继承DaprCallerBase的类)与`AddAutoRegistrationCaller`方法不在一个程序集, 可能会出现自动注册自定义Caller失败的情况, 可通过下面提供的任一方案解决:

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