// middleware/loginAttemptLogMiddleware.js
import LoginAttempt from '../models/loginAttempt.js';

const loginAttemptLogger = async (req, res, next) => {
  const originalJson = res.json;
  const startTime = Date.now();

  res.json = function(data) {
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    const logData = {
      username: req.body.username,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.headers['user-agent'],
      successfulLogin: !data.message || !data.message.includes('failed'),
      timestamp: new Date(),
      duration,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode
    };

    // Async log creation without blocking response
    LoginAttempt.create(logData)
      .catch(err => {
        console.error('Error logging login attempt:', err);
        // Log to your error tracking system
      });

    // Call original json method
    originalJson.call(this, data);
  };

  next();
};

export default loginAttemptLogger;