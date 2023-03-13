## 推荐

好的编码风格不仅仅使得我们的项目的可读性更强, 同时它也使得项目更加的更优雅, 为此我们建议大家按照以下推荐进行编码

### 使用统一版本的包

对同一系列的包使用同一版本有助于避免因为版本不一致而出现各种各样的奇怪bug, 我们建议增加全局配置, 通过全局配置来解决此问题

1. 在解决方案根目录增加名字为`Directory.Build`、扩展名为`.props`的文件

并指定`MasaFramework`使用的是特定版本的nuget包, 这里我们以`1.0.0-preview.1`版本为例

```xml
<Project>
  <PropertyGroup>
    <MasaFrameworkPackageVersion>1.0.0-preview.1</MasaFrameworkPackageVersion>
  </PropertyGroup>
</Project>
```

> 如果遇到`IDE`不能正确识别包版本号的情况, 请再次检查文件名, 确保其扩展名为`props`, 而不是扩展名为`.txt`的文件

后续升级版本时修改`MasaFrameworkPackageVersion`的值为对应版本即可

2. 打开名为`Masa.XXX.XXX.csproj`的文件, 并使用全局配置文件的版本

以`Masa.Contrib.Service.MinimalAPIs`为例, 我们修改其`Version`的值为`$(MasaFrameworkPackageVersion)`

```xml
<Project Sdk="Microsoft.NET.Sdk.Web">
  <PropertyGroup>
    <TargetFramework>net7.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Masa.Contrib.Service.MinimalAPIs" Version="$(MasaFrameworkPackageVersion)" />
  </ItemGroup>
</Project>
```

### 全局引用

使用全局引用代替局部引用, 避免每个类中都需要引入命名空间

在类库根目录新增名子为`_Imports`的类, 其中引入当前类库使用的命名空间, 例如:

```csharp
global using System.Linq.Expressions;
```

### 类命名

在文档中会发现很多地方有推荐命名要求, 它们都不是强制性的, 但我们仍然建议大家能按照推荐进行命名

<div class="custom-table">

| 后缀               | 描述                             |
|------------------|--------------------------------|
| Service          | API服务                          |
| DomainEvent      | 领域事件                           |
| DomainService    | 领域服务                           |
| Repository       | 仓储                             |
| DbContext        | 数据上下文                          |
| Event            | 进程内事件                          |
| EventHandler     | 事件处理程序                         |
| DomainEvent      | 领域事件                           |
| DomainEventHandler | 领域事件处理程序                       |
| Command          | 写命令的进程内事件                      |
| Query            | 读命令的进程内事件                      |
| DomainCommand    | 写命令的领域事件                       |
| DomainQuery      | 读命令的领域事件                       |
| IntegrationDomainEvent | 集成领域事件 (服务的发布与订阅不在同一个进程中)      |
| EntityTypeConfiguration | 数据库表与实体映射关系, [相关文档](https://learn.microsoft.com/zh-cn/dotnet/api/system.data.entity.modelconfiguration.entitytypeconfiguration-1) (EFCore) |

</div>