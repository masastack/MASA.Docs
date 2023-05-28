# Deploying MASA Stack on K8s

This article introduces how to deploy MASA Stack on K8s. For the convenience of local experience, we will use [Docker Desktop](https://www.docker.com/products/docker-desktop/) in the environment preparation section, which is also suitable for production environment K8s.

## Prerequisites

* [K8s](https://kubernetes.io/)
* [ingress-nginx](https://github.com/kubernetes/ingress-nginx)
* [Helm](https://helm.sh/)
* [Dapr](https://dapr.io/)

## Environment Preparation

This document assumes that you have already installed [Docker Desktop](https://www.docker.com/products/docker-desktop/) and [WSL](https://learn.microsoft.com/en-us/windows/wsl/about), and are using [Windows Terminal](https://learn.microsoft.com/en-us/windows/terminal/) based on Windows 11+. 

> Some installation scripts require foreign resources. If there are timeouts or other issues, you need to resolve them on your own.

### Enable Docker K8s

> If you already have K8s, you can skip this section.

![image-20230426150522160](https://cdn.masastack.com/stack/doc/stack/enable-docker-k8s.png)

### Install Helm

The demonstration environment in this document is Ubuntu 22.04 WSL. If you want to learn about other deployment methods, you can refer to the [official installation document](https://helm.sh/docs/intro/install/).

> Unless otherwise specified, all shell commands in this article are executed in WSL.# Installing ingress-nginx

According to the [official Helm deployment documentation](https://kubernetes.github.io/ingress-nginx/deploy/):

> Note: There is a compatibility requirement between the version of ingress-nginx and k8s. In this document, we are installing the latest version of ingress-nginx (1.7.0) on K8s 1.25. However, it is still recommended to confirm the [version compatibility](https://github.com/kubernetes/ingress-nginx#supported-versions-table).

> Note: The ingress-nginx image may access multiple foreign websites. If there is a timeout, you need to find a way to speed up access to foreign websites (it is recommended to enable global access).

```shell
curl https://baltocdn.com/helm/signing.asc | gpg --dearmor | sudo tee /usr/share/keyrings/helm.gpg > /dev/null
sudo apt-get install apt-transport-https --yes
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/helm.gpg] https://baltocdn.com/helm/stable/debian/ all main" | sudo tee /etc/apt/sources.list.d/helm-stable-debian.list
sudo apt-get update
sudo apt-get install helm
```

To verify that Helm is available, run the following command. If you see the version number returned, it means the installation was successful.

```shell
helm version
```Install ingress-nginx by running the following command:

```shell
helm install ingress-nginx ingress-nginx \
  --repo https://kubernetes.github.io/ingress-nginx \
  --namespace ingress-nginx --create-namespace
```

Verify if ingress-nginx is available by checking if the `STATUS` is `Running`:

```shell
kubectl get pods -n ingress-nginx
```

### Install Dapr

Follow the [official Helm deployment documentation](https://docs.dapr.io/operations/hosting/kubernetes/kubernetes-production/) to install Dapr:

```shell
helm repo add dapr https://dapr.github.io/helm-charts/
helm repo update
helm search repo dapr --devel --versions
```

Based on the searched dapr version, replace `--version` with your preferred version (this example uses 1.10.*):

```shell
helm upgrade --install dapr dapr/dapr \
--version=1.10 \
--namespace dapr-system \
--create-namespace \
--wait
```

Verify if Dapr is available by checking if the `STATUS` is `Running`:

```shell
kubectl get pods --namespace dapr-system
```

## Install MASA Stack

1. Modify coredns resolution for local testing (optional):

   > Run the command `kubectl get svc -n ingress` first.To find the CLUSTER-IP address for `nginx`, please refer to the following example output:

```
NAME                                 TYPE           CLUSTER-IP       EXTERNAL-IP   PORT(S)                      AGE
ingress-nginx-controller             LoadBalancer   10.102.212.224   localhost     80:30269/TCP,443:31696/TCP   19m
ingress-nginx-controller-admission   ClusterIP      10.97.224.233    <none>        443/TCP
```

In this example, the IP address is 10.102.212.224. Please replace the IP address in the `hosts` file with your own IP address.

```shell
cat > coredns.yaml <<EOF
apiVersion: v1
data:
  Corefile: |
    .:53 {
        hosts {
            10.102.212.224  pm-local.masastack.com
            10.102.212.224  pm-service-local.masastack.com
            10.102.212.224  auth-sso-local.masastack.com
            10.102.212.224  auth-service-local.masastack.com
            10.102.212.224  auth-local.masastack.com
         }
```The following IP addresses are associated with the corresponding services at masastack.com: 
- 10.102.212.224: dcc-service-local, dcc-local, alert-service-local, alert-local, mc-service-local, mc-local, tsc-service-local, tsc-local, scheduler-service-local, scheduler-worker-local, and scheduler-local. 
If there are any errors, they will be handled by the "errors" section, and the "health" section specifies a 5-second lameduck period. The service is ready and can be accessed securely through the Kubernetes cluster.local, in-addr.arpa, and ip6.arpa domains.前，建议先测试 pre release 版本，以确保稳定性。

   ```shell
   helm install masastack/masastack --version 1.0.0-rc1 --generate-name
   ```

6. 查看安装的 MASA Stack

   ```shell
   kubectl get pods -n masastack
   ```

7. 卸载 MASA Stack

   ```shell
   helm uninstall <release-name>
   ```

   其中，`<release-name>` 是通过 `helm list` 命令获取的 MASA Stack 的 release 名称。You must specify --version before executing the command, otherwise the stable version cannot be found.

> Example of certificate generation parameters (if you use an official certificate, you can skip the certificate generation part, but the secretName and domain parameters need to be modified accordingly during installation):
>
> * Country Name: CN
> * State or Province Name: GuangDong
> * Locality Name: ShenZhen
> * Organization Name: MASA Stack
> * Organizational Unit Name: MASA Stack
> * Common Name: Domain name (here the domain name is represented by * which means wildcard domain): *.masastack.com
> * Email Address: 123@masastack.com

:::: code-group
::: code-group-item Formal installation process

```shell
# Generate TLS certificate, see example above for input parameters
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout tls.key -out tls.crt
# Check the generated files
ls
# Import the certificate
kubectl create secret tls masastack --cert=./tls.crt --key=./tls.key -n masastack
# The variable list is at the end of the document, add --set global.suffix_identity=local to prevent conflicts with the official demo address
helm upgrade --install masastack masastack/masastack \
  --version 1.0.0-rc1 \
  --naThe following is a translation of a command sequence for installing a software package called "masastack" into English:

1. Install Helm

   > Helm is a package manager for Kubernetes. You can install it by running the following command:

   ```shell
   curl https://raw.githubusercontent.com/helm/helm/master/scripts/get-helm-3 | bash
   ```

2. Add the masastack repository

   > You can add the masastack repository to Helm by running the following command:

   ```shell
   helm repo add masastack https://masastack.github.io/masastack-charts/
   ```

3. Update the Helm repository

   > You can update the Helm repository by running the following command:

   ```shell
   helm repo update
   ```

4. Create a namespace

   > You can create a namespace for masastack by running the following command:

   ```shell
   kubectl create namespace masastack
   ```

5. Install masastack

   > You can install masastack by running the following command:

   ```shell
   helm upgrade --install masastack masastack/masastack --version 1.0.0-rc1 --namespace masastack --create-namespace --set global.secretName=masastack --set global.domain=masastack.com --set global.suffix_identity=local
   ```

   ::: code-group
   ::: code-group-item Explanation

   ```
   The above command installs the masastack package using Helm. It sets the version to 1.0.0-rc1 and installs it in the masastack namespace. It also creates the namespace if it doesn't already exist. The global.secretName and global.domain values are set to masastack and masastack.com, respectively. The global.suffix_identity value is set to local.
   ```

   :::

   ::: code-group-item Quick Test

   ```shell
   # Use a self-signed certificate, default domain is *.masastack.com
   helm upgrade --install masastack masastack/masastack --version 1.0.0-rc1 --namespace masastack --create-namespace --set global.suffix_identity=local
   ```

   :::

6. Wait for installation

   > It usually takes 5-10 minutes to pull the images depending on your network speed, and another 5-10 minutes for the program to start and the cluster to be configured, depending on your machine performance.
   >
   > You can use the following command to check the status of all pods in the masastack namespace. Press CTRL + C to exit.

   ```shell
   watch kubectl get pods -n masastack
   ```

7. Modify the local hosts file (optional, not necessary for production environments or if the IP can be resolved by domain name)

   * Open the hosts file, `C:\Windows\System32\drivers\etc`

   * Modify the contents as follows

     > First, run the command `ip a` to find the IP address of eth0, for example:
     >
     > ```
     > 2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc mq s...The following is the output of the command "tate UP group default qlen 1000", which shows the network configuration of the device:

> link/ether 00:15:5d:81:d5:f0 brd ff:ff:ff:ff:ff:ff
> inet 172.20.88.53/20 brd 172.20.95.255 scope global eth0
>  valid_lft forever preferred_lft forever
> inet6 fe80::215:5dff:fe81:d5f0/64 scope link
>  valid_lft forever preferred_lft forever

The IP address of the device is 172.20.88.53. In the following example, replace the IP addresses in the hosts file with your own IP address:

172.20.88.53  pm-local.masastack.com
172.20.88.53  pm-service-local.masastack.com
172.20.88.53  auth-sso-local.masastack.com
172.20.88.53  auth-service-local.masastack.com
172.20.88.53  auth-local.masastack.com
172.20.88.53  dcc-service-local.masastack.com
172.20.88.53  dcc-local.masastack.com
172.20.88.53  alert-service-local.masastack.com
172.20.88.53  alert-local.masastack.com
172.20.88.53  mc-service-local.masastack.com
172.20.88.53. mc-local.masastack.com
   172.20.88.53 tsc-service-local.masastack.com
   172.20.88.53 tsc-local.masastack.com
   172.20.88.53 scheduler-service-local.masastack.com
   172.20.88.53 scheduler-worker-local.masastack.com
   172.20.88.53 scheduler-local.masastack.com

   > The domain name rule is automatically generated as `<app-name><-type><-env><-demo>.<domain-name>`.
   >
   > Taking MASA PM as an example:
   >
   > app-name: pm
   >
   > type: pm is divided into two types, web and service. The default web type does not need to be concatenated with the domain name. The rest of the types are directly concatenated with the domain name.
   >
   > env: the environment can be customized. In the example, local is used as an example. It is recommended to use dev/staging/production in actual use. This parameter can be specified by modifying global.suffix_identity during installation.
   >
   > domain-name: this parameter can be specified by modifying global.domain during installation.
   >
   > Therefore, the final domain name of MASA PM is two, respectively:
   >
   > pm-local.masastack.com
   >
   > pm-service-local.masastack.com

8. Access MASA PM, enter the URL in the browser: https://pm-local.masastack.com

   > Account: admin
   >
   > Password: admin123

As the certificate is not from a trusted source, you may encounter the following prompt:

<img src="https://cdn.masastack.com/stack/doc/stack/err-cert-authority-invalid.png" alt="image-20230427145621278" style="zoom:50%;" />

Solution: Click on "Advanced", then click on "Continue to pm-local.masastack.com (unsafe)".

If your browser does not prompt you to continue, but instead shows an error message that the website uses HSTS, you can try using private browsing mode or adjusting your browser's privacy and security settings.

<img src="https://cdn.masastack.com/stack/doc/stack/err-cert-authority-invalid-hsts.png" alt="image-20230427150809578" style="zoom:50%;" />

9. Start learning MASA Stack according to the documentation [here](https://docs.masastack.com/stack/stack/introduce).

### Uninstalling MASA Stack

Until we meet again, get ready to enter the uninstall command:

```shell
helm uninstall masastack -n masastack
```

> If we want to completely remove all dependencies, please refer to the corresponding documentation.

## Common Variables

> Remember to use `--set <name>=<value>` when using variables, and refer to the example in the formal installation process.

| Variable Name | Description |
| --------------|-------------|terIP service type for middleware components such as Redis, Prometheus, SQL Server, OpenTelemetry, and Elasticsearch. |
| `middleware-{redis,prometheus,sqlserver,otel,elastic}.service.name` | Name of the middleware service for easy identification and management. |
| `middleware-{redis,prometheus,sqlserver,otel,elastic}.service.port` | Port number for the middleware service to listen on. |
| `middleware-{redis,prometheus,sqlserver,otel,elastic}.service.resources` | Resource limits and requests for the middleware service container. |
| `middleware-{redis,prometheus,sqlserver,otel,elastic}.service.env` | Environment variables for the middleware service container. |
| `middleware-{redis,prometheus,sqlserver,otel,elastic}.service.image` | Docker image for the middleware service container. |
| `middleware-{redis,prometheus,sqlserver,otel,elastic}.service.imagePullPolicy` | Image pull policy for the middleware service container. |
| `middleware-{redis,prometheus,sqlserver,otel,elastic}.service.volumeMounts` | Volume mounts for the middleware service container. |
| `middleware-{redis,prometheus,sqlserver,otel,elastic}.service.command` | Command to run inside the middleware service container. |
| `middleware-{redis,prometheus,sqlserver,otel,elastic}.service.args` | Arguments to pass to the command inside the middleware service container. |The `terIP`, `NodePort`, and `ClusterIP` are the default settings for external access to services, and can be modified as needed. The `middleware-{redis,prometheus,sqlserver,otel,elastic}.service.nodePort` parameter can be used in conjunction with the `type` setting to specify the required port, for example, `32200`. For more information on additional parameters, please refer to the following link: https://github.com/masastack/helm/blob/main/values.yaml.