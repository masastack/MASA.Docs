# 基础概念

### 简介

MASA.DCC是一个分布式配置中心系统。随着系统越做越大，服务越来越多，每个服务可能在不同的环境集群中，这时候避免不了去使用配置中心去统一管理我们的配置文件，而MASA.DCC就是个不错的选择，其核心功能依赖于Redis，可做到客户端与Redis直接进行交互，不过度依赖服务端。

### Environment（环境）

参考：[MASA.PM环境介绍](../../../pm/guide/quick-get-started/basic-concepts.md)

### Cluster（集群）

参考：[MASA.PM集群介绍](../../../pm/guide/quick-get-started/basic-concepts.md)

### Project（项目）

参考：[MASA.PM项目介绍](../../../pm/guide/quick-get-started/basic-concepts.md)

### App（应用）

参考：[MASA.PM应用介绍](../../../pm/guide/quick-get-started/basic-concepts.md)

### Config Object（配置对象）

#### App Config Object（应用配置对象）

每个应用自己的配置。

#### Biz Config Object（业务配置对象）

每个项目只有一份业务配置，提炼应用中相同的配置放在业务配置中，也可以放一些项目级的业务信息，该配置可以被该项目下的所有应用读取。业务配置无需自己创建，系统会帮你初始化。

#### Public Config Object（公共配置对象）

所有项目都可能用到的配置可以放在公共配置中。目前是所有项目都可以读取，使用MASA.DCC时会默认加载所有的公共配置。