## 国际化 - i18n

提供框架`I18n`的能力以及多语言的资源包, 目前框架提供了以下语言支持, 欢迎感兴趣的小伙伴帮助一起完善支持更多语言:

* en-US - English (英文)
* zh-CN - Chinese (简体中文)

## 使用

1. 安装`Masa.Contrib.Globalization.I18n`

``` powershell
dotnet add package Masa.Contrib.Globalization.I18n
```

2. 添加多语言资源文件, 文件夹结构如下:

``` structure
- Resources
  - I18n
    - en-US.json
    - zh-CN.json
    - supportedCultures.json
```

* en-US.json

``` en-US.json
{
    "Home":"Home"
}
```

* zh-CN.json

``` zh-CN.json
{
    "Home":"首页"
}
```

* supportedCultures.json

``` supportedCultures.json
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

3. 注册`I18n`, 并修改`Program.cs`

```csharp
builder.Services.AddI18n();
```

4. 使用`I18n`

```csharp
app.Map("/test", (string key) => I18n.T(key));
```

## 高阶用法

### 嵌入资源

通过更改文件属性可以将资源类型改为`嵌入资源` (EmbeddedResource), 嵌入资源文件将在发布时被嵌入到dll中, 避免后续不通过程序修改配置, 此时我们只需要将注册`I18n`的代码改为:

```csharp
builder.Services.AddI18nByEmbedded(new[] { Assembly.GetEntryAssembly()! });//Assembly集合为语言资源文件所在的程序集
```

### 修改默认资源路径

默认支持语言将会读取默认资源路径下的`{SupportCultureName}` (默认: supportedCultures.json) 文件, 或者可以直接修改`SupportedCultures`属性修改默认支持语言

```csharp
builder.Services.AddI18n(options =>
{
    options.ResourcesDirectory = Path.Combine("Resources", "I18n");//修改默认资源路径
});
```