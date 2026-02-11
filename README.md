# Movie Ticket Booking System - MERN

## Overview
A BookMyShow-style movie booking application built with the MERN stack (MongoDB, Express, React, Node.js).
This project features a complete booking flow, simulated payment integration, and a premium Netflix-inspired UI.

## Features

- **Dynamic City & Theatre Selection**: 
  - Auto-seeded major Indian cities (Hyderabad, Bangalore, etc.).
  - Theatres mapped to specific cities.
- **Advanced Seat Booking**:
  - Visual seat map with diffrent layouts (Small, Medium, Large theatres).
  - Seat categories (Silver, Gold, Platinum) with different pricing.
  - Real-time seat locking using Socket.io (Mocked).
- **Booking Flow**:
  - Movie -> City -> Theatre -> Show -> Seats -> Payment -> Confirmation.
- **User Features**:
  - Profile with booking history.
  - **Cancel Ticket** functionality with dummy refund.
- **Admin Dashboard**:
  - Manage Movies and Shows.
  - View revenue stats.

## Tech Stack
- **Frontend**: React, Tailwind CSS, Framer Motion, Lucide Icons.
- **Backend**: Node.js, Express.js, MongoDB.
- **Payment**: Simulated Razorpay flow (Dummy Mode).

## Setup Instructions

1. **Install Dependencies**
   ```bash
   # Backend
   cd backend
   npm install

   # Frontend
   cd frontend
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file in the `backend` folder:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/movietickets
   JWT_SECRET=your_jwt_secret
   ```

3. **Seed Database**
   Populate the database with initial Cities, Theatres, and Shows.
   ```bash
   cd backend
   npm run seed
   ```

4. **Run Application**
   ```bash
   # Backend
   cd backend
   npm start

   # Frontend
   cd frontend
   npm run dev
   ```

## Disclaimer
This project is for **portfolio/demo purposes** only. 
The payment gateway is **simulated** and does not process real transactions. 
No PAN/KYC is required.
