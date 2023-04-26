## 简介

通过注入`IAuthClient`接口，调用对应Service获取Auth SDK 提供的能力。
SDK依赖`IMultiEnvironmentUserContext`获取当前用户，所有用到当前用户ID的方法均不用传递改值，通过`IMultiEnvironmentUserContext`解析获取用户信息。
添加Auth SDK前应确保添加了`Masa.Contrib.Authentication.Identity.XXXX`，否则会抛出异常。

## 服务介绍

Auth SDK 包含一下几个大类的服务

```csharp 
IAuthClient
├── UserService                     用户服务
├── SubjectService                  全局搜索用户、角色、团队、组织架构
├── TeamService                     团队服务
├── PermissionService               权限、菜单服务
├── CustomLoginService              自定义登录服务
├── ThirdPartyIdpService            获取支持的第三方平台数据
└── ProjectService                  全局导航服务
```

> 所有接口均通过Http封装的方式实现，后期可能会调整部分接口直接读取Redis缓存。

## 使用介绍

### 安装依赖包

```csharp 
Install-Package Masa.Contrib.StackSdks.Auth
```

### 注册相关服务

```csharp 
builder.Services.AddAuthClient("http://authservice.com");
```

> `http://authservice.com` 为Auth后台服务地址

### 示例
#### 用户管理
:::: code-group 
::: code-group-item 获取当前用户信息

```csharp 
using Masa.BuildingBlocks.StackSdks.Auth;
using Masa.BuildingBlocks.StackSdks.Auth.Contracts.Model;
using Microsoft.AspNetCore.Mvc;

/// <summary>
/// 用户
/// </summary>
[ApiController]
[Route("[controller]/[action]")]
public class UserController : ControllerBase
{
    private readonly IAuthClient _authClient;
    public UserController(IAuthClient authClient)
    {
        _authClient = authClient;
    }

    [HttpGet]
    public async Task<UserModel> GetCurrentUserAsync()
    {
        return await _authClient.UserService.GetCurrentUserAsync();
    }
}
```
:::
::: code-group-item 更新用户信息

``` csharp
using Masa.BuildingBlocks.StackSdks.Auth;
using Masa.BuildingBlocks.StackSdks.Auth.Contracts.Model;
using Microsoft.AspNetCore.Mvc;

/// <summary>
/// 用户
/// </summary>
[ApiController]
[Route("[controller]/[action]")]
public class UserController : ControllerBase
{
    private readonly IAuthClient _authClient;
    public UserController(IAuthClient authClient)
    {
        _authClient = authClient;
    }

    [HttpPost]
	public async Task UpdateBasicInfoAsync(UpdateUserBasicInfoModel user)
    {
        return await _authClient.UserService.UpdateBasicInfoAsync(user);
    }
}

```
:::
::: code-group-item 删除用户

``` csharp
using Masa.BuildingBlocks.StackSdks.Auth;
using Masa.BuildingBlocks.StackSdks.Auth.Contracts.Model;
using Microsoft.AspNetCore.Mvc;

/// <summary>
/// 用户
/// </summary>
[ApiController]
[Route("[controller]/[action]")]
public class UserController : ControllerBase
{
    private readonly IAuthClient _authClient;
    public UserController(IAuthClient authClient)
    {
        _authClient = authClient;
    }

    [HttpPost]
	public async Task RemoveAsync(Guid id)
    {
        return await _authClient.UserService.RemoveAsync(id);
    }
}

```
::: 
::::

#### 登录

:::: code-group 
::: code-group-item 手机号登录
``` csharp
using Masa.BuildingBlocks.StackSdks.Auth;
using Masa.BuildingBlocks.StackSdks.Auth.Contracts.Model;
using Microsoft.AspNetCore.Mvc;

/// <summary>
/// 用户
/// </summary>
[ApiController]
[Route("[controller]/[action]")]
public class LoginController : ControllerBase
{
    private readonly IAuthClient _authClient;
    public UserController(IAuthClient authClient)
    {
        _authClient = authClient;
    }

    [HttpPost]
	public async Task<TokenModel> LoginByPhoneNumberAsync(LoginByPhoneNumberFromSsoModel login);
    {
        return await _authClient.UserService.LoginByPhoneNumberAsync(login);
    }
}

```
:::
::: code-group-item 密码登录

``` csharp
using Masa.BuildingBlocks.StackSdks.Auth;
using Masa.BuildingBlocks.StackSdks.Auth.Contracts.Model;
using Microsoft.AspNetCore.Mvc;

/// <summary>
/// 用户
/// </summary>
[ApiController]
[Route("[controller]/[action]")]
public class LoginController : ControllerBase
{
    private readonly IAuthClient _authClient;
    public UserController(IAuthClient authClient)
    {
        _authClient = authClient;
    }

    [HttpPost]
	public async Task<TokenModel> LoginByPasswordAsync(LoginByPasswordModel login);
    {
        return await _authClient.UserService.LoginByPasswordAsync(login);
    }
}

```
::: ::::
