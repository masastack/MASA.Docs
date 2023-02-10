## 5. 事件总线

通过事件总线帮助我们解耦不同架构层次, 根据事件类型我们将事件总线划分为:

* [进程内事件总线](/framework/building-blocks/dispatcher/local-event)
* [集成事件总线](/framework/building-blocks/dispatcher/integration-event)

### 必要条件

* 进程内事件总线

进程内事件总线的实现由`Masa.Contrib.Dispatcher.Events`提供, 我们需要在项目启动时注册, 它通常被放在`Program`中

```powershell
dotnet add package Masa.Contrib.Dispatcher.Events // 支持进程内事件
```

而后续发送事件的类所在类库只需要引用`Masa.BuildingBlocks.Dispatcher.Events`即可 (如果当前类库已经引用了`Masa.Contrib.Dispatcher.Events`, 则无需重复引用`Masa.BuildingBlocks.Dispatcher.Events`)

* 集成事件 (跨进程事件)总线

集成事件总线的实现由`Masa.Contrib.Dispatcher.IntegrationEvents.Dapr`、`Masa.Contrib.Dispatcher.IntegrationEvents.EventLogs.EFCore`提供, 我们需要在项目启动时注册, 它通常被放在`Program`中

```powershell
dotnet add package Masa.Contrib.Dispatcher.IntegrationEvents //使用具有发件箱模式的集成事件
dotnet add package Masa.Contrib.Dispatcher.IntegrationEvents.Dapr //使用dapr提供的pubsub能力
dotnet add package Masa.Contrib.Dispatcher.IntegrationEvents.EventLogs.EFCore //本地消息表
```

而后续发送集成事件的类所在类库只需引用`Masa.BuildingBlocks.Dispatcher.IntegrationEvents`即可 (如果当前类库已经引用了`Masa.Contrib.Dispatcher.IntegrationEvents.*`, 则无需重复引用`Masa.BuildingBlocks.Dispatcher.IntegrationEvents`)

### 使用

注册集成事件与进程内事件, 修改`Program`

```csharp
builder.Services
    .AddIntegrationEventBus(integrationEventBus => 
        integrationEventBus
            .UseDapr()
            .UseEventLog<CatalogDbContext>()
            .UseEventBus())
```

由于我们的项目使用了`DDD`, 我们可以将领域事件总线与进程内事件总线、集成事件总线注册代码简写为:

```csharp
builder.Services
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

### 中间件

进程内事件支持`AOP`, 提供与`ASP.NET Core`类似的`中间件`的功能, 例如: 记录所有事件的日志

### 自定义日志中间件

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

2. 修改注册进程内事件代码, 指定需要执行的中间件, 修改`Program`

```csharp
builder.Services
    .AddDomainEventBus(options =>
    {
        options.UseIntegrationEventBus(integrationEventBus =>
                integrationEventBus
                    .UseDapr()
                    .UseEventLog<CatalogDbContext>())
            .UseEventBus(eventBusBuilder => eventBusBuilder.UseMiddleware(typeof(LoggingMiddleware<>))) //指定需要执行的中间件
            .UseUoW<CatalogDbContext>() //使用工作单元, 确保原子性
            .UseRepository<CatalogDbContext>();
    });
```

> 进程内事件总线的中间件是先进后出

除此之外, 进程内事件还支持`Handler编排`、`Saga`等, 查看详细[文档](/framework/building-blocks/dispatcher/local-event)

### 验证中间件

在`Masa.Contrib.Dispatcher.Events.FluentValidation`中我们提供了基于`FluentValidation`的验证中间件, 它可以帮助我们在发送进程内事件后自动调用验证, 协助我们完成对参数的校验

1. 安装`Masa.Contrib.Dispatcher.Events.FluentValidation`、`FluentValidation.AspNetCore`

```powershell
dotnet add package Masa.Contrib.Dispatcher.Events.FluentValidation
dotnet add package FluentValidation.AspNetCore
```

2. 指定进程内事件使用`FluentValidation`的中间件

```csharp
builder.Services
    .AddValidatorsFromAssembly(Assembly.GetExecutingAssembly()) //添加指定程序集下的`FluentValidation`验证器
    .AddDomainEventBus(options =>
    {
        options.UseIntegrationEventBus(integrationEventBus =>
                integrationEventBus
                    .UseDapr()
                    .UseEventLog<CatalogDbContext>())
            .UseEventBus(eventBusBuilder => eventBusBuilder.UseMiddleware(new[] { typeof(ValidatorMiddleware<>), typeof(LoggingMiddleware<>) })) //使用验证中间件、日志中间件
            .UseUoW<CatalogDbContext>() //使用工作单元, 确保原子性
            .UseRepository<CatalogDbContext>();
    });
```

> 基于`FluentValidation`的验证部分代码将在下一篇文章中讲到