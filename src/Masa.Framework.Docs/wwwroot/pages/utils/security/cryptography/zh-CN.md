## 安全 - 密码

提供常见的密码加密和解密的能力, 安装`Masa.Utils.Security.Cryptography`即可

## 功能

* [Aes加解密](#Aes帮助类)
* [Base64编码解码](#Base64编码解码)
* [Des加解密](#Des加解密)
* [Md5加密](#Md5加密)
* [Sha系列加密](#Sha系列加密)
* [全局配置](#全局配置)

## 源码解读

> `encoding`为编码格式, 默认`UTF-8`

### Aes帮助类

* 默认秘钥: 默认: `masastack.com                   ` [如何修改](#GlobalConfiguration)
* 默认偏移量: 16位 默认: `AreyoumySnowman?` [如何修改](#GlobalConfiguration)
* 默认秘钥长度: `GlobalConfigurationUtils.DefaultAesEncryptKeyLength` (默认32位, 仅支持16、24、32)
* 未指定秘钥时将使用默认秘钥
* 未指定偏移量时将使用默认偏移量

> 默认秘钥与偏移量未设置内容长度, 如果默认秘钥、偏移量长度不足的将会自动补齐, 长度超出则会被截断

#### 加密

* Encrypt(string content, char fillCharacter = ' ', Encoding? encoding = null): 根据输入的内容进行AES加密, 位数不够的在结尾以`fillCharacter` (默认空) 填充
* Encrypt(string content, string key, FillType fillType = FillType.NoFile, char fillCharacter = ' ', Encoding? encoding = null): 根据传入秘钥将输入的内容进行AES加密, 秘钥位数不够的将以`fillCharacter` (默认空) 填充, 位数超出的将会被截断
* Encrypt(string content, string key, string iv, FillType fillType = FillType.NoFile, char fillCharacter = ' ', Encoding? encoding = null): 根据传入秘钥以及偏移量将输入的内容进行AES加密, 秘钥或者偏移量位数不够的将以`fillCharacter` (默认空) 填充, 位数超出的将会被截断
* Encrypt(string content, string key, byte[] ivBuffer, FillType fillType = FillType.NoFile, char fillCharacter = ' ', Encoding? encoding = null): 根据传入秘钥以及偏移量将输入的内容进行AES加密, 秘钥或者偏移量位数不够的将以`fillCharacter` (默认空) 填充, 位数超出的将会被截断
* EncryptToBytes(byte[] dataBuffers, byte[] keyBuffer, byte[] ivBuffer): 根据传入的秘钥、偏移量将传入的数据字节数组进行加密并返回加密字节数组
* EncryptToBytes(Stream stream, string key, FillType fillType = FillType.NoFile, char fillCharacter = ' ', Encoding? encoding = null): 根据传入的秘钥将传入的数据流进行加密并返回加密字节数组
* EncryptToBytes(Stream stream, string key, string iv, FillType fillType = FillType.NoFile, char fillCharacter = ' ', Encoding? encoding = null): 根据传入的秘钥、偏移量将传入的数据流进行加密并返回加密字节数组
* EncryptToBytes(Stream stream, string key, byte[] ivBuffer, FillType fillType = FillType.NoFile, char fillCharacter = ' ', Encoding? encoding = null): 根据传入的秘钥、偏移量将传入的数据流进行加密并返回加密字节数组
* EncryptToBytes(Stream stream, byte[] keyBuffer, byte[] ivBuffer): 根据传入的秘钥、偏移量将传入的数据流进行加密并返回加密字节数组
* EncryptFile(Stream stream, string outputPath, char fillCharacter = ' ', Encoding? encoding = null): 将指定文件流加密并将加密后的文件输出到指定目录
* EncryptFile(Stream stream, string key, string outputPath, FillType fillType = FillType.NoFile, char fillCharacter = ' ', Encoding? encoding = null): 根据传入的秘钥将指定文件流加密并将加密后的文件输出到指定目录
* EncryptFile(Stream stream, string key, byte[] ivBuffer, string outputPath, FillType fillType = FillType.NoFile, char fillCharacter = ' ', Encoding? encoding = null): 根据传入的秘钥以及偏移量将指定文件流加密并将加密后的文件输出到指定目录
* EncryptFile(Stream stream, string key, string iv, string outputPath, FillType fillType = FillType.NoFile, char fillCharacter = ' ', Encoding? encoding = null): 根据传入的秘钥以及偏移量将指定文件流加密并将加密后的文件输出到指定目录

#### 解密

* Decrypt(string content, char fillCharacter = ' ', Encoding? encoding = null): 根据输入的内容进行AES解密, 位数不够的在结尾以`fillCharacter` (默认空) 填充
* Decrypt(string content, string key, FillType fillType = FillType.NoFile, char fillCharacter = ' ', Encoding? encoding = null): 根据传入秘钥将输入的内容进行AES解密, 秘钥位数不够的将以`fillCharacter` (默认空) 填充, 位数超出的将会被截断
* Decrypt(string content, string key, string iv, FillType fillType = FillType.NoFile, char fillCharacter = ' ', Encoding? encoding = null): 根据传入秘钥以及偏移量将输入的内容进行AES解密, 秘钥或者偏移量位数不够的将以`fillCharacter` (默认空) 填充, 位数超出的将会被截断
* Decrypt(string content, string key, byte[] ivBuffer, FillType fillType = FillType.NoFile, char fillCharacter = ' ', Encoding? encoding = null): 根据传入秘钥以及偏移量将输入的内容进行AES解密, 秘钥位数不够的将以`fillCharacter` (默认空) 填充, 位数超出的将会被截断
* DecryptToBytes(byte[] dataBuffers, byte[] keyBuffer, byte[] ivBuffer): 根据传入的秘钥以及偏移量将内容字节数组解密, 并返回解密后的字节数组
* DecryptToBytes(Stream stream, string key, FillType fillType = FillType.NoFile, char fillCharacter = ' ', Encoding? encoding = null): 根据传入秘钥将指定流进行AES解密, 秘钥位数不够的将以`fillCharacter` (默认空) 填充, 位数超出的将会被截断, 并返回解密后的字节数组
* DecryptToBytes(Stream stream, string key, string iv, FillType fillType = FillType.NoFile, char fillCharacter = ' ', Encoding? encoding = null): 根据传入秘钥、偏移量将指定流进行AES解密, 秘钥或者偏移量位数不够的将以`fillCharacter` (默认空) 填充, 位数超出的将会被截断, 并返回解密后的字节数组
* DecryptToBytes(Stream stream, string key, byte[] ivBuffer, FillType fillType = FillType.NoFile, char fillCharacter = ' ', Encoding? encoding = null): 根据传入秘钥、偏移量将指定流进行AES解密, 秘钥位数不够的将以`fillCharacter` (默认空) 填充, 位数超出的将会被截断, 并返回解密后的字节数组
* DecryptToBytes(Stream stream, byte[] keyBuffer, byte[] ivBuffer): 根据传入秘钥、偏移量将指定流进行AES解密, 并返回解密后的字节数组
* DecryptFile(Stream stream, string outputPath, FillType fillType = FillType.NoFile, char fillCharacter = ' ', Encoding? encoding = null): 将指定流解密并将解密后的文件输出到指定目录
* DecryptFile(Stream stream, string key, string outputPath, FillType fillType = FillType.NoFile, char fillCharacter = ' ', Encoding? encoding = null): 根据传入的秘钥将指定流解密并将解密后的文件输出到指定目录
* DecryptFile(Stream stream, string key, byte[] ivBuffer, string outputPath, FillType fillType = FillType.NoFile, char fillCharacter = ' ', Encoding? encoding = null): 根据传入的秘钥以及偏移量将指定流解密并将解密后的文件输出到指定目录
* DecryptFile(Stream stream, string key, string iv, string outputPath, FillType fillType = FillType.NoFile, char fillCharacter = ' ', Encoding? encoding = null): 根据传入的秘钥以及偏移量将指定流解密并将解密后的文件输出到指定目录

### Base64编码解码

* Encrypt(string content, Encoding? encoding = null): 将字符串按照指定编码格式编码并返回编码后的结果 (默认编码格式: UTF8)
* Decrypt(string content, Encoding? encoding = null): 将待解密的字符串按照指定编码格式解码并返回解码后的结果 (默认编码格式: UTF8)

```csharp
var str = "Hello MASA Stack";
var encryptResult = Base64Utils.Encrypt(str);
```

### Des加解密

* 默认秘钥: `c7fac67c` (8位) [如何修改](#GlobalConfiguration)
* 默认偏移量: `c7fac67c` (8位) [如何修改](#GlobalConfiguration)
* 未指定秘钥时将使用默认秘钥
* 未指定偏移量时将使用默认偏移量

> 默认秘钥与偏移量未设置内容长度, 如果默认秘钥、偏移量长度不足的将会自动补齐, 长度超出则会被截断

* Encrypt(string content, DESEncryptType desEncryptType = DESEncryptType.Improved, bool isToLower = true, char fillCharacter = ' ', Encoding? encoding = null): 将输入的字符串进行DES加密, 并返回加密后的字符串
* Encrypt(string content, string key, DESEncryptType desEncryptType = DESEncryptType.Improved, bool isToLower = true, FillType fillType = FillType.NoFile, char fillCharacter = ' ', Encoding? encoding = null): 根据传入的秘钥将输入的字符串进行DES加密, 并返回加密后的字符串
* Encrypt(string content, string key, string iv, DESEncryptType desEncryptType = DESEncryptType.Improved, bool isToLower = true, FillType fillType = FillType.NoFile, char fillCharacter = ' ', Encoding? encoding = null)
* EncryptFile(FileStream fileStream, string key, string outFilePath, FillType fillType = FillType.NoFile, char fillCharacter = ' ', Encoding? encoding = null): 根据秘钥将指定文件流加密并输出到指定目录
* EncryptFile(FileStream fileStream, string key, string iv, string outFilePath, FillType fillType = FillType.NoFile, char fillCharacter = ' ', Encoding? encoding = null): 根据秘钥、偏移量将指定文件流加密并输出到指定目录
* EncryptFile(FileStream fileStream, string key, byte[] iv, string outFilePath, FillType fillType = FillType.NoFile, char fillCharacter = ' ', Encoding? encoding = null): 根据秘钥、偏移量字节数组将指定文件流加密并输出到指定目录

* Decrypt(string content, DESEncryptType desEncryptType = DESEncryptType.Improved, char fillCharacter = ' ', Encoding? encoding = null): 将待解密字符串进行解密并返回解密后的字符串
* Decrypt(string content, string key, DESEncryptType desEncryptType = DESEncryptType.Improved, FillType fillType = FillType.NoFile, char fillCharacter = ' ', Encoding? encoding = null): 根据传入的秘钥将待解密字符串进行解密并返回解密后的字符串
* Decrypt(string content, string key, string iv, DESEncryptType desEncryptType = DESEncryptType.Improved, FillType fillType = FillType.NoFile, char fillCharacter = ' ', Encoding? encoding = null): 根据传入的秘钥、偏移量将待解密字符串进行解密并返回解密后的字符串
* DecryptFile(FileStream fileStream, string key, string outFilePath, FillType fillType = FillType.NoFile, char fillCharacter = ' ', Encoding? encoding = null): 根据秘钥将指定文件流解密并输出到指定目录
* DecryptFile(FileStream fileStream, string key, string iv, string outFilePath, FillType fillType = FillType.NoFile, char fillCharacter = ' ', Encoding? encoding = null): 根据秘钥、偏移量将指定文件流解密并输出到指定目录
* DecryptFile(FileStream fileStream, string key, byte[] ivBuffer, string outFilePath, FillType fillType = FillType.NoFile, char fillCharacter = ' ', Encoding? encoding = null): 根据秘钥、偏移量字节数组将指定文件流解密并输出到指定目录


### Md5加密

> `salt`为盐, 结合原加密内容形成新的待加密字符串, 增大破解难度, 例如: 为每个用户设置独一无二的盐, 使得用户输入的简单密码也变得不容易破解

* Encrypt(string content, bool isToLower = true, Encoding? encoding = null): 将输入字符串进行md5加密并返回加密后的结果
* Encrypt(string content, string salt, bool isToLower = true, Encoding? encoding = null): 将输入的字符串以及盐结合后进行md5加密并返回加密后的结果
* EncryptRepeat(string content, int encryptTimes = 1, bool isToLower = true, Encoding? encoding = null): 将输入的字符串进行指定次数的md5加密并返回加密后的结果 (默认仅加密一次)
* EncryptRepeat(string content, string salt, int encryptTimes = 1, bool isToLower = true, Encoding? encoding = null): 将输入的字符串与盐进行指定次数的md5加密并返回加密后的结果

```csharp
public void Main()
{
    var str = "Hello MASA Stack";
    var encryptResult = MD5Utils.Encrypt(str);
    Assert.AreEqual("e7b1bf81bacd21f9396bdbab6d881fe2", encryptResult);
}
```
* string EncryptFile(string fileName, bool isToLower = true): 将指定文件进行md5加密并返回加密后的结果
* EncryptStream(Stream stream, bool isToLower = true): 将指定文件流加密并返回加密后的结果

### Sha系列加密

其中支持: `SHA1Utils`、`SHA256Utils`、`SHA384Utils`、`SHA512Utils`

* string Encrypt(string content, bool isToLower = true, Encoding? encoding = null): Sha系列加密

```csharp
public void Main()
{
    var str = "Hello MASA Stack";
    var encryptResult = SHA256Utils.Encrypt(str);
    Assert.AreEqual("577da9f7698725d8ac8fc73e70b182b5ae47edaf5c2be73524861b3bf0f148dc", encryptResult);
}
```

### 全局配置

* DefaultAesEncryptKey: 全局Aes秘钥. 默认值为: `masastack.com                   `
* DefaultAesEncryptIv: 全局Aes偏移量. 默认值为: `AreyoumySnowman?`
* DefaultAesEncryptKeyLength: 全局Aes秘钥长度. 默认值为: 32 (仅支持16、24、32)
* DefaultDesEncryptKey: 全局Des秘钥. 默认值为: 3b668589
* DefaultDesEncryptIv: 全局Aes秘钥. 默认值为: 3b668589

例如:

```csharp
GlobalConfigurationUtils.DefaultDesEncryptKey = "12345678";
```