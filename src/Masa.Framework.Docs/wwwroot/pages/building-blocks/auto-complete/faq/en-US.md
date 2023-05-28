# Autocomplete - Frequently Asked Questions

## Overview

This document records the possible issues that may arise when using **Autocomplete** and how to solve them.

## ElasticSearch

1. Error message: `"Content-Type header [application/vnd.elasticsearch+json; compatible-with=7] is not supported"`

   We enable compatibility mode by default, i.e. `EnableApiVersioningHeader(true)`, which works well with version 8.*, but may cause errors in some 7.* versions. In this case, you need to manually disable compatibility mode, i.e. `EnableApiVersioningHeader(false)`.

   ```csharp
   service.AddElasticsearchClient("es", option =>
   {
       option.UseNodes("http://localhost:9200")
           .UseConnectionSettings(setting => setting.EnableApiVersioningHeader(false));
   });
   ```

   [Why enable compatibility mode?](https://github.com/elastic/elasticsearch-net/issues/6154)