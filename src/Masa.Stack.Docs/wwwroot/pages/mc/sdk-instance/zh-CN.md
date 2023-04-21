# SDK示例

## 简介

通过注入`IMcClient`接口，调用对应Service获取MC SDK 提供的能力。

## 服务介绍

Mc SDK 包含一下几个大类的服务

```csharp
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

```csharp
builder.Services.AddMcClient("http://mcservice.com");
```

> `http://mcservice.com` 需要替换为真实的MC后台服务地址

### 邮箱提醒

给外部用户发送普通消息(邮箱)

```csharp
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

### 短信提醒
给Auth用户发送模板消息(短信)

```csharp
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

### 站内信
发送站内信广播

```csharp
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

广播模式下通过SignalR发送检查通知，客户端接收后需要主动调用SDK的检查方法才会生成当前用户的站内信数据

```csharp
 HubConnection = new HubConnectionBuilder()
    .WithUrl(NavigationManager.ToAbsoluteUri($"{McApiOptions.BaseAddress}/signalr-hubs/notifications"), options=>
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

### App消息推送
 用户绑定Cid
```csharp
 [RoutePattern(HttpMethod = "Post")]
 public async Task BindClientIdAsync([FromServices] IMasaConfiguration configuration, [FromServicesIMcClientmcClient, string clientId)
 {
     var channelOptions = configuration.ConfigurationApi.GetDefault().GetSect("Channel").Get<MessageChannelOptions>();
     var options = new BindClientIdModel
     {
         ChannelCode = channelOptions.AppChannelCode,//你的渠道code
         ClientId = clientId,//个推cid
     };
     await mcClient.MessageTaskService.BindClientIdAsync(options);
 }
```
向用户推送app消息

```csharp
app.MapGet("/SendAppMessage", async ([FromServices] IMcClient mcClient) =>
{
    var request = new SendOrdinaryMessageByInternalModel
    {
        ChannelCode = "Your channel code",
        ChannelType = ChannelTypes.App,
        ReceiverType = SendTargets.Assign,
        Receivers = new List<InternalReceiverModel>
        {
            new InternalReceiverModel
            {
                SubjectId = Guid.NewGuid(),//用户ID
                Type = MessageTaskReceiverTypes.User
            }
        },
        MessageInfo = new MessageInfoUpsertModel
        {
            Title = "Title",
            Content = "Content",
            ExtraProperties = new ExtraPropertyDictionary()//透传内容
        }
    };

    await mcClient.MessageTaskService.SendTemplateMessageByInternalAsync(request);
});
```