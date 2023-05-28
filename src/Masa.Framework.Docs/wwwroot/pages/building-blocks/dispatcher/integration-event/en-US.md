her.IntegrationEvents.Dapr
   dotnet add package Masa.UnitOfWork.SqlServer
   ```

2. 在 `appsettings.json` 中配置 `Dapr` 的 `pubsub` 组件

   ```json
   {
     "Dapr": {
       "Components": {
         "pubsub": {
           "Default": "dapr.redis",
           "Publish": {
             "dapr.redis": {
               "ConnectionString": "localhost:6379"
             }
           },
           "Subscribe": {
             "dapr.redis": {
               "ConnectionString": "localhost:6379"
             }
           }
         }
       }
     }
   }
   ```

3. 创建一个集成事件

   ```csharp
   public class OrderCreatedIntegrationEvent : IntegrationEvent
   {
       public int OrderId { get; set; }
       public string CustomerName { get; set; }
   }
   ```

4. 在需要发布事件的地方，注入 `IIntegrationEventDispatcher` 接口，调用 `PublishAsync` 方法发布事件

   ```csharp
   public class OrderService
   {
       private readonly IIntegrationEventDispatcher _eventDispatcher;

       public OrderService(IIntegrationEventDispatcher eventDispatcher)
       {
           _eventDispatcher = eventDispatcher;
       }

       public async Task CreateOrderAsync(Order order)
       {
           // 创建订单逻辑
           // ...

           // 发布事件
           var integrationEvent = new OrderCreatedIntegrationEvent
           {
               OrderId = order.Id,
               CustomerName = order.CustomerName
           };
           await _eventDispatcher.PublishAsync(integrationEvent);
       }
   }
   ```

5. 在订阅事件的服务中，注入 `IIntegrationEventHandler<T>` 接口，实现 `HandleAsync` 方法处理事件

   ```csharp
   public class OrderCreatedIntegrationEventHandler : IIntegrationEventHandler<OrderCreatedIntegrationEvent>
   {
       private readonly ILogger<OrderCreatedIntegrationEventHandler> _logger;

       public OrderCreatedIntegrationEventHandler(ILogger<OrderCreatedIntegrationEventHandler> logger)
       {
           _logger = logger;
       }

       public async Task HandleAsync(OrderCreatedIntegrationEvent @event)
       {
           // 处理事件逻辑
           // ...
           
           _logger.LogInformation($"Order created: {JsonSerializer.Serialize(@event)}");
       }
   }
   ```

以上就是使用集成事件的基本流程，通过 `Dapr` 实现了跨服务的消息传输。To use the provided dispatch mailbox pattern for integration events, add the following packages: `Masa.Contrib.Dispatcher.IntegrationEvents.Dapr` for using Dapr's pubsub capability, `Masa.Contrib.Dispatcher.IntegrationEvents.EventLogs.EFCore` for local message table, `Masa.Contrib.Data.UoW.EFCore` for unit of work, and `Masa.Contrib.Data.EFCore.SqlServer` for SqlServer database.

To register `MasaDbContext`, you can add the following code in `Program.cs`:

```csharp
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddMasaDbContext<CustomDbContext>(dbContextBuilder =>
{
    dbContextBuilder.UseSqlite("server=localhost;uid=sa;pwd=P@ssw0rd;database=catalog");
});
```

And here is an example of `CustomDbContext`:

```csharp
public class CustomDbContext : MasaDbContext<CustomDbContext>
{
    // ...
}
```到 IEventBus 实例

   await eventBus.PublishAsync(new DemoIntegrationEvent
   {
       //todo 设置自定义属性值
   });
   ```

6. 处理集成事件

   ```csharp
   public class DemoIntegrationEventHandler : IIntegrationEventHandler<DemoIntegrationEvent>
   {
       private readonly ILogger<DemoIntegrationEventHandler> _logger;
   
       public DemoIntegrationEventHandler(ILogger<DemoIntegrationEventHandler> logger)
       {
           _logger = logger;
       }
   
       public async Task HandleAsync(DemoIntegrationEvent @event)
       {
           //todo 处理集成事件
           _logger.LogInformation($"Received integration event: {@event}");
       }
   }
   ```

7. 注册集成事件处理程序

   ```csharp Program.cs
   builder.Services
       .AddIntegrationEventBus(options=>
       {
           options
               .UseDapr()
               .UseEventLog<CustomDbContext>()
               .UseUoW<CustomDbContext>()
               .AddIntegrationEventHandler<DemoIntegrationEventHandler>()//注册集成事件处理程序
       });
   ```

以上就是使用 Dapr 和 EF Core 实现集成事件的基本步骤，希望对你有所帮助。To IEventBus:

var @event = new DemoIntegrationEvent();
await eventBus.PublishAsync(@event); // Send integration event

## Configuration

| Parameter Name | Parameter Description | Default Value |
| ---- | ---- | ---- |
| LocalRetryTimes | Maximum number of retries allowed for publishing events (local queue tasks) | 3 |
| MaxRetryTimes | Maximum number of retries allowed for publishing events (persistent queue tasks) | 10 |
| LocalFailedRetryInterval | Retry interval (local queue) | 3 seconds |
| FailedRetryInterval | Retry interval (persistent queue) | 60 seconds |
| MinimumRetryInterval | Minimum retry interval, retry local messages with a status of failed or in progress **before** this time (persistent queue) | 60 seconds |
| RetryBatchSize | Number of local messages with a status of failed or in progress to retry each time (persistent queue) | 100 |
| CleaningLocalQueueExpireInterval | Event interval for executing tasks to delete expired messages (local queue) | 60 seconds |
| CleaningExpireInterval | Time interval for executing tasks to delete expired messages (persistent queue) | 300 seconds |
| PublishedExpireTime | Expiration time for successfully published messages (when the status is published and the time difference between the modification time and the current time is greater than the set expiration time, the message will be deleted, persistent queue) | (24 * 3600) seconds |
| DeleteBatchCount | Maximum number of expired local message records to delete in batches (persistent queue) | 1000 |

For example, if the maximum number of retries is changed to 5:

```csharp
builder.Services
    .AddIntegrationEventBus(options =>
    {
        options.LocalRetryTimes = 3;
        options.MaxRetryTimes = 5; // Change the maximum number of retries to 5
        options.LocalFailedRetryInterval = TimeSpan.FromSeconds(3);
        options.FailedRetryInterval = TimeSpan.FromSeconds(60);
        options.MinimumRetryInterval = TimeSpan.FromSeconds(60);
        options.RetryBatchSize = 100;
        options.CleaningLocalQueueExpireInterval = TimeSpan.FromSeconds(60);
        options.CleaningExpireInterval = TimeSpan.FromSeconds(300);
        options.PublishedExpireTime = TimeSpan.FromSeconds(24 * 3600);
        options.DeleteBatchCount = 1000;
    });
```s=>
    { 
        options
            .UseDapr() // Use Dapr to provide pub/sub capability, other implementations can also be chosen.
            .UseEventLog<UserDbContext>(); // Use event log of UserDbContext.

        options.MaxRetryTimes = 5; // Set the maximum retry times to 5.
    });

## Source Code Interpretation

First, we need to know some basic knowledge:

* IIntegrationEvent: Integration event interface, inherits from IEvent (local event interface), ITopic (subscription interface, topic for publish/subscribe), ITransaction (transaction interface).
* IIntegrationEventBus: Integration event bus interface, used to provide the function of sending integration events.
* IIntegrationEventLogService: Integration event log service interface (provides functions such as saving local logs, modifying status to in progress, success, failure, deleting expired logs, and getting waiting retry log lists).
* IntegrationEventLog: Integration event log, provides the model of the local message table.
* IHasConcurrencyStamp: Concurrency stamp interface (classes that implement this interface will automatically assign a value to RowVersion).

### Masa.Contrib.Dispatcher.IntegrationEvents

It provides implementation classes for integration event interfaces and supports the outbox pattern, including:

* IPublisher: Sender of integration events.
* IProcessingServer: Background service interface.
* IProcessor: Processor interface (all program implementations will be obtained and executed in the background processing program).
    * DeleteLocalQueueExpiresProcessor: Delete expired programs (from the local queue).
    * DeletePublishedExpireEventProcessor: Delete expired published local message programs (from the database).ere) 组件实现的集成事件发布器
* Subscriber: 通过 [`Dapr`](https://docs.dapr.io/zh-hans/developing-applications/building-blocks/pubsub/pubsub-overview/) 提供的 [PubSub](here) 组件实现的集成事件订阅器

在 `Masa.Contrib.Dispatcher.IntegrationEvents.Dapr` 中，我们使用了 `Dapr` 提供的 `PubSub` 组件来实现集成事件的发布和订阅。通过 `Publisher` 和 `Subscriber` 类，我们可以方便地将集成事件发布到 `Dapr` 的 `PubSub` 中心，或从中心订阅集成事件。这样，我们就可以轻松地实现跨服务的集成事件通信。nScope` 来保证事务的一致性

### 接入方不支持发件箱模式

如果接入的提供者没有实现[发件箱模式](https://www.kamilgrzybek.com/design/the-outbox-pattern/)，我们需要实现 `IIntegrationEventBus` 和 `IIntegrationEventLogService` 两个接口，其中 `IIntegrationEventLogService` 用于记录集成事件的日志，`IIntegrationEventBus` 用于将集成事件发送到提供者。在使用的时候，需要同时安装这两个类库。

> 要注意: 为确保消息的发布与本地任务的原子性，需要使用 `IUnitOfWork` 提供的 `TransactionScope` 来保证事务的一致性。ons`，并在其中注册 `IPublisher` 和 `IIntegrationEventLogService` 的实现类

   ```csharp
   public class DispatcherOptions
   {
       public IPublisher Publisher { get; set; }
       public IIntegrationEventLogService IntegrationEventLogService { get; set; }
   }
   ```

4. 在 `Startup.cs` 中注册 `DispatcherOptions` 和 `IIntegrationEventLogService` 的实现类

   ```csharp
   services.AddSingleton(new DispatcherOptions
   {
       Publisher = new Publisher(),
       IntegrationEventLogService = new IntegrationEventLogService()
   });

   services.AddSingleton<IIntegrationEventLogService, IntegrationEventLogService>();
   ```

5. 在需要使用集成事件的地方，注入 `IDispatcher`，并调用 `PublishAsync` 方法

   ```csharp
   public class SomeService
   {
       private readonly IDispatcher _dispatcher;

       public SomeService(IDispatcher dispatcher)
       {
           _dispatcher = dispatcher;
       }

       public async Task SomeMethod()
       {
           var @event = new SomeIntegrationEvent();
           await _dispatcher.PublishAsync("topicName", @event);
       }
   }
   ```

这样，就可以在不支持发件箱模式的情况下，使用集成事件了。The following code snippet shows how to register a custom `Publisher` to the service collection using `DispatcherOptionsExtensions`:

```csharp l:6
public static class DispatcherOptionsExtensions
{
    public static DispatcherOptions UseRabbitMq(this Masa.Contrib.Dispatcher.IntegrationEvents.Options.DispatcherOptions options)
    {
        //todo: register RabbitMq information
        dispatcherOptions.Services.TryAddSingleton<IPublisher, Publisher>();
        return dispatcherOptions;
    }
}
```

To use the custom implementation of `RabbitMq`, modify the code as follows:

```csharp l:3
builder.Services.AddIntegrationEventBus(option =>
{
    option.UseRabbitMq();//modify to use RabbitMq
    option.UseUoW<UserDbContext>(optionBuilder => optionBuilder.UseSqlite($"Data Source=./Db/{Guid.NewGuid():N}.db;"));
    option.UseEventLog<UserDbContext>();
});
```