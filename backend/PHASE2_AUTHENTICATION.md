# 🔐 Phase 2 - Firebase Authentication & Protected Routes

## ✅ What Has Been Created

### New Files Added

| File                              | Purpose                                                |
| --------------------------------- | ------------------------------------------------------ |
| `src/config/firebase.js`          | Firebase Admin SDK initialization & token verification |
| `src/middlewares/auth.js`         | JWT token verification middleware                      |
| `src/middlewares/errorHandler.js` | Centralized error handling & async wrapper             |
| `src/routes/userRoutes.js`        | User profile endpoints (protected routes)              |
| `src/utils/response.js`           | Standardized API response formatting                   |

### Updated Files

| File           | Changes                                           |
| -------------- | ------------------------------------------------- |
| `src/app.js`   | Integrated Firebase, middlewares, and user routes |
| `.env.example` | Added detailed Firebase credentials instructions  |

## 🔑 Firebase Authentication Flow

```
Frontend (React)
    ↓
Firebase Sign-in/Register
    ↓
Firebase returns JWT token
    ↓
Frontend sends: Authorization: Bearer <JWT>
    ↓
Backend Middleware: verifyAuth
    ↓
Verify token with Firebase Admin SDK
    ↓
Extract user info (uid, email, name, photo)
    ↓
Attach to req.user
    ↓
Pass to Protected Route Handler
```

## 🚀 How to Setup Firebase Admin Credentials

### Step 1: Get Firebase Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **import-export-hub**
3. Click ⚙️ **Settings** (top left)
4. Go to **Service Accounts** tab
5. Click **Generate New Private Key** button
6. A JSON file downloads automatically
7. Keep this file **SECURE** - never commit to Git!

### Step 2: Extract Credentials from JSON

The downloaded JSON file contains:

```json
{
  "type": "service_account",
  "project_id": "import-export-hub-xxx",
  "private_key_id": "xxx",
  "private_key": "-----BEGIN PRIVATE KEY-----\nxxx\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@import-export-hub-xxx.iam.gserviceaccount.com",
  "client_id": "xxx",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/..."
}
```

### Step 3: Update .env File

Create `.env` from `.env.example` and fill in:

```env
FIREBASE_PROJECT_ID=import-export-hub-xxx
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYourKeyHere\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@import-export-hub-xxx.iam.gserviceaccount.com
```

⚠️ **Important**: The private key must include the `\n` literal characters in the string!

## 🛡️ Authentication Middleware Explained

### What `verifyAuth` Does

Located in: `src/middlewares/auth.js`

```javascript
app.get("/api/protected-route", verifyAuth, (req, res) => {
  // Only reaches here if token is valid
  console.log(req.user); // { uid, email, displayName, photoURL }
});
```

**Steps:**

1. Checks for `Authorization: Bearer <token>` header
2. Extracts token (removes "Bearer " prefix)
3. Verifies token with Firebase Admin SDK
4. Decodes token to get user info
5. Attaches user to `req.user`
6. Passes to next middleware/route

**Error Cases:**

- ❌ No token → 401 "No authorization token provided"
- ❌ Invalid token → 401 "Authentication failed"
- ❌ Expired token → 401 "Authentication failed"

## 📡 API Endpoints - Phase 2

### Public Endpoints

```
GET /api/health
```

Server health check - always available.

```
GET /api
```

API overview - always available.

### Protected Endpoints (Require Token)

```
GET /api/users/profile
```

**Header:** `Authorization: Bearer <JWT-TOKEN>`

**Response:**

```json
{
  "status": "success",
  "message": "User profile retrieved",
  "user": {
    "uid": "firebase-uid",
    "email": "user@example.com",
    "displayName": "User Name",
    "photoURL": "https://..."
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

```
POST /api/users/save-profile
```

**Header:** `Authorization: Bearer <JWT-TOKEN>`

**Response:**

```json
{
  "status": "success",
  "message": "User profile save endpoint ready (Phase 3)",
  "user": {
    "uid": "firebase-uid",
    "email": "user@example.com",
    "displayName": "User Name",
    "photoURL": "https://..."
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

_(Full implementation in Phase 3)_

## 🧪 Testing Authentication with Postman

### 1. Get Firebase JWT Token from Frontend

Run your React app and:

1. Login with test account
2. Open Browser DevTools → Application → Cookies
3. Or check `localStorage` for `token` or similar

Alternatively, use Firebase REST API:

```bash
curl -X POST "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=YOUR_FIREBASE_WEB_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","returnSecureToken":true}'
```

Response includes `idToken` - this is your JWT.

### 2. Test Protected Route in Postman

**Setup:**

- Method: `GET`
- URL: `http://localhost:5000/api/users/profile`
- Headers:
  - Key: `Authorization`
  - Value: `Bearer <your-jwt-token>`

**Expected Response (200):**

```json
{
  "status": "success",
  "message": "User profile retrieved",
  "user": {
    "uid": "firebase-uid",
    "email": "user@example.com",
    "displayName": "User Name",
    "photoURL": "https://..."
  }
}
```

**Invalid Token Response (401):**

```json
{
  "status": "error",
  "message": "Authentication failed",
  "error": "Invalid or expired token"
}
```

## 🔄 Error Handling

### Centralized Error Handler: `src/middlewares/errorHandler.js`

Handles:

- ✅ Validation errors (400)
- ✅ JWT errors (401)
- ✅ Cast errors (400)
- ✅ Not found errors (404)
- ✅ Server errors (500)

### Async Handler

Wraps async route handlers to catch errors:

```javascript
router.get(
  "/route",
  verifyAuth,
  asyncHandler(async (req, res) => {
    // Any error thrown here is caught automatically
    const data = await someAsyncOperation();
    res.json(data);
  }),
);
```

## 📋 Phase 2 Checklist

### Setup Steps

- [ ] 1. Get Firebase Service Account JSON
- [ ] 2. Extract credentials (projectId, privateKey, clientEmail)
- [ ] 3. Create `.env` file (copy from `.env.example`)
- [ ] 4. Fill in Firebase credentials
- [ ] 5. Start server: `npm run dev`
- [ ] 6. Test health check: `GET /api/health`
- [ ] 7. Test protected route with token

### What's Working

- ✅ Firebase Admin SDK initialization
- ✅ JWT token verification
- ✅ Protected routes with `verifyAuth` middleware
- ✅ Centralized error handling
- ✅ User profile retrieval from token
- ✅ Standardized API responses

### What's Next (Phase 3)

- 🔜 User model & database
- 🔜 Product schema & APIs
- 🔜 Data persistence

## 📚 Middleware Stack Order

```
Request
    ↓
helmet() - Security headers
    ↓
cors() - Cross-origin
    ↓
rateLimit() - Rate limiting
    ↓
express.json() - Parse JSON
    ↓
Routes (public & protected)
    ↓
notFoundHandler() - 404
    ↓
errorHandler() - Error catching
    ↓
Response
```

## 🚨 Important Notes

1. **Never commit `.env`** - it contains sensitive credentials
2. **Regenerate keys if exposed** - Firebase Console → Service Accounts
3. **Frontend must send token** - Set in request headers during API calls
4. **Token expires** - Firebase tokens last ~1 hour; frontend should refresh
5. **CORS must match** - `FRONTEND_URL` in `.env` must match React app URL

## ✅ Verification

After setup, you should see:

```
✅ Firebase Admin SDK initialized successfully
✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
```

If you see errors, check:

- [ ] `.env` file exists with all variables
- [ ] Firebase credentials are valid
- [ ] `FIREBASE_PRIVATE_KEY` includes `\n` characters
- [ ] MongoDB URI is correct
- [ ] Internet connection for Firebase & MongoDB

---

**Phase 2 Status: ✅ COMPLETE**

All authentication middleware and protected routes are ready!

Next: Say **"Next Phase"** to proceed to Phase 3 (Product Schema & APIs)
