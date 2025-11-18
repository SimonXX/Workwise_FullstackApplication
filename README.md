
# Workwise

https://github.com/user-attachments/assets/6883e31e-6796-406f-b814-768b73049c4e

**LinkedIn-like platform built with Angular and Spring Boot**

---

## Build and start containers

To build the container images and start them, run the following command in the root of the repository:

```bash
docker-compose up
```

This will create and start 3 containers:

```shell
CONTAINER ID   IMAGE                                   COMMAND                  CREATED        STATUS          PORTS                    NAMES
73cd1cfd3986   sistemi_distribuiti-workwise-frontend   "/docker-entrypoint.…"   14 hours ago   Up 22 seconds   0.0.0.0:4200->80/tcp     workwise-frontend
7fb8541b1e22   sistemi_distribuiti-workwise-backend    "java -jar communica…"   14 hours ago   Up 30 seconds   0.0.0.0:8080->8080/tcp   workwise-backend
faa2b1c346b1   postgres:latest                         "docker-entrypoint.s…"   14 hours ago   Up 51 seconds   0.0.0.0:5433->5432/tcp   workwise-db
```

> The `docker-compose.yml` file contains shared network configuration between containers and persistent volume setup.

The running container images will be:

```shell
REPOSITORY                              TAG       IMAGE ID       CREATED        SIZE
sistemi_distribuiti-workwise-frontend   latest    a2a7fed3521b   14 hours ago   190MB
sistemi_distribuiti-workwise-backend    latest    a66ffca6b469   14 hours ago   359MB
postgres                                latest    f23dc7cd74bd   2 months ago   432MB
```

---

The frontend will be accessible at: [http://localhost:4200](http://localhost:4200)

---

Additional Information

For further details about the frontend, please visit the workwise-frontend README
For more information about the backend, see the workwise-backend README

