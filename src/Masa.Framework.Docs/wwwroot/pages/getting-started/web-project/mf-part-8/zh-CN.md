## 8. 全局异常与I18n

我们建议在项目中使用全局异常处理, 它对外提供了统一的响应信息, 这将使得我们的项目体验更好

### 必要条件

安装`Masa.Contrib.Exceptions`

```powershell
dotnet add package Masa.Contrib.Exceptions
```

### 全局异常

1. 使用全局异常处理, 修改`Program`

```csharp
app.UseMasaExceptionHandler();
```

针对未处理的异常, 将返回`Internal service error`, 自定义异常处理可参考[文档](/framework/building-blocks/exception#section-4e2d95f44ef6)

> 框架提供了友好异常、参数校验异常等, 我们可以通过抛出友好异常来中断请求, 并输出友好的错误提示信息, 还支持与[多语言](/framework/building-blocks/globalization/overview)配合输出[本地化的错误信息](/framework/building-blocks/exception#section-591a8bed8a00)
