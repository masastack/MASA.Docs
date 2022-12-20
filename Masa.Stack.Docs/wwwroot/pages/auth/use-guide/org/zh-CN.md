# 组织架构

组织架构模块目前在整个系统中相对独立，只起到维护组织数据的作用，包括新增组织子级、编辑节点、复制节点、删除节点等

> 根节点不可复制删除

## 新建组织节点

<div align=center>
<img src="/stack/auth/org-menu.png"/>
</div>

输入节点名称和描述（可选）即可

![auth/org-add](/stack/auth/org-add.png)

## 复制组织节点

节点弹出菜单中选择`复制`,修改部门名称和根据需要勾选迁移原部门人员

![auth/org-copy](/stack/auth/org-copy.png)

点击`下一步`按钮，在新的窗口中调整节点位置和进一步筛选迁移哪些部门成员

![auth/org-copy-2](/stack/auth/org-copy-2.png)

## 修改组织节点

点击对应节点菜单的`编辑`按钮，新弹出的窗口中，修改名称、部门位置、描述，点击提交即可。

![auth/org-edit](/stack/auth/org-edit.png)

## 删除组织节点

在要删除的节点菜单中选择`编辑`，点击弹窗底部`删除`按钮即可。

> 删除节点会连带将该节点的所有子节点一起删除,且当节点下有员工时不可删除
