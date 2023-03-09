---
title: MASA TSC SDK
date: 2022/12/28
---

### 简介

Stack.Tsc提供了获取TSC系统的Logs和Metrics数据，包含ILogService和IMetricService两个模块：

```csharp 
ITscClient
├──ILogService              日志查询服务
├──IMetricService           指标查询服务
```
### 使用

1. 安装包

```csharp 
dotnet add package Masa.Contrib.StackSdks.Tsc
```

2. 注册服务

```csharp 

builder.Services.AddTscClient("http://my.tsc-service.com");
```

3. 依赖注入ITscClient

```csharp 
var app = builder.Build();

app.MapGet("/log-mapping", ([FromServices] ITscClient tscClient) =>
{
    var mapping = tscClient.LogService.GetMappingAsync();

    // 利用mapping自定义查询条件统计日志信息，例如查询过去15分钟内 服务名称：service1  的错误日志总条数
    var query = new SimpleAggregateRequestDto
    {
        Start = time.AddMinutes(-15),            
        End = time,
        Name = "Resource.service.name",
        Type = AggregateTypes.Count,
        //服务
        Service="service1",
        //自定义条件
        Conditions=new FieldConditionDto[] {
            new FieldConditionDto{
                Name="SeverityText",
                Type= ConditionTypes.Equal,
                 Value="Error"
            }
        }
    };

    var count await _client.LogService.GetAggregationAsync<long>(query);
});

app.Run();
```