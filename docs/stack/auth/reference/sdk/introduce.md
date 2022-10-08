---
title: 单点登录（SSO）
date: 2022/10/9 13:10
---

> 本文默认已经在MASA Auth 后台创建好Client

单点登录在一个客户端的多个应用之间共享登录态。

```
     +--------+                               +---------------+
     |        |--(A)- Authorization Request ->|   Resource    |
     |        |                               |     Owner     |
     |        |<-(B)-- Authorization Grant ---|               |
     |        |                               +---------------+
     |        |
     |        |                               +---------------+
     |        |--(C)-- Authorization Grant -->| Authorization |
     | Client |                               |     Server    |
     |        |<-(D)----- Access Token -------|               |
     |        |                               +---------------+
     |        |
     |        |                               +---------------+
     |        |--(E)----- Access Token ------>|    Resource   |
     |        |                               |     Server    |
     |        |<-(F)--- Protected Resource ---|               |
     +--------+                               +---------------+
```

## 对接SSO

:::: code-group
::: code-group-item Blazor Server

```csharp
new AuthDbContext(optionsBuilder.MasaOptions)
```

:::
::: code-group-item js

```javascript
//todo
```

:::
::::

## Token验证

## 用户注销
