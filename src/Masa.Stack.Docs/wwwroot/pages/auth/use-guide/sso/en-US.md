# SSO Login

Single Sign On (SSO) is one of the popular solutions for enterprise business integration. SSO allows users to access all trusted applications with just one login across multiple systems.
SSO is achieved through a one-time authentication process. Once a user logs in to the identity authentication server, they gain access to all related systems and applications in the SSO system. This implementation does not require administrators to modify the user's login status or other information. This means that users only need to log in once to access all trusted applications across multiple systems. This method reduces the time consumption caused by login and assists in user management, making it popular.

> Feature: One login, access all.  
> From the perspective of the entire system, the core of SSO consists of three elements: 1. Users, 2. Systems, 3. Authentication center.

![Comparison between non-SSO and SSO](https://cdn.masastack.com/stack/doc/auth/sso/nosso-sso.svg)

Use Auth user to log in to the Auth console.

## User Claim

User claim is used to describe user attributes, such as age, gender, and place of residence. A single user claim corresponds to a single user attribute.

Click **Single Sign On** -> **User Claim** on the left navigation bar.

User claims are displayed in a table format with pagination and fuzzy search functions.

### Search User Claim

> Fuzzy search for user claim name

![User Claim List](https://cdn.masastack.com/stack/doc/auth/sso/userclaim/userclaim-search.png)

### Create User Claim

Click `New` in the upper right corner of the list page to open the form window for creating a new user claim.

* **Name**: Required, unique and non-repetitive, 2 to 50 characters.
* **Description**: Required, 2 to 255 characters.

![Create User Claim](https://cdn.masastack.com/stack/doc/auth/sso/userclaim/userclaim-add.png)

### Quick Create Standard Claim表页右上角的`快速新建身份资源`，系统会自动创建一个身份资源。

> 快速创建身份资源执行一次即可。

![快速新建身份资源图](https://cdn.masastack.com/stack/doc/auth/sso/identityresource/identityresource-add-quick.png)

### 编辑身份资源

点击表格中指定行对应的操作列中的`编辑图标`可打开编辑身份资源的表单窗口。

* **名称**：必填，2到255个字符。
* **描述**：必填，2到255个字符。

![编辑身份资源图](https://cdn.masastack.com/stack/doc/auth/sso/identityresource/identityresource-edit.png)

### 删除身份资源

点击表格中指定行对应的操作列中的`删除图标`，点击`确定`即可删除。

![删除身份资源图](https://cdn.masastack.com/stack/doc/auth/sso/identityresource/identityresource-delete.png)

## IdentityServer4

IdentityServer4是一个开源的身份认证和授权解决方案，它实现了OpenID Connect和OAuth 2.0协议。它可以用于Web应用程序、移动应用程序、API和微服务等场景。The "New" button in the upper right corner of the page opens a form window for creating a new identity resource.

* **Display Name**: Required, 2 to 50 characters.
* **Name**: Required, unique and cannot be duplicated, 2 to 50 characters.
* **Description**: Optional, up to 255 characters.

> Required: Checking this means the [Client](/stack/auth/guides/sso/client) must have a Scope that includes this identity resource.  
> Emphasis: todo  
> Show in documentation: Checking this means the identity resource will be displayed in the discovery document.

![New Identity Resource](https://cdn.masastack.com/stack/doc/auth/sso/identityresource/identityresource-add.png)

### Quickly Create Standard Identity Resources

Clicking the "Quickly Create Standard Identity Resources" button in the upper right corner of the list page will automatically create [standard identity resources](https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims).

> This action only needs to be performed once.

![Quickly Create Standard Identity Resources](https://cdn.masastack.com/stack/doc/auth/sso/identityresource/identityresource-add-quick.png)

### Edit Identity Resource

Clicking the "Edit" icon in the operation column of the specified row in the table opens a form window for editing the identity resource.

* **Display Name**: Required, 2 to 50 characters.
* **Name**: Cannot be edited.
* **Description**: Required, 2 to 255 characters.

![Edit Identity Resource](https://cdn.masastack.com/stack/doc/auth/sso/identityresource/identityresource-edit.png)

### Delete Identity Resource

Clicking the "Delete" icon in the operation column of the specified row in the table and then clicking "OK" will delete the identity resource.

![Delete Identity Resource](https://cdn.masastack.com/sdes/sso/client)必须Scope设置包含该身份资源。  
> 强调：todo  
> 在文档中展示：勾选代表会在发现文档中展示该身份资源。  
> 用户声明可多选。

![编辑API范围图](https://cdn.masastack.com/stack/doc/auth/sso/apiscope/apiscope-edit.png)

### 删除API范围

点击表格中指定行对应的操作列中的`删除图标`可删除该API范围。

> 删除API范围会同时删除与之关联的[API资源](/stack/auth/guides/sso/apiresource)和[身份资源](/stack/auth/guides/sso/identityresource)。

![删除API范围图](https://cdn.masastack.com/stack/doc/auth/sso/apiscope/apiscope-delete.png)示该API资源。

![新建API资源图](https://cdn.masastack.com/stack/doc/auth/sso/apiresource/apiresource-create.png)

### 编辑API资源

在API资源列表中，点击对应行的操作列中的`编辑图标`可打开编辑API资源的表单窗口。

* **显示名称**：必填，2到50个字符。
* **描述**：可空，最多255个字符。

> 在文档中展示：勾选代表会在发现文档中展示该API资源。

![编辑API资源图](https://cdn.masastack.com/stack/doc/auth/sso/apiresource/apiresource-edit.png)

### 删除API资源

点击表格中指定行对应的操作列中的`删除图标`，点击`确定`即可删除。

![删除API资源图](https://cdn.masastack.com/stack/doc/auth/sso/apiresource/apiresource-delete.png)个步骤创建新的客户端：

1. **基础信息**：填写客户端名称、描述和重定向URI。
2. **资源信息**：选择客户端类型、授权类型和可访问的API资源。
3. **授权范围**：选择客户端可访问的用户声明和API范围。
4. **令牌设置**：选择令牌过期时间和刷新令牌过期时间。
5. **确认**：点击确认按钮创建客户端。

> 用户声明和API范围可多选

![新建客户端图](https://cdn.masastack.com/stack/doc/auth/sso/client/client-add.png)

### 编辑客户端

点击表格中指定行对应的操作列中的`编辑图标`可打开编辑客户端的表单窗口。

* **基础信息**：可编辑客户端名称、描述和重定向URI。
* **资源信息**：可编辑客户端类型、授权类型和可访问的API资源。
* **授权范围**：可编辑客户端可访问的用户声明和API范围。
* **令牌设置**：可编辑令牌过期时间和刷新令牌过期时间。

> 用户声明和API范围可多选

![编辑客户端图](https://cdn.masastack.com/stack/doc/auth/sso/client/client-edit.png)

### 删除客户端

点击表格中指定行对应的操作列中的`删除图标`，点击`确定`即可删除。

![删除客户端图](https://cdn.masastack.com/stack/doc/auth/sso/client/client-delete.png)There are five types of client: Web, Spa, Native, Machine, and Device. The default selection is Web. 

The system sets default GrantTypes based on the client type: 

- Web: `authorization_code` + Pkce
- Spa: `authorization_code` + Pkce
- Native: `authorization_code` + Pkce
- Machine: `client_credentials`
- Device: `device_code`

Customization is not currently supported, but custom Grant Types can be supported through `IExtensionGrantValidator`. Note that the information for the five client types is consistent, and can be edited for different clients.

To switch between the "Basic Information" and "Resource Information" tabs, click on the corresponding label at the top of the "New Client" form.

- "Client Logo": A default logo is provided, but can be customized by uploading a new one.
- "Client Type": Required, default is Web.
- "Client ID": Required, a unique identifier for the client, used as the `ClientId` value when integrating with Oidc.
- "Client Name": Required, up to 50 characters, the name of the client displayed on authorization pages and other pages.
- "Client URL": Optional, a URL.
- "Require Consent": Optional.
- "Allow Offline Access": Optional.
- "Redirect URLs": Optional, can add multiple.
- "Post-Logout Redirect URLs": Optional, can add multiple.
- "Description": Optional, up to 200 characters.

Identity and API resources can be selected for the "Resource Information" section.

To edit a client, simply make changes to the corresponding fields.辑客户端资源信息图](https://cdn.masastack.com/stack/doc/auth/sso/client/client-edit-resource.png)

To open the form window for editing the client, click the `edit icon` in the operation column of the specified row in the table.

> Common information: basic information, authorization confirmation page, authentication, resource information.
> Click the tab label in the middle of the top to switch between editing different information.

#### Common Information

##### Basic Information

* **Client ID**: Cannot be modified, the unique identifier of the client, specified as the `ClientId` value when docking with Oidc.
* **Client Name**: Required, up to 50 characters, the client name displayed on the authorization page and other pages.
* **Description**: Optional, up to 200 characters.
* **Enabled**: Optional, disabled if not selected.
* **Allow CORS Sources**: Optional, cross-domain URL, can add multiple.
* **Attribute Set**: Optional, key-value pairs, can add multiple.

![Edit Client Basic Information Diagram](https://cdn.masastack.com/stack/doc/auth/sso/client/client-edit-basic.png)

##### Authorization Confirmation Page

* **Client Logo**: Can be customized and uploaded.
* **Client URL**: Optional, URL.
* **Require Authorization Confirmation**: Optional.
* **Allow Remember Authorization**: Optional.
* **Authorization Lifecycle**: Optional, number (seconds).

![Edit Client Authorization Confirmation Page Diagram](https://cdn.masastack.com/stack/doc/auth/sso/client/client-edit-authorization.png)

##### Authentication

* **Redirect Address**: Optional, URL, can add multiple.
* **Logout Redirect Address**: Optional, URL, can add multiple.
* **Other Fields**: Operate according to the prompt page information.

![Edit Client Authentication Diagram](https://cdn.masastack.com/stack/doc/auth/sso/client/client-edit-authentication.png)

##### Resource Information

* **Resource Information**: Identity resources and API resources are optional.

![Edit Client Resource Information Diagram](https://cdn.masastack.com/stack/doc/auth/sso/client/client-edit-resource.png)#### Client Web/Spa/Native

> Type/value pairs appear in pairs, and are required when clicking the **+** on the right, and multiple pairs can be created.  
> Other operations are based on the prompts on the page.

![Edit Client Token Image](https://cdn.masastack.com/stack/doc/auth/sso/client/client-edit-token.png)

#### Client Machine

* **Value**: Required.
* **Expiration Time**: Optional expiration date.
* **Description**: Optional.

> Enter the value, select the expiration time, enter the description, and click `New` to create a key. Multiple keys can be created.

![Edit Client Machine Image](https://cdn.masastack.com/stack/doc/auth/sso/client/client-edit-machine.png)

![Edit Client Machine with Key Image](https://cdn.masastack.com/stack/doc/auth/sso/client/client-edit-machine2.png)

#### Client Device

![Edit Client Device Image](https://cdn.masastack.com/stack/doc/auth/sso/client/client-edit-device.png)

#### Delete Client

Click `Delete` in the lower left corner of the **Edit Client Form** page, and a confirmation box will pop up. Click `OK` to delete.

![Delete Client Image](https://cdn.masastack.com/stack/doc/auth/sso/client/client-delete.png)

## Custom Login

In the left navigation bar, click **Single Sign-On** -> **Custom Login**.

Displayed in table form, with pagination and fuzzy search function.istration.png)

### Custom Login Search

> Fuzzy search by name and title

![Custom Login Search List](https://cdn.masastack.com/stack/doc/auth/sso/customlogin/customlogin-search.png)

### Create Custom Login

Click on the `Create` button in the upper right corner of the list page to open the form window for creating a custom login, which includes basic information, login, and registration.

Basic Information

* **Name**: Required, can contain Chinese, English letters, and numbers, 2 to 50 characters.
* **Title**: Required, can contain Chinese, English letters, and numbers, 2 to 50 characters.
* **Client**: Required, select a client.

![Create Custom Login Basic Information](https://cdn.masastack.com/stack/doc/auth/sso/customlogin/customlogin-add-basic.png)

Login

> Right side: Click on the `Create` button at the bottom to add OAuth third-party login, you can choose Github, Wechat, etc., which will be displayed at the bottom left, and the table can sort and delete the added OAuth third-party login.
> Left side: Click on `Login` to validate the form.

![Create Custom Login Login](https://cdn.masastack.com/stack/doc/auth/sso/customlogin/customlogin-add-login.png)

![Create Custom Login Add Third-party Login](https://cdn.masastack.com/stack/doc/auth/sso/customlogin/customlogin-add-login2.png)

Registration

> Right side: Click on the `Create` button at the bottom to add registration form items, you can choose form items, which will be displayed on the left, and the table can set whether the added form items are required, sort and delete them.
> Left side: Click on `Registration` to validate the form.

![Create Custom Login Registration](https://cdn.masastack.com/stack/doc/auth/sso/customlogin/customlogin-add-registration.png)Editing Custom Login

Clicking the edit icon in the operation column of the specified row in the table will open the form window for editing the custom login.

Basic Information

* **Name**: Required, can contain Chinese, English letters, and numbers, 2 to 50 characters.
* **Title**: Required, can contain Chinese, English letters, and numbers, 2 to 50 characters.
* **Client**: Not editable.

![Editing Custom Login Basic Information](https://cdn.masastack.com/stack/doc/auth/sso/customlogin/customlogin-edit-basic.png)

Login

> Right side: Click "New" at the bottom to add OAuth third-party login, such as Github, Wechat, etc., which will be displayed at the bottom left. The table can sort and delete the added OAuth third-party login.  
> Left side: Click "Login" to validate the form.

![Editing Custom Login Login](https://cdn.masastack.com/stack/doc/auth/sso/customlogin/customlogin-edit-login.png)

Registration

> Right side: Click "New" at the bottom to add registration form items. You can select form items, which will be displayed on the left side. The table can set whether the added form items are required, sort and delete them.  
> Left side: Click "Register" to validate the form.

![Editing Custom Login Registration](https://cdn.masastack.com/stack/doc/auth/sso/customlogin/customlogin-edit-reg.png)

Deleting Custom Login

Clicking the delete icon in the operation column of the specified row in the table and clicking "OK" will delete it.

![Deleting Custom Login](https://cdn.masastack.com/stack/doc/auth/sso/customlogin/customlogin-delete.png)"/customlogin-delete.png"