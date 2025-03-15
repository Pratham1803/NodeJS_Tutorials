// require('dotenv').config({path: './env'});
// import mongoose from "mongoose";
// import { DB_NAME } from "./constants.js";
// import express from "express";
import dotenv from 'dotenv'; // Import dotenv package
import connectDb from './db/index.js'; // Import connectDb function from db/index.js
import { app } from './app.js'; // Import app from app.js file

// Load environment variables from .env file
dotenv.config({ path: './env' });

// Connect to the database and start the server
connectDb() // Call connectDb function to connect to the database  and start the server
  .then(() => { // If the connection is successful, then start the server
    app.listen(process.env.PORT || 3000, () => { // Start the server
      console.log(`Connected to port ${process.env.PORT}`); // Log a message to the console
    });
  })
  .catch((err) => { // If the connection is unsuccessful, then log an error message to the console
    console.log( 
      `Failed to connect to port ${process.env.PORT} with error ${err.message}`
    );
  });

/*
1. Direct connect to database from index file
const app = express();
; (async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        app.on('error', (error) => {
            console.log(`Error connecting to Mongoose: ${error}`);
            throw error;

            app.listen(process.env.PORT, () => {
                console.log(`Server is running on port ${process.env.PORT}`);
            })
        })
    } catch (err) {
        console.log(`Error: ${err}`);
        throw err;
    }
}) */
