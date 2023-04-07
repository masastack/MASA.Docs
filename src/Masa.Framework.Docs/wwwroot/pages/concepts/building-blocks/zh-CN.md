# 构建块

提供非业务能力的接口，并提供组合多个能力形成新的能力

以下是`Framework`提供的构建块能力:

![能力](https://s2.loli.net/2022/12/30/zjD3RbHIuNkrQKW.png)

<div class="custom-table">

|  能力   | 说明  |    |
| :----| :---- |:---- |
| [MASA Stack SDK](/framework/building-blocks/stack-sdks)  | 为MASA Stack提供业务能力的Sdk ||
| [认证](/framework/building-blocks/authentication)  | 提供身份认证的能力 ||
| [身份](/framework/building-blocks/identity)  | 提供获取用户身份的能力 ||
| [配置](/framework/building-blocks/configuration)  | 强化IConfiguration的能力，提供本地配置以及远程配置的能力 ||
| [数据](/framework/building-blocks/data)  | 数据规约、数据映射、工作单元的能力 ||
| [领域驱动设计](/framework/building-blocks/ddd)  | 提供了基础设施的能力, 使得领域驱动设计更简单 ||
| [调度器](/framework/building-blocks/dispatcher)  | 提供事件总线及事件调度的能力 ||
| [绑定](/framework/building-blocks/bindings)  | 通过其他的方式触发或交互 ||
| [隔离性](/framework/building-blocks/isolation)  | 通过`物理隔离`、`逻辑隔离`提供数据的隔离性 ||
| [可观测性](/framework/building-blocks/observability)  | 查看和度量跨组件和网络服务的消息调用 ||
| [搜索引擎](/framework/building-blocks/SearchEngine)  | 提供更加友好的搜索 ||
| [服务](/framework/building-blocks/service)  | 提供服务的规约、服务的调用以及为MinimalAPI提供支持 ||
| [读写分离](/framework/building-blocks/r-w-spliting) | 提供基础读写分离所需的能力，使得读写分离更简单 ||
| [缓存](/framework/building-blocks/caching) | 提供内存缓存、分布式缓存以及分布式内存缓存能力 ||
| [存储](/framework/building-blocks/storage) | 对象存储的交互，可用于管理对象的上传、下载、删除等操作 ||
| [可测试性](/framework/building-blocks/testable) | 提供发现故障并隔离、定位故障的能力 ||
| [一致性](/framework/building-blocks/consistency)  | 通过saga实现最先最终一致性 ||
| [面向切面编程](/framework/building-blocks/aop)  | EventBus支持自定义Middleware来实现切面编程 ||
| [国际化](/framework/building-blocks/i18n) | 支持语言本地化和时间本地化 ||
| [规则引擎](/framework/building-blocks/rule-engine)  |  ||

</div>

<style>
td, th {
   border: none!important;
}
</style>