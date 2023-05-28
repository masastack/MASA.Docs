# Memory Cache

## Overview

`Masa.Utils.Caching.Memory` has nothing to do with `Microsoft.Extensions.Caching.Memory`. The lifecycle of the cache provided by `Masa.Utils.Caching.Memory` depends on the user. It provides a thread-safe dictionary collection, which is similar to the `ConcurrentDictionary` class in usage, but its delegate methods are also thread-safe.

## Usage

We can build `MemoryCache<TKey, TValue>` as a global static property according to our needs, so that its lifecycle is until the application ends, or it can be defined as a property of a class or a regular variable of a method, so that its lifecycle will be consistent with the class or method.

1. Install `Masa.Utils.Caching.Memory`

   ```shell
   dotnet add package Masa.Utils.Caching.Memory
   ```

2. Use the cache

   ```csharp l:5,10
   class Test
   {
       static void Main()
       {
           var cache = new MemoryCache<Guid, DateTime>();
           Guid id = Guid.NewGuid();
           cache.TryAdd(id, () => DateTime.Now);
   
           Guid newId = Guid.Parse(Console.ReadLine());
           if(cache.Get(newId, out DateTime? createTime))
   ``````
{
    Console.WriteLine("The write time is: {Time}", createTime.Value);
}
```