# MASA Framework 术语和定义

这个详细介绍了您可能在 `Framework` 文档或者 `Issues` 中读到的常见术语。

| 词条             | 定义                                            | 详情                                                                                                   |
|:---------------|:----------------------------------------------|:-----------------------------------------------------------------------------------------------------|
| fx             | Framework                                     | Framework 的缩写，在 MASA 相关产品中用 fx 来缩写代表 MASA Framework（通常情况下它被简写为：masafx）                               |
| Building Block | 提供接口标准                                        | [Framework 构建块](/framework/concepts/building-blocks-concept)                                         |
| Contrib        | 基于构建块的最佳实践, 可被替换                              |                                                                                                      |
| Utils          | 底层通用能力, 提供底层通用能力, 可被构建块和最佳实践所使用               |                                                                                                      |
| Statck         | 是新一代数字化[云原生技术底座产品](/stack/stack/introduce)    | 其核心产品有：**项目管理**、**分布式配置中心**、**权限中心**、**任务调度中心**、**故障排查中心**、**告警中心**、**消息中心**，后续还将支持更多产品              |
| PM             | 一款底层基建设施的[项目管理产品](/stack/pm/introduce)        | 是 MASA Stack 的核心基建，提供针对环境、集群、项目、应用的管理                                                                |
| Auth           | 一款底层基建设施的[权限管理中心](/stack/auth/introduce)      | 是 MASA Stack 的核心基建, 提供角色权限、用户、组织架构、项目团队、岗位职位、SSO 单点登录、第三方平台登录等功能                                     |
| DCC            | 一款底层基建设施的[分布式配置中心](/stack/dcc/introduce)      | 是 MASA Stack 的核心基建, 为项目应用提供配置管理，支持配置发布历史的回滚、撤销、删除等功能，支持配置加密以及多种配置编码 (Json、Properties、Raw、Xml、Yaml)   |
| Scheduler      | [任务调度中心](/stack/scheduler/introduce)一款辅助性软件产品 | 是 MASA Stack 1.0 推出的一款辅助性产品，主要用于负责处理应用程序任务的调度、重试等                                                    |
| TSC            | [故障排查中心](/stack/tsc/introduce)                | 是 MASA Stack 1.0 中的核心产品，负责对 MASA 整个系统中的项目/应用进行监测来排查故障情况，其中包含从项目维度视角来查看监测的故障情况。以及溯源到具体的链路日志中          |
| Alert          | [告警中心](/stack/alert/introduce)                | 是 MASA Stack 的辅助性产品, 支持配置告警规则、告警相关指标，配合 **调度中心**、**故障排查中心**、**消息中心** 将消息发送给相关责任人                     |
| MC             | [消息中心](/stack/mc/introduce)                   | 是 MASA Stack 1.0 中底层支持消息发送的综合性产品，支持多渠道的配置与消息发送规则的配置，可以与 **告警中心**、**故障排查中心** 对接，将消息发送给指定相关责任人，完成消息的触达 |