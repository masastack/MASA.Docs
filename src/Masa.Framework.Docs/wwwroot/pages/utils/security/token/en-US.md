# Security - JWT Encryption and Verification

## Overview

Generate corresponding tokens according to the `JWT` scheme and provide methods to verify their legality.

## Features

* [Generate Token](#CreateToken)
* [Verify Token Legality](#IsValid)

## Usage

1. Install the `Masa.Utils.Security.Token` package.

   ```shell terminal
   dotnet add package Masa.Utils.Security.Token
   ```

2. Register the `JWT` extension.

   ```csharp
   services.AddJwt(options => {
       options.Issuer = "{Replace-Your-Issuer}";
       options.Audience = "{Replace-Your-Audience}";
       options.SecurityKey = "{Replace-Your-SecurityKey}";
   });
   ```

3. Create a token.

   ```csharp
   var param = "{Replace-Your-Param}";
   var token = JwtUtils.CreateToken(param, TimeSpan.FromSeconds(60));
   ```

4. Verify the token.

   ```csharp
   var param = "{Replace-Your-Param}";
   var token = "{Replace-Your-Token}";
   if(!JwtUtils.IsValid(token, param))
   {
       throw new UserFriendlyException("Verification Failed");
   }
   ```

## Source Code Analysis* CreateToken: Generate a `Token` that expires after a specified `timeout` period.
* CreateToken: Generate a `Token` based on the provided collection of `Claims`, which expires after a specified `timeout` period.
* IsValid: Verify the validity of a given `Token`.