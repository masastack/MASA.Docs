# Development Guide

## OpenTelemetry Integration for Observability

1. Install the package

   ```shell
   dotnet add package Masa.Contrib.StackSdks.Tsc
   ```

2. Modify `appsettings.json` to configure the required parameters

   ```json
   {
     "Masa": {
       "Observable": {
         "ServiceName": "masa-alert-service",
         "ServiceNameSpace": "Development",
         "ServiceVersion": "1.0.0",
         "OtlpUrl": ""//Fill in the actual OpenTelemetry address,
         ""
       }
     }
   }
   ```

3. Integrate observability, and data will be automatically collected into OpenTelemetry

   ```csharp
   var builder = WebApplication.CreateBuilder(args);
   builder.Services.AddObservable(builder.Logging, builder.Configuration);
   ```

## Third-party Integration for Alarm Handling

1. Add a web hook

   Please refer to [Web Hook](stack/alert/use-guide/web-hook#creating/editing)

2. Forward alarm handling to third-party

   Please refer to [Handling Alarms](stack/alert/use-guide/alarm-history#handling-alarms)

3. Web hook integration

   ```csharp l:7
   public class WebHookTestDto
   {
       //Alarm ID
   ```The code snippet above defines a C# class with three properties: AlarmHistoryId, Handler, and SecretKey. The first property is of type Guid, while the other two are of type string. The purpose of the class is not clear from the code provided. 

In addition, there is a method called TestAsync that takes in an event bus, a Guid id, and a WebHookTestDto object as input parameters. The method is decorated with a RoutePattern attribute that specifies the URI pattern for the method. The method is also marked as asynchronous with the async keyword. The implementation of the method is not provided in the code snippet.