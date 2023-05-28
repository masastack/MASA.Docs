builder.Build();

   app.UseIsolation();

   app.Run();
   ```
   :::
   ::::

2. 如何在隔离性中使用自定义的租户解析器

   可以通过实现 `ITenantResolver` 接口来自定义租户解析器，然后在 `AddIsolation` 方法中传入该解析器即可。示例代码如下：

   ```csharp
   builder.Services.AddIsolation(isolationBuilder =>
   {
       isolationBuilder.UseMultiTenant();
   }, options =>
   {
       options.TenantResolver = new CustomTenantResolver();
   });
   ```

3. 如何在隔离性中使用自定义的租户存储提供程序

   可以通过实现 `ITenantStore` 接口来自定义租户存储提供程序，然后在 `AddIsolation` 方法中传入该存储提供程序即可。示例代码如下：

   ```csharp
   builder.Services.AddIsolation(isolationBuilder =>
   {
       isolationBuilder.UseMultiTenant();
   }, options =>
   {
       options.TenantStore = new CustomTenantStore();
   });
   ```

## 单租户

1. 如何在单租户模式下使用隔离性

   在单租户模式下，可以通过以下代码来启用隔离性：

   ```csharp
   app.UseIsolation();
   ```

2. 如何在单租户模式下禁用隔离性

   在单租户模式下，可以通过以下代码来禁用隔离性：

   ```csharp
   app.UseDefaultFiles();
   app.UseStaticFiles();
   app.UseRouting();
   app.UseEndpoints(endpoints =>
   {
       endpoints.MapControllers();
   });
   ```

## 多租户

1. 如何在多租户模式下使用隔离性

   在多租户模式下，可以通过以下代码来启用隔离性：

   ```csharp
   app.UseMultiTenant();
   app.UseIsolation();
   ```

2. 如何在多租户模式下禁用隔离性

   在多租户模式下，可以通过以下代码来禁用隔离性：

   ```csharp
   app.UseMultiTenant();
   app.UseDefaultFiles();
   app.UseStaticFiles();
   app.UseRouting();
   app.UseEndpoints(endpoints =>
   {
       endpoints.MapControllers();
   });
   ```Data = new ConnectionStrings(new List<KeyValuePair<string, string>>()
               {
                   new(ConnectionStrings.DEFAULT_CONNECTION_STRING_NAME, "{Replace-Your-Tenant2-ConnectionString}")
               })
           }
       };
   });

   var app = builder.Build();

   app.UseIsolation();

   app.Run();
   ```

   在上述代码中，我们使用 `Configure<IsolationOptions<ConnectionStrings>>` 方法来配置 `IsolationOptions`，并指定了一个 `List` 类型的 `Data` 属性，其中包含了两个租户的连接字符串信息。

   * 方案2: 自定义配置源

   实现 `IConfigurationSource` 接口，自定义配置源，以数据库为例

   ```csharp Program.cs l:3-29,33
   var builder = WebApplication.CreateBuilder(args);

   builder.Configuration.AddDatabaseConfigurationSource(options =>
   {
       options.ConnectionString = "{Replace-Your-Database-ConnectionString}";
       options.TableName = "IsolationConfigurations";
       options.TenantIdColumnName = "TenantId";
       options.ConfigurationColumnName = "Configuration";
   });

   var app = builder.Build();

   app.UseIsolation();

   app.Run();
   ```

   在上述代码中，我们通过 `AddDatabaseConfigurationSource` 方法添加了一个自定义的配置源，其中指定了数据库连接字符串、表名、租户 ID 列名和配置信息列名。The following code is configuring the isolation feature in a .NET application. It includes two solutions for setting up the isolation configuration source. 

Solution 1: Using the built-in configuration source

The data context is a special case where its name value is empty, and there is no scenario where the name is not empty. For other modules that support custom name values, you can set them up by using the following code: 

```csharp
builder.Services.Configure<IsolationOptions<TComponentConfig>>("custom name value", options =>{ });
```

(TComponentConfig is the configuration object of the component, which can be found in the documentation of the specific building block.)

Solution 2: Customizing the IIsolationConfigProvider

You can support other configuration sources by implementing a custom IIsolationConfigProvider. Here is an example:

```csharp
public class CustomIsolationConfigProvider : IIsolationConfigProvider
{
    public Task<IsolationConfig> GetConfigAsync()
    {
        // Implement your own logic to retrieve the isolation configuration from a custom source.
    }
}
```

To use this custom provider, add the following code:

```csharp
builder.Services.AddSingleton<IIsolationConfigProvider, CustomIsolationConfigProvider>();
```

After setting up the isolation configuration source, you can use the app.UseIsolation() method to enable the isolation feature in your application.Configuration<TComponentConfig>(string sectionName, string name = "") where TComponentConfig : class, new()
       {
           throw new NotImplementedException();
       }
   }

The above code is a class named "IsolationConfigProvider" that implements the interface "IIsolationConfigProvider". It provides a method named "GetComponentConfiguration" that retrieves configuration information for a specific configuration node under the current tenant/environment. If null is returned, the default configuration information of the current component will be used. The method takes in two parameters: "sectionName", which is the name of the configuration node, and "name", which is an optional parameter that supports custom names for building blocks that support factories. The method returns an object of type "TComponentConfig", which is the configuration object for the component. If the method is not implemented, it throws a "NotImplementedException".>(string sectionName, string name = "") where TComponentConfig : class
       {
           // todo: Get all component configuration information of the specified configuration node in the current tenant/environment and return as a list
           return new List<TComponentConfig>();
       }

The Config method retrieves the configuration information for a specific component in the current environment/tenant, while the GetComponentConfig method retrieves all configuration information for a specific configuration node and returns it as a list. The sectionName parameter specifies the name of the configuration node, which may vary for different components and can be customized. The name parameter is optional and can be used to specify a custom name for building blocks that support factories. The methods use a generic type parameter TComponentConfig to specify the type of the component configuration object being retrieved, which must be a class. The methods return the retrieved configuration information or a list of configuration information as appropriate.```csharp
s<TComponentConfig>(string sectionName, string name = "") where TComponentConfig : class
{
    //todo: 获取指定配置节点的所有配置信息
    var list = new List<TComponentConfig>();
    return list;
}
```

使用自定义隔离性配置提供程序：

```csharp
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddScoped<IIsolationConfigProvider, CustomIsolationConfigProvider>();
builder.Services.AddIsolation(isolationBuilder =>
{
    isolationBuilder.UseMultiTenant();
});

var app = builder.Build();

app.UseIsolation();

app.Run();
```