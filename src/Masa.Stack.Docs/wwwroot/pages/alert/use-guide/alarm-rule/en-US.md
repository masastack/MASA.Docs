触发规则设置

   - 触发条件，支持多种比较操作符和逻辑运算符，可使用变量。
   - 持续时间，触发后持续时间达到设定值才会触发告警。
   - 告警级别，可选警告、严重、致命。
   - 告警通知策略，可选邮件、短信、微信等多种通知方式。
   - 恢复通知策略，可选邮件、短信、微信等多种通知方式。

   ![告警规则-触发规则](https://cdn.masastack.com/stack/doc/alert/alarmRule-add-trigger.png)

4. 告警模板设置

   - 告警标题，可使用变量。
   - 告警内容，可使用变量。
   - 告警模板，支持自定义模板。

   ![告警规则-告警模板](https://cdn.masastack.com/stack/doc/alert/alarmRule-add-template.png)

5. 高级设置

   - 告警抑制，可设置告警抑制时间，避免频繁告警。
   - 告警分组，可将告警分组，方便管理和查看。
   - 告警标签，可为告警添加标签，方便管理和查看。

   ![告警规则-高级设置](https://cdn.masastack.com/stack/doc/alert/alarmRule-add-advanced.png)Metric Monitoring

- Metric monitoring variables support configuration and expression filling.
  ![Alarm Rule - Metric Monitoring](https://cdn.masastack.com/stack/doc/alert/alarmRule-add-MetricMonitor.png)

4. Chart Preview
   - Simulate the chart of query records for monitoring items based on the check frequency and monitoring item configuration.
   - Preview of log sampling to obtain the latest log data that meets the rules in the previous cycle.
      ![Alarm Rule - Chart Preview](https://cdn.masastack.com/stack/doc/alert/alarmRule-add-chart.png)

5. Alarm Settings
   - Continuous trigger threshold: Configure the continuous trigger threshold. When the accumulated trigger times reach this value, an alarm will be generated. It will not be counted if the trigger condition is not met.
   - Silence period: Support periodic and time-based settings. After the alarm occurs and does not recover to normal, how long to wait before sending another alarm notification.
   - Trigger rule expression: Please refer to the MASA Stack documentation site for the rule engine introduction: <https://docs.masastack.com/framework/building-blocks/rules-engine/overview>
      ![Alarm Rule - Alarm Settings](https://cdn.masastack.com/stack/doc/alert/alarmRule-add-ruleSetting.png)
      ![Alarm Rule - Alarm Settings 2](https://cdn.masastack.com/stack/doc/alert/alarmRule-example-setting2.png)