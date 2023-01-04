# Api范围

ApiScope用于描述Api,比如发送邮件Api。单个ApiScope对应单个Api。

```c#
var apiScope = new ApiScope
{
	Name = "SendEmail",
	DisplayName = "发送邮件"
};
```

### 列表

ApiScope列表以表格形式展现，有分页、模糊搜索功能。

> 模糊搜索支持显示名称、配置名称

![](http://cdn.masastack.com/stack/doc/auth/apiScope-add-button.png)

### 新建

点击列表页的新建按钮可打开新增ApiScope的表单窗口。

![](http://cdn.masastack.com/stack/doc/auth/apiScope-add-button.png)
![](http://cdn.masastack.com/stack/doc/auth/apiScope-add.png)

> 是否必须：勾选代表[Client](/stack/auth/guides/sso/client)必须Scope设置包含改身份资源

> 强调：todo

> 在文档中展示：勾选代表会在发现文档中展示该身份资源

### 编辑

点击表格里指定行对应的操作列中的编辑图标，可打开编辑ApiScope的表单窗口。

![](http://cdn.masastack.com/stack/doc/auth/apiScope-edit-icon.png)
![](http://cdn.masastack.com/stack/doc/auth/apiScope-edit.png)

### 删除

点击表格里指定行对应的操作列中的删除图标，可打开删除ApiScope提示框，点击确认后将删除改数据。

![](http://cdn.masastack.com/stack/doc/auth/apiScope-remove-icon.png)
![](http://cdn.masastack.com/stack/doc/auth/apiScope-remove.png)