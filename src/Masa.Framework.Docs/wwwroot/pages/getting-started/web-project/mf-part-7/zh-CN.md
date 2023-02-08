## 7. 对象映射

在开发中, 对象赋值是很枯燥的工作, 它不仅仅浪费时间, 并且会使得代码看起来更复杂, 通过对象映射功能我们可以简化对象的赋值操作, 我们根据需要选择`Mapping`的提供者使用即可

### 注册对象映射

在上篇文章的`QueryHandler`中我们也使用了对象映射功能, 使用`Mapster`的提供者

1. 安装`Masa.Contrib.Data.Mapping.Mapster`、`Masa.BuildingBlocks.Data.MappingExtensions`

```powershell
dotnet add package Masa.Contrib.Data.Mapping.Mapster // 使用`Mapster`作为自动映射的提供者

dotnet add package Masa.BuildingBlocks.Data.MappingExtensions //为`object`类型提供自动映射扩展方法, 使得映射更简单
```

2. 注册`Mapster`, 修改`Program`

```csharp
builder.Services
    .AddMapster();
```

3. 自定义映射规则

自动映射针对类型、名称、结构一致的对象十分简单, 无需额外配置, 但针对结构, 类型不一致的对象需要配置自定义映射规则

```csharp
public static class GlobalMappingConfig
{
    public static void Mapping()
    {
        MappingCatalogItemToCatalogListItemDto();
    }

    private static void MappingCatalogItemToCatalogListItemDto()
    {
        TypeAdapterConfig<CatalogItem, CatalogListItemDto>
            .NewConfig()
            .Map(dest => dest.CatalogTypeName, catalogItem => catalogItem.CatalogType.Name)
            .Map(dest => dest.CatalogBrandName, catalogItem => catalogItem.CatalogBrand.Brand);

    }
}
```

在`Masa.EShop.Contracts.Catalog`类库中新建`CatalogListItemDto`

```csharp
public class CatalogListItemDto
{
    public Guid Id { get; set; }

    public string Name { get; set; } = null!;

    public decimal Price { get; set; }

    public string PictureFileName { get; set; } = "";

    public int CatalogTypeId { get; set; }
    
    public string CatalogTypeName { get; set; }

    public Guid CatalogBrandId { get; set; }
    
    public string CatalogBrandName { get; set; }

    public int AvailableStock { get; set; }
}
```

4. 在项目启动时指定自定义映射规则, 修改`Program`

```csharp
GlobalMappingConfig.Mapping();//指定自定义映射
```

查看更多[文档](/framework/building-blocks/mapping/overview)
