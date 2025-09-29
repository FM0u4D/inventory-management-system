# inventory-management-system
An end-to-end Inventory Management System (IMS) built with Spring Boot (Java) on the backend and Angular on the frontend. It centralizes products, categories, suppliers, purchases, sales, and transactions with role-based access, JWT authentication, and a modern UI designed for daily retail/warehouse operations.


## ✨ Features

- **Products & Categories**
  - CRUD for products (name, SKU, price, quantity, category, image).
  - CRUD for categories.
  - **Drag-and-drop** reordering persisted via a `position` field.

- **Stock Operations & History**
  - Purchases (increment), Sales (decrement with stock validation), returns, and adjustments.
  - Complete **transaction history** with timestamp, quantity, and optional description.
  - Prevents negative stock (server-side validation).

- **Security**
  - **JWT Authentication** with protected endpoints.
  - **Role-based access** (e.g., only **ADMIN** can add/update/delete products).
  - CORS configured for local development.

- **Media Handling**
  - Product **image upload** via `multipart/form-data`.
  - Static serving of uploaded images.
  - Frontend fallback image for missing/broken URLs.

- **Dashboard & KPIs**
  - At-a-glance metrics (stock levels, recent activity, top movers).
  - Ready for charts (sales vs. purchases) and exports.

---

## 🧱 Tech Stack

- **Frontend:** Angular, TypeScript, RxJS, Angular CDK (drag-drop)
- **Backend:** Spring Boot, Spring Security (JWT), JPA/Hibernate
- **Database:** MySQL (PostgreSQL compatible with config changes)
- **Build/Tooling:** Maven, Node.js/NPM

---

## 🏗️ Architecture

```
Angular SPA
   │  (REST, JSON)
   ▼
Spring Boot API ──► JPA/Hibernate ──► RDBMS (MySQL/PostgreSQL)
          │
          └── Static file serving for uploaded product images
```

- DTO mapping uses `ProductDTO.fromEntity(Product)` for consistent API responses.
- Endpoints are grouped under `/api/**`.

---

## ⚙️ Getting Started

### 1) Prerequisites
- Node.js 18+ and npm  
- Java 17+ (or 21 LTS)  
- Maven 3.9+  
- MySQL 8+ (or Postgres)

### 2) Database (MySQL example)
Create DB and user:
```sql
CREATE DATABASE ims_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'ims_user'@'%' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON ims_db.* TO 'ims_user'@'%';
FLUSH PRIVILEGES;
```

### 3) Backend setup
Create `backend/src/main/resources/application.yml`:
```yaml
server:
  port: 5050

spring:
  datasource:
    url: jdbc:mysql://localhost:3306/ims_db?useSSL=false&serverTimezone=UTC
    username: ims_user
    password: strong_password
  jpa:
    hibernate:
      ddl-auto: update  # use 'validate' in production
    show-sql: false
    properties:
      hibernate.format_sql: true

app:
  jwt:
    secret: "replace_with_strong_secret"
    expiration: 86400000
```

Run:
```bash
cd backend
mvn spring-boot:run
```

### 4) Frontend setup
```bash
cd frontend
npm install
npm start
```

- Frontend: `http://localhost:4200`  
- API: `http://localhost:5050`

---

## 🔐 Authentication & Authorization

- Login returns a JWT; frontend sends `Authorization: Bearer <token>` on protected routes.
- Roles from enum (e.g., `ADMIN`, `MANAGER`); sensitive endpoints use `@PreAuthorize("hasRole('ADMIN')")`.

---

## 📡 API Overview (examples)

**Auth**
```
POST /api/auth/login
{ "email": "admin@ims.dev", "password": "admin123" }
```

**Products**
```
GET    /api/products/all
POST   /api/products/add            # multipart/form-data (ADMIN)
PUT    /api/products/update/{id}    # multipart/form-data (ADMIN)
DELETE /api/products/{id}           # ADMIN
```

**Transactions**
```
POST /api/transactions/purchase   { productId, quantity, description }
POST /api/transactions/sell       { productId, quantity, description }  # validates stock >= quantity
GET  /api/transactions/history
```

**Reorder**
```
PUT /api/products/reorder
[
  { "id": 10, "position": 1 },
  { "id": 5,  "position": 2 }
]
```

---

## 🖼️ Image Upload (multipart)

- Field name: `imageFile` (+ other product fields as `@RequestParam`).
- Stored under `src/main/resources/public/products/` and served statically.
- Frontend uses a fallback image for unavailable resources.

---

## 📁 Project Structure (example)

```
/ (repo root)
├─ backend/
│  ├─ src/main/java/...        # controllers, services, entities, security
│  ├─ src/main/resources/
│  │  └─ public/products/      # uploaded images
│  └─ pom.xml
├─ frontend/
│  ├─ src/app/...
│  ├─ src/assets/products/fallback.png
│  └─ package.json
└─ README.md
```

---

## 🧪 Scripts

**Backend**
```bash
mvn clean install
mvn spring-boot:run
```

**Frontend**
```bash
ng serve
```

---

## 🗺️ Roadmap

- Sales vs. purchases charts on dashboard  
- CSV/XLSX export (products, transactions, low-stock alerts)  
- Bulk import (products)  
- Audit trail & granular permissions  
- Docker Compose (DB + API + UI)

---

## 🧩 Troubleshooting

- **401/403:** Check JWT presence/expiry and user role (ADMIN for restricted endpoints).  
- **CORS:** Ensure backend allows `http://localhost:4200` during development.  
- **Images not loading:** Verify static mapping and file path; ensure upload directory exists.  
- **Reorder not persisting:** Confirm UI sends positions and backend saves `position`.

---

## 📄 License

MIT License. See `LICENSE`.
