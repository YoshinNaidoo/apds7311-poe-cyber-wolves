import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

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
        trim: true,
        minlength: 3
    },
    password: { 
        type: String, 
        required: true,
        select: false
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
}, {
    timestamps: true
});

// Hash password before saving
employeeSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare password
employeeSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw error;
    }
};

const Employee = mongoose.model('Employee', employeeSchema);

export default Employee;