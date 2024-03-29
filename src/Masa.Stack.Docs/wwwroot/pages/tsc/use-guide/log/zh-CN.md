﻿# Log

## Log结构

当前版本`Log`存储采用[Elasticsearch](https://www.elastic.co)，日志存储基本结构：

|  名称  |  数据类型  |  说明  |
|  -------  |  -----------  |  -------  |
|  @timestamp |  DateTime |  [记录时间](https://opentelemetry.io/docs/reference/specification/logs/data-model/#field-timestamp)  |
|  SeverityText  |   string  | [日志级别](https://opentelemetry.io/docs/reference/specification/logs/data-model/#field-severitytext)  |
|  SeverityNumber  |  int  |  [日志级别](https://opentelemetry.io/docs/reference/specification/logs/data-model/#field-severitynumber)  |
|  TraceId  |  string  |  [TraceId](https://opentelemetry.io/docs/reference/specification/logs/data-model/#field-traceid)  |
|  SpanId  |  string  |  [SpanId](https://opentelemetry.io/docs/reference/specification/logs/data-model/#field-spanid)  |
|  TraceFlags  |  int  |  [W3C追踪标记](https://opentelemetry.io/docs/reference/specification/logs/data-model/#field-traceflags)  |
|  Body  |  Object  |  [日志打印内容](https://opentelemetry.io/docs/specs/otel/logs/data-model/#field-body)  |
|  Attributes  |  Dictionary<string,object>  | 参考 [Log Attribute Semantic Conventions](https://opentelemetry.io/docs/reference/specification/logs/semantic_conventions)和[Trace Semantic Conventions](https://opentelemetry.io/docs/reference/specification/trace/semantic_conventions)  |
|  Resource  |  Dictionary<string,object>  |  服务启动时的配置信息，例如opentelemetry的版本信息、服务、实例等信息，参考[Resource Semantic Conventions](https://opentelemetry.io/docs/specs/otel/resource/semantic_conventions)  |



当前日志搜索只提供了简单的关键词检索，如果需要使用自定义的`Elasticsearch`查询语法，可以在搜索框输入对应的查询条件。搜索框条件检索到输入的查询条件包括`{`或者`}`时，就会认为用户在使用高级查询，当前版本在输入错误的查询表达式后，没有对表达式进行校验，数据也不会发生改变，所以表达式需要自己提前到`Elasticsearch`的查询工具进行验证；

## 高级查询

### 单个条件

查询所有日志级别为`Error`的记录：

```json
{
  "term": 
    {
      "SeverityText.keyword": "Error"
    }
}
```

### 多个条件查询

```json
{
  "term": 
    {
      "Resource.service.name.keyword": "scheduler-service-worker-staging"
    }
},
{
  "term": 
    {
      "SeverityText.keyword": "Error"
    }
}
```
多个条件中间用英文逗号隔开，时间条件会使用时间组件的值，其它条件都可以自定义查询，如果对`Elasticsearch`查询表达式语法不清楚的，请查阅[Query DSL](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl.html)