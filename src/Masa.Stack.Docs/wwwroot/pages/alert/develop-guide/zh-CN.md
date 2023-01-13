---
title: 开发指南
date: 2023/01/12 15:26:00
---

## 可观测性接入

1. 安装包：

```c#
Install-Package Masa.Contrib.StackSdks.Tsc
```

2. 修改`appsettings.json`，配置所需参数

```json
{
  "Masa": {
    "Observable": {
      "ServiceName": "masa-alert-service",
      "ServiceNameSpace": "Development",
      "ServiceVersion": "1.0.0",
      "OtlpUrl": ""//填写实际的OpenTelemetry地址
    }
  }
}
```
3. 接入可观测性，会自动采集数据到OpenTelemetry

```c#
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddObservable(builder.Logging, builder.Configuration);
```