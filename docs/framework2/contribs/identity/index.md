---
title: 身份
date: 2022/07/26
---

用户身份信息我们从HttpContext.User中根据约定的`ClaimType`获取

## 安装

你可以打开一个命令行终端并输入以下命令来安装`Masa.Contrib.Authentication.Identity`到你的项目中:

``` C#
Install-Package Masa.Contrib.Authentication.Identity
```

## 使用Identity

修改`Program.cs`

``` C#
builder.Services.AddMasaIdentityModel();
```

## 自定义CliaimType

默认用户信息以及对应的ClaimType如下:

|  信息   | ClaimType  |
| :----| :---- |
| UserId | [`ClaimTypes.NameIdentifier`](https://github.com/masastack/MASA.Framework/tree/docs/readme/src/Contrib/Authentication/Masa.Contrib.Authentication.Identity/Const/ClaimType.cs) |
| UserName | [`ClaimTypes.DEFAULT_USER_NAME`](https://github.com/masastack/MASA.Framework/tree/docs/readme/src/Contrib/Authentication/Masa.Contrib.Authentication.Identity/Const/ClaimType.cs) |
| Role | [`ClaimTypes.DEFAULT_USER_ROLE`](https://github.com/masastack/MASA.Framework/tree/docs/readme/src/Contrib/Authentication/Masa.Contrib.Authentication.Identity/Const/ClaimType.cs) |
| TenantId | [`ClaimTypes.DEFAULT_TENANT_ID`](https://github.com/masastack/MASA.Framework/tree/docs/readme/src/Contrib/Authentication/Masa.Contrib.Authentication.Identity/Const/ClaimType.cs) |
| Environment | [`ClaimTypes.DEFAULT_ENVIRONMENT`](https://github.com/masastack/MASA.Framework/tree/docs/readme/src/Contrib/Authentication/Masa.Contrib.Authentication.Identity/Const/ClaimType.cs) |


1. 通过指定对应关系可以用来修改默认读取的ClaimType

``` C#
builder.Services.AddMasaIdentityModel(opt =>
{
    opt.UserId = "sub";
    opt.UserName = "name";
});
```

2. 映射自定义用户模型以及对应的ClaimType

映射关系有两种方法可实现

1. 使用IdentityModel时指定映射关系

``` C#
builder.Services.AddMasaIdentityModel(opt =>
{
    opt.UserId = "sub";
    opt.UserName = "name";

    opt.Mapping(nameof(CustomizeUser.TrueName), "realname");
});

public class CustomizeUser : IIdentityUser
{
    public string Id { get; set; }

    public string? UserName { get; set; }

    public string? TrueName { get; set; }

    public IEnumerable<IdentityRole<string>> Roles { get; set; }
}
```

2. 通过Configure配置映射关系

``` C#
services.Configure<IdentityClaimOptions>(option =>
{
    opt.UserId = "sub";
    opt.UserName = "name";
    option.Mapping(nameof(CustomizeUser.TrueName), "realname");
});

builder.Services.AddMasaIdentityModel();
```

默认用户信息与ClaimType的映射关系如果不需要修改，可不配置对应属性即可

## 疑问？

1. A: 我们的项目Claim的value值不是通过Json序列化的，而是通过Yaml或者其它格式来序列化的，这样可能会导致我们的项目无法读取，请问如何解决？
   * Q: 以Yaml为例

        ``` C#
        var services = new ServiceCollection();
        services.AddYaml();
        services.AddMasaIdentityModel(DataType.Yml.ToString());
        ```