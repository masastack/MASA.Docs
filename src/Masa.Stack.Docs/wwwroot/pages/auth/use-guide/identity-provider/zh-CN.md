# 第三方平台

第三方平台用于配置第三方登录渠道，内置支持了常用的第三方渠道配置模板，包含GitHub、Wechat，也可自定义配置支持OAuth协议的第三方。

### 列表

第三方平台列表以表格形式展现，有分页、模糊搜索功能。

> 模糊搜索支持名称、显示名称

![](\stack\auth\third-party-search.png)

### 新建

点击列表页的新增按钮可打开新增第三方平台的表单窗口，表单分为基本信息和高级配置。

> 名称字段唯一不可重复
> 高级配置用于将第三方平台返回的用户json数据配置映射为Auth的用户数据

![](\stack\auth\third-party-add-button.png)
![](\stack\auth\third-party-add.png)

### 编辑

点击表格中指定行对应的操作列中的编辑图标可打开编辑第三方平台的表单窗口，表单分为基本信息和高级配置。

> 名称字段不可编辑

![](\stack\auth\third-party-edit-icon.png)
![](\stack\auth\third-party-edit.png)

### 删除

点击表格中指定行对应的操作列中的删除图标可删除所在行数据

![](\stack\auth\third-party-remove-icon.png)
![](\stack\auth\third-party-remove.png)