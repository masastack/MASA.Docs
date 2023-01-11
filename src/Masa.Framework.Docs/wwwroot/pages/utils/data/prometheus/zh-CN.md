## Prometheus HTTP API 客户端实现

[Prometheus HTTP API](https://prometheus.io/docs/prometheus/latest/querying/api/)的功能实现，目前只支持了用到的部分API，详见[实现功能](#实现功能)。

## 实现功能

1. [`Task<QueryResultCommonResponse> QueryAsync(QueryRequest query)`](#即时查询)：[即时查询](https://prometheus.io/docs/prometheus/latest/querying/api/#instant-queries)
2. [`Task<QueryResultCommonResponse> QueryRangeAsync(QueryRangeRequest query)`](#范围查询)：[范围查询](https://prometheus.io/docs/prometheus/latest/querying/api/#range-queries)
3. [`Task<SeriesResultResponse> SeriesQueryAsync(MetaDataQueryRequest query)`](#series查询)：[series查询](https://prometheus.io/docs/prometheus/latest/querying/api/#querying-metadata)
4. [`Task<LabelResultResponse> LabelsQueryAsync(MetaDataQueryRequest query)`](#label查询)：[label查询](https://prometheus.io/docs/prometheus/latest/querying/api/#getting-label-names)
5. [`Task<LabelResultResponse> LabelValuesQueryAsync(LableValueQueryRequest query)`](#label-values查询)：[label values查询](https://prometheus.io/docs/prometheus/latest/querying/api/#querying-label-values)
6. [`Task<ExemplarResultResponse> ExemplarQueryAsync(QueryExemplarRequest query)`](#exemplar查询)：[exemplar查询](https://prometheus.io/docs/prometheus/latest/querying/api/#querying-exemplars)
7. [`Task<MetaResultResponse> MetricMetaQueryAsync(MetricMetaQueryRequest query)`](#metric-metadata查询)：[metric metadata查询](https://prometheus.io/docs/prometheus/latest/querying/api/#querying-target-metadata)

## 使用

1. 安装包

```csharp
dotnet add package Masa.Utils.Data.Prometheus
```

2. 服务注册

```csharp
var prometheusUrl = "http://localhost:9090";
builder.Service.AddPrometheusClient(prometheusUrl);
```

3. 注入服务

```csharp
public class MyPrometheusQueryService
{
    private readonly IMasaPrometheusClient _client;

    public MyPrometheusQueryService(IMasaPrometheusClient client)
    {
        _client = client;
    }
}
```

4. 查询

### 即时查询

```csharp
var query = new QueryRequest
{
    Query = "up"
};
var result = await _client.QueryAsync(query);
```

所有查询操作中的Time，均支持`DateTime.Now.ToString()` 和 标准`unix`时间戳，例如 `2022-06-17T02:00:00.000Z`、`1670407664`

### 范围查询

```csharp
var query = new QueryRequest
{
    Query = "up"
};
var result = await _client.QueryAsync(query);
```

### series查询

```csharp
var query = new MetaDataQueryRequest
{
    Match = new string[] { "up" },
    Start = "2022-06-17T02:00:00.000Z",
    End = "2022-06-17T02:30:00.000Z",
};
var result = await _client.QueryRangeAsync(query);
```

### label查询

```csharp
var query = new MetaDataQueryRequest
{
    Match = new string[] { "up" },
    Start = "2022-06-17T02:00:00.000Z",
    End = "2022-06-17T02:30:00.000Z",
};
var result = await _client.LabelsQueryAsync(query);
```

### label-values查询

```csharp
var query = new LableValueQueryRequest
{
    Lable = "job",
    Start = "2022-06-17T02:00:00.000Z",
    End = "2022-06-17T02:30:00.000Z",
};
var result = await _client.LabelValuesQueryAsync(query);
```

### exemplar查询

```csharp
var query = new QueryExemplarRequest
{
    Query = "test_exemplar_metric_total",
    Start = "2022-06-17T02:00:00.000Z",
    End = "2022-06-17T02:30:00.000Z"
};
var result = await _client.ExemplarQueryAsync(query);
```

### metric-metadata查询

```csharp
var query = new MetricMetaQueryRequest();
var result = await _client.MetricMetaQueryAsync(query);
```

返回结果格式请参考[请求结果格式说明](https://prometheus.io/docs/prometheus/latest/querying/api/#format-overview)和[表达式结果格式说明](https://prometheus.io/docs/prometheus/latest/querying/api/#expression-query-result-formats)