---
title: 单点登录（SSO）
date: 2022/10/9 13:10
---

> 本文默认已经在MASA Auth 后台创建好Client

单点登录在一个客户端的多个应用之间共享登录态。用户只需要登录一次就可以访问客户端下的其他系统。

## 对接SSO

添加OpenId Connect身份验证

:::: code-group
::: code-group-item Blazor Server

```csharp
builder.Services.AddMasaOpenIdConnect(masaOpenIdConnectOptions);
```

:::
::: code-group-item js

```javascript
//todo
```

:::
::::

## 获取用户信息（待补充）

## 获取Token（待补充）

## Token验证

## 用户注销
