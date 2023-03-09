---
title: SDK示例
date: 2022/09/29
---

### 简介

MASA.PM提供了SDK以支持获取PM系统的数据。通过引入`Masa.Contrib.StackSdks.Pm`SDK，可以调用PM的EnvironmentService、ClusterService、ProjectService、AppService来获取环境数据、集群数据、项目数据和应用数据。

```
IPmClient
├── EnvironmentService                  环境服务
├── ClusterService                      集群服务
├── ProjectService                      项目服务
├── AppService                          应用服务
```

### 场景

1. MASA.Auth切换环境时就需要调用MASA.PM的SDK去获取相应的环境列表数据
2. MASA.Auth配置应用的权限时需要通过MASA.PM的SDK去获取相应的应用数据

### 用例

```
Install-Package Masa.Contrib.StackSdks.Pm
```

```csharp 
builder.Services.AddPmClient("Pm服务地址");

var app = builder.Build();

app.MapGet("/GetProjectApps", ([FromServices] IPmClient pmClient) =>
{
    return pmClient.ProjectService.GetProjectAppsAsync("development");
});

app.Run();
```

