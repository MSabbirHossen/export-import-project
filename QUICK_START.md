# ⚡ Quick Start Guide (5 Minutes)

**Fastest way to get Import Export Hub running locally**

---

## 📋 Prerequisites (Have These Ready)

✅ **MUST HAVE:**

- Node.js v16+ and npm v8+
- Internet connection
- Firebase credentials (API key, Project ID, etc.)
- MongoDB connection string

---

## 🚀 Setup in 5 Steps

### Step 1: Create Environment Files (2 minutes)

**File:** `backend/.env`

```env
MONGODB_URI=mongodb+srv://username:password@cluster...
PORT=5000
NODE_ENV=development
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@iam.gserviceaccount.com
FRONTEND_URL=http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**File:** `import-export-hub-client/.env`

```env
VITE_API_URL=http://localhost:5000/api
VITE_FIREBASE_API_KEY=AIzaSyD...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc...
```

### Step 2: Install Backend (1 minute)

```bash
cd backend
npm install
```

### Step 3: Install Frontend (1 minute)

```bash
cd import-export-hub-client
npm install
```

### Step 4: Start Backend (Terminal 1)

```bash
cd backend
npm run dev
```

**Expected:**

```
✅ MongoDB Connected
✅ Server is running on port 5000
```

### Step 5: Start Frontend (Terminal 2)

```bash
cd import-export-hub-client
npm run dev
```

**Expected:**

```
➜ Local: http://localhost:5173/
```

---

## ✅ Verify It Works

1. Open browser → `http://localhost:5173`
2. Should see homepage with products
3. Click "Register" → Firebase modal appears
4. Click "Products" → Products load from backend API

**If something fails:** See troubleshooting below

---

## 🔧 Manual Setup Tasks You MUST Do

### 1. Firebase Setup (15 minutes)

- [ ] Create Firebase project at [firebase.google.com](https://firebase.google.com)
- [ ] Enable Email/Password and Google Sign-in
- [ ] Download service account key (for backend)
- [ ] Copy web app config (for frontend)

### 2. MongoDB Setup (10 minutes)

- [ ] Create MongoDB Atlas account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- [ ] Create free cluster
- [ ] Create database user
- [ ] Whitelist IP address (0.0.0.0/0 for development)
- [ ] Copy connection string

### 3. Google OAuth Setup (Optional, 5 minutes)

- [ ] Go to [Google Cloud Console](https://console.cloud.google.com)
- [ ] Create OAuth credentials
- [ ] Add `http://localhost:5173` to authorized origins
- [ ] Copy Client ID to frontend `.env`

---

## 🚨 Common Issues

### ❌ "Cannot connect to MongoDB"

```
✅ Solution:
1. Check MongoDB URI in backend/.env (password, username)
2. Whitelist your IP in MongoDB Atlas
3. Verify cluster is running
```

### ❌ "Firebase config not loading"

```
✅ Solution:
1. Copy exact values from Firebase Console
2. No quotes around values in .env
3. Restart frontend: Ctrl+C, then npm run dev
```

### ❌ "CORS error"

```
✅ Solution:
1. Verify backend is running on port 5000
2. Check FRONTEND_URL in backend/.env = http://localhost:5173
3. Verify VITE_API_URL = http://localhost:5000/api
```

### ❌ "Cannot find module 'axios'"

```
✅ Solution:
1. cd import-export-hub-client
2. npm install axios
3. npm run dev
```

### ❌ "Port 5000 already in use"

```
✅ Solution (Windows):
netstat -ano | findstr :5000
taskkill /PID <PID> /F

✅ Solution (Mac/Linux):
lsof -ti:5000 | xargs kill -9
```

---

## 📊 Architecture at a Glance

```
Frontend (React)           Backend (Express)        Database
localhost:5173  ────→   localhost:5000   ───→   MongoDB Atlas
                 ↓                        ↓
            Vite Dev              Node.js Server
            Tailwind              REST API
            React Router          Mongoose ODM
                                 ↓
                            Firebase (Auth Only)
```

---

## 🎯 First Test

After both servers are running:

1. **Go to:** http://localhost:5173
2. **Click:** "Register"
3. **Enter:**
   - Email: `test@example.com`
   - Password: `Test@123`
4. **Click:** "Sign Up"
5. **See:** Login successful, redirected to homepage
6. **Click:** "Products"
7. **See:** Products loaded (from backend API ✅)

---

## 📚 Full Documentation

- **Detailed Setup:** See `MANUAL_SETUP_GUIDE.md`
- **API Reference:** See `CLIENT_SERVER_INTEGRATION.md`
- **Complete Checklist:** See `SETUP_CHECKLIST.md`

---

## ⏰ Typical Timeline

- Firebase + MongoDB Setup: **25-30 min** (one-time)
- Backend npm install: **2-3 min**
- Frontend npm install: **2-3 min**
- Start both servers: **1-2 min**
- **Total:** **30-40 minutes first time**

---

## 🔗 Environment Variables Needed

### Backend (.env)

```
MONGODB_URI           ← From MongoDB Atlas
FIREBASE_PROJECT_ID   ← From Firebase Console
FIREBASE_PRIVATE_KEY  ← From Firebase Service Account
FIREBASE_CLIENT_EMAIL ← From Firebase Service Account
FRONTEND_URL          ← http://localhost:5173 (local dev)
```

### Frontend (.env)

```
VITE_API_URL                   ← http://localhost:5000/api
VITE_FIREBASE_API_KEY          ← From Firebase Console
VITE_FIREBASE_AUTH_DOMAIN      ← From Firebase Console
VITE_FIREBASE_PROJECT_ID       ← From Firebase Console
VITE_FIREBASE_STORAGE_BUCKET   ← From Firebase Console
VITE_FIREBASE_MESSAGING_SENDER_ID ← From Firebase Console
VITE_FIREBASE_APP_ID           ← From Firebase Console
```

---

## ✨ That's It!

Your Import Export Hub is now running with:

- ✅ React frontend with modern UI
- ✅ Express backend API
- ✅ MongoDB database
- ✅ Firebase authentication
- ✅ Fully connected client-server

---

**Need more help?** → See `MANUAL_SETUP_GUIDE.md` for detailed instructions

**Last Updated:** May 11, 2026
