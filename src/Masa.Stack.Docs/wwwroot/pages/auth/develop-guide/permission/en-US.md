权限的接口添加 `[Authorize]` 特性。

## 数据权限

数据权限需要业务系统自己实现，可以在业务系统中通过数据库表或者其他方式来实现。在查询数据时，根据当前用户的权限来过滤数据。To add the `AuthorizeAttribute` or `MasaAuthorizeAttribute` attribute to the interface.

### Middleware

Define middleware and handle logic in the `InvokeAsync` method.

1. Filter non-custom routes (not necessary), such as Dapr, etc.
2. Check if there is an `AllowAnonymousAttribute` attribute. If so, call `next` directly.
3. Check if there is a `MasaAuthorizeAttribute` attribute and get the corresponding `Code` value for the interface.
4. If there is no custom `Code`, generate the `Code` by default. For example, `api/user/create` is generated as `{AppId}.api.user.create`.
5. Get the authorized `Code` of the user and check it. If the `Code` is not authorized, return `StatusCodes.Status403Forbidden`.

[Full code](https://github.com/masastack/MASA.Auth/blob/main/src/Services/Masa.Auth.Service.Admin/Infrastructure/Authorization/MasaAuthorizeMiddleware.cs)

### Authorize Extension

Implement the `IAuthorizationMiddlewareResultHandler` interface and inject it.

```csharp 
.AddScoped<IAuthorizationMiddlewareResultHandler, CodeAuthorizationMiddlewareResultHandler>()
.AddSingleton<IAuthorizationHandler, DefaultRuleCodeAuthorizationHandler>()
//.AddSingleton<IAuthorizationPolicyProvider, DefaultRuleCodePolicyProvider>()
.AddAuthorization(opThe `AddAuthorization` method sets the default policy within the options parameter, or sets the policy through the `DefaultRuleCodePolicyProvider` by adding requirements to the policy. The logic is handled within the `HandleAsync` method of the `IAuthorizationMiddlewareResultHandler`.

[Full code](https://github.com/masastack/MASA.Auth/blob/main/src/Services/Masa.Auth.Service.Admin/Infrastructure/Authorization/CodeAuthorizationMiddlewareResultHandler.cs)

## Data Authorization

Todo