---
title: 调度器 - 跨进程事件
date: 2022/08/19
---

## 概念

跨进程事件总线允许发布和订阅跨服务传输的消息, 服务的发布与订阅不在同一个进程中, 在Masa Framework中, 跨进程总线事件提供了一个可以被开箱即用的程序, 它们由以下程序提供

* Masa.Contrib.Dispatcher.IntegrationEvents: 支持[发件箱模式](https://www.kamilgrzybek.com/design/the-outbox-pattern/), 但仅提供集成事件发布的抽象以及本地消息的抽象, 它们的实现由其它类库提供 
    * Masa.Contrib.Dispatcher.IntegrationEvents.Dapr: 借助[Dapr](https://docs.dapr.io/zh-hans/developing-applications/building-blocks/pubsub/pubsub-overview/)实现了集成事件发布
    * Masa.Contrib.Dispatcher.IntegrationEvents.EventLogs.EFCore: 提供了本地消息的实现, 是基于EFCore实现的集成事件日志的提供者

## 入门

目前MasaFramework仅提供了基于`Dapr`的集成事件的发布, 我们以`Dapr`为例, 看一下如何使用集成事件

1. 安装`Masa.Contrib.Dispatcher.IntegrationEvents`、`Masa.Contrib.Dispatcher.IntegrationEvents.Dapr`、`Masa.Contrib.Dispatcher.IntegrationEvents.EventLogs.EFCore`、`Masa.Contrib.Data.UoW.EFCore`、`Masa.Contrib.Data.EFCore.SqlServer`

``` Shell
dotnet add package Masa.Contrib.Dispatcher.IntegrationEvents //使用跨进程事件
dotnet add package Masa.Contrib.Dispatcher.IntegrationEvents.Dapr //使用dapr提供的pubsub能力
dotnet add package Masa.Contrib.Dispatcher.IntegrationEvents.EventLogs.EFCore //本地消息表
dotnet add package Masa.Contrib.Data.UoW.EFCore //工作单元
dotnet add package Masa.Contrib.Data.EFCore.SqlServer // SqlServer数据库
```

2. 修改`Program.cs`，注册`IntegrationEventBus`

```C#
builder.Services
    .AddIntegrationEventBus(options=>
    {
        options
            .UseDapr()//使用Dapr提供pub/sub能力，也可以自行选择其他的
            .UseEventLog<UserDbContext>()//使用基于EFCore的本地消息表
            .UseUoW<CatalogDbContext>(dbOptions => dbOptions.UseSqlServer("server=localhost;uid=sa;pwd=P@ssw0rd;database=identity"))//使用工作单元，并指定数据库链接字符串
    });
```

> CustomerDbContext 需要继承[`MasaDbContext`](/framework/contribs/data/orm/efcore), 数据库链接字符串部分代码可简化, 具体代码可[参考](/framework/contribs/data/orm/efcore)

3. 自定义类`DemoIntegrationEvent`, 并集成`IntegrationEvent`

```C#
public record DemoIntegrationEvent : IntegrationEvent
{
    public override string Topic { get; set; } = nameof(DemoIntegrationEvent);//topic name

    //todo 自定义属性参数
}
```

4. 自定义CustomDbContext

```C#
public class CustomDbContext : MasaDbContext
{
    public DbSet<User> Users { get; set; } = null!;

    public CustomDbContext(MasaDbContextOptions<CustomDbContext> options) : base(options)
    {

    }
}
```

5. 发送集成事件 (IntegrationEvent)

```C#
IIntegrationEventBus eventBus;//通过DI得到IIntegrationEventBus
var @event = new DemoIntegrationEvent();
await eventBus.PublishAsync(@event);//发送跨进程事件
```

## 配置

|  参数名   | 参数描述  | 默认值  | 
|  ----  | ----  | ----  |
| LocalRetryTimes  | 本地队列最大允许重试次数 | 3 |
| MaxRetryTimes  | 集成事件最大允许重试次数 | 10 |
| LocalFailedRetryInterval  | 本地队列重试间隔 | 3 秒 |
| FailedRetryInterval  | 重试间隔 (重试源: db) | 60 秒 |
| MinimumRetryInterval  | 最小重试间隔, 重试 **多久之前** 状态为失败或进行中的本地消息 | 60 秒 |
| RetryBatchSize  | 每次重试**多少条**状态为失败或进行中的本地消息 | 100 |
| CleaningLocalQueueExpireInterval  | 本地队列多久执行一次删除记录 (超过指定次数重试未成功的消息) | 60 秒 |
| CleaningExpireInterval  | Db多久执行一次删除记录 (状态为已发布且本地消息已过期) | 300 秒 |
| PublishedExpireTime  | 过期时间 (当状态为已发布, 且修改时间与当前时间间隔大于设置的过期时间后, 消息将会被删除, 数据源: db) | (24 * 3600) 秒 |
| DeleteBatchCount  | 批量删除过期的本地消息记录的最大条数, 数据源: db | 1000 |

例如, 最大重试次数改为5次, 则:

```C#
builder.Services
    .AddIntegrationEventBus(options=>
    { 
        options
            .UseDapr()//使用Dapr提供pub/sub能力，也可以选择其它实现
            .UseEventLog<UserDbContext>();

        options.MaxRetryTimes = 5;
    });
```

## 源码解读

重试分为本地队列重试以及从持久化数据源重试两种：

本地队列：

特点：
- 重试间隔短，支持秒级别重试间隔
- 从内存获取数据，速度更快
- 系统崩溃后，之前的本地队列不会重建，自动降级到持久化队列中重试任务

持久化数据源队列：

特点：

- 系统崩溃后，可以从db或者其他持久化源获取重试队列，确保事件100%重试
- 作为本地内存队列的降级方案，对db或者其他数据源压力更低

在单副本情况下，两种队列的任务仅会在单个队列中执行，不会存在两个队列同时执行的情况。
在多副本情况下，同一个任务可能会被多个副本所执行，虽然我们有做幂等，但为交付保证是 At Least Once，仍然有可能出现事件发布成功，但状态更改失败的情况，
此时事件可能会重发，我们建议任务执行者做好对跨事件的重试

> 目前还未支持标准化的Sub能力，暂时使用实现方原生的写法