## 1.0.0 升级指南

为避免歧义, 减少学习成本, 在1.0.0中我们对项目中的一些接口/类名进行了重命名调整, 这导致出现一些破坏性修改

### 破坏性修改

1. `Middleware` -> `EventMiddleware`

由于事件总线提供的中间件与微软提供的中间件名称冲突, 我们在原名名基础上增加Event。其中受影响的接口以及类为：

* `Masa.BuildingBlocks.Dispatcher.Events`
  * `IMiddleware<in TEvent>` → `IEventMiddleware<in TEvent>`
  * `Middleware<in TEvent>` → `EventMiddleware<in TEvent>`
* `Masa.Contrib.Dispatcher.Events.FluentValidation`
  * `ValidatorMiddleware<TEvent> ` → `ValidatorEventMiddleware<TEvent> `
* `Masa.Contrib.Dispatcher.Events`
  * `TransactionMiddleware<TEvent>` → `TransactionEventMiddleware<TEvent>`
* `Masa.Contrib.Isolation`
  * `IsolationMiddleware<TEvent>` → `IsolationEventMiddleware<TEvent>`

1. `Masa.Utils.Extensions.Validations.FluentValidation`内的所有验证器都修改为Null值不再进行校验，直接返回true。[PR #485](https://github.com/masastack/MASA.Framework/pull/485)

    Masa定义的Validator默认逻辑与FluentValidation官方的内置Validator逻辑不一致，为了保持一致，所有Validator默认情况下都不对Null值进行校验

    受影响的`PhoneValidator`、`IdCardValidator`。
      
    在升级1.0.0之后，如果是必填的字段，需要在链式上加入`NotNull`校验，以保证对Null值的校验

    * 如`RuleFor(staff => staff.PhoneNumber).Phone();`需要修改为 `RuleFor(staff => staff.PhoneNumber).NotNull().Phone();`。
    * 如`RuleFor(staff => staff.IdCard).IdCard();`需要修改为 `RuleFor(staff => staff.IdCard).NotNull().IdCard();`。

2. `Masa.Utils.Extensions.Validations.FluentValidation`预定义的正则表达式修改，不再允许空字符串通过校验。

    受影响的正则表达式(`Masa.Utils.Extensions.Validations.FluentValidation.RegularHelper`)

    * CHINESE
    * NUMBER
    * LETTER
    * IDENTIFY
    * LOWER_LETTER
    * UPPER_LETTER
    * LETTER_NUMBER
    * CHINESE_LETTER_NUMBER
    * CHINESE_LETTER
    * CHINESE_LETTER_NUMBER_UNDERLINE
    * CHINESE_LETTER_UNDERLINE
    * IDCARD
    * URL
    * EMAIL
    * PASSWORD_REGULAR
    * PORT

    受影响的验证器扩展(`FluentValidation.FluentValidationExtensions`)

    * Chinese
    * Number
    * Letter
    * Identity
    * LowerLetter
    * UpperLetter
    * LetterNumber
    * ChineseLetterNumber
    * ChineseLetter
    * ChineseLetterNumberUnderline
    * ChineseLetterUnderline
    * Url
    * Email
    * Password （默认密码验证器）
    * Port

### 功能

1. 新增抽象类`Masa.Utils.Extensions.Validations.FluentValidation.MasaAbstractValidator<T>`，提供`WhenNotEmpty`方法

   为了支持业务系统的可选值的校验，新增了抽象类`MasaAbstractValidator<T>`，提供`WhenNotEmpty`扩展方法，方便用户对一些可选的验证进行处理。

   举例: 如果只在当`Phone`有值的时候进行校验，可以按以下的方式进行调用

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
            // 以前的调用方式
            //When(r => !string.IsNullOrEmpty(r.Phone), () => RuleFor(r => r.Phone).Phone());

            // WhenNotEmpty 的调用示例,任选一种
            //_ = WhenNotEmpty(r => r.Phone, r => r.Phone, new PhoneValidator<RegisterUser>());
            //_ = WhenNotEmpty(r => r.Phone, new PhoneValidator<RegisterUser>());
            //_ = WhenNotEmpty(r => r.Phone, r => r.Phone, rule => rule.Phone());
            _ = WhenNotEmpty(r => r.Phone, rule => rule.Phone());
        }
    }
    ```
