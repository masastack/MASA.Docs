---
title: LDAP
date: 2022/12/20
---

## 概念

用于提供支持LDAP协议兼容的目录服务器的扩展

目前的提供者有:

* [Masa.Utils.Ldap.Novell](https://www.nuget.org/packages/Masa.Utils.Ldap.Novell): 基于[Novell.Directory.Ldap.NETStandard](https://github.com/dsbenghe/Novell.Directory.Ldap.NETStandard)的实现, 适用于任何LDAP协议兼容的目录服务器 (包括 Microsoft Active Directory) [查看详细](/framework/utils/ldap/novell)

<!-- ## 功能



## 源码解读

## ILdapFactory



### ILdapProvider 

Ldap功能提供者, 提供以下功能

* GetGroupAsync(string groupName):
* GetUsersInGroupAsync(string groupName):
* GetUsersByEmailAddressAsync(string emailAddress):
* GetUserByUserNameAsync(string userName):
* GetAllUserAsync():
* GetPagingUserAsync(int pageSize):
* AddUserAsync(LdapUser user, string password):
* DeleteUserAsync(string distinguishedName):
* AuthenticateAsync(string distinguishedName, string password):  -->

文档正在完善中...