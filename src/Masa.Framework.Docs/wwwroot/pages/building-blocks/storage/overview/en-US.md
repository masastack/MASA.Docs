# Storage - Overview

In our work, we often need to store file contents (files or binary streams) in our applications, such as saving cover images for products. MASA Framework provides object storage for this purpose and abstracts the functionality, which brings us the following benefits:

* Storage independence (we don't care whether the storage platform is Alibaba Cloud OSS or Tencent Cloud COS)
* Lower cost of changing storage platforms (just need to change the storage provider, with low business impact)
* Support for custom storage providers

## Best Practices

* [Alibaba Cloud](/framework/building-blocks/storage/aliyun-oss): Data is stored in [Alibaba Cloud OSS](https://www.aliyun.com/product/oss)

We will gradually provide support for more cloud storage platforms. If you have a favorite cloud storage platform, please feel free to suggest it or implement it yourself and contribute to the MASA Framework.

## Capabilities

| Provider                                                | Sts  |  Token  | Get File Stream | Get File Stream in Specified Region | Upload File | Check File Existence | Delete File | Batch Delete Files |
|:---------------------------------------------------| :----: |:----: |:----: |:----: |:----: |:----: |:----: |:----: |
| [Alibaba Cloud OSS](/framework/contribs/support-storage/oss) | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

## Source Code Analysis

### Storage Client IClient

This is the main interface for storing and reading objects, and can be accessed anywhere in the project through `D`The `IClient` can be obtained to upload, download, or delete objects under a specified `BucketName`, and can also be used to determine whether an object exists, obtain temporary credentials, and more.

* PutObjectAsync: Upload an object.
* DeleteObjectAsync: Delete an object.
* ObjectExistsAsync: Check if an object exists.
* GetObjectAsync: Return the stream of an object's data.
* GetSecurityToken: Obtain temporary credentials (STS).
* GetToken: Obtain temporary credentials (string type).

### BucketName Provider IBucketNameProvider

This is an interface used to obtain the `BucketName`. Through `IBucketNameProvider`, the `BucketName` of a specified storage space can be obtained, providing the ability to specify the `BucketName` for `IClientContainer`. This is not used in business projects.

### Storage Client Container IClientContainer

This is the object storage container used to store and read objects. In an application, there may be multiple `BucketName`s to manage. By using `IClientContainer`, objects of different `Bucket`s can be managed like managing `DbContext`, without the need to frequently specify the `BucketName` in the project. In the same application, there is only one default `ClientContainer`, which can be obtained through `DI` to use `IClientContainer`.

* PutObjectAsync: Upload an object.
* DeleteObjectAsync: Delete an object.
* ObjectExistsAsync: Check if an object exists.
* GetObjectAsync: Return the stream of an object's data.
* GetSecurityToken: Obtain temporary credentials (STS).
* GetToken: Obtain temporary credentials (string type).

> The biggest difference from `IClient` is that there is no need to specify the `Bucket`.

### Storage Client Factory

`IClientFactory` is the object storage provider factory.Create the specified `IClientContainer` by specifying the `BucketName`.