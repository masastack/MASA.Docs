ing类型，表示授权类型，通常为"client_credentials"或"password"
* `ClientId` string类型，表示客户端ID
* `ClientSecret` string类型，表示客户端密钥
* `Scope` string类型，表示请求的范围

在获取Token时，需要传入TokenProfile对象，其中包含了授权类型、客户端ID、客户端密钥和请求的范围。通过调用`RequestTokenAsync`方法，可以异步获取TokenResponse对象，其中包含了访问令牌、刷新令牌和令牌类型等信息。

## 使用Token

获取到Token后，可以将其添加到请求头中，以便在访问受保护的资源时进行身份验证。例如：

```csharp
httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", tokenResponse.AccessToken);
```

这里使用HttpClient发送请求时，将Token添加到请求头中，以Bearer格式进行身份验证。

## 结语

通过以上步骤，我们可以在MASA Stack中实现单点登录功能，让用户在一个客户端的多个应用之间共享登录态，提高用户体验和安全性。ing Type
* `Parameters` of type List<KeyValuePair<string, string>>

## Get User Information

```csharp
var userResponse = await _identityProvider.GetUserInfoAsync(token: string);
```

Retrieve basic user information based on the access token.

## Token Validation

```csharp
IJwtTokenValidator _jwtTokenValidator;
var result = await _jwtTokenValidator.ValidateAccessTokenAsync(accessToken: string, refreshToken: string);
```

## User Logout

> There are limitations to operating HttpContext in Blazor Server, so logging in and logging out operations need to be performed through a new Controller or cshtml page.

```csharp
SignOut("OpenIdConnect", "Cookies")
```