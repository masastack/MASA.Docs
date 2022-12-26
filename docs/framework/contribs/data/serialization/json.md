---
title: 数据 - 序列化/反序列化 - json
date: 2022/08/19
---

## 介绍

由[`System.Text.Json`](https://docs.microsoft.com/zh-cn/dotnet/api/system.text.json?view=net-6.0)提供Json的序列化和反序列化的能力

## 入门

1. 安装`Masa.Contrib.Data.Serialization.Json`

``` powershell
dotnet add package Masa.Contrib.Data.Serialization.Json
```

2. 修改类`Program`，注册Json序列化/反序列化器

``` C#
builder.Services.AddJson();
```

3. 使用Json序列化

``` C#
IJsonSerializer serializer;//从DI获取`IJsonSerializer`
var obj = new 
{
    Name = "Masa"
};
var json = serializer.Serialize(obj);
```

4. 使用Json反序列化

``` C#
public class Project
{
    public string Name { get; set; }
}

IJsonDeserializer deserializer;//从DI获取`IJsonDeserializer`
string json = "{\"Name\":\"Masa\"}";
var project = deserializer.Deserialize<Project>(json);
```