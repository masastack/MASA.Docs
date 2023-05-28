# Background Tasks - Common Issues

## Overview

This document records the possible issues that may arise when using **background tasks** and how to solve them.

## General

1. The background task was added successfully in a project that uses `Controller`, but it failed to execute. 

If you are not using the `MinimalAPIs` solution, you need to use `DI` to obtain the `IBackgroundJobManager` service, or assign the project's `RootServiceProvider` to `MasaApp`. Taking **in-memory** background tasks as an example:

* Solution 1: Use IBackgroundJobManager

  ```csharp Controllers/UserController
  using BackgroundJobsDemo.Dto;
  using Masa.BuildingBlocks.Extensions.BackgroundJobs;
  using Microsoft.AspNetCore.Mvc;
  
  namespace BackgroundJobsDemo.Controllers;
  
  [Route("[controller]/[action]")]
  public class UserController: ControllerBase
  {
      private readonly IBackgroundJobManager _backgroundJobManager;
      public UserController(IBackgroundJobManager backgroundJobManager)
      {
          _backgroundJobManager = backgroundJobManager;
      }
      
      [HttpPost]
      public Task AddAsync()
      {
          var registerUser = new  ```Blocks.Extensions.BackgroundJobs;
  
  public class RegisterUserService
  {
      public static async Task EnqueueAsync()
      {
          var registerUser = new RegisterUserDto()
          {
              Name = "masa"
          };
          await BackgroundJob.EnqueueAsync(registerUser, TimeSpan.FromSeconds(3));//Execute the task after 3s
      }
  }
  ```
  :::
  ::::
  
  以上是两种使用 Masa.BuildingBlocks.Extensions.BackgroundJobs 的方案，第一种是通过注入 IBackgroundJobManager 实例来使用，第二种是通过静态方法 BackgroundJob 来使用。无论哪种方案，都可以轻松地将任务加入后台队列，并在指定时间后执行。The code above is written in C# and belongs to the namespace "Blocks.Extensions.BackgroundJobs". It defines a class called "UserService" which inherits from "ServiceBase". Within this class, there is a method called "AddAsync" which creates a new instance of "RegisterUserDto" and sets its "Name" property to "masa". This method then enqueues a background job using the "BackgroundJobManager.EnqueueAsync" method, which takes in the "registerUser" object and a TimeSpan of 3 seconds as parameters. This means that the task will be executed after a delay of 3 seconds.