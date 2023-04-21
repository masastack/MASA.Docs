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

```powershelll
Install-Package Masa.Contrib.StackSdks.Scheduler
```

### 注册相关服务

```csharp
builder.Services.AddSchedulerClient("http://schedulerservice.com");
```

> `http://schedulerservice.com` 需要替换为真实的Scheduler后台服务地址

### 用例

   - [`注册Job 应用`](stack/scheduler/use-guide/scheduler-job-app/#api_create)

   - [`注册Http`](stack/scheduler/use-guide/scheduler-http/#api_create)

   - [`注册Dapr`](stack/scheduler/use-guide/scheduler-dapr/#api_create)

