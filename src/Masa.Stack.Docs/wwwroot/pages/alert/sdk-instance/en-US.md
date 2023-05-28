# SDK Example

## Introduction

By injecting the `IAlertClient` interface, you can call the corresponding service to obtain the capabilities provided by the Alert SDK.

## Service Introduction

The Alert SDK includes the following services:

```csharp
IAlertClient
   ├── AlarmRuleService                    Alarm rule service
```

## Usage Introduction

### Install Dependencies

``` shell terminal
dotnet add package Masa.Contrib.StackSdks.Alert
```

### Register Related Services

```csharp program.cs
builder.Services.AddAlertClient("https://alertservice.com");
```

> Replace `https://alertservice.com` with the real backend service address of Alert.

### Inject IAlertClient

```csharp program.cs
var app = builder.Build();
   
app.MapGet("/GetAlarmRule", ([FromServices] IAlertClient alertClient, Guid id) =>
{
   return alertClient.AlarmRuleService.GetAsync(id);
});
   
app.Run();
```

## Scenario

When a job in the task scheduling center (MASA.Scheduler) needs to raise an alarm, it automatically creates and manages an alarm rule by calling the SDK of the alarm center (MASA.Alert).

### Create Alarm Rule

Only part of the parameter usage is introduced in the example.

```csharp
var whereExpression = $@"{{""bool"":{{""must"":[{{""term"":{{""Attributes.Jhe true,
   //规则表达式
   RuleExpression = ruleExpression,
   //告警通知方式
   Notification = new NotificationModel
   {
      Type = NotificationType.Email,
      Emails = new List<string> { "example@example.com" }
   },
   //告警级别
   Severity = AlarmSeverity.Error,
   //告警消息
   Message = "Log with error level."
};rue,
   // Configuration of monitoring items
   LogMonitorItems = new List<LogMonitorItemModel> {
      new LogMonitorItemModel {
         Field = "Attributes.JobId",
         AggregationType = LogAggregationType.Count,
         Alias = "JobId"
      }
   },
   // Log filtering conditions
   WhereExpression = whereExpression,
   // Trigger rules, including rule expressions and notification strategies
   Items = new List<AlarmRuleItemModel> {
      new AlarmRuleItemModel {
         Expression = ruleExpression,
         AlertSeverity = AlertSeverity.High
      }
   }
};

var alarmRuleId = await AlertClient.AlarmRuleService.CreateAsync(alarmRule);
```

### Update alarm rules

```csharp
await AlertClient.AlarmRuleService.UpdateAsync(alarmRule);
```

### Enable/disable alarm rules

```csharp
await AlertClient.AlarmRuleService.SetIsEnabledAsync(alarmRuleId, isEnabled);
```