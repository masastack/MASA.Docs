# Isolation - Multi-Environment

## Overview

With just a few lines of code, developers can deploy an application service that supports multiple environments.

> Data isolation, shared application service

## Usage

1. Install Multi-Environment

   ```shell Terminal
   dotnet add package Masa.Contrib.Isolation.MultiEnvironment
   ```

2. Register Multi-Environment

   ```csharp Program.cs l:2-5,9
   var builder = WebApplication.CreateBuilder(args);
   builder.Services.AddIsolation(isolationBuilder =>
   {
       isolationBuilder.UseMultiEnvironment();
   });
   
   var app = builder.Build();
   
   app.UseIsolation();
   
   app.Run();
   ```

3. Get the Current Environment

   ```csharp Program.cs l:11-14
   var builder = WebApplication.CreateBuilder(args);
   builder.Services.AddIsolation(isolationBuilder =>
   {
       isolationBuilder.UseMultiTenant();
   });
   
   var app = builder.Build();
   
   app.UseIsolation();
   
   app.MapGet("/", (IMultiTenantContext multiTenantContext) =>
   {
       return multiTenantContext.CurrentTenant?.Id1. Introduction

In this code snippet, we have a C# program that demonstrates how to use the `IMultiEnvironment` interface to manage multiple environments in a web application. The program shows how to set up and use the `IMultiEnvironment` interface to switch between different environments, such as development, testing, and production.

2. Setting up the environment

To set up the environment, we first create a new `WebApplication` instance using the `WebApplication.CreateBuilder` method. We then add the `IMultiEnvironment` service to the application's service collection using the `AddIsolation` method. Finally, we build the application using the `Build` method.

```csharp Program.cs l:5-9
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddIsolation();
var app = builder.Build();
```

3. Switching between environments

To switch between environments, we use the `IMultiEnvironmentSetter` interface to set the current environment. We can then use the `IMultiEnvironmentContext` interface to get the current environment.

```csharp Program.cs l:13-21
app.MapGet("/", (IMultiEnvironmentSetter multiEnvironmentSetter, IMultiEnvironmentContext multiEnvironmentContext) =>
{
    var oldEnvironment = multiEnvironmentContext.CurrentEnvironment ?? "empty";

    multiEnvironmentSetter.SetEnvironment("dev");//Set the current environment to dev, only valid for the current request

    var newEnvironment = multiEnvironmentContext.CurrentEnvironment ?? "empty";
    return $"old: {oldEnvironment}, new: {newEnvironment}";
});

app.Run();
```

4. Setting the current environment

To set the current environment, we use the `IMultiEnvironmentSetter` interface to set the environment for the current request. This setting is only valid for the current request and does not affect other requests.

```csharp Program.cs l:13-21
multiEnvironmentSetter.SetEnvironment("dev");//Set the current environment to dev, only valid for the current request
```

## Advanced usage

### Custom environment parser

````

### Translated:

```csharp
public class CustomMultiEnvironmentParserProvider : IParserProvider
{
    public string Name => "CustomMultiEnvironment";

    public Task<bool> ResolveAsync(HttpContext? httpContext, string key, Action<string> action)
    {
        var multiEnvironment = "The value of the multi-environment id";//The value of multiple environments can be parsed and obtained according to httpContext or other methods
        action.Invoke(multiEnvironment);

        if (multiEnvironment.IsNullOrWhiteSpace())
            return Task.FromResult(false);

        return Task.FromResult(true);
    }
}
```

### Orchestrating Environment Parsers

```csharp Program.cs l:5-8
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddIsolation(isolationBuilder =>
{
    isolationBuilder.UseMultiEnvironment(new List<IParserProvider>()
    {
        new CustomMultiEnvironmentParserProvider()
    });
```ctionString": "server=localhost,1433;uid=sa;pwd=P@ssw0rd;database=identity_dev;"
        }
      },
      {
        "Environment":"production",
        "Score": 100,
        "Data":{
          "ConnectionString": "server=prod-server;uid=sa;pwd=P@ssw0rd;database=identity_prod;"
        }
      }
    ]
  }
}
```

以上配置规则表示：

- `ConnectionStrings` 是一个数组，包含多个连接字符串配置
- 每个连接字符串配置包含三个属性：`Environment`、`Score` 和 `Data`
- `Environment` 表示该连接字符串适用的环境，可以是 `*`（通配符，表示适用于所有环境）或具体的环境名称（如 `development`、`production` 等）
- `Score` 表示该连接字符串的优先级，数值越大优先级越高，当多个连接字符串适用于同一个环境时，会选择优先级最高的连接字符串
- `Data` 表示该连接字符串的具体配置，可以包含任意的属性和值，根据实际需要进行配置即可。serProvider：通过 MasaAppConfigure 配置文件获取环境信息

* DefaultEnvironmentParserProvider：默认环境解析器，如果以上所有解析器都无法获取环境信息，则使用默认环境

### 配置文件解析器

<font Color=Red>默认提供了 4 种配置文件解析器</font>，分别是：

* JsonConfigurationProvider：解析 JSON 格式的配置文件

* XmlConfigurationProvider：解析 XML 格式的配置文件

* IniConfigurationProvider：解析 INI 格式的配置文件

* MemoryConfigurationProvider：将内存中的数据作为配置文件

### 配置文件变更监控

<font Color=Red>默认提供了 3 种配置文件变更监控器</font>，分别是：

* ConfigurationReloadToken：基于 CancellationToken 实现的配置文件变更监控器

* ConfigurationChangeTokenSource：基于 IChangeToken 实现的配置文件变更监控器

* ConfigurationReloadOnChanged：基于 IChangeToken 实现的配置文件变更监控器，当配置文件发生变更时，自动重新加载配置文件

### 配置文件合并

<font Color=Red>默认提供了 2 种配置文件合并器</font>，分别是：

* ConfigurationMerger：将多个配置文件合并成一个

* ConfigurationMergerWithEnvironment：将多个配置文件合并成一个，并根据环境变量进行覆盖和合并

### 配置文件加密

<font Color=Red>默认提供了 2 种配置文件加密器</font>，分别是：

* ConfigurationProtector：基于 Data Protection API 实现的配置文件加密器

* ConfigurationProtectorWithDPAPI：基于 DPAPI 实现的配置文件加密器

### 配置文件格式化

<font Color=Red>默认提供了 2 种配置文件格式化器</font>，分别是：

* JsonConfigurationFormatter：将配置文件格式化为 JSON 格式

* XmlConfigurationFormatter：将配置文件格式化为 XML 格式serProvider: Retrieves current environment information through the global configuration parameters (**MasaAppConfigureOptions**).

> When using global configuration parameters, the parameter names for configuring multiple environments will not take effect.

* EnvironmentVariablesParserProvider: Retrieves current environment information through the environment variable provider.

> When there are multiple environments, the above parsers will be executed in order until a successful parsing is achieved.