---
title: 存储 - 阿里云Oss
date: 2022/07/01
---

## 入门

1. 安装`Masa.Contrib.Storage.ObjectStorage.Aliyun`

``` shell
dotnet add package Masa.Contrib.Storage.ObjectStorage.Aliyun
```

2. 使用阿里云Oss存储

``` C#
builder.Services.AddAliyunStorage();

#region 或者通过代码指定传入阿里云存储配置信息使用，无需使用配置文件
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
//         EarlyExpires = 10
//     }
// }, "storage1-test");
#endregion
```

3. 新增阿里云配置，修改`appsettings.json`

``` appsettings.json
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
        "DefaultBucketName" : "storage1-test"//默认BucketName，非必填项，仅在使用IClientContainer时需要指定
      }
    }
  }
}
```