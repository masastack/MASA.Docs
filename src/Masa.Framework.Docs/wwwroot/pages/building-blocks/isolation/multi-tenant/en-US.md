## Isolation - Multi-tenancy

### Overview

Multi-tenancy is a software architecture where a single software instance can serve multiple tenants. Tenants can customize certain parts of the application, such as the user interface or business rules' colors, but they cannot customize the application's code. For more information, please refer to the [definition](https://en.wikipedia.org/wiki/Multitenancy) on Wikipedia.

### Usage

1. Install multi-tenancy

   ```shell
   dotnet add package Masa.Contrib.Isolation.MultiTenant
   ```

2. Register multi-tenancy

   ```csharp Program.cs l:2-5,9
   var builder = WebApplication.CreateBuilder(args);
   builder.Services.AddIsolation(isolationBuilder =>
   {
       isolationBuilder.UseMultiTenant();
   });
   
   var app = builder.Build();
   
   app.UseIsolation();
   
   app.Run();
   ```

3. Get the current tenant

   ```csharp Program.cs l:11-14
   var builder = WebApplication.CreateBuilder(args);
   builder.Services.AddIsolation(isolationBuilder =>
   {
       isolationBuilder.UseMultiTenant();
   });
   
   var app = builder.Build();
   
   app.UseIsolation();
   ```The following code is written in C# and demonstrates how to use multi-tenancy in a web application. The first block of code sets up a route for the root URL ("/") and returns the current tenant's ID if it exists, or "Empty" if it does not. The second block of code sets up the web application and adds multi-tenancy support. It then uses the multi-tenancy middleware and sets the current tenant to a new randomly generated ID for the duration of the current request. The route handler then retrieves the old and new tenant IDs and returns them in a string.注意：本文中的代码示例为 C# 代码，如果需要翻译其他语言的代码，请提供具体的代码示例。on.CreateBuilder(args);

builder.Services.AddMultiTenancy<Tenant, int>()
    .WithResolutionStrategy<HeaderResolutionStrategy>()
    .WithStore<InMemoryTenantStore>()
    .WithParser<CustomMultiTenantParserProvider>();

var app = builder.Build();

app.UseMultiTenancy<Tenant, int>();

app.Run();
```

This code snippet provides instructions on how to modify the `ID` type for multi-tenancy and how to define a custom multi-tenant parser in C#. It also includes an example of how to configure the multi-tenant parser.The code above is written in C# and it creates a builder object using the `on.CreateBuilder(args)` method. It then adds an isolation service using the `AddIsolation` method and configures it to use a custom multi-tenant parser provider. The builder is then used to create an application object, which is configured to use the isolation service and run the application.

The `UseMultiTenant` method can be used to rearrange the parser and requires passing in a complete set of parsers, which will override the default parser.

To customize the multi-tenant parameter name, the `UseMultiTenant` method can be passed a string parameter with the desired name.

The configuration rules can be set in the `appsettings.json` file, which includes a `ConnectionStrings` array with objects containing `TenantId`, `Score`, and `Data` properties. The `Data` property includes a `ConnectionString` value for each tenant.ngTenantParserProvider: 通过请求的查询字符串获取租户信息
* RouteTenantParserProvider: 通过请求的路由信息获取租户信息
* HeaderTenantParserProvider: 通过请求的头部信息获取租户信息
* CookieTenantParserProvider: 通过请求的 Cookie 信息获取租户信息
* DefaultTenantParserProvider: 默认租户解析器，返回默认租户信息

### 配置解析器

<font Color=Red>默认提供了两个配置解析器</font>：

* JsonConfigurationParser: 解析 JSON 格式的配置文件
* XmlConfigurationParser: 解析 XML 格式的配置文件

### 配置管理器

<font Color=Red>默认提供了两个配置管理器</font>：

* InMemoryConfigManager: 将配置信息存储在内存中
* FileConfigManager: 将配置信息存储在文件中

### 配置源

<font Color=Red>默认提供了两个配置源</font>：

* ConfigServerConfigurationSource: 从配置中心获取配置信息
* LocalConfigurationSource: 从本地获取配置信息

### 配置变更监听器

<font Color=Red>默认提供了两个配置变更监听器</font>：

* ConfigServerConfigurationChangeListener: 监听配置中心的配置变更
* LocalConfigurationChangeListener: 监听本地配置文件的变更ngParserProvider: Retrieves tenant information from the requested `QueryString`.
* FormParserProvider: Retrieves tenant information from the `Form`.
* RouteParserProvider: Retrieves tenant information from the route.
* HeaderParserProvider: Retrieves tenant information from the request header.
* CookieParserProvider: Retrieves tenant information from the `Cookie`.

> For multi-tenant applications, the parsers will be executed in the order listed above until a successful retrieval is made.