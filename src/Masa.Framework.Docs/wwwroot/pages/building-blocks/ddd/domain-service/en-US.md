new OrderPaymentSucceededDomainEvent(payment.Id, payment.OrderId, payment.Amount) : 
                new OrderPaymentFailedDomainEvent(payment.Id, payment.OrderId, payment.Amount, payment.FailureReason);
           await DomainEventBus.PublishAsync(orderPaymentDomainEvent);
           _logger.LogInformation($"Payment status changed for payment {payment.Id}");
       }
   }
   ```

## 总结

领域服务是领域模型的操作者，用于处理业务逻辑，它是无状态的，状态由领域对象来保存。与应用服务不同，应用服务仅负责编排和转发，不应包含业务逻辑。使用领域服务需要安装相应的包并注册领域事件总线。The following code is an example of a Domain Service that inherits from a base class. The class is automatically registered and its lifecycle is scoped. It can be injected and used in the constructor of an application service. The Domain Service uses a Domain Event Bus to publish events, which can be either local or integration events. The Domain Event Bus provides methods to enqueue and publish events in the order they were enqueued.

```c#
public class OrderService : DomainService
{
    private readonly ILogger<OrderService> _logger;
    private readonly IDomainEventBus _eventBus;

    public OrderService(ILogger<OrderService> logger, IDomainEventBus eventBus)
    {
        _logger = logger;
        _eventBus = eventBus;
    }

    public async Task ProcessPaymentAsync(Payment payment)
    {
        DomainEvent orderPaymentDomainEvent = payment.IsSucceeded
            ? new OrderPaymentSucceededDomainEvent(payment.OrderId)
            : new OrderPaymentFailedDomainEvent(payment.OrderId);

        _logger.LogInformation(
            "----- Publishing integration event: {IntegrationEventId} from {AppName} - ({@IntegrationEvent})", 
            orderPaymentDomainEvent.GetEventId(), 
            Program.AppName, 
            orderPaymentDomainEvent);

        await _eventBus.PublishAsync(orderPaymentDomainEvent);
    }
}
```

The Domain Event Bus can publish both local and integration events. It provides methods to enqueue and publish events in the order they were enqueued. The lifecycle of a Domain Service that inherits from a base class is scoped and it is automatically registered. It can be injected and used in the constructor of an application service.