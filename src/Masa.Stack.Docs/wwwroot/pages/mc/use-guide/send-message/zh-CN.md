# 使用指南 - 发送消息

本指南介绍了在 Masa MC 上如何发送普通消息和模板消息。

## 发送消息

发送消息需要四个步骤。

### 步骤 1：选择消息类型

在此步骤中，您需要选择要发送的消息类型，包括普通消息和模板消息。

   ![messageTask-type](https://cdn.masastack.com/stack/doc/mc/messageTask-type.png)

### 步骤 2：配置消息内容

在此步骤中，您需要根据所选的消息类型来配置消息内容。

   1. 普通消息
   
      对于普通消息，您只需要填写消息内容即可。
   
      ![send-ordinary-message](https://cdn.masastack.com/stack/doc/mc/send-ordinary-message.png)
   
   2. 模板消息
   
      对于模板消息，您需要选择预设的消息模板。
   
      ![send-template-message](https://cdn.masastack.com/stack/doc/mc/send-template-message.png)

### 步骤 3：收件人

在此步骤中，您需要选择收件人，支持收件人组、角色、团队、部门、用户的组合，也可以添加外部用户。另外，您还可以通过上传 CSV 文件批量导入收件人数据。

   - 每种渠道模板不同，请按照下载的导入模板格式填写。
   - 对于模板消息，导入模板支持消息模板变量。如果消息变量和收件人变量同时填写，将优先使用收件人变量。

   ![send-message-receivers](https://cdn.masastack.com/stack/doc/mc/send-message-receivers.png)  
   ![send-message-receivers-import](https://cdn.masastack.com/stack/doc/mc/send-message-receivers-import.png)

### 步骤 4：发送规则

在此步骤中，您可以选择定时发送或分批次发送。

   - 定时发送：通过 cron 组件配置时间即可。
   - 分批次发送：通过 cron 组件配置周期，填写每个批次要发送的条数。
   
   ![send-message-rule](https://cdn.masastack.com/stack/doc/mc/send-message-rule.png)

## 消息任务

在消息任务列表中，您可以管理所有消息任务。该列表以卡片形式展现，并支持高级筛选、模糊搜索、分页等功能。您可以启用/禁用、查看、测试或删除任务。

![messageTasks](https://masa-docs.oss-cn-hangzhou.aliyuncs.com/stack/mc/message_task/message_task_more_content.png)

此外，您还可以查看任务详情，包括批次数据和消息内容，并支持撤回操作。

![messageTasks-details](https://cdn.masastack.com/stack/doc/mc/messageTasks-details.png)
