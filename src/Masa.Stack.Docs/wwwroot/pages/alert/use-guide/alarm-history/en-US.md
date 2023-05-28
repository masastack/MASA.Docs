# User Guide - Alarm History

Alarm data generated according to alarm rules.

## List

The alarm history list is displayed in table form, with three filtering tabs (active, resolved, no notification needed), supporting advanced filtering, fuzzy search, pagination, and other functions.

![Alarm History](https://cdn.masastack.com/stack/doc/alert/alarmHistorys.png)

- Advanced filtering: including time period (distinguishing time type), severity, and status.
- Fuzzy search: search by rule name.

## Handling Alarms

1. Alarm Details

   Alarm details and chart of the monitoring item's historical records.
   ![Handling Alarms - Details](https://cdn.masastack.com/stack/doc/alert/handleAlarm-details.png)

   The triggering rules of the alarm rule, with untriggered rules displayed in gray.
   ![Handling Alarms - Details1](https://cdn.masastack.com/stack/doc/alert/handleAlarm-details2.png)

2. Handling Alarms
   - Resolved: mark the alarm as resolved and specify the notification after the resolution is completed, with the current operator as the handler.
   - Third-party handling: select the network hook and handler, use the selected network hook to notify the third party, and let the third-party business handle the alarm themselves.
   ![Handling Alarms](https://cdn.masastack.com/stack/doc/alert/handleAlarm.png)

## Viewing Alarms

View alarm details and handling details.
![Alarm - Details](https://cdn.masastack.com/stack/doc/alert/alarm-detail.png)
![Alarm - Details2](https://cdn.masastack.com/stack/doc/alert/alarm-detail2.png)