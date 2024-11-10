// backend/scripts/seedEmployee.js
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup to use ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Log the MongoDB URI (without sensitive info) to verify it's loaded
const redactedUri = process.env.MONGB_URI 
    ? process.env.MONGO_URI.replace(/:([^/]+)@/, ':****@')
    : 'Not found';
console.log('MongoDB URI loaded:', redactedUri);

// Employee model schema
const employeeSchema = new mongoose.Schema({
    employeeId: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'verifier' },
    createdAt: { type: Date, default: Date.now }
});

const Employee = mongoose.model('Employee', employeeSchema);

const seedEmployee = async () => {
    if (!process.env.MONGO_URI) {
        console.error('Error: MONGODB_URI not found in environment variables');
        console.log('Please ensure your .env file contains the MONGODB_URI variable');
        return;
    }

    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB successfully');

        // Check if employee already exists
        const existingEmployee = await Employee.findOne({ username: 'admin' });
        if (existingEmployee) {
            console.log('Admin employee already exists');
            return;
        }

        // Create new employee
        const hashedPassword = await bcrypt.hash('Admin@123', 10);
        
        const employee = new Employee({
            employeeId: 'EMP001',
            username: 'admin',
            password: hashedPassword,
            role: 'verifier'
        });

        await employee.save();
        console.log('Employee seeded successfully');
        console.log('Login credentials:');
        console.log('Username: admin');
        console.log('Password: Admin@123');
        
    } catch (error) {
        console.error('Seeding error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
};

// Run the seeding function
seedEmployee();