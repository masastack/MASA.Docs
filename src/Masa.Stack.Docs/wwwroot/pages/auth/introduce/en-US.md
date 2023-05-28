com/stack/doc/auth/introduce/user-management.png)

### 权限管理

支持RBAC3权限管理模型，可对用户、角色、权限进行管理。支持细粒度的权限控制，可对页面、按钮、接口等进行权限控制。同时支持权限的继承和覆盖。

### 单点登录

支持多种登录方式，包括用户名密码、短信验证码、第三方登录等。可实现多个系统之间的单点登录，提高用户体验。

### 第三方平台接入

支持QQ、微信、Github等第三方平台接入，可实现快速登录和用户信息同步。

### Ldap集成

支持Ldap集成，可实现企业内部用户的统一管理。

### 安全性

采用了多种安全措施，包括密码加密、防止暴力破解、防止CSRF攻击等，保障用户信息的安全。

### 可扩展性

支持插件机制，可根据业务需求自定义插件。同时支持多语言、多主题等扩展。

## 产品应用场景

MASA Auth可应用于各种需要用户登录的场景，包括企业内部管理系统、电商平台、社交平台、在线教育等。同时，它也可作为其他MASA Stack产品的基础功能，如MASA CMS、MASA CRM等。In the image above, we can see the user management and authorization system. This system allows for independent user accounts to be created for employees or users, with permissions assigned to each account to ensure accountability. Additionally, different types of users can be granted varying levels of management permissions for logging in and performing operations.为了满足审计标准而引入的。它将权限授权分为两个层次：角色和职责。角色是一组权限的集合，而职责则是对角色的限制，以确保权限的正确使用。

RBAC3 模型则进一步增加了时间限制和多渠道授权注册与登录的功能。用户/员工需要独立获取授权，并且授权后可以操作资源，同时有记录以符合审计标准。用户/员工的账号权限可以随时冻结或取消，并且授权有时间限制，可以关联授权令牌进行相关设置。此外，用户/员工可以通过多种渠道进行授权注册和登录。

In English:

<tr>
    <td>- Users/employees need to obtain authorization independently, and can operate resources after authorization. There are records to comply with audit standards.</td>
</tr>
<tr>
    <td>- User/employee account permissions can be frozen or cancelled at any time.</td>
</tr>
<tr>
    <td>- User/employee authorization has a time limit and can be associated with authorization tokens for related settings.</td>
</tr>
<tr>
    <td>- Users/employees can register and log in through multiple channels.</td>
</tr>

### What is the RBAC3 model

RBAC considers that permission authorization is actually a "Who What How" problem, that is, "Who performs What operation on How". It is the operation of the "subject" on the "object", where Who is the owner of the permission (User, Role)-subject, and What is the resource or object (Resource, Class).

RBAC1 model mainly adds the concept of role inheritance. In many business scenarios, there are hierarchical relationships between roles. For example, the relationship between the president of a provincial bank and the president of a municipal branch in the banking business, and the relationship between the regional manager and the district manager in the business of a large group company.

RBAC2 model mainly adds the concept of separation of duties, and adds many constraints to authorized access, which is also introduced to comply with audit standards. It divides permission authorization into two levels: roles and responsibilities. Roles are a set of permissions, while responsibilities are restrictions on roles to ensure the correct use of permissions.

The RBAC3 model further adds the functions of time limit and multi-channel authorization registration and login. Users/employees need to obtain authorization independently, and can operate resources after authorization, while there are records to comply with audit standards. User/employee account permissions can be frozen or cancelled at any time, and authorization has a time limit, which can be associated with authorization tokens for related settings. In addition, users/employees can register and log in through multiple channels.In order to meet business needs, for example, within a company, the roles of cashier and accountant are different. If one person were to hold both roles, there could be a risk of funds being lost without anyone knowing. Therefore, in the implementation of the RBAC model, authorization constraints are used to limit the same person from being granted both the cashier and accountant roles, in order to mitigate risks.

The RBAC3 model is a combination of RBAC1 and RBAC2, which adds role inheritance and access control constraints to meet more complex business needs.

Implementation of RBAC3 technology

The most common visual component for calling APIs is a front-end web page. Typically, a front-end web page includes the following elements:

* Modules: Refers to a combination of multiple business functions that are similar, such as user management modules that include user registration, user information modification, user cancellation, and user locking.
* Menus: Usually correspond to a specific business function page, with a distinction between parent and child menus.
* Buttons: Refers to the operation buttons on the page, such as add, modify, and delete buttons.
* Links: Hyperlinks that need access control in addition to buttons in the main part of the page.
* Data: Business data, resources, files, etc. displayed on the page.

### Authorization Policy

* In the MASA Stack product, authorization is mainly managed by Auth. Authorization is divided into front-end and API permissions, and currently only provides menu permissions.
* Permissions can be granted to corresponding roles, and independent permission names can be set. Supports both Chinese and English names.
* API permissions cannot be directly assigned to specific roles and users, and need to be attached to front-end permissions to be used with front-end permissions.
* The priority of permission hierarchy is: personal > role > inherited role > project team, to avoid exceptions caused by conflicting permissions.

### SSO Single Sign-On

Single Sign-On (SSO) is a one-time authentication login for users. After logging in to the identity authentication server once, users can obtain access to other related systems and application software in the single sign-on system. This implementation does not require administrators to modify the user's login status or other information, which means that in multiple application systems, users only need to log in once to access all trusted application systems. This reduces the time consumption caused by login and assists in user management, making it quite popular.

* Authenticate users/employees and identify their corresponding sources and identities.
* Authorize authenticated users/employees to log in to platforms and operate permissions.uth提供了安全防止伪造身份验证的功能。通过Auth认证授权的用户可以在MASA Stack中拥有相关操作权限，并登录所有相关平台。

MASA Auth提供了无限级组织架构管理工具，适用于企业级部门编排人员与用户。根节点是唯一不可删除的。部门管理增加了快速复制部门的功能，可以快速新增或调整部门中的相关人员管理。

需要注意的是，MASA Auth组织架构不涉及任何角色权限相关的挂靠，虽然有层级区分但并没有影响实际权限的层级。具体如何适用可以灵活变通以满足需求场景。

用户登录Auth以及MASA Stack其他项目平台所登录的界面均可通过Auth进行配置，可以在Auth进行统一管理。用户登录MASA Stack产品的授权统一由Auth进行管理，可以对授权页面进行调整，包括调整用户须知等协议。

项目团队是在人员组织以及项目之外再增加的一个圈层，可以用于管理临时的项目。适用场景比较广发，在不改变人员原有的组织架构、角色部门权限的基础上再增加的项目团队组。项目团队设置有2个固定角色：项目团队管理员和项目团队成员。项目团队成员的权限≤项目管理员，权限层级优先级相对最低。项目团队管理员/项目团队成员设置权限时可以直接选择角色进行配权。

MASA Auth目前已经支持企业级域账号登录，可以配置域账号。已经支持手机号码登录。其他第三方可以通过Oauth增加客户端来进行配置。

MASA Auth属于一款综合性的用户管理产品，提供了目前市面上大部分常规产品该有的功能，并且进行了一定的组合可以提供更全适合更多场景使用的可能。例如，在公司企业中会有很多短期和应急性的变动，成立一个临时的项目组来完成某件事情或某些指标。在不变动原有岗位与权限的基础上需要开通关于临时项目组的权限内容，这里我们就可以通过项目管理来实现这一需求。作为MASA Stack 1.0的核心产品，Auth提供了安全防止伪造身份验证的功能。UTH also offers single sign-on to integrate with other products in the system matrix. MASA Auth, along with MASA DCC and MASA PM, can serve as the initial three-piece solution to address project challenges at the outset.