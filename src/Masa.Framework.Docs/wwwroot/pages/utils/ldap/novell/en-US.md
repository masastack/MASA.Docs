# LDAP - Novell

## Overview

This implementation is based on [Novell.Directory.Ldap.NETStandard](https://github.com/dsbenghe/Novell.Directory.Ldap.NETStandard) and is suitable for any directory server that is compatible with the LDAP protocol, including Microsoft Active Directory.

## Usage

1. Install `Masa.Utils.Ldap.Novell`

   ```shell terminal
   dotnet add package Masa.Utils.Ldap.Novell
   ```

2. Register `Ldap`

   ```csharp
   services.AddLadpContext(options => {
       options.ServerAddress = "{Replace-Your-ServerAddress}";
       options.ServerPort = "{Replace-Your-ServerPort}";
       options.ServerPortSsl = "{Replace-Your-ServerPortSsl}";
       options.BaseDn = "{Replace-Your-BaseDn}";
       options.UserSearchBaseDn = "{Replace-Your-UserSearchBaseDn}";
       options.GroupSearchBaseDn = "{Replace-Your-GroupSearchBaseDn}";
       options.RootUserDn = "{Replace-Your-RootUserDn}";
       options.RootUserPassword = "{Replace-Your-RootUserPassword}";
   });
   ```3. Retrieving all user information

   ```csharp
   ILdapProvider ldapProvider; // Obtained through dependency injection
   var allUser = await ldapProvider.GetAllUserAsync();
   ```