# Deploying MASA Stack Locally with Docker Compose

This article explains how to deploy MASA Stack locally. For your convenience, we will be using [Docker Desktop](https://www.docker.com/products/docker-desktop/) in the environment preparation section, which is also suitable for production environments with K8s.

## Prerequisites

* [Docker](https://www.docker.com/)
* [Dapr](https://dapr.io/)

## Environment Preparation

This document assumes that you have already installed [Docker Desktop](https://www.docker.com/products/docker-desktop/) and [WSL](https://learn.microsoft.com/en-us/windows/wsl/about), and are using [Windows Terminal](https://learn.microsoft.com/en-us/windows/terminal/) based on Windows 11+.

### Download Docker Compose File

Clone the [masahelm](https://github.com/masastack/helm) repository. The `docker` folder in the repository contains relevant Docker Compose files.

> Due to the `SSO` service, it needs to be accessible both locally and inside the container. In the absence of a domain name, an `nginx` proxy is added, and the `host` mapping file needs to be modified to add `127.0.0.1 sso`.

## Install MASA Stack

Execute the following command in the `docker-compose.yml` directory:

```shell
docker-compose up
```

If you see the following result, it means that the startup was successful:

![Docker Compose](https://cdn.masastack.com/stack/doc/stack/docker-compose.pAlthough the `depends_on` dependency in the Docker Compose file restricts the startup order of services, it still cannot guarantee that the prerequisite data initialization is completed when the services start. If some services fail to start, please manually restart them in the order of `PM Service` -> `DCC Service` -> `Auth Service` -> `Other Service` -> `SSO` -> `Other Web`.

Enter the URL `https://localhost:5401/` (PM) in the browser, and the redirect will be as follows:

![Login](https://cdn.masastack.com/stack/doc/stack/docker_stack_login.png)

## Uninstalling MASA Stack

Execute the following command in the `docker-compose.yml` directory:

```shell
   docker-compose down
```