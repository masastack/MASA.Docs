1. 通过指定程序集集合注册 `EventBus` 时，使用指定的程序集集合
2. 通过 `AddEventBus` 注册 `EventBus` 时，使用当前域下的程序集
3. 通过 `Assembly.GetExecutingAssembly()` 获取当前程序集1. Manually specify the Assembly collection -> MasaApp.GetAssemblies()

   ```
   var builder = WebApplication.CreateBuilder(args);
   var assemblies = new[]
   {
       typeof(UserHandler).Assembly
   };
   builder.Services.AddEventBus(assemblies);
   ```

2. Publish events through EventBus, Handler fails, but data is still saved to the database

   1. Check if transaction is disabled
      1. Is DisableRollbackOnFailure true (disable rollback on failure)?
      2. Is UseTransaction false (disable transaction)?
   2. Check if the current database supports rollback. For example, if you are using a MySQL database but the rollback fails, please refer to [this article](https://developer.aliyun.com/article/357842).

4. Why is retry not executed even though exception retry is enabled?

   By default, UserFriendlyException does not support retry. If you need to support retry, you need to re-implement IExceptionStrategyProvider.

5. Support Transaction

   Used in conjunction with MASA.Contrib.Ddd.Domain.Repository.EF.Repository and UnitOfWork. When the Event implements ITransaction, the transaction will be automatically started when the Add, Update, and Delete methods are executed, and the transaction will be committed after all Handlers are executed. If the transaction encounters an exception, it will be automatically rolled back.

6. Is EventBus thread-safe?

   No, it is not thread-safe. If multiple threads execute EventBus.P, it may cause problems.If an exception occurs during the execution of publishAsync(), there may be exceptions such as data not being submitted.

## Integrated Events

1. After an exception occurs, will the integrated event still be sent successfully?

   Such issues require judgment of whether the current scenario has started a transaction. If a transaction is started and the transaction is committed after an exception occurs, the integrated event will not be sent successfully. Otherwise, it will continue to be sent. [Which scenarios will automatically start a transaction?](/framework/building-blocks/data/uow)