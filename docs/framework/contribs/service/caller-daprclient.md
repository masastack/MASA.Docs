---
title: 服务 - 服务调用 - DaprClient
date: 2022/11/15
---

## 概念

基于`DaprClient`实现的Caller

## 使用

* 必要条件: 安装`Masa.Contrib.Service.Caller.DaprClient`

``` powershell
dotnet add package Masa.Contrib.Service.Caller.DaprClient
```

### 基础用法

使用`Caller`并使用指定实现的`Caller`

1. 注册`Caller`并使用基于`DaprClient`的Caller实现, 修改`Program.cs`

``` C#
builder.Services.AddCaller(options =>
{
    //name可以是任意字符串, 但不可重复添加两个相同 name 的Caller实现
    options.UseDaprClient("{Replace-With-Your-Name}", clientBuilder =>
    {
        clientBuilder.AppId = "{Replace-With-Your-Dapr-AppID}"; //指定服务对应Sidecar的AppId
    });
});
```

2. 获取指定 name 的Caller, 并发送`Get`请求, 修改`Program.cs`

例如: 服务端的接口请求地址为: $"http://localhost:3500/v1.0/invoke/{Replace-Your-Dapr-AppID}/method/Hello?Name={name}", 则

``` C#
app.MapGet("/Test/User/Hello", ([FromServices] ICallerFactory callerFactory, string name)
{
    var caller = callerFactory.Create($"{Replace-With-Your-Name}");
    return caller.GetAsync<string>($"/Hello", new { Name = name }));
}
```

> 若当前项目添加的name为空字符串, 或者仅存在一个`name`的Caller实现时, 可直接使用ICaller, 而不必要通过`ICallerFactory`提供的`Create`方法获得

### 推荐用法

使用`Caller`并根据约定自动注册其实现

1. 注册`Caller`, 并自动注册`Caller`的实现, 修改`Program.cs`

``` C#
builder.Services.AddCaller();
```

2. 新建类`CustomerCaller.cs`，并继承**DaprCallerBase**

``` C#
public class CustomerCaller : DaprCallerBase
{
    protected override string AppId { get; set; } = "{Replace-With-Your-Dapr-AppID}";

    public Task<string?> HelloAsync(string name)
        => Caller.GetAsync<string>($"/Hello", new { Name = name }));
}
```

3. 使用自定义`Caller`, 并调用`HelloAsync`方法, 修改`Program.cs`

``` C#
app.MapGet("/Test/User/Hello", ([FromServices] CustomerCaller caller, string name)
    => caller.HelloAsync(name);
```

::: tip DaprCallerBase
1. 继承`DaprCallerBase`的实现类支持从DI获取, 如果你需要获取来自DI的服务，可通过构造函数注入所需服务
2. 继承`DaprCallerBase`的自定义Caller默认支持身份认证, 它需要借助`Masa.Contrib.Service.Caller.Authentication.OpenIdConnect`来实现, 如果你需要重写Caller默认的`HttpRequestMessage`信息, 也可重写`DaprCallerBase`父类提供的`ConfigHttpRequestMessage`方法来实现
3. 继承`HttpClientCallerBase`的实现类的生命周期为: `Scoped`
4. 如果`自定义Caller` (继承DaprCallerBase的类)与`AddCaller`方法不在一个程序集, 可能会出现自动注册自定义Caller失败的情况, 可通过下面提供的任一方案解决:

① 指定Assembly集合 (仅对当前Caller有效)
``` C#
var assemblies = typeof({Replace-With-Your-CustomerCaller}).Assembly;
builder.Services.AddCaller(assemblies);
```

② 设置全局Assembly集合 (影响全局Assembly默认配置, 设置错误的Assembly集合会导致其它使用全局Assembly的服务出现错误)

``` C#
var assemblies = typeof({Replace-With-Your-CustomerCaller}).Assembly;
MasaApp.SetAssemblies(assemblies);
builder.Services.AddCaller();
```
:::