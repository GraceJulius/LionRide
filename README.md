# LionRide

LionRide is a ride-sharing web application tailored for Lincoln University students. This project aims to connect student drivers and riders, facilitating affordable and convenient transportation on campus.

## Table of Contents
- [About LionRide](#about-lionride)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup Instructions](#setup-instructions)
- [Usage](#usage)
- [Future Improvements](#future-improvements)
- [Contributors](#contributors)

## About LionRide
LionRide is a student-focused ride-sharing platform built to help Lincoln University students quickly request rides from their peers while allowing student drivers to earn extra income. This project was developed as part of an initiative to enhance student mobility, promote safety, and encourage entrepreneurship within the Lincoln University community.


## Features
### Rider Features:
- Rider Signup & Login (Lincoln Email Required)
- Request a Ride
- View Estimated Fare
- Live Driver Location Tracking
- Ride Status Updates
- Ride History
- View Ride Summary After Completion

### Driver Features:
- Driver Signup & Login
- View Available Rides
- Accept Ride Requests
- Start & Complete Rides

## Tech Stack
### Frontend:
- Next.js
- JavaScript
- CSS
- ShadCN
- Vercel
- Google Maps API

### Backend:
- Java
- Spring Boot
- Render
- Layered Architecture (Controller → Service → Repository
- PostgreSQL via NEON
- ACID Compliant
- Hosting (Serverless, autoscaling)

### Authentication:
- Firebase Authentication

Project Structure:
------------------
- /frontend     → Next.js app (user interface)
- /backend      → Spring Boot app (REST APIs and business logic)


## Setup Instructions

### Prerequisites
- Node.js
- Java 17+
- PostgreSQL
- Firebase Project with Authentication Enabled

### Clone Repository
```bash
git clone https://github.com/GraceJulius/LionRide.git
cd LionRide
```

### Frontend Setup (Next.js)

1. Navigate to the frontend directory:
   ```bash
   cd frontend/lionride-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
   NEXT_PUBLIC_FIREBASE_APP_ID=
   NEXT_PUBLIC_API_BASE_URL=
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend/lionride-backend
   ```
#### Option 1: IntelliJ Run Configuration (For Devs using IntelliJ)
1. Go to **Run > Edit Configurations...**
2. Under your Spring Boot app, add the following environment variables:
   ```env
   FIREBASE_SERVICE_ACCOUNT_JSON=
   SPRING_DATASOURCE_PASSWORD_DEV=
   SPRING_DATASOURCE_URL_DEV=
   SPRING_DATASOURCE_USERNAME_DEV=
   SPRING_PROFILES_ACTIVE=
   GOOGLE_MAPS_API_KEY=
   ```
3. Click **Apply** and run the project.

#### Option 2: application.properties (For non-IntelliJ users)
1. Open `src/main/resources/application.properties`
2. Add the following properties in the dev-properties:
   ```properties
   spring.datasource.url=jdbc:postgresql://your-db-host:5432/your-db-name
   spring.datasource.username=your_db_user
   spring.datasource.password=your_db_password

   firebase.config.json=
   google.maps.api.key=
   ```
3. Build and run:
   ```bash
   ./mvnw spring-boot:run
   ```
The backend will run at http://localhost:8080

## Usage
- Visit `http://localhost:3000`
- Signup as a Rider or Driver
- Request or Accept Rides
- Track Ride Progress Live
- Complete Ride & View Summary

## Future Improvements
- In-app Notifications
- Real-time Chat between Rider & Driver
- Driver Rating & Feedback System
- Dark/Light Theme Toggle
- Payment Integration (Stripe)

## Contributors
| Name        | Role         | GitHub |
|-------------|--------------|--------|
| Grace Julius | Frontend Developer | [@GraceJulius](https://github.com/GraceJulius) |
| Onyedikachi Kanu (Teammate) | Backend Developer |  |
 
 
