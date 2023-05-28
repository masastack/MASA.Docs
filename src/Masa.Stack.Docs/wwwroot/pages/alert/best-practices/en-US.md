# Best Practices

## Monitoring Service Log Alarms

1. Connect the services that need to be monitored to observability, refer to [Development Guide-Observability Access](stack/alert/develop-guide).
2. Create channels and message templates in the Message Center (MC). The Message Center (MC) is responsible for managing notification channels and notification content for alarms, refer to [Message Center](stack/mc/introduce).
3. Create alarm rules in the Alarm Center (Alert), configure monitoring items, alarm rules, and notification strategies, refer to [User Guide-Alarm Rules](stack/alert/use-guide/alarm-rule).
   ![Alarm Rule-Example-Monitoring Item](https://cdn.masastack.com/stack/doc/alert/alarmRule-example-monitoring.png)
   ![Alarm Rule-Example-Setting 1](https://cdn.masastack.com/stack/doc/alert/alarmRule-example-setting1.png)
   ![Alarm Rule-Example-Setting 2](https://cdn.masastack.com/stack/doc/alert/alarmRule-example-setting2.png)
4. After the rule is created, the Alarm Center (Alert) will register the job in the Task Scheduling Center (Scheduler). The alarm rule will periodically check and evaluate the monitoring items, analyze the results according to the alarm rule, trigger the alarm or recovery notification, and then send the alarm message through the Message Center (MC).