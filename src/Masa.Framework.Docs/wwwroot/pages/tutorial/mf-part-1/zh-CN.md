# 实战教程 - 第一章: 创建服务端

## 概述

本章将通过 **MASA Framework** 提供的[**MinimalAPIs (最小API)**](/framework/building-blocks/minimal-apis)提供对外的增删改查服务

> 暂时使用内存数据作为数据源，后续将更换为`Sqlite`数据库

## 开始

1. 新建<font color=Red>ASP.NET Core 空项目</font>`Masa.EShop.Service.Catalog`用于<font color=Red>提供API服务</font>

```powershell
dotnet new web -o Masa.EShop.Service.Catalog
cd Masa.EShop.Service.Catalog
```

2. 选中 `Masa.EShop.Service.Catalog` 项目并安装 `Masa.Contrib.Service.MinimalAPIs`

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

> **MasaFrameworkPackageVersion**: MASA Framework包的版本，在[全局配置文件](/framework/contribution/recommend)中配置

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

4. 创建`CatalogItemService` (产品服务), 并需 <font Color=Red>继承</font> `ServiceBase`

`CatalogItemService`服务<font Color=Red>提供</font>产品的<font Color=Red>增删改查</font>

```csharp
using System.Linq.Expressions;
using Masa.EShop.Contracts.Catalog.Dto;
using Masa.EShop.Service.Catalog.Application.Catalogs.Commands;
using Masa.Utils.Models;

namespace Masa.EShop.Service.Catalog.Services;

public class CatalogItemService : ServiceBase
{
    private readonly List<CatalogListItemDto> _data = new();

    public Task<IResult> GetAsync(int id)
    {
        if (id <= 0)
            throw new UserFriendlyException("商品id必须大于0");

        var productInfo = _data.FirstOrDefault(item => item.Id == id);
        if (productInfo == null)
            throw new UserFriendlyException("不存在的产品");

        return Task.FromResult(Results.Ok(productInfo));
    }

    /// <summary>
    /// `PaginatedListBase`由**Masa.Utils.Models.Config**提供, 如需使用，请安装`Masa.Utils.Models.Config`
    /// </summary>
    /// <param name="name"></param>
    /// <param name="page"></param>
    /// <param name="pageSize"></param>
    /// <returns></returns>
    public Task<IResult> GetItemsAsync(
        string name,
        int page = 0,
        int pageSize = 10)
    {
        if (page <= 0)
            throw new UserFriendlyException("页码必须大于0");
        
        if (pageSize <= 0)
            throw new UserFriendlyException("页大小必须大于0");

        Expression<Func<CatalogListItemDto, bool>> condition = item => true;
        condition = condition.And(!name.IsNullOrWhiteSpace(), item => item.Name.Contains(name));

        var total = _data.Where(condition.Compile()).LongCount();
        var list = _data.Where(condition.Compile()).Skip((page - 1) * pageSize).Take(pageSize).ToList();

        var pageData = new PaginatedListBase<CatalogListItemDto>()
        {
            Total = total,
            TotalPages = (int)Math.Ceiling((double)total/ pageSize),
            Result = list
        };
        return Task.FromResult(Results.Ok(pageData));
    }

    public Task<IResult> CreateProductAsync(CreateProductCommand command)
    {
        if (command.Name.IsNullOrWhiteSpace())
            throw new UserFriendlyException("产品名不能为空");

        _data.Add(new CatalogListItemDto()
        {
            Id = _data.Select(item => item.Id).Max() + 1,
            Name = command.Name,
            Price = command.Price,
            PictureFileName = command.PictureFileName ?? "default.png",
            CatalogBrandId = command.CatalogBrandId,
            CatalogTypeId = command.CatalogTypeId,
            Stock = command.Stock
        });
        return Task.FromResult(Results.Accepted());
    }

    public Task<IResult> DeleteProductAsync(int id)
    {
        if (id <= 0)
            throw new UserFriendlyException("商品id必须大于0");

        var productInfo = _data.FirstOrDefault(item => item.Id == id);
        if (productInfo == null)
            throw new UserFriendlyException("不存在的产品");

        _data.Remove(productInfo);
        return Task.FromResult(Results.Accepted());
    }
}
```

> 在`Masa.EShop.Service.Catalog`项目下创建`Services`文件夹用以存放各种API服务

CreateProductCommand（创建商品）、CatalogItemDto（商品详情）、CatalogListItemDto（商品列表）:

:::: code-group
::: code-group-item CreateProductCommand
```csharp
namespace Masa.EShop.Service.Catalog.Application.Catalogs.Commands;

public record CreateProductCommand
{
    public string Name { get; set; } = default!;

    public int CatalogBrandId { get; set; }

    public int CatalogTypeId { get; set; }

    public decimal Price { get; set; }

    public string? PictureFileName { get; set; }

    public int Stock { get; set; }
}
```
:::
::: code-group-item CatalogItemDto
```csharp
namespace Masa.EShop.Contracts.Catalog.Dto;

public class CatalogItemDto
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public int CatalogBrandId { get; set; }

    public int CatalogTypeId { get; set; }

    public decimal Price { get; set; }

    public string PictureFileName { get; set; } = "default.png";
}
```
:::
::: code-group-item CatalogListItemDto
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

    public int Stock { get; set; }
}
```
:::
::::

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

> **Masa.EShop.Contracts.Catalog**类库是产品的规约，用于存放产品服务与其它项目共享的文件

## Swagger UI

启动模板配置为使用[Swashbuckle.AspNetCore](https://github.com/domaindrivendev/Swashbuckle.AspNetCore)运行[swagger UI](https://swagger.io/tools/swagger-ui/)，运行应用程序 （Masa.EShop.Service.Catalog），并在浏览器中输入https://localhost:XXX/swagger/(用当前项目的端口替换XXX) 

你会看到当前项目所有的API服务,它们都是[RESTful](https://learn.microsoft.com/zh-cn/azure/architecture/best-practices/api-design)风格的API:

<div>
  <img alt="Swagger UI" src="https://s2.loli.net/2023/04/07/5AhWBZeTY72cagz.png"/>
</div>

我们可以通过Swagger的UI更方便的测试API

## 其它

通过[**MinimalAPIs**](/framework/building-blocks/minimal-apis)快速创建一个API服务，它不仅使用方便，并且比**MVC**有着更高的性能