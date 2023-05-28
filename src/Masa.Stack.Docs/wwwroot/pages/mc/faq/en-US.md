# Common Questions

## Q: What is MASA.MC?

A: [Introduction to MASA.MC](stack/mc/introduce)

## Q: How to update the audit status of SMS templates?

A: Click the "Sync Template" button to synchronize the status of the Alibaba Cloud SMS template.

## Q: How to configure variables for email and in-app message templates?

A: The template title, content, and jump URL all support variables, and the variable format is: \{\{variable name\}\}.

## Q: Where to add manually selected recipient data for sending messages?

A: In MASA.MC, users are docked with MASA.Auth. If you need to send messages to internal users, you need to connect to MASA.Auth.

## Q: How to send messages on a scheduled basis and in batches?

A: Please refer to [User Guide-Send Messages](stack/mc/use-guide/send-message). Sending rules depend on MASA.Scheduler. To support sending rules, you need to connect to MASA.Scheduler.

## Q: When calling the SDK to send in-app broadcast messages, no in-app message data is generated for the user?

A: In broadcast mode, a check notification is sent through SignalR, and the client needs to actively call the SDK's check method to generate in-app message data for the current user. Please refer to the [SDK example](stack/mc/sdk-instance).

## Q: In a non-production environment, how can I test SMS sending without actually sending SMS?

A: You can configure the MC mock switch in MASA DCC.

1. Find the Service application of the MC project in DCC

   ![dcc-mc-service](https://cdn.masastack.com/stack/doc/mc/dcc-mc-service.png)

2. Find the Mock configuration, change Enable to "true" and publish

   ![dcc-mc-mock](https://cdn.masastack.com/stack/doc/mc/dcc-mc-mock.png)

3. Restart the MC service

We will continue to collect more FAQs.