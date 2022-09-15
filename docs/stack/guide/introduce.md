---
title: 介绍
date: 2022/03/31
---
> 这个简单的alert可以用，将来我们也可以解析支持一下
:::warning
虽然可以在markdown里用vue这种高阶玩法，但是后面我们要做自己的官网，不要使用奇奇怪怪的功能，比如这个badge
:::
### Badge <Badge text="beta" type="warning"/> <Badge text="默认主题"/>

## Title1
### Title1.1
### Title1.2

This is MASA Stack.

测试代码
```csharp
public class Test
{
    public string Name { get; set; }
}
```

## Title2

测试代码分组

:::: code-group
::: code-group-item Test.Razor
```csharp
<MButton>Test</MButton>
```
:::
::: code-group-item Test.cs
```csharp
public partial class Test
{
    [Parameter]
    public string Name { get; set; }
}
```
:::
::::