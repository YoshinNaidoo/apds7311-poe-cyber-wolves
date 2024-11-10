import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({
                message: 'No authorization header found'
            });
        }

        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            return res.status(401).json({
                message: 'Authorization format must be: Bearer [token]'
            });
        }

        const token = parts[1];

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // Add user data to request
            req.user = decoded;
            next();
        } catch (err) {
            console.log('Token verification error:', err.name);
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({
                    message: 'Token expired',
                    isExpired: true
                });
            }
            return res.status(401).json({
                message: 'Invalid token'
            });
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(500).json({
            message: 'Authentication error'
        });
    }
};

export default authMiddleware;