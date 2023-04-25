﻿# 用户身份 - 概念

用于设置用户身份、获取用户的身份信息

## 最佳实践

根据你的应用程序不同, 可以选择以下身份提供程序的实现:

* [Masa.Contrib.Authentication.Identity](/framework/building-blocks/identity/web)：支持 `ASP.NET Core` 应用
* [Masa.Contrib.Authentication.Identity.BlazorServer](/framework/building-blocks/identity/blazor-server)：支持 `Blazor Server` 应用
* [Masa.Contrib.Authentication.Identity.BlazorAssembly](/framework/building-blocks/identity/blazor-wasm)：支持 `Blazor WebAssembly` 应用

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