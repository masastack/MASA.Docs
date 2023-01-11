## 概念

什么是[领域驱动设计](https://blogs.masastack.com/2022/02/11/masa/framework/design/2.MASA%20Framework%20-%20DDD%E8%AE%BE%E8%AE%A1%EF%BC%881%EF%BC%89/)

[MasaFramework](https://github.com/masastack/MASA.Framework)框架提供了基础设施使得基于领域驱动设计的开发更容易实现, 通过`DDD`使得大家更聚焦于业务, 让开发人员和领域专家可以用统一的语言无障碍的沟通, 这极大的提升了沟通的效率. 但尽管如此, 落地并不顺畅, 因为`DDD`是一个方法论, 它并不是一套明确的行动指南, 每个行业都有自己的核心领域与通用子域、 支撑子域, 它与当前公司的业务有关, 因此`DDD` 告诉了我们每个领域的概念定义是什么, 让我们根据自己的真实情况去划分, 而没有直接告诉我们哪个是核心领域、哪个是通用子域、哪个是支撑子域

## 技术概念

在`DDD`中提出了很多技术概念和模式:

* [领域模型](/framework/building-blocks/ddd/domain-model)
* [值对象](/framework/building-blocks/ddd/value-model)
* [实体](/framework/building-blocks/ddd/entity)
* [聚合根](/framework/building-blocks/ddd/aggregate-root)
* [仓储](/framework/building-blocks/ddd/repository)
* [枚举类](/framework/building-blocks/ddd/enumeration)
* [领域服务](/framework/building-blocks/ddd/domain-service)
* [领域事件](/framework/building-blocks/ddd/domain-event)


## 其它

领域事件以及领域服务的能力由[`Masa.Contrib.Ddd.Domain`](https://www.nuget.org/packages/Masa.Contrib.Ddd.Domain)提供, 值对象、实体、聚合根的能力由[`Masa.BuildingBlocks.Ddd.Domain`](https://www.nuget.org/packages/Masa.BuildingBlocks.Ddd.Domain)提供, 仓储能力由[`Masa.Contrib.Ddd.Domain.Repository.EFCore`](https://www.nuget.org/packages/Masa.Contrib.Ddd.Domain.Repository.EFCore)提供, 工作单元的能力由[Masa.Contrib.Data.UoW.EFCore](https://www.nuget.org/packages/Masa.Contrib.Data.UoW.EFCore)提供, 但`Masa.Contrib.Ddd.Domain`继承了`Masa.BuildingBlocks.Ddd.Domain`的全部能力, 因而在项目中我们只需要安装[`Masa.Contrib.Ddd.Domain`](https://www.nuget.org/packages/Masa.Contrib.Ddd.Domain)、[Masa.Contrib.Ddd.Domain.Repository.EFCore](https://www.nuget.org/packages/Masa.Contrib.Ddd.Domain.Repository.EFCore)、[Masa.Contrib.Data.UoW.EFCore](https://www.nuget.org/packages/Masa.Contrib.Data.UoW.EFCore)即可

## 总结

`DDD`能否在公司落地不仅需要开发人员的努力, 更需要业务专家以及领导的认可, `DDD`旨在让领域专家与开发人员站在同一起跑线上, 通过统一语言让大家可以无障碍沟通, 解决当前公司遇到的问题, 通过`DDD`使得业务逻辑集中在领域层而非散落在项目各地, 它将有利于之后的项目升级迭代, 避免出现无人敢动的屎山