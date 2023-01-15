## 最佳实践

### 使用MASA.ALERT配置告警

在MASA.ALERT系统中，可以配置Log和Metric的自定义告警规则，通过监测某个资源，设置告警阈值和告警规则，在达到告警条件时触发告警并发送响应的告警消息。

### 使用MASA.SCHEDULER配置告警

1. 通过接入MASA.SCHEDULER开发SDK，编写相应的任务Job程序，再通过MASA.SCHEDULER系统创建Job任务并上传程序；
2. 通过MASA.SCHEDULER创建HTTP的Job任务；

创建的后任务执行后，生成响应的统计或其它系统支持的数据，并在系统中通过仪表盘功能进行配置使用。