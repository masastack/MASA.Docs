# Data Serialization - Json

## Overview

Serialization and deserialization program based on `System.Text.Json`.

## Usage

1. Install `Masa.Contrib.Data.Serialization.Json`

   ```shell Terminal
   dotnet add package Masa.Contrib.Data.Serialization.Json
   ```

2. Register the `json` serialization/deserialization program

   ```csharp Program.cs l:3
   var builder = WebApplication.CreateBuilder(args);
   
   builder.Services.AddSerialization(builder => builder.UseJson());
   ```

3. Serialization

   ```csharp l:2-6
   IJsonSerializer jsonSerializer;// Get through DI
   jsonSerializer.Serialize(new
   {
       id = 1,
       name = "Serialization"
   });
   ```

4. Deserialization

   ```csharp l:12
   public class UserDto
   {
       [JsonPropertyName("id")]
       public int Id { get; set; }
   
       [JsonPropertyName("name")]
       public string Name { get; set; }
   }
   
   var json = "{\"id\":1,\"name\":\"Deserialization\"}";
   IJsonDeserializer jsonDeserializer; // Get through DI
   var user = jsonDeserializer.Deserialize<UserDto>(json);```The code above is using a JSON deserializer called "jsonDeserializer" to deserialize a JSON string into a UserDto object.