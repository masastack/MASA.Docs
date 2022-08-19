---
title: 数据 - 序列化/反序列化 - Yaml
date: 2022/08/19
---

## 介绍

由[`YamlDotNet`](https://github.com/aaubry/YamlDotNet)提供Yaml的序列化和反序列化的能力

## 入门

1. 安装`Masa.Contrib.Data.Serialization.Yaml`

``` shell
dotnet add package Masa.Contrib.Data.Serialization.Yaml
```

2. 修改类`Program`，注册Yaml序列化/反序列化器

``` C#
builder.Services.AddYaml();
```

3. 使用Json序列化

``` C#
IYamlSerializer serializer;//从DI获取`IJsonSerializer`
var obj = new 
{
    Name = "Masa"
};
var yaml = serializer.Serialize(obj);
```

4. 使用Json反序列化

``` C#
public class Project
{
    public string Name { get; set; }
}

IYamlDeserializer deserializer;//从DI获取`IYamlDeserializer`
string json = "name: Masa";
var project = deserializer.Deserialize<Project>(json);
```