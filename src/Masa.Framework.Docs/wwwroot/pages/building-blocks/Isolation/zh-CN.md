# Isolation (隔离性)

MASA Framework中提供了<font Color=Red>多租户</font>、<font Color=Red>多环境</font>应用程序的基本功能, 这将使得开发`多租户`、`多环境`的应用程序变得更加简单

## 能力

* 多租户

是一种软件体系结构, 其中<font Color=Red>单个软件实例</font>可以<font Color=Red>为多个租户提供服务</font>。租户可以自定义应用程序的某个部分，例如用户界面或业务规则的颜色，但他们无法自定义应用程序的代码。查看在维基百科中的[定义](https://zh.wikipedia.org/wiki/Multitenancy)

* 多环境

与多租户类似, 使用多环境技术可以实现<font Color=Red>部署一次</font>即可<font Color=Red>满足多个环境的需要</font>, 例如: 部署一次MASA Stack, 提供不同环境的配置信息, 就可以在`开发环境`、`测试环境`或者其它环境下使用MASA Stack的能力

> 隔离性保证了在当前场景 (当前租户或环境) 下，不会出现其它场景 (其它租户或环境)的数据

## 使用

### 必要条件

安装`Masa.Contrib.Isolation.XXX`

:::: code-group
::: code-group-item 多租户
```shell
dotnet add package Masa.Contrib.Isolation.MultiTenant
```
:::
::: code-group-item 多环境
```shell
dotnet add package Masa.Contrib.Isolation.MultiEnvironment
```
:::
::::

### 注册多租户/多环境

:::: code-group
::: code-group-item 注册多租户
```csharp
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddIsolation(isolationBuilder =>
{
    isolationBuilder.UseMultiTenant();
});

var app = builder.Build();

app.UseIsolation();

app.Run();
```
:::
::: code-group-item 注册多环境
```csharp
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddIsolation(isolationBuilder =>
{
    isolationBuilder.UseMultiEnvironment();
});

var app = builder.Build();

app.UseIsolation();

app.Run();
```
:::
::::

### 获取当前租户/环境

:::: code-group
::: code-group-item 获取当前租户
```csharp
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddIsolation(isolationBuilder =>
{
    isolationBuilder.UseMultiTenant();
});

var app = builder.Build();

app.UseIsolation();

app.MapGet("/", (IMultiTenantContext multiTenantContext) =>
{
    return multiTenantContext.CurrentTenant?.Id ?? "空";
});

app.Run();
```
:::
::: code-group-item 获取当前环境
```csharp
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddIsolation(isolationBuilder =>
{
    isolationBuilder.UseMultiEnvironment();
});

var app = builder.Build();

app.UseIsolation();

app.MapGet("/", (IMultiEnvironmentContext multiEnvironmentContext) =>
{
    return multiEnvironmentContext.CurrentEnvironment ?? "空";
});

app.Run();
```
:::
::::

### 设置当前租户/环境

:::: code-group
::: code-group-item `设置`当前租户
```csharp
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddIsolation(isolationBuilder =>
{
    isolationBuilder.UseMultiTenant();
});

var app = builder.Build();

app.UseIsolation();

app.MapGet("/", (IMultiTenantSetter multiTenantSetter, IMultiTenantContext multiTenantContext) =>
{
    var oldTenantId = multiTenantContext.CurrentTenant?.Id ?? "空";

    multiTenantSetter.SetTenant(new Tenant(Guid.NewGuid().ToString()));//设置当前租户id, 仅对当前请求生效

    var newTenantId = multiTenantContext.CurrentTenant?.Id ?? "空";
    return $"old: {oldTenantId}, new: {newTenantId}";
});

app.Run();
```
:::
::: code-group-item 设置当前环境
```csharp
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddIsolation(isolationBuilder =>
{
    isolationBuilder.UseMultiEnvironment();
});

var app = builder.Build();

app.UseIsolation();

app.MapGet("/", (IMultiEnvironmentSetter multiEnvironmentSetter, IMultiEnvironmentContext multiEnvironmentContext) =>
{
    var oldEnvironment = multiEnvironmentContext.CurrentEnvironment ?? "空";

    multiEnvironmentSetter.SetEnvironment("dev");//设置当前环境为dev, 仅对当前请求生效

    var newEnvironment = multiEnvironmentContext.CurrentEnvironment ?? "空";
    return $"old: {oldEnvironment}, new: {newEnvironment}";
});

app.Run();
```
:::
::::

<app-alert type="warning" content="隔离性提供了多租户、多环境的实现，通常情况下，它需要与数据、缓存等构建块共同使用"></app-alert>

## 高级

### 自定义多租户类型

默认多租户Id的类型为`Guid`，如果希望更改多租户Id的类型，有以下两种方式，例如：将租户id改为int

:::: code-group
::: code-group-item 方案1
```csharp
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddIsolation(isolationBuilder =>
{
    isolationBuilder.UseMultiTenant();
}, options =>
{
    options.MultiTenantIdType = typeof(int);
});

var app = builder.Build();

app.UseIsolation();

app.Run();
```
:::
::: code-group-item 方案2
```csharp
var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<IsolationOptions>(options =>
{
    options.MultiTenantIdType = typeof(int);
});

builder.Services.AddIsolation(isolationBuilder =>
{
    isolationBuilder.UseMultiTenant();
});

var app = builder.Build();

app.UseIsolation();

app.Run();
```
:::
::::

<app-alert type="warning" content="修改多租户Id类型后, 在定义实体时, 需要将继承的 IMultiTenant 改为 IMultiTenant<TMultiTenantIdType>, 更多信息可查看[文档](/framework/building-blocks/data/orm-efcore)"></app-alert>

### 自定义多租户/多环境解析器

#### 自定义多租户解析器

<font Color=Red>默认多租户提供了7个解析器</font>，其中租户参数名默认为: <font Color=Red>__tenant</font>，执行顺序为：

* CurrentUserTenantParseProvider: 通过从当前登录用户信息中获取租户信息
* HttpContextItemParserProvider: 通过请求的HttpContext的Items属性获取租户信息
* QueryStringParserProvider: 通过请求的QueryString获取租户信息
* FormParserProvider: 通过Form表单获取租户信息
* RouteParserProvider: 通过路由获取租户信息
* HeaderParserProvider: 通过请求头获取租户信息
* CookieParserProvider: 通过Cookie获取租户信息

> 多租户将根据以上解析器顺序依次执行解析, 直到解析成功

我们可以根据需要新增解析器并重新编排解析器

:::: code-group
::: code-group-item 自定义解析器
```csharp
using Masa.Contrib.Isolation.Parser;

namespace WebApplication1.Parser;

public class CustomMultiTenantParseProvider : IParserProvider
{
    public string Name => "自定义解析器名称";

    public Task<bool> ResolveAsync(HttpContext? httpContext, string key, Action<string> action)
    {
        var multiTenantId = "多租户id的值";//可根据httpContext解析获取多租户id的值
        action.Invoke(multiTenantId);

        if (multiTenantId.IsNullOrWhiteSpace())
            return Task.FromResult(false);

        return Task.FromResult(true);
    }
}
```
:::
::: code-group-item 编排自定义解析器
```csharp
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddIsolation(isolationBuilder =>
{
    isolationBuilder.UseMultiTenant(new List<IParserProvider>()
    {
        new CustomMultiTenantParseProvider()
    });
});

var app = builder.Build();

app.UseIsolation();

app.Run();
```
:::
::::

> 使用**UseMultiTenant**方法时可重新编排解析器, 并且需要传入完整的解析器集合, 它将覆盖默认解析器

#### 自定义多环境解析器

<font Color=Red>默认多环境提供了9个解析器</font>，其中租户参数名默认为: <font Color=Red>ASPNETCORE_ENVIRONMENT</font>，执行顺序为：

* CurrentUserEnvironmentParseProvider: 通过从当前登录用户信息中获取环境信息
* HttpContextItemParserProvider: 通过请求的HttpContext的Items属性获取环境信息
* QueryStringParserProvider: 通过请求的QueryString获取环境信息
* FormParserProvider: 通过Form表单获取环境信息
* RouteParserProvider: 通过路由获取环境信息
* HeaderParserProvider: 通过请求头获取环境信息
* CookieParserProvider: 通过Cookie获取环境信息
* MasaAppConfigureParserProvider: 通过全局配置参数 (**MasaAppConfigureOptions**) 中获取当前环境信息
* EnvironmentVariablesParserProvider: 通过环境变量提供程序获取当前环境信息

> 多环境将根据以上解析器顺序依次执行解析, 直到解析成功

我们可以根据需要新增解析器并重新编排解析器

:::: code-group
::: code-group-item 自定义解析器
```csharp
public class CustomMultiEnvironmentParseProvider : IParserProvider
{
    public string Name => "自定义解析器名称";

    public Task<bool> ResolveAsync(HttpContext? httpContext, string key, Action<string> action)
    {
        var multiEnvironment = "多环境的值";//可根据httpContext或其它方式解析获取多环境的值
        action.Invoke(multiEnvironment);

        if (multiEnvironment.IsNullOrWhiteSpace())
            return Task.FromResult(false);

        return Task.FromResult(true);
    }
}
```
:::
::: code-group-item 编排自定义解析器
```csharp
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddIsolation(isolationBuilder =>
{
    isolationBuilder.UseMultiEnvironment(new List<IParserProvider>()
    {
        new CustomMultiEnvironmentParseProvider()
    });
});

var app = builder.Build();

app.UseIsolation();

app.Run();
```
:::
::::

> 使用**UseMultiEnvironment**方法时可重新编排解析器, 并且需要传入完整的解析器集合, 它将覆盖默认解析器

### 自定义多租户/多环境参数名

使用多租户或多环境时, 我们可以通过指定参数名来修改默认参数名

:::: code-group
::: code-group-item 多租户
```csharp
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddIsolation(isolationBuilder =>
{
    isolationBuilder.UseMultiTenant("{自定义多租户参数名}");
});

var app = builder.Build();

app.UseIsolation();

app.Run();
```
:::
::: code-group-item 多环境
```csharp
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddIsolation(isolationBuilder =>
{
    isolationBuilder.UseMultiEnvironment("{自定义多环境参数名}");
});

var app = builder.Build();

app.UseIsolation();

app.Run();
```
:::
::::

### 配置来源

针对支持通过本地配置文件的构建块，以数据上下文为例，其配置满足以下规则:

```json
{
  "Isolation":{
    "ConnectionStrings":[
      {
        "TenantId":"00000000-0000-0000-0000-000000000002",
        "Environment":"*",
        "Score": 100,
        "Data":{
          "ConnectionString": "server=localhost,1674;uid=sa;pwd=P@ssw0rd;database=identity;"
        }
      },
      {
        "TenantId":"00000000-0000-0000-0000-000000000003",
        "Environment":"development",
        "Score": 100,
        "Data":{
          "ConnectionString": "server=localhost,1672;uid=sa;pwd=P@ssw0rd;database=identity;"
        }
      }
    ]
  }
}
```

* ConnectionStrings: Db连接字符串配置 (节点名与组件有关, 比如使用**分布式Redis缓存**时, 此节点名默认为: **RedisConfig**, 支持修改节点名)
* TenantId: 支持具体租户id或者*，不使用多租户时可删除此节点
  * 当其值为*时, 代表无论租户id是多少, 当前数据都满足
* Environment: 支持具体环境的值或者*，不使用多环境时可删除此节点
* Score: 分值 (当多个配置都满足条件时，选择使用分值最高的配置，当分值也相同时则取第一条满足配置的数据，默认：100)
* Data: 组件的配置信息 (它是一个对象, 其对象的配置信息与组件的配置信息一致，以**分布式Redis缓存**为例, 则配置信息为:)

  ```json
  {
    "Isolation":{
      "RedisConfig":[
        {
          "TenantId":"00000000-0000-0000-0000-000000000002",
          "Environment":"*",
          "Score":100,
          "Data":{
            "Servers":[
              {
                "Host":"localhost",
                "Port":6379
              }
            ],
            "DefaultDatabase":3
          }
        },
        {
          "TenantId":"00000000-0000-0000-0000-000000000003",
          "Environment":"development",
          "Score":100,
          "Data":{
            "Servers":[
              {
                "Host":"localhost",
                "Port":6379
              }
            ],
            "DefaultDatabase":4
          }
        }
      ]
    }
  }
  ```

  > 根据使用的构建块，查询对应的文档来修改读取组件的配置节点名

## 支持构建块

多租户，支持隔离性的构建块有: 

* AutoComplete (输入搜索)
* [Caching (缓存)](/framework/building-blocks/caching/overview#Isolation)
* [Caller (调用者)](/framework/building-blocks/caller/overview#Isolation)
* [Data (数据)]()
* RulesEngine (规则引擎)
* Storage (存储)

## 常见问题

### 1. 如何修改隔离性默认读取的节点名 Isolation

可通过以下两种方案来修改默认读取的节点名, 两种方案任选其一即可

:::: code-group
::: code-group-item 方案1
```csharp
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddIsolation(isolationBuilder =>
{
    isolationBuilder.UseMultiTenant();
}, options =>
{
    options.SectionName = "{自定义隔离性节点名}";
});

var app = builder.Build();

app.UseIsolation();

app.Run();
```
:::
::: code-group-item 方案2
```csharp
var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<IsolationOptions>(options =>
{
    options.SectionName = "{自定义隔离性节点名}";
});

builder.Services.AddIsolation(isolationBuilder =>
{
    isolationBuilder.UseMultiTenant();
});

var app = builder.Build();

app.UseIsolation();

app.Run();
```
:::
::::

### 2. 能否支持其它配置源而并非本地配置文件？

支持, 可通过以下两种方案支持其它配置源, 两种方案任选其一即可

* 方案1: 选项模式

使用选项模式配置指定`name`的配置信息, 以数据上下文为例

```csharp
var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<IsolationOptions<ConnectionStrings>>(options =>
{
    options.Data = new List<IsolationConfigurationOptions<ConnectionStrings>>()
    {
        new()
        {
            TenantId = "租户1",
            Data = new ConnectionStrings(new List<KeyValuePair<string, string>>()
            {
                new(ConnectionStrings.DEFAULT_CONNECTION_STRING_NAME, "租户1数据库连接字符串地址")
            })
        },
        new()
        {
            TenantId = "租户2",
            Data = new ConnectionStrings(new List<KeyValuePair<string, string>>()
            {
                new(ConnectionStrings.DEFAULT_CONNECTION_STRING_NAME, "租户2数据库连接字符串地址")
            })
        },
    };
});

builder.Services.AddIsolation(isolationBuilder =>
{
    isolationBuilder.UseMultiTenant();
});

var app = builder.Build();

app.Run();
```

> 数据上下文比较特殊, 其**name**的值为**空**, 不存在**name**不为空的情况, 其余支持自定义**name**的模块, 则需要通过**builder.Services.Configure<IsolationOptions<TComponentConfig>>("自定义name的值", options =>{ });**设置即可 (TComponentConfig为组件的配置对象, 详细可查看具体构建块的文档)

* 方案2: 自定义**IIsolationConfigProvider**

通过自定义**IIsolationConfigProvider**的实现类来支持其它配置源

:::: code-group
::: code-group-item 自定义隔离性配置提供程序
```csharp
public class CustomIsolationConfigProvider : IIsolationConfigProvider
{
    /// <summary>
    /// 获取当前租户/环境下指定配置节点下的配置信息（当返回null时，则使用当前组件默认的配置信息）
    /// </summary>
    /// <param name="sectionName">配置节点名 (不同组件的配置节点名不一致 (配置节点名支持自定义))</param>
    /// <param name="name">名称 （默认为空字符串，支持工厂的构建块支持自定义name）</param>
    /// <typeparam name="TComponentConfig">组件的配置对象</typeparam>
    /// <returns></returns>
    /// <exception cref="NotImplementedException"></exception>
    public TComponentConfig? GetComponentConfig<TComponentConfig>(string sectionName, string name = "") where TComponentConfig : class
    {
        // todo: 获取当前租户/环境下的组件配置信息并返回
        return default;
    }

    /// <summary>
    /// 获取指定配置节点的所有配置信息
    /// </summary>
    /// <param name="sectionName">配置节点名 (不同组件的配置节点名不一致 (配置节点名支持自定义))</param>
    /// <param name="name">名称 （默认为空字符串，支持工厂的构建块支持自定义name）</param>
    /// <typeparam name="TComponentConfig">组件的配置对象</typeparam>
    /// <returns></returns>
    public List<TComponentConfig> GetComponentConfigs<TComponentConfig>(string sectionName, string name = "") where TComponentConfig : class
    {
        //todo: 获取指定配置节点的所有配置信息
        var list = new List<TComponentConfig>();
        return list;
    }
}
```
:::
::: code-group-item 使用自定义隔离性配置提供程序
```csharp
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddScoped<IIsolationConfigProvider, CustomIsolationConfigProvider>();
builder.Services.AddIsolation(isolationBuilder =>
{
    isolationBuilder.UseMultiTenant();
});

var app = builder.Build();

app.Run();
```
:::
::::