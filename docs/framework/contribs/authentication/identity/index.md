---
title: 认证 - 身份
date: 2022/11/15
---

## 概念

用于设置用户身份、获取用户的身份信息, 目前的提供者有:

* [Masa.Contrib.Authentication.Identity](https://www.nuget.org/packages/Masa.Contrib.Authentication.Identity): 支持`ASP.NET Core`应用 [查看详细](./web.md)
* [Masa.Contrib.Authentication.Identity.BlazorServer](https://www.nuget.org/packages/Masa.Contrib.Authentication.Identity.BlazorServer): 支持 `Blazor Server`应用 [查看详细](./blazor-server.md)
* [Masa.Contrib.Authentication.Identity.BlazorWebAssembly](https://www.nuget.org/packages/Masa.Contrib.Authentication.Identity.BlazorWebAssembly): 支持 `Blazor WebAssembly`应用 [查看详细](./blazor-web-wasm.md)

> 根据实际需要选择其中一个提供者即可

## 功能列表

* [获取用户信息](#获取用户信息): IUserContext、IMultiTenantUserContext、IMultiEnvironmentUserContext、IIsolatedUserContext
* [设置用户信息](#设置用户信息): IUserSetter

## 使用

以ASP.NET Core 项目为例

1. 安装[Masa.Contrib.Authentication.Identity](./web.md)

``` powershell
dotnet add package Masa.Contrib.Authentication.Identity
```

2. 注册MasaIdentity, 修改Program.cs

``` C#
builder.Services.AddMasaIdentity();
```

3. 获取用户信息

``` C#
IUserContext userContext;//从DI获取
var userId = userContext.GetUserId<Guid>();
```

## 配置

默认用户信息以及映射的ClaimType如下:

|  信息   | ClaimType  |
| :----| :---- |
| UserId | [`Masa.Contrib.Authentication.Identity.ClaimType.DEFAULT_USER_ID`](https://github.com/masastack/MASA.Framework/tree/0.7.0/src/Contrib/Authentication/Masa.Contrib.Authentication.Identity.Core/Constants/ClaimType.cs) |
| UserName | [`Masa.Contrib.Authentication.Identity.ClaimType.DEFAULT_USER_NAME`](https://github.com/masastack/MASA.Framework/tree/0.7.0/src/Contrib/Authentication/Masa.Contrib.Authentication.Identity.Core/Constants/ClaimType.cs) |
| Role | [`Masa.Contrib.Authentication.Identity.ClaimType.DEFAULT_USER_ROLE`](https://github.com/masastack/MASA.Framework/tree/0.7.0/src/Contrib/Authentication/Masa.Contrib.Authentication.Identity.Core/Constants/ClaimType.cs) |
| TenantId | [`Masa.Contrib.Authentication.Identity.ClaimType.DEFAULT_TENANT_ID`](https://github.com/masastack/MASA.Framework/tree/0.7.0/src/Contrib/Authentication/Masa.Contrib.Authentication.Identity.Core/Constants/ClaimType.cs) |
| Environment | [`Masa.Contrib.Authentication.Identity.ClaimType.DEFAULT_ENVIRONMENT`](https://github.com/masastack/MASA.Framework/tree/0.7.0/src/Contrib/Authentication/MMasa.Contrib.Authentication.Identity.Core/Constants/ClaimType.cs) |

### 更改映射关系

修改用户信息与`ClaimType`默认映射关系

``` C#
services.AddMasaIdentity(option =>
{
    option.TenantId = "TenantId";// 默认租户id来源为: TenantId
    option.Mapping("TrueName", "RealName"); //新增身份信息`TrueName`, 并设置信息原来为: `RealName`
});
```

### 获取自定义用户信息的值

1. 新建自定义用户类

``` C#
public class CustomerUser: IdentityUser, IIdentityUser
{
    public string TrueName { get; set; }
}
```

2. 获取自定义用户信息

``` C#
IUserContext userContext;//从DI获取
var user = userContext.GetUser<CustomerUser>();
string trueName = user.TrueName;//获取用户真实姓名
```

## 源码解读

### 获取用户信息

#### IUserContext

获取当前用户信息

* IsAuthenticated: 获取当前用户是否认证
* UserId: 获取用户Id
* UserName: 获取用户名称
* GetUserId\<TUserId\>(): 获取指定类型的用户Id
* GetUser(): 获取基础的用户信息 (用户id、用户名称、用户权限集合)
* GetUser\<TIdentityUser\>(): 获取指定类型的用户信息 (支持自定义用户对象)
* GetUserRoles\<TRoleId\>(): 获得指定类型的用户权限集合

#### IMultiTenantUserContext

获取多租户用户信息, 继承`IUserContext`

* TenantId: 获取当前租户id
* GetTenantId\<TTenantId\>(): 获取指定类型的租户id

#### IMultiEnvironmentUserContext

获取多环境用户信息, 继承`IUserContext`

* Environment: 获得当前环境

#### IIsolatedUserContext

获取多租户用户信息以及环境信息, 继承IMultiTenantUserContext、IMultiEnvironmentUserContext


### 设置用户信息
#### IUserSetter

设置当前用户信息

* Change\<TIdentityUser\>(TIdentityUser identityUser): 支持临时更改用户信息, 当被释放时会还原用户信息

## 疑问

1. A: 我们的项目Claim的value值不是通过Json序列化的，而是通过Yaml或者其它格式来序列化的，这样可能会导致我们的项目无法读取，请问如何解决？
   * Q: 以Yaml为例

        ``` C#
        var services = new ServiceCollection();
        services.AddYaml();
        services.AddMasaIdentity(DataType.Yml.ToString());
        ```