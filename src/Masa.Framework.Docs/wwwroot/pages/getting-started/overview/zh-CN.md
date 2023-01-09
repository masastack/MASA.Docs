## 快速入门

在本系列教程中, 将创建一个名字`Masa.EShop.Service.Catalog`用于管理产品的服务, 它是使用以下技术开发的:

* `Entity Framework Core`提供获取数据的能力
* `Redis`: 提供获取数据的能力, 相比直接操作数据库, 它有更高的并发读写性能
* [`Minimal APIs`]()对外提供最小依赖项的`HTTP API`

## 目录

* [1. 创建最小APIs服务](/framework/getting-started/mf-part-1)
* [2. 商品: 领域层](/framework/getting-started/mf-part-2)
* [3. 存储或获取数据](/framework/getting-started/mf-part-3)
* [4. 使用多级缓存](/framework/getting-started/mf-part-4)

## 下载源码

## 创建解决方案

在开发之前, 可以根据[模板](#)创建项目或者自行创建解决方案并按需使用, 下面将使用非模板方式创建

新建`ASP.NET Core`空项目`Masa.EShop.Service.Catalog`

```powershell
dotnet new web -o Masa.EShop.Service.Catalog
cd Masa.EShop.Service.Catalog
```