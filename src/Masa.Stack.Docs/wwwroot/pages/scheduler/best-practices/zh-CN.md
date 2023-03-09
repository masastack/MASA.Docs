---
title: 最佳实践
date: 2023/01/10 17:22:00
---

### 每天定时同步数据

1. 编写同步数据业务的Job类。请参考[SDK示例-用例3](stack/scheduler/sdk-instance)

2. 打包发布后上传到任务调度中心的源文件管理。请参考[使用指南-源文件](stack/scheduler/use-guide/scheduler-resource)

3. 调度sdk注册Job或者在任务调度中心手动添加Job。请参考[使用指南-调度Job](stack/scheduler/use-guide/scheduler-job),[SDK示例-用例2](stack/scheduler/sdk-instance)
