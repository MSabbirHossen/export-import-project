# 🚀 Import Export Hub - Backend API

A production-quality Node.js + Express + MongoDB backend for the Import Export Hub MERN application.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Project Structure](#project-structure)
- [Running the Server](#running-the-server)
- [API Overview](#api-overview)
- [Database Schema](#database-schema)
- [Deployment](#deployment)

## ✨ Features

- ✅ RESTful API with clean architecture
- ✅ Firebase Authentication JWT verification
- ✅ MongoDB Atlas integration
- ✅ MVC pattern with modular structure
- ✅ Centralized error handling
- ✅ Rate limiting & security headers
- ✅ CORS enabled for frontend integration
- ✅ Environment variable configuration
- ✅ Production-ready code structure

## 🛠️ Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB Atlas** - Cloud database
- **Mongoose** - ODM for MongoDB
- **Firebase Admin SDK** - JWT verification
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Rate Limit** - Request rate limiting
- **Nodemon** - Development auto-reload

## 📦 Installation

### Prerequisites

- Node.js 16+ installed
- MongoDB Atlas account & connection string
- Firebase Admin SDK credentials

### Steps

1. **Clone and navigate to backend folder:**

```bash
cd backend
```

2. **Install dependencies:**

```bash
npm install
```

3. **Create `.env` file:**

```bash
cp .env.example .env
```

4. **Configure environment variables** (see [Environment Setup](#environment-setup) section)

## ⚙️ Environment Setup

Create a `.env` file in the `backend` directory with the following variables:

```env
# MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/import-export-hub?retryWrites=true&w=majority

# Server
PORT=5000
NODE_ENV=development

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### How to Get Firebase Credentials

1. Go to Firebase Console → Your Project
2. Settings → Service Accounts
3. Generate new private key (JSON)
4. Copy values to `.env` file

### How to Get MongoDB Connection String

1. MongoDB Atlas → Cluster → Connect
2. Copy connection string
3. Replace `<username>`, `<password>`, and `<dbname>`

## 📂 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/              # Business logic (will add in Phase 3+)
│   ├── models/                   # MongoDB schemas (will add in Phase 3+)
│   ├── routes/                   # API endpoints (will add in Phase 2+)
│   ├── middlewares/              # Custom middlewares (will add in Phase 2+)
│   ├── utils/                    # Utility functions (will add in Phase 5+)
│   ├── app.js                    # Express app configuration
│   └── server.js                 # Server entry point
├── .env.example                  # Example environment variables
├── .gitignore                    # Git ignore rules
├── package.json                  # Dependencies
└── README.md                     # This file
```

## 🚀 Running the Server

### Development Mode (with auto-reload)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

Server will start at: `http://localhost:5000`

### Verify Server Status

```bash
curl http://localhost:5000/api/health
```

Expected response:

```json
{
  "status": "success",
  "message": "Server is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## 📡 API Overview

### Base URL

```
http://localhost:5000/api
```

### Available Endpoints (Coming in next phases)

- **Products** - CRUD operations for products
- **Imports** - User import management
- **Users** - User profile management

### Current Available Routes

- `GET /api` - API root with endpoint overview
- `GET /api/health` - Health check

## 🗄️ Database Schema

### Collections Structure (Coming in Phase 3)

1. **Users** - User profiles and authentication data
2. **Products** - Export/product listings
3. **Imports** - User import records

Details will be added in Phase 3 when models are created.

## 🌐 Deployment

### Deployment Platforms

#### Render

1. Push code to GitHub
2. Create account on Render.com
3. Connect GitHub repository
4. Set environment variables in Render dashboard
5. Deploy

#### Railway

1. Push code to GitHub
2. Create account on Railway.app
3. Create new project from GitHub
4. Add MongoDB plugin
5. Set environment variables
6. Deploy

#### Vercel

1. Push code to GitHub
2. Create account on Vercel.com
3. Import project
4. Set environment variables
5. Deploy

### Database Deployment

- Use MongoDB Atlas (already cloud-hosted)
- Ensure `MONGODB_URI` points to production cluster
- Enable IP whitelist for deployment server

## 📝 Next Phases

- **Phase 2**: Firebase Admin authentication middleware
- **Phase 3**: Product schema & APIs
- **Phase 4**: Import system APIs
- **Phase 5**: Validation & error handling
- **Phase 6**: Search/filter/pagination
- **Phase 7**: Complete documentation & deployment

---

**Made with ❤️ for MERN Learners**
