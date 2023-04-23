# 后台任务 - 内存

## 概述

基于内存实现的后台任务，项目重启后任务丢失

## 使用

1. 安装 `Masa.Contrib.Extensions.BackgroundJobs.Memory`

   ```shell 终端
   dotnet add package Masa.Contrib.Extensions.BackgroundJobs.Memory
   ```

2. 注册内存后台任务

   ```csharp Program.cs
   var services = new ServiceCollection();
   builder.Services.AddBackgroundJob(options =>
   {
       options.UseInMemoryDatabase();
   });
   ```

3. 新建 `注册用户Dto`，用于传递参数

   ```csharp
   public class RegisterUserDto
   {
       public string Name { get; set; }
   }
   ```

4. 新增 `RegisterUserBackgroundJob`（注册用户处理程序）

   ```csharp
   using BackgroundJobsDemo.Dto;
   using Masa.BuildingBlocks.Extensions.BackgroundJobs;
   
   namespace BackgroundJobsDemo.Infrastructure;
   
   public class RegisterUserBackgroundJob : BackgroundJobBase<RegisterUserDto>
   {
       public RegisterUserBackgroundJob(ILogger<BackgroundJobBase<RegisterUserDto>>? logger) : base(logger)
       {
       }
   
       protected override Task ExecutingAsync(RegisterUserDto args)
       {
           Logger?.LogInformation("Execute registered account：{Name}", args.Name);
           return Task.CompletedTask;
       }
   }
   ```

5. 添加后台任务

   ```csharp Services/UserService.cs
   using BackgroundJobsDemo.Dto;
   using Masa.BuildingBlocks.Extensions.BackgroundJobs;
   
   namespace BackgroundJobsDemo.Services;
   
   public class UserService : ServiceBase
   {
       public Task AddAsync()
       {
           var registerUser = new RegisterUserDto()
           {
               Name = "masa"
           };
           return BackgroundJobManager.EnqueueAsync(registerUser, TimeSpan.FromSeconds(3));//Execute the task after 3s
       }
   }
   ```

## 常见问题

1.  使用`Controller`的项目添加后台任务成功，但未能成功执行？

   如果使用的不是 `MinimalAPIs` 方案，则需要通过 `DI` 获取到 `IBackgroundJobManager` 服务使用，或者将 项目 `RootServiceProvider` 赋值给 `MasaApp` 

   

   * 方案1：通过 IBackgroundJobManager 使用

     ```csharp Controllers/UserController
     using BackgroundJobsDemo.Dto;
     using Masa.BuildingBlocks.Extensions.BackgroundJobs;
     using Microsoft.AspNetCore.Mvc;
     
     namespace BackgroundJobsDemo.Controllers;
     
     [Route("[controller]/[action]")]
     public class UserController: ControllerBase
     {
         private readonly IBackgroundJobManager _backgroundJobManager;
         public UserController(IBackgroundJobManager backgroundJobManager)
         {
             _backgroundJobManager = backgroundJobManager;
         }
         
         [HttpPost]
         public Task AddAsync()
         {
             var registerUser = new RegisterUserDto()
             {
                 Name = "masa"
             };
             return _backgroundJobManager.EnqueueAsync(registerUser, TimeSpan.FromSeconds(3));//Execute the task after 3s
         }
     }
     ```

   * 方案2：通过静态方法使用

     :::: code-group
     ::: code-group-item 设置 RootServiceProvider

     ```csharp Program.cs
     using Masa.BuildingBlocks.Data;
     using Masa.BuildingBlocks.Extensions.BackgroundJobs;
     
     var builder = WebApplication.CreateBuilder(args);
     
     builder.Services.AddBackgroundJob(options =>
     {
         options.UseInMemoryDatabase();
     });
     
     builder.Services.AddControllers();
     
     var app = builder.Build();
     
     MasaApp.Build(app.Services);//Set RootServiceProvider
     
     app.UseHttpsRedirection();
     
     app.MapControllers();
     
     app.Run();
     ```

     :::
     ::: code-group-item 通过静态方法使用

     ```
     using BackgroundJobsDemo.Dto;
     using Masa.BuildingBlocks.Extensions.BackgroundJobs;
     
     namespace BackgroundJobsDemo.Services;
     
     public class UserService : ServiceBase
     {
         public Task AddAsync()
         {
             var registerUser = new RegisterUserDto()
             {
                 Name = "masa"
             };
             return BackgroundJobManager.EnqueueAsync(registerUser, TimeSpan.FromSeconds(3));//Execute the task after 3s
         }
     }
     ```

     :::
     ::::