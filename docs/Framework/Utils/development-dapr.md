---
title: 协助管理Dapr Sidecar
date: 2022/07/21
---

## 介绍

为方便在开发过程中调试`使用了Dapr的应用程序，我们提供了以下包：

1. Development.Dapr: Dapr Starter核心功能库，包含`Dapr Sidecar`的启动、停止、配置刷新重启等操作
2. Development.Dapr.AspNetCore: 为Asp.NET Core的Web程序提供一站式方案，项目启动时会自动启动`Dapr Sidecar`，无需手动处理

## 必要条件

* [安装Dapr-Cli](https://docs.dapr.io/zh-hans/getting-started/install-dapr-cli/)并初始化[Dapr](https://docs.dapr.io/zh-hans/getting-started/install-dapr-selfhost/)
* [.NET 6.0](https://dotnet.microsoft.com/zh-cn/download/dotnet/6.0)
* 安装`Masa.Utils.Development.Dapr.AspNetCore`
``` C#
dotnet add package Masa.Utils.Development.Dapr.AspNetCore
```

## 如何使用

以下三种写法任选其一，未配置的必须参数会根据约定自动生成

1. 默认装配 (根据约定获取配置启动)

``` C#
builder.Services.AddDaprStarter();
```

2. 代码指定配置 + 约定

``` C#
builder.Services.AddDaprStarter(opt =>
{
    opt.AppPort = 5001;
    opt.DaprHttpPort = 8080;
    opt.DaprGrpcPort = 8081;
});
```

3. 根据`IConfiguration` + 约定

* 修改appsettings.json

``` appsettings.json
{
  "DaprOptions": {
    "AppId": "masa-dapr-test",
    "AppPort": 5001,
    "AppIdSuffix": "",
    "DaprHttpPort": 8080,
    "DaprGrpcPort": 8081
  }
}
```

* 指定配置

``` C#
builder.Services.AddDaprStarter(builder.Configuration.GetSection("DaprOptions"));
```

> 优势：更改appsettings.json配置后，dapr sidecar会自动更新，项目无需重启

## 约定

为更方便我们在项目中使用`Dapr Sidecar`，我们约定：

1. `dapr appid`生成规则: AppId + AppIdDelimiter + AppIdSuffix
   1. AppId: 项目名.Replace(“.”,”-“)
   2. AppIdDelimiter: -
   3. AppIdSuffix: 当前机器网卡地址

2. `AppPort`: 自动获取项目启动的端口
3. `DaprHttpPort`: 由`dapr run` 自动分配未使用的端口作为`Dapr Sidecar`的HTTP端口
4. `DaprGrpcPort`: 由`dapr run` 自动分配未使用的端口作为`Dapr Sidecar`的Grpc端口

## 注意事项

我们知道，使用`Dapr Sidecar`最少需要4个参数，它们分别是:

1. `appid`: dapr appid
2. `AppPort`: 应用程序的端口
3. `HttpPort`: 边车的HTTP端口
4. `GrpcPort`: 边车的GRPC端口

我们在使用时，最为方便的是使用默认装配，无需配置任何参数，项目启动时会自动启动`Dapr Sidecar`。但其存在劣势：

默认装配不会在项目启动时立即启动`Dapr Sidecar`，会延迟启动，因此使用默认装配启动的应用程序，请不要在后台任务中使用`DaprClient`，或者改为延迟获取`DaprClient`，确保`Dapr Sidecar`获取到正确的`HttpPort`、`GrpcPort`。

如果需要在后台任务中使用`DaprClient`，我们建议不要使用延迟启动`Dapr Sidecar`, 并为`AppPort`、`HttpPort`、`GrpcPort`赋值，确保开发的正常运行。

```
builder.Services.AddDaprStarter(opt =>
{
    opt.AppPort = 5001;
    opt.DaprHttpPort = 8080;
    opt.DaprGrpcPort = 8081;
}, false);
```