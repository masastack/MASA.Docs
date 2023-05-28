xt`

* TenantId：获取当前租户 ID
* GetTenantId：获取指定类型的租户 ID
* Environment：获得当前环境
* IsolatedUser：获取当前用户信息，包括用户 ID、用户名称、用户权限集合、租户 ID、环境信息

### 设置用户身份

#### IUserAccessor

设置当前用户身份

* SetUser：设置当前用户身份

#### IMultiTenantUserAccessor

设置多租户用户身份，继承 `IUserAccessor`

* SetTenantId：设置当前租户 ID

#### IMultiEnvironmentUserAccessor

设置多环境用户身份，继承 `IUserAccessor`

* SetEnvironment：设置当前环境

#### IIsolatedUserAccessor

设置多租户用户身份以及环境信息，继承 `IMultiTenantUserAccessor`、`IMultiEnvironmentUserAccessor`

* SetIsolatedUser：设置当前用户身份，包括用户 ID、用户名称、用户权限集合、租户 ID、环境信息xt`

### Setting User Information

#### IUserSetter

Set the current user information.

* Change: Supports temporarily changing user information, which will be restored when released.