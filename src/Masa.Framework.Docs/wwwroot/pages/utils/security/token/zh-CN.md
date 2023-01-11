## 安全 - JWT加密与验证

根据JWT方案生成对应的Token并提供验证合法性方法

## 功能

* [生成Token](#CreateToken)
* [验证Token合法性](#IsValid)

## 使用

### 必要条件

安装`Masa.Utils.Security.Token`包

``` powershell
dotnet add package Masa.Utils.Security.Token
```

1.注册`JWT`扩展

```csharp
services.AddJwt(options => {
    options.Issuer = "{Replace-Your-Issuer}";
    options.Audience = "{Replace-Your-Audience}";
    options.SecurityKey = "{Replace-Your-SecurityKey}";
});
```

2. 创建`Token`

```csharp
var param = "{Replace-Your-Param}";
var token = JwtUtils.CreateToken(param, TimeSpan.FromSeconds(60));
```

3. 验证`token`

```csharp
var param = "{Replace-Your-Param}";
var token = "{Replace-Your-Token}";
if(!JwtUtils.IsValid(token, param))
{
    throw new UserFriendlyException("Verification Failed");
}
```

## 源码解读

* CreateToken(string value, TimeSpan timeout): 创建Token, 在`timeout`时间后失效
* CreateToken(Claim[] claims, TimeSpan timeout): 根据传入的Claim集合创建Token, 在`timeout`时间后失效
* IsValid(string token, string value, Action\<TokenValidationParameters\>? action = null): 根据传入的Token以及原参数信息, 判断Token是否合法
* IsValid(string token, out SecurityToken? securityToken, out ClaimsPrincipal? claimsPrincipal, Action\<TokenValidationParameters\>? action = null): 根据传入的Token得到是否合法, 并返回未加密的原始参数信息