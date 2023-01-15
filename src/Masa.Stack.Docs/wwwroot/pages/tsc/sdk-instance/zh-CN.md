---
title: MASA TSC SDK
date: 2022/12/28
---

### 简介

Stack.Tsc提供了获取TSC系统的Logs和Metrics数据，包含ILogService和IMetricService两个模块：

```C#
ITscClient
├──ILogService              日志查询服务
├──IMetricService           指标查询服务
```
### 使用

1. 安装包

``` C#
dotnet add package Masa.Contrib.StackSdks.Tsc
```

2. 注册服务

``` C#

builder.Services.AddTscClient("http://my.tsc-service.com");
```

3. 依赖注入ITscClient

```C#
var app = builder.Build();

app.MapGet("/log-mapping", ([FromServices] ITscClient tscClient) =>
{
    return tscClient.LogService.GetMappingAsync();
});

app.Run();
```