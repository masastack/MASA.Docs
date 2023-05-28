# Swagger

**Swagger** can be regarded as an interface document used to browse the interfaces of `Auth`. **MASA Auth** has specifically implemented security authentication for **Swagger**, and only logged-in users can perform interface operations on the **Swagger** page.

## Unauthorized 401 error will be reported when executing interfaces without logging in

![Swagger 401 Unauthorized Image](https://cdn.masastack.com/stack/doc/auth/develop-guide/swagger-401.png)

## Complete login authentication

Click the `Authorize` button on the **Swagger** page to open the authentication popup.

![Swagger Authorize Authentication Image](https://cdn.masastack.com/stack/doc/auth/develop-guide/swagger-authorize-button.png)

![Swagger Authorize Login Authentication Image](https://cdn.masastack.com/stack/doc/auth/develop-guide/swagger-authorize.png)

After entering the account and password for authentication, the page will display as follows.

![Swagger Authorize Authentication Success Image](https://cdn.masastack.com/stack/doc/auth/develop-guide/swagger-authorize-success.png)

After completing the authentication, call the `api/user/Select` interface, and it will return 200.

![Swagger Get User Information Image](https://cdn.masastack.com/stack/doc/auth/develop-guide/swagger-200.png)