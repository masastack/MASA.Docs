## 1. 创建最小APIs服务

### 必要条件

选中API服务所在类库并安装`Masa.Contrib.Service.MinimalAPIs`, 它默认提供了符合[`RESTful API`](https://aws.amazon.com/cn/what-is/restful-api)标准的API

```powershell
dotnet add package Masa.Contrib.Service.MinimalAPIs
```

> 想了解更多`MinimalAPIs`的功能, 请查看[文档](/framework/building-blocks/minimal-apis)

### 使用

1. 使用`MinimalAPIs`, 修改`Program`

```csharp
//todo: 服务注册必须在生成app之前完成 (升级到.NET 6.0后增加的约束)
var app = builder.AddServices();
```

2. 新建`Services`目录并新增加类`HealthService`, 并继承`ServiceBase`

```csharp
public class HealthService : ServiceBase
{
    public IResult Get() => Results.Ok("success");
}
```

> 访问地址: {域名}/api/v1/healths