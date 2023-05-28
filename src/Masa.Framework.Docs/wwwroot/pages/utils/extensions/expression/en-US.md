# Extension - Expression

## Overview

Provides extension methods for `Expression`.

## Usage

1. Install `Masa.Utils.Extensions.Expressions`:

   ```shell
   dotnet add package Masa.Utils.Extensions.Expressions
   ```

2. Use the `And` method to concatenate expressions with **AND**:

   ```csharp
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

## Other Examples

* `And<T>(Expression<Func<T, bool>> second)`: Concatenates two `Expression` expressions with **AND**:

   ```csharp
   public void Main()
   {
       var list = new List<int>()
       {
           1, 2, 3, 4, 5, 6, 7
       };
       Expression<Func<int, bool>> condition1 = i => i > 0;
       Expression<Func<int, bool>> condition2 = i => i < 5;
       var condition = condition1.And(condition2);
       var result = _list.Where(condition.Compile()).ToList();
       
       Assert.AreEqual(4, result.Count);
       Assert.AreEqual(1, result[0]);
       Assert.AreEqual(2, result[1]);
       Assert.AreEqual(3, result[2]);
       Assert.AreEqual(4, result[3]);
   }
   ```

* `Or<T>(Expression<Func<T, bool>> second)`: Concatenates two `Expression` expressions with **OR**:

   ```csharp
   public void Main()
   {
       var list = new List<int>()
       {
           1, 2, 3, 4, 5, 6, 7
       };
       Expression<Func<int, bool>> condition1 = i => i < 0;
       Expression<Func<int, bool>> condition2 = i => i > 5;
       var condition = condition1.Or(condition2);
       var result = _list.Where(condition.Compile()).ToList();
       
       Assert.AreEqual(2, result.Count);
       Assert.AreEqual(1, result[0]);
       Assert.AreEqual(7, result[1]);
   }
   ``````csharp
List<int>()
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
```

* And\<T\>(bool isCompose, Expression\<Func\<T, bool\>\>? second): When `isCompose` is `true`, merge two `Expression` expressions with the condition of **and**.

:::: code-group
::: code-group-item Main Unit Test

```csharp
public void Main()
{
    DateTime? startTime = null;
    DateTime? endTime = null;
    var list = GetList(startTime, endTime);
    Assert.AreEqual(3, list.Count);
    startTime = DateTime.Parse("1990-01-01");
    endTime = DateTime.Parse("2000-01-01");
    list = GetList(startTime, endTime);
    Assert.AreEqual(2, list.Count);
    Assert.AreEqual("1995-01-01", list[0].ToString("yyyy-MM-dd"));
    Assert.AreEqual("1998-01-01", list[1].ToString("yyyy-MM-dd"));
}

private List<DateTime> GetList(DateTime? startTime, DateTime? endTime)
{
    var list = new List<DateTime>()
    {
        DateTime.Parse("1995-01-01"),
        DateTime.Parse("1998-01-01"),
        DateTime.Parse("2005-01-01")
    };
    Expression<Func<DateTime, bool>> condition = d => true;
    if (startTime.HasValue)
    {
        condition = condition.And(d => d >= startTime.Value);
    }
    if (endTime.HasValue)
    {
        condition = condition.And(d => d < endTime.Value);
    }
    return list.Where(condition.Compile()).ToList();
}
```

:::

::: code-group-item Translation

```csharp
List<int>()
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
```

* And\<T\>(bool isCompose, Expression\<Func\<T, bool\>\>? second): 当 `isCompose` 为 `true` 时，合并两个 `Expression` 表达式，条件是 **并且**。

::::birthdayTime)
       {
           Name = name;
           BirthdayTime = birthdayTime;
       }
       public string Name { get; set; }
       public DateTime? BirthdayTime { get; set; }
   }
   ```
   :::
   </div>

   The above code is a C# code snippet that tests a method called `GetList` which returns a list of `Human` objects based on a given start and end time. The `Human` class has two properties, `Name` and `BirthdayTime`. The `GetList` method uses LINQ to filter the list of `Human` objects based on the given start and end time. The code also includes some unit tests to ensure that the method is working correctly.```csharp l:4
public void Main()
{
    Expression<Func<int, bool>> condition = i => i >5;
    condition = condition.Or(true, i => i < 2);
    
    var result = _list.Where(condition.Compile()).ToList();
    Assert.AreEqual(3, result.Count);
    Assert.AreEqual(1, result[0]);
    Assert.AreEqual(6, result[1]);
    Assert.AreEqual(7, result[2]);
}
```
   :::
   ::: code-group-item 辅助类

   ```csharp l:1
   public static class ExpressionExtensions
   {
       public static Expression<Func<T, bool>> And<T>(this Expression<Func<T, bool>> first, Expression<Func<T, bool>> second)
       {
           var parameter = first.Parameters[0];
           var visitor = new ReplaceExpressionVisitor(parameter);
           var secondBody = visitor.Visit(second.Body);
           var body = Expression.AndAlso(first.Body, secondBody);
           return Expression.Lambda<Func<T, bool>>(body, parameter);
       }
   
       public static Expression<Func<T, bool>> Or<T>(this Expression<Func<T, bool>> first, Expression<Func<T, bool>> second)
       {
           var parameter = first.Parameters[0];
           var visitor = new ReplaceExpressionVisitor(parameter);
           var secondBody = visitor.Visit(second.Body);
           var body = Expression.OrElse(first.Body, secondBody);
           return Expression.Lambda<Func<T, bool>>(body, parameter);
       }
   
       public static Expression<Func<T, bool>> Or<T>(this Expression<Func<T, bool>> first, bool isCompose, Expression<Func<T, bool>>? second)
       {
           if (!isCompose || second == null)
           {
               return first;
           }
           return first.Or(second);
       }
   }
   
   public class ReplaceExpressionVisitor : ExpressionVisitor
   {
       private readonly Expression _oldValue;
       private readonly Expression _newValue;
   
       public ReplaceExpressionVisitor(Expression oldValue, Expression newValue)
       {
           _oldValue = oldValue;
           _newValue = newValue;
       }
   
       public ReplaceExpressionVisitor(Expression oldValue)
       {
           _oldValue = oldValue;
       }
   
       public override Expression Visit(Expression node)
       {
           if (node == _oldValue)
           {
               return _newValue;
           }
           return base.Visit(node);
       }
   }
   ```
   :::
   ::::C# code translation:

```csharp
public void Main()
{
    string? name = null;
    bool? gender = null;
    var list = GetList(name, gender);
    Assert.AreEqual(0, list.Count);
    name = "Tom";
    gender = false;
    list = GetList(name, gender);
    Assert.AreEqual(2, list.Count);
}

private List<Human> GetList(string? name, bool? gender)
{
    var list = new List<Human>()
    {
        new("Tom", true, DateTime.Parse("2000-12-12")),
        new("Adelaide", false, DateTime.Parse("1999-12-12")),
        new("Adolf", true, DateTime.Parse("2005-12-12"))
    };
    Expression<Func<Human, bool>> condition = h => false;
    condition = condition.Or(name != null, h => h.Name.Contains(name!));
    condition = condition.Or(gender != null, h => h.Gender == gender);
    return list.Where(condition.Compile()).ToList();
}
```

The above code is written in C#. It defines a `Main` method that initializes some variables and calls the `GetList` method with those variables. The `GetList` method returns a list of `Human` objects based on some conditions. The conditions are defined using lambda expressions and the `Or` method from the `System.Linq.Expressions` namespace. The `ToList` method is used to convert the result to a list. The code also uses the `Assert` class to check if the result is correct.```markdown
In the following code block, there are two code snippets. The first one is a C# class named "CatalogType", which has two properties: "Id" and "Type". The second one is another C# class named "Human", which has three properties: "Name", "Gender", and "BirthdayTime".

The code also includes a method called "Compose<T>(Expression<T> second, Func<Expression, Expression, Expression> merge)", which combines two expressions and returns a new combined result.

```csharp
public class CatalogType
{
    public int Id { get; set; }
    public string Type { get; set; }
}

public class Human
{
    public Human(string name, bool gender, DateTime? birthdayTime)
    {
        Name = name;
        Gender = gender;
        BirthdayTime = birthdayTime;
    }
    public string Name { get; set; }
    public bool Gender { get; set; }
    public DateTime? BirthdayTime { get; set; }
}

public void Main()
{
    Expression<Func<int, bool>> condition = i => i > 5;
    Expression<Func<int, bool>> condition2 = i => i < 7;
    var expression = condition.Compose(condition2, Expression.AndAlso);
    var list = _list.Where(expression.Compile()).ToList();
}
``````
Assert.AreEqual(1, list.Count);
Assert.AreEqual(6, list[0]);
```

（注：这是一段代码，翻译为英文时应该保留原文，不需要进行翻译）