---
title: 可观测性
date: 2022/12/07
---

## 概念

可观测提供了对现代分布式系统的深入可见性，以便更快、自动地识别和解决问题。

一般而言，可观测性是指您仅根据对复杂系统外部输出的了解就可以了解其内部状态或条件的程度。系统的可观测性越强，您就可以越快、越准确地从已识别的性能问题导航到其根本原因，而无需进行额外的测试或编码。

在 IT 和云计算中，可观测性还指用于聚合、关联和分析来自分布式应用程序及其运行的硬件和网络的稳定性能数据流的软件工具和实践，以便更有效地监控、故障排除和调试应用程序和网络以满足客户体验期望、服务水平协议 (SLA) 和其他业务要求。

基于[Opentelemetry](https://opentelemetry.io/docs/)的可观测性接入，使用标准的OTLPExporter，[Logs](https://opentelemetry.io/docs/concepts/observability-primer/#logs)和[Traces](https://opentelemetry.io/docs/concepts/observability-primer/#distributed-traces)的持久化采用[Elasticsearch](https://www.elastic.co/cn/elasticsearch/)，[Metrics](https://opentelemetry.io/docs/concepts/observability-primer/#reliability--metrics)持久化采用[Prometheus](https://prometheus.io/)。

### Metrics
 当前只集成了`Opentelemetry`，采集的`Metric`范围较少，可以根据需求，添加第三方更为成熟的`Metric`监测库，或自定义添加，可参考[Metrics](https://learn.microsoft.com/en-us/dotnet/core/diagnostics/metrics)

### Traces
当前主要集成了http和DataBase(EF core模式)链路追踪，链路相关详细资料可参见[Distributed tracing](https://learn.microsoft.com/en-us/dotnet/core/diagnostics/distributed-tracing)和[Collect a distributed trace](https://learn.microsoft.com/en-us/dotnet/core/diagnostics/distributed-tracing-collection-walkthroughs?source=recommendations)。

#### Logs
通过集成`Opentelemetry`后，直接使用[ILogger](https://learn.microsoft.com/en-us/dotnet/core/extensions/logging?tabs=command-line)记录日志，日志或自动与相关的trace相关联，在通过相关日志排查问题时，可以根据链路traceId查找相关的链路信息，更利于问题排查。

### 功能

1. [更加便捷的集成Opentelemetry，收集可观性数据](#集成Opentelemetry)；
2. Traces、Logs和Metrics的查询统计;
3. 可观测性的开放能力。

## 集成

安装包

``` C#
dotnet add package Masa.Contrib.StackSdks.Tsc
```

### 入门

``` C#
var options = new MasaObservableOptions
{
    //服务名称，必须配置
    ServiceName = "my-project-api",
    //环境，例如开发、测试、生产等，可不配置
    ServiceNameSpace = "development",
    //服务版本号，可不配置
    ServiceVersion = "1.0"
};
//otlpUrl默认为 "http://localhost:4717"
builder.Services.AddObservable(builder.Logging, options);
```
> [OTLP服务相关部署和配置](https://opentelemetry.io/docs/collector/)

应用程序启动后，该应用在进行可观测性监测时，服务名称为：`my-project-api`，环境为：`development`,服务版本号为：`1.0`,这些参数在服务启动时就已经被确定，运行期间不能被更改，如果想了解更多的参数配置，可参考[Resource Semantic Conventions](https://github.com/open-telemetry/opentelemetry-specification/tree/main/specification/resource/semantic_conventions#service)

### 高级

1. 如果想完全自定义可观测性的配置，可以参考[OpenTelemetry for netcore](https://opentelemetry.io/docs/instrumentation/net/getting-started/);
2. 在我们的框架范围内实现自定义配置：

#### Log

以下示例为单独添加Log遥测数据收集的例子，还添加了应用的自定义标识`custom-key-1`和`custom-key-2`

``` C#
builder.Logging.AddMasaOpenTelemetry(options => {
    var resourceBuilder = ResourceBuilder.CreateDefault();
    resourceBuilder.AddService("my-project-api", 
            serviceNamespace:"development", 
            serviceVersion:"1.0");
    resourceBuilder.AddAttributes(new KeyValuePair<string, object>[]{
        new KeyValuePair<string, object>("custom-key-1","custom-value-1"),
        new KeyValuePair<string, object>("custom-key-2","custom-value-2")
    });

    options.SetResourceBuilder(resourceBuilder);
    options.AddOtlpExporter(ops =>
    {
        ops.Endpoint = new Uri("https://otlpservice.io");
    });            
})
```

实例默认将遥测数据导出到OTLP服务，如果您想更改导出器，只需替换`options.AddOtlpExporter`为您所需要的即可


#### Trace

``` C#
builder.Services.AddMasaTracing(builder =>
{
    var resourceBuilder = ResourceBuilder.CreateDefault();
    ....

    //balzor应用和api应用在链路的过滤执行条件上有区别
    if (isBlazor)
        builder.AspNetCoreInstrumentationOptions.AppendBlazorFilter(builder);
    else
        builder.AspNetCoreInstrumentationOptions.AppendDefaultFilter(builder);

    builder.BuildTraceCallback = options =>
    {
        options.SetResourceBuilder(resourceBuilder);
        options.AddOtlpExporter();
    };
});
```

`resourceBuilder`创建参考[Log](#log)，此处需要明确下，由于在netcore6.0中，[基于`SignalR`的长链接，在链路处理上存在无法区分链路的问题](https://github.com/dotnet/aspnetcore/issues/29846)，当前我们采用了忽略长链接的链路，后续官方版本升级时，我们也会跟进和修正该问题。

#### Metric

``` C#
builder.Services.AddMasaMetrics(builder =>
{
    var resourceBuilder = ResourceBuilder.CreateDefault();
    ....

    builder.SetResourceBuilder(resourceBuilder);    
    builder.AddRuntimeMetrics();
    builder.AddOtlpExporter();
    
});
```

该示例集成了`Opentelemetry`并添加了`RuntimeMetrics`运行时`metric`监测，如果需要添加其它`metrics`的监测，自己引入包添加监测即可。


## 遥测数据查询

当前版本的存储实现为：
`Logs`和`Traces`存储于`Elasticseach`,`Metrics`存储于`Prometheus`，所以目前版本的Logs和Traces的查询api也是基于Elasticsearch实现。另外使用该功能时，需要引入包：

``` C#
dotnet add package Masa.Contrib.StackSdks.Tsc.Elasticsearch
```

### Logs查询：

1. `Task<PaginatedListBase<LogResponseDto>> ListAsync(BaseRequestDto query)`：日志列表分页查询，目前最大只能到第9999条数据，
    更多的数据请添加更加细化的查询条件；
2. `Task<IEnumerable<MappingResponseDto>> GetMappingAsync()`：日志结构映射mapping查询，用来作为自定义查询的条件；
3. `Task<object> AggregateAsync(SimpleAggregateRequestDto query)`：日志聚合统计功能，当前版本限于`Elasticsearch`，目前实现了几种简单的统计。


示例：
    
1. 获取日志mapping

``` C#
var mappings = await _logService.GetMappingAsync();
```
        
2. 日志列表分页查询

``` C#
var query = new BaseRequestDto
{
    Page = 1,
    PageSize = 10,
    Conditions = new FieldConditionDto[] {
            new FieldConditionDto{ Name="Attributes.Name",
            Type= ConditionTypes.Equal, Value="UserAuthorizationFailed" }
        },
    Service ="my-project-api",
};

var result = await _logService.ListAsync(query);
```
该示例展示了查询日志列表，请求类`BaseRequestDto`包含了`TraceId`（链路id全匹配）、`Service`（服务名称全匹配）、`Instance`（服务实例全匹配）、`Endpoint`（服务类型为http服务时，请求的url路径全匹配）、`Start`（开始时间）、`End`（结束时间）和`Keyword`（全文模糊匹配）几个通用查询，如果需要更多的查询条件，可以使用 `Conditions` 和 `RawQuery` （Elasticsearch的原始查询条件json）添加更多过滤条件。
    
3. 聚合统计

``` C#
var query = new SimpleAggregateRequestDto
{
    Service = "my-project-api",
    Name = ElasticConstant.ServiceName,
    Type = AggregateTypes.Count
};
var result = await _logService.AggregateAsync(query);
```
示例返回服务名称为"my-project-api"的日志总条数，目前每次查询只支持一级聚合，嵌套聚合目前不支持，聚合类型支持`Count`、`Sum`、`Avg`、`DistinctCount`、`DateHistogram`和`GroupBy`，`Sum`和`Avg`必须为数值类型的字段，`DateHistogram`必须是对日期类型的字段，其它如果是字符串类型，必须为`keyword`类型。

> 返回结果类型：`GroupBy` 返回 `IEnumerable<string>`,`DateHistogram` 返回 `IEnumerable<KeyValuePair<double,string>>`，其它返回`double`。

### Traces查询

1. `Task<IEnumerable<TraceResponseDto>> GetAsync(string traceId)`：根据`traceId`获取整个链路的所有trace信息
2. `Task<PaginatedListBase<TraceResponseDto>> ListAsync(BaseRequestDto query)`：获取trace列表
3. `Task<object> AggregateAsync(SimpleAggregateRequestDto query) trace聚合查询`：参见log聚合统计
4. `void GetAll(BaseRequestDto query, Action<IEnumerable<TraceResponseDto>> resultAction)`：获取指定条件的所有trace数据