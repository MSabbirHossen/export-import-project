# ✅ Complete Setup Checklist

**Import Export Hub - Step-by-Step Setup Verification**

---

## 🎯 Phase 1: Prerequisites & Installation

### Prerequisites Check

- [ ] Node.js v16+ installed (`node --version`)
- [ ] npm v8+ installed (`npm --version`)
- [ ] Git installed (`git --version`)
- [ ] Internet connection available
- [ ] Ports 5000 and 5173 are available
- [ ] 2GB+ disk space available
- [ ] 4GB+ RAM available
- [ ] Code editor installed (VS Code recommended)

### Repository Setup

- [ ] Repository cloned to local machine
- [ ] Correct directory structure exists:
  - [ ] `backend/` folder exists
  - [ ] `import-export-hub-client/` folder exists
  - [ ] `MANUAL_SETUP_GUIDE.md` exists
  - [ ] `CLIENT_SERVER_INTEGRATION.md` exists

---

## 🔥 Phase 2: Firebase Configuration

### Firebase Account & Project

- [ ] Firebase account created at [firebase.google.com](https://firebase.google.com)
- [ ] Firebase project created
- [ ] Project name is clear and memorable
- [ ] Billing account linked (Free tier available)

### Firebase Authentication Setup

- [ ] Go to Firebase Console → Authentication → Sign-in method
- [ ] Enable "Email/Password" authentication
- [ ] Enable "Google" sign-in provider
- [ ] OAuth consent screen configured:
  - [ ] User type set to "External"
  - [ ] App name entered
  - [ ] User support email entered
  - [ ] Email for Authorized users entered

### Firebase Credentials - Frontend

- [ ] Go to Firebase Console → Project Settings → General
- [ ] Scroll to "Your apps" section
- [ ] Click on Web app (or create if needed)
- [ ] Copy Firebase config values:
  - [ ] `apiKey` (VITE_FIREBASE_API_KEY)
  - [ ] `authDomain` (VITE_FIREBASE_AUTH_DOMAIN)
  - [ ] `projectId` (VITE_FIREBASE_PROJECT_ID)
  - [ ] `storageBucket` (VITE_FIREBASE_STORAGE_BUCKET)
  - [ ] `messagingSenderId` (VITE_FIREBASE_MESSAGING_SENDER_ID)
  - [ ] `appId` (VITE_FIREBASE_APP_ID)
  - [ ] `measurementId` (Optional - VITE_FIREBASE_MEASUREMENT_ID)

### Firebase Credentials - Backend

- [ ] Go to Firebase Console → Project Settings → Service Accounts
- [ ] Click "Generate New Private Key" button
- [ ] Save the JSON file (keep safe, never commit to Git)
- [ ] Extract values:
  - [ ] `project_id` → FIREBASE_PROJECT_ID
  - [ ] `private_key` → FIREBASE_PRIVATE_KEY
  - [ ] `client_email` → FIREBASE_CLIENT_EMAIL

### Google OAuth Setup (Optional but Recommended)

- [ ] Go to [Google Cloud Console](https://console.cloud.google.com/)
- [ ] Create/select project
- [ ] Enable "Google+ API"
- [ ] Create OAuth 2.0 credentials (Web Application)
- [ ] Add authorized JavaScript origins:
  - [ ] `http://localhost:5173`
  - [ ] Your production domain (if applicable)
- [ ] Copy Client ID → VITE_GOOGLE_CLIENT_ID

---

## 🗄️ Phase 3: MongoDB Configuration

### MongoDB Atlas Account

- [ ] Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [ ] Create account or login
- [ ] Create organization (optional)
- [ ] Create new project

### MongoDB Cluster Setup

- [ ] Click "Create" to create new cluster
- [ ] Choose Free tier (M0)
- [ ] Select cloud provider and region
- [ ] Create cluster (takes 2-5 minutes)
- [ ] Cluster created and ready

### MongoDB Security

- [ ] Go to Security → Database Access
- [ ] Create database user:
  - [ ] Username: Enter (save for later)
  - [ ] Password: Generate (save for later)
  - [ ] Role: "Atlas admin"
  - [ ] Click "Create User"
- [ ] Go to Security → Network Access
- [ ] Click "Add IP Address"
  - [ ] Select "Allow Access from Anywhere" (for development)
  - [ ] Note: For production, whitelist specific IPs
  - [ ] Click "Confirm"

### MongoDB Connection String

- [ ] Go to Clusters → Connect button
- [ ] Choose "Drivers" → Node.js
- [ ] Copy connection string
- [ ] Replace placeholders:
  - [ ] `<username>` with your MongoDB username
  - [ ] `<password>` with your MongoDB password
  - [ ] `import-export-hub` is default database name (can change)
- [ ] Store connection string for later use

---

## 💻 Phase 4: Backend Setup

### Dependencies Installation

- [ ] Open terminal in `backend/` directory
- [ ] Run `npm install`
- [ ] Wait for installation to complete
- [ ] Check for any errors (should be none)
- [ ] Run `npm list` to verify packages

### Environment File Creation

- [ ] Create file: `backend/.env`
- [ ] Add MongoDB Configuration:

  ```env
  MONGODB_URI=mongodb+srv://username:password@cluster...
  ```

  - [ ] Verify connection string has no typos
  - [ ] Verify username and password are correct

- [ ] Add Server Configuration:

  ```env
  PORT=5000
  NODE_ENV=development
  ```

- [ ] Add Firebase Admin Configuration:

  ```env
  FIREBASE_PROJECT_ID=your-project-id
  FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
  FIREBASE_CLIENT_EMAIL=firebase-adminsdk-...@....iam.gserviceaccount.com
  ```

  - [ ] Project ID matches Firebase project
  - [ ] Private key has actual newlines (not literal `\n`)
  - [ ] Client email is exact

- [ ] Add Frontend Configuration:

  ```env
  FRONTEND_URL=http://localhost:5173
  ```

- [ ] Add Security Configuration:

  ```env
  RATE_LIMIT_WINDOW_MS=900000
  RATE_LIMIT_MAX_REQUESTS=100
  ```

- [ ] Save file
- [ ] Add `.env` to `.gitignore`

### Verify Backend Installation

- [ ] `.env` file exists in `backend/` directory
- [ ] All required environment variables are set
- [ ] No empty values in `.env`
- [ ] Run `npm run dev`
- [ ] Expected output:
  ```
  ✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
  ╔════════════════════════════════════════════╗
  ║   Import Export Hub Backend Server         ║
  ║ Environment: development                   ║
  ║ Port: 5000                                 ║
  ║ Status: Running ✅                         ║
  ╚════════════════════════════════════════════╝
  ```
- [ ] Server running without errors
- [ ] Keep terminal open (don't close)

### Test Backend Health Check

- [ ] Open new terminal/browser
- [ ] Test endpoint: `curl http://localhost:5000/api/health`
- [ ] Expected response:
  ```json
  {
    "status": "success",
    "message": "Server is running",
    "timestamp": "2026-05-11T..."
  }
  ```
- [ ] If error, check:
  - [ ] MongoDB connection string is correct
  - [ ] Firebase credentials are correct
  - [ ] Port 5000 is not in use
  - [ ] Internet connection is stable

---

## 🎨 Phase 5: Frontend Setup

### Dependencies Installation

- [ ] Open new terminal in `import-export-hub-client/` directory
- [ ] Run `npm install`
- [ ] Wait for installation to complete
- [ ] Check for any errors (should be none)
- [ ] Verify axios was installed: `npm list axios`

### Environment File Creation

- [ ] Create file: `import-export-hub-client/.env`
- [ ] Add Backend Configuration:

  ```env
  VITE_API_URL=http://localhost:5000/api
  ```

- [ ] Add Firebase Configuration:

  ```env
  VITE_FIREBASE_API_KEY=AIzaSyD...
  VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
  VITE_FIREBASE_PROJECT_ID=your-project-id
  VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
  VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
  VITE_FIREBASE_APP_ID=1:123456789:web:abc123def456
  ```

  - [ ] All values match Firebase Console exactly
  - [ ] No quotes around values
  - [ ] No extra spaces

- [ ] Add Google OAuth (Optional):

  ```env
  VITE_GOOGLE_CLIENT_ID=123456789-abc...googleusercontent.com
  ```

- [ ] Save file
- [ ] Add `.env` to `.gitignore`

### Verify Frontend Installation

- [ ] `.env` file exists in `import-export-hub-client/` directory
- [ ] All Firebase values are present and correct
- [ ] `VITE_API_URL` is set to `http://localhost:5000/api`
- [ ] Run `npm run dev`
- [ ] Expected output:
  ```
  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
  ```
- [ ] Dev server running without errors
- [ ] Keep terminal open (don't close)

### Test Frontend Access

- [ ] Open browser to `http://localhost:5173`
- [ ] Expected to see:
  - [ ] Navigation header with logo
  - [ ] Hero section with call-to-action buttons
  - [ ] Featured products section
  - [ ] Footer with links
- [ ] No console errors (press F12 to check)
- [ ] If errors, check:
  - [ ] Firebase config is correct
  - [ ] API URL is correct
  - [ ] Backend server is running

---

## 🔗 Phase 6: Verify Client-Server Connection

### Health Check Tests

- [ ] Backend health check passes: `curl http://localhost:5000/api/health`
- [ ] Frontend loads without errors
- [ ] Frontend can reach backend (check Network tab in DevTools)

### API Integration Tests

- [ ] Can fetch products (Frontend Network tab):
  - [ ] GET request to `http://localhost:5000/api/products/latest`
  - [ ] Returns 200 status
  - [ ] Response contains products array

- [ ] Database connection confirmed:
  - [ ] MongoDB Atlas dashboard shows activity
  - [ ] Collection "products" exists or will create on first insert

### Authentication Tests

- [ ] Go to Frontend home page
- [ ] Click "Register" button
- [ ] Firebase registration modal appears
- [ ] Try creating account (don't submit yet)
- [ ] Modal shows email/password fields

---

## 📋 Phase 7: Manual Post-Setup Tasks

### Create Test Data

- [ ] Register as Exporter user
  - [ ] Email: `exporter@test.com`
  - [ ] Password: `Test@123`
  - [ ] Save credentials

- [ ] Register as Importer user
  - [ ] Email: `importer@test.com`
  - [ ] Password: `Test@123`
  - [ ] Save credentials

### Create Sample Products

- [ ] Login as Exporter
- [ ] Navigate to "Add Export"
- [ ] Create 3-5 sample products:
  - [ ] Product name entered
  - [ ] Description entered
  - [ ] Category selected
  - [ ] Price entered
  - [ ] Quantity entered
  - [ ] Click "Add Product"
- [ ] Verify products appear in "My Exports"

### Test Product Browse

- [ ] Logout (if logged in)
- [ ] Navigate to "Products" page
- [ ] Verify sample products display
- [ ] Can view product details
- [ ] Can search for products

### Test Import Workflow

- [ ] Login as Importer
- [ ] Browse products
- [ ] Select a product
- [ ] Click "Import" button
- [ ] Fill import form:
  - [ ] Quantity entered
  - [ ] Shipping address entered
  - [ ] Click "Request Import"
- [ ] Verify import appears in "My Imports"

### Test Backend APIs (Optional)

- [ ] Using Postman or curl:
  - [ ] `GET /api/products/latest` → Returns 200 ✅
  - [ ] `GET /api/products/all` → Returns 200 ✅
  - [ ] `GET /api/health` → Returns 200 ✅

---

## 🔍 Phase 8: Verification & Validation

### File System Check

- [ ] All required files exist:

  ```
  backend/
  ├── .env ✅
  ├── package.json ✅
  ├── src/
  │   ├── app.js ✅
  │   ├── server.js ✅
  │   ├── config/
  │   │   ├── database.js ✅
  │   │   └── firebase.js ✅
  │   └── ... (other files)

  import-export-hub-client/
  ├── .env ✅
  ├── package.json ✅
  ├── src/
  │   ├── utils/
  │   │   └── api.js ✅
  │   ├── hooks/
  │   │   ├── useProducts.js ✅
  │   │   └── useImports.js ✅
  │   └── ... (other files)
  ```

### Port Availability

- [ ] Port 5000 (Backend): `netstat -ano | findstr :5000` (Windows)
- [ ] Port 5173 (Frontend): `netstat -ano | findstr :5173` (Windows)
- [ ] Or use: `lsof -i :5000` (Mac/Linux)
- [ ] Both ports available/in use by correct processes

### Environment Variables

- [ ] Backend `.env` file complete:
  - [ ] MONGODB_URI ✅
  - [ ] PORT ✅
  - [ ] NODE_ENV ✅
  - [ ] FIREBASE_PROJECT_ID ✅
  - [ ] FIREBASE_PRIVATE_KEY ✅
  - [ ] FIREBASE_CLIENT_EMAIL ✅
  - [ ] FRONTEND_URL ✅

- [ ] Frontend `.env` file complete:
  - [ ] VITE_API_URL ✅
  - [ ] VITE_FIREBASE_API_KEY ✅
  - [ ] VITE_FIREBASE_AUTH_DOMAIN ✅
  - [ ] VITE_FIREBASE_PROJECT_ID ✅
  - [ ] VITE_FIREBASE_STORAGE_BUCKET ✅
  - [ ] VITE_FIREBASE_MESSAGING_SENDER_ID ✅
  - [ ] VITE_FIREBASE_APP_ID ✅

### No Console Errors

- [ ] Backend console has no errors
- [ ] Frontend console (F12) has no errors
- [ ] Network tab shows successful API calls
- [ ] Local storage has user data after login

---

## 🚀 Phase 9: Final Checklist

### Application Functional

- [ ] Backend server starts and runs
- [ ] Frontend dev server starts and runs
- [ ] Homepage loads in browser
- [ ] Can register new user
- [ ] Can login with existing user
- [ ] Can view products
- [ ] Can create product (as exporter)
- [ ] Can import product (as importer)
- [ ] Can view profile
- [ ] Logout works correctly

### Data Persistence

- [ ] Products created in MongoDB
- [ ] User data stored in MongoDB
- [ ] Can retrieve data after server restart
- [ ] MongoDB Atlas shows data in collections

### Security Checks

- [ ] `.env` files not committed to Git
- [ ] Firebase private key is secure
- [ ] MongoDB credentials are strong
- [ ] CORS only allows localhost in development
- [ ] Rate limiting is configured

---

## 📝 Troubleshooting Reference

If setup fails, refer to:

- **Page:** MANUAL_SETUP_GUIDE.md → Troubleshooting section
- **Issue:** Backend connection
  - [ ] Check MONGODB_URI is correct
  - [ ] Check Firebase credentials
  - [ ] Check port 5000 is available
  - [ ] Check internet connection

- **Issue:** Frontend not connecting
  - [ ] Check VITE_API_URL in `.env`
  - [ ] Check backend is running
  - [ ] Check CORS configuration
  - [ ] Clear browser cache

- **Issue:** Firebase authentication not working
  - [ ] Check Firebase config values
  - [ ] Verify email/password auth enabled
  - [ ] Verify authentication methods enabled

---

## 🎯 Next Steps After Setup

Once all checks pass:

1. **Configure CI/CD** (Optional)
   - [ ] Setup GitHub Actions for automated tests
   - [ ] Setup deployment pipeline

2. **Prepare for Production** (When ready)
   - [ ] Update environment variables for production
   - [ ] Configure MongoDB Atlas production cluster
   - [ ] Setup SSL certificates
   - [ ] Configure domain name
   - [ ] Update CORS allowed origins

3. **Monitor & Maintain**
   - [ ] Setup error logging (Sentry, LogRocket)
   - [ ] Setup performance monitoring
   - [ ] Setup database backups
   - [ ] Regular security audits

4. **Expand Features** (Optional)
   - [ ] Add email notifications
   - [ ] Add payment integration
   - [ ] Add messaging system
   - [ ] Add advanced analytics

---

## 📊 Setup Duration Estimate

| Phase          | Duration      | Notes                       |
| -------------- | ------------- | --------------------------- |
| Prerequisites  | 5 min         | Just verification           |
| Firebase Setup | 10-15 min     | Account creation + config   |
| MongoDB Setup  | 10-15 min     | Cluster creation takes time |
| Backend Setup  | 5-10 min      | npm install + config        |
| Frontend Setup | 5-10 min      | npm install + config        |
| Testing        | 10-15 min     | Create test data            |
| **Total**      | **45-80 min** | First-time setup            |

---

## ✅ Sign-Off

- [ ] All phases completed
- [ ] No errors or warnings
- [ ] Application fully functional
- [ ] Ready for development
- [ ] Documentation reviewed

**Setup Completed Date:** ******\_\_\_******

**Completed By:** ******\_\_\_******

---

## 📞 Support Resources

- **Full Setup Guide:** MANUAL_SETUP_GUIDE.md
- **Client-Server Integration:** CLIENT_SERVER_INTEGRATION.md
- **Backend Documentation:** backend/README.md
- **API Documentation:** backend/API_DOCUMENTATION.md
- **Database Schema:** backend/DATABASE_SCHEMA.md

---

**Last Updated:** May 11, 2026  
**Version:** 1.0  
**Status:** ✅ Complete
