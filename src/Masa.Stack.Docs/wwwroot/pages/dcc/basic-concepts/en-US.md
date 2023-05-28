# Basic Concepts

## Introduction

`MASA.DCC` is a distributed configuration center system. As the system grows larger and more services are added, each service may be in different environment clusters. At this time, it is inevitable to use a configuration center to manage our configuration files uniformly, and `MASA.DCC` is a good choice. Its core function depends on `Redis` and can achieve direct interaction between the client and `Redis`, without excessive dependence on the server.

## Environment

Reference: [MASA.PM Environment Introduction](stack/pm/basic-concepts)

## Cluster

Reference: [MASA.PM Cluster Introduction](stack/pm/basic-concepts)

## Project

Reference: [MASA.PM Project Introduction](stack/pm/basic-concepts)

## App

Reference: [MASA.PM Application Introduction](stack/pm/basic-concepts)

## Config Object

### App Config Object

Each application has its own configuration.

### Biz Config Object

Each project has only one business configuration, which extracts the same configuration in the application and puts it in the business configuration. It can also put some project-level business information. This configuration can be read by all applications under the project. The business configuration does not need to be created by yourself, and the system will help you initialize it.

### Public Config Object

Configurations that all projects may use can be placed in the public configuration. Currently, all projects can read it, and all public configurations will be loaded by default when using `MASA.DCC`.