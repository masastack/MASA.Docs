---
title: Swagger
date: 2022/11/01
---

Swagger可以看作接口文档，用于浏览Auth的接口，MAsaAuth专门针对Swagger做了安全认证功能，只有登录后才可以在Swagger页面中进行接口操作。

## 未登录时执行接口会报401未授权错误

![](\stack\auth\swagger-401.png)

## 完成登录认证

点击Swagger页面中的Authorize按钮，打开认证弹窗

![](\stack\auth\swagger-authorize-button.png)

![](\stack\auth\swagger-authorize.png)

输入账号密码认证后，页面会显示如下

![](\stack\auth\swagger-authorize-success.png)

认证完成后调用api/user/Select接口，返回200

![](\stack\auth\swagger-200.png)