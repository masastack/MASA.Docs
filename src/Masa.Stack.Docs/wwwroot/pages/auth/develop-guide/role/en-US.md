# Development Guide - Roles

Roles implement the RBAC3 permission model, with features such as role inheritance and cardinality constraints.

## Role Inheritance

Role inheritance allows for flexible and convenient role configuration, making it easier to manage. A role can inherit any number of roles and obtain the sum of all inherited roles' permissions. Inheritance is recursive, so if A inherits from B and B inherits from C, then A has the sum of permissions from both B and C.

## Cardinality Constraints

Cardinality constraints are used to limit the number of times a role can be bound to a user. Users can directly bind roles or indirectly bind roles through teams, both of which are subject to cardinality constraints. Let's take the finance role as an example.

1. Create the finance role on the role page and set the binding limit to 2.

![](https://cdn.masastack.com/stack/doc/auth/role-add-caiwu.png)

2. Click the authorization icon for the specified user on the user page to authorize the finance role to the user. After two users have been authorized, attempting to authorize a third user will display a message indicating that the role cannot be selected due to the binding limit.

![](https://cdn.masastack.com/stack/doc/auth/user-authorize-role-limit.png)

3. Click "Add Team" on the team page. First, bind the finance role to the team administrator. When attempting to add a team administrator, a message will appear indicating that the role cannot be selected due to the constraint limit of the role.

![](https://cdn.masastack.com/stack/doc/auth/team-add-role-limit-01.png)

After adding the team administrator, attempting to bind the finance role to the team administrator will display a message indicating that the role cannot be selected due to the binding limit.

![](https://cdn.masastack.com/stack/doc/auth/team-add-role-limit-02.png)

4. Edit the finance role on the role page and set the binding limit to 1. A message will appear indicating that the binding limit cannot be less than 2.

![](https://cdn.masastack.com/stack/doc/auth/role-edit-limit.png)