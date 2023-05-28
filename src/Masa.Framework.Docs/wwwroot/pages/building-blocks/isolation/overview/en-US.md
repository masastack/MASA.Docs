# Isolation - Overview

The MASA Framework provides isolation functionality, supporting both **physical isolation** and **logical isolation**.

> Isolation needs to be used in conjunction with building blocks such as **data**, **cache**, and **storage**. It has no meaning when used alone.

## Best Practices

* [Multi-tenancy](/framework/building-blocks/isolation/multi-tenant): Provides basic functionality for creating multi-tenant applications.
* [Multi-environment](/framework/building-blocks/isolation/multi-environment): Provides basic functionality for creating multi-environment applications.

## Capability Introduction

| Best Practice                                                      | Data Context | Cache | Storage | Caller | Rule Engine | Auto Completion | Integrated Event | Configuration |
|:--------------------------------------------------------------|:------:|:---:|:---:|:---:|:--:|:----: |:----: |:----: |
| [Multi-tenancy](/framework/building-blocks/isolation/multi-tenant)      |   ✅    |  ✅  |  ✅  |  ✅  |  ✅ | ✅ | - | - |
| [Multi-environment](/framework/building-blocks/isolation/multi-environment) |   ✅    |  ✅ |  ✅  |  ✅  |  ✅ | ✅ | - | - |

> ✅: Supported. ❌: Not supported. -: Not yet supported.