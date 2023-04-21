# 使用指南

## 初始化

在使用 `PM` 时，系统会默认创建三个环境（Development、Staging、Production），一个集群（Default），并初始化 `MASA.Stack` 的一些项目和应用。

## 新建环境

1. 点击左侧的“新建环境”按钮。

   ![全景](https://cdn.masastack.com/stack/doc/pm/overview.png)

2. 输入环境信息，包括：

   - 环境名称
   - 关联集群（可多选）
   - 环境描述

   ![环境](https://cdn.masastack.com/stack/doc/pm/environment.png)

## 新建集群

1. 点击右上角的“新建集群”按钮。

2. 输入集群信息，包括：

   - 集群名称
   - 关联环境（可多选）
   - 集群描述

   ![集群](https://cdn.masastack.com/stack/doc/pm/cluster.png)

## 新建项目

1. 点击底部的“新建项目”按钮。

2. 输入项目信息，包括：

   - 项目名称
   - 所属项目团队（为项目分配团队，只有该团队的成员才能看到）
   - ID 标识（唯一）
   - 项目类型
   - 环境/集群（可多选）
   - 项目描述

   ![项目](https://cdn.masastack.com/stack/doc/pm/project.png)

## 新建应用

1. 点击具体项目，展开详情，点击“新建应用”按钮。

2. 输入应用信息，包括：

   - 应用名称
   - 应用类型（`Service`、`UI`、`Job`）
   - 环境/集群（对应项目中关联的环境/集群，可多选）

   ![应用](https://cdn.masastack.com/stack/doc/pm/app.png)
