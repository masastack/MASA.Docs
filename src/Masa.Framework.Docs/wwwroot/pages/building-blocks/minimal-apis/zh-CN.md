## 概念

什么是[Minimal APIs](https://learn.microsoft.com/zh-cn/aspnet/core/fundamentals/minimal-apis?view=aspnetcore-6.0)

## 功能列表

* [服务分组](#服务分组): 将API服务分别写到不同的`Service`中
* [自动映射路由](#自动映射规则): 支持[`RESTful`](https://docs.microsoft.com/zh-cn/azure/architecture/best-practices/api-design)标准

## 使用

`Minimal APIs`十分轻量，写法十分简单，可正因为如此，也给我们带来一些编码上的问题，下面我们来看一下原生`Minimal APIs`的写法与`Masa`提供的`Minimal APIs`的写法的区别

### 原生写法

``` C#
var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.MapGet("/api/v1/users/{id}", (Guid id)=>
{
    // todo: 查询用户信息
    var user = new User()
    {
        Id = id,
        Name = "Tony"
    };
    return Task.FromResult(Results.Ok(user));
});

app.MapPost("/api/v1/users", ([FromBody] UserRequest request)=>
{
    //todo: 添加用户逻辑
    return Task.FromResult(Results.Accepted());
});

app.MapDelete("/api/v1/users/{id}",(Guid id)=>
{
    //todo: 删除用户逻辑
    return Task.FromResult(Results.Accepted());
});

app.MapPut("/api/v1/users/{id}",(Guid id, [FromBody] EditUserRequest request)=>
{
    //todo: 修改用户逻辑
    return Task.FromResult(Results.Accepted());
});

app.Run();
```

### 服务分组

原生写法会使得`Program.cs`文件中充斥着大量的接口服务信息，它将不利于我们的开发工作以及后期的维护，为此`Masa`提供了一个解决方案，它提供了`服务分组`、`路由自动注册`功能。在.NET 7中将会支持`MapGroup`，其目的与`BaseUri`类似

1. 安装 Minimal APIs

``` powershell
dotnet add package Masa.Contrib.Service.MinimalAPIs
```

2. 注册 Minimal APIs

``` C#
var app = builder.AddServices();
```

3. 新建用户服务, **并继承`ServiceBase`**（注册路由）

> 两种注册路由方式任选一个即可


::: tip 自动映射路由规则
```csharp 
var 路由 = $"{前缀}/{版本}/{服务名(默认复数)}/{路由方法名}" 
```
详细规则请[查看](#自动映射路由规则)
:::

<a id = "路由注册"></a>

:::: code-group
::: code-group-item 自动注册路由(推荐)
``` C#
public class UserService : ServiceBase
{
    /// <summary>
    /// Get: /api/v1/users/{id}
    /// </summary>
    public Task<IResult> GetAsync(Guid id)
    {
        // todo: 查询用户信息
        var user = new User()
        {
            Id = id,
            Name = "Tony"
        };
        return Task.FromResult(Results.Ok(user));
    }

    /// <summary>
    /// Post: /api/v1/users
    /// </summary>
    public Task<IResult> AddAsync([FromBody] UserRequest request)
    {
        //todo: 添加用户逻辑
        return Task.FromResult(Results.Accepted());
    }

    /// <summary>
    /// Delete: /api/v1/users/{id}
    /// </summary>
    public Task<IResult> DeleteAsync(Guid id)
    {
        //todo: 删除用户逻辑
        return Task.FromResult(Results.Accepted());
    }

    /// <summary>
    /// Put: /api/v1/users/{id}
    /// </summary>
    public Task<IResult> UpdateAsync(Guid id, [FromBody] EditUserRequest request)
    {
        //todo: 修改用户逻辑
        return Task.FromResult(Results.Accepted());
    }
}
```
:::
::: code-group-item 手动映射路由
``` C#
public class UserService : ServiceBase
{
    public UserService()
    {
        RouteOptions.DisableAutoMapRoute = true;//仅当前服务禁用自动注册路由

        App.MapGet("/api/v1/users/{id}", GetAsync);
        App.MapPost("/api/v1/users", AddAsync);
        App.MapDelete("/api/v1/users/{id}", DeleteAsync);
        App.MapPut("/api/v1/users/{id}", UpdateAsync);
    }

    public Task<IResult> GetAsync(Guid id)
    {
        // todo: 查询用户信息
        var user = new User()
        {
            Id = id,
            Name = "Tony"
        };
        return Task.FromResult(Results.Ok(user));
    }

    public Task<IResult> AddAsync([FromBody] UserRequest request)
    {
        //todo: 添加用户逻辑
        return Task.FromResult(Results.Accepted());
    }

    public Task<IResult> DeleteAsync(Guid id)
    {
        //todo: 删除用户逻辑
        return Task.FromResult(Results.Accepted());
    }

    public Task<IResult> UpdateAsync(Guid id, [FromBody] EditUserRequest request)
    {
        //todo: 修改用户逻辑
        return Task.FromResult(Results.Accepted());
    }
}
```
:::
::::

## 高阶用法

提供默认支持[`RESTful`](https://docs.microsoft.com/zh-cn/azure/architecture/best-practices/api-design)标准，开发人员可以通过`builder.AddServices()`或`builder.Services.AddServices(builder)`来使用`Masa`版的`Minimal APIs`，下面就让我们来看一下它都支持了哪些功能

### <a id = "自动映射规则">自动映射路由规则</a>

#### 优先级

**[自定义路由](#RoutePattern) > [规则生成路由](#生成规则)**

#### 生成规则

``` C#
var Pattern(路由) = $"{BaseUri}/{RouteMethodName}";
```

> [BaseUri](#BaseUri): 根地址
> 
> [RouteMethodName](#自定义路由方法名): 路由方法名

### 路由配置

提供了全局配置以及服务内配置

::: tip 配置优先级与null值处理
服务内配置 > 全局配置

当服务内配置为`null`时，使用全局配置的值
:::

#### 全局配置

|  参数名   | 参数描述  | 默认值  |
|  ----  | ----  | ----  |
| DisableAutoMapRoute  | 是否禁用自动映射路由，如果为true (禁用)，则框架不会自动映射路由 | `false` |
| Prefix  | 前缀 | `api` |
| Version  | 版本 | `v1` |
| AutoAppendId  | 路由中是否包含{Id}, 例如: /api/v1/user/{id} | `true` |
| PluralizeServiceName  | 服务名称是否启用复数 | `true` |
| GetPrefixes  | 用于识别当前方法类型为`Get`请求 | `new List<string> { "Get", "Select", "Find" }`[来源](https://github.com/masastack/MASA.Framework/blob/main/src/Contrib/Service/Masa.Contrib.Service.MinimalAPIs/ServiceGlobalRouteOptions.cs) |
| PostPrefixes | 用于识别当前方法类型为`Post`请求 | `new List<string> { "Post", "Add", "Upsert", "Create", "Insert" }`[来源](https://github.com/masastack/MASA.Framework/blob/main/src/Contrib/Service/Masa.Contrib.Service.MinimalAPIs/ServiceGlobalRouteOptions.cs) |
| PutPrefixes | 用于识别当前方法类型为`Put`请求 | `new List<string> { "Put", "Update", "Modify" }`[来源](https://github.com/masastack/MASA.Framework/blob/main/src/Contrib/Service/Masa.Contrib.Service.MinimalAPIs/ServiceGlobalRouteOptions.cs) |
| DeletePrefixes | 用于识别当前方法类型为`Delete`请求 | `new List<string> { "Delete", "Remove" }`[来源](https://github.com/masastack/MASA.Framework/blob/main/src/Contrib/Service/Masa.Contrib.Service.MinimalAPIs/ServiceGlobalRouteOptions.cs) |
| DisableTrimMethodPrefix | 禁用移除方法前缀(上方`Get`、`Post`、`Put`、`Delete`请求的前缀) | false |
| MapHttpMethodsForUnmatched | 通过方法名前缀匹配请求方式失败后，路由将使用指定的HttpMethod发起请求 | 支持`Post`、`Get`、`Delete`、`Put` |
| Assemblies | 用于扫描服务所在的程序集 | `MasaApp.GetAssemblies()`（全局Assembly集合，默认为当前域程序集集合） |
| RouteHandlerBuilder | 基于`RouteHandlerBuilder`的委托，可用于权限认证、[CORS](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CORS)等 | `null` |

#### 服务内配置

<table style='border-collapse: collapse;table-layout:fixed;width:100%'>
 <col span=6>
 <tr style="background-color:#f3f4f5; font-weight: bold">
  <td colspan=3>参数名</td>
  <td colspan=2>参数描述</td>
  <td>默认值(未赋值为null)</td>
 </tr>
 <tr>
  <td colspan=3><a id = "CustomBaseUri">BaseUri</a></td>
  <td colspan=2>根地址</td>
  <td></td>
 </tr>
 <tr>
  <td colspan=3>ServiceName</td>
  <td colspan=2>服务名称</td>
  <td></td>
 </tr>
 <tr>
  <td colspan=3>RouteHandlerBuilder</td>
  <td colspan=2>基于RouteHandlerBuilder的委托，可用于权限认证、<a href="https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CORS">CORS</a>等</td>
  <td></td>
 </tr>
 <tr>
  <td colspan=3>RouteOptions（对象）</td>
  <td colspan=2>局部路由配置</td>
  <td> </td>
 </tr>
 <tr>
  <td rowspan=12></td>
  <td colspan=2>DisableAutoMapRoute</td>
  <td colspan=2>是否禁用自动映射路由，如果为true (禁用)，则框架不会自动映射路由</td>
  <td></td>
 </tr>
 <tr>
  <td colspan=2>Prefix</td>
  <td colspan=2>前缀</td>
  <td></td>
 </tr>
 <tr>
  <td colspan=2>Version</td>
  <td colspan=2>版本</td>
  <td></td>
 </tr>
 <tr>
  <td colspan=2><a id ="AutoAppendId">AutoAppendId></a></td>
  <td colspan=2>路由中是否包含{Id}, 例如: /api/v1/user/{id}</td>
  <td></td>
 </tr>
 <tr>
  <td colspan=2><a id = "PluralizeServiceName">PluralizeServiceName</a></td>
  <td colspan=2>服务名称是否启用复数</td>
  <td></td>
 </tr>
 <tr>
  <td colspan=2><a id = "GetPrefixes">GetPrefixes</a></td>
  <td colspan=2>用于识别当前方法类型为`Get`请求</td>
  <td></td>
 </tr>
 <tr>
  <td colspan=2>PostPrefixes</td>
  <td colspan=2>用于识别当前方法类型为`Post`请求</td>
  <td></td>
 </tr>
 <tr>
  <td colspan=2>PutPrefixes</td>
  <td colspan=2>用于识别当前方法类型为`Put`请求</td>
  <td></td>
 </tr>
 <tr>
  <td colspan=2>DeletePrefixes</td>
  <td colspan=2>用于识别当前方法类型为`Delete`请求</td>
  <td></td>
 </tr>
 <tr>
  <td colspan=2><a id = "DisableTrimMethodPrefix">DisableTrimMethodPrefix</a></td>
  <td colspan=2>禁用移除方法前缀(上方`Get`、`Post`、`Put`、`Delete`请求的前缀)</td>
  <td></td>
 </tr>
 <tr>
  <td colspan=2><a id ="MapHttpMethodsForUnmatched">MapHttpMethodsForUnmatched</a></td>
  <td colspan=2>通过方法名前缀匹配请求方式失败后，路由将使用指定的HttpMethod发起请求</td>
  <td></td>
 </tr>
</table>

### 如何使用

:::: code-group
::: code-group-item 全局配置
``` C#
builder.AddServices(options =>
{
    options.Prefix = "api";//自定义前缀
    options.DisableAutoMapRoute = true;//可通过配置true禁用全局自动路由映射或者删除此配置以启用全局自动路由映射
})
```
:::
::: code-group-item 服务内配置
``` C#
public class UserService: ServiceBase
{
    public UserService()
    {
        RouteOptions.Prefix = "v2";//自定义前缀
        RouteOptions.DisableAutoMapRoute = true;//可通过配置true禁用当前服务使用自动路由映射或者配置false以启用当前服务的自动路由映射
        ServiceName = "account";// 自定义服务名
    }
}
```
:::
::::

针对早期已经使用`Minimal APIs`的开发者，可以通过服务内配置或者通过全局配置来禁用或启动自动映射路由


### 特性

#### <a id = "RoutePattern">自定义路由</a>

被用于`自定义完整路由`或自定义`RouteMethodName（路由方法名）`或自定义`请求类型`

:::: code-group
::: code-group-item 自定义完整路由
``` C#
public class UserService: ServiceBase
{
    /// <summary>
    /// Post：/user/add
    /// </summary>
    [RoutePattern(pattern: "user/add")]
    public Task<IResult> Add([FromBody] AddUserRequest request)
    {
        //todo: 添加用户
        return Task.FromResult(Results.Accepted());
    }
}
```
:::
::: code-group-item 自定义RouteMethodName（自定义路由方法名）
``` C#
public class UserService: ServiceBase
{
    /// <summary>
    /// Post：/api/v1/users/add
    /// var Pattern(路由) = $"{BaseUri}/{RouteMethodName}"; 此处pattern为RouteMethodName的值
    /// </summary>
    [RoutePattern(pattern: "add", startWithBaseUri: true)]
    public Task<IResult> Add([FromBody] AddUserRequest request)
    {
        //todo: 添加用户
        return Task.FromResult(Results.Accepted());
    }
}
```
:::
::: code-group-item 自定义请求类型
``` C#
public class UserService: ServiceBase
{
    /// <summary>
    /// Post：/api/v1/users/audit
    /// </summary>
    [RoutePattern(HttpMethod = "Post")]
    public IResult Audit(Guid id, [FromBody] AuditUserRequest request)
    {
        //todo: 审核用户信息
        return Results.Ok();
    }

    /// <summary>
    /// Post：/api/v1/users
    /// </summary>
    [RoutePattern(HttpMethod = "Post")]
    public IResult GetAsync([FromBody] UserQuery query)
    {
        //todo: 获取用户详情
        return Results.Ok();
    }
}
```
:::
::::

#### <a id = "IgnoreRoute">忽略路由自动映射</a>

使用`IgnoreRoute`标记的方法不再自动映射路由，方法将不能通过API被访问

``` C#
public class UserService: ServiceBase
{
    [IgnoreRoute]
    public bool ExistUser(string name)
    {
        //检查用户是否存在
        return false;
    }
}
```

## 常见问题

1. 继承`ServiceBase`服务的类的构造函数中不能使用生命周期为`Scoped`、`Transient`的服务，且构造函数中的参数类型必须支持从`DI`中获取

在`builder.AddServices()`执行后，框架会自动扫描继承`ServiceBase`服务的类会获取其示例注册到路由上，无论它是动态注册路由还是手动注册路由，它仅会被注册一次，它的生命周期与项目的生命周期一致，是单例的

2. 在`Minimal APIs`中如何使用服务

:::: code-group
::: code-group-item 方法1
``` C#
public class UserService: ServiceBase
{
    /// <summary>
    /// Post：/api/v1/users/audit
    /// </summary>
    [RoutePattern(HttpMethod = "Post")]
    public IResult Audit(Guid id, [FromBody] AuditUserRequest request, [FromServices]IUserRepository userRepository)
    {
        //todo: 审核用户信息
        return Results.Ok();
    }
}
```
:::
::: code-group-item 方法2
``` C#
public class UserService: ServiceBase
{
    /// <summary>
    /// Post：/api/v1/users/audit
    /// </summary>
    [RoutePattern(HttpMethod = "Post")]
    public IResult Audit(Guid id, [FromBody] AuditUserRequest request)
    {
        IUserRepository userRepository = GetRequiredService<IUserRepository>();
        //todo: 审核用户信息
        return Results.Ok();
    }
}
```
:::
::::

::: tip ServiceBase
在`ServiceBase`中我们提供了`GetService<TService>()`、`GetRequiredService<TService>()`方法用于从DI中获取服务
:::

1. 我希望修改路由方法名的规则，则可以重写`ServiceBase`的`GetMethodName`，例如：移除方法前缀为`GetAll`的方法、`GetAllUser` -> `User/List/All`

``` C#
protected override string GetMethodName(MethodInfo methodInfo, string prefix, ServiceRouteOptions globalOptions)
{
    var methodName = methodInfo.Name;
    //todo: 重写获取自定义方法，通过重新指定规则定义自定义方法名
    if (methodName.StartsWith("GetAll", StringComparison.OrdinalIgnoreCase))
    {
        var list = new List<string>()
        {
            (methodName.TrimStart("GetAll", StringComparison.OrdinalIgnoreCase)),
            "List",
            "All"
        };
        return string.Join('/', list);
    }
    return methodName;
}
```

## 原理解剖

### 自动映射范围

当服务开启自动映射路由后，必须满足以下条件，方可支持自动映射

1. 方法的访问级别为`Public`
2. 服务必须是非抽象类，抽象类将不被支持自动映射

### <a id = "BaseUri">BaseUri (根地址)</a>

优先级：`自定义根地址` > `规则生成根地址`

#### 自定义根地址

我们可以在`自定义服务`中通过配置[BaseUri](#CustomBaseUri)来自定义根地址，例如：

``` C#
public class UserService: ServiceBase
{
    public UserService()
    {
        BaseUri = "自定义根地址";
    }
}
```

#### 规则生成根地址

当`BaseUri`为`null`或者空时，根地址则会根据规则自动生成

``` C#
var BaseUri = $"{前缀}/{版本}/{服务名(默认复数)}"
```

::: tip 其它
1. 服务名默认使用复数，如果希望禁用复数，则可通过配置[`PluralizeServiceName`](#PluralizeServiceName)进行更改
2. 当前缀、版本为null或空字符串时，忽略其属性的值，当服务名为空字符串时，`BaseUri`将不再包含服务名

例如：
* 当版本为`null`或者空字符串时，此时 `var BaseUri = $"{前缀}/{服务名(默认复数)}"` 
* 当服务名为空字符串时，此时 `var BaseUri = $"{前缀}/{版本}"` 
:::

### RouteMethodName (路由方法名)

优先级: `自定义路由方法名` > `规则生成路由方法名`

#### 自定义路由方法名

通过`RoutePattern`特性可自定义路由方法名

``` C#
public class UserService: ServiceBase
{
    /// <summary>
    /// Post：/api/v1/users/add
    /// </summary>
    [RoutePattern(pattern: "add", startWithBaseUri: true)]
    public Task<IResult> Add([FromBody] AddUserRequest request)
    {
        //todo: 添加用户
        return Task.FromResult(Results.Accepted());
    }
}
```

#### 规则生成路由方法名

当未自定义路由且未指定自定义方法名时，它需要

* 得到当前方法的方法名
* TrimStart: 移除匹配到的请求方式前缀
  * 可通过[`DisableTrimMethodPrefix`](#DisableTrimMethodPrefix)禁用或启用移除前缀
* TrimEnd: 移除Async结尾
* 追加/{id}: 根据参数名称匹配是否等于`id`，且未增加[FromBodyAttribute]、[FromFormAttribute]、[FromHeaderAttribute]、[FromQueryAttribute]、[FromServicesAttribute]特性
  * 可通过[`AutoAppendId`](#AutoAppendId)禁用或启用自动追加{id}

> 如果希望更改路由方法名的生成规则，可根据需要重写`ServiceBase`提供的`GetMethodName`方法

### 请求类型

优先级：`自定义请求类型` > `根据方法名前缀智能匹配` > `智能匹配失败后默认配置`

#### 自定义请求类型

通过`RoutePattern`特性可自定义请求类型

``` C#
public class UserService: ServiceBase
{
    /// <summary>
    /// Post：/api/v1/users
    /// </summary>
    [RoutePattern(HttpMethod = "Post")]
    public IResult GetAsync([FromBody] UserQuery query)
    {
        //todo: 获取用户详情
        return Results.Ok();
    }
}
```

#### 智能匹配

当方法未自定义请求类型时，我们将根据方法名前缀只能匹配请求类型，例如：

``` C#
public class UserService: ServiceBase
{
    /// <summary>
    /// Get: /api/v1/users
    /// </summary>
    public IResult GetAsync([FromBody] UserQuery query)
    {
        //todo: 获取用户详情
        return Results.Ok();
    }
}
```

> Get请求默认不支持对象，如果希望支持对象，[请参考](https://learn.microsoft.com/zh-cn/aspnet/core/fundamentals/minimal-apis?view=aspnetcore-6.0#custom-binding)

> 由于GetAsync以`Get`开头，并且在[Get请求前缀配置](#GetPrefixes)中已经存在，因此智能匹配为`Get`请求

#### 智能匹配失败

当智能匹配失败后，我们将使用[`MapHttpMethodsForUnmatched`](#MapHttpMethodsForUnmatched)来映射当前API的请求类型，如果你希望当匹配失败后，默认使用`Post`请求，则

:::: code-group
::: code-group-item 全局配置
``` C#
builder.AddServices(options =>
{
    MapHttpMethodsForUnmatched = new[] { "Post" };//当请求类型匹配失败后，默认映射为Post请求 (当前项目范围内，除非范围配置单独指定)
})
```
:::
::: code-group-item 服务内配置
``` C#
public class UserService: ServiceBase
{
    public UserService()
    {
        RouteOptions.MapHttpMethodsForUnmatched = new[] { "Post" };//当请求类型匹配失败后，默认映射为Post请求 (当前服务范围内)
    }
}
```
:::
::::

## 相关Issues

[#2](https://github.com/masastack/MASA.Framework/issues/2)、[#241](https://github.com/masastack/MASA.Framework/issues/241)