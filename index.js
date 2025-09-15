import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { logger, errorLogger } from "./middleware/logger.js";
import adminRoutes from "./routes/adminRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import facultyRoutes from "./routes/facultyRoutes.js";
import { addDummyAdmin } from "./controller/adminController.js";
import compression from 'compression';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import winston from 'winston';

// Load environment variables
dotenv.config();

const app = express();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: "Too many requests from this IP, please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login attempts per windowMs
  message: {
    error: "Too many login attempts from this IP, please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting
app.use(generalLimiter);
app.use('/api/*/login', authLimiter);

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL?.split(',') || ['http://localhost:3000']
    : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173','https://erp-college-psi.vercel.app'],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};


app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Body parsing middleware with reasonable limits
app.use(compression());
app.use(xss());
app.use(mongoSanitize());
app.use(bodyParser.json({ limit: "10mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

// Request logging
app.use(logger);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use("/api/admin", adminRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/student", studentRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    message: "College ERP API",
    version: "1.0.0",
    status: "running",
    endpoints: {
      health: "/health",
      admin: "/api/admin",
      faculty: "/api/faculty",
      student: "/api/student"
    }
  });
});

// 404 handler for undefined routes
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Route not found",
    message: `The requested endpoint ${req.originalUrl} does not exist`
  });
});

// Error logging middleware
app.use(errorLogger);

// Global error handling middleware
app.use((error, req, res, next) => {
  console.error("Global error handler:", error);
  
  // Mongoose validation error
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map(err => ({
      field: err.path,
      message: err.message
    }));
    return res.status(400).json({
      error: "Validation failed",
      details: errors
    });
  }
  
  // Mongoose duplicate key error
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    return res.status(400).json({
      error: "Duplicate entry",
      message: `${field} already exists`
    });
  }
  
  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: "Invalid token"
    });
  }
  
  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: "Token expired"
    });
  }
  
  // Default server error
  res.status(500).json({
    error: "Internal server error",
    message: process.env.NODE_ENV === 'development' ? error.message : "Something went wrong"
  });
});

const PORT = process.env.PORT || 5001;
mongoose
  .connect(process.env.CONNECTION_URL)
  .then(() =>{
    console.log('MongoDB connected successfully')
    addDummyAdmin();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  
  })
  .catch((error) =>
    console.log("Mongo Error", error.message)
  )
