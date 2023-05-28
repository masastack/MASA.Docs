# Internationalization - Distributed Configuration Capability (DCC)

## Overview

`I18n` enables programs to support multiple languages, but it must be configured in local configuration files, which has certain limitations and is not very friendly for managing resource files in the later stage. MASA Framework provides the implementation of [`Distributed Configuration Center-DCC`](/stack/dcc/introduce), through which we can configure the content of multi-language resources on `DCC`, and manage resource files in the later stage on the interface of `DCC`. Moreover, it supports hot updates.

## Usage

1. Take `ASP.NET Core` project as an example, install `Masa.Contrib.Globalization.I18n.AspNetCore` and `Masa.Contrib.Globalization.I18n.Dcc`.

   ```shell terminal
   dotnet add package Masa.Contrib.Globalization.I18n.AspNetCore
   dotnet add package Masa.Contrib.Globalization.I18n.Dcc
   ```

   > Masa.Contrib.Globalization.I18n.AspNetCore: provides the ability to parse and set the current thread's culture through middleware.
   >
   > Masa.Contrib.Globalization.I18n.Dcc: provides the ability for I18n to configure remotely.

2. Configure multi-language configuration information in [Dcc](/stack/dcc/introduce).

   * en-US.json

     ![image-20230425200421281](https://cdn.masastack.com/framework/202304252004352.png)

   * zh-CN.json

     ![image-20230425200558437](https://cdn.masastack.com/framework/202304252005484.pn3. Install [MasaConfiguration and use DCC](/framework/building-blocks/configuration/dcc)

   ```shell terminal
   dotnet add package Masa.Contrib.Configuration
   dotnet add package Masa.Contrib.Configuration.ConfigurationApi.Dcc
   ```

4. Configure the required information for DCC

   ```json appsettings.json
   {
     "DccOptions": {
       "ManageServiceAddress": "{Replace-Your-DccServiceAddress}",
       "AppId": "{Replace-Your-AppId}",
       "Environment": "{Replace-Your-Environment}",
       "Cluster": "{Replace-Your-Cluster}",
       "RedisOptions": 
       {
         "Servers":[
           {
             "Host": "localhost",
             "Port": 6379
           }
         ],
         "DefaultDatabase": 0,
         "Password": ""
       }
     }
   }
   
   ```

   > Redis Address: The Redis cache service address that stores DCC configuration information.

5. Configure supported languages

   ```json Resources/I18n/supportedCultures.json
   [
     {
     样的 `AppId`，并读取名称为 `Culture.zh-CN` 的配置对象，如果当前请求的语言为英文，则会自动切换到 `Culture.en-US` 的配置对象。在代码中，我们可以通过 `I18n.T` 方法来获取对应语言的翻译文本，而不需要手动判断当前语言并获取对应的文本。The values of the two configuration objects, `Culture.zh-CN` and `Culture.en-Us`, under the default `AppId` can be modified correspondingly if resource management is needed. There is no need to restart the application because they support hot updates. For more information on how to manage objects, please refer to [/stack/dcc/use-guide#section-914d7f6e5bf98c617ba17406](/stack/dcc/use-guide#section-914d7f6e5bf98c617ba17406).