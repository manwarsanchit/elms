# Employee Leave Management System

A full-stack web application where employees can register, log in, apply for leave, and track request status, while admins review, approve, or reject requests.

## Tech Stack

- **Backend:** Java 17, Spring Boot, Spring Security, Spring Data JPA, JWT
- **Frontend:** React, React Router, Axios, Bootstrap
- **Database:** MySQL

## Features

- Employee registration and login with hashed passwords
- JWT-based authentication and role-based access control
- Apply for leave, view personal leave history, edit/cancel pending requests
- Admin dashboard: view all requests, filter by status/type, approve/reject (with optional date adjustment)
- Validation and proper error handling throughout

## Project Structure

```
Project/
├── backend/       Spring Boot REST API
├── frontend/      React application
└── queries.sql    Required SQL queries
```

## Prerequisites

- Java 17+
- Node.js and npm
- MySQL Server

## Setup Instructions

### 1. Database

Create an empty database:
```sql
CREATE DATABASE leave_management;
```
Tables are created automatically on first run (Hibernate `ddl-auto=update`) — no manual table creation needed.

### 2. Backend

Inside `backend/`, create `src/main/resources/application.properties` with the following (not included in this repo, since it contains local secrets):

```properties
spring.application.name=backend
spring.datasource.url=jdbc:mysql://localhost:3306/leave_management
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
server.port=8082
jwt.secret=YOUR_OWN_LONG_RANDOM_SECRET_STRING_AT_LEAST_32_CHARACTERS
admin.registration.code=YOUR_OWN_ADMIN_CODE
```

Then run:
```
./mvnw spring-boot:run
```
Backend runs at `http://localhost:8082`.

### 3. Frontend

```
cd frontend
npm install
npm run dev
```
Frontend runs at the URL shown in the terminal (typically `http://localhost:5173`).

## Creating an Admin Account

Registration creates a regular `EMPLOYEE` account by default. To register as an admin, select "Admin" on the registration page and enter the code configured as `admin.registration.code` in your `application.properties`.

## API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | /api/auth/register | Register |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Current logged-in user |
| GET | /api/leaves | List your own leave requests |
| POST | /api/leaves | Apply for leave |
| PUT | /api/leaves/{id} | Edit a pending request |
| DELETE | /api/leaves/{id} | Cancel a pending request |
| GET | /api/admin/leaves | Admin: list all (supports `status`/`leaveType` filters) |
| PUT | /api/admin/leaves/{id}/status | Admin: approve/reject |

## SQL Queries

See `queries.sql` in the project root for the required SQL assessment queries.
