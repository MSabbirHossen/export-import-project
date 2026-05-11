# 🔗 Client-Server Integration Guide

**Quick Reference for API Integration**

---

## 📋 Overview

The frontend now uses a **Backend REST API** instead of Firestore for data management.

### Architecture Changes

**Before (Firestore Direct):**

```
Frontend (React) → Firestore Database
```

**After (Backend API):**

```
Frontend (React) → Backend API (Express) → MongoDB Database
                 ↓
           Firebase (Auth Only)
```

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd import-export-hub-client
npm install
```

### 2. Configure Environment

Create `.env` file with:

```env
VITE_API_URL=http://localhost:5000/api
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_PROJECT_ID=...
# ... other Firebase config
```

### 3. Start Both Servers

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd import-export-hub-client
npm run dev
```

---

## 📚 API Utilities

All API calls go through `src/utils/api.js` which handles:

- ✅ Authentication tokens (automatically attached)
- ✅ Error handling (401 redirects to login)
- ✅ Request/response formatting
- ✅ Timeout management

### Import API Utilities

```javascript
import { productAPI, importAPI, userAPI, analyticsAPI } from "@/utils/api";
```

---

## 🛍️ Products API

### Fetch Latest Products

```javascript
import { useProducts } from "@/hooks/useProducts";

function HomePage() {
  const { fetchLatestProducts } = useProducts();

  useEffect(() => {
    fetchLatestProducts(); // Returns array of 6 latest products
  }, []);
}
```

### Fetch All Products (with Pagination)

```javascript
const { fetchProducts, products } = useProducts();

await fetchProducts((page = 1), (limit = 10));
```

### Search Products

```javascript
const { searchProducts } = useProducts();

const results = await searchProducts("coffee"); // Search query
```

### Get Single Product

```javascript
const { getProductById } = useProducts();

const product = await getProductById("productId123");
```

### Create New Product (Protected)

```javascript
const { addProduct } = useProducts();
const { user } = useAuth();

await addProduct(
  {
    productName: "Premium Coffee",
    description: "Best Arabica coffee",
    category: "Beverages",
    unitPrice: 25,
    quantity: 100,
    // ... other fields
  },
  user.uid,
);
```

### Update Product (Protected)

```javascript
const { updateProduct } = useProducts();

await updateProduct("productId123", {
  unitPrice: 30,
  quantity: 150,
});
```

### Delete Product (Protected)

```javascript
const { deleteProduct } = useProducts();

await deleteProduct("productId123");
```

### Get My Products (Protected)

```javascript
const { fetchExporterProducts } = useProducts();

const myProducts = await fetchExporterProducts();
```

---

## 📦 Imports API

### Fetch All Imports (Protected)

```javascript
import { useImports } from "@/hooks/useImports";

function MyImportsPage() {
  const { fetchUserImports, imports } = useImports();

  useEffect(() => {
    fetchUserImports();
  }, []);

  return imports.map((imp) => <ImportCard key={imp._id} {...imp} />);
}
```

### Create Import (Protected)

```javascript
const { addImport } = useImports();
const { user } = useAuth();

await addImport(user.uid, productId, {
  quantity: 10,
  shippingAddress: "123 Main St",
  paymentMethod: "credit_card",
});
```

### Update Import Status (Protected)

```javascript
const { updateImport } = useImports();

await updateImport("importId123", {
  status: "confirmed", // pending, confirmed, shipped, delivered
  paymentStatus: "completed",
});
```

### Delete Import (Protected)

```javascript
const { removeImport } = useImports();

await removeImport("importId123");
```

---

## 👤 Users API

### Get User Profile (Protected)

```javascript
import { userAPI } from "@/utils/api";

const profile = await userAPI.getProfile();
```

### Update User Profile (Protected)

```javascript
await userAPI.updateProfile({
  displayName: "New Name",
  country: "Canada",
  companyName: "My Company",
});
```

---

## 📊 Analytics API

### Get Dashboard Data (Protected)

```javascript
import { analyticsAPI } from "@/utils/api";

const dashboard = await analyticsAPI.getDashboard();
// Returns: { totalSales, ordersCount, topProducts, etc }
```

### Get Sales Analytics (Protected)

```javascript
const sales = await analyticsAPI.getSales("30d"); // 7d, 30d, 90d, 1y
```

---

## ❌ Error Handling

All API calls automatically handle errors:

```javascript
try {
  const products = await productAPI.getAll();
} catch (error) {
  // Error already logged to console
  // 401 errors redirect to login automatically
  console.error("Failed:", error.message);
}
```

### Status Code Handling

| Code | Action       | Example                    |
| ---- | ------------ | -------------------------- |
| 200  | Success      | Product created ✅         |
| 400  | Bad Request  | Missing required field     |
| 401  | Unauthorized | Auto-redirects to login 🔓 |
| 403  | Forbidden    | Don't have permission      |
| 404  | Not Found    | Product doesn't exist      |
| 500  | Server Error | Database error             |

---

## 🔐 Authentication

### Token Management

Tokens are automatically attached to all requests:

```javascript
// Token is stored in localStorage after login
localStorage.getItem('user')  // { token: "jwt_token_here", uid: "...", etc }

// API automatically uses this token in Authorization header
Authorization: Bearer <token>
```

### Protected Routes

```javascript
import ProtectedRoute from "@/components/ProtectedRoute";

<Route
  path="/add-export"
  element={
    <ProtectedRoute>
      <AddExportPage />
    </ProtectedRoute>
  }
/>;
```

---

## 🔄 Working with Responses

API responses are automatically unwrapped (just the data):

```javascript
// Before (Firestore)
const snapshot = await getDocs(query(...));
const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

// After (API)
const products = await productAPI.getAll();  // Already formatted!
```

---

## 🚨 Common Issues & Solutions

### Issue: "API URL is undefined"

**Solution:** Ensure `.env` file has:

```env
VITE_API_URL=http://localhost:5000/api
```

Restart dev server after adding `.env`

### Issue: "Cannot find module '@/utils/api'"

**Solution:** Check if `vite.config.js` has alias:

```javascript
resolve: {
  alias: {
    '@': '/src',
  },
}
```

### Issue: "401 Unauthorized in requests"

**Solution:**

1. Verify user is logged in
2. Check token exists: `localStorage.getItem('user')`
3. Verify token is valid (not expired)
4. Re-login if needed

### Issue: "CORS errors"

**Solution:**

1. Verify backend is running
2. Check `FRONTEND_URL` in backend `.env` is `http://localhost:5173`
3. Verify CORS config in `backend/src/app.js`

### Issue: "No products showing"

**Solution:**

1. Check backend is running: `npm run dev`
2. Verify MongoDB connection
3. Check browser console for API errors
4. Try: `curl http://localhost:5000/api/products/latest`

---

## 📝 Using API Directly (Advanced)

If you need custom API calls outside of hooks:

```javascript
import api, { productAPI } from "@/utils/api";

// Using pre-built endpoints
const products = await productAPI.getAll();

// Or using base API for custom calls
const response = await api.get("/products/search", {
  params: { q: "search term", category: "electronics" },
});
```

---

## 🧪 Testing API Endpoints

### Using Postman

1. Create request to: `http://localhost:5000/api/products/latest`
2. Set method: `GET`
3. For protected endpoints, add header:
   ```
   Authorization: Bearer <your_jwt_token>
   ```
4. Click "Send"

### Using curl

```bash
# Get latest products (public)
curl http://localhost:5000/api/products/latest

# Get all products (public)
curl http://localhost:5000/api/products/all

# Create product (requires token)
curl -X POST http://localhost:5000/api/products/add \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"productName":"Coffee","unitPrice":25,...}'
```

---

## 📚 Migration Checklist

- [ ] Axios installed in frontend
- [ ] API utility file created (`src/utils/api.js`)
- [ ] useProducts hook updated to use API
- [ ] useImports hook updated to use API
- [ ] `.env` file configured with `VITE_API_URL`
- [ ] Backend `.env` has `FRONTEND_URL=http://localhost:5173`
- [ ] Both servers running without errors
- [ ] Frontend can fetch products without errors
- [ ] Authentication still works
- [ ] Can create/update/delete products
- [ ] Can manage imports

---

## 🔗 Related Documentation

- **Full Setup Guide:** [MANUAL_SETUP_GUIDE.md](../MANUAL_SETUP_GUIDE.md)
- **Backend API Docs:** [backend/API_DOCUMENTATION.md](../backend/API_DOCUMENTATION.md)
- **Backend README:** [backend/README.md](../backend/README.md)
- **Database Schema:** [backend/DATABASE_SCHEMA.md](../backend/DATABASE_SCHEMA.md)

---

**Last Updated:** May 11, 2026  
**Version:** 1.0
