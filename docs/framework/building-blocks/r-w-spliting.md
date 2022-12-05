---
title: 读写分离
date: 2022/07/01
---

## 介绍

什么是[CQRS](https://learn.microsoft.com/zh-cn/azure/architecture/patterns/cqrs)

![cqrs](/framework/cqrs.png)

## 功能列表

* [编排](/framework/contribs/dispatcher/event-bus)
* [中间件](/framework/contribs/dispatcher/event-bus)
* 工作单元

## 入门

1. 安装`Masa.Contrib.ReadWriteSplitting.Cqrs`

``` C#
dotnet add package Masa.Contrib.ReadWriteSplitting.Cqrs
```

### Query：

1. 定义Query

``` C#
public class CatalogItemQuery : Query<List<CatalogItem>>
{
    public string Name { get; set; } = default!;
    public override List<CatalogItem> Result { get; set; } = default!;
}
```

2. 定义QueryHandler

```C#
public class CatalogQueryHandler : QueryHandler<CatalogItemQuery, List<CatalogItem>>
{
    private readonly ICatalogItemRepository _catalogItemRepository;
    public CatalogQueryHandler(ICatalogItemRepository catalogItemRepository)
        => _catalogItemRepository = catalogItemRepository;
    public async Task HandleAsync(CatalogItemQuery query)
    {
        query.Result = await _catalogItemRepository.GetListAsync(query.Name);
    }
}
```

3. 发送Query

```c#
IEventBus eventBus;//通过DI得到IEventBus
await eventBus.PublishAsync(new CatalogItemQuery() { Name = "Rolex" });
```

> 提示：Query后的泛型与Result的返回类型保持一致，需要再Handler中为Result赋值，以便调用方得到结果

### Command

1. 定义 Command

```c#
public class CreateCatalogItemCommand : Command
{
    public string Name { get; set; } = default!;
    //todo
}
```

2. 添加 CommandHandler

```c#
public class CatalogCommandHandler : CommandHandler<CreateCatalogItemCommand>
{
    private readonly ICatalogItemRepository _catalogItemRepository;
    public CatalogCommandHandler(ICatalogItemRepository catalogItemRepository) => _catalogItemRepository =    catalogItemRepository;
    public async Task HandleAsync(CreateCatalogItemCommand command)
    {
        //todo
    }
}
```

3. 发送 Command

```C#
IEventBus eventBus;//通过DI得到IEventBus
await eventBus.PublishAsync(new CreateCatalogItemCommand());
```

## 原理剖析

[CQRS](https://learn.microsoft.com/zh-cn/azure/architecture/patterns/cqrs)是一种与领域驱动设计和事件溯源相关的架构模式, 它将事件 (`Event`) 划分为`Command`和`Query`, 在使用上仍然通过`EventBus`发布, 只是明确了`写命令` (Command) 与`读命令` (Query), 并限制`读命令` (Query) 不能使用`工作单元` (UoW)

## 参考

* [CQRS 模式](https://learn.microsoft.com/zh-cn/azure/architecture/patterns/cqrs)