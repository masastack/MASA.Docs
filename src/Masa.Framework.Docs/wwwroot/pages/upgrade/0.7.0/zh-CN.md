## 0.7.0 升级指南

### 重构

* `全局异常`进行了重构, 框架原生支持了i18n, [用法可查看](../building-blocks/exceptions.md)
    * `Masa.Utils.Exceptions` -> `Masa.Contrib.Exceptions`

* 被用来管理`dapr sidecar`的`DaprStarter`重构, 它从`Utils`移到了`Contrib`, 并解决了与`MasaConfiguration`以及Caller一起使用时配置繁琐的问题
    * `Masa.Utils.Development.Dapr` -> `Masa.Contrib.Development.DaprStarter`
    * `Masa.Utils.Development.Dapr.AspNetCore` -> `Masa.Contrib.Development.DaprStarter.AspNetCore`

### 功能

* 新增加`i18n`支持, [用法可查看](../building-blocks/i18n.md)
* 新增加`RulesEngine`支持, [用法可查看](../building-blocks/rule-engine.md)
* 新增加`Masa.Contrib.Dispatcher.Events.FluentValidation`, 它提供了验证中间件`ValidatorMiddleware`