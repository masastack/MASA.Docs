---
title: 最佳实践
date: 2023/01/12 15:22:00
---

## 告警规则配置

### 连续10分钟错误请求数超过阈值告警
1. 新建指标告警规则，检查频率选择固定间隔，间隔时间1，间隔时间类型分钟。
2. 按下方图片所示，配置错误请求数监控项
![alarmRule-example-monitoring](http://cdn.masastack.com/stack/doc/alert/alarmRule-example-monitoring.png)
3. 用配置监控项填写的变量名填写触发规则的表达式
4. 在触发规则处勾选告警通知，选择消息模板和收件人
![alarmRule-example-setting1](http://cdn.masastack.com/stack/doc/alert/alarmRule-example-setting1.png)
5. 在告警配置处填写连续触发阈值为10，沉默周期按需配置
![alarmRule-example-setting2](http://cdn.masastack.com/stack/doc/alert/alarmRule-example-setting2.png)

