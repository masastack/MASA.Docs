This guide explains how to send regular and template messages on `Masa MC` in four steps.

## Sending Messages

Sending messages requires four steps.

### Select Message Type

In this step, you need to select the type of message you want to send, including regular messages and template messages.

![messageTask-type](https://cdn.masastack.com/stack/doc/mc/messageTask-type.png)

### Configure Message Content

In this step, you need to configure the message content based on the selected message type.

#### Regular Messages

For regular messages, you only need to fill in the message content.

- Email

   ![send-ordinary-email](https://cdn.masastack.com/stack/doc/mc/send-ordinary-email.png)

- Website Message

   ![send-ordinary-website-message](https://cdn.masastack.com/stack/doc/mc/send-ordinary-website-message.png)

- App

   ![send-ordinary-app](https://cdn.masastack.com/stack/doc/mc/send-ordinary-app.png)

   | Attribute | Description |
   | ---  | --- |
   | **In-App Message** | Generates a website message when checked |
   | **Jump Address** | The URL address to jump to in the website message, and a key-value pair with the key "url" is added to the transparent message JSON |
   | **Additional Fields** | Configuration of transparent message content |
   | **Optional Configuration-Android** | **Open a Specific Page When Clicking the Notification**: Use the URL in the intent to specify the target page to jump to after clicking the notification bar |

#### Template Messages

For template messages, you need to select a preset message template.

- Emailend/doc/mc/send-message-rule.png)

### 预览和发送

在此步骤中，您可以预览消息内容和收件人列表，确认无误后即可发送。

   - 预览：您可以在此处查看消息的最终效果，包括变量替换后的内容和样式。
   
   - 发送：点击发送按钮即可将消息发送给选定的收件人。

     ![send-message-preview](https://cdn.masastack.com/stack/doc/mc/send-message-preview.png)

以上就是发送消息的流程，希望对您有所帮助。如果您有任何疑问或建议，请随时联系我们。## Message Tasks

In the message task list, you can manage all message tasks. The list is displayed in card format and supports advanced filtering, fuzzy search, pagination, and other functions. You can enable/disable, view, test, or delete tasks.

![messageTasks](https://masa-docs.oss-cn-hangzhou.aliyuncs.com/stack/mc/message_task/message_task_more_content.png)

In addition, you can also view task details, including batch data and message content, and support recall operations.

![messageTasks-details](https://cdn.masastack.com/stack/doc/mc/messageTasks-details.png)