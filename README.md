# Workwise

A modern, full-stack job platform inspired by LinkedIn — connecting candidates with companies through an intuitive, professional interface.

Built as a portfolio project to demonstrate expertise in **Angular**, **Spring Boot**, **PostgreSQL**, and **Docker**.

https://github.com/user-attachments/assets/6883e31e-6796-406f-b814-768b73049c4e

---

## Key Features

**For Candidates:**
- Browse and search available job offers with filters (title, location, company)
- Apply to positions with one click and track application status in real time
- Upload and manage CV (PDF) directly from the profile
- Receive instant notifications on application updates

**For Companies:**
- Create, edit, and manage job offers with expiry dates
- Review incoming applications with full candidate details and CV download
- Accept, reject, or set applications as pending
- Get notified when new applications arrive

**Platform:**
- JWT-based authentication with role-based access control (Candidate / Company)
- Responsive LinkedIn-style UI with professional design
- Paginated lists with real-time search and filtering
- Profile management with editable personal/company information

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Angular 18, TypeScript 5.4, Angular Material 18 |
| **Backend** | Spring Boot 3.2.5, Java 17, Spring Security, JPA/Hibernate |
| **Database** | PostgreSQL 15 |
| **Auth** | JWT (JJWT), BCrypt password hashing |
| **API Docs** | SpringDoc OpenAPI (Swagger UI) |
| **Deployment** | Docker & Docker Compose, Nginx |

---

## Quick Start

**Prerequisites:** Docker and Docker Compose installed.

```bash
# Clone the repository
git clone https://github.com/your-username/workwise.git
cd workwise

# Build and start all services
docker compose up --build
```

That's it. Three containers will spin up automatically:

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | [http://localhost:4200](http://localhost:4200) | Angular app served via Nginx |
| **Backend** | [http://localhost:8080](http://localhost:8080) | Spring Boot REST API |
| **Database** | `localhost:5433` | PostgreSQL 15 |

> **Note:** The database credentials in `docker-compose.yml` are for development purposes only. In a production environment, use environment variables or a secrets manager.

### API Documentation

Once the backend is running, Swagger UI is available at:
[http://localhost:8080/custom/swagger-ui](http://localhost:8080/custom/swagger-ui)

---

## Architecture

```
┌──────────────────────────────────────────────────────┐
│                    Docker Network                     │
│                                                      │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐ │
│  │   Angular    │  │  Spring Boot │  │ PostgreSQL  │ │
│  │   (Nginx)   │──│   REST API   │──│     15      │ │
│  │  Port 4200  │  │  Port 8080   │  │  Port 5433  │ │
│  └─────────────┘  └──────────────┘  └─────────────┘ │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Frontend** → Angular 18 SPA with standalone components, route guards for role-based access, HTTP interceptors for JWT injection and token refresh.

**Backend** → Stateless REST API with Spring Security, custom JWT filter, and controller-service-repository layered architecture.

**Database** → PostgreSQL with 7 tables: credentials, roles, users, companies, job_offers, applications, notifications. Schema auto-managed by Hibernate.

---

## Project Structure

```
workwise/
├── docker-compose.yml          # Multi-container orchestration
├── init.sql                    # Database schema initialization
├── workwise-frontend/          # Angular 18 application
│   └── src/app/
│       ├── core/               # Guards, interceptors, services, models
│       ├── pages/              # Route-level components
│       ├── features/           # Job offers, applications, notifications
│       └── shared/             # Reusable dialog components
└── workwise-backend/           # Spring Boot 3.2.5 application
    └── src/main/java/.../
        ├── controller/         # REST endpoints
        ├── services/           # Business logic
        ├── entities/           # JPA entities
        ├── repositories/       # Data access + DTOs
        ├── configuration/      # Security & CORS config
        └── support/            # JWT utilities & exceptions
```

---

## Development

### Frontend (Angular)

```bash
cd workwise-frontend
npm install
ng serve            # Dev server at http://localhost:4200
ng test             # Run unit tests
ng build            # Production build
```

### Backend (Spring Boot)

```bash
cd workwise-backend
./mvnw spring-boot:run    # Dev server at http://localhost:8080
./mvnw test               # Run tests
./mvnw clean package      # Build JAR
```

---

## License

This project is intended as a portfolio demonstration.
