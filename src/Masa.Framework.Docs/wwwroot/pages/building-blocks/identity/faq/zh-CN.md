## 用户身份 - 常见问题

## 公共

1. A: 我们的项目Claim的value值不是通过Json序列化的，而是通过Yaml或者其它格式来序列化的，这样可能会导致我们的项目无法读取，请问如何解决？

   Q: 以 Yaml 为例：

   ```csharp Program.cs
   var services = new ServiceCollection();
   services.AddYaml();
   services.AddMasaIdentity(DataType.Yml.ToString());
   ```