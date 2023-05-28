Introduction

By injecting the `ISchedulerClient` interface, you can call the corresponding `Service` to obtain the capabilities provided by the `Scheduler SDK`.

Service Introduction

The `Scheduler SDK` contains the following major categories of services:

```csharp
ISchedulerClient
├── SchedulerJobService             Job scheduling service
├── SchedulerTaskService            Task scheduling service
```

Usage Introduction

1. Install the dependency package

   ```shell Terminal
   dotnet add package Masa.Contrib.StackSdks.Scheduler
   ```

2. Register the Scheduler service

   ```csharp Program.cs
   builder.Services.AddSchedulerClient("http://schedulerservice.com");
   ```

   > Replace `http://schedulerservice.com` with the actual backend service address of the `Scheduler`.

3. Examples

   * [Register Job Application](stack/scheduler/use-guide/scheduler-job-app/#API-Creation)

   * [Register HTTP](stack/scheduler/use-guide/scheduler-http/#API-Creation)

   * [Register Dapr](stack/scheduler/use-guide/scheduler-dapr/#API-Creation)