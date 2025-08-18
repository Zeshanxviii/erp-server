import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
  try {
    // Check if authorization header exists
    if (!req.headers.authorization) {
      return res.status(401).json({ 
        error: "Access denied. No token provided." 
      });
    }

    const authHeader = req.headers.authorization;
    
    // Check if header follows Bearer token format
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ 
        error: "Access denied. Invalid token format." 
      });
    }

    const token = authHeader.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ 
        error: "Access denied. No token provided." 
      });
    }

    // Verify JWT token
    const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.userId = decodedData?.id;
    req.userEmail = decodedData?.email;
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: "Access denied. Invalid token." 
      });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: "Access denied. Token expired." 
      });
    } else {
      console.error("Auth middleware error:", error);
      return res.status(500).json({ 
        error: "Internal server error during authentication." 
      });
    }
  }
};

export default auth;
