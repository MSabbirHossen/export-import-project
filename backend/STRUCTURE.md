# 📂 Backend Folder Structure Explanation

## Directory Overview

```
backend/
├── src/                          # All source code
│   ├── config/                   # Configuration modules
│   │   └── database.js           # MongoDB connection setup
│   ├── controllers/              # Business logic handlers
│   ├── models/                   # Mongoose schemas & models
│   ├── routes/                   # API route definitions
│   ├── middlewares/              # Custom middleware functions
│   ├── utils/                    # Reusable utility functions
│   ├── app.js                    # Express app configuration
│   └── server.js                 # Server entry point
├── .env.example                  # Example environment variables
├── .gitignore                    # Git ignore rules
├── package.json                  # Project dependencies
├── README.md                     # Setup & deployment guide
└── STRUCTURE.md                  # This file
```

## 📋 File Descriptions

### Root Level Files

| File           | Purpose                                             |
| -------------- | --------------------------------------------------- |
| `package.json` | Node.js project metadata, dependencies, and scripts |
| `.env.example` | Template for environment variables (copy to `.env`) |
| `.gitignore`   | Files/folders to exclude from Git version control   |
| `README.md`    | Installation, setup, and deployment documentation   |

### `src/` Directory

#### `src/server.js` - Server Entry Point

- Application startup file
- Loads environment variables via `dotenv`
- Connects to MongoDB
- Starts Express server on specified PORT
- Implements graceful shutdown handling
- First file to run: `npm start` or `npm run dev`

#### `src/app.js` - Express Application Setup

- Express app initialization and configuration
- Security middleware (Helmet)
- CORS configuration for frontend integration
- Rate limiting setup
- Body parser middleware for JSON handling
- Basic health check routes
- 404 error handler

#### `src/config/` - Configuration Modules

**`database.js`**

- MongoDB Atlas connection logic
- Connection error handling
- Connection pooling configuration
- Exports `connectDB()` function for server startup

### Folders (Ready for Phase 2+)

#### `src/models/` - Mongoose Schemas

- **Phase 3**: Will contain MongoDB schemas
- Files: `User.js`, `Product.js`, `Import.js`
- Data validation at database level
- Model exports for use in controllers

#### `src/controllers/` - Business Logic

- **Phase 3**: Route handler logic
- Files: `productController.js`, `importController.js`, `userController.js`
- One controller per resource
- Functions handle requests and send responses

#### `src/routes/` - API Routes

- **Phase 2**: Route definitions
- Files: `productRoutes.js`, `importRoutes.js`, `userRoutes.js`
- Maps HTTP methods to controller functions
- Route middleware integration

#### `src/middlewares/` - Custom Middleware

- **Phase 2**: Firebase authentication middleware
- **Phase 5**: Validation middleware, error handlers
- Protects routes, validates requests, handles errors

#### `src/utils/` - Utility Functions

- **Phase 5+**: Reusable helper functions
- Error response formatting
- Validation helpers
- Data transformation functions

## 🔄 Request Flow

```
Client Request
    ↓
src/server.js (listens on PORT)
    ↓
src/app.js (middleware stack)
    ↓
Middleware: CORS, Rate Limit, Auth, Validation
    ↓
src/routes/* (route matching)
    ↓
src/controllers/* (business logic)
    ↓
src/models/* (database operations)
    ↓
MongoDB Atlas
    ↓
Response back to Client
```

## 📊 MVC Architecture Pattern

| Component      | Location               | Purpose                           |
| -------------- | ---------------------- | --------------------------------- |
| **Model**      | `src/models/`          | Database schema & validation      |
| **View**       | N/A (Frontend handles) | React frontend renders data       |
| **Controller** | `src/controllers/`     | Request handling & business logic |

## 🔐 Security & Best Practices

- **Helmet.js**: Security headers
- **CORS**: Controlled cross-origin access
- **Rate Limiting**: DDoS protection
- **Environment Variables**: Sensitive data protection
- **MongoDB Connection Pooling**: Efficient database usage
- **Graceful Shutdown**: Clean server termination

## 📈 Scalability Features

- **Modular Structure**: Easy to add new features
- **Separation of Concerns**: Clear responsibility divisions
- **Connection Pooling**: Optimized database connections
- **Error Handling**: Centralized error management (Phase 5)
- **Middleware Stack**: Extensible request processing

## 🚀 Development Workflow

1. **Add Routes** → `src/routes/`
2. **Create Models** → `src/models/`
3. **Implement Logic** → `src/controllers/`
4. **Add Validation** → `src/middlewares/`
5. **Export Utilities** → `src/utils/`

---

This structure follows industry standards and allows for clean, maintainable code as the project scales.
