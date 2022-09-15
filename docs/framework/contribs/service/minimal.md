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

1. 安装`Masa.Contrib.Service.MinimalAPIs`

``` C#
dotnet add package Masa.Contrib.Service.MinimalAPIs
```

2. 使用`Masa`版的`MinimalAPI`

``` C#
var app = builder.AddServices();
```

3. 新建用户服务`UserService`

``` C#
public class UserService : ServiceBase
{
    private IResult CreateUser()
    {
        //todo: 注册用户逻辑
        return Results.Ok();
    }
}
```

4. 测试

最后通过访问`{host}/api/v1/user/user`可访问当创建用户方法

## 进阶

提供默认支持[`RESTful`](https://docs.microsoft.com/zh-cn/azure/architecture/best-practices/api-design)标准，开发人员可以通过`builder.AddServices()`或`builder.Services.AddServices(builder)`来使用我们提供的MinimalAPI，它将有助于我们摆脱流水账式编程，下面我们会讲解我们提供了哪些功能？

首先`MinimalAPI`提供了全局配置以及局部配置，优先级为局部配置 > 全局配置

### 全局配置

我们可以在添加服务时设置全局配置，例如：

``` C#
builder.AddServices(options =>
{
    options.Prefix = "api";
})
```

全局配置参数有：

* DisableRestful: 是否禁用Restful，如果为true (禁用)，则框架不会自动映射路由，默认：false
* Prefix: 前缀，默认: api
* Version: 版本，默认: v1
* AutoAppendId: 是否追加Id，默认: true
* PluralizeServiceName: 服务名称是否启用复数，默认: true
* GetPrefixs: 用于识别当前方法类型为`Get`请求，默认: `new[] { "Get", "Select" }`
* PostPrefixs: 用于识别当前方法类型为`Post`请求，默认: `new[] { "Post", "Add", "Upsert", "Create" }`
* PutPrefixs: 用于识别当前方法类型为`Put`请求，默认: `new[] { "Put", "Update", "Modify" }`
* DeletePrefixs: 用于识别当前方法类型为`Delete`请求，默认: `new[] { "Delete", "Remove" }`
* Assemblies: 用于扫描服务所在的程序集，默认: `AppDomain.CurrentDomain.GetAssemblies()`

### 局部配置

局部配置参数的默认值全部为`null`，当属性的值为`null`时，使用全局配置的值

* DisableRestful
* Prefix
* Version
* AutoAppendId
* PluralizeServiceName
* GetPrefixs
* PostPrefixs
* PutPrefixs
* DeletePrefixs


### 相关issues

[#2](https://github.com/masastack/MASA.Framework/issues/2)、[#241](https://github.com/masastack/MASA.Framework/issues/241)

## 其它

1. 继承`ServiceBase`服务的类的生命周期为单例，其构造函数中不能使用生命周期为`Scoped`的服务，且构造函数中的参数类型必须支持从`DI`中获取
2. 生命周期为`Scoped`的服务需要在方法中通过参数的方式使用，例如:

``` C#
private void Register(ILogger<UserService> logger)
{
    //todo: 注册用户逻辑
}
```