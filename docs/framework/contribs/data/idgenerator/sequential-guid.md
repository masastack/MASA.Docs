---
title: 数据 - id生成器 - 有序id生成器
date: 2022/08/19
---

## 介绍

提供有序id的能力，仅支持`Guid`类型

## 入门

1. 安装`Masa.Contrib.Data.IdGenerator.SequentialGuid`

``` powershell
dotnet add package Masa.Contrib.Data.IdGenerator.SequentialGuid
```

2. 修改类`Program`，注册有序id生成器

``` C#
builder.Services.AddSequentialGuidGenerator();
```

3. 获取id

``` C#
ISequentialGuidGenerator generator;// 通过DI获取，或者通过IdGeneratorFactory.SequentialGuidGenerator获取
generator.NewId();//创建唯一id
```