---
title: 最佳实践
date: 2023/01/12 15:22:00
---

### MASA.TSC+MASA.Alert+MASA.Scheduler+MASA.MC实现告警监控

1. 将需要监控的服务接入可观测性，可参考[开发指南-可观测性接入](stack/alert/develop-guide)
2. 在MC中创建好渠道和消息模板，MC负责管理告警的通知渠道和通知内容，可参考[消息中心](stack/mc/introduce)
3. 在Alert创建告警规则，配置好监控项、告警规则和通知策略，可参考[使用指南-告警规则](stack/alert/use-guide/alarm-rule)
![alarmRule-example-monitoring](http://cdn.masastack.com/stack/doc/alert/alarmRule-example-monitoring.png)
![alarmRule-example-setting1](http://cdn.masastack.com/stack/doc/alert/alarmRule-example-setting1.png)
![alarmRule-example-setting2](http://cdn.masastack.com/stack/doc/alert/alarmRule-example-setting2.png)
4. 规则创建后会在Scheduler注册Job,告警规则会定期检查评估监控项，根据告警规则分析结果，触发告警或恢复通知，然后通过MC进行告警消息的发送