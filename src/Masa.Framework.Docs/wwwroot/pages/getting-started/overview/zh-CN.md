## 快速入门

在本系列教程中, 将创建一个名字`Masa.EShop.Service.Catalog`用于管理产品的服务, 它是使用以下技术开发的:

* `Entity Framework Core`提供获取数据的能力
* `Redis`: 提供获取数据的能力, 相比直接操作数据库, 它有更高的并发读写性能
* [`Minimal APIs`](/framework/building-blocks/minimal-apis)对外提供最小依赖项的`HTTP API`

## 目录

* [1. 创建最小APIs服务](/framework/getting-started/mf-part-1)
* [2. 领域层](/framework/getting-started/mf-part-2)
* [3. 保存或获取数据](/framework/getting-started/mf-part-3)
* [4. 自定义仓储实现](/framework/getting-started/mf-part-4)
* [5. 事件总线](/framework/getting-started/mf-part-5)
* [6. 应用服务层](/framework/getting-started/mf-part-6)
* [7. 对象映射](/framework/getting-started/mf-part-7)
* [8. 多级缓存](/framework/getting-started/mf-part-8)
* [9. 全局异常处理与I18n](/framework/getting-started/mf-part-9)

## 下载源码

* [Masa.EShop.Demo](https://github.com/zhenlei520/Masa.EShop.Demo)

## 创建解决方案

在开发之前, 可以根据[模板](#)创建项目或者自行创建解决方案并按需使用, 下面将使用非模板方式创建

新建`ASP.NET Core`空项目`Masa.EShop.Service.Catalog`

```powershell
dotnet new web -o Masa.EShop.Service.Catalog
cd Masa.EShop.Service.Catalog
```

## 全局配置

### nuget版本

我们建议大家在同一个解决方案中使用同一版本的`MasaFramework`包, 避免因为版本不一致导致出现的bug

1. 在解决方案根目录增加名字为`Directory.Build`、扩展名为`.props`的文件, 并指定`MasaFramework`使用的是`1.0.0-preview.1`版本的nuget包

```xml
<Project>
  <PropertyGroup>
    <MasaFrameworkPackageVersion>1.0.0-preview.1</MasaFrameworkPackageVersion>
  </PropertyGroup>
</Project>
```

> 如果遇到`IDE`不能正确识别包版本号的情况, 请再次检查文件名, 确保其扩展名为`props`, 而不是扩展名为`.txt`的文件

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

### 全局Using

使用全局using代替局部using, 避免每个类中都需要引用命名空间, 在类库跟目录新增名子为`_Imports`的类, 其中引入当前类库使用的命名空间, 例如:

```csharp
global using System.Linq.Expressions;
```

## 其它

当前文档适用于`1.0.0-preview.1`, 请确保`Masa.XXX.XXX`包安装统一版本, 后续文档将不再特殊注明包的版本信息