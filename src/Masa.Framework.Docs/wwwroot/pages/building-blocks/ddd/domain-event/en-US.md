# Domain-Driven Design - Domain Events

## Overview

What are [Domain Events](https://learn.microsoft.com/zh-cn/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/domain-events-design-implementation)?

Based on the type of event, we divide domain events into local events (`DomainEvent`) and integration events (`IntegrationDomainEvent`). Local events are further divided into `DomainCommand` and `DomainQuery` based on their read/write nature. For example:

```csharp
/// <summary>
/// Domain event used when an order is created with the order status set to submitted
/// </summary>
public record OrderStartedDomainEvent(Order Order,
    string UserId,
    string UserName,
    int CardTypeId,
    string CardNumber,
    string CardSecurityNumber,
    string CardHolderName,
    DateTime CardExpiration) : DomainEvent;
```

Through domain events, publishers and subscribers are decoupled, and subscribers only need to focus on events they care about. They do not have to worry about adding non-business logic code to the domain layer due to changes in new business, which would make it difficult to maintain.

> Domain event buses can be published in **aggregate roots** and **domain services**.