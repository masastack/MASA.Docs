# User Identity - Blazor WebAssembly

## Overview

For `Blazor WebAssembly` projects, the user identity information is provided by `AuthenticationStateProvider`.

## Usage

1. Install `Masa.Contrib.Authentication.Identity.BlazorWebAssembly`

   ```shell terminal
   dotnet add package Masa.Contrib.Authentication.Identity.BlazorWebAssembly
   ```

2. Register `MasaIdentity`

   ```csharp Program.cs
   builder.Services.AddMasaIdentity();
   ```

3. Get user information

   ```csharp
   IUserContext userContext;//Get from DI
   var userId = userContext.GetUserId<Guid>();
   ```

## Advanced Usage

### Change Mapping Relationship

```csharp
services.AddMasaIdentity(option =>
{
    option.TenantId = "TenantId";// The default tenant id source is: TenantId
    option.Mapping("TrueName", "RealName"); //Add identity information 'TrueName', and set the original information to: 'RealName'
});
```