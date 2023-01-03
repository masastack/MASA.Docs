---
title: 服务 - 服务调用
date: 2022/11/15
---

## 概念

提供服务调用的能力, 通过它可以调用其它服务, Caller被设计为与提供者无关

目前的提供者有:

* [HttpClient](./caller-httpclient): 基于HttpClient实现的Caller
* [DaprClient](./caller-daprclient): 基于DaprClient实现的Caller

## 功能列表

* [服务调用](#ICaller)

## 源码解读

::: tip 提示
当返回类型为
* `TResponse`: `自定义返回类型`, 框架自行处理异常请求
* `其它类型 (非自定义返回类型)`: 根据传入参数`autoThrowException`的值决定是否默认处理框架异常, 默认: true

框架处理异常请求机制, 当请求响应的 `HttpStatusCode`为
* `299`: 上抛`UserFriendlyException`异常
* `298`: 上抛`ValidatorException`异常
:::

### ICaller

服务调用抽象, 它提供了以下能力, 其生命周期为`Scoped`

::: tip 提示
autoThrowException为true会检查HttpStatus状态码并抛出对应的`Exception`, 部分方法的返回类型是指定类型, 且没有`autoThrowException`参数, 那么它们会自动检查HttpStatus状态码并抛出对应的`Exception` (gRPC请求除外)
:::

* ConfigRequestMessage: 提供设置当前Caller默认的`HttpRequestMessage`
* SendAsync: 提供原始的Send方法, 需要自行提供`HttpRequestMessage`类型的请求信息
* SendGrpcAsync: 提供基于gRPC的请求
* GetStringAsync: 提供`Get`请求并获取返回类型为`string`的结果
* GetByteArrayAsync: 提供`Get`请求并获取返回类型为`byte[]`的结果
* GetStreamAsync: 提供`Get`请求并获取返回类型为`Stream`的结果
* GetAsync: 提供`Get`请求并获取返回类型为`指定类型`的结果
* PostAsync: 提供`Post`请求并获取返回类型为`指定类型`的结果
* PatchAsync: 提供`Patch`请求并获取返回类型为`指定类型`的结果
* PutAsync: 提供`Put`请求并获取返回类型为`指定类型`的结果
* DeleteAsync: 提供`Delete`请求并获取返回类型为`指定类型`的结果

### ICallerFactory

服务调用抽象工厂, 它提供了以下能力, 其生命周期为`Singleton`

* Create (): 创建name值为`string.Empty`的Caller提供者
* Create (string name): 创建指定`name`的Caller提供者

### IRequestMessage

请求消息抽象, 提供了处理`HttpRequestMessage`的请求消息抽象, 默认实现: [`JsonRequestMessage`](https://github.com/masastack/MASA.Framework/blob/0.7.0/src/Contrib/Service/Caller/Masa.Contrib.Service.Caller/JsonRequestMessage.cs)

* ProcessHttpRequestMessageAsync(HttpRequestMessage requestMessage): 处理请求消息默认程序 (不支持自定义请求参数)
* ProcessHttpRequestMessageAsync\<TRequest\>(HttpRequestMessage requestMessage, TRequest data): 支持自定义请求参数的处理请求消息默认程序

### IResponseMessage

响应消息抽象, 提供了处理`HttpResponseMessage`的响应消息抽象, 默认实现: [`JsonResponseMessage`](https://github.com/masastack/MASA.Framework/blob/0.7.0/src/Contrib/Service/Caller/Masa.Contrib.Service.Caller/JsonResponseMessage.cs)

* ProcessResponseAsync\<TResponse\>(HttpResponseMessage response, CancellationToken cancellationToken = default): 针对指定响应类型的处理程序
* ProcessResponseAsync(HttpResponseMessage response, CancellationToken cancellationToken = default): 针对未指定响应自定义类型的处理程序