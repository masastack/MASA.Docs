## 读写分离

什么是[CQRS](https://learn.microsoft.com/zh-cn/azure/architecture/patterns/cqrs)

![cqrs](https://s2.loli.net/2023/01/03/HpXOzyGev92iWAK.png)

[CQRS](https://learn.microsoft.com/zh-cn/azure/architecture/patterns/cqrs)是一种与领域驱动设计和事件溯源相关的架构模式, 它将事件 (Event) 划分为Command和Query, 在使用上仍然通过EventBus发布, 只是明确了写命令 (Command) 与读命令 (Query), 并限制读命令 (Query) 不能使用工作单元 (UoW)