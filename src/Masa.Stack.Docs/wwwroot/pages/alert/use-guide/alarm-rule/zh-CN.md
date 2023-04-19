# 使用指南 - 告警规则

告警规则支持日志监控和指标监控，告警规则会按检查频率定期查询监控项，通过触发规则触发告警，并按策略发送告警或恢复通知。

## 列表
告警规则列表以卡片形式展现，支持高级筛选、模糊搜索、分页等功能。
![alarmRules](http://cdn.masastack.com/stack/doc/alert/alarmRules.png)

卡片操作条
![alarmRuless-action](http://cdn.masastack.com/stack/doc/alert/alarmRules-action.png)

## 告警规则创建/编辑

   1. 关联资源
   
      ![alarmRule-add-res](http://cdn.masastack.com/stack/doc/alert/alarmRule-add-res.png)

   2. 监控设置
      - 检查频率支持固定间隔和cron表达式。
      - 偏移量，填写了偏移周期就会按偏移周期查询数据；不填则查询当前周期数据。
      - 变量，即监控项名，可在触发规则表达式中使用。
         1. 日志监控
            - 日志筛选，日志数据存储在ES，填写ES查询语法即可。
               ![alarmRule-add-logMonitor](http://cdn.masastack.com/stack/doc/alert/alarmRule-add-logMonitor.png)
            - 生成的查询表达式预览
               ![alarmRule-add-logMonitor2](http://cdn.masastack.com/stack/doc/alert/alarmRule-add-logMonitor2.png)

   2. 指标监控
      - 指标监控项变量支持配置和表达式填写
         ![alarmRule-add-MetricMonitor](http://cdn.masastack.com/stack/doc/alert/alarmRule-add-MetricMonitor.png)

   3. 图表预览
      - 根据检查频率和监控项配置模拟监控项查询记录的图表
      - 日志采样预览，获取上一周期符合规则的最近一条日志数据
         ![alarmRule-add-chart](http://cdn.masastack.com/stack/doc/alert/alarmRule-add-chart.png)

   4. 告警设置
      - 连续触发阈值：配置连续触发阈值。当累计的触发次数达到该值时，产生一条告警。不满足触发条件时不计入统计。
      - 沉默周期：支持按周期和按时间，告警发生后未恢复正常，间隔多久重复发送一次告警通知
      - 触发规则表达式：请参考MASA Stack 文档站点规则引擎介绍：http://docs.masastack.com/framework/building-blocks/rules-engine/overview
         ![alarmRule-add-ruleSetting](http://cdn.masastack.com/stack/doc/alert/alarmRule-add-ruleSetting.png)
         ![alarmRule-example-setting2](http://cdn.masastack.com/stack/doc/alert/alarmRule-example-setting2.png)