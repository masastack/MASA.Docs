# BackgroundJobs（后台任务）- 概述

提供一个简单版本的后台任务，将耗时操作交由后台任务来执行有利于快速响应用户操作，更复杂的后台任务推荐使用 [MASA Scheduler](/stack/scheduler/introduce)

## 功能

* [Memory](/framework/building-blocks/background-jobs/memory)：基于内存实现的后台任务
* [Hangfire](/framework/building-blocks/background-jobs/hangfire)：基于[Hangfire]([Hangfire – Background jobs and workers for .NET and .NET Core](https://www.hangfire.io/))实现的后台任务