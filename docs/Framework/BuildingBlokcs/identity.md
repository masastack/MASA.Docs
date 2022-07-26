---
title: 身份
date: 2022/07/01
---

用于设置身份、获取身份信息

## 安装

``` C#
Install-Package Masa.BuildingBlocks.Identity.IdentityModel
```

这个库提供了身份所需的API，但在使用它之前，你需要配置一个提供程序

目前身份的提供者有:

[`IdentityModel`](/framework/contribs/identity)

## IUserContext

1. 获取用户id

``` C#
app.MapGet("/user/getid", async (IUserContext context) =>
{
    return context.UserId;
});
```

2. 获取用户信息

``` C#
app.MapGet("/user/get", async (IUserContext context) =>
{
    return context.GetUser<IdentityUser>();
});
```

3. 得到用户角色id集合

``` C#
app.MapGet("/role/get", async (IUserContext context) =>
{
    return context.GetUserRoles<string>();
});
```

4. 得到用户认证(登录)状态

``` C#
app.MapGet("/role/get", async (IUserContext context) =>
{
    return context.IsAuthenticated;
});
```

## IUserSetter

1. 临时更改当前登录用户信息

``` C#
IUserContext userContext;//从DI中获取IUserContext，假如用户信息为Jim，id为1
IUserSetter userSetter;//从DI中获取IUserSetter
var user = new IdentityUser()
{
    Id = "2",
    UserName = "Tom",
    Environment = "Production",
    TenantId = "2"
};

//临时更改用户信息为tom
using (userSetter.Change(user))
{
    //获取到的用户信息为Tom
}

//获取到的用户信息仍然为Jim
```

## IMultiTenantUserContext

多租户用户上下文，继承[IUserContext](#IUserContext)

1. 获取租户id

```
app.MapGet("/user/tenant/getid", async (IMultiTenantUserContext context) =>
{
    return context.TenantId;
});
```

## IMultiEnvironmentUserContext

多租户用户上下文，继承[IUserContext](#IUserContext)

1. 获取环境

```
app.MapGet("/user/environment/get", async (IMultiEnvironmentUserContext context) =>
{
    return context.Environment;
});
```

## IIsolatedUserContext

既使用多租户、又使用了多环境，继承[IMultiTenantUserContext](#IMultiTenantUserContext)、[IMultiEnvironmentUserContext](#IMultiEnvironmentUserContext)