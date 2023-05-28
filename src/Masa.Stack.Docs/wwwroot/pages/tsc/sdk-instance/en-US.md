Introduction

Stack.Tsc provides two modules for obtaining Logs and Metrics data of the TSC system, including **ILogService** and **IMetricService**:

```csharp 
ITscClient
├──ILogService              Log query service
├──IMetricService           Metric query service
```

Usage

1. Install the package

   ```csharp 
   dotnet add package Masa.Contrib.StackSdks.Tsc
   ```

2. Register the service

   ```csharp 
   builder.Services.AddTscClient("http://my.tsc-service.com");
   ```

3. Inject **ITscClient** as a dependency

   ```csharp 
   var app = builder.Build();

   app.MapGet("/log-mapping", ([FromServices] ITscClient tscClient) =>
   {
       // For example, query the total number of error logs for service1 in the past 15 minutes
       var query = new SimpleAggregateRequestDto
       {
           Start = time.AddMinutes(-15),            
           End = time,
           Name = "Resource.service.name",
           Type = AggregateTypes.Count,
           // Service = "service1",
           // Custom conditions
           Conditions = new FieldConditionDto[] {
               new FieldConditionDto {
                   Name = "SeverityText",
                   Type = ConditionTypes.Equal,
                   Value = "Error"
               }
           }
       };

       var count = await _client.LogService.GetAggregationAsync<long>(query);
   });

   app.Run();
   ```

（注：以上为代码片段，翻译时应根据上下文进行翻译）