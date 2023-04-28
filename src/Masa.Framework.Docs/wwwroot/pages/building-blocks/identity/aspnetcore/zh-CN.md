# 用户身份 - ASP.NET Core

## 概述

用于 `ASP.NET Core` 项目, 提供的用户身份信息来源于 `HttpContext.User`

## 使用

1. 安装 `Masa.Contrib.Authentication.Identity`

   ```shell 终端
   dotnet add package Masa.Contrib.Authentication.Identity
   ```

2. 注册 `MasaIdentity`

   ```csharp Program.cs
   builder.Services.AddMasaIdentity();
   ```

3. 获取用户信息

   ```csharp
   IUserContext userContext;//从DI获取
   var userId = userContext.GetUserId<Guid>();
   ```

## 高阶用法

### 更改映射关系

```csharp
services.AddMasaIdentity(option =>
{
    option.TenantId = "TenantId";// 默认租户id来源为: TenantId
    option.Mapping("TrueName", "RealName"); //新增身份信息`TrueName`, 并设置信息原来为: `RealName`
});
```