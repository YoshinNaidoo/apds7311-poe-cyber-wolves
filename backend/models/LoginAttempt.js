import mongoose from 'mongoose';

const loginAttemptSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        immutable: true,
        trim: true,
        match: [/^[a-zA-Z0-9_]+$/, "Only alphanumeric characters and underscores"]
    },
    ipAddress: {
        type: String,
        required: true,
        immutable: true
    },
    successfulLogin: {
        type: Boolean,
        required: true,
        immutable: true
    },
    timestamp: {
        type: Date,
        default: Date.now,
        immutable: true
    }
});

export default mongoose.model('LoginAttempt', loginAttemptSchema);
// models/LoginAttempt.js
// import mongoose from 'mongoose';

// const loginAttemptSchema = new mongoose.Schema({
//   username: { 
//     type: String, 
//     required: true 
//   },
//   ipAddress: { 
//     type: String, 
//     required: true 
//   },
//   userAgent: {
//     type: String
//   },
//   successfulLogin: { 
//     type: Boolean, 
//     required: true 
//   },
//   timestamp: { 
//     type: Date, 
//     default: Date.now 
//   },
//   duration: {
//     type: Number
//   },
//   method: {
//     type: String
//   },
//   path: {
//     type: String
//   },
//   statusCode: {
//     type: Number
//   }
// });

// const LoginAttempt = mongoose.model('LoginAttempt', loginAttemptSchema);

// export default LoginAttempt;