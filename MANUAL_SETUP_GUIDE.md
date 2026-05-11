# 🚀 Import Export Hub - Complete Manual Setup Guide

**Version:** 1.0  
**Last Updated:** May 11, 2026  
**Status:** ✅ Production Ready

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Backend Server Setup](#backend-server-setup)
4. [Frontend Client Setup](#frontend-client-setup)
5. [Database Configuration](#database-configuration)
6. [Firebase Configuration](#firebase-configuration)
7. [Connecting Client & Server](#connecting-client--server)
8. [Running the Application](#running-the-application)
9. [Verification Checklist](#verification-checklist)
10. [Troubleshooting](#troubleshooting)

---

## 📦 Prerequisites

### Required Software

- **Node.js**: v16 or higher ([Download](https://nodejs.org/))
- **npm**: v8 or higher (comes with Node.js)
- **Git**: For version control ([Download](https://git-scm.com/))
- **MongoDB Atlas Account**: Free tier available ([Sign up](https://www.mongodb.com/cloud/atlas))
- **Firebase Account**: Free tier available ([Sign up](https://firebase.google.com/))
- **Code Editor**: VS Code recommended ([Download](https://code.visualstudio.com/))
- **Postman** (Optional): For API testing ([Download](https://www.postman.com/))

### System Requirements

- **Disk Space**: ~2GB minimum
- **RAM**: 4GB minimum recommended
- **Internet Connection**: Required for Firebase & MongoDB Atlas
- **Ports Available**: 5000 (backend), 5173 (frontend)

### Verify Installation

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check Git version
git --version
```

---

## 🔧 Environment Setup

### Step 1: Create Environment Files

#### Backend Environment File

**File Location:** `backend/.env`

```env
# ========================================
# MongoDB Atlas Configuration
# ========================================
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/import-export-hub?retryWrites=true&w=majority

# ========================================
# Server Configuration
# ========================================
PORT=5000
NODE_ENV=development

# ========================================
# Firebase Admin SDK Configuration
# Get these from Firebase Console > Project Settings > Service Accounts
# ========================================
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYourPrivateKeyHere...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com

# ========================================
# Frontend Configuration
# ========================================
FRONTEND_URL=http://localhost:5173

# ========================================
# Security & Rate Limiting
# ========================================
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Frontend Environment File

**File Location:** `import-export-hub-client/.env`

```env
# ========================================
# Firebase Client Configuration
# Get these from Firebase Console > Project Settings > General
# ========================================
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here

# ========================================
# Backend API Configuration
# ========================================
VITE_API_URL=http://localhost:5000/api

# ========================================
# Google OAuth (for Google Sign-In)
# Get this from Google Cloud Console
# ========================================
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

### Step 2: Obtain Firebase Credentials

#### For Frontend (Client Config)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click ⚙️ Settings → Project Settings
4. Under "General" tab, find "Your Apps" section
5. Copy the Firebase config values:
   - `apiKey` → VITE_FIREBASE_API_KEY
   - `authDomain` → VITE_FIREBASE_AUTH_DOMAIN
   - `projectId` → VITE_FIREBASE_PROJECT_ID
   - `storageBucket` → VITE_FIREBASE_STORAGE_BUCKET
   - `messagingSenderId` → VITE_FIREBASE_MESSAGING_SENDER_ID
   - `appId` → VITE_FIREBASE_APP_ID

#### For Backend (Admin SDK)

1. Go to Firebase Console → Project Settings
2. Click "Service Accounts" tab
3. Click "Generate New Private Key" button
4. Save the JSON file
5. Extract these values:
   - `project_id` → FIREBASE_PROJECT_ID
   - `private_key` → FIREBASE_PRIVATE_KEY (replace `\n` with actual newlines)
   - `client_email` → FIREBASE_CLIENT_EMAIL
6. **⚠️ IMPORTANT:** Never commit this file to Git

### Step 3: Obtain MongoDB Connection String

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Login/Create Account
3. Create a new cluster (Free tier available)
4. Click "Connect" button
5. Choose "Drivers" → Node.js
6. Copy the connection string
7. Replace `<password>` and `<username>` with your credentials
8. Update `MONGODB_URI` in `backend/.env`

### Step 4: Set Up Google OAuth (Optional but Recommended)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable "Google+ API"
4. Create OAuth 2.0 credentials (Web Application)
5. Add authorized JavaScript origins:
   - `http://localhost:5173`
   - Your production URL (if applicable)
6. Copy Client ID → `VITE_GOOGLE_CLIENT_ID` in frontend `.env`

---

## 🖥️ Backend Server Setup

### Step 1: Install Dependencies

```bash
# Navigate to backend directory
cd backend

# Install all dependencies
npm install

# Verify installation
npm list
```

### Step 2: Verify Environment Configuration

```bash
# Check if .env file exists
ls -la | grep .env

# Verify MongoDB connection
npm run dev
# You should see: ✅ MongoDB Connected: cluster.mongodb.net
# You should see: Server is running ✅
```

### Step 3: Initialize Database Collections

The backend will automatically create MongoDB collections when:

- First user registers
- First product is created
- First import is made

**Collections Created:**

- `users` - User account data
- `products` - Product listings
- `imports` - Import records
- `notifications` - System notifications
- `analytics` - Analytics data

### Step 4: Verify Backend is Running

```bash
# Terminal 1 - Start backend server
cd backend
npm run dev

# Expected output:
# ╔════════════════════════════════════════════╗
# ║   Import Export Hub Backend Server         ║
# ╠════════════════════════════════════════════╣
# ║ Environment: development                   ║
# ║ Port: 5000                                 ║
# ║ Status: Running ✅                         ║
# ╚════════════════════════════════════════════╝
```

### Step 5: Test Backend API (Using Postman or curl)

```bash
# Health check endpoint
curl http://localhost:5000/api/health

# Expected response:
# {
#   "status": "success",
#   "message": "Server is running",
#   "timestamp": "2026-05-11T..."
# }

# API root endpoint
curl http://localhost:5000/api

# Expected response:
# {
#   "status": "success",
#   "message": "Import Export Hub API v1.0",
#   "endpoints": {
#     "health": "/api/health",
#     "products": "/api/products",
#     "imports": "/api/imports",
#     "users": "/api/users"
#   }
# }
```

---

## 💻 Frontend Client Setup

### Step 1: Install Dependencies

```bash
# Navigate to frontend directory
cd import-export-hub-client

# Install all dependencies
npm install

# Verify installation
npm list
```

### Step 2: Verify Environment Configuration

```bash
# Check if .env file exists and is properly configured
cat .env

# Verify all required variables are set (should not be empty)
```

### Step 3: Start Development Server

```bash
# Terminal 2 - Start frontend dev server
npm run dev

# Expected output:
# ➜  Local:   http://localhost:5173/
# ➜  press h to show help
```

### Step 4: Test Frontend Access

- Open browser to `http://localhost:5173`
- You should see the homepage with:
  - Navigation header with logo
  - Hero section with CTA buttons
  - Featured products section
  - Footer

---

## 🗄️ Database Configuration

### MongoDB Collections Schema

#### Users Collection

```javascript
{
  uid: "firebase-uid",                    // Firebase UID (unique)
  email: "user@example.com",
  displayName: "User Name",
  photoURL: "https://...",
  userType: "exporter|importer|both",     // User role
  companyName: "Company Name",
  country: "Country Name",
  phone: "+1234567890",
  createdAt: ISODate("2026-05-11"),
  updatedAt: ISODate("2026-05-11")
}
```

#### Products Collection

```javascript
{
  _id: ObjectId(...),
  productName: "Product Name",
  description: "Product Description",
  category: "Category",
  unitPrice: 100,
  currency: "USD",
  quantity: 50,
  unit: "kg",
  exporterId: "user-uid",
  exporterName: "Exporter Name",
  country: "Country",
  specifications: {
    color: "Red",
    size: "Large",
    // ... other specs
  },
  images: ["url1", "url2"],
  createdAt: ISODate("2026-05-11"),
  updatedAt: ISODate("2026-05-11")
}
```

#### Imports Collection

```javascript
{
  _id: ObjectId(...),
  productId: ObjectId(...),
  importerId: "user-uid",
  importerName: "Importer Name",
  quantity: 10,
  totalPrice: 1000,
  status: "pending|confirmed|shipped|delivered",
  shippingAddress: "Address...",
  paymentStatus: "pending|completed",
  createdAt: ISODate("2026-05-11"),
  updatedAt: ISODate("2026-05-11")
}
```

#### Notifications Collection

```javascript
{
  _id: ObjectId(...),
  recipientId: "user-uid",
  type: "order_update|new_product|system",
  title: "Notification Title",
  message: "Notification Message",
  read: false,
  createdAt: ISODate("2026-05-11")
}
```

---

## 🔥 Firebase Configuration

### Firestore Security Rules

Firebase is used for **Authentication Only** in this architecture.

**File Location:** Firebase Console → Firestore Database → Rules

```javascript
// Firestore Security Rules for Authentication
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write only for authenticated users
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**Note:** All data storage now uses MongoDB, not Firestore. Firebase is only for authentication.

### Firebase Authentication Setup

1. Go to Firebase Console → Authentication
2. Enable Sign-in Methods:
   - ✅ Email/Password
   - ✅ Google Sign-In
3. Configure OAuth Consent Screen:
   - Set User Type: External
   - Add app name, user support email
   - Add scopes: email, profile

### Custom Claims (Optional - For Role-Based Access)

```bash
# Use Firebase CLI to set custom claims
firebase auth:import users.json --hash-algo=scrypt

# Or use Firebase Admin SDK from backend
admin.auth().setCustomUserClaims(uid, { role: 'exporter' })
```

---

## 🔗 Connecting Client & Server

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                   Frontend (React + Vite)                    │
│                  http://localhost:5173                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ • Authentication (Firebase Client SDK)               │   │
│  │ • UI Components & Pages                              │   │
│  │ • Sends API requests to Backend                      │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
           │
           │ HTTP Requests (fetch/axios)
           │ API Base URL: http://localhost:5000/api
           │
           ▼
┌─────────────────────────────────────────────────────────────┐
│                  Backend (Node.js + Express)                 │
│                  http://localhost:5000                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ • Firebase JWT Verification                         │   │
│  │ • REST API Endpoints                                 │   │
│  │ • Business Logic                                     │   │
│  │ • Connects to MongoDB                                │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
           │
           │ MongoDB Connection String
           │
           ▼
    ┌──────────────────────┐
    │   MongoDB Atlas      │
    │   (Cloud Database)   │
    └──────────────────────┘
```

### Frontend API Integration

#### 1. Update Axios/Fetch Configuration

**File:** `import-export-hub-client/src/utils/api.js` (Create if doesn't exist)

```javascript
// API utility for making requests to backend
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  async (config) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login if unauthorized
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
```

#### 2. Update Hooks to Use Backend API

**Example:** Update `useProducts.js` to use backend API instead of Firestore

```javascript
import api from "../utils/api";

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all products from backend
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/products/all");
      setProducts(response.data);
      return response.data;
    } catch (err) {
      setError(err.message);
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Add product via backend
  const addProduct = useCallback(
    async (productData) => {
      try {
        const response = await api.post("/products/add", productData);
        setProducts([response.data, ...products]);
        return response.data;
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    [products],
  );

  // ... rest of the hook
}
```

#### 3. Install Required Dependencies (if using axios)

```bash
cd import-export-hub-client
npm install axios
```

### Backend API Endpoints

All endpoints require `Authorization` header with Firebase JWT token:

```
Authorization: Bearer <firebase-jwt-token>
```

#### Products Endpoints

```
GET    /api/products/latest          - Get latest 6 products
GET    /api/products/all             - Get all products (paginated)
GET    /api/products/search?q=...    - Search products
GET    /api/products/:productId      - Get specific product
POST   /api/products/add             - Create new product (auth required)
PUT    /api/products/:productId      - Update product (auth required)
DELETE /api/products/:productId      - Delete product (auth required)
GET    /api/products/exports/my-exports - Get user's products (auth required)
```

#### Imports Endpoints

```
GET    /api/imports                  - Get all imports (auth required)
GET    /api/imports/:importId        - Get specific import (auth required)
POST   /api/imports                  - Create new import (auth required)
PUT    /api/imports/:importId        - Update import (auth required)
DELETE /api/imports/:importId        - Delete import (auth required)
```

#### Users Endpoints

```
POST   /api/users/register           - Register new user
GET    /api/users/profile            - Get user profile (auth required)
PUT    /api/users/profile            - Update profile (auth required)
```

#### Analytics Endpoints

```
GET    /api/analytics/dashboard      - Get dashboard data (auth required)
GET    /api/analytics/sales          - Get sales analytics (auth required)
GET    /api/analytics/products       - Get product analytics (auth required)
```

---

## 🚀 Running the Application

### Complete Setup Process

#### Terminal 1: Start MongoDB & Backend

```bash
# Navigate to backend
cd backend

# Check MongoDB connection in .env is valid, then:
npm run dev

# Expected Output:
# ✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
# ╔════════════════════════════════════════════╗
# ║   Import Export Hub Backend Server         ║
# ╠════════════════════════════════════════════╣
# ║ Environment: development                   ║
# ║ Port: 5000                                 ║
# ║ Status: Running ✅                         ║
# ╚════════════════════════════════════════════╝
```

#### Terminal 2: Start Frontend

```bash
# Navigate to frontend
cd import-export-hub-client

# Start dev server
npm run dev

# Expected Output:
# ➜  Local:   http://localhost:5173/
# ➜  press h to show help
```

#### Terminal 3 (Optional): Run Tests

```bash
# Test backend
cd backend
npm test

# Test frontend
cd import-export-hub-client
npm run lint
```

### Verify Everything is Running

1. **Backend Health Check**

   ```bash
   curl http://localhost:5000/api/health
   # Should return: {"status":"success","message":"Server is running",...}
   ```

2. **Frontend Access**
   - Visit `http://localhost:5173`
   - Should see home page with header, hero, products, footer

3. **Database Connection**
   - Check MongoDB Atlas dashboard
   - Verify connection activity under "Atlas Metrics"

---

## ✅ Verification Checklist

### Pre-Launch Verification

- [ ] Node.js v16+ installed
- [ ] npm packages installed for backend
- [ ] npm packages installed for frontend
- [ ] MongoDB Atlas account created
- [ ] MongoDB connection string in `backend/.env`
- [ ] Firebase project created
- [ ] Firebase credentials in both `.env` files
- [ ] Google OAuth setup (optional)
- [ ] Port 5000 available (backend)
- [ ] Port 5173 available (frontend)
- [ ] `.env` files created in backend and frontend
- [ ] `.env` files added to `.gitignore`
- [ ] CORS enabled in backend (`backend/src/app.js`)
- [ ] Frontend API URL configured
- [ ] Firebase Security Rules configured

### Functional Verification

After starting both servers:

- [ ] Backend server starts without errors
- [ ] Frontend dev server starts without errors
- [ ] Health check endpoint responds (`:5000/api/health`)
- [ ] Homepage loads in browser (`:5173`)
- [ ] Navigation menu is visible
- [ ] Products display on home page
- [ ] Can navigate to login page
- [ ] Can navigate to products page
- [ ] Firebase authentication modal appears on register
- [ ] No console errors in browser DevTools
- [ ] No console errors in backend terminal

### Database Verification

- [ ] MongoDB Atlas shows active connection
- [ ] Can see queries in Atlas metrics
- [ ] Collections created after first API call

---

## 🔧 Troubleshooting

### Backend Issues

#### Issue: "MONGODB_URI environment variable is not defined"

**Solution:**

1. Check `backend/.env` file exists
2. Verify `MONGODB_URI` key is present
3. Ensure value is not empty
4. Restart backend server

#### Issue: "Firebase Admin SDK initialization error"

**Solution:**

1. Verify Firebase credentials in `.env`
2. Check private key has actual newlines (not `\n` as string)
3. Verify service account JSON was downloaded correctly
4. Ensure `FIREBASE_PROJECT_ID`, `FIREBASE_PRIVATE_KEY`, `FIREBASE_CLIENT_EMAIL` are set

#### Issue: "Port 5000 already in use"

**Solution:**

```bash
# Windows: Find process using port 5000
netstat -ano | findstr :5000

# Kill process (replace PID with actual process ID)
taskkill /PID <PID> /F

# Linux/Mac: Kill process using port 5000
lsof -ti:5000 | xargs kill -9
```

#### Issue: "Cannot connect to MongoDB"

**Solution:**

1. Verify internet connection
2. Check MongoDB Atlas cluster is running
3. Verify IP whitelist includes your IP (MongoDB Atlas > Network Access)
4. Test connection string: `mongodb+srv://username:password@cluster.mongodb.net/test`
5. Ensure credentials are correct (no special characters causing issues)

### Frontend Issues

#### Issue: "VITE_API_URL is undefined"

**Solution:**

1. Create/update `import-export-hub-client/.env` file
2. Add: `VITE_API_URL=http://localhost:5000/api`
3. Restart frontend dev server
4. Clear browser cache (Ctrl+Shift+Del)

#### Issue: "Firebase config not loading"

**Solution:**

1. Verify all Firebase env variables are set in `.env`
2. Ensure they match Firebase Console config exactly
3. Restart frontend server
4. Check `import.meta.env` in browser console

#### Issue: "CORS error when calling backend"

**Solution:**

1. Verify backend `FRONTEND_URL` in `.env` is `http://localhost:5173`
2. Check `backend/src/utils/security.js` CORS config
3. Verify backend CORS middleware is enabled in `app.js`
4. Restart backend server

#### Issue: "Authentication token not persisting"

**Solution:**

1. Check browser localStorage is enabled
2. Verify Firebase auth is initialized correctly
3. Check token is being stored: `localStorage.getItem('user')`
4. Clear localStorage and try logging in again

### Network Issues

#### Issue: "Frontend cannot reach backend"

**Solution:**

```bash
# Test connectivity from frontend
curl http://localhost:5000/api/health

# Or in browser console
fetch('http://localhost:5000/api/health')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)
```

#### Issue: "Network request timeout"

**Solution:**

1. Verify backend is running: `npm run dev`
2. Check internet connection
3. Verify firewall allows ports 5000 and 5173
4. Increase timeout in API configuration (default: 10s)

### Data Issues

#### Issue: "No products showing on home page"

**Solution:**

1. Check backend API is running
2. Verify MongoDB connection is active
3. Verify products collection exists in MongoDB
4. Check browser console for API errors
5. Try manually calling: `curl http://localhost:5000/api/products/latest`

#### Issue: "Cannot create new product"

**Solution:**

1. Verify user is authenticated
2. Check auth token is valid
3. Verify backend has permission to write to MongoDB
4. Check request payload matches schema
5. Check MongoDB collection permissions

---

## 📞 Support & Resources

- **Backend Documentation:** `backend/README.md`
- **Frontend Documentation:** `import-export-hub-client/README.md`
- **API Documentation:** `backend/API_DOCUMENTATION.md`
- **Database Schema:** `backend/DATABASE_SCHEMA.md`
- **Firebase Docs:** [https://firebase.google.com/docs](https://firebase.google.com/docs)
- **MongoDB Docs:** [https://docs.mongodb.com](https://docs.mongodb.com)
- **Express Docs:** [https://expressjs.com](https://expressjs.com)
- **React Docs:** [https://react.dev](https://react.dev)

---

## 🎯 Next Steps After Setup

1. **Create Test Accounts:**
   - Register user as "Exporter"
   - Register user as "Importer"
   - Test OAuth login with Google

2. **Add Sample Products:**
   - Login as Exporter
   - Create 5-10 sample products
   - Upload product images

3. **Test Import Workflow:**
   - Login as Importer
   - Browse products
   - Create import request
   - Check notifications

4. **Run Test Suite:**

   ```bash
   npm test
   ```

5. **Deploy to Production:**
   - See `backend/README.md` and `import-export-hub-client/README.md` for deployment instructions

---

## 📝 Version History

| Version | Date       | Changes         |
| ------- | ---------- | --------------- |
| 1.0     | 2026-05-11 | Initial release |

---

**Last Updated:** May 11, 2026  
**Maintained By:** Development Team  
**Status:** ✅ Production Ready
