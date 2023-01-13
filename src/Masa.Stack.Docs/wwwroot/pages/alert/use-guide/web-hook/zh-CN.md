---
title: 使用指南-WebHook
date: 2022/12/09 14:47
---

WebHook配置和管理，暂时用于告警处理中通知第三方。
第三方完成后续操作后需要通知告警中心告警已处理，目前提供了处理完成接口，后续会提供sdk。

### 列表

WebHook列表以卡片形式展现，支持模糊搜索、分页等功能。
    
![webHooks](http://cdn.masastack.com/stack/doc/alert/webHooks.png)

### 创建/编辑
密钥用与WebHook通信中校验请求是否有效所用。
![webHook-edit](http://cdn.masastack.com/stack/doc/alert/webHook-edit.png)

### 测试
指定处理人，立即向配置的WebHook地址发送推送。
![webHook-test](http://cdn.masastack.com/stack/doc/alert/webHook-test.png)