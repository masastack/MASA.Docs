---
title: 数据 - id生成器 - 雪花id - Redis
date: 2022/07/01
---

## 介绍

提供雪花id生成器，基于Reids，实现支持分布式部署

## 入门

1. 安装`Masa.Contrib.Data.IdGenerator.Snowflake.Distributed.Redis`

``` powershell
dotnet add package Masa.Contrib.Data.IdGenerator.Snowflake.Distributed.Redis
```

2. 修改`Program.cs`，注册雪花id生成器

``` C#
services.AddMasaRedisCache(opt =>
{
    opt.Password = "";
    opt.DefaultDatabase = 2;
    opt.Servers = new List<RedisServerOptions>()
    {
        new("127.0.0.1", 6379)
    };
});//需配置Redis
builder.Services.AddSnowflake(option => option.UseRedis());
```

3. 获取id

 ```
ISnowflakeGenerator generator;// 通过DI获取，或者通过IdGeneratorFactory.SnowflakeGenerator获取
generator.NewId();//创建唯一id
```

## 参数

* IdleTimeOut: 闲置回收时间，默认: 120000ms (2min)，当无可用的WorkerId后会尝试从历史使用的WorkerId集合中获取活跃时间超过IdleTimeOut的WorkerId，并选取距离现在最远的一个WorkerId进行复用
* GetWorkerIdMinInterval: 获取WorkerId的时间间隔，默认: 5000ms (5s)
  > 当前WorkerId可用时，会将WorkerId直接返回，不会有任何限制
  > 当服务刷新WorkerId失败，并持续时间超过指定时间后，会自动释放WorkerId，当再次获取新的Id时，会尝试重新获取新的WorkerId，若最近一次获取WorkerId时间与当前时间小于GetWorkerIdMinInterval时，会被拒绝提供服务
* RefreshTimestampInterval: 默认500ms
  > 选择启用时钟锁后，当获取到下次的时间戳与最近一次的时间戳超过RefreshTimestampInterval时，会将当前的时间戳与WorkerId对应关系保存在Redis中，用于后续继续使用，减少对当前系统时间的依赖