# 权限介绍

## 角色

角色模块主要包含角色的增删改以及维护角色拥有的权限。

> MASA Auth目前基于角色的访问控制（RBAC），后续支持基于属性的访问控制（ABAC）

### 角色搜索

角色列表以表格形式展现，有分页、角色名称模糊搜索功能。

> 根据角色名称模糊搜索

![角色搜索列表图](https://cdn.masastack.com/stack/doc/auth/use-guide/permision/role-search.png)

### 新建角色

点击页面顶部的`新建`按钮，在新的弹出窗口中输入角色信息。

* 角色名称：展示名称
* Code: 角色唯一标识
* 限制绑定次数：该角色可以被几个用户使用
* 描述说明：角色的描述信息

![新建角色步骤一角色信息图](https://cdn.masastack.com/stack/doc/auth/use-guide/permision/role-add.png)

点击下一步，进入绑定角色权限窗口。通过继承角色可以选择继承哪些角色的权限，底部权限树可以进一步补充角色权限和禁用从继承角色继承的权限。

![新建角色步骤二授权图](https://cdn.masastack.com/stack/doc/auth/use-guide/permision/role-add-2.png)

### 编辑角色

点击表格中指定行所在的操作列中的`编辑图标`打开编辑角色的表单窗口。

在表单中查看上级角色、角色拥有者及简单的历史操作记录，这些信息不可编辑。
可启用、禁用角色。

![编辑角色基础信息图](https://cdn.masastack.com/stack/doc/auth/use-guide/permision/role-edit.png)

点击`权限`标签编辑角色的权限。

![编辑角色授权图](https://cdn.masastack.com/stack/doc/auth/use-guide/permision/role-edit-2.png)

### 删除角色

点击表格中指定行所在的操作列中的`删除图标`，弹出删除角色的确认框，点击`确定`按钮删除角色。

![删除角色图](https://cdn.masastack.com/stack/doc/auth/use-guide/permision/role-delete.png)

## 权限

MASA Auth 权限分为两大类前端权限和Api权限，其中前端权限分为菜单权限、元素权限和数据权限(暂不支持)。

* 菜单权限：即系统菜单，配置用户拥有哪些菜单
* 元素权限：页面内权限细分控制，如哪些人尤删除权限，元素权限需要配合Masa.Blazor 提供的`IPermissionValidator`使用
* Api权限：Api接口访问权限配置
* 数据权限：用户数据控制、如业务员只能看到自己的业务数据

![权限管理功能结构图](https://cdn.masastack.com/stack/doc/auth/use-guide/permision/permision.svg)

### 新建权限

选择项目，点击`前端权限`或`Api`，鼠标移到对应的节点上，点击`新建图标`

> 根节点为选择项目的应用

![新建权限入口图](https://cdn.masastack.com/stack/doc/auth/use-guide/permision/permision-add.png)

#### 新建前端权限

前端权限维护菜单权限和元素权限。

> 应用的第一子级只能为菜单权限，且菜单权限和元素权限不能有相同的父级

输入菜单名称及其它内容项点击提交即可。

* 权限名称：菜单展示名称或元素名称（非展示名称）
* Code：权限唯一标识（保证唯一性，默认拼接系统应用AppId）
* 权限类型：菜单权限和元素权限
* 权限排序：菜单排序及权限树内排序字段
* 权限地址：菜单及元素页面路由
* Icon代码：目前仅菜单权限有效，做菜单展示的图标。内容格式为Masa Blazor [Icon](https://blazor.masastack.com/components/icons)支持的图标
* 描述说明：权限描述说明

![新建前端权限图](https://cdn.masastack.com/stack/doc/auth/use-guide/permision/permision-add-frontend.png)

#### 新建Api权限

* 权限名称：Api权限名称
* Code：权限唯一标识（保证唯一性，默认拼接系统应用AppId）
* 权限类型：Api权限
* 权限排序：权限树内显示排序字段
* 权限地址：Api权限路由
* 描述说明：权限描述说明

![新建Api权限图](https://cdn.masastack.com/stack/doc/auth/use-guide/permision/permision-add-api.png)

### 编辑权限

点击要编辑的权限节点，编辑权限信息，删除权限。

#### 编辑前端权限

权限类型、挂靠角色、权限使用者只可查看，编辑、启用、禁用、删除前端权限。

![编辑前端权限图](https://cdn.masastack.com/stack/doc/auth/use-guide/permision/permision-edit-frontend.png)

#### 编辑Api权限

在表单中编辑、删除Api权限。

![编辑Api权限图](https://cdn.masastack.com/stack/doc/auth/use-guide/permision/permision-edit-api.png)

#### 删除权限

点击编辑页面的`删除`按钮，弹出确认删除权限窗口，点击`确定`删除权限。

![删除权限图](https://cdn.masastack.com/stack/doc/auth/use-guide/permision/permision-delete.png)
