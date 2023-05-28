# Event Bus - Overview

The event bus is an event publishing/subscription structure that decouples different architecture layers through the publish-subscribe pattern. It provides a loosely coupled communication method that can be used to solve coupling between business components.

## Best Practices

Based on the event type, we divide the event bus into:

* [Local event bus](/framework/building-blocks/dispatcher/local-event)
* [Integration event bus](/framework/building-blocks/dispatcher/integration-event)