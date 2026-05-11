# 📊 Phase 3 - Database Schema Documentation

## 🗄️ MongoDB Collections

### 1. **Users Collection**

Stores user profile information and preferences.

```javascript
{
  _id: ObjectId,
  uid: String,                    // Firebase UID (unique)
  email: String,                  // User email (unique)
  displayName: String,            // Display name
  photoURL: String,               // Profile picture URL
  role: String,                   // 'importer', 'exporter', 'both'
  phone: String,                  // Phone number
  address: {
    country: String,
    city: String,
    details: String
  },
  isActive: Boolean,              // Account active status
  createdAt: Date,                // Auto-generated
  updatedAt: Date                 // Auto-generated
}
```

**Indexes:**

- `uid` - Unique index for Firebase authentication
- `email` - Unique index for email uniqueness
- Combined queries: `uid + isActive`

**Example Document:**

```json
{
  "_id": ObjectId("5f8c8c8c8c8c8c8c8c8c8c8c"),
  "uid": "firebase-uid-12345",
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
}
```

---

### 2. **Products Collection**

Stores product/export listings.

```javascript
{
  _id: ObjectId,
  name: String,                   // Product name (required, max 100 chars)
  image: String,                  // Product image URL
  price: Number,                  // Product price (min 0)
  originCountry: String,          // Country of origin
  rating: Number,                 // Rating 0-5
  availableQuantity: Number,      // Available units (decreases with imports)
  exporterId: String,             // Firebase UID of exporter
  description: String,            // Product description
  category: String,               // Product category
  createdAt: Date,                // Auto-generated
  updatedAt: Date                 // Auto-generated
}
```

**Indexes:**

- `name` - Text index for search
- `description` - Text index for search
- `exporterId` - For filtering by exporter
- `createdAt: -1` - For sorting latest first
- `price` - For sorting by price
- Full text search: `name` + `description`

**Example Document:**

```json
{
  "_id": ObjectId("5f8d8d8d8d8d8d8d8d8d8d8d"),
  "name": "Premium Tea",
  "image": "https://example.com/tea.jpg",
  "price": 25.99,
  "originCountry": "Sri Lanka",
  "rating": 4.5,
  "availableQuantity": 150,
  "exporterId": "firebase-uid-12345",
  "description": "High-quality Ceylon tea",
  "category": "Beverages",
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

---

### 3. **Imports Collection**

Stores user import records with quantity tracking.

```javascript
{
  _id: ObjectId,
  productId: ObjectId,            // Reference to Products collection
  importerId: String,             // Firebase UID of importer
  importerEmail: String,          // Importer email
  quantity: Number,               // Units imported (min 1)
  productName: String,            // Snapshot of product name
  productPrice: Number,           // Snapshot of product price
  totalPrice: Number,             // quantity × productPrice
  status: String,                 // 'pending', 'confirmed', 'shipped', 'delivered'
  createdAt: Date,                // Auto-generated
  updatedAt: Date                 // Auto-generated
}
```

**Indexes:**

- `importerId` - For filtering user's imports
- `productId` - For finding who imported this product
- `createdAt: -1` - For sorting latest first
- Combined: `importerId + createdAt`

**Example Document:**

```json
{
  "_id": ObjectId("5f8e8e8e8e8e8e8e8e8e8e8e"),
  "productId": ObjectId("5f8d8d8d8d8d8d8d8d8d8d8d"),
  "importerId": "firebase-uid-67890",
  "importerEmail": "importer@example.com",
  "quantity": 10,
  "productName": "Premium Tea",
  "productPrice": 25.99,
  "totalPrice": 259.90,
  "status": "pending",
  "createdAt": "2024-01-15T11:00:00Z",
  "updatedAt": "2024-01-15T11:00:00Z"
}
```

---

## 🔗 Relationships

```
User (exporter)
    ↓ (exporterId)
Products
    ↓ (productId)
Imports ← User (importer)
    ↓ (importerId)
```

**One-to-Many Relationships:**

- One User → Many Products (as exporter)
- One Product → Many Imports
- One User → Many Imports (as importer)

---

## 💾 Database Operations

### Create Operations

```javascript
// Add Product
db.products.insertOne({
  name: "Product Name",
  price: 100,
  exporterId: "uid-123",
  availableQuantity: 50,
  // ... other fields
});

// Add Import (with quantity decrease)
db.imports.insertOne({
  productId: ObjectId(...),
  importerId: "uid-456",
  quantity: 5,
  // ... other fields
});

db.products.findByIdAndUpdate(
  ObjectId(...),
  { $inc: { availableQuantity: -5 } }
);
```

### Read Operations

```javascript
// Get latest 6 products
db.products.find().sort({ createdAt: -1 }).limit(6);

// Search by name
db.products.find({ name: { $regex: "tea", $options: "i" } });

// Get user's imports
db.imports.find({ importerId: "uid-456" });

// Get user's exports
db.products.find({ exporterId: "uid-123" });
```

### Update Operations

```javascript
// Update product quantity (with $inc)
db.products.findByIdAndUpdate(productId, {
  $inc: { availableQuantity: -quantity },
});

// Update import quantity
db.imports.findByIdAndUpdate(importId, {
  quantity: newQuantity,
  totalPrice: calculation,
});
```

### Delete Operations

```javascript
// Delete product
db.products.deleteOne({ _id: ObjectId(...) });

// Delete import (restore quantity)
db.imports.deleteOne({ _id: ObjectId(...) });
db.products.findByIdAndUpdate(
  productId,
  { $inc: { availableQuantity: +quantity } }
);
```

---

## 🔐 Data Validation

### Product Validation

- ✅ Name: Required, max 100 characters
- ✅ Price: Required, minimum 0
- ✅ Rating: Required, between 0-5
- ✅ AvailableQuantity: Required, minimum 0
- ✅ Image: Required URL
- ✅ OriginCountry: Required

### Import Validation

- ✅ Quantity: Required, positive integer, ≤ availableQuantity
- ✅ ProductId: Required, valid ObjectId
- ✅ ImporterId: Required, Firebase UID
- ✅ Cannot import more than available

### User Validation

- ✅ UID: Required, unique
- ✅ Email: Required, unique, valid format
- ✅ Role: One of ['importer', 'exporter', 'both']

---

## 📈 Indexing Strategy

**Performance Optimization:**

| Field      | Collection | Type    | Purpose               |
| ---------- | ---------- | ------- | --------------------- |
| uid        | Users      | Unique  | Fast user lookup      |
| email      | Users      | Unique  | Email verification    |
| name       | Products   | Text    | Product search        |
| exporterId | Products   | Regular | Filter by exporter    |
| createdAt  | Products   | Regular | Sort by date          |
| importerId | Imports    | Regular | Filter user's imports |
| productId  | Imports    | Regular | Find product imports  |

---

## 🚀 Query Examples

### Homepage - Latest 6 Products

```javascript
db.products.find().sort({ createdAt: -1 }).limit(6).lean();
```

### All Products with Pagination

```javascript
const page = 1,
  limit = 10;
db.products
  .find()
  .skip((page - 1) * limit)
  .limit(limit)
  .sort({ createdAt: -1 });
```

### Search Products by Name

```javascript
db.products
  .find({
    name: { $regex: "query", $options: "i" },
  })
  .limit(20);
```

### User's Imports with Product Details

```javascript
db.imports.aggregate([
  { $match: { importerId: "uid-456" } },
  {
    $lookup: {
      from: "products",
      localField: "productId",
      foreignField: "_id",
      as: "productDetails",
    },
  },
  { $sort: { createdAt: -1 } },
]);
```

### Update Available Quantity with $inc

```javascript
// Decrease by imported quantity
db.products.updateOne(
  { _id: ObjectId(...) },
  { $inc: { availableQuantity: -5 } }
);

// Increase when removing import
db.products.updateOne(
  { _id: ObjectId(...) },
  { $inc: { availableQuantity: +5 } }
);
```

---

## 📝 Migration Notes

**First Time Setup:**

```javascript
// Create unique indexes
db.users.createIndex({ uid: 1 }, { unique: true });
db.users.createIndex({ email: 1 }, { unique: true });
db.products.createIndex({ exporterId: 1 });
db.products.createIndex({ createdAt: -1 });
db.imports.createIndex({ importerId: 1 });
db.imports.createIndex({ productId: 1 });

// Create text indexes for search
db.products.createIndex({ name: "text", description: "text" });
```

---

This schema is optimized for:

- ✅ Quick user lookups
- ✅ Fast product searches
- ✅ Efficient quantity tracking with $inc
- ✅ User-specific data filtering
- ✅ Scalability with proper indexing
