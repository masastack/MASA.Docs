# Product Introduction

### What is MASA Scheduler?

`Scheduler` is an auxiliary software product launched by `MASA Stack 1.0`, which is mainly responsible for scheduling the execution of application tasks and related operations such as automatic retry. In the `MASA Stack` product, it works best when combined with three other products: `MASA MC`, `MASA TSC`, and `MASA Alert`. Of course, `Scheduler` is not only for use with `MASA Stack` products, it can also create value for businesses.

![introduce](http://cdn.masastack.com/stack/doc/scheduler/introduce.png)

### Features and Advantages

1. It can be connected to related projects in `MASA Stack`, or consider external projects;

2. Currently supports three types of task scheduling: `Job`, `Http`, and `Dapr Service Invocation`;

3. Supports configuring various running and failure strategies (and can be set manually or automatically).

There are multiple dimensions for configuring execution strategies, especially for setting execution priority and related strategies after execution failure.

### Basic Structure

![Infrastructure](http://cdn.masastack.com/stack/doc/scheduler/Infrastructurei.png)

### Job Running Process Diagram

![job-run-flow](http://cdn.masastack.com/stack/doc/scheduler/job-run-flow.png)

### Discovery Model

![discovery-model](http://cdn.masastack.com/stack/doc/scheduler/discovery-model.png)