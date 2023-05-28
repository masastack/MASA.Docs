# Data - Connection String

## Overview

Modify the node that the current data context reads by adding the **[ConnectionStringName]** attribute to the context.

## Usage

1. Configure the default database address and read database address.

   ```json appsettings.json l:3
   {
     "ConnectionStrings": {
       "ReadDbConnection": "{Replace-Your-Read-DbConnectionString}"
     }
   }
   ```

2. Create a new data context.

   ```csharp Infrastructure/OrderReadDbContext.cs l:1
   [ConnectionStringName("ReadDbConnection")]
   public class OrderReadDbContext: MasaDbContext<OrderReadDbContext>
   {
       public OrderReadDbContext(MasaDbContextOptions<OrderReadDbContext> options) : base(options)
       {
       }
   }
   ```

   > Set the database connection string name used by the read context to `ReadDbConnection`.

## Others

When the data context <font color=Red>does not have the [ConnectionStringName] attribute</font> or the specified `Name` is <font color=Red>null</font> or <font color=Red>empty</font>, the <font color=Red>default read node is DefaultConnection</font>, otherwise the node name used is the specified `Name`.