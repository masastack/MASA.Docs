## 0.7.0 升级指南

### 重构

1.[全局异常](/framework/building-blocks/exception)进行了重构, 框架原生支持了[多语言](/framework/building-blocks/globalization/overview)

需要更换引用依赖包

* `Masa.Utils.Exceptions` -> `Masa.Contrib.Exceptions` 

2. DaprStarter重构, 优化与[MasaConfiguration](/framework/building-blocks/configuration/overview)、[服务调用](/framework/building-blocks/caller/overview)使用繁琐的问题

需要更换引用依赖包

* `Masa.Utils.Development.Dapr` -> `Masa.Contrib.Development.DaprStarter`
* `Masa.Utils.Development.Dapr.AspNetCore` -> `Masa.Contrib.Development.DaprStarter.AspNetCore`

3. 数据规约重构, 与EFCore解耦

需要更换引用依赖包

* `Masa.Contrib.Data.Contracts.EFCore`重构并更名为`Masa.Contrib.Data.Contracts`

### 功能

1. 新增加[多语言](/framework/building-blocks/globalization/overview)支持
2. 新增加[规则引擎](/framework/building-blocks/rule-engine)支持
3. 增加[基于FluentValidation的事件中间件](/framework/building-blocks/dispatcher/local-event#section-4e8b4ef69a8c8bc14e2d95f44ef6)