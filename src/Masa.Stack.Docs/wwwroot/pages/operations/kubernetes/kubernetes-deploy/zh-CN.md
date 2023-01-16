## 创建StorageClass

如何创建`StorageClass`, 点击[查看](https://kubernetes.io/docs/concepts/storage/storage-classes/)

## 部署dapr

masastack 的服务不能和dapr在同一个namespace 不然daprd会有注入异常的情况出现

```shell
kubectl create ns dapr

https://docs.dapr.io/operations/hosting/kubernetes/kubernetes-deploy/
```

## 创建Masastack需要的namespace

```shell
kubectl create masastack
```

## 导入证书

通过`kubectl`的命令导入与域名相关的`ssl/tls`证书提供给`masastack`使用

```shell
kubectl create secret tls masastack --cert=./tls.crt  --key=./tls.key  -n masastack
```

> 没有`ssl/tls`证书? 查看如何[创建临时证书](/stack/operations/tls/temporary)

## 安装MasaStack Helm chart

* 必要条件: 安装了helm3

1. 添加仓库并更新

```
// add then officaial MasaStack Helm chart
helm repo add masastack https://masastack.github.io/helm/
// update Helm chart
helm repo update 
// see waich chart version are available
helm search repo masastack --devel --versions
```

2. 在集群上的命名空间中安装MasaStack chart (需要依赖存储类)

```
helm upgrade --install masastack masastack/masastack \
--namespace dapr-system \
--create-namespace \
--set global.storage.className=<storageclass name> \
--wait 
```
