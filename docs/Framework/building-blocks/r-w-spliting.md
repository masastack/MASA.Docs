---
title: 读写分离
date: 2022/07/01
---

## 介绍

CQRS是一种与领域驱动设计和事件溯源相关的架构模式，它的全称是Command Query Responsibility Segregation，又叫命令查询职责分离，Greg Young在2010年创造了这个术语，它是基于Bertrand Meyer 的 CQS（Command-Query Separation 命令查询分离原则）设计模式。

CQRS认为不论业务多复杂在最终实现的时候，无非是读写操作，因此建议将应用程序分为两个方面，即Command（命令）和Query（查询）

<!-- more -->

* 命令端:

1. 非幂等
2. 关注各种业务如何处理，最后将数据更新写入并进行持久化
3. 不返回任何结果（void）

* 查询端: 

1. 幂等，仅仅是查询操作，并不会修改数据
2. 返回结果（通过查询条件对应返回数据，在数据没有发生变更的情况下针对相同的条件，返回的数据也应该是一致的，针对这种特性，我们可以通过数据缓存提高系统性能，提高系统的QPS (Queries Per Second意思是“每秒查询率”)

## 入门

1. 安装`Masa.Contrib.ReadWriteSplitting.Cqrs`

   ```C#
   Install-Package Masa.Contrib.ReadWriteSplitting.Cqrs
   ```

### Query：

1. 定义Query

   ```C#
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