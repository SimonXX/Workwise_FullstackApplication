Workwise Backend

The backend of Workwise is a secure, scalable REST API built with Spring Boot. It implements advanced security features to ensure safe and controlled access to the application, leveraging Spring Security and JWT (JSON Web Tokens) for authentication and authorization.

Key Security Features

JWT-Based Authentication:
Stateless authentication using JWT tokens ensures secure communication without relying on server-side sessions, enhancing scalability and performance.

Role-Based Access Control (RBAC):
Access to API endpoints is controlled based on user roles such as CANDIDATE and COMPANY. Only authorized roles can access specific routes, protecting sensitive data and operations.

Password Encryption:
User passwords are securely hashed using BCryptPasswordEncoder, providing strong protection against password attacks.

Custom User Details Service:
A tailored UserDetailsService implementation loads user and company credentials, integrating seamlessly with Spring Security for authentication workflows.

CORS Configuration:
Cross-Origin Resource Sharing (CORS) is configured globally to allow requests from any origin with specified HTTP methods, facilitating frontend-backend communication during development.

Stateless Session Management:
The backend is configured to avoid HTTP sessions, relying solely on JWT tokens, which reduces server load and improves security.
