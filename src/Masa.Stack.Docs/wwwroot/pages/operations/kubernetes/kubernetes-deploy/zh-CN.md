﻿# 基于 K8s 部署 MASA Stack

本文介绍如何部署MASA Stack，为了方便大家本地体验，在环境准备环节我们会基于[Docker Desktop](https://www.docker.com/products/docker-desktop/)，它同样适用于生产环境的K8s



## 先决条件

* [K8s](https://kubernetes.io/)
* [ingress-nginx](https://github.com/kubernetes/ingress-nginx)
* [Helm](https://helm.sh/)
* [Dapr](https://dapr.io/)



## 环境准备

本文档默认你已经安装[Docker Desktop](https://www.docker.com/products/docker-desktop/)和[WSL](https://learn.microsoft.com/en-us/windows/wsl/about)，并且基于Windows 11+的[Windows Terminal](https://learn.microsoft.com/en-us/windows/terminal/)

> 部分安装脚本需要国外资源，如果出现超时等情况需要自行解决



### 启用 Docker K8s

> 如果你已经有K8s可以跳过这个部分

![image-20230426150522160](https://cdn.masastack.com/stack/doc/stack/enable-docker-k8s.png)



### 安装 Helm

本文档演示环境为 Ubuntu 22.04 WSL，如果你希望了解其他部署方式可以看[官方的安装文档](https://helm.sh/docs/intro/install/)

> 注意：运行第一行后可能会提示输入密码，偶尔会出现显示错位的问题，直接输入密码即可

```shell
curl https://baltocdn.com/helm/signing.asc | gpg --dearmor | sudo tee /usr/share/keyrings/helm.gpg > /dev/null
sudo apt-get install apt-transport-https --yes
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/helm.gpg] https://baltocdn.com/helm/stable/debian/ all main" | sudo tee /etc/apt/sources.list.d/helm-stable-debian.list
sudo apt-get update
sudo apt-get install helm
```

验证Helm是否可用，运行以下命令看到返回版本号即代表成功

```shell
helm version
```



### 安装 ingress-nginx

根据[官方的Helm部署文档](https://kubernetes.github.io/ingress-nginx/deploy/)

> 注意：ingress-nginx 的版本和 k8s 版本是有兼容性要求的，因本文档安装的 K8s 是 1.25 且 ingress-nginx 是 1.7.0 所以都使用最新的。但仍然建议确认一下[版本兼容性](https://github.com/kubernetes/ingress-nginx#supported-versions-table)

> 注意：ingress-nginx的镜像可能会访问多个国外网站，如果出现超时你要想个办法怎么访问国外变快（建议开启全局）

```shell
helm upgrade --install ingress-nginx ingress-nginx \
  --repo https://kubernetes.github.io/ingress-nginx \
  --namespace ingress-nginx --create-namespace
```

验证 ingress-nginx 是否可用，返回的 `STATUS` 为 `Running` 即代表成功

```shell
kubectl get pods -n ingress-nginx
```



### 安装 Dapr

根据[官方的Helm部署文档](https://docs.dapr.io/operations/hosting/kubernetes/kubernetes-production/)

```shell
helm repo add dapr https://dapr.github.io/helm-charts/
helm repo update
helm search repo dapr --devel --versions
```

此时，根据搜索到的 dapr 版本，你可以根据喜好选择替换`--version`即可（本示例选用 1.10.*）

```shell
helm upgrade --install dapr dapr/dapr \
--version=1.10 \
--namespace dapr-system \
--create-namespace \
--wait
```

验证 dapr 是否可用，返回的 `STATUS` 为 `Running` 即代表成功

```shell
kubectl get pods --namespace dapr-system
```



## 安装 MASA Stack

1. 添加 MASA Stack 的 helm 仓库

   ```shell
   helm repo add masastack https://masastack.github.io/helm/
   ```

2. 更新仓库

   ```shell
   helm repo update masastack 
   ```

3. 查看 MASA Stack 的版本

   > 带 --devel 和 --versions，可以看到 pre release 版本

   ```shell
   helm search repo masastack --devel --versions
   ```

4. 安装 MASA Stack

   > 本文选择 1.0.0-rc1，你可以自行更换版本，修改version即可
   >
   > 在发布正式版之前必须指定 --version，否则无法找到 stable 版本

   > 生成证书的参数示例（如果你使用正式的证书则可以省略生成证书部分，但安装时secret和domain参数也要相应修改）
   >
   > * Country Name 国家名称：CN
   > * State or Province Name 省份： GuangDong
   > * Locality Name 城市： ShenZhen
   > * Organization Name 组织名称/公司名称： MASA Stack
   > * Organizational Unit Name 组织单位名称/公司部门: MASA Stack
   > * Common Name 域名（这里是域名 *代表的是泛域名）： *.masastack.com
   > * Email Address 邮箱地址： 123@masastack.com

   :::: code-group
   ::: code-group-item 正式安装流程

   ```shell
   # 生成 tls 证书，生成证书时提示输入参数看上面示例
   openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout tls.key -out tls.crt
   # 查看生成的文件
   ls
   # 导入证书
   kubectl create secret tls masastack --cert=./tls.crt --key=./tls.key -n masastack
   # 文档尾部有变量列表，增加 --set global.suffix_identity=local 是为了防止与官方演示地址冲突
   helm upgrade --install masastack masastack/masastack \
     --version 1.0.0-rc1 \
     --namespace masastack \
     --create-namespace \
     --set global.secretName=masastack \
     --set global.domain=masastack.com \
     --set global.suffix_identity=local
   
   ```

   :::
   ::: code-group-item 快速测试

   ```shell
   # 自建证书，默认使用 *.masastack.com
   helm upgrade --install masastack masastack/masastack --version 1.0.0-rc1 --namespace masastack --create-namespace --set global.suffix_identity=local
   ```

   :::
   ::::

5. 等待安装

   > 根据网络情况拉取镜像一般需要5-10分钟左右，程序启动和集群配置等操作根据你的机器性能一般在5-10分钟左右
   >
   > 这个命令可以试试查看所有 masastack 命名空间下的 pod 的状态，退出可以按 CTRL + C

   ```shell
   watch kubectl get pods -n masastack
   ```



### 卸载 MASA Stack

期待下一次相见，准备输入卸载命令吧

```shell
helm uninstall masastack -n masastack
```

> 如何我们把先决条件依赖的全清空？
>
> 查对应的文档吧



## 常用变量

> 变量的使用记得用 --set <name>=<value>，参考正式安装流程的示例

| 变量名                                                       | 备注                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| global.sqlserver.{ip,id,port,password}                       | 使用外部数据库的时候配置，ip地址，账号，端口和密码           |
| global.redis.{ip,db,port,password}                           | 使用外部redis的配置                                          |
| global.elastic.{ip,port}                                     | 使用外部elasticsearch的配置                                  |
| global.prometheus{ip,port}                                   | 使用外部prometheus的配置                                     |
| global.suffix_identity                                       | <env>配置环境变量，针对本地多环境来使用                      |
| global.volumeclaims.{enabled,storageSize,storageClassName}   | 分别是启动StorageClass存储，指定存储空间大小，指定相应的StorageClass，若无指定使用默认sc |
| middleware-{redis,prometheus,sqlserver,otel,elastic}.service.type | ClusterIP,NodePort，默认为ClusterIP，主要为服务提供外部方位时修改 |
| middleware-{redis,prometheus,sqlserver,otel,elastic}.service.nodePort | 例如，32200 ；结合type使用，指定需要的端口                   |

>  [更多参数]([helm/values.yaml at main · masastack/helm · GitHub](https://github.com/masastack/helm/blob/main/values.yaml))