# 📮 Phase 2 - Postman Testing Guide

## 🔧 Postman Collection Setup

### Public Endpoints (No Token Required)

#### 1. Health Check

```
GET http://localhost:5000/api/health
```

**Headers:** None

**Response (200):**

```json
{
  "status": "success",
  "message": "Server is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

#### 2. API Overview

```
GET http://localhost:5000/api
```

**Headers:** None

**Response (200):**

```json
{
  "status": "success",
  "message": "Import Export Hub API v1.0",
  "endpoints": {
    "health": "/api/health",
    "products": "/api/products",
    "imports": "/api/imports",
    "users": "/api/users"
  }
}
```

---

### Protected Endpoints (Require Firebase JWT Token)

#### 1. Get User Profile

```
GET http://localhost:5000/api/users/profile
```

**Headers:**

```
Authorization: Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjEifQ...
Content-Type: application/json
```

**How to Get Token:**

1. In your React app, open DevTools → Console
2. Run: `const token = await firebase.auth().currentUser.getIdToken(); console.log(token);`
3. Copy the token
4. Paste in Postman `Authorization` header

**Success Response (200):**

```json
{
  "status": "success",
  "message": "User profile retrieved",
  "user": {
    "uid": "firebase-uid-12345",
    "email": "user@example.com",
    "displayName": "John Doe",
    "photoURL": "https://..."
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Error Response - No Token (401):**

```json
{
  "status": "error",
  "message": "No authorization token provided"
}
```

**Error Response - Invalid Token (401):**

```json
{
  "status": "error",
  "message": "Authentication failed",
  "error": "Invalid or expired token: The provided ID token's 'aud' claim does not match..."
}
```

---

#### 2. Save User Profile

```
POST http://localhost:5000/api/users/save-profile
```

**Headers:**

```
Authorization: Bearer <JWT-TOKEN>
Content-Type: application/json
```

**Body:** (empty for now, will be implemented in Phase 3)

```json
{}
```

**Response (200):**

```json
{
  "status": "success",
  "message": "User profile save endpoint ready (Phase 3)",
  "user": {
    "uid": "firebase-uid-12345",
    "email": "user@example.com",
    "displayName": "John Doe",
    "photoURL": "https://..."
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## 🛠️ Postman Environment Variables

Save these in Postman for easier testing:

1. Create new Environment: `Import Export Hub`
2. Add variables:

```
BASE_URL: http://localhost:5000
API_PATH: /api
TOKEN: <your-firebase-jwt-token>
FRONTEND_URL: http://localhost:5173
```

Then use in requests:

```
{{BASE_URL}}{{API_PATH}}/users/profile
```

---

## 📋 Error Scenarios to Test

### Scenario 1: Missing Token

```
GET {{BASE_URL}}{{API_PATH}}/users/profile
```

Expected: 401 "No authorization token provided"

### Scenario 2: Invalid Token Format

```
GET {{BASE_URL}}{{API_PATH}}/users/profile
Authorization: Bearer invalid-token-xxx
```

Expected: 401 "Authentication failed"

### Scenario 3: Expired Token

```
GET {{BASE_URL}}{{API_PATH}}/users/profile
Authorization: Bearer eyJhbGciOiJSUzI1NiI... (old token)
```

Expected: 401 "Authentication failed"

### Scenario 4: Valid Token

```
GET {{BASE_URL}}{{API_PATH}}/users/profile
Authorization: Bearer eyJhbGciOiJSUzI1NiI... (fresh token from frontend)
```

Expected: 200 with user data

---

## 🚀 Step-by-Step Testing

### 1. Start Backend Server

```bash
cd backend
npm run dev
```

Should show:

```
✅ Firebase Admin SDK initialized successfully
✅ MongoDB Connected
Status: Running ✅
```

### 2. Start Frontend (if testing token)

```bash
cd import-export-hub-client
npm run dev
```

### 3. Test Public Endpoints First

```
GET http://localhost:5000/api/health
```

Should return 200 with success message.

### 4. Get Firebase Token from Frontend

- Open React app DevTools
- Go to Console
- Run:

```javascript
firebase
  .auth()
  .currentUser.getIdToken()
  .then((token) => console.log(token));
```

- Copy token from console

### 5. Test Protected Endpoint

- Open Postman
- Create GET request: `http://localhost:5000/api/users/profile`
- Add header: `Authorization: Bearer <token>`
- Send
- Should return user profile

### 6. Test Token Refresh

- Wait a few minutes
- Try same request
- Token should still work (lasts ~1 hour)
- Try again after 1+ hour
- Frontend should auto-refresh token

---

## 💡 Tips

- **Always include Bearer prefix**: `Bearer eyJ...` not just `eyJ...`
- **Copy full token**: Some terminals truncate long strings
- **Check token expiry**: Firebase tokens expire after 1 hour
- **Frontend handles refresh**: React should auto-refresh, just get new token
- **Check CORS**: If frontend can't reach backend, verify `FRONTEND_URL` in `.env`

---

## 📊 Full Request/Response Examples

### Get User Profile - Success

```http
GET /api/users/profile HTTP/1.1
Host: localhost:5000
Authorization: Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjE0MzA1ZWYwNGExZjA5ZjI1Mzk4ZjY4MDAzODY1MDhlMDBhYmI5MzIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vaW1wb3J0LWV4cG9ydC1odWIiLCJhdWQiOiJpbXBvcnQtZXhwb3J0LWh1YiIsImF1dGhfdGltZSI6MTY3MzYyNjI0OCwidXNlcl9pZCI6InVzZXJfMTIzNDU2Nzg5MCIsInN1YiI6InVzZXJfMTIzNDU2Nzg5MCIsImlhdCI6MTY3MzYyNjI0OCwiZXhwIjoxNjczNjI5ODQ4LCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsidGVzdEBleGFtcGxlLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.signature_part...
```

Response:

```json
HTTP/1.1 200 OK
Content-Type: application/json

{
  "status": "success",
  "message": "User profile retrieved",
  "user": {
    "uid": "user_1234567890",
    "email": "test@example.com",
    "displayName": "Test User",
    "photoURL": null
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

**Phase 2 Testing Ready!** ✅

Import this collection into Postman and test all endpoints.
