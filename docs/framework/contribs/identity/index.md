---
title: 身份
date: 2022/11/15
---

## 概念

用于设置用户身份、获取用户的身份信息

目前的提供者有:

* [Masa.Contrib.Authentication.Identity](./web.md): 支持`ASP.NET Core`应用
* [Masa.Contrib.Authentication.Identity.BlazorServer](./blazor-server.md): 支持 `Blazor Server`应用
* [Masa.Contrib.Authentication.Identity.BlazorAssembly](./blazor-wasm.md): 支持 `Blazor WebAssembly`应用

## 功能列表

* [获取用户信息](#IUserContext): IUserContext、IMultiTenantUserContext、IMultiEnvironmentUserContext、IIsolatedUserContext
* [设置用户信息](#IUserSetter): IUserSetter

## 配置

默认用户信息以及对应的ClaimType如下:

|  信息   | ClaimType  |
| :----| :---- |
| UserId | [`ClaimTypes.NameIdentifier`](https://github.com/masastack/MASA.Framework/tree/0.7.0/src/Contrib/Authentication/Masa.Contrib.Authentication.Identity.Core/Constants/ClaimType.cs) |
| UserName | [`ClaimTypes.DEFAULT_USER_NAME`](https://github.com/masastack/MASA.Framework/tree/0.7.0/src/Contrib/Authentication/Masa.Contrib.Authentication.Identity.Core/Constants/ClaimType.cs) |
| Role | [`ClaimTypes.DEFAULT_USER_ROLE`](https://github.com/masastack/MASA.Framework/tree/0.7.0/src/Contrib/Authentication/Masa.Contrib.Authentication.Identity.Core/Constants/ClaimType.cs) |
| TenantId | [`ClaimTypes.DEFAULT_TENANT_ID`](https://github.com/masastack/MASA.Framework/tree/0.7.0/src/Contrib/Authentication/Masa.Contrib.Authentication.Identity.Core/Constants/ClaimType.cs) |
| Environment | [`ClaimTypes.DEFAULT_ENVIRONMENT`](https://github.com/masastack/MASA.Framework/tree/0.7.0/src/Contrib/Authentication/MMasa.Contrib.Authentication.Identity.Core/Constants/ClaimType.cs) |

## 源码解读

### IUserContext

获取当前用户信息

* IsAuthenticated: 获取当前用户是否认证
* UserId: 获取用户Id
* UserName: 获取用户名称
* GetUserId\<TUserId\>(): 获取指定类型的用户Id
* GetUser(): 获取基础的用户信息 (用户id、用户名称、用户权限集合)
* GetUser\<TIdentityUser\>(): 获取指定类型的用户信息 (支持自定义用户对象)
* GetUserRoles\<TRoleId\>(): 获得指定类型的用户权限集合

### IMultiTenantUserContext

获取多租户用户信息, 继承`IUserContext`

* TenantId: 获取当前租户id
* GetTenantId\<TTenantId\>(): 获取指定类型的租户id

### IMultiEnvironmentUserContext

获取多环境用户信息, 继承`IUserContext`

* Environment: 获得当前环境

### IIsolatedUserContext

获取多租户用户信息以及环境信息, 继承IMultiTenantUserContext、IMultiEnvironmentUserContext

### IUserSetter

设置当前用户信息

* Change\<TIdentityUser\>(TIdentityUser identityUser): 支持临时更改用户信息, 当被释放时会还原用户信息
