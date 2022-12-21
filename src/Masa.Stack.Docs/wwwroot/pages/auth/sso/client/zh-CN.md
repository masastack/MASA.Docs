# 客户端（Client）

客户端功能为[OAuth 2.0授权框架](https://www.rfc-editor.org/rfc/rfc6749#section-1.1)中定义的客户端角色提供支持。代表服务器创建受保护资源请求的应用程序资源所有者及其授权。

## 创建客户端

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

![sso-client-add](/stack/auth/sso-client-add.png)

资源信息包括：身份资源和Api范围。

![sso-client-add-2](/stack/auth/sso-client-add-2.png)

## 编辑客户端

想比新增客户端编辑客户端有更多的配置和选项，分为`基础信息`,`授权确认`,`认证`,`资源信息`以及一个动态展示项，根据不同类型展示（`Token`,`ClientSecret`,`DeviceFloe`）。

> 客户端配置说明参考系统内提示

![sso-client-update-basic](/stack/auth/sso-client-update-basic.png)

![sso-client-update-consent](/stack/auth/sso-client-update-consent.png)

![sso-client-update-authentication](/stack/auth/sso-client-update-authentication.png)

![sso-client-update-authentication](/stack/auth/sso-client-update-resource.png)

![sso-client-update-token](/stack/auth/sso-client-update-token.png)

![sso-client-update-secret](/stack/auth/sso-client-update-secret.png)

![sso-client-update-device-flow](/stack/auth/sso-client-update-device-flow.png)
