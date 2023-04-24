## 扩展 - DI

提供`IServiceCollection`的扩展方法以及`自动注入`支持

## 功能

* [按照约定注入](#自动注册)
* [IServiceCollection 的扩展](#扩展)

## 使用

安装`Masa.Utils.Extensions.DependencyInjection`

``` powershell
dotnet add package Masa.Utils.Extensions.DependencyInjection
```

1. 新建接口类`IRepository`, 并继承`IScopedDependency`

```csharp
public interface IRepository<TEntity> : IScopedDependency
    where TEntity : class
{
}
```

2. 新建实现类`RepositoryBase`, 并继承`IRepository`

```csharp
public class Repository<TEntity> : IRepository<TEntity>
    where TEntity : class
{
}
```

3. 根据约定注册服务

```csharp
services.AddAutoInject();
```

4. 如何使用

```csharp
IRepository<TEntity> repository;//从DI获取
```

## 高阶用法

### 自动注册

我们会按照约定为继承以下接口的服务完成自动注册

* ISingletonDependency: 注册生命周期为`Singleton`的服务
* IScopedDependency: 注册生命周期为`Scoped`的服务
* ITransientDependency: 注册生命周期为`Transient`的服务
* IAutoFireDependency: 自动触发（与`ISingletonDependency`、`IScopedDependency`、`ITransientDependency`结合使用，在服务自动注册结束后触发一次获取服务操作，仅继承`IAutoFireDependency`不起作用）

继承`ISingletonDependency`、`IScopedDependency`、`ITransientDependency`的类可能是`接口类`或者`普通类`, 不同的类继承会出现不同的效果

1. 当继承类是接口时, 则当前接口与接口的实现将会被自动注册, 并且它具有传染性, 继承当前接口的接口与实现也将会被注册, 例如:

```csharp
public interface IRepository<TEntity> : IScopedDependency
    where TEntity : class
{
}

public class Repository<TEntity> : IRepository<TEntity>
    where TEntity : class
{
}

public interface IUserRepository : IRepository<User>
{
}

public class UserRepository : IUserRepository
{
}
```
实际注册效果等同于:

```csharp
services.Add(typeof(IRepository<>), typeof(Repository<>), ServiceLifetime.Scoped);
services.AddScoped<IUserRepository, UserRepository>();
```

2. 当继承类是普通类时, 则会自动注册当前类以及派生类, 但注册类不包括抽象类, 如果是抽象类, 将不会被自动注册, 例如:

```csharp
public abstract class ServiceBase: IScopedDependency
{
}

public class UserService: ServiceBase
{
}
```

实际效果等同于

```csharp
services.AddScoped<UserService>();
```

### 特性

#### 忽略注入

被用于排除不被自动注入, 可通过增加`IgnoreInjection`特性, 例如:

```csharp
[IgnoreInjection]
public class ServiceBase: IScopedDependency
{

}
```

> 增加`IgnoreInjection`特性后, `ServiceBase`将不会被注册到服务中

如果希望子类也不再被注册, 则可增加特性`IgnoreInjection[true]`, 则当前类及所有继承类都将不会被自动注册

#### 依赖标记

被用于标记服务仅支持被注册一次, 例如:

```csharp
[Dependency(TryRegister = true)]
public class UserService: IScopedDependency
{

}
```

`Dependency`有两个参数:

* TryRegister: 尝试注册到di, 如果服务已经被注册, 则不再进行注册 (默认: false, 服务支持注册多个实现)
    * 设置true则仅当服务未注册时才会被注册, 类似IServiceCollection的TryAdd ... 扩展方法
* ReplaceServices: 替换服务, 如果服务已经被注册, 则替换服务的实现, 否则注册服务 (默认: false, 服务支持注册多个实现)
    * 设置true则替换之前已经注册过的服务, 类似IServiceCollection的Replace ... 扩展方法.

### 扩展

在`Masa.Utils.Extensions.DependencyInjection`中新增加了`IServiceCollection`的扩展方法, 如下:

* GetInstance\<TService\>(): 获取服务T的实例
    * isCreateScope: 是否创建一个新的作用域, 默认: false (创建新的作用域会对生命周期为`Scoped`的服务造成影响, 请谨慎)
* Any\<TService\>(): 是否存在服务TService, 不支持泛型服务
    * lifetime: 是否存在一个生命周期为`lifetime`的服务`TService`(不支持泛型服务)
* Any\<TService, TImplementation\>(): 是否存在服务为`TService`、且实现类为`TImplementation`的服务
    * lifetime: 是否存在一个生命周期为`lifetime`的服务为`TService`, 实现为`TImplementation`的服务(不支持泛型服务)
* Replace\<TService\>(Type implementationType, ServiceLifetime lifetime): 移除服务类型为`TService`的第一个实现, 并将`implementationType`添加到集合中, 生命周期为`lifetime`
* ReplaceAll\<TService\>(Type implementationType, ServiceLifetime lifetime): 移除所有服务类型为`TService`的服务, 并将`implementationType`添加到集合中, 生命周期为`lifetime`