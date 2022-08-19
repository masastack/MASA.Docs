---
title: 使用模板
date: 2022/07/26
---

通过使用模板我们可以执行基于Masa解决方案的一些常见操作

## 安装模板

使用命令行窗口安装:

``` shell
dotnet new --install Masa.Template
```

## 创建项目

``` shell
dotnet new masafx -o Masa.Framework.Demo
```

> dotnet new masab [options] [模板选项]

### Options

这里是所有可用的命令列表

```
-n, --name <name>       正在创建的输出名称。如未指定名称，则使用输出目录的名称。
-o, --output <output>   要放置生成的输出的位置。
--dry-run               如果运行给定命令行将导致模板创建，则显示将发生情况的摘要。
--force                 强制生成内容 (即使它会更改现有文件)。
--no-update-check       在实例化模板时，禁用对模板包更新的检查。
-lang, --language <C#>  指定要实例化的模板语言。
--type <project>        指定要实例化的模板类型。
```

## 模板选项

文档正在编写中...