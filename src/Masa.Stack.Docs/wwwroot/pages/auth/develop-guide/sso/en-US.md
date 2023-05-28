# Single Sign-On (SSO)

> This article assumes that an SSO client has been successfully created in the MASA Auth backend.

Single Sign-On allows users to share login status between multiple applications within a client. Users only need to log in once to access other systems within the client.

## Integrating SSO

### Blazor Server

#### MASA Stack Component

1. Install the package `Masa.Stack.Components`.

   Add the MASA Stack Component service:

   ```csharp
   builder.AddMasaStackComponentsForServer();
   ```

2. Add OpenID Connect authentication.

   ```csharp
   builder.Services.AddMasaOpenIdConnect(MasaOpenIdConnectOptions:masaOpenIdConnectOptions);
   ```

   The `AddMasaOpenIdConnect` method is specifically designed for MASA Stack, and the encoding within the `AddOpenIdConnect` method is tailored to MASA Stack business.

   Introduction to `MasaOpenIdConnectOptions`:

   * `Authority` of type `string`, specifies the SSO site address, such as `https://auth-sso-dev.masastack.com`.
   * `ClientId` of type `string`, specifies the client ID.
   * `ClientSecret` of type `string`, specifies the client secret. Leave it blank if there is none.
   * `Scopes` of type `List<string>`, supplements the set of scopes requested by the application. The default is `openid` and `profile`. See [OpenIdConnectOptions](https://github.com/dotnet/asp).nticationScheme;
   })
   .AddCookie()
   .AddOpenIdConnect(options =>
   {
       options.Authority = "https://your-identity-server.com";
       options.ClientId = "your-client-id";
       options.ClientSecret = "your-client-secret";
       options.ResponseType = "code";
       options.Scope.Add("openid");
       options.Scope.Add("profile");
       options.SaveTokens = true;
   });
   ```

3. 在 `Startup.cs` 中添加相关中间件

   ```csharp l:3,4
   app.UseRouting();
   
   app.UseAuthentication();
   app.UseAuthorization();
   
   app.MapBlazorHub();
   ```versalClaims = false; //disable mapping of universal claims
       options.ClaimActions.MapJsonKey("preferred_username", "username"); //map preferred_username claim to username
       options.SaveTokens = true; //save tokens to cookie
       options.GetClaimsFromUserInfoEndpoint = true; //get additional claims from userinfo endpoint
       options.TokenValidationParameters = new TokenValidationParameters
       {
           NameClaimType = "name", //set name claim type
           RoleClaimType = "role" //set role claim type
       };
   });

The above code is configuring authentication in a .NET Core application using the Cookie and OpenID Connect authentication schemes. The code sets the default authentication scheme to be the Cookie authentication scheme, and then adds the OpenID Connect authentication scheme. The OpenID Connect scheme is configured to use an authority (SSO address), client ID, response type, and scope. The code also maps the preferred_username claim to the username claim, sets the name and role claim types, and saves tokens to a cookie.1. Add the necessary NuGet packages to your project, including `Microsoft.AspNetCore.Authentication.OpenIdConnect` and `Microsoft.AspNetCore.Authorization`.

2. In `Startup.cs`, configure the OpenID Connect authentication and authorization services:

   ```csharp l:3,20
   services.AddAuthentication(options =>
   {
       options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
       options.DefaultChallengeScheme = OpenIdConnectDefaults.AuthenticationScheme;
   })
   .AddCookie()
   .AddOpenIdConnect(options =>
   {
       options.Authority = "https://sso.example.com";
       options.ClientId = "your-client-id";
       options.ClientSecret = "your-client-secret";
       options.ResponseType = "code";
       options.SaveTokens = true;
       options.Scope.Add("openid");
       options.Scope.Add("profile");
       options.CallbackPath = "/signin-oidc";
       options.SignedOutCallbackPath = "/signout-callback-oidc";
       options.RemoteSignOutPath = "/signout-oidc";
       options.TokenValidationParameters = new TokenValidationParameters
       {
           NameClaimType = "name",
           RoleClaimType = "role"
       };
       options.ClaimActions.MapJsonKey("account", "account"); //claim map

       //ensure normal i use self signed certificate
       options.BackchannelHttpHandler = new HttpClientHandler
       {
           ServerCertificateCustomValidationCallback = delegate
           {
               return true;
           }
       };
   });
   
   services.AddAuthorization(options =>
   {
       // By default, all incoming requests will be authorized according to the default policy
       options.FallbackPolicy = options.DefaultPolicy;
   });
   ```

   > The `AddOpenIdConnect` method sets many parameters in the `options` object, and removes a lot of code compared to the `AddMasaOpenIdConnect` implementation. You can adjust the code according to your business needs. The `AddAuthorization` method uses the `DefaultPolicy`, which means all requests will be redirected to the SSO by default.

3. Add the necessary middleware in `Startup.cs`:

   ```csharp l:3,4
   app.UseRouting();
   
   app.UseAuthentication();
   app.UseAuthorization();
   
   app.MapBlazorHub();
   ```

### ASP.NET Core Webie，并跳转回客户端应用的首页。

## 对接 SSO

在 `OIDC` 中，单点登录（`SSO`）是通过在多个应用之间共享 `OIDC` 会话信息来实现的。当用户在一个应用程序中进行身份验证时，该应用程序将创建一个 `OIDC` 会话，并将 `OIDC` 会话信息存储在 `Cookie` 中。当用户尝试访问另一个应用程序时，该应用程序将检查是否存在 `OIDC` 会话信息的 `Cookie`，如果存在，则该应用程序将使用该信息进行身份验证，而不需要用户再次输入凭据。

在 `Blazor` 中，可以使用 `IdentityServer` 来实现 `SSO`。当用户在一个应用程序中进行身份验证时，`IdentityServer` 将创建一个 `OIDC` 会话，并将 `OIDC` 会话信息存储在 `Cookie` 中。当用户尝试访问另一个应用程序时，该应用程序将检查是否存在 `OIDC` 会话信息的 `Cookie`，如果存在，则该应用程序将使用该信息进行身份验证，而不需要用户再次输入凭据。

要实现 `SSO`，需要确保所有应用程序都使用相同的 `OIDC` 配置，并且所有应用程序都使用相同的 `IdentityServer` 作为身份验证服务器。此外，还需要确保所有应用程序都使用相同的 `Cookie` 名称和路径，以便它们可以共享 `OIDC` 会话信息。1. Please click on the "Submit" button to complete the registration process.
2. The system will automatically send a confirmation email to the email address you provided.
3. Please check your spam folder if you do not receive the confirmation email in your inbox.
4. After logging in, please click on the "Logout" button to end your session and redirect to the `/connect/endsession/callback` page.
5. On the `/connect/endsession/callback` page, one or more `iframes` will be generated to notify the logged-in applications to log out.