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

### 验证扩展支持

* Chinese: 中文验证
* Number: 数字验证
* Letter: 字母验证 (大小写均可)
* LowerLetter: 小写字母验证
* UpperLetter: 大写字母验证
* LetterNumber: 字母数字验证
* ChineseLetterUnderline: 中文字母下划线验证
* ChineseLetter： 中文字母验证
* ChineseLetterNumberUnderline: 中文字母数字下划线验证
* ChineseLetterNumber: 中文数字验证
* Phone: 手机号验证 (支持`zh-CN`、`en-US`、`en-GB`)
* IdCard: 身份证验证 (支持`zh-CN`)
* Url: Url地址验证
* Port: 端口验证
* Required: 必填验证 (与`NotEmpty`效果一致)

### 修改默认语言

GlobalValidationOptions.SetDefaultCulture("zh-CN");

针对`Phone`、`IdCard`等支持多语言的验证器, 其`culture`获取顺序为

指定`culture` -> (全局设置默认Culture) -> `CultureInfo.CurrentUICulture.Name`

### 本地化支持

更换默认验证器语言中的提示信息

``` C#
ValidatorOptions.Global.LanguageManager = new MasaLanguageManager();
```

> 如果未指定默认语言信息, 当使用`Masa提供的扩展验证, 并且未重新指定 LanguageManager, 将会导致获取到不正确的验证信息`