import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Import Export Hub API",
      version: "1.0.0",
      description:
        "Production-quality REST API for Import Export Hub MERN application",
      contact: {
        name: "API Support",
        email: "support@importexport.com",
      },
    },
    servers: [
      {
        url: "http://localhost:5000/api",
        description: "Development server",
      },
      {
        url: "https://api.importexport.com/api",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Firebase JWT token",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            uid: {
              type: "string",
              description: "Firebase UID",
            },
            email: {
              type: "string",
              format: "email",
            },
            displayName: {
              type: "string",
            },
            photoURL: {
              type: "string",
              format: "uri",
            },
            role: {
              type: "string",
              enum: ["importer", "exporter", "both"],
            },
            phone: {
              type: "string",
            },
            address: {
              type: "object",
              properties: {
                country: { type: "string" },
                city: { type: "string" },
                details: { type: "string" },
              },
            },
            isActive: {
              type: "boolean",
            },
          },
        },
        Product: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "Product ID",
            },
            name: {
              type: "string",
              maxLength: 100,
            },
            image: {
              type: "string",
              format: "uri",
            },
            price: {
              type: "number",
              minimum: 0,
            },
            originCountry: {
              type: "string",
            },
            rating: {
              type: "number",
              minimum: 0,
              maximum: 5,
            },
            availableQuantity: {
              type: "integer",
              minimum: 0,
            },
            exporterId: {
              type: "string",
              description: "Firebase UID of exporter",
            },
            category: {
              type: "string",
            },
            description: {
              type: "string",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        Import: {
          type: "object",
          properties: {
            _id: {
              type: "string",
            },
            productId: {
              type: "string",
              description: "Reference to Product",
            },
            importerId: {
              type: "string",
              description: "Firebase UID",
            },
            quantity: {
              type: "integer",
              minimum: 1,
            },
            productPrice: {
              type: "number",
              minimum: 0,
            },
            totalPrice: {
              type: "number",
              minimum: 0,
            },
            status: {
              type: "string",
              enum: ["pending", "confirmed", "shipped", "delivered"],
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            status: {
              type: "integer",
            },
            message: {
              type: "string",
            },
            data: {
              type: "object",
            },
            timestamp: {
              type: "string",
              format: "date-time",
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    "./src/routes/userRoutes.js",
    "./src/routes/productRoutes.js",
    "./src/routes/importRoutes.js",
    "./src/routes/analyticsRoutes.js",
    "./src/routes/notificationRoutes.js",
  ],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
