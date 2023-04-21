# Job 应用

> 使用 `Job 应用` 类型需要先上传资源文件

## 安装包

```powershelll
Install-Package Masa.Contrib.StackSdks.Scheduler
```

## 手动创建

### 1. 填写调度信息

   ![填写调度信息](http://cdn.masastack.com/stack/doc/scheduler/rc1/resourceFiles_insert_detail.png)

### 2. 上传资源文件

   ![上传资源文件](http://cdn.masastack.com/stack/doc/scheduler/rc1/resourceFiles.png)

### 3. 新建源文件

   ![新建源文件](http://cdn.masastack.com/stack/doc/scheduler/rc1/resourceFiles_insert.png)

   1. 编写代码

   ```csharp
   using Masa.BuildingBlocks.StackSdks.Scheduler.Model;
   using Masa.Contrib.StackSdks.Scheduler;

   internal class Program
   {
       static async Task Main(string[] args)
       {
           Console.WriteLine("Hello World!");
       }
   }

   public class MyExecuteJob : SchedulerJob
   {
       public override async Task<object?> ExcuteAsync(JobContext context)
       {
           var myParameter = context.ExcuteParameters;//注册job时配置的传递参数
           var jobId = context.JobId;//调度中心的JobId
           var taskId = context.TaskId;//调度中心的TaskId
           var executionTime = context.ExecutionTime;//补偿时间
           //你的业务
           await Task.CompletedTask;
           //这个返回任意对象都行，如果想标记此任务失败可以通过throw new Exception();
           return "success";
       }
   }
   ```

   4. 打包Job

   ![打包Job](http://cdn.masastack.com/stack/doc/scheduler/rc1/resourceFiles_release.png)

   5. 上传

   ![上传](http://cdn.masastack.com/stack/doc/scheduler/rc1/resourceFiles_upload.png)

### 4. 设置资源文件执行类

![设置资源文件执行类](http://cdn.masastack.com/stack/doc/scheduler/rc1/resourceFiles_insert_detail_2.png)

|**属性**     | **描述**                                                   |
|-------------|------------------------------------------------------------|
|**Job应用**  | 应用名称                                                    |
|**程序集**   | 控制台打包后的 DLL（仅包含项目的 DLL 文件）                  |
|**执行类**   | 命名空间中的 Job 类                                         |
|**参数**     | 入参参数（可选，以逗号分隔，**目前最少需要填一个参数**）    |
|**源文件版本** | 指定特定版本或最新版本（可选）                              |

## API创建

<a id="api_create"></a>

### 1. API创建也需要先上传资源文件

操作与手动创建一致

### 2. 编写一个API创建代码

   1. 注册相关服务，修改`Program.cs`

   ```csharp
   builder.Services.AddSchedulerClient("schedulers服务地址");
   ```

   2. 注册一个Job应用示例

   ```csharp
   using Microsoft.AspNetCore.Mvc;
   using Masa.BuildingBlocks.StackSdks.Scheduler;
   using Masa.BuildingBlocks.StackSdks.Scheduler.Enum;
   using Masa.BuildingBlocks.StackSdks.Scheduler.Model;
   using Masa.BuildingBlocks.StackSdks.Scheduler.Request;
   
   /// <summary>
   /// 一个测试的任务调度的Controller
   /// </summary>
   [ApiController]
   [Route("[controller]")]
   public class SchedulerJobController : ControllerBase
   {
       private readonly ISchedulerClient _schedulerClient;
   
       public SchedulerJobController(ISchedulerClient schedulerClient)
       {
           _schedulerClient = schedulerClient;
       }
   
       [HttpGet]
       public async Task<bool> Register()
       {
           var request = new AddSchedulerJobRequest
           {
               ProjectIdentity = "",
               Name = "",
               JobType = JobTypes.JobApp,
               CronExpression = "",
               OperatorId = Guid.Empty,
               JobAppConfig = new SchedulerJobAppConfig
               {
                   JobAppIdentity = "",
                   JobEntryAssembly = "",
                   JobEntryClassName = "",
                   JobParams = "",
               }
           };
           var jobId = await _schedulerClient.SchedulerJobService.AddAsync(request);
           return true;
       }
   } 
   ```
   
   | **属性**             | **描述**                               |
   |----------------------|--------------------------------------|
   | **ProjectIdentity**      | 项目（项目 ID）                      |
   | **Name**                 | Job 的名称                            |
   | **JobType**              | Job 的类型（`JobTypes.JobApp` 为 Job 应用） |
   | **CronExpression**       | Cron 表达式（Job 执行的周期）          |
   | **OperatorId**           | 操作人/创建人                         |
   | **JobAppIdentity**       | 上传的资源文件 ID                      |
   | **JobEntryAssembly**     | 程序集（仅包含项目的 DLL 文件）        |
   | **JobEntryClassName**    | 执行类（命名空间中的 Job 类）          |
   | **Version**              | 指定特定版本（可选）                   |