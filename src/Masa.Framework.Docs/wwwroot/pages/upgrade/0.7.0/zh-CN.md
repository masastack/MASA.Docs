## 0.7.0 升级指南

### 重构

* `全局异常`进行了重构, 框架原生支持了i18n, [用法可查看](/framework/building-blocks/exception)
    * `Masa.Utils.Exceptions` -> `Masa.Contrib.Exceptions`

* 被用来管理`dapr sidecar`的`DaprStarter`重构, 它从`Utils`移到了`Contrib`, 并解决了与`MasaConfiguration`以及Caller一起使用时配置繁琐的问题
    * `Masa.Utils.Development.Dapr` -> `Masa.Contrib.Development.DaprStarter`
    * `Masa.Utils.Development.Dapr.AspNetCore` -> `Masa.Contrib.Development.DaprStarter.AspNetCore`

* `Masa.Contrib.Data.Contracts.EFCore`重构并更名为`Masa.Contrib.Data.Contracts`

### 功能

* 新增加`i18n`支持, [用法可查看](/framework/building-blocks/globalization/i18n)
* 新增加`RulesEngine`支持, [用法可查看](/framework/building-blocks/rule-engine)
* 新增加`Masa.Contrib.Dispatcher.Events.FluentValidation`, 它提供了验证中间件`ValidatorMiddleware`