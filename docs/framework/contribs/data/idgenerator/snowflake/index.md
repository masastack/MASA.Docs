---
title: 数据 - id生成器 - 雪花id
date: 2022/07/01
---

## 介绍

提供最基本的生成雪花id的能力，`Masa.Contrib.Data.IdGenerator.Snowflake`提供核心的雪花id生成器，默认仅支持单机版，如果希望支持分布式部署，则WorkerId需要支持分布式部署

目前支持分布式部署的提供者有:

* [Masa.Contrib.Data.IdGenerator.Snowflake.Distributed.Redis](framework/contribs/data/idgenerator/snowflake/redis): 基于Redis，实现WorkerId支持分布式部署

## 入门

1. 安装`Masa.Contrib.Data.IdGenerator.Snowflake`

``` powershell
dotnet add package Masa.Contrib.Data.IdGenerator.Snowflake
```

2. 修改`Program.cs`，注册雪花id生成器

``` C#
services.AddSnowflake();
```

3. 为当前服务设置WorkerId的值，添加环境变量`WORKER_ID`的值，其范围为：0-1023 (2^MaxWorkerId-1)

> 单机版的雪花id的`WORKER_ID`是固定值，当分布式部署时，不同的副本可能生成相同的雪花id

4. 获取Id

```
ISnowflakeGenerator generator;// 通过DI获取，或者通过IdGeneratorFactory.SnowflakeGenerator获取
generator.NewId();//创建唯一id
```

## 参数及常见问题:

* 参数说明
    * BaseTime: 基准时间，小于当前时间（时区：UTC +0）
      > 建议选用现在更近的固定时间，一经使用，不可更变（更改可能导致: 重复id）
    * SequenceBits: 序列号, 默认: 12，支持0-4095 (2^12-1)
      > 每毫秒每个工作机器最多产生4095个请求
    * WorkerIdBits: 工作机器id，默认: 10，支持0-1023个机器 (2^10-1)
      > 默认不支持在k8s集群中使用，在一个Pod中多副本获取到的WorkerId是一样的，可能会出现重复id
    * EnableMachineClock: 启用时钟锁，默认: false
      > 启用时钟锁后，生成的id不再与当前时间有绝对关系，生成的id以项目启动时的时间作为初始时间，项目运行后时钟回拨不会影响id的生成
    * WorkerId的值默认从环境变量`WORKER_ID`中获取，如未设置则会返回0
      > 多机部署时请确保每个服务的WorkerId是唯一的
    * TimestampType: 时间戳类型，默认: 1 (毫秒: Milliseconds, 秒: Seconds)
      > TimestampType为Milliseconds时，SequenceBits + WorkerIdBits 最大长度为22
      >
      > TimestampType为Seconds时，SequenceBits + WorkerIdBits 最大长度为31
    * MaxCallBackTime: 最大回拨时间，默认: 3000 (毫秒)
      > 当不启用时钟锁时，如果出现时间回拨小于MaxCallBackTime，则会等待时间大于最后一次生成id的时间后，再次生成id，如果大于最大回拨时间，则会抛出异常

* 分布式部署时
    * SupportDistributed: 支持分布式部署，默认: false (由WorkerId的提供类库赋值)
    * HeartbeatInterval: 心跳周期，默认: 3000ms
      > 用于定期检查刷新服务的状态，确保WorkerId不会被回收
    * MaxExpirationTime: 最大过期时间: 默认: 10000ms
      > 当刷新服务状态失败时，检查当前时间与第一次刷新服务失败的时间差超过最大过期时间后，主动放弃当前的WorkerId，并拒绝提供生成id的服务，直到可以获取到新的WokerId后再次提供服务

## 注意：

雪花id算法严重依赖时间，哪怕是启用时钟锁后，项目在启动时仍然需要获取一次当前时间作为基准时间，如果获取到的初始获取时间为已经过期的时间，那生成的id仍然有重复的可能