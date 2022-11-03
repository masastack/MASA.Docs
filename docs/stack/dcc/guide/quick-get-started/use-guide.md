---
title: 使用指南
date: 2022/09/21
---

### 配置对象管理

该文档以应用配置为例，业务配置和公共配置没有差异，只是入口不同。

1. 创建配置对象

   1. 点击全景页面项目下的应用进入配置详情页

      ![](\stack\dcc\overview.png)

   2. 点击新增

      ![](\stack\dcc\config.png)

   3. 输入配置对象信息

      - 名称
      - 格式（Json、Xml、Yaml、Properties、Raw。该文档以Json格式为大家演示）
      - 是否加密（如果选择加密则该配置的内容会被加密存储，且只有管理员能看的到内容，获取配置时也需要解密）
      - 选择集群（该配置对象会被添加到哪些环境集群中）

      ![](\stack\dcc\add-config-object.png)

2. 修改配置内容

   1. 点击配置对象的编辑图标

      ![](\stack\dcc\edit-config.png)

   2. 把编辑好的内容填写进去并进行保存

      ![](\stack\dcc\save-config.png)

3. 发布配置

   只有发布的配置才会被客户端获取到

   1. 点击发布图标

      ![](\stack\dcc\release.png)

   2. 填写发布信息并保存

      1. 发布名称

      2. 描述（非必填）

         ![](\stack\dcc\save-release.png)

### 标签管理

1. 添加标签

   1. 点击添加按钮

      ![](\stack\dcc\label.png)

   2. 填写标签信息

      1. 标签名称
      2. 标签代码
      3. 标签值（多个）
         1. 标签值名称
         2. 标签值代码

      ![](\stack\dcc\add-label.png)

