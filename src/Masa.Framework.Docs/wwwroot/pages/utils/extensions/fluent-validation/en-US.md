# Extension - FluentValidation Validation

## Overview

This provides an extension for parameter validation based on [`FluentValidation`](https://www.nuget.org/packages/FluentValidation).

The extension supports localized validation for `zh-CN` (Simplified Chinese), `en-US` (English (United States)), and `en-GB` (English (United Kingdom)).

## Usage

1. Install `Masa.Utils.Extensions.Validations.FluentValidation`

   ```shell terminal
   dotnet add package Masa.Utils.Extensions.Validations.FluentValidation
   ```

2. How to use

   ```csharp
   public class RegisterUser
   {
       public string Account { get; set; }
   
       public string Password { get; set; }
   }
   
   public class RegisterUserValidator : MasaAbstractValidator<RegisterUser>
   {
       public RegisterUserValidator()
       {
           RuleFor(user => user.Account).Letter();
           
           // Example of calling WhenNotEmpty
           //_ = WhenNotEmpty(r => r.Phone, r => r.Phone, new PhoneValidator<RegisterUser>());
           //_ = WhenNotEmpty(r => r.Phone, new PhoneValidator<RegisterUser>());
       }
   }
   ```代码解读

这段代码是一个使用 FluentValidation 库进行验证的示例。该库提供了许多验证扩展支持，包括中文、数字、字母、手机号、身份证等常见验证规则。

在这段代码中，我们可以看到一个 `RegisterUserValidator` 类，它继承自 `AbstractValidator<RegisterUser>`，并在构造函数中定义了一些验证规则。例如，我们可以看到 `RuleFor` 方法用于定义一个规则，该规则指定了 `RegisterUser` 类中的 `Email` 属性必须是一个有效的电子邮件地址。

此外，我们还可以看到 `Phone` 方法用于验证手机号码。该方法支持多种国家的手机号码验证规则，包括中国、美国和英国。这些规则是通过正则表达式实现的。

总的来说，FluentValidation 库提供了一种简单而强大的方式来验证对象的属性。通过使用这个库，我们可以轻松地定义和组合验证规则，以确保我们的数据是有效和安全的。URL Address Validation
* Port: Port Validation
* Required: Required Validation (equivalent to `NotEmpty`)

### MasaAbstractValidator&lt;T&gt; Base Class

Provides the `WhenNotEmpty` method, which only enters validation when the given property value is not empty (`NULL/Empty`/empty collection/default value).

```csharp
// Example of calling WhenNotEmpty
//_ = WhenNotEmpty(r => r.Phone, r => r.Phone, new PhoneValidator<RegisterUser>());
//_ = WhenNotEmpty(r => r.Phone, new PhoneValidator<RegisterUser>());
//_ = WhenNotEmpty(r => r.Phone, r => r.Phone, rule => rule.Phone());
//_ = WhenNotEmpty(r => r.Phone, rule => rule.Phone());
```

> All methods of the base class are `Virtual`, and users can override them as needed.

### Modifying the Default Language

`GlobalValidationOptions.SetDefaultCulture("zh-CN");`

For validators that support multiple languages, such as `Phone` and `IdCard`, the `culture` acquisition order is:

Specified `culture` -> (global default culture setting) -> `CultureInfo.CurrentUICulture.Name`

Using the `IdCard` validator as an example:

The static extension method `IdCard<T>(string? culture = null)` accepts an optional `culture` parameter.

1. If the `culture` parameter is passed as `zh-CN` (**case-insensitive**), the validator will call the corresponding validator for that `culture`.1. To perform validation, the method uses the implementation of `Masa.Framework.Identity.Validation.ChinaIdCardProvider`.
2. If the `culture` parameter is not passed in, the method reads `GlobalValidationOptions.DefaultCulture`, which can be set using the `GlobalValidationOptions.SetDefaultCulture(string culture)` method.
3. If the project has not called `GlobalValidationOptions.SetDefaultCulture` to set the default culture, `GlobalValidationOptions.DefaultCulture` will get the value of `System.Globalization.CultureInfo.CurrentUICulture.Name`.
4. If an unsupported `culture` is obtained, an exception `NotSupportedException` will be thrown during validation.

> `IdCard` currently provides validators that support `zh-CN`.
> `Phone` currently provides validators that support `zh-CN`, `en-US`, and `en-GB`.
> The `culture` set here is not related to [internationalization](/framework/building-blocks/globalization/overview).

### Localization Support

Changing the prompt messages in the default validator language

```csharp
ValidatorOptions.Global.LanguageManager = new MasaLanguageManager();
```

> When you use the extended validators provided by the `MASA Framework`, if the default language information is not specified and the `LanguageManager` is not re-specified, you will get **incorrect validation information**.