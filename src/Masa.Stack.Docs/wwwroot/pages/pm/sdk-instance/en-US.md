# SDK Example

## Introduction

`MASA.PM` provides an SDK to support accessing data from the `PM` system. By introducing the `Masa.Contrib.StackSdks.Pm` SDK, you can call `PM`'s `EnvironmentService`, `ClusterService`, `ProjectService`, and `AppService` to obtain environment data, cluster data, project data, and application data.

``` plain
IPmClient
├── EnvironmentService                  Environment Service
├── ClusterService                      Cluster Service
├── ProjectService                      Project Service
├── AppService                          Application Service
```

## Scenarios

When switching environments in `MASA.Auth`, you need to call `MASA.PM`'s SDK to obtain the corresponding environment list data.

When configuring application permissions in `MASA.Auth`, you need to use `MASA.PM`'s SDK to obtain the corresponding application data.

### Example

``` ps
dotnet add package Masa.Contrib.StackSdks.Pm
```

``` csharp
builder.Services.AddPmClient("PM service address");

var app = builder.Build();

app.MapGet("/GetProjectApps", ([FromServices] IPmClient pmClient) =>
{
    return pmClient.ProjectService.GetProjectAppsAsync("development");
});

app.Run();
```