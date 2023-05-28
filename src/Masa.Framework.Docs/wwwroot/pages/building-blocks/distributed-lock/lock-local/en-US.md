# Distributed Lock - Local

## Overview

This is a local lock based on `SemaphoreSlim`. It is recommended to use it within a single application.

## Usage

1. Install `Masa.Contrib.Data.DistributedLock.Local`

   ```shell
   dotnet add package Masa.Contrib.Data.DistributedLock.Local
   ```

2. Register the lock and modify the `Program` class

   ```csharp
   var builder = WebApplication.CreateBuilder(args);
   builder.Services.AddLocalDistributedLock();
   ```

3. Use the lock

   ```csharp
   IDistributedLock distributedLock; // Get `IDistributedLock` from DI
   using (var lockObj = distributedLock.TryGet("Replace Your Lock Name"))
   {
       if (lockObj != null)
       {
           // todo: Code to be executed after obtaining the distributed lock
       }
   }
   ```