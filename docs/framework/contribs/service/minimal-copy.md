---
title: 服务 - 最小API
date: 2022/09/15
---

## 概述

最小的 API 包括：

新的承载 API
WebApplication 和 WebApplicationBuilder
新的路由 API

而我们提供的`ServiceBase`为MinimalAPI提供了类似`ControllerBase`的功能，避免使用`MinimalAPI`而导致陷入流水账式编程

## 入门

:::: code-group
::: code-group-item 1. 安装`MinimalAPI`
``` powershell
dotnet add package Masa.Contrib.Service.MinimalAPIs
```
:::
::: code-group-item 2. 注册`MinimalAPI`
``` C#
var app = builder.AddServices();
```
:::
::: code-group-item 3. 新建服务
``` C#
public class UserService : ServiceBase
{
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

    public Task<IResult> GetAsync(Guid id)
    {
        // todo: 查询用户信息
        var user = new User()
        {
            Id = id,
            Name = "Tony"
        };
        return Task.FromResult(user);
    }
}
```
:::
::: code-group-item 4. 测试API服务
``` C#

// 添加用户
curl -X POST -d '{"Name": "Tony"}' --header "Content-Type: application/json" localhost:5000/api/v1/users

// 删除用户
curl -X Delete -d '{"id": "4669f4b2-8eb2-4169-a46b-59ca89c6b296"}' --header "Content-Type: application/json" localhost:5000/api/v1/users 

//修改用户
curl -X Put -d '{"Name": "Tom"}' --header "Content-Type: application/json" localhost:5000/api/v1/users/4669f4b2-8eb2-4169-a46b-59ca89c6b296

//查询用户
curl localhost:5000/api/v1/users/4669f4b2-8eb2-4169-a46b-59ca89c6b296
```
:::
::::

## 进阶

提供默认支持[`RESTful`](https://docs.microsoft.com/zh-cn/azure/architecture/best-practices/api-design)标准，开发人员可以通过`builder.AddServices()`或`builder.Services.AddServices(builder)`来使用我们提供的MinimalAPI，它将有助于我们摆脱流水账式编程，下面我们会讲解我们提供了哪些功能？

首先`MinimalAPI`提供了全局配置以及局部配置，优先级为局部配置 > 全局配置

### 配置

#### 全局配置

|  参数名   | 参数描述  | 默认值  |
|  ----  | ----  | ----  |
| DisableAutoMapRoute  | 是否禁用自动映射路由，如果为true (禁用)，则框架不会自动映射路由 | `false` |
| Prefix  | 前缀 | `api` |
| Version  | 版本 | `v1` |
| AutoAppendId  | 是否追加Id | `true` |
| PrefPluralizeServiceNameix  | 服务名称是否启用复数 | `true` |
| GetPrefixs  | 用于识别当前方法类型为`Get`请求 | `new List<string> { "Get", "Select" }` |
| PostPrefixs | 用于识别当前方法类型为`Post`请求 | `new List<string> { "Post", "Add", "Upsert", "Create" }` |
| PutPrefixs | 用于识别当前方法类型为`Put`请求 | `new List<string> { "Put", "Update", "Modify" }` |
| DeletePrefixs | 用于识别当前方法类型为`Delete`请求 | `new List<string> { "Delete", "Remove" }` |
| DisableTrimMethodPrefix | 禁用移除方法前缀(上方`Get`、`Post`、`Put`、`Delete`请求的前缀) | false |
| MapHttpMethodsForUnmatched | 匹配请求方式失败使用 | 支持`Post`、`Get`、`Delete`、`Put` |
| Assemblies | 用于扫描服务所在的程序集 | `MasaApp.GetAssemblies()`（全局Assembly集合，默认为当前域程序集集合） |
| RouteHandlerBuilder | 基于`RouteHandlerBuilder`的委托，可用于权限认证、Cors等 | `null` |

#### 服务配置

当服务配置属性的值为`null`时，使用全局配置的值

<table style='border-collapse: collapse;table-layout:fixed;width=100%'>
 <col span=6>
 <tr style="background-color:#f3f4f5; font-weight: bold">
  <td colspan=3>参数名</td>
  <td colspan=2>参数描述</td>
  <td>默认值</td>
 </tr>
 <tr>
  <td colspan=3>BaseUri</td>
  <td colspan=2>根地址</td>
  <td>null</td>
 </tr>
 <tr>
  <td colspan=3>ServiceName</td>
  <td colspan=2>服务名称</td>
  <td> null</td>
 </tr>
 <tr>
  <td colspan=3>RouteHandlerBuilder</td>
  <td colspan=2>基于RouteHandlerBuilder的委托，可用于权限认证、Cors等</td>
  <td> null</td>
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
  <td>false</td>
 </tr>
 <tr>
  <td colspan=2>Prefix</td>
  <td colspan=2>前缀</td>
  <td>api</td>
 </tr>
 <tr>
  <td colspan=2>Version</td>
  <td colspan=2>版本</td>
  <td>null</td>
 </tr>
 <tr>
  <td colspan=2>Version</td>
  <td colspan=2>版本</td>
  <td>null</td>
 </tr>
 <tr>
  <td colspan=2>AutoAppendId</td>
  <td colspan=2>是否追加Id</td>
  <td>null</td>
 </tr>
 <tr>
  <td colspan=2>PrefPluralizeServiceNameix</td>
  <td colspan=2>服务名称是否启用复数</td>
  <td>null</td>
 </tr>
 <tr>
  <td colspan=2>GetPrefixs</td>
  <td colspan=2>用于识别当前方法类型为`Get`请求</td>
  <td>null</td>
 </tr>
 <tr>
  <td colspan=2>PostPrefixs</td>
  <td colspan=2>用于识别当前方法类型为`Post`请求</td>
  <td>null</td>
 </tr>
 <tr>
  <td colspan=2>PutPrefixs</td>
  <td colspan=2>用于识别当前方法类型为`Put`请求</td>
  <td>null</td>
 </tr>
 <tr>
  <td colspan=2>DeletePrefixs</td>
  <td colspan=2>用于识别当前方法类型为`Delete`请求</td>
  <td>null</td>
 </tr>
 <tr>
  <td colspan=2>DisableTrimMethodPrefix</td>
  <td colspan=2>禁用移除方法前缀(上方`Get`、`Post`、`Put`、`Delete`请求的前缀)</td>
  <td>null</td>
 </tr>
 <tr>
  <td colspan=2>MapHttpMethodsForUnmatched</td>
  <td colspan=2>匹配请求方式失败使用</td>
  <td>null</td>
 </tr>
</table>

### 如何使用

:::: code-group
::: code-group-item 使用全局配置
``` C#
builder.AddServices(options =>
{
    options.Prefix = "api";
})
```
:::
::: code-group-item 使用服务配置
``` C#
public class UserService: ServiceBase
{
    public UserService()
    {
        RouteOptions.Prefix = "v2";
        ServiceName = "account";
    }
}
```
:::
::::


针对早期已经使用`MinimalAPI`的开发者，如果不希望路由变化，可以通过`Rout.DisableAutoMapRoute = true`来关闭当前服务使用自动映射路由或者调整路由规则以适配

### 规则

#### 路由优先级

自定义路由 > 根据规则生成路由

我们新增了特性`RoutePatternAttribute`，它被用于自定义路由，详细用法请[查看](#RoutePattern)

#### 路由生成规则

Pattern(路由) = `BaseUri` + `RouteMethodName`

* BaseUri: 根地址，默认: null
  * BaseUri = `前缀` + `版本` + `服务名`
* RouteMethodName: 除非自定义`RouteMethodName`，否则`RouteMethodName` = `GetMethodName(方法名)`

`GetMethodName`:
1. TrimStart：移除前缀（根据请求方式匹配获取）
2. TrimEnd：Async

### 特性

<a id = "RoutePattern">`RoutePattern` 自定义路由</a>

:::: code-group
::: code-group-item 自定义完整路由
``` C#
public class UserService: ServiceBase
{
    [RoutePattern("user/add")]
    public IResult AddUser(AddUserRequest request)
    {
        //todo: 添加用户
        return Results.Ok();
    }
}
```
:::
::: code-group-item 自定义方法名
``` C#
public class UserService: ServiceBase
{
    [RoutePattern("user/add", true)]
    public IResult AddUser(AddUserRequest request)
    {
        //todo: 添加用户
        return Results.Ok();
    }
}
```
:::
::: code-group-item 自定义请求类型
``` C#
public class UserService: ServiceBase
{
    [RoutePattern(HttpMethod = "Post")]
    public IResult AddUser(AddUserRequest request)
    {
        //todo: 添加用户
        return Results.Ok();
    }
}
```
:::
::::

<a id = "IgnoreRoute">`IgnoreRoute` 忽略路由自动映射</a>

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

1. 继承`ServiceBase`服务的类的生命周期为单例，其构造函数中不能使用生命周期为`Scoped`的服务，且构造函数中的参数类型必须支持从`DI`中获取
2. 生命周期为`Scoped`的服务需要在方法中通过参数的方式使用，例如:

``` C#
public void Register(ILogger<UserService> logger)
{
    //todo: 注册用户逻辑
}
```

3. `ServiceBase`支持`GetService<TService>`、`GetRequiredService<TService>`，支持获取生命周期为`Scoped`的服务

## 相关issues

[#2](https://github.com/masastack/MASA.Framework/issues/2)、[#241](https://github.com/masastack/MASA.Framework/issues/241)