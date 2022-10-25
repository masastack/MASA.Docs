---
title: ApiResource
date: 2022/10/11 13:52
---

ApiResource是ApiScope的一个组合，由多个ApiScope组成。

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

> 模糊搜索支持用户声明名称

### 新增

点击列表页的新增按钮可打开新增用户申明的表单窗口。

> 此窗口创建的用户申明类型为自定义类型

### 快速创建标准申明

点击列表页的快速创建标准申明按钮，系统创建标准的用户申明[https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims]

> 系统创建的用户申明类型为标准类型

### 编辑

点击表格中指定用户所在行的操作列中的编辑图标可打开编辑用户申明的表单窗口。

### 删除

点击表格中指定用户所在行的操作列中的删除图标可删除当前行数据。