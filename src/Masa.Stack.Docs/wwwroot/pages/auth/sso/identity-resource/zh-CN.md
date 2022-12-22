# 身份资源

身份资源是[用户申明](/stack/auth/guides/sso/identityResource)的集合。比如创建"身份证"身份资源，身份证包含姓名、出生日期、户籍所在地、头像等用户申明。单个份资源对应多个用户申明。

### 列表

身份资源列表以表格形式展现，有分页、模糊搜索功能。

> 模糊搜索支持身份资源名称、显示名称、描述

![](\stack\auth\identityResource-search.png)

### 新建

点击列表页的新建按钮可打开新建身份资源的表单窗口。

![](\stack\auth\identityResource-add-button.png)
![](\stack\auth\identityResource-add.png)

> 是否必须：勾选代表[Client](/stack/auth/guides/sso/client)必须Scope设置包含改身份资源

> 强调：todo

> 在文档中展示：勾选代表会在发现文档中展示该身份资源

### 快速创建标准申明

点击列表页的快速创建标准身份资源按钮，系统创建[标准的身份资源](https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims)

![](\stack\auth\identityResource-add-standard-button.png)

### 编辑

点击表格里指定行的操作列中的编辑图标，可打开编辑身份资源的表单窗口。

![](\stack\auth\identityResource-edit-icon.png)
![](\stack\auth\identityResource-edit.png)

### 删除

点击表格里指定行的操作列中的删除图标，可删除当前行数据。

![](\stack\auth\identityResource-remove-icon.png)
![](\stack\auth\identityResource-remove.png)