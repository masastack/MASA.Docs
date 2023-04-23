# 基础概念  
目前最流行的授权机制，用于授权第三方应用获取用户数据。其主要内容有：用户声明、身份资源、API范围、API资源、客户端。
## 用户声明  

用户声明用于描述用户的属性，比如年龄、性别、户籍所在地等。单个用户声明对应单个用户属性。

### 列表

用户声明列表以表格形式展现，有分页、模糊搜索功能。

> 模糊搜索支持用户声明名称

![](http://cdn.masastack.com/stack/doc/auth/userClaim-search.png)

### 新建

点击列表页的新建按钮可打开新建用户声明的表单窗口。

> 此窗口创建的用户声明类型为自定义类型

![](http://cdn.masastack.com/stack/doc/auth/userClaim-add-button.png)
![](http://cdn.masastack.com/stack/doc/auth/userClaim-add.png)

### 快速创建标准声明

点击列表页的快速创建标准声明按钮，系统会自动创建[标准的用户声明](https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims)

> 系统创建的用户声明类型为标准类型

![](http://cdn.masastack.com/stack/doc/auth/userClaim-add-standard-button.png)
![](https://masa-docs.oss-cn-hangzhou.aliyuncs.com/stack/auth/develop-authorize-oauth/accept-quick-claim.png)

### 编辑

点击表格里指定行对应的操作列中的编辑图标，可打开编辑用户声明的表单窗口。

![](http://cdn.masastack.com/stack/doc/auth/userClaim-edit-icon.png)
![](http://cdn.masastack.com/stack/doc/auth/userClaim-edit.png)

### 删除

点击表格里指定行对应的操作列中的删除图标，可打开删除用户声明提示框，点击确认后将删除改数据。

![](http://cdn.masastack.com/stack/doc/auth/userClaim-remove-icon.png)
![](http://cdn.masastack.com/stack/doc/auth/userClaim-remove.png)

## 身份资源

身份资源是[用户声明](/stack/auth/guides/sso/identityResource)的集合。比如创建"身份证"身份资源，身份证包含姓名、出生日期、户籍所在地、头像等用户声明。单个份资源对应多个用户声明。

### 列表

身份资源列表以表格形式展现，有分页、模糊搜索功能。

> 模糊搜索支持身份资源名称、显示名称、描述

![](http://cdn.masastack.com/stack/doc/auth/identityResource-search.png)

### 新建

点击列表页的新建按钮可打开新建身份资源的表单窗口。

![](http://cdn.masastack.com/stack/doc/auth/identityResource-add-button.png)
![](http://cdn.masastack.com/stack/doc/auth/identityResource-add.png)

> 是否必须：勾选代表[客户端](/stack/auth/guides/sso/client)必须包含该身份资源

> 强调：勾选代表在用户授权界面中突出重点显示此项

> 在文档中展示：勾选代表会在OIDC发现文档中展示该身份资源

### 快速创建标准声明

点击列表页的快速创建标准身份资源按钮，系统创建[标准的身份资源](https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims)

![](http://cdn.masastack.com/stack/doc/auth/identityResource-add-standard-button.png)
![](https://masa-docs.oss-cn-hangzhou.aliyuncs.com/stack/auth/develop-authorize-oauth/accept-quick-identity-resource.png)

### 编辑

点击表格里指定行的操作列中的编辑图标，可打开编辑身份资源的表单窗口。

![](http://cdn.masastack.com/stack/doc/auth/identityResource-edit-icon.png)
![](http://cdn.masastack.com/stack/doc/auth/identityResource-edit.png)

### 删除

点击表格里指定行的操作列中的删除图标，可删除当前行数据。

![](http://cdn.masastack.com/stack/doc/auth/identityResource-remove-icon.png)
![](http://cdn.masastack.com/stack/doc/auth/identityResource-remove.png)

## API范围

ApiScope用于描述Api,比如发送邮件Api。单个ApiScope对应单个Api。

```csharp 
var apiScope = new ApiScope
{
	Name = "SendEmail",
	DisplayName = "发送邮件"
};
```

### 列表

ApiScope列表以表格形式展现，有分页、模糊搜索功能。

> 模糊搜索支持显示名称、配置名称

![](https://masa-docs.oss-cn-hangzhou.aliyuncs.com/stack/auth/develop-authorize-oauth/api-scope-list.png)

### 新建

点击列表页的新建按钮可打开新增ApiScope的表单窗口。

![](http://cdn.masastack.com/stack/doc/auth/apiScope-add-button.png)
![](http://cdn.masastack.com/stack/doc/auth/apiScope-add.png)

> 是否必须：勾选代表[Client](/stack/auth/guides/sso/client)必须Scope设置包含改身份资源

> 强调：勾选代表在用户授权界面中突出重点显示此项

> 在文档中展示：勾选代表会在发现文档中展示该身份资源

### 编辑

点击表格里指定行对应的操作列中的编辑图标，可打开编辑ApiScope的表单窗口。

![](http://cdn.masastack.com/stack/doc/auth/apiScope-edit-icon.png)
![](http://cdn.masastack.com/stack/doc/auth/apiScope-edit.png)

### 删除

点击表格里指定行对应的操作列中的删除图标，可打开删除ApiScope提示框，点击确认后将删除改数据。

![](http://cdn.masastack.com/stack/doc/auth/apiScope-remove-icon.png)
![](http://cdn.masastack.com/stack/doc/auth/apiScope-remove.png)

## API资源

ApiResource是apiScope的集合，一个ApiResource对应多个apiScope。

```html
var apiResource = new ApiResource
{
	Name = "EmailModule",
	DisplayName = "邮件模块",
	Scopes = new List<string>
	{
		"SendEmail",
		"RemoveEmail",
		"ReadEmail"
	}
};
```

### 列表

Api资源列表以表格形式展现，有分页、模糊搜索功能。

> 模糊搜索支持显示名称、配置名称

![](http://cdn.masastack.com/stack/doc/auth/apiResource-add-button.png)

### 新建

点击列表页的新建按钮可打开新建Api资源的表单窗口。

![](http://cdn.masastack.com/stack/doc/auth/apiResource-add-button.png)
![](http://cdn.masastack.com/stack/doc/auth/apiResource-add.png)

> 在文档中展示：勾选代表会在发现文档中展示该Api资源

### 编辑

点击表格中指定行对应的操作列中的编辑图标可打开编辑Api资源的表单窗口。

![](http://cdn.masastack.com/stack/doc/auth/apiResource-edit-icon.png)
![](http://cdn.masastack.com/stack/doc/auth/apiResource-edit.png)

### 删除

点击表格中指定行对应的操作列中的删除图标可删除当前行数据。

![](http://cdn.masastack.com/stack/doc/auth/apiResource-remove-icon.png)
![](http://cdn.masastack.com/stack/doc/auth/apiResource-remove.png)

## 客户端

客户端功能为[OAuth 2.0授权框架](https://www.rfc-editor.org/rfc/rfc6749#section-1.1)中定义的客户端角色提供支持。代表服务器创建受保护资源请求的应用程序资源所有者及其授权。

### 创建客户端

创建客户端时首先要选择默认客户端类型，系统会根据客户端类型设置默认GrantTypes。分别为：

* `Web` 对应 `authorization_code` + Pkce
* `Spa` 对应 `authorization_code` + Pkce
* `Native` 对应 `authorization_code` + Pkce
* `Machine` 对应 `client_credentials`
* `Device` 对应 `device_code`

> 暂不支持自定义，应针对`IExtensionGrantValidator`支持自定义Grant Type

填写必填项客户端Id和客户端名称保存即可。

* 客户端Id：客户端唯一标识，对接Oidc时指定的ClientId值。
* 客户端名称：授权页等页面展示的客户端名称。

![sso-client-add](http://cdn.masastack.com/stack/doc/auth/sso-client-add.png)

资源信息包括：身份资源和Api范围。

![sso-client-add-2](http://cdn.masastack.com/stack/doc/auth/sso-client-add-2.png)

### 编辑客户端

想比新增客户端编辑客户端有更多的配置和选项，分为`基础信息`,`授权确认`,`认证`,`资源信息`以及一个动态展示项，根据不同类型展示（`Token`,`ClientSecret`,`DeviceFloe`）。

> 客户端配置说明参考系统内提示

![sso-client-update-basic](http://cdn.masastack.com/stack/doc/auth/sso-client-update-basic.png)

![sso-client-update-consent](http://cdn.masastack.com/stack/doc/auth/sso-client-update-consent.png)

![sso-client-update-authentication](http://cdn.masastack.com/stack/doc/auth/sso-client-update-authentication.png)

![sso-client-update-authentication](http://cdn.masastack.com/stack/doc/auth/sso-client-update-resource.png)

![sso-client-update-token](http://cdn.masastack.com/stack/doc/auth/sso-client-update-token.png)

![sso-client-update-secret](http://cdn.masastack.com/stack/doc/auth/sso-client-update-secret.png)

![sso-client-update-device-flow](http://cdn.masastack.com/stack/doc/auth/sso-client-update-device-flow.png)

