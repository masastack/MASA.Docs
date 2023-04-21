# Dapr Service Invocation

## 安装包

   ```powershelll
   Install-Package Masa.Contrib.StackSdks.Scheduler
   ```

## 手动创建

### 1. 填写调度信息

   ![填写调度信息](http://cdn.masastack.com/stack/doc/scheduler/rc1/scheduler_dapr_insert.png)

   ![填写调度信息2](http://cdn.masastack.com/stack/doc/scheduler/rc1/scheduler_dapr_insert_2.png)

   | 类型 | 描述 |
   | --------- | ------------------------------------------- |
   | Service应用 | 调用项目的服务 |
   | Namespace | 目前暂无用到此参数                         |
   | Method Name | 接口地址（无需Host部分例如/api/test）     |
   | 请求类型 | Http请求类型（GET，POST，PUT，DELETE，HEAD） |
   | Data | 参数内容 |

## API创建

<a id="api_create"></a>

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
   public class SchedulerDaprController : ControllerBase
   {
       private readonly ISchedulerClient _schedulerClient;
   
       public SchedulerDaprController(ISchedulerClient schedulerClient)
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
               DaprServiceInvocationConfig = new SchedulerJobDaprServiceInvocationConfig
               {
                   DaprServiceIdentity = "",
                   MethodName = "/api/test",
                   HttpMethod = HttpMethods.GET,
                   Data = ""
               }
           };
           var jobId = await _schedulerClient.SchedulerJobService.AddAsync(request);
           return true;
       }
   }
   
   ```

| **属性**             | **描述**                               |
|----------------------|--------------------------------------|
| **ProjectIdentity**  | 项目（项目 ID）                      |
| **Name**             | Job 的名称                            |
| **JobType**          | Job 的类型（`JobTypes.JobApp` 为 Job 应用） |
| **CronExpression**   | Cron 表达式（Job 执行的周期）          |
| **OperatorId**       | 操作人/创建人                         |
| **DaprServiceIdentity**   | Service应用（Id）    |
| **MethodName**       | 请求地址        |
| **HttpMethod**       | 请求类型       |
| **Data**         | 接口参数 (Content)            |

