---
title: Api资源
date: 2022/10/11 13:52
---

ApiResource是apiResource的一个组合，由多个apiResource组成。

```c#
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

用户申明列表以表格形式展现，有分页、模糊搜索功能。

> 模糊搜索支持显示名称、配置名称

![](\stack\auth\apiResource-add-button.png)

### 新建

点击列表页的新建按钮可打开新建Api资源的表单窗口。

![](\stack\auth\apiResource-add-button.png)
![](\stack\auth\apiResource-add.png)

> 在文档中展示：勾选代表会在发现文档中展示该身份资源

### 编辑

点击表格中指定用户所在行的操作列中的编辑图标可打开编辑用户申明的表单窗口。

![](\stack\auth\apiResource-edit-icon.png)
![](\stack\auth\apiResource-edit.png)

### 删除

点击表格中指定用户所在行的操作列中的删除图标可删除当前行数据。

![](\stack\auth\apiResource-remove-icon.png)
![](\stack\auth\apiResource-remove.png)