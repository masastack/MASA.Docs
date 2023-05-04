# 产品介绍

### 什么是分布式配置中心？

答：
1. 有后台界面供我们修改配置
2. 配置服务如果挂了有相关的容灾逻辑
3. 支持不同环境下的配置信息（我们线上的配置一般是分不同的环境配置不同的值）
4. 相关权限管理（只有负责人才能对配置进行update）
5. 简单易用（有对应的SDK支持或api支持）
 
![introduce](https://cdn.masastack.com/stack/doc/dcc/introduce.png)

### 什么是MASA DCC？

 MASA DCC 是 MASA Stack 1.0推出的分布式配置中心，在整个 MASA Stack 产品中担任所有系统以及部分全局综合配置的功能。
单独配置后台:

![introduce-2](https://cdn.masastack.com/stack/doc/dcc/introduce-2.png) 

分布式配置中心提供了独立包括界面修改的配置后台，其中包含应用程序目前配置历史配置以及一些公共配置。应用程序支持多环境集群关系组合（如图二）同时支持发布历史、回滚、撤销、删除等功能（如图三）。目前配置支持多种编码（Json、Properties、Raw、Xml、Yaml）可以对其编码进行加密处理，确保配置的安全性。
   
![introduce-3](https://cdn.masastack.com/stack/doc/dcc/introduce-3.png)

### MASA DCC 有哪些实用场景与功能优势？

分布式配置中心目前在大型项目和产品矩阵的系统中应用教为广泛，特别在互联网类型公司中提供底层强大的能力，可以给开发相关人员提高极高的效率。

### 核心功能优势

 部署简单

- 配置复制、修改、克隆、发布、回滚等操作便捷
- 能提供底层相关所有项目的配置变更历史等记录
- 支持多种编码和加密，安全性有保障