# RulesEngine - Overview

The only constant is change, and by introducing a rules engine into a business system, **business decisions can be separated from the application code and written using pre-defined semantic modules**. Business personnel can directly manage the rules in the system without the need for developers, which brings many advantages.

* Reducing conflicts between business personnel and developers

  > Business personnel can independently configure rules, rather than having developers implement them through hard coding.

* Quickly responding to market changes

  > Business personnel can configure rules according to their needs without the intervention of developers.

* Increasing transparency of business operations

  > By viewing the configuration, more business personnel can understand how the current business operates.

## Best Practices

* [Microsoft RulesEngine](/framework/building-blocks/rules-engine/microsoft): A rules engine based on [`RulesEngine`](https://github.com/microsoft/RulesEngine), which provides a simple way to store rules outside of the core system logic, ensuring that any changes to the rules do not affect the core system.