---
title: 使用指南-调度Job
date: 2023/01/13 11:27
---

Job 为用户设置/定义好的一个作业的配置。

### 列表
调度Job列表以卡片形式展现，支持糊搜索、分页、筛选等功能。
- Job状态：为最后一次任务运行的状态. 不包含等待运行状态。
![jobs](http://cdn.masastack.com/stack/doc/scheduler/jobs.png)

### 新增/编辑Job

1. 选择Job类型
   支持Job应用、Http、Dapr Service Invocation，Job应用需要先上传源文件。
   ![job-add-type](http://cdn.masastack.com/stack/doc/scheduler/job-add-type.png)

2. Job基本信息和策略
    1. 调度类型
	- 手动运行：只能通过后台点击启动或者通过Sdk调用StartAsync接口启动。
	- Cron：会将Job注册到Quartz， 由Quartz根据Cron表达式触发Start事件。
	2. 路由策略
	- 轮询：Server会将Job 进行轮询的方式调度给Worker执行。
	- 指定：Server会将Job通过指定的方式发送给指定的Worker。
	3. 调度过期策略
	- 立即运行一次：Server会在程序启动时进行立即执行一次的补偿。
	- 自动补偿：Server会在程序启动时进行计算， 得到需要补偿的时间， 通过参数把时间传递给 DLL/接口， DLL/接口需要拿到参数里的时间.执行各自的逻辑。
	- 忽略：Server不会进行补偿。
	4. 阻塞处理策略
	- 等待上次任务完成：Server会等待这个Job上次任务执行完成， 再执行下一次。
	- 同时运行：这个Job当前任务触发将会直接运行。
	- 丢弃当前任务：Server将会把当前任务丢弃，直到上一次任务执行结束。
	- 中断上次运行并立即执行： Server将会把上一次任务执行强行中断, 并且立即执行此次任务。注意: 使用此策略， 执行的DLL请用事务。 如果是Http Job， 需要自己处理异常。
	5. 超时策略
	- 超时后执行失败策略：会将超时的任务视作失败，然后按照失败策略进行重试。
	- 超时后忽略：会将超时的任务忽略. 让其继续等待, 直到有结果为止。
	6. 失败策略
	- 自动：会根据配置的重试次数和重试间隔， 进行重试。 达到次数后， 还是失败， 则会判定为任务失败。
	- 手动：会直接判定为任务失败。

	![job-edit-baseInfo](http://cdn.masastack.com/stack/doc/job-edit-baseInfo.png)
3. Job配置信息
	除了配置的参数外，还会传递taskId和excuteTime参数。excuteTime用于服务挂掉恢复后自动补偿任务时的补偿时间，业务方可按需使用excuteTime代替当前时间。
	1. Job应用配置
	![job-edit-jobConfig](http://cdn.masastack.com/stack/doc/job-edit-jobConfig.png)
	2. Http配置
	![job-edit-httpConfig](http://cdn.masastack.com/stack/doc/job-edit-httpConfig.png)
	3. Dapr Service Invocation配置
	![job-edit-daprConfig](http://cdn.masastack.com/stack/doc/job-edit-daprConfig.png)