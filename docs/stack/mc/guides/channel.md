---
title: 使用指南-渠道管理
date: 2022/12/09 11:46
---

渠道用于消息推送通道的账号配置,暂时只支持短信、邮箱、站内信三种渠道类型

### 列表

![channels](\stack\mc\channels.png)

### 新增渠道
1. 选择渠道类型
![channel-add-type](\stack\mc\channel-add-type.png)

2. 渠道配置信息
>渠道ID用于调用sdk发送消息的参数“ChannelCode”

    短信渠道配置
    目前短信发送使用阿里云，AccessKeyId和AccessKeySecret请填写对应阿里云的参数
    短信渠道创建后，会同步阿里云的短信模板到本地短信模板池子，创建短信模板时可以直接选择
![channel-add-sms](\stack\mc\channel-add-sms.png)

    邮箱渠道配置
![channel-add-email](\stack\mc\channel-add-email.png)

    站内信渠道配置
![channel-add-websiteMessage](\stack\mc\channel-add-websiteMessage.png)