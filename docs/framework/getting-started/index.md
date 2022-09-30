---
title: 从0开始
date: 2022/07/26
---

通过`MinimalAPI`，我们可以很轻松的构建一个API服务，通过[`Caller`](/framework/building-blocks/service/caller)，我们可以很轻松的调用其他服务的API

## 必要条件

* [.NET 6.0](https://dotnet.microsoft.com/zh-cn/download/dotnet/6.0)

## 服务端

1. 新建ASP.NET Core 空项目`Assignment.HelloWorld.Services`，并安装`Masa.Contrib.Service.MinimalAPIs`

``` shell
dotnet new web -o Assignment.HelloWorld.Services
cd Assignment.HelloWorld.Services

dotnet add package Masa.Contrib.Service.MinimalAPIs
```

2. 修改`Program.cs`

``` C#
var app = builder.AddServices();//原：var app = builder.Build();
```

3. 新增`WeatherForecastService`类

``` C#
public class WeatherForecastService : ServiceBase
{
    public WeatherForecastService(IServiceCollection services) : base(services)
    {
        App.MapGet("/weatherforecast", GetWeatherForecasts);
    }

    private IEnumerable<WeatherForecast> GetWeatherForecasts()
    {
        var summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };
        var forecast = Enumerable.Range(1, 5).Select(index =>
                new WeatherForecast
                (
                    DateTime.Now.AddDays(index),
                    Random.Shared.Next(-20, 55),
                    summaries[Random.Shared.Next(summaries.Length)]
                ))
            .ToArray();
        return forecast;
    }

    private record WeatherForecast(DateTime Date, int TemperatureC, string? Summary)
    {
        public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
    }
}
```

## 客户端

1. 新建ASP.NET Core 空项目`Assignment.HelloWorld.Clients`，并安装`Masa.Contrib.Service.Caller`、`Masa.Contrib.Service.Caller.HttpClient`

``` shell
dotnet new web -o Assignment.HelloWorld.Clients
cd Assignment.HelloWorld.Clients

dotnet add package Masa.Contrib.Service.Caller
dotnet add package Masa.Contrib.Service.Caller.HttpClient
```

2. 新增`BaseServiceCaller`类

作为客户端基类存在，便于后续支持Dapr后服务调用方式更改

``` C#
public abstract class BaseServiceCaller : HttpClientCallerBase
{
    /// <summary>
    /// 服务端地址
    /// </summary>
    protected override string BaseAddress { get; set; } = "http://localhost:5000";
}
```

3. 新增`WeatherForecastClient`类

``` C#
public class WeatherForecastCaller : BaseServiceCaller
{
    public async Task<string> GetWeatherForecastsAsync()
    {
        return await Caller.GetStringAsync("weatherforecast");
    }
}
```

4. 修改`Program.cs`

新增加方法，用于测试服务调用

``` C#
app.Map("/service/weatherforecast", async (WeatherForecastCaller caller) 
    => await caller.GetWeatherForecastsAsync());
```

## 验证

1. 分别启动服务端、客户端项目
2. 浏览器访问`http://localhost:5162/service/weatherforecast`

> 客户端地址：http://localhost:5162

``` json
[{"date":"2022-08-19T16:26:14.1682961+08:00","temperatureC":-18,"summary":"Warm","temperatureF":0},{"date":"2022-08-20T16:26:14.1682994+08:00","temperatureC":40,"summary":"Cool","temperatureF":103},{"date":"2022-08-21T16:26:14.1682995+08:00","temperatureC":44,"summary":"Balmy","temperatureF":111},{"date":"2022-08-22T16:26:14.1682996+08:00","temperatureC":-12,"summary":"Freezing","temperatureF":11},{"date":"2022-08-23T16:26:14.1682996+08:00","temperatureC":17,"summary":"Balmy","temperatureF":62}]
```

## 疑问？

* A: 为什么要使用Masa提供的[`MinimalAPI`](/framework/contribs/service/minimal-apis)？
  * Q: 避免流水账式编程，使得`Program.cs`更加简洁
* A: 为什么要使用[Caller](/framework/building-blocks/service/caller)，而不是官方提供的`HttpClient`或者其他的HttpClient库？
  * Q1: 后续改造服务支持`Dapr`调用的成本更低
  * Q2: 学习成本更低，更加灵活