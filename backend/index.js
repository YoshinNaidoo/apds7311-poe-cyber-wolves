import './config.js';
import express from 'express';
import cors from 'cors';
import https from 'https';
import fs from 'fs';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './db/conn.js';
import authRoutes from './Routes/auth.js';
import postRoutes from './Routes/post.js';
import employeeRoutes from './Routes/employees.js';
import employeeTransactionRoutes from './Routes/employeeTransactions.js';
import loginAttemptLogger from './middleware/loginAttemptLogMiddleware.js';



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

//Connect to database
connectDB();

//Middleware
app.use(express.json());
app.use(helmet({
    contentSecurityPolicy: false // You might need to configure this based on your needs
})); 
app.use(morgan('combined'));
app.use(cors());

//Routes
app.use('/api/auth', authRoutes);
app.use('/api', postRoutes);

//
 app.use('/api/employees', employeeRoutes);
app.use('/api/employees/transactions', employeeTransactionRoutes);
// app.use('/api/employees', employeeRoutes);
app.use('/api/auth', authRoutes);


// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Something broke!',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

// Serve static files from the React/frontend build directory
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

//SSL Certificates and key
const options = {
    key: fs.readFileSync('keys/privatekey.pem'),
    cert: fs.readFileSync('keys/certificate.pem')
}

https.createServer(options, app).listen(PORT, () => {
    console.log(`HTTPS Server is running on port ${PORT}`);
});