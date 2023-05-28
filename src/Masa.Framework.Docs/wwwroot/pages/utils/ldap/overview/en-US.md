# LDAP - Overview

LDAP extension for providing support for LDAP protocol compatible directory servers.

Currently, the following providers are available:

* [Novell](/framework/utils/ldap/novell): Implementation based on [Novell.Directory.Ldap.NETStandard](https://github.com/dsbenghe/Novell.Directory.Ldap.NETStandard), suitable for any LDAP protocol compatible directory server (including Microsoft Active Directory).

## Features

### ILdapFactory

Factory class that provides only one method `CreateProvider` which returns an `ILdapProvider` type.

### ILdapProvider

`Ldap` feature provider, which can be obtained directly through `DI` or created and returned through `ILdapFactory`, provides the following features:

* GetGroupAsync(string groupName): Get group by group name.
* GetUsersInGroupAsync(string groupName): Get users in a group by group name.
* GetUsersByEmailAddressAsync(string emailAddress): Get user by email address.
* GetUserByUserNameAsync(string userName): Get user by username.
* GetAllUserAsync(): Get all users.
* GetPagingUserAsync(int pageSize): Get users in pages.
* AddUserAsync(LdapUser user, string password): Add domain user and specify password.
* DeleteUserAsync(string distinguishedName): Delete user by distinguished name.
* AuthenticateAsync(string distinguishedName, string password): Authenticate password by distinguished name."是否正确"的英文翻译可以是 "Is it correct?" 或者 "Is it right?"。