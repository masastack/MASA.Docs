> Data - Prometheus HTTP API

## Overview

This functionality is based on the [Prometheus HTTP API](https://prometheus.io/docs/prometheus/latest/querying/api/) and currently only supports a portion of the API, as detailed in the [Implemented Features](#implemented-features) section.

## Implemented Features

1. [`Task<QueryResultCommonResponse> QueryAsync(QueryRequest query)`](#instant-queries): [Instant Queries](https://prometheus.io/docs/prometheus/latest/querying/api/#instant-queries)
2. [`Task<QueryResultCommonResponse> QueryRangeAsync(QueryRangeRequest query)`](#range-queries): [Range Queries](https://prometheus.io/docs/prometheus/latest/querying/api/#range-queries)
3. [`Task<SeriesResultResponse> SeriesQueryAsync(MetaDataQueryRequest query)`](#series-queries): [Series Queries](https://prometheus.io/docs/prometheus/latest/querying/api/#querying-metadata)
4. [`Task<LabelResultResponse> LabelsQueryAsync(MetaDataQueryRequest query)`](#label-queries): [Label Queries](https://prometheus.io/docs/prometheus/latest/querying/api/#getting-label-names)
5. [`Task<LabelResultResponse> ValuesQueryAsync(MetaDataQueryRequest query)`](#values-queries): [Values Queries](https://prometheus.io/docs/prometheus/latest/querying/api/#querying-label-values)e
   {
       private readonly IPrometheusClient _prometheusClient;
       
       public MyPrometheusQueryService(IPrometheusClient prometheusClient)
       {
           _prometheusClient = prometheusClient;
       }
       
       public async Task<List<string>> GetLabelValues(string labelName)
       {
           var query = new LabelValueQueryRequest { Label = labelName };
           var result = await _prometheusClient.LabelValuesQueryAsync(query);
           return result.Data.Result;
       }
       
       public async Task<List<ExemplarResult>> GetExemplars(string query)
       {
           var exemplarQuery = new QueryExemplarRequest { Query = query };
           var result = await _prometheusClient.ExemplarQueryAsync(exemplarQuery);
           return result.Data.Result;
       }
       
       public async Task<List<MetricMetadata>> GetMetricMetadata(string metricName)
       {
           var metricMetaQuery = new MetricMetaQueryRequest { Metric = metricName };
           var result = await _prometheusClient.MetricMetaQueryAsync(metricMetaQuery);
           return result.Data.Result;
       }
   }
   ```

   在上面的代码中，我们注入了 `IPrometheusClient` 接口，然后使用该接口的方法进行查询。例如，我们可以使用 `LabelValuesQueryAsync` 方法查询指定标签的所有值，使用 `ExemplarQueryAsync` 方法查询指定查询语句的所有样本，使用 `MetricMetaQueryAsync` 方法查询指定指标的元数据。```csharp
e
{
    private readonly IMasaPrometheusClient _client;
    
    public MyPrometheusQueryService(IMasaPrometheusClient client)
    {
        _client = client;
    }
    
    public Task<QueryResultCommonResponse> QueryAsync()
    {
        var query = new QueryRequest
        {
            Query = "up"
        };
        return _client.QueryAsync(query);
    }
}
```

## Other Examples

### Instant Query

```csharp
var query = new QueryRequest
{
    Query = "up"
};
var result = await _client.QueryAsync(query);
```

> The `Time` parameter in all query operations supports both `DateTime.Now.ToString()` and standard `unix` timestamps, such as `2022-06-17T02:00:00.000Z` and `1670407664`.

### Range Query

```csharp
var query = new QueryRequest
{
    Query = "up",
    Start = DateTime.Now.AddHours(-1),
    End = DateTime.Now
};
var result = await _client.QueryAsync(query);
```

### Series Query

```csharp
var query = new MetaDataQueryRequest
{
    Match = "up",
    Start = DateTime.Now.AddHours(-1),
    End = DateTime.Now
};
var result = await _client.MetaDataQueryAsync(query);
```_client.ExemplarQueryAsync(query);
```### Exemplar 查询

```csharp l:2
var query = new ExemplarQueryRequest();
var result = await _client.ExemplarQueryAsync(query);
```

Please refer to [Response Formats](https://prometheus.io/docs/prometheus/latest/querying/api/#format-overview) and [Expression Query Result Formats](https://prometheus.io/docs/prometheus/latest/querying/api/#expression-query-result-formats) for the format of the returned results.

### Metric Metadata Query

```csharp l:2
var query = new MetricMetaQueryRequest();
var result = await _client.MetricMetaQueryAsync(query);
```

Please refer to [Response Formats](https://prometheus.io/docs/prometheus/latest/querying/api/#format-overview) and [Expression Query Result Formats](https://prometheus.io/docs/prometheus/latest/querying/api/#expression-query-result-formats) for the format of the returned results.