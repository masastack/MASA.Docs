# Data Mapping（数据映射） - 概念

提供对象映射的能力，通过添加提供者的引用并注册，即可轻松完成对象映射的能力

## 最佳实践

* [Mapster](/framework/building-blocks/data-mapping/mapster): 基于 [Mapster](https://github.com/MapsterMapper/Mapster) 的扩展，轻松完成对象映射的能力

## 源码解读

提供了映射的抽象 `IMapper`，它支持：

* Map\<TSource, TDestination\>(TSource source, MapOptions? options = null)：根据源类型以及目标类型将源类型对象映射为目标类型并返回

* Map\<TDestination\>(object source, MapOptions? options = null)：根据目标类型将源类型对象转换为目标类型并返回

* Map\<TSource, TDestination\>(TSource source, TDestination destination, MapOptions? options = null)：将源类型映射为目标类型并返回，在映射过程中，仅映射符合映射的参数信息，属于目标类型独有的参数将不会被重新初始化
