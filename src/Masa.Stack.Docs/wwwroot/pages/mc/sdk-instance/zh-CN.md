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

### 消息发送

:::: code-group
::: code-group-item 给外部用户发送普通消息(邮箱)
```csharp
using Masa.BuildingBlocks.StackSdks.Mc;
using Masa.BuildingBlocks.StackSdks.Mc.Enum;
using Masa.BuildingBlocks.StackSdks.Mc.Model;
using Microsoft.AspNetCore.Mvc;

/// <summary>
/// 一个测试的Controller
/// </summary>
[ApiController]
[Route("[controller]/[action]")]
public class McController : ControllerBase
{
    private readonly IMcClient _mcClient;
    public McController(IMcClient mcClient)
    {
        _mcClient = mcClient;
    }

    [HttpPost]
    public Task SendEmail()
    {
        var request = new SendOrdinaryMessageByExternalModel
        {
            ChannelCode = "渠道代码",
            ChannelType = ChannelTypes.Email,
            ReceiverType = SendTargets.Assign,
            MessageInfo = new MessageInfoUpsertModel
            {
                Title = "邮件标题",
                Content = "邮件内容"
            },
            Receivers = new List<ExternalReceiverModel>
            {
                new ExternalReceiverModel
                {
                    ChannelUserIdentity = "邮箱地址"
                }
            }
        };
        return _mcClient.MessageTaskService.SendOrdinaryMessageByExternalAsync(request);
    }
}
```
:::

::: code-group-item 给Auth用户发送模板消息(短信)
```csharp
using Masa.BuildingBlocks.StackSdks.Mc;
using Masa.BuildingBlocks.StackSdks.Mc.Enum;
using Masa.BuildingBlocks.StackSdks.Mc.Model;
using Microsoft.AspNetCore.Mvc;

/// <summary>
/// 一个测试的Controller
/// </summary>
[ApiController]
[Route("[controller]/[action]")]
public class McController : ControllerBase
{
    private readonly IMcClient _mcClient;
    public McController(IMcClient mcClient)
    {
        _mcClient = mcClient;
    }

    [HttpPost]
    public Task SendSms()
    {
        var request = new SendTemplateMessageByInternalModel
        {
            ChannelCode = "渠道代码",
            ChannelType = ChannelTypes.Sms,
            ReceiverType = SendTargets.Assign,
            TemplateCode = "模版代码",
            Receivers = new List<InternalReceiverModel>
            {
                new InternalReceiverModel
                {
                    SubjectId = Guid.Parse("你的用户id"),
                    Type = MessageTaskReceiverTypes.User
                }
            }
        };
        return _mcClient.MessageTaskService.SendTemplateMessageByInternalAsync(request);
    }
}
```
:::

::: code-group-item 发送站内信广播
```csharp
using Masa.BuildingBlocks.StackSdks.Mc;
using Masa.BuildingBlocks.StackSdks.Mc.Enum;
using Masa.BuildingBlocks.StackSdks.Mc.Model;


/// <summary>
/// 一个测试的Controller
/// </summary>
[ApiController]
[Route("[controller]/[action]")]
public class McController : ControllerBase
{
    private readonly IMcClient _mcClient;
    public McController(IMcClient mcClient)
    {
        _mcClient = mcClient;
    }

    [HttpPost]
    public Task SendWebsiteMessage()
    {
        var request = new SendTemplateMessageByInternalModel
        {
            ChannelCode = "渠道代码",
            ChannelType = ChannelTypes.WebsiteMessage,
            ReceiverType = SendTargets.Broadcast,
            TemplateCode = "模版代码",
        };
        return _mcClient.MessageTaskService.SendTemplateMessageByInternalAsync(request);
    }
}
```
:::
::::

| **字段** | **描述** |
| --- | --- |
| **ChannelCode** | 渠道代码/渠道ID |
| **ChannelType** | 渠道类型（`Sms`：短信，`Email`：邮箱，`WebsiteMessage`：站内信，`App`：应用程序） |
| **ReceiverType** | 发送类型（`Assign`：指定，`Broadcast`：广播） |
| **MessageInfo.Title** | 消息标题 |
| **MessageInfo.Content** | 消息内容 |
| **Receivers[].ChannelUserIdentity** | ChannelType为`Email`时填邮箱地址，ChannelType为`Sms`时填手机号（具体内容通过`ChannelType`决定） |
| **Receivers[].SubjectId** | 用户Id（具体内容通过`MessageTaskReceiverTypes`决定） |
| **Receivers[].MessageTaskReceiverTypes** | 接收人类型（`User`：用户，`Organization`：组织架构，`Role`：角色，`Team`：团队，`Group`：收件人组） |

### SignalR发送检查

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
 public async Task BindClientIdAsync([FromServices] IMasaConfiguration configuration, [FromServices] IMcClient mcClient, string clientId)
 {
     var channelOptions = configuration.ConfigurationApi.GetDefault().GetSect("Channel").Get<MessageChannelOptions>();
     var options = new BindClientIdModel
     {
         ChannelCode = channelOptions.AppChannelCode,//你的渠道ID
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
