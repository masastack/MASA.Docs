## 5. 事件总线

### 使用

通过事件总线帮助我们解耦不同架构层次, 根据事件类型我们将事件总线划分为:

* [进程内事件总线](/framework/building-blocks/dispatcher/local-event)
* [集成事件总线](/framework/building-blocks/dispatcher/integration-event)

1. 安装`Masa.Contrib.Dispatcher.IntegrationEvents.Dapr`、`Masa.Contrib.Dispatcher.IntegrationEvents.EventLogs.EFCore`、`Masa.Contrib.Dispatcher.Events`

```powershell
dotnet add package Masa.Contrib.Dispatcher.IntegrationEvents //使用具有发件箱模式的集成事件
dotnet add package Masa.Contrib.Dispatcher.IntegrationEvents.Dapr //使用dapr提供的pubsub能力
dotnet add package Masa.Contrib.Dispatcher.IntegrationEvents.EventLogs.EFCore //本地消息表

dotnet add package Masa.Contrib.Dispatcher.Events // 支持进程内事件
```

2. 注册集成事件与进程内事件, 修改`Program.cs`

```csharp
builder.AddIntegrationEventBus(integrationEventBus => 
        integrationEventBus
            .UseDapr()
            .UseEventLog<CatalogDbContext>()
            .UseEventBus())
```

其中进程内事件支持`AOP`, 提供类似`中间件`的功能, 例如记录所有事件的日志

1. 新建日志中间件`LoggingMiddleware`, 并继承`Middleware<TEvent>`

```csharp
public class LoggingMiddleware<TEvent> : Middleware<TEvent>
    where TEvent : IEvent
{
    private readonly ILogger<LoggingMiddleware<TEvent>> _logger;
    public LoggingMiddleware(ILogger<LoggingMiddleware<TEvent>> logger) => _logger = logger;

    public override async Task HandleAsync(TEvent @event, EventHandlerDelegate next)
    {
        _logger.LogInformation("----- Handling command {CommandName} ({@Command})", @event.GetType().GetGenericTypeName(), @event);
        await next();
    }
}
```

2. 修改注册进程内事件代码, 指定需要执行的中间件, 修改`Program.cs`

```csharp
builder.Services.AddIntegrationEventBus(integrationEventBus => 
    integrationEventBus
        .UseDapr()
        .UseEventLog<CatalogDbContext>()
        .UseEventBus(eventBusBuilder => eventBusBuilder.UseMiddleware(typeof(LoggingMiddleware<>))) //指定需要执行的中间件
```

> 进程内事件总线的中间件是先进后出

除此之外, 进程内事件还支持`Handler编排`、`Saga`等, 查看详细[文档](/framework/building-blocks/dispatcher/local-event)

由于我们的项目使用了`DomainEventBus`, 我们可以将领域事件总线与进程内事件总线、集成事件总线注册代码简写为:

```csharp
.AddDomainEventBus(options =>
{
    options.UseIntegrationEventBus(integrationEventBus =>
            integrationEventBus
                .UseDapr()
                .UseEventLog<CatalogDbContext>())
        .UseEventBus(eventBusBuilder => eventBusBuilder.UseMiddleware(typeof(LoggingMiddleware<>)))
        .UseUoW<CatalogDbContext>() //使用工作单元, 确保原子性
        .UseRepository<CatalogDbContext>();
});
```