# Rule Engine - Microsoft

## Overview

The rule engine based on [`RulesEngine`](https://github.com/microsoft/RulesEngine) provides a simple way to store rules outside of the core system logic, ensuring that any changes to the rules do not affect the core system.

## Usage

1. Install `Masa.Contrib.RulesEngine.MicrosoftRulesEngine`

   ```shell terminal
   dotnet add package Masa.Contrib.RulesEngine.MicrosoftRulesEngine
   ```

2. Register the rule engine

   ```csharp Program.cs
   var services = new ServiceCollection();
   services.AddRulesEngine(rulesEngineOptions =>
   {
       rulesEngineOptions.UseMicrosoftRulesEngine();
   });
   ```

3. Use the rule engine

   ```csharp
   var json = @"{
     ""WorkflowName"": ""UserInputWorkflow"",// optional
     ""Rules"": [
       {
         ""RuleName"": ""CheckAge"",
         ""ErrorMessage"": ""Must be over 18 years old."",
         ""ErrorType"": ""Error"",
         ""RuleExpressionType"": ""LambdaExpression"",
         ""Expression"": ""Age > 18""
       }```
In the code snippet above, a JSON rule is defined and passed to a rules engine client for execution. The result of the execution is then printed to the console. 

For advanced usage, the rules engine can be configured to support additional methods outside of the System namespace. This can be done by creating a new class, such as StringUtils, to extend string methods and provide additional methods for the rules engine. The rules engine can then be registered and configured to support the StringUtils class by adding it to the CustomTypes property of the ReSettings object.