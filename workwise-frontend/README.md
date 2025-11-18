# Workwise Frontend

The frontend of Workwise is built with **Angular**, providing a dynamic and secure single-page application (SPA) experience. It implements role-based route protection to ensure only authorized users can access specific areas of the app.

## Routing and Security

* **Role-Based Route Guards:**
  Routes are protected using Angular `CanActivate` guards (`candidateGuard` and `companyGuard`) that verify the user’s role extracted from a JWT token stored in localStorage. This ensures that candidates and companies can only access their respective secured areas.

* **Defined Routes:**
  The application includes routes for:

  * Public pages: Home, Login, Candidate registration, Company registration.
  * Secured areas: Candidate Area (protected by `candidateGuard`), Company Area and Company Profile (protected by `companyGuard`).
  * Shared routes like Job Offers and Candidate Profile, with flexible access control.

* **Lazy and Modular Routing:**
  The routes are structured modularly using Angular's `RouterModule` for scalability and maintainability.

## Example Routes

| Path                       | Component                  | Guard             | Description                 |
| -------------------------- | -------------------------- | ----------------- | --------------------------- |
| `/`                        | HomeComponent              | None              | Public landing page         |
| `/login`                   | LoginComponent             | None              | User login page             |
| `/register-as-a-candidate` | RegisterCandidateComponent | None              | Candidate registration      |
| `/register-as-a-company`   | RegisterCompanyComponent   | None              | Company registration        |
| `/candidateArea`           | CandidateAreaComponent     | candidateGuard    | Secured candidate dashboard |
| `/companyArea`             | CompanyAreaComponent       | companyGuard      | Secured company dashboard   |
| `/jobOffers`               | JobOffersComponent         | None              | Public job offers listing   |
| `/profile`                 | CandidateProfileComponent  | (optional guards) | Candidate profile           |
| `/profileCompany`          | CompanyProfileComponent    | companyGuard      | Company profile             |

## Guards Logic

* **CandidateGuard:**
  Checks if the logged-in user’s role is `"CANDIDATE"`. If not, redirects to `/login`.

* **CompanyGuard:**
  Checks if the logged-in user’s role is `"COMPANY"`. If not, redirects to `/login`.

Both guards rely on an `AuthService` method to decode the JWT token and extract the role.


