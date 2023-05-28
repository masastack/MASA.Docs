# User Guide - WebHooks

WebHook configuration and management is currently used to notify third parties in alarm processing. After the third party completes the subsequent operation, it needs to notify the alarm center that the alarm has been processed. Currently, the completion interface is provided, and an SDK will be provided in the future.

## List

The WebHook list is displayed in card form, supporting functions such as fuzzy search and pagination.

![WebHooks](https://cdn.masastack.com/stack/doc/alert/webHooks.png)

- Fuzzy search based on the name of the WebHook

## Create/Edit

The key is used to verify whether the request is valid during communication with the WebHook.

![WebHook-Edit](https://cdn.masastack.com/stack/doc/alert/webHook-edit.png)

## Test

Specify the handler and immediately send a push to the configured WebHook address.

![WebHook-Test](https://cdn.masastack.com/stack/doc/alert/webHook-test.png)