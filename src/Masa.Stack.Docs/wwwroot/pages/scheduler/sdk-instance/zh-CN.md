---
title: SDK示例
date: 2023/01/13 15:30
---

## 简介

通过注入`ISchedulerClient`接口，调用对应Service获取Scheduler SDK 提供的能力。

## 服务介绍

Scheduler SDK 包含一下几个大类的服务

```csharp
ISchedulerClient
├── SchedulerJobService             调度Job服务
├── SchedulerTaskService            调度任务服务
```

## 使用介绍

### 安装依赖包

``` powershell
dotnet add package Masa.Contrib.StackSdks.Scheduler
```

### 注册相关服务

```csharp
builder.Services.AddSchedulerClient("http://schedulerservice.com");
```

> `http://schedulerservice.com` 需要替换为真实的Scheduler后台服务地址

### 用例

1. 注册Http类型的Job

```csharp
var alertUrl = _configuration.ConfigurationApi.GetPublic().GetValue<string>("$public.AppSettings:AlertClient:Url");
var request = new AddSchedulerJobRequest
{
    ProjectIdentity = MasaStackConsts.ALERT_SYSTEM_ID,
    Name = alarmRule.DisplayName,
    JobType = JobTypes.Http,
    CronExpression = alarmRule.GetCronExpression(),
    OperatorId = alarmRule.Modifier,
    HttpConfig = new SchedulerJobHttpConfig
    {
        HttpMethod = HttpMethods.POST,
        RequestUrl = $"{alertUrl}/api/v1/AlarmRules/{alarmRule.Id}/check"//填写你要调用的业务接口
    }
};

var jobId = await _schedulerClient.SchedulerJobService.AddAsync(request);
```

2. 注册Job应用类型的Job

```csharp
var request = new AddSchedulerJobRequest
{
    ProjectIdentity = MasaStackConsts.MC_SYSTEM_ID,
    Name = jobName,
    JobType = JobTypes.JobApp,
    CronExpression = cronExpression,
    OperatorId = operatorId,
    JobAppConfig = new SchedulerJobAppConfig
    {
        JobAppIdentity = MessageTaskExecuteJobConsts.JOB_APP_IDENTITY,
        JobEntryAssembly = MessageTaskExecuteJobConsts.JOB_ENTRY_ASSEMBLY,
        JobEntryClassName = MessageTaskExecuteJobConsts.JOB_ENTRY_METHOD,
        JobParams = messageTaskId.ToString(),
    }
};

var jobId = await _schedulerClient.SchedulerJobService.AddAsync(request);
```

3. 自己的业务Job类，需要继承SchedulerJob类

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