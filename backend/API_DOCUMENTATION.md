# 📡 Phase 3 - Complete API Documentation

## 📋 API Endpoints Overview

### Base URL

```
http://localhost:5000/api
```

### Endpoint Categories

1. **Products** - CRUD operations for product listings
2. **Imports** - Import management and tracking
3. **Users** - User profile management

---

## 🛍️ Products API

### 1. Get Latest 6 Products (Homepage)

**Endpoint:**

```
GET /api/products/latest
```

**Status:** Public (No token required)

**Description:** Get 6 newest products for homepage display.

**Response (200):**

```json
{
  "status": "success",
  "message": "Latest products retrieved",
  "data": [
    {
      "_id": "5f8d8d8d8d8d8d8d8d8d8d8d",
      "name": "Premium Tea",
      "image": "https://example.com/tea.jpg",
      "price": 25.99,
      "originCountry": "Sri Lanka",
      "rating": 4.5,
      "availableQuantity": 150,
      "exporterId": "firebase-uid-123",
      "description": "High-quality Ceylon tea",
      "category": "Beverages",
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-15T10:00:00Z"
    }
    // ... 5 more products
  ],
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

### 2. Get All Products (Paginated)

**Endpoint:**

```
GET /api/products/all?page=1&limit=10
```

**Status:** Public

**Query Parameters:**

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

**Response (200):**

```json
{
  "status": "success",
  "message": "All products retrieved",
  "data": {
    "products": [
      {
        /* product object */
      }
      // ... more products
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalProducts": 45,
      "limit": 10
    }
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

### 3. Search Products by Name

**Endpoint:**

```
GET /api/products/search?query=tea
```

**Status:** Public

**Query Parameters:**

- `query` - Search term (required)

**Example Requests:**

```
GET /api/products/search?query=Premium%20Tea
GET /api/products/search?query=coffee
```

**Response (200) - Found:**

```json
{
  "status": "success",
  "message": "Found 3 products",
  "data": [
    {
      /* product object */
    },
    {
      /* product object */
    },
    {
      /* product object */
    }
  ],
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Response (200) - Not Found:**

```json
{
  "status": "success",
  "message": "No products found matching search",
  "data": [],
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Error Response (400) - Missing Query:**

```json
{
  "status": "error",
  "message": "Search query is required",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

### 4. Get Single Product Details

**Endpoint:**

```
GET /api/products/:productId
```

**Status:** Public

**URL Parameters:**

- `productId` - MongoDB product ID (ObjectId)

**Example Request:**

```
GET /api/products/5f8d8d8d8d8d8d8d8d8d8d8d
```

**Response (200):**

```json
{
  "status": "success",
  "message": "Product details retrieved",
  "data": {
    "_id": "5f8d8d8d8d8d8d8d8d8d8d8d",
    "name": "Premium Tea",
    "image": "https://example.com/tea.jpg",
    "price": 25.99,
    "originCountry": "Sri Lanka",
    "rating": 4.5,
    "availableQuantity": 150,
    "exporterId": "firebase-uid-123",
    "description": "High-quality Ceylon tea",
    "category": "Beverages",
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z"
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Error Response (404):**

```json
{
  "status": "error",
  "message": "Product not found",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

### 5. Add New Product (Protected)

**Endpoint:**

```
POST /api/products/add
```

**Status:** Protected (Requires Firebase JWT Token)

**Headers:**

```
Authorization: Bearer <JWT-TOKEN>
Content-Type: application/json
```

**Request Body:**

```json
{
  "name": "Premium Tea",
  "image": "https://example.com/tea.jpg",
  "price": 25.99,
  "originCountry": "Sri Lanka",
  "rating": 4.5,
  "availableQuantity": 150,
  "description": "High-quality Ceylon tea",
  "category": "Beverages"
}
```

**Required Fields:**

- `name` - String (max 100 chars)
- `image` - String (URL)
- `price` - Number (≥ 0)
- `originCountry` - String
- `rating` - Number (0-5)
- `availableQuantity` - Number (≥ 0)

**Optional Fields:**

- `description` - String
- `category` - String

**Response (201):**

```json
{
  "status": "success",
  "message": "Product added successfully",
  "data": {
    "_id": "5f8d8d8d8d8d8d8d8d8d8d8d",
    "name": "Premium Tea",
    "image": "https://example.com/tea.jpg",
    "price": 25.99,
    "originCountry": "Sri Lanka",
    "rating": 4.5,
    "availableQuantity": 150,
    "exporterId": "firebase-uid-123",
    "description": "High-quality Ceylon tea",
    "category": "Beverages",
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z"
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Error Response (400) - Missing Fields:**

```json
{
  "status": "error",
  "message": "Missing required fields",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Error Response (400) - Invalid Data:**

```json
{
  "status": "error",
  "message": "Rating must be between 0 and 5",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Error Response (401) - No Token:**

```json
{
  "status": "error",
  "message": "No authorization token provided",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

### 6. Update Product (Protected)

**Endpoint:**

```
PUT /api/products/:productId
```

**Status:** Protected (Only product owner can update)

**Headers:**

```
Authorization: Bearer <JWT-TOKEN>
Content-Type: application/json
```

**URL Parameters:**

- `productId` - MongoDB product ID

**Request Body:** (All fields optional - only include fields to update)

```json
{
  "name": "Updated Product Name",
  "price": 29.99,
  "availableQuantity": 120,
  "rating": 4.8
}
```

**Response (200):**

```json
{
  "status": "success",
  "message": "Product updated successfully",
  "data": {
    "_id": "5f8d8d8d8d8d8d8d8d8d8d8d",
    "name": "Updated Product Name",
    "price": 29.99,
    "availableQuantity": 120,
    "rating": 4.8
    // ... other fields
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Error Response (403) - Unauthorized:**

```json
{
  "status": "error",
  "message": "Unauthorized: You can only update your own products",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Error Response (404) - Not Found:**

```json
{
  "status": "error",
  "message": "Product not found",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

### 7. Delete Product (Protected)

**Endpoint:**

```
DELETE /api/products/:productId
```

**Status:** Protected (Only product owner can delete)

**Headers:**

```
Authorization: Bearer <JWT-TOKEN>
```

**URL Parameters:**

- `productId` - MongoDB product ID

**Response (200):**

```json
{
  "status": "success",
  "message": "Product deleted successfully",
  "data": null,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Error Response (403):**

```json
{
  "status": "error",
  "message": "Unauthorized: You can only delete your own products",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

### 8. Get User's Exports (Protected)

**Endpoint:**

```
GET /api/products/exports/my-exports
```

**Status:** Protected

**Headers:**

```
Authorization: Bearer <JWT-TOKEN>
```

**Response (200):**

```json
{
  "status": "success",
  "message": "Exporter products retrieved",
  "data": [
    {
      /* product object */
    },
    {
      /* product object */
    }
  ],
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## 📥 Imports API

### 1. Import Product (Protected)

**Endpoint:**

```
POST /api/imports/add
```

**Status:** Protected (Requires JWT Token)

**Headers:**

```
Authorization: Bearer <JWT-TOKEN>
Content-Type: application/json
```

**Request Body:**

```json
{
  "productId": "5f8d8d8d8d8d8d8d8d8d8d8d",
  "quantity": 5
}
```

**Required Fields:**

- `productId` - MongoDB ObjectId
- `quantity` - Positive integer ≤ availableQuantity

**Response (201):**

```json
{
  "status": "success",
  "message": "Product imported successfully",
  "data": {
    "_id": "5f8e8e8e8e8e8e8e8e8e8e8e",
    "productId": "5f8d8d8d8d8d8d8d8d8d8d8d",
    "importerId": "firebase-uid-456",
    "importerEmail": "importer@example.com",
    "quantity": 5,
    "productName": "Premium Tea",
    "productPrice": 25.99,
    "totalPrice": 129.95,
    "status": "pending",
    "createdAt": "2024-01-15T11:00:00Z",
    "updatedAt": "2024-01-15T11:00:00Z"
  },
  "timestamp": "2024-01-15T11:00:00.000Z"
}
```

**Note:** The product's `availableQuantity` automatically decreases by the imported quantity.

**Error Response (400) - Insufficient Stock:**

```json
{
  "status": "error",
  "message": "Only 10 units available. Requested: 15",
  "timestamp": "2024-01-15T11:00:00.000Z"
}
```

**Error Response (404) - Product Not Found:**

```json
{
  "status": "error",
  "message": "Product not found",
  "timestamp": "2024-01-15T11:00:00.000Z"
}
```

---

### 2. Get User's Imports (Protected)

**Endpoint:**

```
GET /api/imports/my-imports
```

**Status:** Protected

**Headers:**

```
Authorization: Bearer <JWT-TOKEN>
```

**Response (200):**

```json
{
  "status": "success",
  "message": "User imports retrieved",
  "data": [
    {
      "_id": "5f8e8e8e8e8e8e8e8e8e8e8e",
      "productId": {
        "_id": "5f8d8d8d8d8d8d8d8d8d8d8d",
        "name": "Premium Tea",
        "image": "https://example.com/tea.jpg",
        "price": 25.99,
        "originCountry": "Sri Lanka",
        "rating": 4.5
      },
      "importerId": "firebase-uid-456",
      "quantity": 5,
      "totalPrice": 129.95,
      "status": "pending",
      "createdAt": "2024-01-15T11:00:00Z"
    }
    // ... more imports
  ],
  "timestamp": "2024-01-15T11:00:00.000Z"
}
```

---

### 3. Remove Import (Protected)

**Endpoint:**

```
DELETE /api/imports/:importId
```

**Status:** Protected (Only importer can remove)

**Headers:**

```
Authorization: Bearer <JWT-TOKEN>
```

**URL Parameters:**

- `importId` - MongoDB import ID

**Response (200):**

```json
{
  "status": "success",
  "message": "Import removed successfully",
  "data": null,
  "timestamp": "2024-01-15T11:00:00.000Z"
}
```

**Note:** The product's `availableQuantity` automatically increases by the removed quantity.

**Error Response (403) - Unauthorized:**

```json
{
  "status": "error",
  "message": "Unauthorized: You can only remove your own imports",
  "timestamp": "2024-01-15T11:00:00.000Z"
}
```

---

### 4. Update Import Quantity (Protected)

**Endpoint:**

```
PUT /api/imports/:importId
```

**Status:** Protected

**Headers:**

```
Authorization: Bearer <JWT-TOKEN>
Content-Type: application/json
```

**Request Body:**

```json
{
  "quantity": 10
}
```

**Response (200):**

```json
{
  "status": "success",
  "message": "Import quantity updated successfully",
  "data": {
    "_id": "5f8e8e8e8e8e8e8e8e8e8e8e",
    "quantity": 10,
    "totalPrice": 259.9
    // ... other fields
  },
  "timestamp": "2024-01-15T11:00:00.000Z"
}
```

**Error Response (400) - Insufficient Stock:**

```json
{
  "status": "error",
  "message": "Only 5 additional units available. Requested: 10",
  "timestamp": "2024-01-15T11:00:00.000Z"
}
```

---

### 5. Get Product Imports (Public)

**Endpoint:**

```
GET /api/imports/product/:productId
```

**Status:** Public

**URL Parameters:**

- `productId` - MongoDB product ID

**Response (200):**

```json
{
  "status": "success",
  "message": "Product imports retrieved",
  "data": [
    {
      "_id": "5f8e8e8e8e8e8e8e8e8e8e8e",
      "importerId": "firebase-uid-456",
      "quantity": 5,
      "totalPrice": 129.95,
      "createdAt": "2024-01-15T11:00:00Z"
    }
    // ... more imports of this product
  ],
  "timestamp": "2024-01-15T11:00:00.000Z"
}
```

---

## 👤 Users API

### 1. Get User Profile (From Token - Protected)

**Endpoint:**

```
GET /api/users/profile
```

**Status:** Protected

**Headers:**

```
Authorization: Bearer <JWT-TOKEN>
```

**Response (200):**

```json
{
  "status": "success",
  "message": "User profile retrieved",
  "user": {
    "uid": "firebase-uid-123",
    "email": "user@example.com",
    "displayName": "John Doe",
    "photoURL": "https://example.com/photo.jpg"
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

### 2. Save User Profile to Database (Protected)

**Endpoint:**

```
POST /api/users/save-profile
```

**Status:** Protected

**Headers:**

```
Authorization: Bearer <JWT-TOKEN>
Content-Type: application/json
```

**Request Body:**

```json
{
  "displayName": "John Doe",
  "role": "both",
  "phone": "+1234567890",
  "address": {
    "country": "USA",
    "city": "New York",
    "details": "123 Main St"
  }
}
```

**Response (201) - New User:**

```json
{
  "status": "success",
  "message": "User profile saved",
  "data": {
    "_id": "5f8c8c8c8c8c8c8c8c8c8c8c",
    "uid": "firebase-uid-123",
    "email": "user@example.com",
    "displayName": "John Doe",
    "role": "both",
    "phone": "+1234567890",
    "address": {
      "country": "USA",
      "city": "New York",
      "details": "123 Main St"
    },
    "isActive": true,
    "createdAt": "2024-01-15T10:00:00Z"
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Response (200) - Updated User:**

```json
{
  "status": "success",
  "message": "User profile updated",
  "data": {
    // ... updated user data
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

### 3. Get User Profile from Database (Protected)

**Endpoint:**

```
GET /api/users/db-profile
```

**Status:** Protected

**Headers:**

```
Authorization: Bearer <JWT-TOKEN>
```

**Response (200):**

```json
{
  "status": "success",
  "message": "User profile retrieved",
  "data": {
    "_id": "5f8c8c8c8c8c8c8c8c8c8c8c",
    "uid": "firebase-uid-123",
    "email": "user@example.com",
    "displayName": "John Doe",
    "photoURL": "https://example.com/photo.jpg",
    "role": "both",
    "phone": "+1234567890",
    "address": {
      "country": "USA",
      "city": "New York",
      "details": "123 Main St"
    },
    "isActive": true,
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z"
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Error Response (404):**

```json
{
  "status": "error",
  "message": "User profile not found in database",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## 🔄 Quantity Management with $inc

### How It Works

When importing a product:

```javascript
// Before: availableQuantity = 150
db.products.findByIdAndUpdate(productId, { $inc: { availableQuantity: -5 } });
// After: availableQuantity = 145
```

When removing an import:

```javascript
// Before: availableQuantity = 145
db.products.findByIdAndUpdate(productId, { $inc: { availableQuantity: +5 } });
// After: availableQuantity = 150
```

This atomic operation ensures:

- ✅ No race conditions
- ✅ Accurate quantity tracking
- ✅ Prevents overselling

---

## 📊 HTTP Status Codes Used

| Code | Meaning      | Example                      |
| ---- | ------------ | ---------------------------- |
| 200  | OK           | Successful GET, PUT          |
| 201  | Created      | POST successful              |
| 400  | Bad Request  | Invalid data, missing fields |
| 401  | Unauthorized | Missing/invalid token        |
| 403  | Forbidden    | User can't access resource   |
| 404  | Not Found    | Product/import doesn't exist |
| 409  | Conflict     | Duplicate email/uid          |
| 500  | Server Error | Database/server error        |

---

## 🛠️ Common Integration Patterns

### Frontend - Add Product

```javascript
const token = await user.getIdToken();
const response = await fetch("http://localhost:5000/api/products/add", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: "Product Name",
    price: 25.99,
    // ... other fields
  }),
});
```

### Frontend - Import Product

```javascript
const response = await fetch("http://localhost:5000/api/imports/add", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    productId: "5f8d...",
    quantity: 5,
  }),
});
```

### Frontend - Get User Imports

```javascript
const response = await fetch("http://localhost:5000/api/imports/my-imports", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
const imports = await response.json();
```

---

**All endpoints are ready for Phase 3!**
