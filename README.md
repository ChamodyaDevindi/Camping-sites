# 🏕️ CampNest - Camping Site Booking Platform

Welcome to **CampNest**, a modern and comprehensive full-stack web application designed for browsing, managing, and booking camping sites. This platform allows outdoor enthusiasts to discover camping sites, check amenities, track activities, and securely make reservations online.

---

## 📁 Project Structure

Here is the complete project directory tree:

```
camping-site/
├── backend/                           # Spring Boot Java REST API backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/campnest/backend/
│   │   │   │   ├── config/            # Cross-Origin (CORS) & Initial Data seeding
│   │   │   │   │   ├── DataSeeder.java
│   │   │   │   │   └── WebMvcConfig.java
│   │   │   │   ├── controller/        # REST Controllers (Endpoints)
│   │   │   │   │   ├── AdminController.java
│   │   │   │   │   ├── AuthController.java
│   │   │   │   │   ├── CampsiteController.java
│   │   │   │   │   ├── FileUploadController.java
│   │   │   │   │   └── ReservationController.java
│   │   │   │   ├── dto/               # Data Transfer Objects
│   │   │   │   │   ├── JwtResponse.java
│   │   │   │   │   ├── LoginRequest.java
│   │   │   │   │   ├── MessageResponse.java
│   │   │   │   │   ├── ReservationDto.java
│   │   │   │   │   ├── ReservationRequest.java
│   │   │   │   │   └── SignupRequest.java
│   │   │   │   ├── entity/            # JPA/Hibernate Entities (Database Models)
│   │   │   │   │   ├── Activity.java
│   │   │   │   │   ├── Campsite.java
│   │   │   │   │   ├── Equipment.java
│   │   │   │   │   ├── Facility.java
│   │   │   │   │   ├── Payment.java
│   │   │   │   │   ├── Reservation.java
│   │   │   │   │   ├── Role.java
│   │   │   │   │   └── User.java
│   │   │   │   ├── repository/        # Spring Data JPA Repositories
│   │   │   │   │   ├── CampsiteRepository.java
│   │   │   │   │   ├── ReservationRepository.java
│   │   │   │   │   └── UserRepository.java
│   │   │   │   ├── security/          # Spring Security & JWT Filter config
│   │   │   │   │   ├── AuthEntryPointJwt.java
│   │   │   │   │   ├── AuthTokenFilter.java
│   │   │   │   │   ├── JwtUtils.java
│   │   │   │   │   ├── UserDetailsImpl.java
│   │   │   │   │   ├── UserDetailsServiceImpl.java
│   │   │   │   │   └── WebSecurityConfig.java
│   │   │   │   ├── service/           # Business Logic Interfaces & Implementations
│   │   │   │   │   ├── impl/
│   │   │   │   │   │   └── ReservationServiceImpl.java
│   │   │   │   │   ├── CampsiteService.java
│   │   │   │   │   ├── CampsiteServiceImpl.java
│   │   │   │   │   └── ReservationService.java
│   │   │   │   └── CampNestApplication.java # Spring Boot Entry Point
│   │   │   └── resources/
│   │   │       ├── application.properties # Database/Security setup properties
│   │   │       ├── static/
│   │   │       └── templates/
│   │   └── test/
│   │       └── java/com/campnest/backend/
│   │           └── CampNestApplicationTests.java
│   ├── uploads/                       # User-uploaded campsite pictures
│   ├── mvnw                           # Maven Wrapper (Linux)
│   ├── mvnw.cmd                       # Maven Wrapper (Windows)
│   └── pom.xml                        # Maven dependencies & build configuration
└── frontend/                          # Vite + React Single-Page Application (SPA)
    ├── public/                        # Static assets (Favicons, SVG icons)
    │   ├── favicon.svg
    │   └── icons.svg
    ├── src/
    │   ├── assets/                    # Images & CSS/SVG resources
    │   │   ├── hero.png
    │   │   ├── react.svg
    │   │   └── vite.svg
    │   ├── components/                # Shared layout & reusable React components
    │   │   ├── Footer.jsx
    │   │   ├── Navbar.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── context/                   # Context API for Global Auth state
    │   │   └── AuthContext.jsx
    │   ├── pages/                     # Routed view components
    │   │   ├── AddCampsite.jsx
    │   │   ├── AdminDashboard.jsx
    │   │   ├── CampsiteDetails.jsx
    │   │   ├── Campsites.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── EditCampsite.jsx
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── MyBookings.jsx
    │   │   └── Register.jsx
    │   ├── services/                  # API clients/Axios services for backend communication
    │   │   ├── auth.service.js
    │   │   ├── campsite.service.js
    │   │   └── reservation.service.js
    │   ├── App.css                    # Tailwind / Custom global styling configurations
    │   ├── App.jsx                    # Root React Component & Routing setup
    │   ├── index.css
    │   └── main.jsx                   # Application DOM entry point
    ├── eslint.config.js               # Code quality lint settings
    ├── index.html                     # HTML Template
    ├── package.json                   # NPM dependencies & script actions
    ├── postcss.config.js
    ├── tailwind.config.js             # Tailwind CSS Customization
    └── vite.config.js                 # Vite compilation configs
```

---

## 🛠️ Technology Stack

| Backend | Frontend | Database & Security |
| :--- | :--- | :--- |
| **Java 17 / 21** | **React** (Vite SPA) | **MySQL Database** |
| **Spring Boot 3.x** | **Tailwind CSS** | **Spring Security** |
| **Spring Data JPA / Hibernate** | **Axios** (API Client) | **JSON Web Token (JWT)** |
| **Maven** (Dependency Manager) | **React Router DOM v6** | **Multipart File Upload** |

---

## 🚀 Getting Started

### 📋 Prerequisites
Make sure you have the following installed:
- **Java JDK 17 or higher**
- **Node.js** (v18+ recommended) & npm
- **MySQL Server**

---

### 1. Database Setup
1. Start your local MySQL server.
2. The backend is configured to automatically create the database `campnest_db` if it does not exist:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/campnest_db?createDatabaseIfNotExist=true
   ```
3. If your MySQL server requires a root password, configure it in `backend/src/main/resources/application.properties`:
   ```properties
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

---

### 2. Run the Backend API
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Build and start the Spring Boot application using Maven:
   * **Windows:**
     ```bash
     .\mvnw.cmd spring-boot:run
     ```
   * **macOS/Linux:**
     ```bash
     ./mvnw spring-boot:run
     ```
3. The API server will start on [http://localhost:8080](http://localhost:8080).
4. *Data Seeding:* A `DataSeeder` runs automatically on startup to populate initial user roles and dummy campsite data.

---

### 3. Run the Frontend Client
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to the port output by Vite (usually [http://localhost:5173](http://localhost:5173)).
