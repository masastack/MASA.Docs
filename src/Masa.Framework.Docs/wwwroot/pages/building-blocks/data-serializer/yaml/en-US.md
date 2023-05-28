Address() {
                   Street = "1600 Pennsylvania Ave NW",
                   City = "Washington",
                   State = "DC",
                   Zip = "20500",
               }}
       }
   };

   var yaml = person.ToYaml();
   ```

4. 反序列化

   ```csharp l:38
   var yaml = @"Name: Abe Lincoln
   Age: 25
   HeightInInches: 6.333333333333333
   Addresses:
     home:
       Street: '2720  Sundown Lane'
       City: Kentucketsville
       State: Calousiyorkida
       Zip: '99978'
     work:
       Street: '1600 Pennsylvania Ave NW'
       City: Washington
       State: DC
       Zip: '20500'";

   var person = yaml.FromYaml<Person>();
   ```

## 注意事项

- `Yaml` 序列化程序默认使用 `YamlDotNet.Serialization.NamingConventions.CamelCaseNamingConvention` 命名约定，如果需要使用其他命名约定，请自行实现 `INamingConvention` 接口并注册到 `YamlSerializerBuilder` 中。
- `Yaml` 反序列化程序默认使用 `YamlDotNet.Serialization.TypeResolvers.DefaultTypeResolver` 类型解析器，如果需要使用其他类型解析器，请自行实现 `ITypeResolver` 接口并注册到 `YamlDeserializerBuilder` 中。1. Address() {
                   Street = "1600 Pennsylvania Avenue NW",
                   City = "Washington",
                   State = "District of Columbia",
                   Zip = "20500",
               }},
       }
   };
   
   IYamlSerializer yamlSerializer;// Get through DI
   var yaml = yamlSerializer.Serialize(person);
   ```

4. Deserialization

   ```csharp l:13
   var yml = @"
   name: George Washington
   age: 89
   height_in_inches: 5.75
   addresses:
     home:
       street: 400 Mockingbird Lane
       city: Louaryland
       state: Hawidaho
       zip: 99970
   ";
   IYamlDeserializer yamlDeserializer; // Get through DI
   var people = yamlDeserializer.Deserialize<Person>(yml);
   ```