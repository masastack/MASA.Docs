---
title: 权限介绍
date: 2022/09/29 10:13
---

## 角色

角色模块主要包含角色的增删改以及维护角色拥有的权限。

> MASA Auth目前基于角色的访问控制（RBAC），后续支持基于属性的访问控制（ABAC）

### 新建角色

点击页面顶部的新增`按钮`，在新的弹出窗口中输入角色信息。

* 角色名称：展示名称
* Code: 角色唯一标识
* 限制绑定次数：该角色可以被几个用户使用
* 描述说明：角色的描述信息

![role-add](/stack/auth/role-add.png)

点击下一步，进入绑定角色权限窗口。通过继承角色可以选择继承哪些角色的权限，底部权限树可以进一步补充角色权限和禁用从继承角色继承的权限。

![role-add-2](/stack/auth/role-add-2.png)

## 权限

MASA Auth 将权限分为菜单权限、元素权限、Api权限、数据权限(暂不支持)四种。

* 菜单权限：即系统菜单，配置用户拥有哪些菜单
* 元素权限：页面内权限细分控制，如哪些人尤删除权限，元素权限需要配合Masa.Blazor 提供的`IPermissionValidator`使用
* Api权限：Api接口访问权限配置
* 数据权限：用户数据控制、如业务员只能看到自己的业务数据

![permission-view](/stack/auth/permission-view.png)

### 新建权限

权限分两大类：前端权限和Api权限。

#### 前端权限

前端权限维护菜单权限和元素权限。

> 根级只能为菜单权限，且菜单权限和元素权限不能有相同的父级

输入菜单名称及其它内容项点击提交即可。

* 权限名称：菜单展示名称或元素名称（非展示名称）
* Code：权限唯一标识（保证唯一性，默认拼接系统应用AppId）
* 权限类型：菜单权限和元素权限
* 权限排序：菜单排序及权限树内排序字段
* 权限地址：菜单及元素页面路由
* Icon代码：目前仅菜单权限有效，做菜单展示的图标。内容格式为Masa Blazor [Icon](https://blazor.masastack.com/components/icons)支持的图标
* 描述说明：权限描述说明

![permission-add](/stack/auth/permission-add.png)

#### Api权限

* 权限名称：Api权限名称
* Code：权限唯一标识（保证唯一性，默认拼接系统应用AppId）
* 权限类型：Api权限
* 权限排序：权限树内显示排序字段
* 权限地址：Api权限路由
* 描述说明：权限描述说明

![permission-add-api](/stack/auth/permission-add-api.png)
