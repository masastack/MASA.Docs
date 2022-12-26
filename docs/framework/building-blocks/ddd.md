---
title: 领域驱动设计
date: 2022/07/23
---

## 概念

什么是[领域驱动设计](https://blogs.masastack.com/2022/02/11/masa/framework/design/2.MASA%20Framework%20-%20DDD%E8%AE%BE%E8%AE%A1%EF%BC%881%EF%BC%89/)

[MasaFramework](https://github.com/masastack/MASA.Framework)框架提供了基础设施使得基于领域驱动设计的开发更容易实现, 但它并不能教会你什么是`DDD`, `DDD`能否在公司落地不仅需要开发人员的努力, 更需要业务专家以及领导的认可, 它需要公司全体人员的努力

## 功能列表

* [领域模型](#领域模型)
* [领域事件 (DomainEvent)](#领域事件)
* [值对象 (ValueObject)](#值对象)
* [仓储 (Repository)](#仓库)
* [枚举类 (Enumeration)](#枚举类)
* [领域服务 (IDomainService)](#领域服务)
* [工作单元 (IUnitOfWork)](#工作单元)

## 使用



## 技术类名词

* <a id = "领域模型">领域模型</a>

提供了需要用到的`聚合根基类 (AggregateRoot)`、`实体基类 (Entity)`、`支持审计的聚合根基类 (AuditAggregateRoot)`、`支持审计的聚合根实体基类 (AuditEntity)`、`支持软删除和审计的聚合根基类 (FullAggregateRoot)`、`支持软删除和审计的实体基类 (FullEntity)`

其中未指定主键类型的实体需要通过重写`GetKeys`方法来指定主键, 聚合根支持添加领域事件 (并在EventBus的Handler执行完成后执行)

* <a id = "领域事件">领域事件 (DomainEvent)</a>

根据事件类型又可以分为本地事件 (`DomainEvent`)、集成事件 (`IntegrationDomainEvent`), 而本地事件根据读写性质不同划分为`DomainCommand`、`DomainQuery`

* <a id = "值对象">值对象 (ValueObject)</a>

没有唯一标识, 任何属性的变化都将视为新的值对象

在项目开发中, 我们可以通过模型映射将值对象映射存储到单独的表中, 也可以映射为一个json字符串存储又或者根据属性拆分为多列使用, 这些都是可以的, 但无论数据是以什么方式存储, 它们是值对象这点不会改变, 因此我们不能错误的理解为在数据库中的表一定是实体或者聚合根, 这种想法是错误的

* <a id = "仓储">仓储 (Repository)</a>

屏蔽业务逻辑和持久化基础设施的差异, 针对不同的存储设施, 会有不同的实现方式, 但这些不会对我们的业务产生影响, 它是领域驱动设计的一部分, 我们仅会提供针对`聚合根`做简单的增删改查操作, 而并非针对`单个表`

> 由于一些特殊的原因, 我们解除了对非聚合根的限制, 使得它们也可以使用`IRepository`, 但这个是错误的, 后续版本仍然会增加限制, 届时`IRepository`将只允许对聚合根进行操作

* <a id = "枚举类">枚举类 (Enumeration)</a>

提供枚举类基类, 使用枚举类来代替使用枚举, [查看原因](https://learn.microsoft.com/zh-cn/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/enumeration-classes-over-enum-types)

* <a id = "领域服务">领域服务 (IDomainService)</a>

是领域模型的操作者, 被用来处理业务逻辑, 它是无状态的, 状态由领域对象来保存, 提供面向应用层的服务, 完成封装领域知识, 供应用层使用。与应用服务不同的是, 应用服务仅负责编排和转发, 它将要实现的功能委托给一个或多个领域对象来实现, 它本身只负责处理业务用例的执行顺序以及结果的拼装, 在应用服务中不应该包含业务逻辑

继承`IDomainService`的类被标记为领域服务, 领域服务支持从DI获取, 其中提供了`EventBus` (用于提供发送领域事件)

* <a id = "工作单元">工作单元 (IUnitOfWork)</a>

实现仓储对象的持久化, 通过工作单元实现原子性, 要么全部成功， 要么全部失败

## 参考文献

* [MASA Framework - DDD设计(1)](https://blogs.masastack.com/2022/02/11/masa/framework/design/2.MASA%20Framework%20-%20DDD%E8%AE%BE%E8%AE%A1%EF%BC%881%EF%BC%89/)
* [MASA Framework - DDD设计(2)](https://blogs.masastack.com/2022/02/12/masa/framework/design/3.MASA%20Framework%20-%20DDD%E8%AE%BE%E8%AE%A1%EF%BC%882%EF%BC%89/)
* [DDD 概念参考](https://domain-driven-design.org/zh/ddd-concept-reference.html)
* [DAO与Repository有什么区别](https://stackoverflow.com/questions/8550124/what-is-the-difference-between-dao-and-repository-patterns)