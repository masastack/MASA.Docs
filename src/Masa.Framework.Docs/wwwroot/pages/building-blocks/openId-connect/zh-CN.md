# 身份认证

## 概念

用于 OIDC 基础数据的存储和读取

## 使用

1. 安装 `Masa.Contrib.Authentication.OpenIdConnect.EFCore`

   ```shell 终端
   dotnet add package Masa.Contrib.Authentication.OpenIdConnect.EFCore
   ```

2. 注册OidcDbContext, 修改

   ```csharp Program.cs
   builder.Services.AddOidcDbContext<BusinessDbContext>();
   ```

   > `BusinessDbContext`是使用者自己业务使用的 EFCore 的[DbContext](https://learn.microsoft.com/en-us/dotnet/api/microsoft.entityframeworkcore.dbcontext?view=efcore-7.0)

   如果想在项目启动时自动创建标准规范的 OIDC 基础数据,使用以下代码

   ```csharp 
   await builder.Services.AddOidcDbContext<BusinessDbContext>(async option =>
   {
       await option.SeedStandardResourcesAsync();
   });
   ```
   
   > [标准规范的 OIDC 基础数据](https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims)包含用户申明和身份资源

3. 修改 `BusinessDbContext`, 重写基类 `DbContext` 的 `OnModelCreating` 方法

   ```csharp 
   protected override void OnModelCreating(ModelBuilder modelBuilder)
   {
       modelBuilder.ApplyConfigurationsFromAssembly(OpenIdConnectEFCore.Assembly);
   }
   ```

4. 读取和存储数据

   ```csharp 
   IClientRepository clientRepository;//从DI获取
   await _clientRepository.AddAsync(client);//添加客户端数据
   await _clientRepository.GetDetailAsync(clientId);//获取客户端数据
   IUserClaimRepository userClaim;//从DI获取
   await userClaim.AddStandardUserClaimsAsync();//批量创建标准规范的用户申明数据
   IIdentityResourceRepository identityResourcerepository;//从DI获取
   await identityResourcerepository.AddStandardIdentityResourcesAsync();//批量创建标准规范的身份资源数据
   ```

   > Masa.Contrib.Authentication.OpenIdConnect.EFCore提供了`IClientRepository`、`IIdentityResourceRepository`、`IApiResourceRepository`、`IApiScopeRepository`、`IUserClaimRepository`来维护OIDC的基础数据

## 高阶用法

### 数据库操作时同步更新多级缓存

1. 安装 `Masa.Contrib.Authentication.OpenIdConnect.Cache`

   ```shell 终端 
   dotnet add package Masa.Contrib.Authentication.OpenIdConnect.Cache
   ```

2. 注册OidcCache, 修改Program.cs

   ```csharp Program.cs
   builder.Services.AddOidcDbContext<BusinessDbContext>();
   builder.Services.AddOidcCache();
   ```

   > `AddOidcCache()` 默认使用本地 `RedisConfig` 节点的配置,详情参考[多级缓存](/framework/building-blocks/caching)。使用者可使用重载方法传入自定义的 redisOption。

### 使用多级缓存读取OIDC基础数据

1. 安装 `Masa.Contrib.Authentication.OpenIdConnect.Cache.Storage`

   ```shell 终端 
   dotnet add package Masa.Contrib.Authentication.OpenIdConnect.Cache.Storage
   ```

2. 注册 `OidcCacheStorage`

   ```csharp Program.cs
   builder.Services.AddOidcCacheStorage();
   ```

   > `AddOidcCacheStorage()`默认使用本地`RedisConfig`节点的配置,详情参考[多级缓存](/framework/building-blocks/caching)。使用者可使用重载方法传入自定义的redisOption。

3. 读取数据

   ```csharp 
   IMasaOidcClientStore _masaOidcClientStore;//从DI获取
   await _masaOidcClientStore.FindClientByIdAsync(clientId);//获取客户端数据
   await _masaOidcResourceStore.GetAllResourcesAsync();//获取所有资源数据
   ```
   
   > Masa.Contrib.Authentication.OpenIdConnect.Cache.Storage提供了`IMasaOidcClientStore`、`IResourceStore`来获取OIDC的基础数据