## 概述

`MASA Framework`是一个基于`.Net6.0`的后端框架, 可以被用于开发Web应用程序、WPF项目、控制台项目, 在结构上被分为三个部分:

* BuildingBlocks: 提供接口标准和串接不同构建块能力，降低耦合的同时保证主线逻辑
* Contrib: 基于构建块的接口标准提供最佳实践的实现，可以被替换
* Utils: 通用类库, 提供底层通用能力, 可被`BuildingBlocks`和`Contrib`所使用

## 推荐

我们建议大家优先查看以下文档, 它们可以帮助我们更好的理解后续文档中出现的一些知识

* [编码风格与统一配置](/framework/contribution/recommend)

## 入门教程

* [Web应用程序](/framework/getting-started/web-project/overview)

## 其它

当前文档适用于`1.0.0-preview.2`, 请确保`Masa.XXX.XXX`包安装统一版本, 后续文档将不再特殊注明包的版本信息