import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    firstName: {
        type: String, 
        required:true,
        unique: true,
        trim: true,
        match: [/^[a-zA-Z]+$/, "Please enter a valid name"]
    },

    lastName: {
        type: String, 
        required:true,
        unique: true,
        trim: true,
        match: [/^[a-zA-Z]+$/, "Please enter a valid surname"]

    },
    username: {
        type: String, 
        required:true,
        unique: true,
        trim: true,
        match: [/^[a-zA-Z0-9_]+$/, "Only alphanumeric characters and underscores"]
    },

    idNumber: {
        type: String,
        required: true,
        match: [/^\d{6}\d{4}\d{2}\d{1}$/, "Please enter a valid South African ID number"]
    },
    

    password: {
        type: String,
        required: true,
        match: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/, 
                "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character"]
    },

    ibanPayer: {
        type: String,
        required: true,
        match: [/^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/, "Please enter a valid IBAN (International Account Number)"]
    }


});

export default mongoose.model("User", userSchema);