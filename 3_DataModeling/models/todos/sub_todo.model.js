// Initialize mongoose
import mongoose from "mongoose"; // MongoDB Wrapper for Node.js

// Define the schema for the sub-todo model
const subTodoSchema = new mongoose.Schema({ // Create a new schema for the sub-todo model 
    content: {
        type: String, // Data type is string
        required: true // Required field 
    }, // Content of the sub-todo
    completed: {
        type: Boolean, // Data type is boolean
        default: false // Default value is false
    }, // Completion status of the sub-todo
    createdBy:{ // Created by user
        type: mongoose.Schema.Types.ObjectId, // Data type is object id
        ref: 'User' // Reference to the user model 
    }
}, { timestamps: true }); // Add timestamps to the schema

export const SubTodo = mongoose.model('SubTodo', subTodoSchema); // Create a new model for the sub-todo schema and export it