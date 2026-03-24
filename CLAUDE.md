# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Workwise is a LinkedIn-like job platform connecting candidates with companies. It uses **Angular 18** (frontend) and **Spring Boot 3.2.5** (backend) with **PostgreSQL 15**, containerized via Docker Compose.

Two user roles: **CANDIDATE** and **COMPANY**, enforced via JWT-based authentication with role-based access control on both frontend (route guards) and backend (Spring Security endpoint authorization).

## Architecture

```
workwise-frontend/  → Angular 18 SPA (TypeScript 5.4, Angular Material 18)
workwise-backend/   → Spring Boot 3.2.5 REST API (Java 17, Maven, Hibernate JPA)
docker-compose.yml  → PostgreSQL 15 + Backend + Frontend (Nginx)
init.sql            → Database schema (credentials, users, companies, job_offers, applications, notifications)
```

**Frontend structure:** `src/app/core/` (guards, services, interceptors, models, constants), `src/app/pages/` (route-level components), `src/app/features/` (job-offers, my-applications, notifications), `src/app/shared/` (reusable dialog components, sidenav).

**Backend structure:** `src/main/java/com/workwise/workwisebackend/` with packages: `controller/`, `entities/`, `repositories/` (includes `modelDTO/` and `mapper/`), `services/`, `configuration/security/`, `support/` (JWT utils, exceptions, request models).

## Build & Run Commands

### Full stack (Docker)
```bash
docker compose up --build        # Build and start all services
docker compose down              # Stop all services
```

### Frontend (workwise-frontend/)
```bash
npm install                      # Install dependencies
ng serve                         # Dev server (port 4200)
ng build                         # Production build → dist/workwise-frontend/
ng test                          # Run Karma/Jasmine tests
ng build --watch --configuration development  # Dev watch mode
```

### Backend (workwise-backend/)
```bash
./mvnw spring-boot:run           # Run dev server (port 8080)
./mvnw clean package             # Build JAR
./mvnw test                      # Run tests
./mvnw test -Dtest=TestClassName  # Run single test class
```

## Key Configuration

- **API base URL** (frontend): `http://localhost:8080/api` defined in `workwise-frontend/src/app/core/constants/endpoints.ts`
- **Dev proxy**: `workwise-frontend/proxy.conf.json` proxies `/api/*` to `localhost:8090`
- **Backend config**: `workwise-backend/src/main/resources/application.yaml`
- **Database**: PostgreSQL on port 5433 (host) → 5432 (container), db name `workwise`
- **Swagger UI**: Available at `/custom/swagger-ui`, OpenAPI docs at `/api-docs`

## Auth Flow

- JWT tokens stored in localStorage (token, refreshToken, email)
- Auth interceptor (`core/interceptors/auth.interceptors.ts`) injects `Authorization: Bearer {token}` header
- Frontend guards: `candidateGuard` and `companyGuard` in `core/guards/` check decoded JWT role
- Backend: `JWTAuthFilter` validates tokens; all `/api/**` endpoints except `/api/auth/**` require authentication
- Public endpoints: `/api/auth/login`, `/api/auth/register/user`, `/api/auth/register/company`, `/api/auth/refresh`

## Testing

- **Frontend**: Karma + Jasmine (`ng test`), H2 in-memory DB used for backend test profile
- **Backend**: Spring Boot Test + Spring Security Test, uses H2 for testing
- TypeScript strict mode is enabled (`noImplicitReturns`, `noImplicitOverride`, `noFallthroughCasesInSwitch`)

## Docker Services

| Service | Port (host→container) | Image |
|---------|----------------------|-------|
| workwise-db | 5433→5432 | postgres:15-alpine |
| workwise-backend | 8080→8080 | Custom (GraalVM build) |
| workwise-frontend | 4200→80 | Custom (Nginx) |

Network: `workwise-net` (bridge). Backend depends on DB; Frontend depends on Backend.
