# Security - Password

## Overview

Provides common password encryption and decryption capabilities. Install `Masa.Utils.Security.Cryptography` to use.

## Features

* [Aes encryption and decryption](#Aes-helper-class)
* [Base64 encoding and decoding](#Base64-encoding-and-decoding)
* [Des encryption and decryption](#Des-encryption-and-decryption)
* [Md5 encryption](#Md5-encryption)
* [Sha series encryption](#Sha-series-encryption)
* [Global configuration](#Global-configuration)

## Source code analysis

> `encoding` is the encoding format, default is `UTF-8`.

### Aes helper class

* Default key: `masastack.com`
* Default offset: 16 bits, default: `AreyoumySnowman?`
* Default key length: **GlobalConfigurationUtils.DefaultAesEncryptKeyLength** (default is 32 bits, only supports 16, 24, 32)
* If the key is not specified, the default key will be used.
* If the offset is not specified, the default offset will be used.

> The default key and offset do not have a set length. If the length of the default key or offset is insufficient, it will be automatically padded, and if it exceeds the length, it will be truncated.

#### Encryption

* Encrypt: Encrypts the content using `AES` and returns the encrypted string.
* EncryptToBytes: Encrypts the content using `AES` and returns the encrypted byte array.
* EncryptFile: Encrypts the file stream using `AES` and outputs the encrypted file to the specified directory.

#### Decryption

* Decrypt: Decrypts the encrypted content using `AES` and returns the decrypted content.
* DecryptToBytes: Decrypts the encrypted byte array using `AES` and returns the decrypted byte array.
* DecryptFile: Decrypts the encrypted file stream and outputs the decrypted file to the specified directory.

### Base64 encoding and decoding

* Encrypt: Encodes the string according to the specified encoding format and returns the encoded result (default encoding format: UTF8).Hello MASA Stack";

var encryptResult = Base64Utils.Encrypt(str);

### DES Encryption and Decryption

* Default key: `c7fac67c` (8 characters)
* Default IV: `c7fac67c` (8 characters)
* If no key is specified, the default key will be used
* If no IV is specified, the default IV will be used

> The default key and IV have no specified length. If the length of the default key or IV is less than 8 characters, it will be automatically padded. If the length is greater than 8 characters, it will be truncated.

* Encrypt: Encrypts the content using DES and returns the encrypted string
* EncryptFile: Encrypts the file stream using DES and outputs the encrypted file to the specified directory
* Decrypt: Decrypts the encrypted content using DES and returns the decrypted content
* DecryptFile: Decrypts the encrypted file stream using DES and outputs the decrypted file to the specified directory

### MD5 Encryption

* Encrypt: Encrypts the content using MD5 and returns the encrypted string
* EncryptRepeat: Encrypts the content using MD5 for a specified number of times and returns the encrypted string (default is one time)

```csharp
public void Main()
{
    var str = "Hello MASA Stack";
    var encryptResult = MD5Utils.Encrypt(str);
    Assert.AreEqual("e7b1bf81bacd21f9396bdbab6d881fe2", encryptResult);
}
```

* EncryptFile: Encrypts the specified file using MD5 and returns the encrypted result
* EncryptStream: Encrypts the specified file stream and returns the encrypted result

### SHA Encryption

Supported algorithms: `SHA1Utils`, `SHA256Utils`, `SHA384Utils`, `SHA512Utils`

* Encrypt: Encrypts the content using the specified SHA algorithm and returns the encrypted string.SHA Encryption Series

```csharp
public void Main()
{
    var str = "Hello MASA Stack";
    var encryptResult = SHA256Utils.Encrypt(str);
    Assert.AreEqual("577da9f7698725d8ac8fc73e70b182b5ae47edaf5c2be73524861b3bf0f148dc", encryptResult);
}
```

### Global Configuration

* DefaultAesEncryptKey: Global Aes key. Default value is: `masastack.com                   `
* DefaultAesEncryptIv: Global Aes offset. Default value is: `AreyoumySnowman?`
* DefaultAesEncryptKeyLength: Global Aes key length. Default value is: 32 (only supports 16, 24, 32)
* DefaultDesEncryptKey: Global Des key. Default value is: 3b668589
* DefaultDesEncryptIv: Global Aes key. Default value is: 3b668589

For example:

```csharp
GlobalConfigurationUtils.DefaultDesEncryptKey = "12345678";
```