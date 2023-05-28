# Job Application

> Uploading resource files is required before using the `Job` application type.

## Installation Package

```shell
dotnet add package Masa.Contrib.StackSdks.Scheduler
```

## Manual Creation

1. Upload `Job`
   1. Create `Job`

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
              var myParameter = context.ExcuteParameters; // The passed parameters configured when registering the job
              var jobId = context.JobId; // JobId in the scheduling center
              var taskId = context.TaskId; // TaskId in the scheduling center
              var executionTime = context.ExecutionTime; // Compensation time
              // Your business logic
              1. Create a Job

   1. Write the code for the Job

      ```csharp
      public class MyJob : IJob
      {
          public async Task<string> ExecuteAsync()
          {
              await Task.CompletedTask;
              // Return any object here. If you want to mark this task as failed, you can do so by throwing a new Exception().
              return "success";
          }
      }
      ```

   2. Package the Job

      ![Package Job](https://cdn.masastack.com/stack/doc/scheduler/rc1/resourceFiles_release.png)

   3. Upload the Job

      1. Open the resource file page and click the `+` button to upload.

         ![Upload Resource File](https://cdn.masastack.com/stack/doc/scheduler/rc1/resourceFiles.png)

      2. After selecting the file,

         ![Create New Resource File](https://cdn.masastack.com/stack/doc/scheduler/rc1/resourceFiles_insert.png)

      3. Click `Submit` to complete the upload.

         ![Upload](https://cdn.masastack.com/stack/doc/scheduler/rc1/resourceFiles_upload.png)

2. Fill in the scheduling information

   ![Fill in Scheduling Information](https://cdn.masastack.com/stack/doc/scheduler/rc1/resourceFiles_insert_detail.png)

3. Set the resource file execution class

   ![Set Resource File Execution Class](https://cdn.masastack.com/stack/doc/scheduler/rc1/resourceFiles_insert_detail_2.png).Scheduler.Models;

      [ApiController]
      [Route("[controller]")]
      public class JobController : ControllerBase
      {
          private readonly ISchedulerClient _schedulerClient;

          public JobController(ISchedulerClient schedulerClient)
          {
              _schedulerClient = schedulerClient;
          }

          [HttpPost]
          public async Task<IActionResult> CreateJob()
          {
              var job = new JobCreateDto
              {
                  JobName = "应用名称",
                  AssemblyName = "控制台打包后的 DLL 文件",
                  ClassName = "命名空间中的 Job 类",
                  CronExpression = "0 0/1 * * * ?",
                  JobArgs = "入参参数",
                  SourceFileVersion = "指定特定版本或最新版本"
              };

              var result = await _schedulerClient.CreateJobAsync(job);

              if (result.Code == ResultCode.Success)
              {
                  return Ok(result.Data);
              }

              return BadRequest(result.Message);
          }
      }
      ```

   3. 调用 `API` 创建调度信息

      ```http
      POST /job HTTP/1.1
      Host: localhost:5000
      Content-Type: application/json

      {
          "JobName": "应用名称",
          "AssemblyName": "控制台打包后的 DLL 文件",
          "ClassName": "命名空间中的 Job 类",
          "CronExpression": "0 0/1 * * * ?",
          "JobArgs": "入参参数",
          "SourceFileVersion": "指定特定版本或最新版本"
      }
      ```

      返回结果：

      ```http
      HTTP/1.1 200 OK
      Content-Type: application/json

      {
          "Code": 0,
          "Data": "创建成功",
          "Message": null
      }
      ```/// <summary>
      /// A test controller for job scheduling.
      /// </summary>
      [ApiController]
      [Route("[controller]/[action]")]
      public class SchedulerJobController : ControllerBase
      {
          private readonly ISchedulerClient _schedulerClient;
   
          public SchedulerJobController(ISchedulerClient schedulerClient)
          {
              _schedulerClient = schedulerClient;
          }
   
          [HttpPost]
          public async Task<JobRegisterResult> Register()
          {
              var request = new AddSchedulerJobRequest
              {
                  ProjectIdentity = "",
                  Name = "",
                  JobType = JobTypes.JobApp,
                  CronExpression = "",
                  OperatorId = Guid.Empty,
               }的应用程序类型）|
      | **CronExpression**    | `Job` 的调度表达式，用于指定 `Job` 的执行时间 |
      | **JobAppConfig**      | `Job` 的应用程序配置，包括 `Job` 的身份、入口程序集、入口类名和参数 |
      | **JobID**             | `Job` 的唯一标识符，用于后续操作和查询         |

      The code above is a method for registering a job in a scheduler system. It takes in several parameters, including the project ID, job name, job type, cron expression, job application configuration, and job ID. The `JobAppConfig` property contains the identity, entry assembly, entry class name, and parameters for the job application. The method returns a `JobRegisterResult` object that contains the unique identifier for the registered job.(Application) |
      | **CronExpression**    | The `Cron` expression (the cycle at which the `Job` is executed) |
      | **OperatorId**        | The operator/creator |
      | **JobAppIdentity**    | The ID of the uploaded resource file |
      | **JobEntryAssembly**  | The assembly (only contains the project's `DLL` file) |
      | **JobEntryClassName** | The execution class (the `Job` class in the namespace) |
      | **Version**           | Specifies a specific version (optional) |