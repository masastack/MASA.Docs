---
title: Stack Sdks
date: 2022/07/01
---

## 概念

为Masa Stack提供业务SDK

## 功能

* [权限中心](/stack/auth/reference/sdk/auth): 集成SSO和通用权限管理。基于RBAC实现，允许设置跨多系统的Role、一人多Role、一人多部门的灵活配置。权限控制粒度到服务级（后续版本会实现数据级）。支持基于LDAP接入、基于OAuth、Ids4接入

* [分布式配置中心](/stack/dcc/guide/sdk-instance): 简称: DCC，全称: Distributed Configuration Center，提供获取配置能力

* [项目管理](/stack/pm/guide/sdk-instance): 简称: PM，全称Project Management，提供项目管理能力

* [故障排查控制台](/framework/building-blocks/stack-sdks/tsc): 简称: TSC，全称: Troubleshooting Console，提供日志以及指标的交互

* [任务调度中心](/framework/building-blocks/stack-sdks/scheduler): 全称: Scheduler，提供任务调度能力

* [消息中心](/framework/building-blocks/stack-sdks/mc): 简称: MC，全称: Message Center，提供消息管理能力

* [告警管理](/framework/building-blocks/stack-sdks/alert): 全称: Alert，提供告警管理能力