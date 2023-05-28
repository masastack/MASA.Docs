# Contribution - Overview

Guidelines for contributing to any MASA project repository

Thank you for your interest in MASA! This document provides guidelines on how to contribute to MASA projects through issues and pull requests. Contributions can also be made through other means, such as interacting with the community in community calls, QQ groups, WeChat groups, commenting on issues or pull requests, etc.

## Issues

### Types of Issues

In most MASA repositories, there are typically four types of issues:

* Bug/Error: You have found an error in the code and want to report it, or create an issue to track the error.
* Discussion: You have some ideas that need to be discussed with others before they can be finalized as proposals.
* Feature Proposal: Used to propose new ideas or features for a project. This allows feedback from others before writing the code.
* Question: If you need help or have a question, use this issue type.

### Before Submitting

Before submitting an issue, please make sure you have checked the following:

1. Check existing issues
   * Before creating a new issue, search the [issue list](https://github.com/masastack/MASA.Framework/issues?q=) to see if the issue or feature request has already been submitted.
   * If you find your issue already exists, add your reaction and comment accordingly.
     * 👍 Thumbs up
     * 👎 Thumbs down
2. For Errors
   * Check that it is not a usage error by reviewing the relevant documentation for the building blocks or implementation, e.g. Minimal APIs should not inject services through constructors.
   * Provide as much detail as possible, such as: `.NET version`, `MASA Framework` version, server system information, and provide complete reproducible steps to help us locate the issue.

   > More detailed information and reproducible steps help to locate and solve issues faster.

## Pull Requests

All contributions come from pull requests. To submit proposed changes, follow the following workflow:

1. If your pull request is not yet complete, temporarily close the pull request or use a draft.
2. Create unit tests for the changed parts.3. Verify that the code adheres to the [recommended coding standards](/framework/contribution/recommend).
4. Wait for the completion of the CI process and ensure that all checks are green. Check the comments on `sonarcloud` to ensure that there are no bugs, vulnerabilities, security issues, or code smells.
5. Update the relevant documentation for the changes made.