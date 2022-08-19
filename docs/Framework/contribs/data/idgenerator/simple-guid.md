---
title: 数据 - id生成器 - 无序id生成器
date: 2022/08/19
---

## 介绍

提供无序id的能力，仅支持`Guid`类型

## 入门

1. 安装`Masa.Contrib.Data.IdGenerator.NormalGuid`

``` shell
dotnet add package Masa.Contrib.Data.IdGenerator.NormalGuid
```

2. 修改类`Program`，注册无序id生成器

``` C#
builder.Services.AddSimpleGuidGenerator();
```

3. 获取id

``` C#
IGuidGenerator generator;// 通过DI获取，或者通过IdGeneratorFactory.GuidGenerator获取
generator.NewId();//创建唯一id
```