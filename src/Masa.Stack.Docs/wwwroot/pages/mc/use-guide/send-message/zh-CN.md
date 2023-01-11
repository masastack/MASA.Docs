---
title: 使用指南-发送消息
date: 2022/12/09 14:22
---

### 选择消息类型
普通消息：发送消息时填写消息内容；模板消息：发送消息时选择预设的消息模板

![messageTask-type](\stack\mc\messageTask-type.png)

### 发送普通消息

选择渠道，填写消息内容

![send-ordinary-message](\stack\mc\send-ordinary-message.png)

### 发送模板消息

选择预设的消息模板，填写模板变量

![send-template-message](_content/Masa.Stack.Docs/img/stack/mc/send-template-message.png)

### 收件人

1. 手动选择，支持收件人组、角色、团队、部门、用户的组合，还可以添加外部用户

![send-message-receivers](_content/Masa.Stack.Docs/img/stack/mc/send-message-receivers.png)

2. 导入收件人，通过上传csv文件批量导入收件人数据

- 每种渠道模板不同，按照下载的导入模板格式填写即可
- 模板消息下，导入模板支持消息模板变量。如果消息变量和收件人变量同时填写，会优先使用收件人变量
   
![send-message-receivers-import](_content/Masa.Stack.Docs/img/stack/mc/send-message-receivers-import.png)

### 发送规则
支持定时发送和分批次发送
- 定时发送：通过cron组件配置时间即可
- 分批次发送：通过cron组件配置周期，填写每个批次要发送的条数

![send-message-rule](_content/Masa.Stack.Docs/img/stack/mc/send-message-rule.png)


### 消息任务
1. 列表，以卡片形式展现，支持高级筛选、模糊搜索、分页等功能。
![messageTasks](_content/Masa.Stack.Docs/img/stack/mc/messageTasks.png)

启用禁用、查看任务、测试、删除

![messageTasks-action](_content/Masa.Stack.Docs/img/stack/mc/messageTasks-action.png)

2. 查看任务，查看批次数据及消息内容，支持撤回
![messageTasks-details](_content/Masa.Stack.Docs/img/stack/mc/messageTasks-details.png)