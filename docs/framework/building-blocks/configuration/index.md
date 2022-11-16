---
title: 配置
date: 2022/11/16
---

## 概念

基于键值的配置系统, 可以被用于任何类型的应用程序, 基于`Microsoft.Extensions.Configuration`, 但与默认配置不同的是, 我们将配置分为`Local`、`ConfigurationApi`两种, 其中配置的提供者有:

* Local
  * [Masa.Contrib.Configuration](../../contribs/configuration/index.md): 提供本地配置以及存储本地、远程配置信息的能力
* ConfigurationApi: 远程配置
  * [Dcc](../../contribs/configuration/dcc.md): 由[`分布式配置中心`](../../../stack/dcc/guide/quick-get-started/basic-concepts.md)提供远程配置能力

## 功能列表

* [获取全局配置](#全局配置)
* [选项模式](#选项模式)
* [获取本地配置](#本地配置)
* [获取远程配置](#远程配置)
* [管理远程配置](#管理远程配置)

## 使用

以不使用远程配置, 仅使用本地配置为例:

1. 注册MasaConfiguration

``` C#
builder.Services.AddMasaConfiguration();
```

2. 新建类`AppConfig.cs`, 并继承`LocalMasaConfigurationOptions`, 用于获取配置信息

``` C#
public class AppConfig : LocalMasaConfigurationOptions
{
    public ConnectionStrings ConnectionStrings { get; set; }
}

public class ConnectionStrings
{
    public string DefaultConnection { get; set; }
}
```

3. 新增配置信息, 修改`appsettings.json`

``` appsettings.json
{
 "AppConfig": {
   "ConnectionStrings": {
     "DefaultConnection": "server=localhost;uid=sa;pwd=P@ssw0rd;database=identity"
   }
 }
}
```

4. 获取`AppConfig`配置信息

``` C#
// 通过DI获取到IOptions<AppConfig> options;

IOptions<AppConfig> options = serviceProvider.GetRequiredService<IOptions<AppConfig>>(); 
Console.WriteLine(options.Value.ConnectionStrings.DefaultConnection);
```

## 高阶用法

### 全局配置

* 设置全局配置

``` C#
builder.Services.Configure<MasaAppConfigureOptions>(options =>
{
    options.AppId = "{Replace-With-Your-AppId}";
    options.Environment = "{Replace-With-Your-Environment}";
    options.Cluster = "{Replace-With-Your-Cluster}";

    options.TryAdd("{Replace-With-Your-Key}", "{Replace-With-Your-Value}");//自定义参数
});
```

* 获取全局配置

获取全局配置由两种办法, 分别是:

① 可通过从DI获取`IOptions<MasaAppConfigureOptions>`的值获取

``` C#
IOptions<MasaAppConfigureOptions> options;// 由DI获取
var appId = options.Value.AppId;
```

② 通过`MasaApp`获取

``` C#
var options = MasaApp.GetRequiredService<IOptions<MasaAppConfigureOptions>>();
var appId = options.Value.AppId;
```

### 选项模式

通过自动获取映射关系或者手动指定配置与类的映射关系, 使得支持[选项模式](https://learn.microsoft.com/zh-cn/dotnet/core/extensions/options)

#### 自动映射

* IMasaConfigurationOptions: 实现此接口的类会自动映射到相对应的配置节点
  * ParentSection: 父节点名称, 若未配置父节点时, 默认映射到根节点下的{SectionType}节点上 (默认: null)
  * SectionType: 节点类型
    * Local: 1 (本地节点)
    * ConfigurationApi: 2 (远程节点)
  * Section: 节点名称, 当未配置节点名称时, 默认映射到与当前类名一致的{SectionType}节点上 (默认: null)

> 例: `AppConfig.cs` 类继承了`LocalMasaConfigurationOptions`, 但由于未配置`Section`,则默认映射的节点为: `Local:AppConfig`

#### 手动映射

其中`name`是非必填项, 当不为null时可用于获取指定`name`的配置

1. 注册`MasaConfiguration`并手动映射节点与配置对象关系

``` C#
builder.Services.AddMasaConfiguration(configurationBuilder =>
{
    configurationBuilder.UseMasaOptions(options =>
    {
        options.MappingLocal<TModel>(string? section = null, string? name = null); //将TModel映射到节点: `Local:{section}`
        options.MappingConfigurationApi<TModel2>(string parentSection, string? section = null, string? name = null); //将TModel2映射到节点: `ConfigurationApi:{parentSection}:{section}`
    });
});
```

2. 通过选项模式获取配置

``` C#
IOptions<TModel> options;//由DI获取
var model = options.Value;
```

### 本地配置

如果希望获取本地配置节点, 则可通过以下三种方式获取

* 由DI获取`IConfiguration`的示例`configuration`后, 通过`configuration.GetSection("Local")`获取本地配置
* 由DI获取`IMasaConfiguration`的示例`masaConfiguration`后, 通过`masaConfiguration.Local`获取本地配置
* 通过选项模式获取配置信息

### 远程配置

如果希望获取远程配置节点, 则可通过以下四种方式获取

* 由DI获取`IConfiguration`的示例`configuration`后, 通过`configuration.GetSection("ConfigurationApi")`获取远程配置
* 由DI获取`IMasaConfiguration`的示例`masaConfiguration`后, 通过`masaConfiguration.ConfigurationApi`获取远程配置
* 通过选项模式获取配置信息
* 由DI获取`IConfigurationApiClient`的示例`configurationApiClient`后, 通过其提供的方法获取指定配置

### 管理远程配置

由DI获取到`IConfigurationApiManage`, 支持新增、更新配置

## 源码解读

### 结构调整

使用MasaConfiguration之后, 配置的结构发生调整

``` c#
IConfiguration
├── Local                           本地节点（固定）
│   ├── Redis                       自定义配置
│   ├── ├── Host                    参数
├── ConfigurationApi                远程节点（固定）
│   ├── AppId                       替换为你的AppId
│   ├── AppId ├── Redis             自定义节点
│   ├── AppId ├── Redis ├── Host    参数
```

### IMasaConfiguration

通过DI获取, 并提供获取`Local`配置与`ConfigurationApi`配置的能力

### IConfigurationApiClient

通过DI获取, 并提供获取指定远程配置的能力 (与通过IConfiguration获取配置不同的是, 它们的配置源不同, 需要发送网络请求)

* GetRawAsync(string configObject, Action\<string\>? valueChanged = null): 获取默认`AppId`下指定`configObject`的原始配置信息
* GetRawAsync(string environment, string cluster, string appId, string configObject, Action\<string\>? valueChanged = null): 获取指定`环境`、`集群`、`AppId`下指定`configObject`的原始配置信息
* GetAsync\<T\>(string configObject, Action\<T\>? valueChanged = null): 获取默认`AppId`下指定`configObject`的配置信息, 其配置类型为T(其中T与配置类型一致)
* GetAsync\<T\>(string environment, string cluster, string appId, string configObject, Action\<T\>? valueChanged = null): 获取指定`环境`、`集群`、`AppId`下指定`configObject`的配置信息, 其配置类型为T (其中T与配置类型一致)
* GetDynamicAsync(string environment, string cluster, string appId, string configObject, Action\<dynamic\>? valueChanged = null): 获取指定`环境`、`集群`、`AppId`下指定`configObject`的配置信息, 其配置类型为Dynamic
* GetDynamicAsync(string configObject): 获取默认`AppId`下指定`configObject`的配置信息, 其配置类型为Dynamic

### IConfigurationApiManage

通过DI获取, 并提供新增或者更新配置的能力

* AddAsync(string environment, string cluster, string appId, Dictionary\<string, string\> configObjects, bool isEncryption = false)
* UpdateAsync(string environment, string cluster, string appId, string configObject, object value);

## 扩展

如何支持其它配置中心, 以`Apollo`为例：

1. 新建类库`Masa.Contrib.Configuration.ConfigurationApi.Apollo`
2. 新建`ApolloConfigurationRepository`并继承类`AbstractConfigurationRepository`

``` C#
internal class ApolloConfigurationRepository : AbstractConfigurationRepository
{
    private readonly IConfigurationApiClient _client;
    public override SectionTypes SectionType => SectionTypes.ConfigurationAPI;

    public DccConfigurationRepository(
        IConfigurationApiClient client,
        ILoggerFactory loggerFactory)
        : base(loggerFactory)
    {
        _client = client;
        
        //todo: 借助 IConfigurationApiClient 获取需要挂载到远程节点的配置信息并监听配置变化
        // 当配置变更时触发FireRepositoryChange(SectionType, Load());
    }

    public override Properties Load()
    {
        //todo: 返回当前挂载到远程节点的配置信息
    }
}
```

3. 新建类`ConfigurationApiClient`, 为`ConfigurationApi`提供获取基础配置的能力

``` C#
public class ConfigurationApiClient : IConfigurationApiClient
{
    public Task<(string Raw, ConfigurationTypes ConfigurationType)> GetRawAsync(string configObject, Action<string>? valueChanged = null)
    {
        throw new NotImplementedException();
    }

    public Task<(string Raw, ConfigurationTypes ConfigurationType)> GetRawAsync(string environment, string cluster, string appId, string configObject, Action<string>? valueChanged = null)
    {
        throw new NotImplementedException();
    }

    public Task<T> GetAsync<T>(string configObject, Action<T>? valueChanged = null);
    {
        throw new NotImplementedException();
    }  
    public Task<T> GetAsync<T>(string environment, string cluster, string appId, string configObject, Action<T>? valueChanged = null);
    {
        throw new NotImplementedException();
    }  
    public Task<dynamic> GetDynamicAsync(string environment, string cluster, string appId, string configObject, Action<dynamic> valueChanged)
    {
        throw new NotImplementedException();
    }

    public Task<dynamic> GetDynamicAsync(string key)
    {
        throw new NotImplementedException();
    }
}
```

4. 新建类`ConfigurationApiManage`, 为`ConfigurationApi`提供管理配置的能力

``` C#
public class ConfigurationApiManage : IConfigurationApiManage
{
    // 通过管理端初始化AppId下的远程配置
    public Task InitializeAsync(string environment, string cluster, string appId, Dictionary<string, string> configObjects)
    {
        throw new NotImplementedException();
    }

    // 通过管理端更新指定配置的信息
    public Task UpdateAsync(string environment, string cluster, string appId, string configObject, object value)
    {
        throw new NotImplementedException();
    }
}
```

5. 新建`ConfigurationApiMasaConfigurationOptions`类, 并继承`MasaConfigurationOptions`

不同的配置中心中存储配置的名称是不一样的, 在Apollo中配置对象名称叫做命名空间, 因此为了方便开发人员可以使用起来更方便, 我们建议不同的配置中心可以有自己专属的属性, 以此来降低开发人员的学习成本

``` C#
public abstract class ConfigurationApiMasaConfigurationOptions : MasaConfigurationOptions
{
    /// <summary>
    /// The name of the parent section, if it is empty, it will be mounted under SectionType, otherwise it will be mounted to the specified section under SectionType
    /// </summary>
    [JsonIgnore]
    public sealed override string? ParentSection => AppId;

    //
    public virtual string AppId => StaticConfig.AppId;

    /// <summary>
    /// The section null means same as the class name, else load from the specify section
    /// </summary>
    [JsonIgnore]
    public sealed override string? Section => Namespace;

    /// <summary>
    /// 
    /// </summary>
    public virtual string? Namespace { get; }

    /// <summary>
    /// Configuration object name
    /// </summary>
    [JsonIgnore]
    public sealed override SectionTypes SectionType => SectionTypes.ConfigurationApi;
}
```

6. 选中类库`Masa.Contrib.BasicAbility.Apollo`, 并新建`IMasaConfigurationBuilder`的扩展方法UseApollo

``` C#
public static class MasaConfigurationExtensions
{
    public static IMasaConfigurationBuilder UseApollo(this IMasaConfigurationBuilder builder)
    {
        //todo：将IConfigurationApiClient、IConfigurationApiManage注册到到服务集合中，并通过builder.AddRepository()添加ApolloConfigurationRepository
        return builder;
    }
}
```