# 隔离性 - 常见问题

## 公共

1. 如何修改隔离性默认读取的节点名 Isolation

   可通过以下两种方案来修改默认读取的节点名，两种方案任选其一即可

   :::: code-group
   ::: code-group-item 方案1

   ```csharp
   var builder = WebApplication.CreateBuilder(args);
   builder.Services.AddIsolation(isolationBuilder =>
   {
       isolationBuilder.UseMultiTenant();
   }, options =>
   {
       options.SectionName = "{自定义隔离性节点名}";
   });
   
   var app = builder.Build();
   
   app.UseIsolation();
   
   app.Run();
   ```
   :::
   ::: code-group-item 方案2
   ```csharp
   var builder = WebApplication.CreateBuilder(args);
   
   builder.Services.Configure<IsolationOptions>(options =>
   {
       options.SectionName = "{自定义隔离性节点名}";
   });
   
   builder.Services.AddIsolation(isolationBuilder =>
   {
       isolationBuilder.UseMultiTenant();
   });
   
   var app = builder.Build();
   
   app.UseIsolation();
   
   app.Run();
   ```
   :::
   ::::

2. 能否支持其它配置源而并非本地配置文件？

   支持，可通过以下两种方案支持其它配置源，两种方案任选其一即可

   * 方案1: 选项模式

   使用选项模式配置指定 `name` 的配置信息，以数据上下文为例

   ```csharp
   var builder = WebApplication.CreateBuilder(args);
   
   builder.Services.Configure<IsolationOptions<ConnectionStrings>>(options =>
   {
       options.Data = new List<IsolationConfigurationOptions<ConnectionStrings>>()
       {
           new()
           {
               TenantId = "租户1",
               Data = new ConnectionStrings(new List<KeyValuePair<string, string>>()
               {
                   new(ConnectionStrings.DEFAULT_CONNECTION_STRING_NAME, "租户1数据库连接字符串地址")
               })
           },
           new()
           {
               TenantId = "租户2",
               Data = new ConnectionStrings(new List<KeyValuePair<string, string>>()
               {
                   new(ConnectionStrings.DEFAULT_CONNECTION_STRING_NAME, "租户2数据库连接字符串地址")
               })
           },
       };
   });
   
   builder.Services.AddIsolation(isolationBuilder =>
   {
       isolationBuilder.UseMultiTenant();
   });
   
   var app = builder.Build();
   
   app.Run();
   ```

   > 数据上下文比较特殊，其 **name** 的值为**空**，不存在 **name** 不为空的情况，其余支持自定义 **name** 的模块，则需要通过 **builder.Services.Configure<IsolationOptions<TComponentConfig>>("自定义name的值"，options =>{ });** 设置即可 ( TComponentConfig 为组件的配置对象，详细可查看具体构建块的文档)

   * 方案2: 自定义 **IIsolationConfigProvider**

   通过自定义 **IIsolationConfigProvider** 的实现类来支持其它配置源

   :::: code-group
   ::: code-group-item 自定义隔离性配置提供程序
   ```csharp
   public class CustomIsolationConfigProvider : IIsolationConfigProvider
   {
       /// <summary>
       /// 获取当前租户/环境下指定配置节点下的配置信息（当返回null时，则使用当前组件默认的配置信息）
       /// </summary>
       /// <param name="sectionName">配置节点名 (不同组件的配置节点名不一致 (配置节点名支持自定义))</param>
       /// <param name="name">名称 （默认为空字符串，支持工厂的构建块支持自定义name）</param>
       /// <typeparam name="TComponentConfig">组件的配置对象</typeparam>
       /// <returns></returns>
       /// <exception cref="NotImplementedException"></exception>
       public TComponentConfig? GetComponentConfig<TComponentConfig>(string sectionName, string name = "") where TComponentConfig : class
       {
           // todo: 获取当前租户/环境下的组件配置信息并返回
           return default;
       }
   
       /// <summary>
       /// 获取指定配置节点的所有配置信息
       /// </summary>
       /// <param name="sectionName">配置节点名 (不同组件的配置节点名不一致 (配置节点名支持自定义))</param>
       /// <param name="name">名称 （默认为空字符串，支持工厂的构建块支持自定义name）</param>
       /// <typeparam name="TComponentConfig">组件的配置对象</typeparam>
       /// <returns></returns>
       public List<TComponentConfig> GetComponentConfigs<TComponentConfig>(string sectionName, string name = "") where TComponentConfig : class
       {
           //todo: 获取指定配置节点的所有配置信息
           var list = new List<TComponentConfig>();
           return list;
       }
   }
   ```
   :::
   ::: code-group-item 使用自定义隔离性配置提供程序
   ```csharp
   var builder = WebApplication.CreateBuilder(args);
   
   builder.Services.AddScoped<IIsolationConfigProvider, CustomIsolationConfigProvider>();
   builder.Services.AddIsolation(isolationBuilder =>
   {
       isolationBuilder.UseMultiTenant();
   });
   
   var app = builder.Build();
   
   app.Run();
   ```
   :::
   ::::

