---
title: 扩展 - 验证 - FluentValidation
date: 2022/12/09
---

## 概念

提供基于[`FluentValidation`](https://www.nuget.org/packages/FluentValidation)的参数验证扩展

扩展验证支持了`zh-CN`(中文简体)、`en-US` (英语(美国))、`en-GB` (英语(英国)) 的本地化验证支持

## 使用

* 必要条件: 安装`Masa.Utils.Extensions.Validations.FluentValidation`

``` powershell
dotnet add package Masa.Utils.Extensions.Validations.FluentValidation
```

如何使用

``` C#
public class RegisterUser
{
    public string Account { get; set; }

    public string Password { get; set; }
}

public class RegisterUserValidator : AbstractValidator<RegisterUser>
{
    public RegisterUserValidator()
    {
        RuleFor(user => user.Account).Letter()
    }
}
```

## 源码解读

