# HTTP

## Installation

```shell
dotnet add package Masa.Contrib.StackSdks.Scheduler
```

## Manual Creation

![Fill in scheduling information](https://cdn.masastack.com/stack/doc/scheduler/rc1/scheduler_http_insert.png)

![Fill in scheduling information 2](https://cdn.masastack.com/stack/doc/scheduler/rc1/scheduler_http_insert_2.png)

| Type     | Description                                                                                                                           |
|----------|---------------------------------------------------------------------------------------------------------------------------------------|
| Request Type | `HTTP` request type (`GET`, `POST`, `PUT`, `DELETE`, `HEAD`)                                                                               |
| Request Address | The interface address for the scheduling request                                                                                                                    |
| Request Parameters | Interface parameterslease provide the original text for me to translate.The Public SchedulerHttpController takes in an ISchedulerClient as a parameter. In the Register method, a new AddSchedulerJobRequest is created with various properties such as ProjectIdentity, Name, JobType, CronExpression, and OperatorId. The HttpConfig property is also set with a SchedulerJobHttpConfig object that contains HttpMethod, RequestUrl, HttpParameters, HttpHeaders, HttpBody, and HttpVerifyType. Finally, the method returns a Task of JobRegisterResult.pHeaders**      | 请求头                                    |
   | **RequestBody**     | 请求体                                    |
   | **VerifyContent**   | 验证内容                                  |
   | **JobID**           | `Job` 的唯一标识符                        |

   The following code is used to register a job:

   ```csharp
   public async Task<JobRegisterResult> RegisterJobAsync(JobRegisterRequest request)
   {
       var request = new SchedulerJobAddRequest
       {
           ProjectIdentity = request.ProjectId,
           Name = request.Name,
           JobType = request.JobType,
           CronExpression = request.CronExpression,
           OperatorId = request.OperatorId,
           HttpJobOptions = new HttpJobOptions
           {
               HttpMethod = request.HttpMethod,
               RequestUrl = request.RequestUrl,
               HttpHeaders = request.HttpHeaders,
               RequestBody = request.RequestBody,
               VerifyContent = ""
           }
       };
       var jobID = await _schedulerClient.SchedulerJobService.AddAsync(request);
       return new JobRegisterResult(jobID);
   } 

   public record JobRegisterResult(Guid JobID);
   ```| **Parameters**     | Interface parameters (`Query`)             |
| **HttpBody**       | Interface parameters (`Content`)           |
| **HttpVerifyType** | Verification condition                     |
| **VerifyContent**  | Verification content                        |