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

## Setup Instructions

### Prerequisites
- Node.js
- Java 17+
- PostgreSQL
- Firebase Project with Authentication Enabled### Clone Repository
```bash
git clone https://github.com/GraceJulius/LionRide.git
cd LionRide
```

### Frontend Setup
```bash
cd frontend/lionride-frontend
npm install
npm run dev
```

### Backend Setup
```bash
cd backend/lionride-backend
./mvnw spring-boot:run
```

### Environment Variables
Create `.env.local` file in `/frontend/lionride-frontend`:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

## Usage
- Visit `http://localhost:3000`
- Signup as a Rider or Driver
- Request or Accept Rides
- Track Ride Progress Live
- Complete Ride & View Summary

## Future Improvements
- In-app Notifications
- Real-time Chat between Rider & Driver
- Admin Dashboard
- Driver Rating & Feedback System
- Dark/Light Theme Toggle
- Payment Integration (Stripe)

## Contributors
| Name        | Role         | GitHub |
|-------------|--------------|--------|
| Grace Julius | Frontend Developer | [@GraceJulius](https://github.com/GraceJulius) |
| Onyedikachi Kanu (Teammate) | Backend Developer |  |
 
 
