iew void OnModelCreating(ModelBuilder modelBuilder)
   {
       base.OnModelCreating(modelBuilder);
       modelBuilder.ConfigureOidcContext();
   }
   ```

4. 在需要使用身份认证的控制器中添加 `[Authorize]` 属性，例如：

   ```csharp 
   [Authorize]
   public class HomeController : Controller
   {
       // ...
   }
   ```

## 注意事项

- 本身份认证库依赖于 `Microsoft.AspNetCore.Authentication.JwtBearer`，请确保已经安装该包。
- 如果需要自定义 OIDC 基础数据，请参考 `Masa.Contrib.Authentication.OpenIdConnect.EFCore` 中的 `OidcDbContext` 和 `OidcConfiguration` 类。ResourceRepository`和`IUserClaimRepository`等接口，用于读取和存储OpenID Connect和OAuth 2.0相关的数据。在使用这些接口时，我们可以通过依赖注入获取相应的实例，然后调用相应的方法进行数据的读取和存储。例如，我们可以通过`clientRepository`实例调用`AddAsync`方法来添加客户端数据，通过`GetDetailAsync`方法来获取客户端数据。同样地，我们也可以通过`userClaim`实例调用`AddStandardUserClaimsAsync`方法来批量创建标准的用户声明数据，通过`identityResourcerepository`实例调用`AddStandardIdentityResourcesAsync`方法来批量创建标准的身份资源数据。framework/building-blocks/caching)。使用者可使用重载方法传入自定义的 `redisOption`。

3. 在需要使用 OIDC 基础数据的地方注入 `IOidcCacheStorage`，并使用其中的方法获取数据。例如：

   ```csharp
   public class MyService
   {
       private readonly IOidcCacheStorage _oidcCacheStorage;

       public MyService(IOidcCacheStorage oidcCacheStorage)
       {
           _oidcCacheStorage = oidcCacheStorage;
       }

       public async Task<MyData> GetDataAsync(string key)
       {
           var data = await _oidcCacheStorage.GetAsync<MyData>(key);
           if (data == null)
           {
               // 从其他数据源获取数据
               data = await GetDataFromOtherSourceAsync(key);

               // 将数据写入缓存
               await _oidcCacheStorage.SetAsync(key, data);
           }

           return data;
       }
   }
   ```

   > `IOidcCacheStorage` 中提供了一系列的异步方法，包括 `GetAsync`、`SetAsync`、`RemoveAsync` 等，使用者可根据需要选择使用。3. Reading Data

   ```csharp 
   IMasaOidcClientStore _masaOidcClientStore;//Get from DI
   await _masaOidcClientStore.FindClientByIdAsync(clientId);//Retrieve client data
   await _masaOidcResourceStore.GetAllResourcesAsync();//Retrieve all resource data
   ```
   
   > Masa.Contrib.Authentication.OpenIdConnect.Cache.Storage provides `IMasaOidcClientStore` and `IResourceStore` to retrieve basic `OIDC` data.