# Common Questions

### Q: How do I connect to MASA.DCC?

A: Please refer to the [MASA.DCC User Guide](stack/dcc/get-started) and [SDK Integration Example](stack/dcc/sdk-instance).

### Q: Why is there no project data on the team page?

A:
1. Make sure the logged-in account has a team.
2. Make sure the project has been assigned to the team.
3. If the team is incorrect, switch to the corresponding team in the upper right corner.

### Q: Why can't the client get the latest data after modifying the configuration information?

A: After modifying the configuration in DCC, it needs to be published, otherwise it will not affect the configuration currently used by the client.

### Q: Why can't I see the configuration content after encrypting the configuration file?

A: The encrypted configuration will encrypt the configuration content with AES, and only the administrator can see the configuration content in the system. When obtaining the encrypted configuration through the SDK, you need to configure the key first to decrypt the configuration content.

### Q: How to create business configuration?

A: Business configuration does not need to be created manually. It will initialize a business configuration for you when you click into the project details. Each project has only one business configuration, and the cluster environment where the business configuration is located is all cluster environments of the project. You can modify the name of the business configuration by yourself.

### Q: How to create public configuration?

A: Like business configuration, the system will initialize a public configuration for you. The cluster environment where the public configuration is located is all cluster environments created by MASA.PM.

### Q: Why is the configuration content not changed after revoking the configuration?

A: Revoking the configuration only revokes the unpublished configuration, and the published configuration will not be revoked. The published configuration can only be rolled back to the previous version. 

### Q: Why is the configuration content not changed after rolling back, but there is a "modified" label?

A: Rolling back does not affect the configuration currently being modified. The current configuration has been modified compared to the previous version, so the "modified" label will appear. If you want to see the content of the previous version on the interface, you can undo it after rolling back.

We will continue to collect more FAQs.