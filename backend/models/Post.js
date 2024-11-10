import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true,
        min: 0,
        validate: {
            validator: Number.isFinite,
            message: "Amount must be a valid number"
        }
    },

    currency: {
        type: String,
        required: true,
        enum: ['ZAR', 'USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR'],
        default: 'ZAR'
    },

    provider: {
        type: String,
        required: true,
        enum: ['SWIFT'],
        default: 'SWIFT'
    },

    swiftCode: {
        type: String,
        required: true,
        match: [/^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/, "Please enter a valid SWIFT/BIC code"]
    },

    ibanPayee: {
        type: String,
        required: true,
        match: [/^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/, "Please enter a valid Payee IBAN"]
    },

    status: {
        type: String,
        enum: ['pending', 'verified', 'completed', 'rejected'],
        default: 'pending'
    },

    verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee'
    },

    verifiedAt: {
        type: Date
    }

}, {
    timestamps: true
});

// Add indexes for better query performance
postSchema.index({ status: 1 });
postSchema.index({ verifiedBy: 1 });
postSchema.index({ createdAt: -1 });

const Post = mongoose.model("Post", postSchema);

export default Post;