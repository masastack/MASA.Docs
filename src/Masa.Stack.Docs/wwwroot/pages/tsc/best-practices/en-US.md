// Best Practices

## Accessing TSC

Prerequisites: Masa Stack and related services (OTLP, Elasticsearch, and Prometheus) must have been deployed.

```csharp
var builder = WebApplication.CreateBuilder(args);

...

builder.Services.AddObservable(builder.Logging, new MasaObservableOptions
{
    // Environment name, optional. It is recommended to fill in when there are multiple environments.
    ServiceNameSpace = "Develop",
    // Service version, optional.
    ServiceVersion = "1.0",
    // Service name. If Masa Stack has been accessed, it must be the same as the unique identifier of the corresponding application in Masa PM.
    ServiceName = "tsc-service",
    // Service category, controllable. The default is "General".
    Layer = "masa-stack",
    // Service instance, controllable. The default is a random GUID.
    ServiceInstanceId = "instance-1"
}, "http://127.0.0.1:4717", true);

 ```

 `otlpUrl`, optional. The default is `http://localhost:4717`. OTLPExporter, the default protocol is `Grpc`. If you need to change it to `Http`, please refer to the more detailed configuration.

 `isInterruptSignalRTracing`, default `false`. Whether to forcibly interrupt the `Trace` of the long connection. If it is `false`, after using the long connection, all request links are in the same link in the long connection, which makes it difficult to troubleshoot after problems occur.

 ## Verification of successful access

 1. Access `MASA.Alert`. On the team homepage, select the team where the project is located, and the project information will appear on the homepage, indicating that the access is successful.

    ![Verification of successful access by team](https:2. Connect to `auth-service-develop`. In the dashboard list, select the dashboard with the service name and open it. Search for the corresponding service name in the service dropdown options. If you can find the corresponding data, it means the connection is successful.

    ![Dashboard verification for successful connection](https://cdn.masastack.com/stack/doc/tsc/best-practices/dashboard-succeed.png)

3. Connect to `masa-alert-service-admin`. On the tracking page, search for the corresponding application name in the service dropdown options. If you can find the corresponding data, it means the connection is successful.

    ![Tracking verification for successful connection](https://cdn.masastack.com/stack/doc/tsc/best-practices/trace-succeed.png)