# MASA Stack 1.0 产品介绍

### MASA Strack是什么

Stack是新一代数字化云原生技术底座产品，其中核心产品包括了用户的权限设置与继承、项目管理、故障排查、以及配套化的消息中心等。具体产品结构:

![introduce](http://cdn.masastack.com/stack/doc/stack/introduce.png)

目前包含这七大产品组成了MASA Strack 1.0 后续2.0/3.0还会更多更强大的产品加入进来主要目的是服务于企业数字化建设的底层必备产品，为所有业务、数据提供基础建设。

### 产品特性与优势

1.	云原生项目底层基建产品，专门为企业数字转型等场景筑基。
2.	不受其他各种业务系统的语言限制，可以进行语种支持与转换。
3.	特定3+4产品组合，可以完美适配IT业务从0-1的全业务支持。
4.	MASA Stack 底层采用Dapr 相关服务，可以更完美支持各种需求场景。

### 3+4产品组合

所谓3+4的产品组合是一个最小单位的产品矩阵合集，可以很简单的理解为底层基建与应用的场景。

1. 3个基础核心产品

[PM](stack/pm/introduce)、[Auth](stack/auth/introduce)和[DCC](stack/dcc/introduce) 3款产品作为核心基建，提供了最开始的初始化过程，围绕实际项目创立到应用部署的一整套流程，支持多种环境多个集群的关系，后续用户单点登录与登录授权等。相关不同环境的配置都可以在DCC中心配置，可以快速变更替换不同版本的不同配置。 

![introduce_2](http://cdn.masastack.com/stack/doc/stack/introduce_2.png)

2. 4个关联应用型产品

[Scheduler](stack/scheduler/introduce)、[TSC](stack/tsc/introduce)、[Alert](stack/alert/introduce)和[MC](stack/mc/introduce) 4款产品合集可以作为业务底层必不可少的基建产品，提供了关于执行任务的调度、失败重试问题。监测目前已有的项目与应用程序，对于监测内容设置相
关告警指标以及告警规则，通过消息中心来触发传达消息，减少故障可能性。作为做产品合集与关联来进行一个简单可理解的搭配关系。单个产品都可以专门在使用在独特需求场景中。为企业数字化提供服务。

![introduce_3](http://cdn.masastack.com/stack/doc/stack/introduce_3.png)