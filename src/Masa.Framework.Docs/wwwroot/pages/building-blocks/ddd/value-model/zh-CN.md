## 值对象

值对象有两个重要的特征

* 它们没有任何标识
* 它们是不可变的

任何属性的变化都将视为一个新的值对象

在`Masa Framework`中,  提供了值对象基类`ValueObject`, 例如:

```csharp
public class Address : ValueObject
{
    public String Street { get; private set; }
    public String City { get; private set; }
    public String State { get; private set; }
    public String Country { get; private set; }
    public String ZipCode { get; private set; }

    public Address() { }

    public Address(string street, string city, string state, string country, string zipCode)
    {
        Street = street;
        City = city;
        State = state;
        Country = country;
        ZipCode = zipCode;
    }

    protected override IEnumerable<object> GetEqualityValues()
    {
        yield return Street;
        yield return City;
        yield return State;
        yield return Country;
        yield return ZipCode;
    }
}
```

### 值等于

提供了`ValueObject.Equals()`方法用于检查两个值对象是否相等。例如: 检查两个地址是否相等

```csharp 
Address address1 = ...
Address address2 = ...

if (address1.Equals(address2))
{
    //地址1与地址2相等
}
```



