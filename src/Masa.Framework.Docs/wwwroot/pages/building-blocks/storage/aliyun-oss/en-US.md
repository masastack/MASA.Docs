# Storage - Aliyun OSS

## Overview

Object storage based on [Aliyun OSS](https://www.aliyun.com/product/oss)

## Usage

1. Install `Masa.Contrib.Storage.ObjectStorage.Aliyun`

   ```shell Terminal
   dotnet add package Masa.Contrib.Storage.ObjectStorage.Aliyun
   ```

2. Register Aliyun Oss storage

   ```csharp Program.cs
   builder.Services.AddAliyunStorage();
   
   #region Or specify the Aliyun storage configuration information through code, without using configuration files
   // builder.Services.AddAliyunStorage(new AliyunStorageOptions()
   // {
   //     AccessKeyId = "Replace-With-Your-AccessKeyId",
   //     AccessKeySecret = "Replace-With-Your-AccessKeySecret",
   //     Endpoint = "Replace-With-Your-Endpoint",
   //     RoleArn = "Replace-With-Your-RoleArn",
   //     RoleSessionName = "Replace-With-Your-RoleSessionName",
   //     Sts = new AliyunStsOptions()
   //     {
   //         RegionId = "Replace-With-Your-Sts-RegionId",
   //         DurationSeconds = 3600,
   //    ```1. Introduction

This document provides instructions on how to upload files to Aliyun using the Aliyun SDK. The SDK supports multiple programming languages, including C#, Java, Python, and more. In this tutorial, we will focus on C#.

2. Configuration

Before uploading files, you need to configure the Aliyun SDK in your C# project. You can do this by adding the following code to your appsettings.json file:

```json appsettings.json
{
  "Aliyun": {
    "AccessKeyId": "Replace-With-Your-AccessKeyId",
    "AccessKeySecret": "Replace-With-Your-AccessKeySecret",
    "Sts": {
      "RegionId": "Replace-With-Your-Sts-RegionId",
      "DurationSeconds": 3600,
      "EarlyExpires": 10
    },
    "Storage": {
      "Endpoint": "Replace-With-Your-Endpoint",
      "RoleArn": "Replace-With-Your-RoleArn",
      "RoleSessionName": "Replace-With-Your-RoleSessionName",
      "TemporaryCredentialsCacheKey": "Aliyun.Storage.TemporaryCredentials",
      "Policy": "",
      "BucketNames" : {
        "DefaultBucketName" : "storage1-test"//DefaultBucketName is optional and only required when using IClientContainer
      }
    }
  }
}
```

3. Uploading Files

Once you have configured the Aliyun SDK, you can start uploading files. Here is an example of how to upload a file:

```csharp
using Aliyun.OSS;
using Microsoft.Extensions.Configuration;
using System;
using System.IO;

namespace AliyunUploadDemo
{
    class Program
    {
        static void Main(string[] args)
        {
            var configuration = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json")
                .Build();

            var accessKeyId = configuration["Aliyun:AccessKeyId"];
            var accessKeySecret = configuration["Aliyun:AccessKeySecret"];
            var endpoint = configuration["Aliyun:Storage:Endpoint"];
            var bucketName = configuration["Aliyun:Storage:BucketNames:DefaultBucketName"];

            var client = new OssClient(endpoint, accessKeyId, accessKeySecret);

            var objectName = "example.txt";
            var content = "Hello, Aliyun!";

            using (var stream = new MemoryStream(System.Text.Encoding.UTF8.GetBytes(content)))
            {
                client.PutObject(bucketName, objectName, stream);
            }

            Console.WriteLine($"File {objectName} uploaded successfully!");
        }
    }
}
```

In this example, we first read the configuration from the appsettings.json file. We then create an instance of the OssClient class and use it to upload a file to Aliyun. Finally, we print a message to the console to indicate that the file was uploaded successfully.

Conclusion

In this tutorial, we have shown you how to upload files to Aliyun using the Aliyun SDK in C#. We hope you found this tutorial helpful. If you have any questions or comments, please feel free to leave them below.rst，上传文件到默认的 Bucket。

## Other Examples

### Storage Client IClient

#### Upload Object

```csharp
app.MapPost("/upload", async (HttpRequest request, IClient client) =>
{
    var form = await request.ReadFormAsync();
    var formFile = form.Files["file"];
    if (formFile == null)
        throw new FileNotFoundException("Can't upload empty file");

    await client.PutObjectAsync("storage1-test", formFile.FileName, formFile.OpenReadStream());
});
``` 

> Upload a file to the default Bucket using a form with the key "file".//将文件流写入本地文件
            fs.Write(buf, 0, len);
        }
        fs.Close();
    });
});
```("picture", "video");
});

app.MapPost("/upload", async (HttpRequest request, IClientContainer<PictureContainer> clientContainer) =>
{
    var form = await request.ReadFormAsync();
    var formFile = form.Files["file"];
    if (formFile == null)
        throw new FileNotFoundException("Can't upload empty file");

    await clientContainer.PutObjectAsync(formFile.FileName, formFile.OpenReadStream());
});
```

#### 下载文件

```csharp
app.MapGet("/download", async (IClientContainer clientContainer) =>
{
    var stream = await clientContainer.GetObjectAsync("example.txt");
    return new FileStreamResult(stream, "text/plain");
});
```

#### 删除文件

```csharp
app.MapDelete("/delete", async (IClientContainer clientContainer) =>
{
    await clientContainer.DeleteObjectAsync("example.txt");
});
```

#### 列举文件

```csharp
app.MapGet("/list", async (IClientContainer clientContainer) =>
{
    var objects = await clientContainer.ListObjectsAsync();
    return objects.Select(obj => obj.Key);
});
```The following code initializes a new instance of BucketNames with a list of key-value pairs, where each key represents an alias for a specific bucket name. The first key-value pair sets the default bucket name as "storage1-test", while the second key-value pair sets the bucket name for the alias "picture" as "storage1-picture". 

In the second part of the code, a POST request is mapped to the "/upload" endpoint. The request is processed asynchronously, and the form data is read using the ReadFormAsync method. The file data is retrieved from the form using the "file" key. If the file is empty, a FileNotFoundException is thrown. Otherwise, the file is uploaded to the specified bucket using the PutObjectAsync method of the clientContainer object. The file name is used as the object key.