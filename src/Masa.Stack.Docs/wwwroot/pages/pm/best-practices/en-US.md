e-guide)。
4. 在应用中使用 `Auth` 的 SDK 进行权限验证，可参考 `Auth` 的 [SDK 示例](stack/auth/sdk-instance)。

通过以上步骤，即可完成 PM 和 Auth 的结合使用，最终实现应用的权限控制功能。

# Best Practices

## Implementing Remote Configuration Retrieval for Applications

Use `MASA.PM` + `MASA.DCC` to implement remote configuration retrieval for applications.

[MASA.DCC](/stack/dcc/introduce) is a distributed configuration center. Its basic data (environment, cluster, project, application) is obtained from `MASA.PM` for application configuration management.

The implementation steps are as follows:

1. Create the required environment, cluster, project, and application information in `PM`. Refer to the [PM User Guide](stack/pm/get-started) for details.
2. `DCC` obtains the created environment, cluster, project, and application information through the SDK of `PM`. Refer to the [SDK example](stack/pm/sdk-instance) of `PM` for details.
3. Write the corresponding configuration for the application in `DCC`. Refer to the [DCC User Guide](stack/dcc/get-started) for details.
4. Use the SDK of `DCC` to obtain the written configuration. Refer to the [SDK example](stack/dcc/sdk-instance) of `DCC` for details.

By following the above steps, the combination of PM and DCC can be completed, and the function of remote configuration retrieval for applications can be ultimately achieved.

## Implementing Application Access Control

Use `MASA.PM` + `MASA.Auth` to implement application access control.

[MASA.Auth](stack/auth/introduce) is an access control center. The basic data (application) of the access module is obtained from `MASA.PM`, and then the application is managed for access control.

The implementation steps are as follows:

1. Create the required application information in `PM`. Refer to the [PM User Guide](stack/pm/get-started) for details.
2. `Auth` obtains the created application information through the SDK of `PM`. Refer to the [SDK example](stack/pm/sdk-instance) of `PM` for details.
3. Allocate permissions in `Auth`: assign permissions to roles, and then assign corresponding roles to users. Refer to the [Auth User Guide](stack/auth/use-guide) for details.
4. Use the SDK of `Auth` to verify permissions in the application. Refer to the [SDK example](stack/auth/sdk-instance) of `Auth` for details.

By following the above steps, the combination of PM and Auth can be completed, and the function of application access control can be ultimately achieved.1. The system uses a permission control mechanism to manage user access to pages and interfaces.
2. Each page or interface has a corresponding permission code.
3. The permission code is assigned to the user through the e-guide/permission system.
4. After logging into the system through the unified authentication of `Auth`, the permission information will be returned to the client.
5. The client compares the returned permission information to achieve page or interface permission control.