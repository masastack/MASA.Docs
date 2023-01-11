---
title: SDK示例
date: 2023/01/10 16:30
---

## 简介

通过注入`IMcClient`接口，调用对应Service获取MC SDK 提供的能力。

## 服务介绍

Mc SDK 包含一下几个大类的服务

```c#
IMcClient
├── ChannelService                  渠道服务
├── MessageTaskService              消息任务服务
├── MessageTemplateService          消息模板服务
├── ReceiverGroupService            收件人组服务
├── WebsiteMessageService           站内信服务
```

## 使用介绍

### 安装依赖包

``` powershell
dotnet add package Masa.Contrib.StackSdks.Mc
```

### 注册相关服务

```C#
builder.Services.AddMcClient("http://mcservice.com");
```

> `http://mcservice.com` 需要替换为真实的MC后台服务地址

### 用例
1. 给外部用户发送普通消息(邮箱)
```c#
var app = builder.Build();

app.MapGet("/SendEmail", async ([FromServices] IMcClient mcClient) =>
{
    var request = new SendOrdinaryMessageByExternalModel
    {
        ChannelCode = "Your channel code",
        ChannelType = ChannelTypes.Email,
        ReceiverType = SendTargets.Assign,
        MessageInfo = new MessageInfoUpsertModel
        {
            Title = "Title",
            Content = "Content"
        },
        Receivers = new List<ExternalReceiverModel>
        {
            new ExternalReceiverModel
            {
                ChannelUserIdentity = "zhansan@163.com"
            }
        }
    };

    await mcClient.MessageTaskService.SendOrdinaryMessageByExternalAsync(request);
});

app.Run();
```
2. 给Auth用户发送模板消息(短信)

```c#
var app = builder.Build();

app.MapGet("/SendSms", async ([FromServices] IMcClient mcClient) =>
{
    var request = new SendTemplateMessageByInternalModel
    {
        ChannelCode = "Your channel code",
        ChannelType = ChannelTypes.Sms,
        ReceiverType = SendTargets.Assign,
        TemplateCode = "Your template code",
        Receivers = new List<InternalReceiverModel>
        {
            new InternalReceiverModel
            {
                SubjectId = Guid.NewGuid(),
                Type = MessageTaskReceiverTypes.User
            },
            new InternalReceiverModel
            {
                SubjectId = Guid.NewGuid(),
                Type = MessageTaskReceiverTypes.Team
            }
        }
    };

    await mcClient.MessageTaskService.SendTemplateMessageByInternalAsync(request);
});

app.Run();
```
3. 发送站内信广播
```c#
var app = builder.Build();

app.MapGet("/SendWebsiteMessage", async ([FromServices] IMcClient mcClient) =>
{
    var request = new SendTemplateMessageByInternalModel
    {
        ChannelCode = "Your channel code",
        ChannelType = ChannelTypes.WebsiteMessage,
        ReceiverType = SendTargets.Broadcast,
        TemplateCode = "Your template code",
    };

    await mcClient.MessageTaskService.SendTemplateMessageByInternalAsync(request);
});

app.Run();
```
4. 广播模式下通过SignalR发送检查通知，客户端接收后需要主动调用sdk的检查方法才会生成当前用户的站内信数据
```c#
 HubConnection = new HubConnectionBuilder()
    .WithUrl(NavigationManager.ToAbsoluteUri($"{McApiOptions.BaseAddress}/signalr-hubs/notifications"), options =>
    {
        options.AccessTokenProvider = async () =>
        {
            string? accessToken = string.Empty;
            if (httpContextAccessor.HttpContext != null)
            {
                accessToken = await httpContextAccessor.HttpContext.GetTokenAsync("access_token");
            }
            return accessToken;
        };
    })
.Build();

await HubConnection.StartAsync();

//订阅检查通知
HubConnection?.On(SignalRMethodConsts.CHECK_NOTIFICATION, async () =>
{
    //广播下检查生成当前用户的站内信数据
    await McClient.WebsiteMessageService.CheckAsync();
});
```