NotFoundException` 异常时，我们可以自定义返回的错误信息。

   ```csharp
   public class CustomExceptionHandler : IExceptionHandler
   {
       public Task HandleAsync(HttpContext context, Exception exception)
       {
           if (exception is NotFoundException)
           {
               context.Response.StatusCode = (int)HttpStatusCode.NotFound;
               context.Response.ContentType = "application/json";
               var message = new { message = "The requested resource was not found." };
               var json = JsonSerializer.Serialize(message);
               return context.Response.WriteAsync(json);
           }
           return Task.CompletedTask;
       }
   }
   ```

   然后在 `Program.cs` 中使用：

   ```csharp
   app.UseMasaExceptionHandler(new CustomExceptionHandler());
   ```

## 总结

通过使用全局异常，我们可以更加方便地处理异常并输出友好的错误信息，提高了系统的可维护性和用户体验。When an `ArgumentNullException` exception occurs, the specific error message will be output to the outside, and the HTTP status code will be 298.

```csharp Program.cs
app.UseMasaExceptionHandler(options =>
{
    options.ExceptionHandler = exceptionContext =>
    {
        if (exceptionContext.Exception is ArgumentNullException ex)
            exceptionContext.ToResult(ex.Message, 298);
    };
});
```

> Check the [documentation](/framework/building-blocks/exception#section-4e2d95f44ef6) for more ways to customize exception handling.

## Summary

Through the global exception feature, we can interrupt operations anywhere in the project, reducing a lot of tedious work. In addition, by customizing exceptions and outputting response information with consistent formatting, it will greatly facilitate collaboration with front-end engineers. Furthermore, global exceptions support collaboration with [I18n](/framework/building-blocks/globalization/i18n) to output more user-friendly error messages.