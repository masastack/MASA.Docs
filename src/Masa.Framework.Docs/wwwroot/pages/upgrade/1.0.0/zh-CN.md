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