import mongoose from "mongoose"; // MongoDB Wrapper for Node.js

// Define the schema for the todo model
const TodoSchema = new mongoose.Schema({ // Create a new schema for the todo model
    content: { // Content of the todo
        type: String, // Data type is string
        required: true // Required field
    }, 
    completed: { // Completion status of the todo
        type: Boolean, // Data type is boolean
        default: false // Default value is false
    },
    createdBy: { // Created by user 
        type: mongoose.Schema.Types.ObjectId, // Data type is object id
        ref: "User" // Reference to the user model
    },
    subTodos: [ // Sub-todos of the todo 
        {
            type: mongoose.Schema.Types.ObjectId, // Data type is object id 
            ref: "SubTodo" // Reference to the sub-todo model
        }
    ]
}, { timestamps: true }); // Add timestamps to the schema

export const Todo = mongoose.model("Todo", TodoSchema); // Create a new model for the todo schema and export it