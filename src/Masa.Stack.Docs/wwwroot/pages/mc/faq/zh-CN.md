---
title: 常见问题
date: 2023/01/10 17:45:00
---

### Q：MASA.MC是什么？

A：[MASA.MC产品介绍](stack/mc/introduce)

### Q：短信模板审核状态如何更新?

A：点击同步模板按钮，会同步阿里云短信模板状态

### Q：邮箱、站内信模板如何配置变量？

A：模板标题、内容、跳转url都支持变量, 变量格式为： \{ \{ 变量名 \} \}。

### Q：发送消息中手动选择的收件人数据哪里添加？

A：MASA.MC中用户对接的MASA.Auth，如果需要给内部用户发送消息，需要接入MASA.Auth。

### Q：如何定时发送消息及分批次发送？

A：请参考[使用指南-发送消息](stack/mc/use-guide/send-message)。同时发送规则依赖MASA.Scheduler, 若要支持发送规则需要接入MASA.Scheduler。

### Q：调用sdk发送站内信广播消息，并没有生成用户的站内信数据？

A：广播模式下通过SignalR发送检查通知，客户端接收后需要主动调用sdk的检查方法才会生成当前用户的站内信数据。请参考[SDK示例](stack/mc/sdk-instance)。

我们会持续收集更多的 FAQ。