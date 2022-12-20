---
title: 身份 - ASP.NET Core
date: 2022/11/15
---


## 概念

用于ASP.NET Core项目, 提供的用户身份信息来源于`HttpContext.User`

## 使用

1. 安装`Masa.Contrib.Authentication.Identity`

``` powershell
dotnet add package Masa.Contrib.Authentication.Identity
```

2. 注册`MasaIdentity`, 修改`Program.cs`

``` C#
builder.Services.AddMasaIdentity();
```

3. 获取用户信息

``` C#
IUserContext userContext;//从DI获取
var userId = userContext.GetUserId<Guid>();
```