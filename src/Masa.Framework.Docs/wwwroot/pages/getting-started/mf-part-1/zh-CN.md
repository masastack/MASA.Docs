## 1. 创建最小APIs服务

对外提供API服务

### 使用

1. 选中`Masa.EShop.Service.Catalog`项目并安装`Masa.Contrib.Service.MinimalAPIs`, 它默认提供了符合[`RESTful API`](https://aws.amazon.com/cn/what-is/restful-api)标准的API

```powershell
dotnet add package Masa.Contrib.Service.MinimalAPIs
```

> 想了解更多`MinimalAPIs`的功能, 请查看[MinimalAPIs](/framework/building-blocks/minimal-apis)

2. 使用`MinimalAPIs`, 修改`Program`

```csharp
//todo: 服务注册必须在生成app之前完成 (升级到.NET 6.0后增加的约束)
var app = builder.AddServices();
```

3. 新建`Services`目录并新增加类`HealthService`, 并继承`ServiceBase`

```csharp
public class HealthService : ServiceBase
{
    public IResult Get() => Results.Ok("success");
}
```

> 访问地址: {域名}/api/v1/healths

我们建议对外提过API服务的类以`Service`结尾, 虽然它不是必须的, 但是遵守此约定会使得我们的项目可读性更强.

### 其它

继承`ServiceBase`的类仅会在项目启动时被初始化一次, 不需要担心使用它会带来性能损失, 但同时如果你需要注入服务, 可在方法参数中增加待注入的服务, 如果在服务的构造函数中增加服务, 则该服务的生命周期只能是单例, 详细原因可查看[文档](/framework/building-blocks/minimal-apis)