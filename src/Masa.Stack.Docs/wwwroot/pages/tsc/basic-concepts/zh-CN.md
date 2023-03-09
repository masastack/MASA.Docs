## 基础概念

### 简介
TSC是集成了基于[OpenTelemetry](https://opentelemetry.io/)的可观测性，通过采集的Trace、Log和Metric数据，用来快速诊断系统和应用的故障、问题，从而更快的发现和解决问题。

### 技术点
- Log和Trace数据的存储于[Elasticsearch](https://www.elastic.co/cn/elasticsearch/)，查询相关信息可参考[NEST - High level client](https://www.elastic.co/guide/en/elasticsearch/client/net-api/7.17/nest.html);
- Metric数据存储与[Promethues](https://prometheus.io/)，查询相关信息可参考[HTTP API](https://prometheus.io/docs/prometheus/latest/querying/api/)。

### 相关参考
ASP.NET本身也提供了可观性的支持，在命名空间[System.Diagnostics](https://learn.microsoft.com/zh-cn/dotnet/api/system.diagnostics?view=net-6.0)，可以与OpenTelemetry较好的配合：
- Trace 使用可参考 [System.Diagnostics.Activity](https://learn.microsoft.com/zh-cn/dotnet/api/system.diagnostics.activity?view=net-6.0)；
- Metric使用可参考[Collect metrics](https://learn.microsoft.com/en-us/dotnet/core/diagnostics/metrics-collection)；
- Log使用参考[Logger](https://learn.microsoft.com/zh-cn/aspnet/core/fundamentals/logging/?view=aspnetcore-6.0)