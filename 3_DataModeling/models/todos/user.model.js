// Initiate Mongoose and create a User model
import mongoose from "mongoose"; // MongoDB Wrapper for Node.js

// Define the schema for the user model
const userSchema = new mongoose.Schema({ // Create a new schema for the user model
    username: { // Username of the user
        type: String, // Data type is string
        required: true, // Required field
        unique: true, // Unique field 
        lowercase: true // Convert to lowercase
    }, 
    email: { // Email of the user
        type: String, // Data type is string
        required: true, // Required field
        unique: true, // Unique field
        lowercase: true // Convert to lowercase
    },
    password: { // Password of the user
        type: String, // Data type is string
        required: [true, "password is required"] // Required field with custom error message
    }
}, { timestamps: true }); // Add timestamps to the schema

export const User = mongoose.model("User", userSchema); // Create a new model for the user schema and export it