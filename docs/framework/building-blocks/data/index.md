---
title: 数据
date: 2022/07/01
---

## 概念

提供数据的规约以及分布式锁、序列化反序列化、Id生成器、数据并发冲突等能力

## 功能

* [分布式锁](/framework/building-blocks/data/distributed-lock): 提供分布式锁的能力

* [序列化/反序列化](/framework/building-blocks/data/serialization): 提供对象序列化和反序列化的能力、默认支持Json、Yaml

* [Id生成器](/framework/building-blocks/data/idgenerator): 提供id生成器、默认支持无序Guid生成器、有序Guid生成器、雪花id生成器

<!-- ## [数据并发冲突](/framework/building-blocks/data/concurrency)

提供乐观并发能力 -->

<!-- ## [类型转换](/framework/building-blocks/data/type-converts)

提供数据类型转换的能力 -->

* [对象映射](/framework/building-blocks/data/mapping): 提供对象映射的能力