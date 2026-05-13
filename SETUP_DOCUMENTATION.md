# Import Export Hub Setup Documentation

This project has two apps:

- `backend`: Express, MongoDB, Firebase Admin API server
- `import-export-hub-client`: Vite React client with Firebase Auth

## What Was Connected

- The React client reads the backend URL from `VITE_API_URL`.
- The client attaches the current Firebase ID token to protected API requests.
- Client import APIs now call the backend routes:
  - `POST /api/imports/add`
  - `GET /api/imports/my-imports`
  - `GET /api/imports/product/:productId`
  - `GET /api/imports/:importId`
- Client user profile APIs now call:
  - `GET /api/users/db-profile`
  - `POST /api/users/save-profile`
- The backend product route order was fixed so `/api/products/exports/my-exports` is not captured as a product id.
- The backend now supports `GET /api/imports/:importId` for the client import detail helper.

## Manual Requirements

You must manually create and configure these services before the full app can run:

- MongoDB Atlas database
- Firebase project
- Firebase Authentication sign-in providers
- Firebase Admin SDK service account for the backend
- Client `.env`
- Backend `.env`

## Backend Setup

Go to the backend folder:

```bash
cd backend
npm install
```

Create `backend/.env` from `backend/.env.example`.

Required backend variables:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/import-export-hub?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYourPrivateKeyHere...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FRONTEND_URL=http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

Manual backend notes:

- Get `MONGODB_URI` from MongoDB Atlas.
- Allow your current IP address in MongoDB Atlas Network Access.
- Create a Firebase service account from Firebase Console > Project settings > Service accounts.
- Copy `project_id`, `private_key`, and `client_email` from the service account JSON into the backend `.env`.
- Keep `FIREBASE_PRIVATE_KEY` wrapped in quotes and keep `\n` newline markers.

Run the backend:

```bash
npm run dev
```

Check:

```text
http://localhost:5000/api/health
http://localhost:5000/api/docs
```

## Client Setup

Go to the client folder:

```bash
cd import-export-hub-client
npm install
```

Create `import-export-hub-client/.env` from `import-export-hub-client/.env.example`.

Required client variables:

```env
VITE_API_URL=http://localhost:5000/api
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id_here
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

Manual client notes:

- Get Firebase web config from Firebase Console > Project settings > General > Your apps.
- Enable Email/Password authentication in Firebase Authentication.
- Enable Google authentication if you want Google sign-in.
- Add `localhost` to Firebase Authentication authorized domains if it is missing.
- `VITE_API_URL` must include `/api` at the end.

Run the client:

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

## Run Both Apps

Use two terminals.

Terminal 1:

```bash
cd backend
npm run dev
```

Terminal 2:

```bash
cd import-export-hub-client
npm run dev
```

## Verification Checklist

- Backend health check returns success at `http://localhost:5000/api/health`.
- Client starts at `http://localhost:5173`.
- Browser dev tools show API calls going to `http://localhost:5000/api`.
- Register or sign in with Firebase.
- After login, protected requests include an `Authorization: Bearer ...` header.
- Add an export product from the client.
- Visit My Exports and confirm the product appears.
- Import a product and confirm My Imports updates.

## Common Problems

### CORS Error

Check `backend/.env`:

```env
FRONTEND_URL=http://localhost:5173
```

Restart the backend after changing `.env`.

### 401 Unauthorized

Check that:

- Firebase client config belongs to the same Firebase project as the backend service account.
- The user is logged in before calling protected routes.
- The backend `FIREBASE_PRIVATE_KEY`, `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PROJECT_ID` are correct.

### MongoDB Connection Error

Check that:

- `MONGODB_URI` is correct.
- Your IP is allowed in MongoDB Atlas.
- Database user and password are correct.

### Client Uses Wrong API URL

Check `import-export-hub-client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Restart the Vite dev server after changing `.env`.

## Production Notes

When deploying:

- Set `VITE_API_URL` to the deployed backend URL ending with `/api`.
- Set `FRONTEND_URL` in the backend to the deployed client URL.
- Add the deployed client domain to Firebase authorized domains.
- Add the deployed backend environment variables in the hosting provider.
- Do not commit real `.env` files or Firebase service account JSON files.
