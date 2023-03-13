## 读写分离

什么是[CQRS](https://learn.microsoft.com/zh-cn/azure/architecture/patterns/cqrs)

![cqrs](https://s2.loli.net/2023/01/03/HpXOzyGev92iWAK.png)

[CQRS](https://learn.microsoft.com/zh-cn/azure/architecture/patterns/cqrs)是一种与领域驱动设计和事件溯源相关的架构模式, 它将事件 (Event) 划分为 命令端 (Command) 和 查询端 (Query)

* 命令端:
    * 关注各种业务如何处理, 更新状态进行持久化
    * 不返回任何结果 (void)
* 查询端:
    * 仅做查询操作

> 命令端、查询端本质上属于事件, 因此使用上与事件一致