# 实战教程 - 第三章: 使用事件总线和读写分离

## 概述

本章将使用事件总线和读写分离，通过使用它们，将使得我们的应用程序维护性以及可读性更强

### 事件总线

通过使用[事件总线](/framework/building-blocks/dispatcher/local-event)，摆脱流水账式编程，摆脱强耦合

> 本文中提到的事件总线如未加特殊说明，均指的是`进程内事件总线`

### 读写分离

在读写分离架构中，<font Color=Red>读取和写入存储可以具有完全不同的结构</font>，通过优化读模型可以提升查询性能。

根据事件类型不同，我们将事件分为`Command （命令）`、`Query （查询）`，`Command （命令）`对应写入模型，`Query （查询）`对应查询模型

> 本教程中将不再创建读模型，而使用与写入模型完全一致的数据库，但会创建一个`QueryCatalogDbContext`用来标记当前使用的是读模型

## 开始

1. 选中 `Masa.EShop.Service.Catalog`</font>项目并安装 `Masa.Contrib.Dispatcher.Events`、 `Masa.Contrib.Dispatcher.Events.FluentValidation`

```shell
dotnet add package Masa.Contrib.Dispatcher.Events
dotnet add package Masa.Contrib.Dispatcher.Events.FluentValidation
```

或者直接修改 **Masa.EShop.Service.Catalog.csproj** 文件为:

```xml
<Project Sdk="Microsoft.NET.Sdk.Web">

  <PropertyGroup>
    <TargetFramework>net6.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Masa.Contrib.Dispatcher.Events" Version="$(MasaFrameworkPackageVersion)" />
    <PackageReference Include="Masa.Contrib.Dispatcher.Events.FluentValidation" Version="$(MasaFrameworkPackageVersion)" />
    <!-- 省略其它已安装的nuget包 -->
  </ItemGroup>

</Project>
```

> `Masa.Contrib.Dispatcher.Events.FluentValidation`提供了基于`FluentValidation`的验证中间件，用于事件总线在发布事件后完成参数验证操作，如果不需要可以不添加引用

2. 注册[事件总线](/framework/building-blocks/dispatcher/local-event)，修改`Program.cs`

```csharp
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEventBus(eventBusBuilder => eventBusBuilder.UseMiddleware(typeof(ValidatorEventMiddleware<>)));

-----省略其余服务注册-----

var app = builder.AddServices();//未使用MinimalAPis的项目时，为`var app = builder.Build();`

-----省略使用中间件、Swagger等-----

app.Run();
```

> 注册事件总线在**AddServices**之前即可

3. 修改`CreateProductCommand.cs`，使其继承`Commmand`

```csharp
using Masa.BuildingBlocks.ReadWriteSplitting.Cqrs.Commands;

namespace Masa.EShop.Service.Catalog.Application.Catalogs.Commands;

public record CreateProductCommand : Command
{
    public string Name { get; set; } = default!;

    public int CatalogBrandId { get; set; }

    public int CatalogTypeId { get; set; }

    public decimal Price { get; set; }

    public string? PictureFileName { get; set; }

    public int Stock { get; set; }
}
```

