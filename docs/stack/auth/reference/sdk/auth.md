---
title: MASA Auth SDK
date: 2022/10/8 16:21
---

## Masa.Contrib.StackSdks.Auth

通过注入`IAuthClient`接口，调用对应Service获取Auth SDK 提供的能力。
SDK获取当前用户ID依赖`Masa.Contrib.Identity.IdentityModel`，所以使用前需添加IdentityModel服务。

### 服务介绍

```c#
IAuthClient
├── UserService                     用户服务
├── SubjectService                  全局搜索用户、角色、团队、组织架构
├── TeamService                     团队服务
├── PermissionService               权限、菜单服务
└── ProjectService                  全局导航服务
```

### 使用介绍

#### 安装依赖包

```C#
Install-Package Masa.Contrib.StackSdks.Auth
```

#### 注册相关服务

```C#
builder.Services.AddAuthClient("http://authservice.com");
```

> `http://authservice.com` 为Auth后台服务地址

#### 依赖注入IAuthClient

```c#
var app = builder.Build();

app.MapGet("/GetTeams", ([FromServices] IAuthClient authClient) =>
{
    return authClient.TeamService.GetAllAsync();
});

app.Run();
```
