---
title: 身份
date: 2022/07/26
---

用户身份信息我们从HttpContext.User中根据约定的`ClaimType`获取

## 安装

你可以打开一个命令行终端并输入以下命令来安装`Masa.Contrib.Identity`到你的项目中:

``` C#
Install-Package Masa.Contrib.IdentityModel
```

## 使用Identity

修改`Program.cs`

* 如果你的项目中使用了多租户和多环境

``` C#
builder.Services.AddMasaIdentityModel(IdentityType.MultiEnvironment | IdentityType.MultiTenant);
```

* 如果你的项目中使用了多租户

``` C#
builder.Services.AddMasaIdentityModel(IdentityType.MultiTenant);
```

* 如果你的项目中使用了多环境

``` C#
builder.Services.AddMasaIdentityModel(IdentityType.MultiEnvironment);
```

* 如果你的项目中未使用多租户和多环境

``` C#
builder.Services.AddMasaIdentityModel();
```

## 自定义CliaimType

默认用户信息以及对应的ClaimType如下:

|  信息   | ClaimType  |    |
| :----| :---- |:---- |
| UserId | [`ClaimTypes.NameIdentifier`](https://github.com/masastack/MASA.Contrib/blob/main/src/Identity/Masa.Contrib.Identity.IdentityModel/Const/ClaimType.cs) ||
| UserName | [`ClaimTypes.DEFAULT_USER_NAME`](https://github.com/masastack/MASA.Contrib/blob/main/src/Identity/Masa.Contrib.Identity.IdentityModel/Const/ClaimType.cs) ||
| Role | [`ClaimTypes.DEFAULT_USER_ROLE`](https://github.com/masastack/MASA.Contrib/blob/main/src/Identity/Masa.Contrib.Identity.IdentityModel/Const/ClaimType.cs) ||
| TenantId | [`ClaimTypes.DEFAULT_TENANT_ID`](https://github.com/masastack/MASA.Contrib/blob/main/src/Identity/Masa.Contrib.Identity.IdentityModel/Const/ClaimType.cs) ||
| Environment | [`ClaimTypes.DEFAULT_ENVIRONMENT`](https://github.com/masastack/MASA.Contrib/blob/main/src/Identity/Masa.Contrib.Identity.IdentityModel/Const/ClaimType.cs) ||


通过指定对应关系可以用来修改默认读取的ClaimType

``` C#
builder.Services.AddMasaIdentityModel(opt =>
{
    opt.UserId = "sub";
    opt.UserName = "name";
});
```

//todo: 待修改