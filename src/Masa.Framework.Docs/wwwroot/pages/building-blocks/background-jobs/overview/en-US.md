# BackgroundJobs - Overview

Providing a simple version of background jobs, delegating time-consuming operations to background tasks is beneficial for quickly responding to user operations. For more complex background tasks, we recommend using [MASA Scheduler](/stack/scheduler/introduce).

## Best Practices

* [Memory](/framework/building-blocks/background-jobs/memory): Background jobs based on memory implementation.
* [Hangfire](/framework/building-blocks/background-jobs/hangfire): Background jobs based on [Hangfire](https://www.hangfire.io/) implementation.

## Capabilities

| Best Practices                                              | One-time Tasks | Periodic Tasks |
|:--------------------------------------------------|:-----:|:-----:|
| [Memory](/framework/building-blocks/background-jobs/memory) |   ✅   |   ❌   |
| [Hangfire](/framework/building-blocks/background-jobs/hangfire) |   ✅   |   ✅   |