1. A: The `value` of our project `Claim` is not serialized through `Json`, but through `Yaml` or other formats, which may cause our project to fail to read. How can we solve this?

   Q: Taking `Yaml` as an example:

   ```csharp Program.cs l:2-3
   var services = new ServiceCollection();
   services.AddSerialization(nameof(DataType.Yml), builder => builder.UseYaml());
   services.AddMasaIdentity(nameof(DataType.Yml));
   ```