---
title: 最佳实践
date: 2023/03/13 13:22:00
---

### MASA.Scheduler实现分布式任务调度

1. 使用HTTP类型的Job

   1.1 在Scheduler管理端或者使用SDK创建Job

      - 管理端创建Job，请参考[使用指南-调度Job](stack/scheduler/use-guide/scheduler-job)
      - SDK创建Job，请参考[SDK示例](stack/scheduler/sdk-instance)

2. 使用Job应用类型的Job

   2.1 创建一个NETCore类库，新建自己的业务Job类，需要继承SchedulerJob类

   ```csharp
   public class MyExecuteJob : SchedulerJob
   {
       public override async Task<object?> ExcuteAsync(JobContext context)
       {
           var myParameter = context.ExcuteParameters[0];//注册job时配置的传递参数
           var jobId = context.JobId;//调度中心的JobId
           var taskId = context.TaskId;//调度中心的TaskId
           var executionTime = context.ExecutionTime;//补偿时间
           // 你的业务

           await Task.CompletedTask;

           return "Success";
       }
   }
   ```
   2.2 将你的Job类库发布打包，上传到Scheduler源文件管理，源文件上传请参考[使用指南-调度Job](stack/scheduler/use-guide/scheduler-job)

   2.3 通过Scheduler管理端或者SDK创建一个Job应用类型的Job

      - 管理端创建Job，请参考[使用指南-调度Job](stack/scheduler/use-guide/scheduler-job)
      - SDK创建Job，请参考[SDK示例](stack/scheduler/sdk-instance)