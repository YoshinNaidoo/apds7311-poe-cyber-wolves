// middleware/check-auth.js
import jwt from 'jsonwebtoken';

export const checkAuth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: 'Authentication failed: No token provided' });
        }

        // Format should be "Bearer token"
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Authentication failed: Invalid token format' });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.userData = {
            employeeId: decodedToken.employeeId,
            username: decodedToken.username,
            role: decodedToken.role
        };
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Authentication failed: Invalid token' });
    }
};