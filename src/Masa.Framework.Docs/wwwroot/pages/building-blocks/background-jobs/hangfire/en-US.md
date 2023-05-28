rDto
   {
       public string Username { get; set; }
       public string Password { get; set; }
       public string Email { get; set; }
   }
   ```

5. 定义后台任务方法

   ```csharp
   public class UserBackgroundJobService
   {
       public async Task RegisterUser(RegisterUserDto dto)
       {
           // 注册用户逻辑
           await _userService.Register(dto.Username, dto.Password, dto.Email);
       }
   }
   ```

6. 在需要执行后台任务的地方注入 `UserBackgroundJobService`，并调用 `Enqueue` 方法

   ```csharp
   public class UserController : ControllerBase
   {
       private readonly IBackgroundJobService _backgroundJobService;
       private readonly UserBackgroundJobService _userBackgroundJobService;

       public UserController(IBackgroundJobService backgroundJobService, UserBackgroundJobService userBackgroundJobService)
       {
           _backgroundJobService = backgroundJobService;
           _userBackgroundJobService = userBackgroundJobService;
       }

       [HttpPost("register")]
       public async Task<IActionResult> Register(RegisterUserDto dto)
       {
           // 注册用户
           await _userService.Register(dto.Username, dto.Password, dto.Email);

           // 添加后台任务
           _backgroundJobService.Enqueue(() => _userBackgroundJobService.RegisterUser(dto));

           return Ok();
       }
   }
   ```

7. 启动 Hangfire 服务

   ```csharp
   app.UseHangfireDashboard();
   app.UseHangfireServer();
   ```

8. 访问 Hangfire Dashboard，查看任务执行情况

   ```
   http://localhost:5000/hangfire
   ```bsDemo.Services
   {
       public class UserService
       {
           private readonly IBackgroundJobManager _backgroundJobManager;
   
           public UserService(IBackgroundJobManager backgroundJobManager)
           {
               _backgroundJobManager = backgroundJobManager;
           }
   
           public async Task RegisterUserAsync(string name)
           {
               var dto = new RegisterUserDto { Name = name };
               await _backgroundJobManager.EnqueueAsync<RegisterUserBackgroundJob, RegisterUserDto>(dto);
           }
       }
   }
   ```

7. 在控制器中调用注册用户服务

   ```csharp Controllers/UserController.cs
   using BackgroundJobsDemo.Services;
   
   namespace BackgroundJobsDemo.Controllers
   {
       [ApiController]
       [Route("[controller]")]
       public class UserController : ControllerBase
       {
           private readonly UserService _userService;
   
           public UserController(UserService userService)
           {
               _userService = userService;
           }
   
           [HttpPost]
           public async Task<IActionResult> RegisterUser(string name)
           {
               await _userService.RegisterUserAsync(name);
               return Ok();
           }
       }
   }
   ```

以上就是一个简单的后台任务示例，当用户注册时，将会异步执行一个后台任务，记录用户注册信息。Here is the translation of the code snippet from C# to English:

```csharp
namespace bsDemo.Services
{
    public class UserService : ServiceBase
    {
        public Task AddAsync()
        {
            var registerUser = new RegisterUserDto()
            {
                Name = "masa"
            };
            return BackgroundJobManager.EnqueueAsync(registerUser, TimeSpan.FromSeconds(3)); //Execute the task after 3s
        }
    }
}
``` 

In this code, we have a class called `UserService` which inherits from `ServiceBase`. It has a method called `AddAsync` which creates a new instance of `RegisterUserDto` and sets its `Name` property to "masa". Then, it enqueues this object to be executed as a background job after a delay of 3 seconds using the `BackgroundJobManager.EnqueueAsync` method.