### Implementing Distributed Task Scheduling with MASA.Scheduler

1. Using HTTP type Jobs

    Create an HTTP type Job in the Scheduler management portal or using the SDK:

      * To create a Job in the management portal, please refer to the [User Guide - Scheduling Jobs](stack/scheduler/use-guide/scheduler-job)
      
      * To create a Job using the SDK, please refer to the [SDK example](stack/scheduler/sdk-instance)

2. Using Job Application type Jobs

   * Create a .NET Core class library

   * Install the dependency package
     ```shell
     dotnet add package Masa.Contrib.StackSdks.Scheduler
     ```

   * Create your own business Job class, which needs to inherit the `SchedulerJob` class
     ```csharp
     public class MyExecuteJob : SchedulerJob
     {
         public override async Task<object?> ExcuteAsync(JobContext context)
         {
             var myParameter = context.ExcuteParameters[0];//The parameter passed in when registering the job
             var jobId = context.JobId;//The JobId in the scheduling center
             var taskId = context.TaskId;//The TaskId in the scheduling center
             var executionTime = context.ExecutionTime;//The execution time of the current task
             //Your business logic here
             return null;
         }
     }
     ```

   * Register the Job in the Scheduler management portal or using the SDK

   * Start the Scheduler service and the Job will be executed according to the configured schedule.text. ExecutionTime; // Compensation time
             // Your business logic

             await Task.CompletedTask;

             return "Success";
         }
     }
     ```

   * Package and publish your `Job` library, and upload it to the `Scheduler` source file management. For instructions on uploading source files, please refer to the [Scheduler Job Usage Guide](stack/scheduler/use-guide/scheduler-job).

   * Create a `Job` application type `Job` through the `Scheduler` management console or `SDK`, and configure the specified assembly and execution class.

      * To create a `Job` through the management console, please refer to the [Scheduler Job Usage Guide](stack/scheduler/use-guide/get-started).
      
      * To create a `Job` through the `SDK`, please refer to the [SDK example](stack/scheduler/sdk-instance).