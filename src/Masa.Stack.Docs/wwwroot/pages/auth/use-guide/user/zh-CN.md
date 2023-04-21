# 用户介绍

用户页面用于管理Auth用户、第三方用户、员工。

## Auth用户、第三方用户、员工之间的关系

Auth用户包含第三方用户、员工。举个例子：一名使用者在Auth注册新用户，此人为Auth用户、一名使用者通过Githug登录到Auth，此人为第三方用户，也是Auth用户、管理员在Auth后台添加一名员工张三，张三即为员工也为Auth用户。

## Auth用户

Auth用户主要用于登录、执行权限。用户的权限来自于角色、团队、自身的扩展权限。
> 执行权限：页面权限、元素权限、Api权限

### 列表

Auth用户列表以表格形式展现，有分页、时间范围搜索、用户状态筛选、模糊搜索功能。

1.模糊搜索

> 模糊搜索支持昵称、手机号、邮箱、账号

![用户搜索列表图](https://cdn.masastack.com/stack/doc/auth/use-guide/user/user-search.png)

2.高级搜索

![用户高级搜索列表图](https://cdn.masastack.com/stack/doc/auth/use-guide/user/user-advanced-search-icon.png)

### 新建

点击列表页的`新建`按钮可打开新建Auth用户的表单窗口，提交表单需要完成三个步骤。

![新建用户入口图](https://cdn.masastack.com/stack/doc/auth/use-guide/user/user-add-button.png)

第一步：选择性别、选择/上传头像。

> 头像组件带有切换默认头像、上传自定义头像功能。

![新建用户步骤一图](https://cdn.masastack.com/stack/doc/auth/use-guide/user/user-add-step1.png)

第二步：填写基本信息、详细信息。

> 手机号为必填项且不可重复，邮箱、身份证号、账号不可重复。不可重复：指在Auth用户中唯一性。
> 账号为非必填项，如若账号未填写，创建用户后会以手机号做为账号。
> 密码为必填项，如若密码未填写，此用户可以使用手机号登录Auth系统修改个人密码。
> 昵称为必填项。

![新建用户步骤二图](https://cdn.masastack.com/stack/doc/auth/use-guide/user/user-add-step2.png)

第三步：配置权限：选择绑定的角色、配置当前用户的扩展权限。可点击预览查看配置完成后的全局导航窗口。

![新建用户步骤三图](https://cdn.masastack.com/stack/doc/auth/use-guide/user/user-add-step3.png)

### 编辑

点击表格中指定行所在的操作列中的`编辑图标`可打开编辑Auth用户的表单窗口。

![编辑用户入口图](https://cdn.masastack.com/stack/doc/auth/use-guide/user/user-edit-icon.png)

在表单中可更换头像、修改基础信息、详细信息

> 账号为不可编辑项。
> 表单校验规则仍遵循新建Auth用户表单的校验规则。

![编辑用户图](https://cdn.masastack.com/stack/doc/auth/use-guide/user/user-edit.png)

在表单中可重置用户密码。

> 重置密码需要二次确认。
> 重置密码是随机生成的密码，管理员不可自定义密码，管理员在重置密码后可点击复制图标复制新密码给相关用户。

![重置密码图](https://cdn.masastack.com/stack/doc/auth/use-guide/user/user-reset-password.png)

在表单中可查看此用户的授权认证、历史记录的简要信息。

![编辑用户简单历史记录图](https://cdn.masastack.com/stack/doc/auth/use-guide/user/user-record.png)

在表单中可启用、禁用、删除用户。

![编辑用户启用、禁用、删除图](https://cdn.masastack.com/stack/doc/auth/use-guide/user/user-remove-disabled.png)

### 授权

点击表格中指定行所在的操作列中的授权图标可打开Auth用户授权的表单窗口。

> 权限配置功能与新建用户时权限配置一至。

当此用户也为员工时，表单中会多出一个团队切换组件，用于切换不同的团队来查看此用户在当前团队时的权限。

![编辑用户授权图](https://cdn.masastack.com/stack/doc/auth/use-guide/user/user-authorize.png)

## 第三方用户

第三方用户来自于第三方平台登录过来的用户，由于第三方用户在第一次登录/创建时会与对应的Auth用户做绑定,所以Auth用户始终包含第三方用户。

> 与Auth用户做绑定时，如若不存在对应的Auth用户，系统则会新建与之对应的Auth用户。

### 列表

第三方用户列表以表格形式展现，有分页、时间范围搜索、用户状态筛选、模糊搜索功能。

> 模糊搜索支持昵称、手机号、邮箱、账号。

![第三方用户搜索列表图](https://cdn.masastack.com/stack/doc/auth/use-guide/user/third-party-user-search.png)

### 域账号配置

点击列表页`域账号配置`按钮，打开域账号同步窗口，域账号同步功能可将域用户同步到Auth员工中，以手机号作为同步绑定标识。

![域账号配置入口图](https://cdn.masastack.com/stack/doc/auth/use-guide/user/third-party-user-ldap-icon.png)
![域账号配置图](https://cdn.masastack.com/stack/doc/auth/use-guide/user/third-party-user-ldap.png)

## 员工

员工来自于管理员创建/批量导入。由于员工在第一次创建时会会与对应的Auth用户做绑定,所以Auth用户始终包含员工。

> 与Auth用户做绑定时，如若不存在对应的Auth用户，系统则会新建与之对应的Auth用户。

### 列表

员工列表以表格形式展现，有分页、模糊搜索功能。

![员工搜索列表图](https://cdn.masastack.com/stack/doc/auth/use-guide/user/staff-search.png)

### 新建

点击列表页的`新建`按钮可打开新建员工的的表单窗口，提交表单需要完成两个步骤。

第一步：选择性别、选择/上传头像。

> 头像组件带有切换默认头像、上传自定义头像功能。

![新建员工步骤一图](https://cdn.masastack.com/stack/doc/auth/use-guide/user/staff-add-step1.png)

第二步：填写基本信息、详细信息。

> 手机号为必填项且不可重复，邮箱、身份证号不可重复。不可重复：指在员工中唯一性。
> 昵称、工号、密码为必填项。

![新建员工步骤二图](https://cdn.masastack.com/stack/doc/auth/use-guide/user/staff-add-step2.png)

### 编辑

点击表格中指定行所在的操作列中的`编辑图标`可打开编辑员工的表单窗口。

![编辑员工入口图](https://cdn.masastack.com/stack/doc/auth/use-guide/user/staff-edit-icon.png)

在表单中可更换头像、修改基础信息、详细信息。

> 表单校验规则仍遵循新建员工表单的校验规则。

![编辑员工图](https://cdn.masastack.com/stack/doc/auth/use-guide/user/staff-edit.png)

在表单中可查看此用户的授权认证、历史记录的简要信息。

![编辑员工简单历史记录图](https://cdn.masastack.com/stack/doc/auth/use-guide/user/staff-record.png)

在表单中可启用、禁用、删除员工。

![编辑员工启用、禁用、删除图](https://cdn.masastack.com/stack/doc/auth/use-guide/user/staff-remove-disabled.png)

### 授权

点击表格中指定用户所在行的操作列中的`授权图标`可打开员工授权的表单窗口。

> 权限配置功能与新建员工时权限配置一至。

![编辑员工授权入口图](https://cdn.masastack.com/stack/doc/auth/use-guide/user/staff-authorize-icon.png)
![编辑员工授权图](https://cdn.masastack.com/stack/doc/auth/use-guide/user/staff-authorize.png)

### 同步

点击列表页的`同步`按钮可打开同步员工的的窗口，员工同步支持utf8格式的csv文件，可将csv文件里的员工数据同步至员工列表。

![员工同步入口图](https://cdn.masastack.com/stack/doc/auth/use-guide/user/staff-sync-icon.png)

> 下载`员工同步模板`，根据模板填写员工相关信息，上传文件同步。

![员工同步图](https://cdn.masastack.com/stack/doc/auth/use-guide/user/staff-sync.png)
