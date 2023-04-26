## 概念

基于 [Microsoft.Extensions.Configuration](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/configuration)。在 `Microsoft.Extensions.Configuration` 的基础上扩展出**本地配置**和**远程配置**。对于本地配置和远程配置，我们依然使用注入 `IOptions<xxxOptions>` 的方式获取配置。

* 本地配置：优化了 `Microsoft.Extensions.Configuration` 的配置方式，不需要手动 `Configure<xxxOption>`。
* 远程配置：对接分布式配置中心，远程配置更新各应用集群也会相应更新。一般用于应用程序较多，每个应用程序有相同的配置及自己的配置。

## 最佳实践

* Local: 本地配置
  * [Masa.Contrib.Configuration](/framework/building-blocks/configuration/configuration-local): 基于 `Microsoft.Extensions.Configuration` 的基础上提供了更加方便的配置方式，不需要手动 `Configure<xxxOptions>`。
* ConfigurationApi: 远程配置
  * [Masa.Contrib.Configuration.ConfigurationApi.Dcc](/framework/building-blocks/configuration/dcc): 对接分布式配置中心 [MASA DCC](/stack/dcc/introduce)，从而实现配置集中管理。
  * 更多……（敬请期待）

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

```csharp 
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

```csharp
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

```csharp
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

```csharp
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

```csharp
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

```csharp
public static class MasaConfigurationExtensions
{
    public static IMasaConfigurationBuilder UseApollo(this IMasaConfigurationBuilder builder)
    {
        //todo：将IConfigurationApiClient、IConfigurationApiManage注册到到服务集合中，并通过builder.AddRepository()添加ApolloConfigurationRepository
        return builder;
    }
}
```