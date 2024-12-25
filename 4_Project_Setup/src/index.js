// require('dotenv').config({path: './env'});
// import mongoose from "mongoose";
// import { DB_NAME } from "./constants.js";
// import express from "express";
import dotenv from "dotenv";
import connectDb from "./db/index.js";

dotenv.config({ path: './env' })

connectDb()
    .then(() => {
        app.listen(process.env.PORT || 3000, () => {
            console.log(`Connecting to port ${process.env.PORT}`);
        })
    })
    .catch((err) => {
        console.log(`Failed to connect to port ${process.env.PORT}`);
    })

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