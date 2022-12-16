---
title: 扩展 - 表达式
date: 2022/12/16
---

## 概念

提供`Expression`扩展方法, 安装`Masa.Utils.Extensions.Expressions`即可

## 源码解读

* And\<T\>(Expression\<Func\<T, bool\>\> second): 合并两个`Expression`表达式, 条件是`并且`

``` C#
public void Main()
{
    var list = new List<int>()
    {
        1, 2, 3, 4, 5, 6, 7
    };
    Expression<Func<int, bool>> condition = i => i > 0;
    condition = condition.And(i => i < 5);
    var result = _list.Where(condition.Compile()).ToList();
    
    Assert.AreEqual(4, result.Count);
    Assert.AreEqual(1, result[0]);
    Assert.AreEqual(2, result[1]);
    Assert.AreEqual(3, result[2]);
    Assert.AreEqual(4, result[3]);
}
```

* And\<T\>(bool isCompose, Expression\<Func\<T, bool\>\>? second): 当`isCompose`为true时, 合并两个`Expression`表达式, 条件是`并且`

``` C#
public void Main()
{
    var list = new List<int>()
    {
        1, 2, 3, 4, 5, 6, 7
    };
    Expression<Func<int, bool>> condition = i => i > 0;
    condition = condition.And(true, i => i < 5);
    var result = _list.Where(condition.Compile()).ToList();
    
    Assert.AreEqual(4, result.Count);
    Assert.AreEqual(1, result[0]);
    Assert.AreEqual(2, result[1]);
    Assert.AreEqual(3, result[2]);
    Assert.AreEqual(4, result[3]);
    
    condition = i => i > 0;
    condition = condition.And(false, i => i < 5);
    list = _list.Where(condition.Compile()).ToList();
    Assert.AreEqual(7, list.Count);
    Assert.AreEqual(1, list[0]);
    Assert.AreEqual(2, list[1]);
    Assert.AreEqual(3, list[2]);
    Assert.AreEqual(4, list[3]);
    Assert.AreEqual(5, list[4]);
    Assert.AreEqual(6, list[5]);
    Assert.AreEqual(7, list[6]);
}
```

* Or\<T\>(Expression\<Func\<T, bool\>\> second): 合并两个`Expression`表达式, 条件是`或者`

``` C#
public void Main()
{
    Expression<Func<int, bool>> condition = i => i >5;
    condition = condition.Or(i => i < 9);
    
    var result = _list.Where(condition.Compile()).ToList();
    Assert.AreEqual(2, result.Count);
    Assert.AreEqual(6, result[0]);
    Assert.AreEqual(7, result[1]);
}
```

* Or\<T\>(bool isCompose, Expression\<Fun\c<T, bool\>\>? second): 当`isCompose`为false时, 合并两个`Expression`表达式, 条件是`或者`

``` C#
public void Main()
{
    Expression<Func<int, bool>> condition = i => i >5;
    condition = condition.Or(true, i => i < 9);
    
    var result = _list.Where(condition.Compile()).ToList();
    Assert.AreEqual(2, result.Count);
    Assert.AreEqual(6, result[0]);
    Assert.AreEqual(7, result[1]);

    condition = i => i >5;
    condition = condition.Or(false, i => i < 9);
    
    var result = _list.Where(condition.Compile()).ToList();
    Assert.AreEqual(7, result.Count);
}
```

* Compose\<T\>(Expression\<T\> second, Func\<Expression, Expression, Expression\> merge): 组合两个表达式得到新的组合后的结果

``` C#
public void Main()
{
    Expression<Func<int, bool>> condition = i => i > 5;
    Expression<Func<int, bool>> condition2 = i => i < 7;
    var expression = condition.Compose(condition2, Expression.AndAlso);
    var list = _list.Where(expression.Compile()).ToList();
    Assert.AreEqual(1, list.Count);
    Assert.AreEqual(6, list[0]);
}
```