import fs from 'fs';
import path from 'path';

// Create logs directory if it doesn't exist
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Create a writable stream to log file
const logStream = fs.createWriteStream(path.join(logsDir, 'server.log'), { flags: 'a' });

// Logger middleware
export const logger = (req, res, next) => {
  const start = Date.now();
  const { method, originalUrl, ip } = req;
  
  res.on('finish', () => {
    const { statusCode } = res;
    const responseTime = Date.now() - start;
    const timestamp = new Date().toISOString();
    
    const logMessage = `${timestamp} [${method}] ${originalUrl} ${statusCode} ${responseTime}ms - ${ip}\n`;
    
    // Log to console
    console.log(logMessage.trim());
    
    // Log to file
    logStream.write(logMessage);
  });
  
  next();
};

// Error logger
export const errorLogger = (error, req, res, next) => {
  const timestamp = new Date().toISOString();
  const errorMessage = `${timestamp} [ERROR] ${error.name}: ${error.message}\nStack: ${error.stack}\n`;
  
  console.error(errorMessage);
  logStream.write(errorMessage);
  
  next(error);
};
