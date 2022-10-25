---
title: ApiScope
date: 2022/10/11 13:52
---

ApiScope用于描述某个Api,比如发送邮件Api。

```c#
var apiScope = new ApiScope
{
	Name = "SendEmail",
	DisplayName = "发送邮件"
};
```

### 列表

ApiScope列表以表格形式展现，有分页、模糊搜索功能。

> 模糊搜索支持ApiScope名称

### 新增

点击列表页的新增按钮可打开新增ApiScope的表单窗口。

### 快速创建标准申明

点击列表页的快速创建标准申明按钮

### 编辑

点击表格中指定用户所在行的操作列中的编辑图标可打开编辑ApiScope的表单窗口。

### 删除

点击表格中指定用户所在行的操作列中的删除图标可删除当前行数据。