---
title: 存储
date: 2022/07/01
---

## 概念

在工作中，我们经常需要将文件内容（文件或二进制流）存储在应用程序中，例如你可能要保存商品的封面图片。Masa框架为此提供了对象存储的功能，并对功能抽象，抽象给我们带来的好处:

* 存储的无关性（不关心存储平台时阿里云OSS还是腾讯云的COS）
* 更换存储平台成本更低（仅需要更改下存储的提供者，业务侵染低）
* 支持自定义存储提供者

目前存储的提供者有:

* [阿里云](/framework/contribs/support-storage/oss): 数据存储在[阿里云Oss](https://www.aliyun.com/product/oss)

后续将逐步提供更多的云存储平台支持，如果您有喜欢的其它云存储平台，欢迎提[建议](https://github.com/masastack/MASA.Contrib/issues/new)，或者自己实现它并为Masa框架做出[贡献](https://github.com/masastack/MASA.Contrib/compare)

## 源码解读

### 存储客户端

`IClient`是用来存储和读取对象的主要接口，可以在项目的任意地方通过DI获取到`IClient`来上传、下载或删除指定`BucketName`下的对象，也可用于判断对象是否存在，获取临时凭证等。

1. 上传对象

    ``` C#
    app.MapPost("/upload", async (HttpRequest request, IClient client) =>
    {
        var form = await request.ReadFormAsync();
        var formFile = form.Files["file"];
        if (formFile == null)
            throw new FileNotFoundException("Can't upload empty file");
    
        await client.PutObjectAsync("storage1-test", formFile.FileName, formFile.OpenReadStream());
    });
    ``` 

    > Form表单提交，key为file，类型为文件上传

2. 删除对象

    ``` C#
    public class DeleteRequest
    {
        public string Key { get; set; }
    }
    
    app.MapDelete("/delete", async (IClient client, [FromBody] DeleteRequest request) =>
    {
        await client.DeleteObjectAsync("storage1-test", request.Key);
    });
    ```

3. 判断对象是否存在

    ``` C#
    app.MapGet("/exist", async (IClient client, string key) =>
    {
        await client.ObjectExistsAsync("storage1-test", key);
    });
    ```

4. 返回对象数据的流

    ``` C#
    app.MapGet("/download", async (IClient client, string key, string path) =>
    {
        await client.GetObjectAsync("storage1-test", key, stream =>
        {
            //下载文件到指定路径
            using var requestStream = stream;
            byte[] buf = new byte[1024];
            var fs = File.Open(path, FileMode.OpenOrCreate);
            int len;
            while ((len = requestStream.Read(buf, 0, 1024)) != 0)
            {
                fs.Write(buf, 0, len);
            }
            fs.Close();
        });
    });
    ```

5. 获取临时凭证(STS)

    ``` C#
    app.MapGet("/GetSts", (IClient client) =>
    {
        client.GetSecurityToken();
    });
    ```

    > [阿里云](https://www.aliyun.com/product/oss)、[腾讯云存储](https://cloud.tencent.com/document/product/436)等平台使用STS来获取临时凭证

6. 获取临时凭证(字符串类型的临时凭证)

    ``` C#
    app.MapGet("/GetToken", (IClient client) =>
    {
        client.GetToken();
    });
    ```

    > [七牛云](https://www.qiniu.com/products/kodo)等存储平台使用较多

### 存储空间提供者

`IBucketNameProvider`是用来获取BucketName的接口，通过`IBucketNameProvider`可以获取指定存储空间的BucketName，为`IClientContainer`提供BucketName能力，在业务项目中不会使用到

### 存储客户端容器

`IClientContainer`对象存储容器，用来存储和读取对象的主要接口，一个应用程序下可能会存在管理多个BucketName，通过使用`IClientContainer`，像管理`DbContext`一样管理不同`Bucket`的对象，不需要在项目中频繁指定`BucketName`，在同一个应用程序中，有且只有一个默认ClientContainer，可以通过DI获取`IClientContainer`来使用，例如：

* 上传对象（上传到默认`Bucket`）

    ``` C#
    app.MapPost("/upload", async (HttpRequest request, IClientContainer clientContainer) =>
    {
        var form = await request.ReadFormAsync();
        var formFile = form.Files["file"];
        if (formFile == null)
            throw new FileNotFoundException("Can't upload empty file");
    
        await clientContainer.PutObjectAsync(formFile.FileName, formFile.OpenReadStream());
    });
    ``` 

* 上传到指定`Bucket`

    ``` C#
    [BucketName("picture")]
    public class PictureContainer
    {

    }

    builder.Services.Configure<StorageOptions>(option =>
    {
        option.BucketNames = new BucketNames(new List<KeyValuePair<string, string>>()
        {
            new("DefaultBucketName", "storage1-test"),//默认BucketName
            new("picture", "storage1-picture")//指定别名为picture的BucketName为storage1-picture
        });
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

### 存储客户端工厂

`IClientFactory`对象存储提供者工厂，通过指定`BucketName`，创建指定的IClientContainer

## 其它

暂不支持隔离性