## 使用FluentValidation验证

由于进程内事件总线支持中间件, 它与`FluentValidation`结合使用将使得代码更加整洁

1. 安装`Masa.Contrib.Dispatcher.Events.FluentValidation`

```powershell
dotnet add package Masa.Contrib.Dispatcher.Events.FluentValidation
```

2. 进程内事件使用指定中间件

使用`Masa.Contrib.Dispatcher.Events.FluentValidation`提供`FluentValidation`的中间件

```csharp
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