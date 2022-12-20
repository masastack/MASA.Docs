---
title: 数据 - 对象映射
date: 2022/12/20
---

## 概念

提供对象映射的能力, 通过添加提供者的引用并注册, 即可轻松完成对象映射的能力

目前对象映射的提供者有:

* [Masa.Contrib.Data.Mapping.Mapster](https://www.nuget.org/packages/Masa.Contrib.Data.Mapping.Mapster): 基于[Mapster](https://github.com/MapsterMapper/Mapster)的扩展, 轻松完成对象映射的能力 [查看详细](/framework/contribs/data/mapping/mapster)

## 使用

以[Mapster](/framework/contribs/data/mapping/mapster)的提供者为例

1. 安装`Masa.Contrib.Data.Mapping.Mapster`

``` powershell
dotnet add package Masa.Contrib.Data.Mapping.Mapster
```

2. 注册`Mapster`的映射器

``` C#
builder.Services.AddMapster();
``` 

3. 映射对象

``` C#
public void Main()
{
    var request = new
    {
        Name = "masastack",
        TotalPrice = 10
    };
    IMapper mapper;// 通过DI获取
    var order = mapper.Map<Order>(request);// 将request映射到新的对象
}

public class Order
{
    public string Name { get; set; }

    public decimal TotalPrice { get; set; }
}
```

## 高级

通过`IMapper`我们可以很简单的完成对象映射, 但是使用它必须要先获取到`IMapper`, 而它需要通过DI获取, 这样就使得我们在某些地方使用起来变得复杂, 为了解决这一问题, 我们针对`Object`类型做了方法扩展

1. 安装`Masa.BuildingBlocks.Data.MappingExtensions`

``` powershell
dotnet add package Masa.BuildingBlocks.Data.MappingExtensions
```

2. 注册`Mapster`的映射器

``` C#
builder.Services.AddMapster();
``` 

3. 使用映射

``` C#
public void Main()
{
    var request = new
    {
        Name = "masastack",
        TotalPrice = 10
    };
    var order = request.Map<Order>();// 将request映射到新的对象
}

public class Order
{
    public string Name { get; set; }

    public decimal TotalPrice { get; set; }
}
```

> `Object`类型的方法扩展与对象映射的提供者并没有强绑定关系，项目中注入哪一个提供者，那映射方法就会使用哪一个提供者的映射方法

## 源码解读

提供了映射的抽象`IMapper`, 它支持:

* Map\<TSource, TDestination\>(TSource source, MapOptions? options = null): 根据源类型以及目标类型将源类型对象映射为目标类型并返回
* Map\<TDestination\>(object source, MapOptions? options = null): 根据目标类型将源类型对象转换为目标类型并返回
* Map\<TSource, TDestination\>(TSource source, TDestination destination, MapOptions? options = null): 将源类型映射为目标类型并返回, 在映射过程中, 仅映射符合映射的参数信息, 属于目标类型独有的参数将不会被重新初始化

``` C#
public void Main()
{
    var request = new
    {
        Name = "Jim",
        Age = 18
    };
    var user = new User()
    {
        Name = "Time"
        Description = "Description",
    };
    var newUser = request.Map(user);//使用Mapping扩展
    Assert.IsNotNull(newUser);
    Assert.IsTrue(newUser.Description == "Description");
    Assert.IsTrue(newUser.Name == "Jim");
}

public class User
{
    public string Name { get; set; }

    public string Description { get; set; }
}
``` 