## 1.0.0 升级指南

### 破坏性修改
在 1.0.0 中我们对项目中的一些类名称进行了调整，调整规则如下：

* `Middleware` -> `EventMiddleware`：为减少学习成本, 避免事件总线提供的中间件与微软提供的中间件名称冲突而造成更大的学习成本,所以我们在原名称基础上加上Event。其中受影响的接口以及类为：
	* `Masa.BuildingBlocks.Dispatcher.Events`
		* `IMiddleware<in TEvent>` → `IEventMiddleware<in TEvent>`
		* `Middleware<in TEvent>` → `EventMiddleware<in TEvent>`
	* `Masa.Contrib.Dispatcher.Events.FluentValidation`
		* `ValidatorMiddleware<TEvent> ` → `ValidatorEventMiddleware<TEvent> `
	* `Masa.Contrib.Dispatcher.Events`
		* `TransactionMiddleware<TEvent>` → `TransactionEventMiddleware<TEvent>`
	* `Masa.Contrib.Isolation`
		* `IsolationMiddleware<TEvent>` → `IsolationEventMiddleware<TEvent>`


正在完善中……