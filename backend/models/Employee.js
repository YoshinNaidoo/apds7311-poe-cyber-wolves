import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
    employeeId: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        match: /^[a-zA-Z0-9]{3,}$/ // Alphanumeric, min 3 characters 
    },
    password: {
        type: String,
        required: true,
        match: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/ // At least 8 characters, 1 upper, 1 lower, 1 number, 1 special char
    },
    role: {
        type: String,
        default: 'verifier',
        enum: ['verifier', 'admin']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Add a pre-save hook to validate required fields
employeeSchema.pre('save', function(next) {
    if (!this.employeeId || !this.username || !this.password) {
        next(new Error('All fields are required'));
    }
    next();
});

export default mongoose.model('Employee', employeeSchema);
