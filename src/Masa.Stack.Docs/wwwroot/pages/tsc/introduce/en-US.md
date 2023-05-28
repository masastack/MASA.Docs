# Product Introduction

## What is MASA TSC?

Troubleshooting Center is a core product in MASA Stack 1.0, which is mainly responsible for monitoring the projects/applications in the entire MASA system to troubleshoot any issues. It includes viewing the monitoring of faults from a project perspective and tracing back to specific link logs. The product features include:

![Functional Structure Diagram](https://cdn.masastack.com/stack/doc/tsc/introduce/functional-structure.svg)

## Project Monitoring

Through project dimension, the monitoring of project operation logs is recorded to provide feedback on the project's running status. There are three states: normal, warning, and error. You can select a time range to check if there are any issues during the project's operation time. At the same time, it is integrated with the project team in Auth, and after confirming the user's team, the viewing permission can be restricted to the corresponding project team.

## Project Application Metrics Visualization

Through project monitoring, you can view the situation of applications in the project. There is currently a basic viewing template, which includes some indicators of the application to provide feedback on the situation of the application in the project. Of course, you can also view all the indicators of the application. You can select the refresh frequency of the time according to your needs to view it, and you can also switch to view other applications in the project, which is convenient for troubleshooting and analyzing the cause of the fault. If there are some errors in the logs, there will be a prompt bar.

## Log Query

Log query does not currently support the distinction of project teams. Here, you can query all the records of monitored project applications, including the query records of TSC itself. The search query supports cron expression conditional search. Exporting logs is not supported for the time being.

## Trace Query

Trace query is mainly used to query the upstream and downstream associated data where the problem occurred, providing data reference for troubleshooting. Through trace query, you can understand the number of spans of services, interfaces, and the time consumed, as well as the specific situation of the logs.

## Features and Advantages

1. The product design refers to commonly used monitoring software on the market, and there are some unified standards in the indicator setting to make it easy for users to understand.
2. You can configure the application indicators you need to monitor and the dashboard you need to display according to your own needs.
3. You can view the specific fault source and log details through a complete link trace.
4. With Alert and MC, the possibility of faults and the potential losses caused by them can be minimized.