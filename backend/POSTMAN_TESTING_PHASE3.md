# 📮 Phase 3 - Postman Testing Examples

## 🔧 Postman Setup

### Environment Variables

Create a new Postman Environment: `Import Export Hub`

```
BASE_URL=http://localhost:5000
API_PATH=/api
TOKEN={{your-firebase-jwt-token}}
```

Use in requests like:

```
{{BASE_URL}}{{API_PATH}}/products/latest
```

### Pre-request Script (Auto-calculate totalPrice for imports)

```javascript
if (pm.request.method === "POST" && pm.request.url.path.includes("imports")) {
  const body = JSON.parse(pm.request.body.raw);
  console.log("Import request body:", body);
}
```

---

## 🛍️ Products Testing

### 1. Get Latest 6 Products

```
GET {{BASE_URL}}{{API_PATH}}/products/latest
```

**Headers:** None (Public)

**Expected Response (200):**

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
      "availableQuantity": 150
    }
  ]
}
```

---

### 2. Get All Products (With Pagination)

```
GET {{BASE_URL}}{{API_PATH}}/products/all?page=1&limit=10
```

**Headers:** None (Public)

**Query Params:**

- `page`: 1
- `limit`: 10

**Expected Response (200):**

```json
{
  "status": "success",
  "message": "All products retrieved",
  "data": {
    "products": [
      {
        /* product */
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalProducts": 45,
      "limit": 10
    }
  }
}
```

---

### 3. Search Products

```
GET {{BASE_URL}}{{API_PATH}}/products/search?query=tea
```

**Headers:** None (Public)

**Query Params:**

- `query`: tea

**Test Cases:**

- ✓ Valid query: `?query=tea`
- ✓ Empty query: `?query=` (should return error)
- ✓ Special characters: `?query=Premium%20Tea`
- ✓ No results: `?query=xyz123`

**Success Response (200):**

```json
{
  "status": "success",
  "message": "Found 3 products",
  "data": [
    {
      /* products matching "tea" */
    }
  ]
}
```

**Error Response (400):**

```json
{
  "status": "error",
  "message": "Search query is required"
}
```

---

### 4. Get Single Product

```
GET {{BASE_URL}}{{API_PATH}}/products/5f8d8d8d8d8d8d8d8d8d8d8d
```

**Headers:** None (Public)

**URL Params:**

- `productId`: 5f8d8d8d8d8d8d8d8d8d8d8d

**Test Cases:**

- ✓ Valid ID: 5f8d8d8d8d8d8d8d8d8d8d8d
- ✓ Invalid ID: invalid123 (should return error)
- ✓ Non-existent ID: 000000000000000000000000 (should return 404)

**Success Response (200):**

```json
{
  "status": "success",
  "message": "Product details retrieved",
  "data": {
    /* full product object */
  }
}
```

**Error Response (404):**

```json
{
  "status": "error",
  "message": "Product not found"
}
```

---

### 5. Add New Product (Protected)

```
POST {{BASE_URL}}{{API_PATH}}/products/add
```

**Headers:**

```
Authorization: Bearer {{TOKEN}}
Content-Type: application/json
```

**Request Body:**

```json
{
  "name": "Premium Coffee Beans",
  "image": "https://example.com/coffee.jpg",
  "price": 35.99,
  "originCountry": "Ethiopia",
  "rating": 4.8,
  "availableQuantity": 200,
  "description": "High-quality Arabica coffee beans",
  "category": "Beverages"
}
```

**Test Cases:**

**✓ Valid Add (200):**

```json
{
  "status": "success",
  "message": "Product added successfully",
  "data": {
    "_id": "5f8d8d8d8d8d8d8d8d8d8d8d",
    "name": "Premium Coffee Beans",
    "exporterId": "firebase-uid-123",
    "createdAt": "2024-01-15T10:00:00Z"
  }
}
```

**✗ Missing Required Field (400):**

```json
{
  "body": {
    "name": "Product",
    "image": "https://..."
    // Missing price, rating, etc.
  }
}
```

Response:

```json
{
  "status": "error",
  "message": "Missing required fields"
}
```

**✗ Invalid Rating (400):**

```json
{
  "body": {
    // ... other fields
    "rating": 6 // Should be 0-5
  }
}
```

Response:

```json
{
  "status": "error",
  "message": "Rating must be between 0 and 5"
}
```

**✗ No Token (401):**

```json
{
  "status": "error",
  "message": "No authorization token provided"
}
```

---

### 6. Update Product (Protected)

```
PUT {{BASE_URL}}{{API_PATH}}/products/5f8d8d8d8d8d8d8d8d8d8d8d
```

**Headers:**

```
Authorization: Bearer {{TOKEN}}
Content-Type: application/json
```

**Request Body:** (Partial update - only changed fields)

```json
{
  "price": 39.99,
  "availableQuantity": 180,
  "rating": 4.9
}
```

**Expected Response (200):**

```json
{
  "status": "success",
  "message": "Product updated successfully",
  "data": {
    "_id": "5f8d8d8d8d8d8d8d8d8d8d8d",
    "name": "Premium Coffee Beans",
    "price": 39.99,
    "availableQuantity": 180,
    "rating": 4.9
  }
}
```

**Error - Not Owner (403):**

```json
{
  "status": "error",
  "message": "Unauthorized: You can only update your own products"
}
```

---

### 7. Delete Product (Protected)

```
DELETE {{BASE_URL}}{{API_PATH}}/products/5f8d8d8d8d8d8d8d8d8d8d8d
```

**Headers:**

```
Authorization: Bearer {{TOKEN}}
```

**Expected Response (200):**

```json
{
  "status": "success",
  "message": "Product deleted successfully",
  "data": null
}
```

---

### 8. Get User's Exports (Protected)

```
GET {{BASE_URL}}{{API_PATH}}/products/exports/my-exports
```

**Headers:**

```
Authorization: Bearer {{TOKEN}}
```

**Expected Response (200):**

```json
{
  "status": "success",
  "message": "Exporter products retrieved",
  "data": [
    {
      /* product 1 */
    },
    {
      /* product 2 */
    }
  ]
}
```

---

## 📥 Imports Testing

### 1. Import Product (Protected)

```
POST {{BASE_URL}}{{API_PATH}}/imports/add
```

**Headers:**

```
Authorization: Bearer {{TOKEN}}
Content-Type: application/json
```

**Request Body:**

```json
{
  "productId": "5f8d8d8d8d8d8d8d8d8d8d8d",
  "quantity": 5
}
```

**Test Cases:**

**✓ Valid Import (201):**

```json
{
  "status": "success",
  "message": "Product imported successfully",
  "data": {
    "_id": "5f8e8e8e8e8e8e8e8e8e8e8e",
    "productId": "5f8d8d8d8d8d8d8d8d8d8d8d",
    "quantity": 5,
    "totalPrice": 129.95,
    "status": "pending",
    "createdAt": "2024-01-15T11:00:00Z"
  }
}
```

**Note:** After this, check product's `availableQuantity` should decrease by 5.

**✗ Insufficient Stock (400):**

```json
{
  "productId": "5f8d8d8d8d8d8d8d8d8d8d8d",
  "quantity": 1000 // Only 150 available
}
```

Response:

```json
{
  "status": "error",
  "message": "Only 150 units available. Requested: 1000"
}
```

**✗ Product Not Found (404):**

```json
{
  "productId": "000000000000000000000000",
  "quantity": 5
}
```

Response:

```json
{
  "status": "error",
  "message": "Product not found"
}
```

---

### 2. Get User's Imports (Protected)

```
GET {{BASE_URL}}{{API_PATH}}/imports/my-imports
```

**Headers:**

```
Authorization: Bearer {{TOKEN}}
```

**Expected Response (200):**

```json
{
  "status": "success",
  "message": "User imports retrieved",
  "data": [
    {
      "_id": "5f8e8e8e8e8e8e8e8e8e8e8e",
      "productId": {
        "_id": "5f8d8d8d8d8d8d8d8d8d8d8d",
        "name": "Premium Coffee Beans",
        "price": 35.99
      },
      "quantity": 5,
      "totalPrice": 179.95,
      "status": "pending",
      "createdAt": "2024-01-15T11:00:00Z"
    }
  ]
}
```

---

### 3. Remove Import (Protected)

```
DELETE {{BASE_URL}}{{API_PATH}}/imports/5f8e8e8e8e8e8e8e8e8e8e8e
```

**Headers:**

```
Authorization: Bearer {{TOKEN}}
```

**Expected Response (200):**

```json
{
  "status": "success",
  "message": "Import removed successfully",
  "data": null
}
```

**Note:** After this, the product's `availableQuantity` should increase by the imported quantity.

---

### 4. Update Import Quantity (Protected)

```
PUT {{BASE_URL}}{{API_PATH}}/imports/5f8e8e8e8e8e8e8e8e8e8e8e
```

**Headers:**

```
Authorization: Bearer {{TOKEN}}
Content-Type: application/json
```

**Request Body:**

```json
{
  "quantity": 10
}
```

**Expected Response (200):**

```json
{
  "status": "success",
  "message": "Import quantity updated successfully",
  "data": {
    "_id": "5f8e8e8e8e8e8e8e8e8e8e8e",
    "quantity": 10,
    "totalPrice": 359.9
  }
}
```

---

### 5. Get Product Imports (Public)

```
GET {{BASE_URL}}{{API_PATH}}/imports/product/5f8d8d8d8d8d8d8d8d8d8d8d
```

**Headers:** None (Public)

**Expected Response (200):**

```json
{
  "status": "success",
  "message": "Product imports retrieved",
  "data": [
    {
      "_id": "5f8e8e8e8e8e8e8e8e8e8e8e",
      "importerId": "firebase-uid-456",
      "quantity": 5,
      "totalPrice": 179.95
    }
  ]
}
```

---

## 👤 Users Testing

### 1. Get User Profile (From Token)

```
GET {{BASE_URL}}{{API_PATH}}/users/profile
```

**Headers:**

```
Authorization: Bearer {{TOKEN}}
```

**Expected Response (200):**

```json
{
  "status": "success",
  "message": "User profile retrieved",
  "user": {
    "uid": "firebase-uid-123",
    "email": "user@example.com",
    "displayName": "John Doe",
    "photoURL": "https://example.com/photo.jpg"
  }
}
```

---

### 2. Save User Profile

```
POST {{BASE_URL}}{{API_PATH}}/users/save-profile
```

**Headers:**

```
Authorization: Bearer {{TOKEN}}
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

**Expected Response (201) - New User:**

```json
{
  "status": "success",
  "message": "User profile saved",
  "data": {
    "_id": "5f8c8c8c8c8c8c8c8c8c8c8c",
    "uid": "firebase-uid-123",
    "email": "user@example.com",
    "displayName": "John Doe",
    "role": "both"
  }
}
```

**Expected Response (200) - Existing User:**

```json
{
  "status": "success",
  "message": "User profile updated",
  "data": {
    // ... updated data
  }
}
```

---

### 3. Get User Profile from Database

```
GET {{BASE_URL}}{{API_PATH}}/users/db-profile
```

**Headers:**

```
Authorization: Bearer {{TOKEN}}
```

**Expected Response (200):**

```json
{
  "status": "success",
  "message": "User profile retrieved",
  "data": {
    "_id": "5f8c8c8c8c8c8c8c8c8c8c8c",
    "uid": "firebase-uid-123",
    "email": "user@example.com",
    "displayName": "John Doe",
    "role": "both",
    "phone": "+1234567890"
  }
}
```

---

## 🧪 End-to-End Workflow Test

### Complete User Journey

**Step 1: Exporter Creates Product**

```
POST /api/products/add
{
  "name": "Premium Tea",
  "price": 25.99,
  "availableQuantity": 100,
  ...
}
→ Get productId from response
```

**Step 2: Check Product Added**

```
GET /api/products/latest
→ Should include the new product
```

**Step 3: Importer Imports Product**

```
POST /api/imports/add
{
  "productId": "...",
  "quantity": 5
}
→ Get importId from response
```

**Step 4: Verify Quantity Decreased**

```
GET /api/products/{{productId}}
→ availableQuantity should be 95 (was 100, imported 5)
```

**Step 5: Get User's Imports**

```
GET /api/imports/my-imports
→ Should show the import with quantity 5
```

**Step 6: Remove Import**

```
DELETE /api/imports/{{importId}}
→ Should succeed
```

**Step 7: Verify Quantity Restored**

```
GET /api/products/{{productId}}
→ availableQuantity should be 100 again
```

---

## 💡 Testing Tips

1. **Get fresh token** before running tests
2. **Use different user tokens** for exporter vs importer tests
3. **Save IDs** from POST responses for later use
4. **Test error cases** (invalid data, unauthorized, etc.)
5. **Check quantity changes** after import/remove operations
6. **Verify timestamps** are set correctly
7. **Use Postman Collections** to run all tests together

---

## ✅ Test Checklist

- [ ] Public endpoints work without token
- [ ] Protected endpoints require token
- [ ] Invalid token returns 401
- [ ] Missing token returns 401
- [ ] Valid token gives access
- [ ] Quantity decreases on import
- [ ] Quantity increases on remove
- [ ] Can't import more than available
- [ ] Only owner can update/delete
- [ ] Search works with partial matches
- [ ] Pagination works correctly
- [ ] All required fields validated
- [ ] Proper error messages returned
- [ ] Status codes are correct (200, 201, 400, 401, 403, 404)

---

**Phase 3 Testing Complete!** ✅
