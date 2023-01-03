## LDAP - Novell

基于[Novell.Directory.Ldap.NETStandard](https://github.com/dsbenghe/Novell.Directory.Ldap.NETStandard)的实现, 适用于任何LDAP协议兼容的目录服务器 (包括 Microsoft Active Directory)

## 使用

### 必要条件

安装`Masa.Utils.Ldap.Novell`包

``` powershell
dotnet add package Masa.Utils.Ldap.Novell
```

1. 注册`Ldap`

```csharp
services.AddLadpContext(options => {
    options.ServerAddress = "{Replace-Your-ServerAddress}";
    options.ServerPort = "{Replace-Your-ServerPort}";
    options.ServerPortSsl = "{Replace-Your-ServerPortSsl}";
    options.BaseDn = "{Replace-Your-BaseDn}";
    options.UserSearchBaseDn = "{Replace-Your-UserSearchBaseDn}";
    options.GroupSearchBaseDn = "{Replace-Your-GroupSearchBaseDn}";
    options.RootUserDn = "{Replace-Your-RootUserDn}";
    options.RootUserPassword = "{Replace-Your-RootUserPassword}";
});
```

2. 获取所有用户信息

```csharp
ILdapProvider ldapProvider;//由DI获取
var allUser = await ldapProvider.GetAllUserAsync();
```