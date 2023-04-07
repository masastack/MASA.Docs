## 教程概述

在本系列教程中, 将创建一个名字`Masa.EShop.Service.Catalog`用于管理产品的服务, 它是使用以下技术开发的:

1. **MASA Framework**提供后端通用能力

    技术栈：MinimalAPIs (最小API) + CQRS (读写分离) + DDD，对外提供对产品的增删改查服务

2. **MASA Blazor**作为前端组件库

希望通过学习此项目对大家了解和使用`MASA Framework`有一定的帮助

## 目录

* [1. 创建服务端](/framework/tutorial/mf-part-1)

## 下载源码

* [MASA.Framework.Tutorial](https://github.com/masalabs/MASA.Framework.Tutorial)

## 创建解决方案

可通过以下两种方式创建项目:

### 通过模版创建

1. 安装模版

```csharp
dotnet new --install Masa.Template
```

2. 使用模版创建一个`EShop`项目实例

以下命令将创建一个使用**MASA Blazor**的前端项目和一个使用**MASA Framework**的后端API服务

```csharp
dotnet new masafx -n Masa.EShop
```

> 更多模版命令可通过 **dotnet new masafx -h**了解，或者通过Visual Studio图形化界面进行创建

### 手动创建

我们将从零开始，不借助模版创建一个使用**MASA Blazor**的前端项目和一个使用**MASA Framework**的后台API服务

## 必要条件

1. 确保已安装[`.NET 6.0`](https://dotnet.microsoft.com/en-us/download/dotnet/6.0)以上版本

```shell
dotnet --list-sdks
```

> 通过以上命令验证确保已安装符合条件版本的`.NET SDK`

2. 确保已安装支持[`.NET 6.0`](https://dotnet.microsoft.com/en-us/download/dotnet/6.0)或更高版本的开发工具，例如：

* [Visual Studio](https://visualstudio.microsoft.com/zh-hans/vs/)
* [Rider](https://www.jetbrains.com/rider/)
* [Visual Studio Code](https://code.visualstudio.com/download)

## 其它

在本系列教程中，我们将采用手动从零开始，通过使用**MASA Blazor**、**MASA Framework**创建一个用于管理产品的项目示例

> 示例项目将尽可能使用更多**Building Block**的能力，会把常用的功能以及写法在示例中进行讲解，但不会太过深入的去讲解，想更深入的了解需要大家去查看对应**Building Block**的文档

## 常见问题

1. 按照文档操作, 并没有发现对应的方法、属性或类 
   
   目前文档与最新版本的**MASA Framework**包对应, 可通过尝试安装最新的预览版再进行重试，如果仍未找到对应的方法、属性或者类，可以尝试在[这里](https://github.com/masastack/MASA.Templates/issues?q=)进行搜索查询，如果仍然未找到答案可以给我们提[Issues](https://github.com/masastack/MASA.Templates/issues/new/choose)