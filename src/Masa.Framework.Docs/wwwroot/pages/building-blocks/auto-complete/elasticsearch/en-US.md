# Autocomplete - Elasticsearch

## Overview

Autocomplete based on [elasticsearch](https://www.elastic.co/cn/elasticsearch/) has higher query performance compared to relational databases. With its plugins, we can easily implement tokenized search, making our autocomplete more intelligent.

## Prerequisites

* Ensure that an available `elasticsearch` service is installed with the following plugins:
  * [elasticsearch-analysis-ik](https://github.com/medcl/elasticsearch-analysis-ik)
  * [pinyin](https://github.com/medcl/elasticsearch-analysis-pinyin)

## Usage

1. Install `Masa.Contrib.SearchEngine.AutoComplete.ElasticSearch`

   ```shell Terminal
   dotnet add package Masa.Contrib.SearchEngine.AutoComplete.ElasticSearch
   ```

2. Register `AutoComplete`

   ```csharp Program.cs
   var services = new ServiceCollection();
   services.AddAutoComplete<long>(optionsBuilder =>
       {
           optionsBuilder.UseElasticSearch(options =>
           {
               options.ElasticsearchOptions.UseNodes("http://localhost:9200");
               options.IndexName = "user_index_0";nt-id}");
   ```ompleteDocument>();

## Advanced Usage

### Using Custom Models

> AutoComplete requires more information than just the required `Text` (display content) and `Value` (value), and you don't want to query `Caching` or `Database` again.

1. Create a new `UserAutoCompleteDocument` and <font color=red>inherit</font> `AutoCompleteDocument`.

   ```csharp
   public class UserAutoCompleteDocument : AutoCompleteDocument
   {
       public int Id { get; set; }
   
       public string Name { get; set; }
   
       public string Phone { get; set; }
   
       protected override string GetText()
       {
           return $"{Name}:{Phone}";
       }
   
       /// <summary>
       /// Use user id as es document id
       /// </summary>
       /// <returns></returns>
       public override string GetDocumentId() => Id.ToString();
   }
   ```

2. Register `AutoComplete`.

   ```csharp Program.cs
   var services = new ServiceCollection();
   services.AddAutoCompleteBySpecifyDocument<UserAutoCompleteDocument>();
   ```1. Install the NuGet package `Elasticsearch.Net` and `NEST`.

2. Configure the Elasticsearch connection in the `ConfigureServices` method of the `Startup` class:

   ```csharp
   services.AddAutoCompleteDocument(optionsBuilder =>
   {
       optionsBuilder.UseElasticSearch(options =>
       {
           options.ElasticsearchOptions.UseNodes("http://localhost:9200");
           options.IndexName = "user_index_01";
           options.Alias = "user_index";
       });
   });
   ```

3. Create an `AutoCompleteClient` to initialize the index:

   ```csharp
   var autoCompleteClient = serviceProvider.GetRequiredService<IAutoCompleteClient>();
   await autoCompleteClient.BuildAsync();
   ```

4. Set data:

   ```csharp
   var userAutoCompleteDocument = new UserAutoCompleteDocument()
   {
       Id = 1,
       Name = "MASA",
       Phone = "13999999999"
   };
   await autoCompleteClient.SetBySpecifyDocumentAsync(userAutoCompleteDocument);
   ```

5. Get data:

   ```csharp
   var userAutoCompleteDocument = await autoCompleteClient.GetBySpecifyDocumentAsync<UserAutoCompleteDocument>("masa")6. Deleting Data

   ```csharp
   await autoCompleteClient.DeleteAsync("1");
   ```