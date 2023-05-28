# Caching - Overview

Caching is used to improve the speed of data access, and is generally used in the following scenarios:
   * Data that is accessed frequently but changes infrequently. For example: permission data in a system.

The caching component in MASA Framework provides the ability for [distributed caching](/framework/building-blocks/caching/stackexchange-redis) and [multi-level caching](/framework/building-blocks/caching/multilevel-cache). Both distributed caching and multi-level caching have abstract building blocks and default implementations, so our programs only need to depend on the abstract building blocks, and the default implementation can be replaced as needed.

## Best Practices

* Distributed caching:
    * [Redis cache](/framework/building-blocks/caching/stackexchange-redis): A distributed cache implementation based on [StackExchange.Redis](https://github.com/StackExchange/StackExchange.Redis).
    * More to come... (stay tuned)
* [Multi-level caching](/framework/building-blocks/caching/multilevel-cache): A multi-level cache implementation based on distributed caching and memory caching. It adds a layer of memory caching between distributed caching and the system, reducing the cost of one network transmission and deserialization compared to distributed caching, and has better performance advantages.