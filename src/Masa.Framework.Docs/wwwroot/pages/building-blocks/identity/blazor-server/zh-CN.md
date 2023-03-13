## 概念

用于`Blazor Server`项目, 提供的用户身份信息来源于`HttpContext.User`、`AuthenticationStateProvider`

## 使用

1. 安装`Masa.Contrib.Authentication.Identity.BlazorServer`

```csharp
dotnet add package Masa.Contrib.Authentication.Identity.BlazorServer
```

2. 注册`MasaIdentity`, 修改`Program`

```csharp
builder.Services.AddMasaIdentity();
```

3. 获取用户信息

```csharp
IUserContext userContext;//从DI获取
var userId = userContext.GetUserId<Guid>();
```