# Coding Style and Code Standards

A good coding style not only makes our project more readable, but also makes it more elegant. Therefore, we recommend that everyone follow the following recommendations for coding.

## Use a Unified Version of Packages

Using the same version of packages in the same series helps to avoid strange bugs caused by version inconsistencies. We recommend adding a global configuration to solve this problem.

1. Add a configuration file in the root directory of the solution, using a specific version of the NuGet package. Here we take version `1.0.0-preview.1` as an example.

```xml Directory.Build.props
<Project>
  <PropertyGroup>
    <MasaFrameworkPackageVersion>1.0.0-preview.1</MasaFrameworkPackageVersion>
  </PropertyGroup>
</Project>
```

> If the `IDE` cannot recognize the package version number correctly, please check the file name again to ensure that its extension is `props`, not a file with the extension `.txt`.

When upgrading to a new version, simply modify the value of `MasaFrameworkPackageVersion` to the corresponding version.

2. Modify the project configuration file to use the version of the package specified in the global configuration file. Here we take `Masa.Contrib.Service.MinimalAPIs` as an example.

```xml XXX.csproj
<Project Sdk="Microsoft.NET.Sdk.Web">
  <PropertyGroup>
    <TargetFramework>net6.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Masa.Contrib.Service.Mini```xml
<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <TargetFramework>netstandard2.0</TargetFramework>
    <Authors>John Doe</Authors>
    <Company>Acme Inc.</Company>
    <Description>My library description</Description>
    <PackageId>MyLibrary</PackageId>
    <Version>1.0.0</Version>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Newtonsoft.Json" Version="12.0.3" />
    <PackageReference Include="RestSharp" Version="106.11.7" />
    <PackageReference Include="malAPIs" Version="$(MasaFrameworkPackageVersion)" />
  </ItemGroup>

</Project>
```

## Global Usings

Use global usings instead of local usings to avoid having to import namespaces in every class.

Create a `_Imports` class in the root directory of the library and import the namespaces used in the library, for example:

```csharp Imports.cs
global using System.Linq.Expressions;
```

> Sort global using namespaces (use **Ctrl+K+E** in Visual Studio)

### Class Naming

In the documentation, you will find recommended naming conventions. They are not mandatory, but we still recommend that you follow them.

| Suffix           | Description                                                                                                                                |
|------------------|--------------------------------------------------------------------------------------------------------------------------------------------|
| Service          | API service                                                                                                                                |
| DomainEvent      | Domain event                                                                                                                               || DomainService | Domain Service |
| Repository | Repository |
| DbContext | Data Context |
| Event | In-process Event |
| EventHandler | Event Handler || DomainEventHandler | A handler for domain events.                                                                                                                       |
| Command            | An in-process event for writing commands.                                                                                                           |
| Query              | An in-process event for reading commands.                                                                                                           |
| DomainCommand      | A domain event for writing commands.                                                                                                                |
| DomainQuery        | A domain event for reading commands.                                                                                                                |
| IntegrationDomainEvent | An integrated domain event (when the service publishing and subscription are not in the same process).                                          |// 32
    Sunday    = 0b_0100_0000,  // 64
    Weekend   = Saturday | Sunday,
    Workday   = Monday | Tuesday | Wednesday | Thursday | Friday,
    All       = Workday | Weekend
}
```

### 方法命名规范

* 方法名使用动词或者动词短语，表示方法的行为
* 方法名使用 PascalCase 风格，即首字母大写，后面单词首字母也大写
* 方法名应该尽量简短，但是要表达清楚方法的意图

例如：

```csharp
public void SaveChanges();
public void Add(TEntity entity);
public void Remove(TEntity entity);
public TEntity FindById(int id);
```

### 属性命名规范

* 属性名使用 PascalCase 风格，即首字母大写，后面单词首字母也大写
* 属性名应该尽量简短，但是要表达清楚属性的意图
* 属性名应该使用名词或者名词短语，表示属性的含义

例如：

```csharp
public class Person
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public int Age { get; set; }
    public DateTime Birthday { get; set; }
}
```

### 字段命名规范

* 字段名使用 camelCase 风格，即首字母小写，后面单词首字母大写
* 字段名应该尽量简短，但是要表达清楚字段的意图
* 字段名应该使用名词或者名词短语，表示字段的含义

例如：

```csharp
public class Person
{
    private string firstName;
    private string lastName;
    private int age;
    private DateTime birthday;
}
``````
// 32
    Sunday    = 0b_0100_0000,  // 64
    Weekend   = Saturday | Sunday
}
```

(Note: This is a code snippet, so I will not translate the actual code, but rather the comments within it.)