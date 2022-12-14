---
title: 扩展
date: 2022/12/14
---

## 概念

提供常用扩展方法, 安装`Masa.Utils.Extensions.DotNet`即可

## 功能

* [`String`类型扩展](#string)
* [`Type`类型扩展](#type)
* [`object`类型扩展](#object)
* [`MethodInfo`类型扩展](#methodinfo)
* [`JsonSerializerOptions`类型扩展](#json)
* [常用工具类](#tools)
    * [特性帮助类](#attribute)
    * [环境帮助类](#environment)
    * [网络帮助类](#network)

## 源码解读

### <a id="string">`String`类型扩展</a>

* IsNullOrWhiteSpace(): 指定的字串是否为 null、空还是仅由空白字符组成
* IsNullOrEmpty(): 指定的字串是否為 null、空字符串 ("")
* TrimStart(string trimParameter): 从当前字符串删除以`{trimParameter}`开头的字符串
* TrimStart(string trimParameter, StringComparison stringComparison): 从当前字符串删除以`{trimParameter}`开头的字符串 (确定在比较时根据`{stringComparison}`规则进行匹配)
* TrimEnd(string trimParameter): 从当前字符串删除以`{trimParameter}`结尾的字符串
* TrimStart(string trimParameter, StringComparison stringComparison): 从当前字符串删除以`{trimParameter}`结尾的字符串 (确定在比较时根据`{stringComparison}`规则进行匹配)

### <a id="type">`Type`类型扩展</a>

* GetGenericTypeName(): 得到泛型类型名
* IsNullableType(): 是否可空类型
* IsImplementerOfGeneric(Type genericType): 判断是否派生自泛型类, genericType必须是一个泛型类, 否则为false (例如: 得到`typeof(String).IsImplementerOfGeneric(typeof(IEquatable<>))`的结果为true)

### <a id="object">`object`类型扩展</a>

* GetGenericTypeName(): 得到泛型类型名

### <a id="methodinfo">`MethodInfo`类型扩展</a>

* IsAsyncMethod(): 得到当前是否是异步方法

### <a id="json">`JsonSerializerOptions`类型扩展</a>

* EnableDynamicTypes(): 启用动态类型

### <a id="tools">常用工具类</a>

#### <a id="attribute">特性帮助类</a>

* GetDescriptionByField\<TClass\>(string fieldName, BindingFlags? bindingFlags = null): 得到`TClass`类下指定字段的描述
* GetDescriptionByField(Type type, string fieldName, BindingFlags? bindingFlags = null): 得到指定类型下指定字段的描述
* GetDescriptionByField(FieldInfo fieldInfo): 得到指定字段的描述
* GetCustomAttribute\<TClass, TAttribute\>(string fieldName, BindingFlags? bindingFlags = null, bool inherit = true): 得到`TClass`类下指定字段特性的值
* GetCustomAttribute\<TAttribute\>(Type classType, string fieldName, BindingFlags? bindingFlags = null, bool inherit = true): 得到指定类、指定字段下特性的值
* GetCustomAttributeValue\<TOpt, TAttribute\>(FieldInfo fieldInfo, Func\<TAttribute, TOpt\> valueSelector, bool inherit = true): 得到指定字段指定特性的值

示例demo:

``` C#
public void Main()
{
    var value = AttributeUtils.GetDescriptionByConst<TestErrorCode>(nameof(ErrorCode.FRAMEWORK_PREFIX));
    Assert.AreEqual("Test Framework Prefix", value);
}

public class TestErrorCode
{
    [System.ComponentModel.Description("Test Framework Prefix")]
    public const string FRAMEWORK_PREFIX = "MF";
}
```

#### <a id="environment">环境帮助类</a>

* TrySetEnvironmentVariable(string environment, string? value): 尝试设置环境变量的值, 如果未设置或者值为`空还是仅由空白字符组成`则更新环境变量, 并返回true, 否则返回false

#### <a id="network">网络帮助类</a>

* GetPhysicalAddress(): 得到MAC地址, 如果获取失败则返回空字符串