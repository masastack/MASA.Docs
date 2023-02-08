## 快速入门

在本系列教程中, 将创建一个名字`Masa.EShop.Service.Catalog`用于管理产品的服务, 它是使用以下技术开发的:

* `Entity Framework Core`提供获取数据的能力
* `Redis`: 提供获取数据的能力, 相比直接操作数据库, 它有更高的并发读写性能
* [`Minimal APIs`](/framework/building-blocks/minimal-apis)对外提供最小依赖项的`HTTP API`

## 目录

* [1. 创建最小APIs服务](/framework/getting-started/web-project/mf-part-1)
* [2. 领域层](/framework/getting-started/web-project/mf-part-2)
* [3. 保存或获取数据](/framework/getting-started/web-project/mf-part-3)
* [4. 自定义仓储实现](/framework/getting-started/web-project/mf-part-4)
* [5. 事件总线](/framework/getting-started/web-project/mf-part-5)
* [6. 应用服务层](/framework/getting-started/web-project/mf-part-6)
* [7. 对象映射](/framework/getting-started/web-project/mf-part-7)
* [8. 多级缓存](/framework/getting-started/web-project/mf-part-8)
* [9. 全局异常处理与I18n](/framework/getting-started/web-project/mf-part-9)

## 下载源码

* [Masa.EShop.Demo](https://github.com/zhenlei520/Masa.EShop.Demo)

## 创建解决方案

在开发之前, 可以根据[模板](#)创建项目或者自行创建解决方案并按需使用, 下面将使用非模板方式创建

新建`ASP.NET Core`空项目`Masa.EShop.Service.Catalog`

```powershell
dotnet new web -o Masa.EShop.Service.Catalog
cd Masa.EShop.Service.Catalog
```