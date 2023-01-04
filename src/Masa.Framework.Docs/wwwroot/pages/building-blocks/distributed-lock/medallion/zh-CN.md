## 概念

基于[DistributedLock](https://github.com/madelson/DistributedLock)的一个分布式锁，核心能力由`Masa.Contrib.Data.DistributedLock.Medallion`提供, 但我们在使用时必须选择一个提供者

* [Azure](#medallion-azure)
* [FileSystem](#medallion-file-system)
* [MySql](#medallion-mysql)
* [Oracle](#medallion-oracle)
* [PostgreSql](#medallion-postgre-sql)
* [Redis](#medallion-redis)
* [SqlServer](#medallion-sql-server)
* [WaitHandles](#medallion-wait-handles)
* [ZooKeeper](#medallion-zoo-keeper)

## 使用

不同的提供者在分布式锁的使用上是一样的, 唯一不同的是锁依赖的包以及注册方式略有差别

### medallion-azure

1. 安装`Masa.Contrib.Data.DistributedLock.Medallion.Azure`

``` powershell
dotnet add package Masa.Contrib.Data.DistributedLock.Medallion.Azure
```

2. 修改类`Program`

```csharp
builder.Services.AddDistributedLock(medallionBuilder => medallionBuilder.UseAzure("Replace Your connectionString", "Replace your blobContainerName"));
```

### medallion-file-system

1. 安装`Masa.Contrib.Data.DistributedLock.Medallion.FileSystem`

``` powershell
dotnet add package Masa.Contrib.Data.DistributedLock.Medallion.FileSystem
```

2. 修改类`Program`

```csharp
builder.Services.AddDistributedLock(medallionBuilder => medallionBuilder.UseFileSystem("Replace your directory path"));
```

### medallion-mysql

1. 安装`Masa.Contrib.Data.DistributedLock.Medallion.MySql`

``` powershell
dotnet add package Masa.Contrib.Data.DistributedLock.Medallion.MySql
```

2. 修改类`Program`

```csharp
builder.Services.AddDistributedLock(medallionBuilder => medallionBuilder.UseMySQL("Server=localhost;Database=identity;Uid=myUsername;Pwd=P@ssw0rd"));
```

### medallion-oracle

1. 安装`Masa.Contrib.Data.DistributedLock.Medallion.Oracle`

``` powershell
dotnet add package Masa.Contrib.Data.DistributedLock.Medallion.Oracle
```

2. 修改类`Program`

```csharp
builder.Services.AddDistributedLock(medallionBuilder => medallionBuilder.UseOracle("Data Source=MyOracleDB;Integrated Security=yes;"));
```

### medallion-postgre-sql

1. 安装`Masa.Contrib.Data.DistributedLock.Medallion.PostgreSql`

``` powershell
dotnet add package Masa.Contrib.Data.DistributedLock.Medallion.PostgreSql
```

2. 修改类`Program`

```csharp
builder.Services.AddDistributedLock(medallionBuilder => medallionBuilder.UseNpgsql("Host=myserver;Username=sa;Password=P@ssw0rd;Database=identity"));
```

### medallion-redis

1. 安装`Masa.Contrib.Data.DistributedLock.Medallion.Redis`

``` powershell
dotnet add package Masa.Contrib.Data.DistributedLock.Medallion.Redis
```

2. 修改类`Program`

```csharp
builder.Services.AddDistributedLock(medallionBuilder => medallionBuilder.UseRedis("127.0.0.1:6379"));
```

### medallion-sql-server

1. 安装`Masa.Contrib.Data.DistributedLock.Medallion.SqlServer`

``` powershell
dotnet add package Masa.Contrib.Data.DistributedLock.Medallion.SqlServer
```

2. 修改类`Program`

```csharp
builder.Services.AddDistributedLock(medallionBuilder => medallionBuilder.UseSqlServer("server=localhost;uid=sa;pwd=P@ssw0rd;database=identity"));
```

### medallion-wait-handles

1. 安装`Masa.Contrib.Data.DistributedLock.Medallion.WaitHandles`

``` powershell
dotnet add package Masa.Contrib.Data.DistributedLock.Medallion.WaitHandles
```

2. 修改类`Program`

```csharp
builder.Services.AddDistributedLock(medallionBuilder => medallionBuilder.UseSqlServer("server=localhost;uid=sa;pwd=P@ssw0rd;database=identity"));
```

### medallion-zoo-keeper

1. 安装`Masa.Contrib.Data.DistributedLock.Medallion.ZooKeeper`

``` powershell
dotnet add package Masa.Contrib.Data.DistributedLock.Medallion.ZooKeeper
```

2. 修改类`Program`

```csharp
builder.Services.AddDistributedLock(medallionBuilder => medallionBuilder.UseZooKeeper("Replace your ZooKeeper connectionString"));
```