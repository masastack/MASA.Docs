# Background Task - Memory

## Overview

A background task based on memory implementation, the task will be lost after the project restarts.

## Usage

1. Install `Masa.Contrib.Extensions.BackgroundJobs.Memory`

   ```shell Terminal
   dotnet add package Masa.Contrib.Extensions.BackgroundJobs.Memory
   ```

2. Register the memory background task

   ```csharp Program.cs
   var services = new ServiceCollection();
   builder.Services.AddBackgroundJob(options =>
   {
       options.UseInMemoryDatabase();
   });
   ```

3. Create `RegisterUserDto` to pass parameters

   ```csharp
   public class RegisterUserDto
   {
       public string Name { get; set; }
   }
   ```

4. Add `RegisterUserBackgroundJob` (user registration handler)

   ```csharp
   using BackgroundJobsDemo.Dto;
   using Masa.BuildingBlocks.Extensions.BackgroundJobs;
   
   namespace BackgroundJobsDemo.Infrastructure;
   
   public class RegisterUserBackgroundJob : BackgroundJobBase<RegisterUserDto>
   {
       public RegisterUserBackgroundJob(ILogger<BackgroundJob> logger) : base(logger)
       {
       }
   
       public override async Task ExecuteAsync(RegisterUserDto input, CancellationToken cancellationToken = default)
       {
           // Handle user registration logic here
       }
   }
   ```

5. Enqueue the background task

   ```csharp
   var backgroundJob = serviceProvider.GetService<IBackgroundJob>();
   await backgroundJob.EnqueueAsync(new RegisterUserDto { Name = "John" });
   ```1. 这是一个C#的类，继承了另一个类ServiceBase，并且有一个构造函数，它接受一个泛型参数Base<RegisterUserDto>>和一个可空的logger参数。在构造函数中，它调用了基类的构造函数，并将logger参数传递给了基类。

2. 这是一个C#的类，它继承了另一个类ServiceBase，并且有一个构造函数，它接受一个泛型参数Base<RegisterUserDto>>和一个可空的logger参数。在构造函数中，它调用了基类的构造函数，并将logger参数传递给了基类。

3. 这是一个C#的类，它继承了另一个类ServiceBase，并且有一个构造函数，它接受一个泛型参数Base<RegisterUserDto>>和一个可空的logger参数。在构造函数中，它调用了基类的构造函数，并将logger参数传递给了基类。

4. 这是一个C#的方法，它重写了基类的方法ExecutingAsync，并接受一个RegisterUserDto类型的参数args。在方法中，它使用了可空的Logger属性来记录日志，记录了注册账户的名称。最后，它返回了一个已完成的任务。

5. 这是一个C#的类，它继承了另一个类ServiceBase，并且有一个AddAsync方法。在方法中，它创建了一个RegisterUserDto类型的对象registerUser，并设置了它的Name属性为"masa"。然后，它使用BackgroundJobManager.EnqueueAsync方法将registerUser对象加入到后台任务队列中，并设置了任务执行的时间为3秒后。