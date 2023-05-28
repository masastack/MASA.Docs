# Data Mapping - Overview

Data Mapping provides the ability to map objects by adding a reference to the provider and registering it, making it easy to map objects.

## Best Practices

* [Mapster](/framework/building-blocks/data-mapping/mapster): An extension based on [Mapster](https://github.com/MapsterMapper/Mapster) that makes object mapping easy.

## Source Code Analysis

An abstract `IMapper` is provided for mapping, which supports:

* Map: Converts the source type object to the target type based on the target type and returns it.