# Basic Concepts

## Introduction

`MASA.PM` is a highly practical project management tool that effectively combines operations and development, integrating the system environment, clusters, projects, applications, and online environments and clusters. The system standardizes online environments and project development, and works in conjunction with `MASA.DCC`, `MASA.Auth`, `MASA.Scheduler`, and other tools to achieve distributed application configuration management, unified authentication center, task scheduling center, and other functions.

## Environment

An environment is a combination of resources where applications are deployed and run. Commonly used environment definitions include testing, daily, pre-release, and production. An environment can include multiple clusters.

## Cluster

A cluster defines a set of nodes where applications are deployed, such as a `K8s` cluster or a group of virtual machines.

## Project

A project represents a microservice, usually deployed in an independent form and may provide one or more services for providers to call. It is a collection of applications and can be seen as a solution in a `.NET` program.

## App

An app is a collection of interfaces with clear business semantics, provided for consumers to call, usually containing one or more interfaces. The app is the smallest unit in `MASA.PM` and can be seen as a process in a `.NET` program.