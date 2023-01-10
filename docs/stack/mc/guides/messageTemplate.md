---
title: 使用指南-消息模板
date: 2022/12/09 14:47
---

支持预设消息内容与变量，规范消息格式，还可以实现营销内容的分配。

### 列表

消息模板列表以表格形式展现，支持高级筛选、模糊搜索、分页等功能。
    
![smsTemplates](\stack\mc\smsTemplates.png)

### 模板创建/编辑

- 模板ID，用于调用sdk发送消息的参数“TemplateCode”
- 签名，发送短信模板消息时没有指定签名即使用模板的默认签名
- 同步模板，可以手动同步所选渠道的阿里云短信模板，同步后选项模板下拉框列表将会更新

![smsTemplate-edit](\stack\mc\smsTemplate-edit.png)

- 变量，本系统使用的模板变量名称
- 映射变量，阿里云短信模板使用的变量名称
- 发送次数限制

![smsTemplate-edit2](\stack\mc\smsTemplate-edit2.png)