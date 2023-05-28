# Error Query

## Common Error Descriptions

### Team

![Team Error Image](https://cdn.masastack.com/stack/doc/tsc/use-guide/error-query/team.png)

1. Red applications have error logs, yellow have warning logs.
2. Red projects have abnormal application status, yellow have warning logs.
3. When the number is greater than 1, it indicates the number of applications that have generated warning logs and the total number of warning logs.
4. When the number is greater than 1, it indicates the number of applications that have generated error logs and the total number of error logs.

Application Details Page

When there is a red notification bar, it means that the application has generated error logs.

![Team Detail Error Image](https://cdn.masastack.com/stack/doc/tsc/use-guide/error-query/team_detail.png)

## Metric Descriptions

Apdex Service Satisfaction:

```
(sum(rate(http_server_duration_bucket{le="250"}[5m])) by (service_name)+sum(rate(http_server_duration_bucket{le="1000"}[5m])) by (service_name))/2
/sum(rate(http_server_duration_bucket{le="1000"}[5m])) by (service_name)
```

[See](https://www.bookstack.cn/read/prometheus-manual/best_practices-histogram_and_summaries.md#Apdex%20score%20%E5%BA%94%E7%94%A8%E6%80%A7%E8%83%BD%E6%8C%87%E6%95%B0)

Service Success Rate:

```
sum by (service_name) (increase(http_server_duration_count{http_status_code!~"5.."}[1m]))*100/sum by (service_name) (increase(http_server_duration_count[1m])):

Average time spent on service requests:

```
sum by (service_name) (increase(http_server_duration_sum[1m]))/sum by (service_name) (increase(http_server_duration_count[1m]))
```

Service request time percentage (P99):

```
histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))
```

[See](https://www.bookstack.cn/read/prometheus-manual/best_practices-histogram_and_summaries.md#Quatiles%E5%88%86%E4%BD%8D%E6%95%B0)

Slow interface query:

```
sort_desc(round( sum by(http_target) (increase(http_response_sum[1m]))/sum by(http_target) (increase(http_response_count[1m])),1))
```