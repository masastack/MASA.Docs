# Web应用程序开发教程 - 第一章: 创建服务端

## 概述

本章将通过**MASA Framework**提供的[**MinimalAPIs (最小API)**](/framework/building-blocks/minimal-apis)方案提供对外的增删改查服务

## 开始

1. 新建新建<font color=Red>ASP.NET Core 空项目</font>**Masa.EShop.Service.Catalog**用于提供API服务

```powershell
dotnet new web -o Masa.EShop.Service.Catalog
cd Masa.EShop.Service.Catalog
```

2. 选中<font color=Red>Masa.EShop.Service.Catalog</font>项目并安装<font color=Red>Masa.Contrib.Service.MinimalAPIs</font>

```shell
dotnet add package Masa.Contrib.Service.MinimalAPIs
```

或者直接修改**Masa.EShop.Service.Catalog.csproj**文件为:

```xml
<Project Sdk="Microsoft.NET.Sdk.Web">

  <PropertyGroup>
    <TargetFramework>net6.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Masa.Contrib.Service.MinimalAPIs" Version="$(MasaFrameworkPackageVersion)" />
  </ItemGroup>

</Project>
```

> **MasaFrameworkPackageVersion**: MASA Framework包版本，在[全局配置文件](/framework/contribution/recommend)中配置

<app-alert type="warning" content="推荐使用全局配置文件中的版本代替单独指定包版本，避免没有统一升级造成项目出错"></app-alert>

3. 注册 [MinimalAPIs (最小API)](/framework/building-blocks/minimal-apis), 修改`Program.cs`

:::: code-group
::: code-group-item 注册 MinimalAPIs 后
```csharp
var builder = WebApplication.CreateBuilder(args);
var app = builder.AddServices();

app.MapGet("/", () => "Hello World!");

app.Run();
```
:::
::: code-group-item 注册 MinimalAPIs 前
```csharp
var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.MapGet("/", () => "Hello World!");

app.Run();
```
:::
::::

4. 创建**CatalogItemService** (产品服务), 并<font Color=Red>需继承 ServiceBase</font>

**CatalogItemService**服务<font Color=Red>提供</font>产品的<font Color=Red>增删改查</font>

```csharp
using Masa.EShop.Contracts.Catalog.Dto;
using Masa.EShop.Service.Catalog.Application.Catalogs.Commands;
using Masa.Utils.Models;

namespace Masa.EShop.Service.Catalog.Services;

public class CatalogItemService : ServiceBase
{
    public Task<IResult> GetAsync(int id)
    {
        var catalogItemDto = new CatalogItemDto()
        {
            Id = 1,
            Name = "MASA Framework 教程"
        };

        return Task.FromResult(Results.Ok(catalogItemDto));
    }

    public Task<IResult> GetItemsAsync(
        int page = 0,
        int pageSize = 10)
    {
        var result = new PaginatedListBase<CatalogListItemDto>()
        {
            Total = 1,
            Result = new List<CatalogListItemDto>()
            {
                new()
                {
                    Id = 1,
                    Name = "MASA Framework 教程"
                }
            }
        };
        return Task.FromResult(Results.Ok(result));
    }

    public Task<IResult> CreateProductAsync(CreateProductCommand command)
    {
        //todo: 模拟删除
        return Task.FromResult(Results.Accepted());
    }

    public Task<IResult> DeleteProductAsync(int id)
    {
        //todo: 模拟删除
        return Task.FromResult(Results.Accepted());
    }
}
```

> 在`Masa.EShop.Service.Catalog`项目下创建`Services`文件夹用以存放各种API服务

* CreateProductCommand:

```csharp
namespace Masa.EShop.Service.Catalog.Application.Catalogs.Commands;

public record CreateProductCommand
{
    public string Name { get; set; } = default!;

    public string Description { get; set; } = string.Empty;

    public int CatalogBrandId { get; set; }

    public int CatalogTypeId { get; set; }

    public decimal Price { get; set; }

    public string? PictureFileName { get; set; }
}
```

* CatalogItemDto:

```csharp
namespace Masa.EShop.Contracts.Catalog.Dto;

public class CatalogItemDto
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public int CatalogBrandId { get; set; }

    public int CatalogTypeId { get; set; }

    public decimal Price { get; set; }

    public string PictureFileName { get; set; } = "default.png";
}
```

* CatalogListItemDto:

```csharp
namespace Masa.EShop.Contracts.Catalog.Dto;

public class CatalogListItemDto
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public decimal Price { get; set; }

    public string PictureFileName { get; set; } = "";

    public int CatalogTypeId { get; set; }

    public int CatalogBrandId { get; set; }

    public int AvailableStock { get; set; }
}
```

5. 注册Swagger、并使用SwaggerUI

:::: code-group
::: code-group-item 安装Swagger包
```shell
dotnet add package Swashbuckle.AspNetCore
```
:::
::: code-group-item 修改 Program.cs，注册并使用Swagger
```csharp
var builder = WebApplication.CreateBuilder(args);

#region 注册Swagger

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

#endregion

var app = builder.AddServices();

#region 使用Swaager

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

#endregion

app.MapGet("/", () => "Hello World!");

app.Run();
```
:::
::::

最终的文件夹/文件结构应该如下所示:

<div>
  <img alt="MinimalAPIs" src="https://s2.loli.net/2023/04/07/YHAqzxgsymR1pKr.png"/>
</div>

## Swagger UI

启动模板配置为使用[Swashbuckle.AspNetCore](https://github.com/domaindrivendev/Swashbuckle.AspNetCore)运行[swagger UI](https://swagger.io/tools/swagger-ui/)，运行应用程序 （Masa.EShop.Service.Catalog），并在浏览器中输入https://localhost:XXX/swagger/(用当前项目的端口替换XXX) 

你会看到当前项目所有的API服务,它们都是[RESTful](https://learn.microsoft.com/zh-cn/azure/architecture/best-practices/api-design)风格的API:

<div>
  <img alt="Swagger UI" src="https://s2.loli.net/2023/04/07/5AhWBZeTY72cagz.png"/>
</div>

我们可以通过Swagger的UI更方便的测试API

## 其它

通过[**MinimalAPIs**](/framework/building-blocks/minimal-apis)快速创建一个API服务，它不仅使用方便，并且比**MVC**有着更高的性能