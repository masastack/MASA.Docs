# Basic Concepts

## Monitoring Principle

TSC integrates with [OpenTelemetry](https://opentelemetry.io/) to achieve observability, collecting Trace, Log, and Metric data to quickly diagnose system and application faults and issues, thereby enabling faster problem discovery and resolution.

The overall operating structure of the system is as follows:

![tsc operating structure diagram](https://cdn.masastack.com/stack/doc/tsc/use-guide/basic-concepts/structure.png)

### Overview

At present, our applications are uniformly transmitted through `OTLPExporter` to the `Otel` service for observability data. The `Otel` service stores `Logs` and `Traces` in `Elasticsearch`, and `Metrics` data is stored in `Prometheus`. TSC service then queries `Logs` and `Traces` data through `Elasticsearch`, and queries `Metrics` data through the `Prometheus HTTP API`.

Using `OTLPExporter` makes it easier to expand and adapt to more storage solutions in the future, such as storing on third-party cloud platforms or storage that is more suitable for processing corresponding data.

### Data

`Logs` are detailed log information recorded by the application, which can include manually debugged print information for a method or detailed information about program exceptions.

`Traces` are the chain request information of the application, which fully includes the detailed request process information of a user's request. At this stage, `Http` and `Database` chain recording are supported. Each chain has a unique `TraceId` identifier, and each `Http` request or `Database` in the chain has a unique identifier `SpanId`. The logs generated during the relevant chain processing will also include this information.

`Metrics` are application performance detection indicator data, such as common interface request quantity, interface request time, interface success rate, service instance load, service satisfaction, etc. The content of the indicator data here may differ from the actual needs, and the detailed indicators can be found in [.NET metrics](https://learn.microsoft.com/en-us/dotnet).t/core/diagnostics/metrics)

## Metrics Retrieval Principle

### HTTP Metrics

|  Name  |  Type  |  Description  |
|  ------  |  --------  |  ---------  |
|  http.client.duration |  histogram  |  HTTP client duration [histogram](https://cloud.tencent.com/developer/article/1495303)  |
|  http.server.duration  |  histogram  |  HTTP server duration [histogram](https://cloud.tencent.com/developer/article/1495303)  |

Both of these metrics are provided by `Opentelemetry` to monitor the request duration of HTTP clients and servers. As we store them in `Prometheus`, the metrics will be transformed into `http_client_duration` and `http_server_duration`. Since they are histograms, the corresponding metrics are actually stored as three metric data:

|  Name  |  Type  |  Description  |
|  ------  |  --------  |  ---------  |
|  http_server_duration_bucket |  gauge  |  Actual request duration |
|  http_server_duration_sum  |  counter  |  Total request duration at current time  |
|  http_server_duration_count  |  counter  |  Total number of requests at current time  |

Based on the calculation of HTTP metrics, we calculate based on the above three actual metrics.

### .NET EventCounters

The basic metrics of ASP.NET, see [Well-known EventCounters in .NET](https://learn.microsoft.com/en-us/dotnet/core/diagnostics/event-counters).During this stage, the aforementioned metrics were not given priority treatment. If you are interested or have a need for them, please refer to the official documentation for detailed information.

As for Dapr, metrics integration has been implemented in this version, but formal application has not yet been carried out. For detailed information on the collected metrics, please refer to the [Dapr metrics](https://github.com/dapr/dapr/blob/master/docs/development/dapr-metrics.md) and [viewing Dapr metrics](https://docs.dapr.io/operations/monitoring/metrics) in the official documentation.