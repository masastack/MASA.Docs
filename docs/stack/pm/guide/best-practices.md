---
title: 最佳实践
date: 2022/09/29
---

### MASA.PM+MASA.DCC实现应用从远程获取配置信息功能

[MASA.DCC]()是一个分布式配置中心，它的基础数据（环境、集群、项目、应用）则是从MASA.PM中获取而来，从而在进行应用的配置管理。

1. 在PM中创建好DCC所需的环境、集群、项目和应用信息，可参考[PM使用指南](quick-get-started/use-guide.md)
2. DCC通过PM的SDK获取创建好的环境、集群、项目和应用信息，可参考PM的[SDK示例](sdk-instance.md)
3. 在DCC中对相应的应用进行配置写入，可参考[DCC使用指南]()
4. 通过DCC的SDK去获取写入好的配置，可参考DCC的[SDK示例]()

通过这四步就完成了PM和DCC的结合使用，最终达到从远程获取配置的功能。

### MASA.PM+MASA.Auth实现应用的权限控制

MASA.Auth是一个权限控制中心，其中权限模块的基础数据（应用）则是从MASA.PM中获取而来，之后再对应用进行权限的管理。

1. 在PM中创建好Auth所需应用信息，可参考[PM使用指南](quick-get-started/use-guide.md)
2. Auth通过PM的SDK获取已创建的应用信息，可参考PM的[SDK示例](sdk-instance.md)
3. 在Auth中对权限进行分配：把权限给角色，再给用户赋予相应的角色，可参考[Auth的使用指南]()
4. 通过Auth统一认证登录系统后会把权限信息返回给客户端。
5. 客户端在对返回的权限信息进行对比，来达到页面或者接口的权限控制。