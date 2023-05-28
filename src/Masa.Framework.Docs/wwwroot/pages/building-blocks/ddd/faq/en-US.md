ishAsync()` 方法，将事件发布到事件总线中。
* 在应用程序的事务提交后，事件总线会自动将所有已入队的领域事件发布出去。

## 如何在领域模型中使用值对象？

在领域模型中使用值对象需要注意以下几点：

1. 值对象应该是不可变的，即一旦创建就不能再修改。
2. 值对象应该重写 `Equals()` 和 `GetHashCode()` 方法，以便在比较时正确地判断两个值对象是否相等。
3. 值对象应该被定义为 `sealed` 类型，以防止被继承。

## 如何在领域模型中处理并发问题？

在领域模型中处理并发问题需要注意以下几点：

1. 使用乐观并发控制，即在更新聚合根时检查版本号，如果版本号不匹配则抛出异常。
2. 使用悲观并发控制，即在读取聚合根时加锁，防止其他线程同时修改聚合根。
3. 使用事件溯源，即将所有领域事件保存下来，以便在出现并发问题时进行回溯和恢复。

## 如何在领域模型中处理复杂业务逻辑？

在领域模型中处理复杂业务逻辑需要注意以下几点：

1. 将业务逻辑封装在聚合根中，以保证业务逻辑的完整性和一致性。
2. 使用领域事件来处理复杂业务逻辑，将业务逻辑分解成多个小的领域事件，每个领域事件只处理一个小的业务逻辑。
3. 使用领域服务来处理复杂业务逻辑，将业务逻辑封装在领域服务中，以便在多个聚合根之间共享和复用。`ishQueueAsync`

* There are two scenarios for integrating event sending:
  * If transactions are not disabled: events will be sent after the `IUnitOfWork` is committed.
  * If transactions are not enabled: events will be sent immediately when the `PublishQueueAsync` method is called.
* The events will be sent after the outermost `IEventBus` execution is completed.