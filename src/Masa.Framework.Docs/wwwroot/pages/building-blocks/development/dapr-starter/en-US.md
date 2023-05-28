# Development - DaprStarter

## Overview

To facilitate the use of `Dapr` during development without the need for a `Kubernetes` or `Docker Compose` environment, and without the need to manually start the `dapr sidecar`, `DaprStarter` is provided to assist in managing the `dapr sidecar`.

The following packages are provided in the MASA Framework:

* [`Masa.Contrib.Development.DaprStarter`](https://nuget.org/packages/Masa.Contrib.Development.DaprStarter): The core library for `Dapr Starter`, which includes operations such as starting and stopping the `dapr sidecar`.
* [`Masa.Contrib.Development.DaprStarter.AspNetCore`](https://nuget.org/packages/Masa.Contrib.Development.DaprStarter.AspNetCore): A one-stop solution for `Asp.Net Core` web applications, which automatically starts the `dapr sidecar` when the project is launched.

## Usage

1. [Install Dapr-Cli](https://docs.dapr.io/getting-started/install-dapr-cli/) and initialize [Dapr](https://docs.dapr.io/getting-started/install-dapr-selfhost/).

2. Install `Masa.Contrib.Development.DaprStarter.AspNetCore`:

   ```shell
   dotnet add package Masa.Contrib.Development.DaprStarter.AspNetCore
   ```

3. Start `DaprStarter`.sharp Program.cs l:2-6
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDaprStarter(builder.Configuration.GetSection("DaprOptions"));
```

::::sharp Program.cs l:2
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDaprStarter();

Translation:
In line 2 of Program.cs, a new instance of `WebApplication` is created using the `CreateBuilder` method with the `args` parameter. Then, the `AddDaprStarter` method is called on the `Services` property of the `builder` object. This allows for the automatic updating of the `dapr sidecar` after changes are made to the `appsettings.json` configuration file, without the need to restart the project.

In terms of configuration, the priority is given to code-specific settings over generated settings based on rules. The rules for generating the `dapr appid` are as follows: the `AppId` is the project name with periods replaced by hyphens, the `AppIdDelimiter` is a hyphen, and the `AppIdSuffix` is the current machine's network card address (by default). If the `AppId` is specified, it takes precedence over the global `AppId`, which in turn takes precedence over the generated `AppId`. The `AppPort` is automatically obtained, and if the `DaprHttpPort` is not specified through code, configuration files, or environment variables, it is automatically assigned by `dapr run`.BackgroundService` 可以帮助你实现这一点）。另外，如果你需要自定义 `Dapr Sidecar` 的端口，可以通过配置文件或者环境变量来指定。The `Starter` will assist in completing the `DaprHttpPort` and `DaprGrpcPort` port information. If the `DaprClient` instance is obtained before the `DaprStarter` is started, the result will be an incorrect port configuration, with `HttpPort` set to 3500 and `GRpcPort` set to 50001. This will ultimately lead to errors when using `dapr` functionality.

If you need to use `DaprClient` in a background task, we recommend not using **delayed start** for `Dapr Sidecar`, and at least assigning a value to `AppPort` to ensure proper operation of your development.

```
builder.Services.AddDaprStarter(opt =>
{
    opt.AppPort = 5001;
}, false);
```