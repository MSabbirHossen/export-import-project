# 🌐 Import Export Hub

A full-stack MERN marketplace platform that connects exporters with importers. Browse products, manage listings, and streamline the import-export process.

**[🚀 View Live Demo](https://import-export-hub-client.vercel.app/)**

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Links](#quick-links)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Setup Paths](#setup-paths)
- [What You Need](#what-you-need)
- [Success Criteria](#success-criteria)
- [Next Steps](#next-steps)
- [Learning Resources](#learning-resources)
- [Support](#support)

---

## Overview

**Import Export Hub** is a production-ready MERN stack application designed for users to:
- **Exporters**: List and manage export products with detailed information
- **Importers**: Browse available products and manage their imports
- **All Users**: Authenticate securely via Firebase, track activity, and manage profiles

The application features a React frontend (hosted on Vercel), an Express backend API, Firebase authentication, and MongoDB for data persistence.

---

## ✨ Features

- ✅ **User Authentication** - Firebase email/password and Google OAuth
- ✅ **Product Management** - Create, update, delete export listings
- ✅ **Import System** - Browse and import products from other exporters
- ✅ **RESTful API** - Clean, well-documented backend endpoints
- ✅ **Real-time Updates** - Instant product and import notifications
- ✅ **Rate Limiting & Security** - Helmet headers, CORS, request throttling
- ✅ **MongoDB Integration** - Cloud database for persistence
- ✅ **Responsive UI** - Works on desktop, tablet, and mobile
- ✅ **Error Handling** - Comprehensive validation and user-friendly error messages

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side navigation
- **Axios** - HTTP client for API calls
- **Firebase SDK** - Authentication and real-time updates

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB Atlas** - Cloud NoSQL database
- **Mongoose** - MongoDB ODM
- **Firebase Admin SDK** - JWT verification and admin operations
- **Helmet** - Security middleware
- **Express Rate Limit** - Request throttling

### DevOps & Deployment
- **Vercel** - Frontend hosting
- **Render/Railway** - Backend hosting options
- **MongoDB Atlas** - Database hosting
- **GitHub** - Version control

---

## 🔗 Quick Links

| Resource | Link | Time |
|----------|------|------|
| **Live Demo** | [https://import-export-hub-client.vercel.app/](https://import-export-hub-client.vercel.app/) | - |
| **Quick Start Guide** | [QUICK_START.md](./QUICK_START.md) | 5 min |
| **Detailed Setup** | [MANUAL_SETUP_GUIDE.md](./MANUAL_SETUP_GUIDE.md) | 30 min |
| **API Reference** | [CLIENT_SERVER_INTEGRATION.md](./CLIENT_SERVER_INTEGRATION.md) | 10 min |
| **Setup Checklist** | [SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md) | 20 min |

---

## 📂 Project Structure

```
export-import-project/
├── 📄 README.md                      (This file - Project overview)
├── 📄 SETUP_DOCUMENTATION.md         (Setup summary with 4 guide links)
├── 📄 QUICK_START.md                 (5-min fast setup path)
├── 📄 MANUAL_SETUP_GUIDE.md          (30-min detailed setup)
├── 📄 CLIENT_SERVER_INTEGRATION.md   (API & frontend integration)
├── 📄 SETUP_CHECKLIST.md             (Phase-by-phase verification)
│
├── backend/                          (Express + MongoDB API)
│   ├── src/
│   │   ├── config/                   (Firebase & MongoDB setup, Swagger)
│   │   ├── app.js                    (Express middleware & routes)
│   │   ├── server.js                 (Entry point)
│   │   ├── routes/                   (API endpoints: users, products, imports, analytics, notifications)
│   │   ├── controllers/              (Business logic layer)
│   │   ├── models/                   (Mongoose schemas)
│   │   ├── middlewares/              (Auth, error handling, validation)
│   │   └── utils/                    (Security, helpers)
│   ├── tests/                        (Jest/Mocha test suite)
│   ├── package.json                  (Dependencies & scripts)
│   ├── .env.example                  (Environment template)
│   └── README.md                     (Backend API documentation)
│
└── import-export-hub-client/         (React + Vite frontend - Vercel hosted)
    ├── src/
    │   ├── pages/                    (Route components: Home, Products, Import, Profile)
    │   ├── components/               (Reusable UI components)
    │   ├── hooks/                    (Custom hooks: useProducts, useImports, useAuth)
    │   ├── utils/
    │   │   └── api.js                (Axios client with JWT auth, error handling)
    │   ├── context/                  (Global state: Auth, Products, Imports)
    │   └── App.jsx                   (Main app component)
    ├── package.json                  (React dependencies & build scripts)
    ├── vite.config.js                (Vite build configuration)
    ├── .env.example                  (Environment template)
    └── vercel.json                   (Vercel deployment config)
```

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have:

- **Node.js** v16+ and **npm** v8+ installed
- **Git** for cloning the repository
- Ports **5000** (backend) and **5173** (frontend) available locally
- Stable internet connection

### Choose Your Setup Path

#### ⏱️ **Path 1: I'm in a Hurry (5 minutes)**

```bash
# 1. Create .env files in backend/ and import-export-hub-client/
# 2. Add your credentials
# 3. Terminal 1: cd backend && npm install && npm run dev
# 4. Terminal 2: cd import-export-hub-client && npm install && npm run dev
```

👉 See [QUICK_START.md](./QUICK_START.md) for exact steps

#### 📚 **Path 2: I Want Complete Understanding (30 minutes)**

👉 See [MANUAL_SETUP_GUIDE.md](./MANUAL_SETUP_GUIDE.md) for detailed instructions with screenshots

#### ✅ **Path 3: I Like Checklists**

👉 Use [SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md) to track progress through 9 setup phases

#### 🔌 **Path 4: I Just Need API Info**

👉 See [CLIENT_SERVER_INTEGRATION.md](./CLIENT_SERVER_INTEGRATION.md) for code examples and API reference

---

## 📋 What You Need

### 1. Create External Accounts

**Firebase** (5 min)
- Go to https://firebase.google.com
- Create new project
- Enable: Email/Password authentication + Google Sign-in
- Get credentials from Project Settings

**MongoDB** (5 min)
- Go to https://www.mongodb.com/cloud/atlas
- Create account & free cluster
- Create database user
- Whitelist your IP address
- Copy connection string

**Google OAuth** (5 min - Optional)
- Go to https://console.cloud.google.com
- Create OAuth 2.0 credentials
- Add `localhost:5173` to authorized origins

### 2. Create Environment Files

**`backend/.env`**
```env
# Firebase Admin SDK (from Firebase Console → Settings → Service Accounts)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN...-----END-----\n"
FIREBASE_CLIENT_EMAIL=your-email@iam.gserviceaccount.com

# MongoDB Atlas (from Atlas → Cluster → Connect)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/import-export-hub?retryWrites=true&w=majority

# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**`import-export-hub-client/.env`**
```env
# Firebase Web Config (from Firebase Console → Project Settings)
VITE_FIREBASE_API_KEY=xxxxx
VITE_FIREBASE_AUTH_DOMAIN=xxxxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=xxxxx
VITE_FIREBASE_STORAGE_BUCKET=xxxxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=xxxxx
VITE_FIREBASE_APP_ID=1:xxxxx:web:xxxxx

# Backend API URL
VITE_API_URL=http://localhost:5000/api

# Optional: Google OAuth Client ID
VITE_GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
```

### 3. Install & Run

```bash
# Terminal 1: Backend Server
cd backend
npm install
npm run dev
# ✅ Should show: "Server is running" at http://localhost:5000

# Terminal 2: Frontend Application
cd import-export-hub-client
npm install
npm run dev
# ✅ Should show: "http://localhost:5173" and auto-open in browser
```

---

## ✅ Success Criteria

Your setup is complete when all items below are checked:

- ✅ Backend running on port 5000 (no errors in terminal)
- ✅ Frontend running on port 5173 (Vite dev server active)
- ✅ Can access http://localhost:5173 in browser
- ✅ Homepage displays products list
- ✅ Can create a new account (register)
- ✅ Can login with your account
- ✅ Can create products (as exporter)
- ✅ Can import products (as importer)
- ✅ No errors in browser console
- ✅ No errors in terminal windows
- ✅ MongoDB Atlas shows data in collections
- ✅ All `.env` files configured correctly

---

## 🏗️ Architecture Overview

```
                    Your Laptop
┌─────────────────────────────────────────────────────┐
│                                                     │
│  Frontend (React + Vite)    Backend (Express)      │
│  :5173                      :5000                   │
│  ┌─────────────────┐      ┌──────────────────┐     │
│  │ • React Router  │      │ • REST API       │     │
│  │ • Components    │      │ • Rate Limiting  │     │
│  │ • Firebase Auth │──────→ • CORS           │     │
│  │ • API Hooks     │      │ • Middlewares    │     │
│  │ • State Context │      │ • Controllers    │     │
│  └─────────────────┘      │ • Mongoose ORM   │     │
│         ↓                 └──────────────────┘     │
│    Vite Dev Server              ↓                 │
│    Hot Reload            MongoDB Connection      │
│                                                   │
└─────────────────────────────────────────────────────┘
         ↓ (via Firebase SDK)
    Firebase Cloud
    • Email/Password Auth
    • Google OAuth
    • JWT Tokens
    • User Profiles

         ↓ (via MongoDB URI)
    MongoDB Atlas (Cloud)
    • Users Collection
    • Products Collection
    • Imports Collection
    • Notifications Collection
```

### Data Flow Example: Creating a Product

```
User fills export product form
         ↓
Clicks "Add Product" button
         ↓
useProducts hook calls productAPI.create()
         ↓
API utility (api.js) attaches Firebase JWT token
         ↓
Backend receives POST /api/products request
         ↓
Authentication middleware verifies JWT with Firebase
         ↓
Product controller validates input
         ↓
Mongoose schema enforces data integrity
         ↓
MongoDB saves to Products collection
         ↓
Backend returns created product to frontend
         ↓
Frontend state updates with new product
         ↓
UI re-renders and shows product in list
```

---

## 📈 Next Steps After Setup

1. **Create test accounts**
   - One as an exporter (to list products)
   - One as an importer (to browse and import)

2. **Add sample data**
   - Create 5-10 products as exporter
   - Browse and import some as importer

3. **Explore the API**
   - Visit http://localhost:5000/api/docs for Swagger documentation
   - Use Postman to test endpoints
   - Check API request/response patterns

4. **Understand the codebase**
   - Read backend/src/routes/ to see endpoint structure
   - Read import-export-hub-client/src/hooks/ to see data fetching patterns
   - Trace the authentication flow from Firebase to backend

5. **Make customizations**
   - Add new product fields
   - Create custom notifications
   - Extend the import system with bulk operations

6. **Deploy when ready**
   - Backend: Push to GitHub, deploy to Render/Railway
   - Frontend: Already hosting on Vercel
   - MongoDB: Already on MongoDB Atlas

---

## 📚 Documentation Files

| File | Purpose | Read Time | Audience |
|------|---------|-----------|----------|
| **README.md** | This file - Project overview & quick reference | 10 min | Everyone |
| **QUICK_START.md** | Fastest setup path with 5 essential steps | 5 min | Developers in a hurry |
| **MANUAL_SETUP_GUIDE.md** | Complete detailed setup with screenshots & explanations | 30 min | New to MERN/Firebase/MongoDB |
| **CLIENT_SERVER_INTEGRATION.md** | API reference with code examples & patterns | 10 min | Developers building features |
| **SETUP_CHECKLIST.md** | Phase-by-phase verification checklist | 20 min | Following step-by-step |

---

## 🎓 Learning Resources

- **Firebase Documentation**: https://firebase.google.com/docs
- **MongoDB Documentation**: https://docs.mongodb.com
- **Express.js Guide**: https://expressjs.com
- **React Documentation**: https://react.dev
- **Vite Guide**: https://vitejs.dev
- **Mongoose ODM**: https://mongoosejs.com
- **Axios HTTP Client**: https://axios-http.com

---

## 🔐 Security Features

- **Helmet.js** - Sets HTTP security headers
- **CORS** - Controls cross-origin requests (frontend URL whitelisted)
- **Rate Limiting** - Prevents brute force and API abuse
- **Firebase JWT Verification** - Secures all API endpoints
- **Environment Variables** - Keeps secrets out of code
- **MongoDB IP Whitelist** - Restricts database access
- **Input Validation** - Protects against malicious data

---

## 🆘 Troubleshooting Quick Reference

| Issue | Solution |
|-------|----------|
| Port 5000/5173 already in use | Change PORT in backend/.env or use `lsof -i :5000` to find process |
| MongoDB connection fails | Check connection string in .env, verify IP whitelist in MongoDB Atlas |
| Firebase authentication error | Verify FIREBASE_PROJECT_ID and FIREBASE_PRIVATE_KEY match exactly |
| CORS errors | Ensure FRONTEND_URL in backend/.env matches your frontend URL |
| Cannot import axios | Run `npm install axios` in import-export-hub-client folder |
| Frontend not connecting to backend | Check VITE_API_URL in .env, verify backend is running |
| "env is not defined" error | Make sure you've created `.env` files (not `.env.example`) |

👉 See **MANUAL_SETUP_GUIDE.md → Troubleshooting** for detailed fixes

---

## 📞 Support & Help

**For setup issues:**
- See [MANUAL_SETUP_GUIDE.md](./MANUAL_SETUP_GUIDE.md) → Troubleshooting section

**For API/integration issues:**
- See [CLIENT_SERVER_INTEGRATION.md](./CLIENT_SERVER_INTEGRATION.md) → Code examples

**To track your progress:**
- Use [SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md)

**For fastest setup:**
- Follow [QUICK_START.md](./QUICK_START.md)

---

## 📝 Version History

| Version | Date | Status | Notes |
|---------|------|--------|-------|
| 1.0 | May 11, 2026 | ✅ Production Ready | Initial release with full stack |
| Current | July 2, 2026 | ✅ Production Ready | README reorganized, live demo link added |

---

## ✨ What's Included

✅ **Complete MERN Stack** - Frontend, backend, database all configured  
✅ **Frontend Deployed** - Live on Vercel at https://import-export-hub-client.vercel.app/  
✅ **Production Code** - Ready for development and deployment  
✅ **MongoDB Integration** - Cloud database with schemas  
✅ **Firebase Authentication** - Secure user auth system  
✅ **REST API** - All endpoints pre-configured  
✅ **Comprehensive Documentation** - 5 guides for different needs  
✅ **Security Built-in** - Helmet, CORS, rate limiting, JWT  
✅ **Error Handling** - Graceful error responses  
✅ **Ready to Deploy** - Instructions for Vercel, Render, Railway  

---

## 🎯 Summary

**Everything is ready. You just need to:**

1. Create accounts (Firebase, MongoDB)
2. Add credentials to `.env` files
3. Run `npm install` in both folders
4. Run `npm run dev` in both folders
5. Start building amazing import-export features!

---

## 👨‍💻 Made with ❤️ for MERN Learners

This project is designed to teach full-stack development with modern tools and best practices.

**Ready to get started?**

→ **[Visit the Live Demo](https://import-export-hub-client.vercel.app/)**  
→ **[Read QUICK_START.md](./QUICK_START.md)**  
→ **[Read MANUAL_SETUP_GUIDE.md](./MANUAL_SETUP_GUIDE.md)**

---

<div align="center">

**Last Updated:** July 2, 2026  
**Status:** ✅ Production Ready  
**License:** ISC

</div>
