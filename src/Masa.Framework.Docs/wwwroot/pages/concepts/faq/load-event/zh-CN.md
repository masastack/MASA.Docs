## 加载事件

获取'事件'关系链失败

当`Event`、`EventHandler`、主工程不在同一个程序集中时，通过`EventBus`发布`Event`时会出现获取`Event`关系链失败的情况。当我们在没有特殊指定程序集的情况下使用`AddEventBus`时，默认使用当前域下的程序集。由于dotnet的延迟加载特性，导致事件关系链的获取不完整。有以下两种解决方案：

1、使用`AddEventBus`时，通过指定`Assembly`集合来指定当前项目使用的完整的应用程序集集合

2.在使用`AddEventBus`之前，通过直接调用`Event`、`EventHandler`所在程序集的任何方法或类，确保其所在的应用程序程序集已经加载到当前程序集（AppDomain.CurrentDomain.GetAssemblies()）