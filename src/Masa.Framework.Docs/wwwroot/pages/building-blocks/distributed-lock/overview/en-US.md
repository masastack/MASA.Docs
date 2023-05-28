# Distributed Lock - Overview

Distributed lock is a technique for managing multiple application access to the same resource in a distributed system. Its main purpose is to prevent data inconsistency caused by concurrent access to the same resource by multiple applications at the same time.

## Best Practices

Currently, there are two implementations of distributed lock:

* [`Local`](/framework/building-blocks/distributed-lock/lock-local): a local lock based on [`SemaphoreSlim`](https://learn.microsoft.com/zh-cn/dotnet/api/system.threading.semaphoreslim), recommended for use in a single application.
* [`Medallion`](/framework/contribs/data/distributed-lock/medallion): a distributed lock based on [DistributedLock](https://github.com/madelson/DistributedLock).

Although [`Local`](/framework/building-blocks/distributed-lock/lock-local) does not support distributed lock, it is still a useful implementation:

* In development or testing scenarios.
* When using a single server in production, but planning to use multiple servers later, it can be quickly replaced with registered distributed lock code to achieve true distributed lock.

## Source Code Analysis

`IDistributedLock` is the abstract class for distributed lock, which provides:

* TryGet: attempts to acquire the lock.
* TryGetAsync: attempts to acquire the lock asynchronously.

`Key` is the unique name of the lock, and different locks with different names can be used to access different resources. `Timeout` is the timeout value for waiting to acquire the lock, with a default value of `TimeSpan.Zero` (if the lock is already owned by another application, it will not wait and return `null` directly).