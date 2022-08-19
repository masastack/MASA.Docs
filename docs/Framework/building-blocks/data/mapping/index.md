---
title: 数据 - 对象映射
date: 2022/07/01
---

## 介绍

提供对象映射的能力

目前对象映射的提供者有:

* [Mapster](/framework/contribs/data/mapping/mapster)

## 扩展

为了Mapping使用更方便，可以在任何地方快速映射使用，`BuildingBlocks`提供了`Mapping`的扩展库`Masa.BuildingBlocks.Data.MappingExtensions`，针对`Object`类型的参数做了扩展

#### 入门

1. 安装`Masa.BuildingBlocks.Data.MappingExtensions`

``` shell
Install-Package Masa.BuildingBlocks.Data.MappingExtensions
```

2. 使用映射

``` C#
var request = new CreateUserRequest()
{
    Name = "Jim",
};
var user = request.Map<CreateUserRequest, User>();

public class CreateUserRequest
{
    public string Name { get; set; } = default!;
}

public class User
{
    public string Name { get; set; }
}
```

> `Map`自动映射与对象映射的提供者并没有强绑定关系，项目中注入哪一个提供者，那映射方法就会使用哪一个提供者的映射方法。

> 更多细节逐步完善中……