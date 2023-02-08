## 9. 全局异常与I18n

我们建议在项目中使用全局异常处理, 它对外提供了统一的响应信息, 这将使得我们的项目体验更好

### 全局异常

1. 安装`Masa.Contrib.Exceptions`

```powershell
dotnet add package Masa.Contrib.Exceptions
```

2. 使用全局异常处理, 修改`Program`

```csharp
app.UseMasaExceptionHandler();
```

针对未处理的异常, 将返回`Internal service error`, 自定义异常处理可参考[文档](/framework/building-blocks/exception), 除此之外, 框架提供了友好异常、参数校验异常等也十分好用, 在使用i18n时, 可以更为简单的实现针对当前文化的错误内容输出

```csharp
public class HealthService : ServiceBase
{
    ------省略其它方法------
    
    public IResult GetFailed() => throw new UserFriendlyException(errorCode: "CustomFailed");
}
```

### I18n

全局异常与I18n配合起来更简单, 如果异常类型是`MasaException`异常, 并且项目使用了`I18n`, 则提示内容将以对应语言进行返回

1. 安装`Masa.Contrib.Globalization.I18n.AspNetCore`

```powershell
dotnet add package Masa.Contrib.Exceptions
```

2. 注册`i18n`并使用, 修改`Program`

```csharp
builder.Services.AddI18n();

------省略------

app.UseI18n();//使用i18n

app.UseMasaExceptionHandler();
```

3. 添加多语言资源文件, 文件夹结构如下:

```structure
- Resources
  - I18n
    - en-US.json
    - zh-CN.json
    - supportedCultures.json
```

* supportedCultures.json

```supportedCultures.json
[
    {
        "Culture":"zh-CN",
        "DisplayName":"中文简体",
        "Icon": "{Replace-Your-Icon}"
    },
    {
        "Culture":"en-US",
        "DisplayName":"English (United States)",
        "Icon": "{Replace-Your-Icon}"
    }
]
```

* en-US.json

```csharp
{
  "Home":"Home",
  "CustomFailed": "自定义错误"
}
```

* zh-CN.json

```csharp
{
  "Home":"首页",
  "CustomFailed": "custom error"
}
```

在对应的语言资源中添加多语言资源即可, 多语言资源支持远程配置, 详细文档可[查看](/framework/building-blocks/globalization/overview)

