ce.com");
```

### 使用 Auth 服务

```csharp
public class MyService
{
    private readonly IAuthClient _authClient;

    public MyService(IAuthClient authClient)
    {
        _authClient = authClient;
    }

    public async Task DoSomething()
    {
        var user = await _authClient.UserService.GetUserAsync("userId");
        // do something with user
    }
}
```Here is the translation:

## Introduction

This code snippet shows how to use dependency injection to inject an `IAuthClient` instance into a route handler in a C# application.

## Injecting IAuthClient

```csharp
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddHttpClient<IAuthClient, AuthClient>(client =>
{
    client.BaseAddress = new Uri("http://authservice.com");
});

```

> `http://authservice.com` is the address of the `Auth` backend service.

## Using IAuthClient with Dependency Injection

```csharp 
var app = builder.Build();

app.MapGet("/GetTeams", ([FromServices] IAuthClient authClient) =>
{
    return authClient.TeamService.GetAllAsync();
});

app.Run();
```