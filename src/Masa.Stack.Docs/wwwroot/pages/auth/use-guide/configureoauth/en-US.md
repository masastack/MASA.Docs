OAuth 2.0

OAuth 2.0 is an industry-standard authorization protocol. It focuses on simplicity for client developers, while providing specific authorization flows for web applications, desktop applications, mobile phones, and living room devices. The specification and its extensions are being developed within the IETF OAuth working group.

Authorization flow:

+--------+                               +---------------+
|        |--(A)- Authorization Request ->|   Resource    |
|        |                               |     Owner     |
|        |<-(B)-- Authorization Grant ---|               |
|        |                               +---------------+
|        |
|        |                               +---------------+
|        |--(C)-- Authorization Grant -->| Authorization |
| Client |                               |     Server    |
|        |<-(D)----- Access Token -------|               |
|        |                               +---------------+
|        |
|        |                               +---------------+
|        |--(E)----- Access Token ------>|    Resource   |
|        |                               |     Server    |
+--------+                               +---------------+方平台表单图](https://cdn.masastack.com/stack/doc/auth/use-guide/third-party/third-party-create.png)

## 编辑OAuth

在列表页点击OAuth平台名称，可进入OAuth平台详情页，点击右上角的`编辑`可打开编辑OAuth平台的表单窗口，表单内容同新建OAuth平台表单。

## 删除OAuth

在列表页点击OAuth平台名称，可进入OAuth平台详情页，点击右上角的`删除`可删除OAuth平台。

> 删除OAuth平台后，已经使用该平台登录的用户将无法再次使用该平台登录。Platform Diagram](https://cdn.masastack.com/stack/doc/auth/use-guide/third-party/third-party-add.png)

> Advanced configuration, can add custom JSON key/value pairs

![New third-party platform main advanced diagram](https://cdn.masastack.com/stack/doc/auth/use-guide/third-party/third-party-add-advanced.png)

> GitHub, Wechat selection, hover over the **Upload Logo** at the top, click GitHub or Wechat

![New third-party platform main logo selection diagram](https://cdn.masastack.com/stack/doc/auth/use-guide/third-party/third-party-add-icon.png)

![New third-party platform main logo selection Wechat diagram](https://cdn.masastack.com/stack/doc/auth/use-guide/third-party/third-party-add-wechat.png)

## Edit OAuth

Click the `Edit icon` in the operation column corresponding to the specified row in the table to open the form window for editing the OAuth platform. The form is divided into basic information and advanced configuration.

> The name field cannot be edited, and other field descriptions are the same as **New OAuth**

![Edit third-party platform diagram](https://cdn.masastack.com/stack/doc/auth/use-guide/third-party/third-party-edit.png)

## Delete OAuth

Click the `Delete icon` in the operation column corresponding to the specified row in the table to delete the data in the row. Click `OK` to confirm.

![Delete third-party platform diagram](https://cdn.masastack.com/stack/doc/auth/use-guide/third-party/third-party-remove.png)