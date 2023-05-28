# Project Monitoring

## Team

The team view allows you to monitor the status of projects from the perspective of the project team. To use this feature, Masa PM integration is required.

![Team View](https://cdn.masastack.com/stack/doc/tsc/use-guide/monitoring/team/team.png)

### Search and Selection

- The project type is located on the top left and can be used as a filter.
- The search bar can be used to search for project or application names.
- The time search on the right allows you to search for applications and projects with relevant data within a specified time range.
- Clicking on the cards on the right allows you to quickly filter projects by status, from top to bottom: All, Warning, Error, and Normal.

### Features

- Each hexagon represents a project, which contains multiple applications. Up to three applications are displayed, and if there are more than three, "..." will be displayed at the bottom.
- Project status is indicated by color: green for normal, yellow for warning, and red for error.
- Application status is indicated by a red background for error, a yellow background for warning, and no background for normal.
- Applications are sorted by status (error, warning, normal) and then by name.
- Hovering over a project displays its name, ID, and the number of applications it contains. Hovering over an application displays its name and ID.
- The information on the right corresponds to the cards and can be referred to for more details.

### Other Features

- Clicking on an application within a hexagon takes you to the application details page.

### Application Details

This page displays project details, team details, and an overview of application monitoring information.

![Team Details](https://cdn.masastack.com/stack/doc/tsc/use-guide/monitoring/team/team_detail.png)

#### Service Selection

- The service dropdown allows you to switch between applications and view their monitoring overview.
- The time search allows you to view application monitoring data for a specific time range.

#### Features

- The top left displays project information, including project name, number of applications, project ID, project description, and project creator.
- The bottom left displays team details, including team icon, team name, number of projects, total number of applications, team administrator, and team description.Time**: The average response time of all API requests for the current time range. A higher value indicates that the API may be slower.
- **Service Success Rate**: The total number of service requests with a status code other than 5XX during a certain period of time divided by the total number of requests.
- **Service Call Count**: The service load, which can quickly detect whether the service is abnormal based on changes in the line chart.
- **Service Satisfaction**: Apdex, which can quickly determine whether there are response problems with the service based on changes in the line chart.
- **Service Response Time**: P99, P95, P90, P75, P50, which can quickly determine whether the entire application has problems or whether only a few APIs have problems.
- **API Call Count**: Top 10 API call counts, which can detect whether there is malicious access to the API.
- **Slow APIs**: Top 10 slowest accessed APIs, which can check whether there are problems with the APIs. Clicking on the details can jump to the link details.

#### Other Function Entry

- Click the blue "View Details" button in the upper right corner to jump to the application dashboard details.

![Dashboard Details](https://cdn.masastack.com/stack/doc/tsc/use-guide/monitoring/team/instrument.png)

- Click the "View Details" link on the right side of the red notification bar to jump to the error log list.

![Error Log List](https://cdn.masastack.com/stack/doc/tsc/use-guide/monitoring/team/log.png)

- The slow API list can jump to the corresponding link details.

![Link Details](https://cdn.masastack.com/stack/doc/tsc/use-guide/monitoring/team/trace_detail.png)

### Application Dashboard

This dashboard is a built-in dashboard that displays monitoring information related to the application.

#### Overview

![Dashboard Details](https://cdn.masastack.com/stack/doc/tsc/use-guide/monitoring/team/instrument.png)

- **Service Avg Response Time**: The average response time of all API requests for the current time range. A higher value indicates that the API may be slower.png)

- **Time**: Average response time of the service, reflecting the overall response time changes of the service.
- **Service Load Call**: Service load, the number of calls per minute.
- **Service Apdex**: Service satisfaction.
- **Success Rate**: Service success rate.
- **Service Response Time Percentile**: P99, P95, P90, P75, P50.
- **Instance Load In Current Service**: Instance load, suitable for load balancing to view the load status of each instance.
- **Service Instance Load**: Line chart of service instance load.
- **Slow Endpoint In Current Service**: Top 10 slow endpoints.

#### Instance

- Overview data of service instances. Click on a service instance to enter the instance dashboard.

![Instance Dashboard](https://cdn.masastack.com/stack/doc/tsc/use-guide/monitoring/team/instrument_instance.png)

#### Endpoint

- Overview data of service endpoints. Click on the endpoint address to enter the endpoint dashboard.

![Endpoint Dashboard](https://cdn.masastack.com/stack/doc/tsc/use-guide/monitoring/team/instrument_endpoint.png)

#### Topology

- The topology diagram defaults to Masa Auth Service when no service is specified.
- You can specify the center service and dependency hierarchy. For example, if the center service is A, and A->B, B->C, C->D, A->D, when the hierarchy is 1, you get A->B, A->D; when the hierarchy is 2, you get A->B, B->C, A->D; when the hierarchy is 3, you get A->B, B->C, C->D, A->D.

![Topology Diagram](https://cdn.masastack.com/stack/doc/tsc/use-guide/monitoring/team/instrument_topology.png)Log

Logs are detailed records of system information.

![Log Information Image](https://cdn.masastack.com/stack/doc/tsc/use-guide/monitoring/log/log.png)

### Search Functionality

- The input box can be used to search for keywords, or Elasticsearch advanced query syntax can be used to perform advanced searches. After inputting the search criteria, press Enter to search.
- You can also search within a specified time range.

### Features

- The bar chart at the top represents the change in the number of log records, and significant increases or decreases can be identified based on the changes.
- The list displays log entries and detailed information, which can be divided into two categories:

1. Associated with TraceId
   Usually generated during the request process, associated with TraceId and link information, and associated with a specific request process in the link through SpanId, making it easier to quickly troubleshoot faults and problems in conjunction with Trace.

2. Not associated with TraceId
   Generally generated by non-request processes, such as service startup, shutdown, and scheduled tasks. Faults can only be troubleshooted based on more detailed log information.

## Trace

Trace records the complete request chain context related to each request in the application. When problems occur, you can search for related request information based on time and interface, check request parameters, processing processes, and processing results. You can also combine TraceId with logs to view detailed log information related to the chain.

![Trace Image](https://cdn.masastack.com/stack/doc/tsc/use-guide/monitoring/trace/trace.png)

### Service Selection

- The project type is displayed at the top left and can be used as a filter condition.
- The search box can be used to search for project or application names.
- The time search on the right displays applications and projects with related data within a specified time range.
- Clicking on the cards on the right can quickly filter projects based on their status, from top to bottom: All, Warning, Error, and Normal.

### Features

- Each hexagon represents a project, which contains multiple applications. Up to three applications are displayed, and if there are more than three, "..." will be displayed at the bottom.
- Project status is distinguished by color, with green representing normal, yellow representing warning, and red representing error.
- A red background for the application status indicates that it is in an error state.uctions/list_view.png)

- 创建仪表盘，选择指标表达式和图表类型

![创建仪表盘图](https://cdn.masastack.com/stack/doc/tsc/use-guide/monitoring/instructions/create.png)

- 编辑仪表盘，可修改指标表达式和图表类型

![编辑仪表盘图](https://cdn.masastack.com/stack/doc/tsc/use-guide/monitoring/instructions/edit.png)

- 删除仪表盘，删除后不可恢复

- 仪表盘展示的指标数据可根据时间范围进行筛选

- 可将仪表盘分享给其他用户，设置分享权限

- 可将仪表盘导出为图片或PDF格式，方便保存和分享

以上是本系统的主要功能和操作说明。希望这份翻译能够帮助您更好地理解和使用本系统。- Adding a Table of Contents

![Table of Contents Image](https://cdn.masastack.com/stack/doc/tsc/use-guide/monitoring/instrument/list-2.png)

- Adding an Instrument Panel

![Instrument Panel Image](https://cdn.masastack.com/stack/doc/tsc/use-guide/monitoring/instrument/ins_add.png)

- Modifying an Instrument Panel

![Modified Instrument Panel Image](https://cdn.masastack.com/stack/doc/tsc/use-guide/monitoring/instrument/ins_update.png)

### Special Features

- The instrument panel comes with a hierarchical structure by default, which is root <- service <- serviceInstance <- endpoint.
- Creating an instrument panel at the root level will load data for all services in a table. You can then jump to a service-level instrument panel, which displays monitoring data for a specific service.
- A service-level instrument panel can create serviceInstance table data, which displays data for all instances of that service. It can also create endpoint table data, which displays data for all endpoints of that service.
- Clicking on serviceInstance table data will jump to an instrument panel at the serviceInstance level, which displays detailed monitoring data for the corresponding service and instance.
- Clicking on endpoint table data will jump to an instrument panel at the endpoint level, which displays detailed monitoring data for the corresponding service and endpoint.
- A serviceInstance-level instrument panel can also create endpoint table data, which displays data for all endpoints of that instance. Clicking on this data will jump to an instrument panel at the endpoint level.
- By default, you can only jump to instrument panels at the same level. If an instrument panel at the corresponding level does not exist, it will jump to the General level for the corresponding service./tsc/use-guide/monitoring/instrument/ins/table.png)

- Text

文本面板，可以添加自定义文本内容，支持 Markdown 语法

![Text图](https://cdn.masastack.com/stack/doc/tsc/use-guide/monitoring/instrument/ins/text.png)

- Alert

告警面板，可以设置告警规则，当指标数据达到设定的阈值时，会触发告警，可以设置告警方式，如邮件、短信等

![Alert图](https://cdn.masastack.com/stack/doc/tsc/use-guide/monitoring/instrument/ins/alert.png)

### 总结

仪表盘是监测服务运行状态的重要工具，通过可视化的方式展示指标数据，方便用户快速了解服务的运行情况。在仪表盘的配置中，Tabs 多页签、EChart 图表、Table、Text 和 Alert 等功能，可以满足用户不同的监测需求。- Topology

To create a topology, you need to specify a service as the central node. If not specified, the default central node is Masa Auth Service.

![Topology](https://cdn.masastack.com/stack/doc/tsc/use-guide/monitoring/instrument/ins/topology.png)

- Logs

![Log](https://cdn.masastack.com/stack/doc/tsc/use-guide/monitoring/instrument/ins/log.png)

- Traces

![Trace](https://cdn.masastack.com/stack/doc/tsc/use-guide/monitoring/instrument/ins/trace.png)

## Time Selection

### Time Selector

![Time Selector](https://cdn.masastack.com/stack/doc/tsc/use-guide/monitoring/time/view.png)

1. Selected time range. Click to set a custom time range in the pop-up window. The end time must be greater than the start time, and the range can be up to 30 days.

   ![Open Time Selector](https://cdn.masastack.com/stack/doc/tsc/use-guide/monitoring/time/open.png)

2. Time zone information. By default, it is set to the user's time zone. If needed, click on the time range, as shown in the above image, select the corresponding time zone, and click "OK" to apply. The current system time zone will be changed to the selected time zone.

3. Quick time range selection. A time range from a certain time point to the current time. It is convenient for overview queries. The range can be up to 30 days or as short as 5 minutes.

4. Manual refresh function. Click the hand icon to update the time range according to the most recent time range set in `3`, and trigger a time update query action.5. The automatic refresh function is mainly used for dashboard monitoring, refreshing reports at fixed time intervals.